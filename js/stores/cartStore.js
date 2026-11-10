// js/stores/cartStore.js
import { seedProducts } from '../data/seedProducts.js';

const FREE_SHIPPING_MIN = 1000;
const SHIPPING_COST = 45;
const TAX_RATE = 0.0825;
const PROMO_CODE = "VIP-LAUNCH-EARLY";
const PROMO_DISCOUNT = 150;
const STORAGE_KEY = "cart";

export function getCartItems() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === null) {
    return [];
  }
  try {
    return JSON.parse(saved);
  } catch (error) {
    return [];
  }
}

export function saveCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent('cart-updated', { detail: { items, count: getCartCount() } }));
}

export function loadCart() {
  const items = getCartItems();
  if (items.length > 0) {
    return Promise.resolve(items);
  }
  // Try fetching cart.json or initialize empty
  return fetch("Ahmed hassan/data/cart.json")
    .then(res => res.json())
    .then(seed => {
      saveCart(seed);
      return seed;
    })
    .catch(() => {
      return [];
    });
}

function findProductInfo(productId) {
  // 1. check localStorage products
  try {
    const raw = localStorage.getItem('laptop_store_products') || localStorage.getItem('products');
    if (raw) {
      const parsed = JSON.parse(raw);
      const items = Array.isArray(parsed) ? parsed : (parsed.items || []);
      const found = items.find(p => String(p.id) === String(productId));
      if (found) return found;
    }
  } catch (e) {}

  // 2. fallback to seedProducts
  const fromSeed = seedProducts.find(p => String(p.id) === String(productId));
  if (fromSeed) return fromSeed;

  return null;
}

export function findCartItem(items, productId) {
  return items.find(i => String(i.id) === String(productId)) || null;
}

export function getStock(product) {
  if (product && product.stock !== undefined && product.stock !== null) {
    return Number(product.stock);
  }
  return 99;
}

export function addToCart(productId, quantity = 1, customData = {}) {
  quantity = Math.floor(Number(quantity)) || 1;
  const product = findProductInfo(productId) || customData;

  if (!product || quantity < 1) {
    return false;
  }

  const items = getCartItems();
  const existing = findCartItem(items, productId);
  const currentQty = existing ? existing.quantity : 0;
  const maxStock = getStock(product);

  if (currentQty + quantity > maxStock) {
    return false;
  }

  if (existing) {
    existing.quantity += quantity;
    if (customData.specs) existing.specs = customData.specs;
  } else {
    items.push({
      id: product.id,
      name: product.name || 'High Performance Laptop',
      description: product.description || '',
      price: Number(customData.price || product.price || 0),
      oldPrice: Number(product.old_price || product.oldPrice || product.price || 0),
      image: customData.image || product.image || 'assets/images/products/zenith-pro-16.jpeg',
      stock: maxStock,
      quantity: quantity,
      specs: customData.specs || product.specs || {}
    });
  }

  saveCart(items);
  return true;
}

export function removeFromCart(productId) {
  const items = getCartItems().filter(i => String(i.id) !== String(productId));
  saveCart(items);
}

export function updateQuantity(productId, quantity) {
  const items = getCartItems();
  const item = findCartItem(items, productId);
  quantity = Math.floor(Number(quantity));

  if (!item || quantity < 1 || quantity > getStock(item)) {
    return false;
  }

  item.quantity = quantity;
  saveCart(items);
  return true;
}

export function increaseQuantity(productId) {
  const item = findCartItem(getCartItems(), productId);
  if (!item) return false;
  return updateQuantity(productId, item.quantity + 1);
}

export function decreaseQuantity(productId) {
  const item = findCartItem(getCartItems(), productId);
  if (!item) return false;
  if (item.quantity <= 1) {
    removeFromCart(productId);
    return true;
  }
  return updateQuantity(productId, item.quantity - 1);
}

export function clearCart() {
  localStorage.removeItem("promo");
  saveCart([]);
}

export function getCartCount() {
  const items = getCartItems();
  return items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
}

export function getSubtotal() {
  const items = getCartItems();
  return items.reduce((sum, item) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 1)), 0);
}

export function applyPromo(code) {
  if (String(code).trim().toUpperCase() !== PROMO_CODE) {
    return false;
  }
  localStorage.setItem("promo", "yes");
  window.dispatchEvent(new CustomEvent('cart-updated'));
  return true;
}

export function removePromo() {
  localStorage.removeItem("promo");
  window.dispatchEvent(new CustomEvent('cart-updated'));
}

export function getDiscountTotal() {
  if (localStorage.getItem("promo") === null) {
    return 0;
  }
  return Math.min(PROMO_DISCOUNT, getSubtotal());
}

export function getShipping(shippingMethod = 'standard') {
  const subtotal = getSubtotal();
  if (subtotal === 0) return 0;
  if (shippingMethod === 'express') return 45;
  if (shippingMethod === 'priority') return 75;
  if (subtotal >= FREE_SHIPPING_MIN) return 0;
  return SHIPPING_COST;
}

export function getTax() {
  const taxable = Math.max(0, getSubtotal() - getDiscountTotal());
  return Math.round(taxable * TAX_RATE * 100) / 100;
}

export function getCartTotal(shippingMethod = 'standard') {
  const total = Math.max(0, getSubtotal() - getDiscountTotal()) + getShipping(shippingMethod) + getTax();
  return Math.round(total * 100) / 100;
}

export const cartStore = {
  getItems: getCartItems,
  saveCart,
  loadCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  getCount: getCartCount,
  getSubtotal,
  applyPromo,
  removePromo,
  getDiscountTotal,
  getShipping,
  getTax,
  getTotal: getCartTotal,
  FREE_SHIPPING_MIN,
  PROMO_CODE,
  PROMO_DISCOUNT
};

// Also attach to window for classic non-module scripts
if (typeof window !== 'undefined') {
  window.cartStore = cartStore;
  window.getCartItems = getCartItems;
  window.addToCart = addToCart;
  window.removeFromCart = removeFromCart;
  window.updateQuantity = updateQuantity;
  window.increaseQuantity = increaseQuantity;
  window.decreaseQuantity = decreaseQuantity;
  window.clearCart = clearCart;
  window.getCartCount = getCartCount;
  window.getSubtotal = getSubtotal;
  window.applyPromo = applyPromo;
  window.getDiscountTotal = getDiscountTotal;
  window.getShipping = getShipping;
  window.getTax = getTax;
  window.getCartTotal = getCartTotal;
}
