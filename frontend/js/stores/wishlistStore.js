// js/stores/wishlistStore.js
import { seedProducts } from '../data/seedProducts.js';

const STORAGE_KEY = 'laptop_store_wishlist';

function readWishlist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function saveWishlist(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('wishlist-updated', { detail: { items, count: items.length } }));
  } catch (e) {
    console.error('Error saving wishlist:', e);
  }
}

function findProductInfo(productId) {
  try {
    const raw = localStorage.getItem('laptop_store_products') || localStorage.getItem('products');
    if (raw) {
      const parsed = JSON.parse(raw);
      const items = Array.isArray(parsed) ? parsed : (parsed.items || []);
      const found = items.find(p => String(p.id) === String(productId));
      if (found) return found;
    }
  } catch (e) {}

  const fromSeed = seedProducts.find(p => String(p.id) === String(productId));
  if (fromSeed) return fromSeed;
  return null;
}

export const wishlistStore = {
  getAll() {
    return readWishlist();
  },

  getCount() {
    return readWishlist().length;
  },

  has(productId) {
    const items = readWishlist();
    return items.some(p => String(p.id) === String(productId));
  },

  isInWishlist(productId) {
    return this.has(productId);
  },

  add(productId, customProduct = null) {
    const items = readWishlist();
    if (this.has(productId)) {
      return { success: true, status: 'already_in_wishlist' };
    }

    const info = customProduct || findProductInfo(productId) || {
      id: Number(productId),
      name: `Laptop #${productId}`,
      price: 1999,
      image: 'assets/images/products/zenith-pro-16.jpeg'
    };

    items.push({
      id: Number(info.id || productId),
      name: info.name,
      price: Number(info.price || 0),
      old_price: info.old_price ? Number(info.old_price) : null,
      image: info.image || 'assets/images/products/zenith-pro-16.jpeg',
      description: info.description || '',
      specs: info.specs || {},
      category_id: info.category_id || 1,
      stock: info.stock !== undefined ? info.stock : 10,
      added_at: new Date().toISOString()
    });

    saveWishlist(items);
    return { success: true, status: 'added' };
  },

  remove(productId) {
    const items = readWishlist().filter(p => String(p.id) !== String(productId));
    saveWishlist(items);
    return { success: true, status: 'removed' };
  },

  toggle(productId, customProduct = null) {
    if (this.has(productId)) {
      this.remove(productId);
      return { success: true, status: 'removed' };
    } else {
      this.add(productId, customProduct);
      return { success: true, status: 'added' };
    }
  },

  clear() {
    saveWishlist([]);
    return { success: true, status: 'cleared' };
  }
};

if (typeof window !== 'undefined') {
  window.wishlistStore = wishlistStore;
}
