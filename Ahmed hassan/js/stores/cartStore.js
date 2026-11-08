const FREE_SHIPPING_MIN = 1000;
const SHIPPING_COST = 45;
const TAX_RATE = 0.0825;
const PROMO_CODE = "VIP-LAUNCH-EARLY";
const PROMO_DISCOUNT = 150;


function getCartItems() {
  const saved = localStorage.getItem("cart");

  if (saved === null) {
    return [];
  }

  try {
    return JSON.parse(saved);
  } catch (error) {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem("cart", JSON.stringify(items));
}

function loadCart() {
  if (localStorage.getItem("cart") !== null) {
    return Promise.resolve();
  }

  return fetch("data/cart.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (items) {
      saveCart(items);
    });
}


function getProducts() {
  const saved = localStorage.getItem("products");

  if (saved === null) {
    return [];
  }

  return JSON.parse(saved);
}

function setProducts(newProducts) {
  const products = getProducts();

  for (let i = 0; i < newProducts.length; i++) {
    let found = false;

    for (let j = 0; j < products.length; j++) {
      if (String(products[j].id) === String(newProducts[i].id)) {
        products[j] = newProducts[i];
        found = true;
      }
    }

    if (!found) {
      products.push(newProducts[i]);
    }
  }

  localStorage.setItem("products", JSON.stringify(products));
}

function findProduct(productId) {
  const products = getProducts();

  for (let i = 0; i < products.length; i++) {
    if (String(products[i].id) === String(productId)) {
      return products[i];
    }
  }

  return null;
}

function findCartItem(items, productId) {
  for (let i = 0; i < items.length; i++) {
    if (String(items[i].id) === String(productId)) {
      return items[i];
    }
  }

  return null;
}

function getStock(product) {
  if (product.stock === undefined || product.stock === null) {
    return 99;
  }

  return product.stock;
}


function addToCart(productId, quantity) {
  if (quantity === undefined) {
    quantity = 1;
  }

  quantity = Math.floor(Number(quantity));

  const product = findProduct(productId);

  if (product === null || quantity < 1 || !(product.price >= 0)) {
    return false;
  }

  const items = getCartItems();
  const item = findCartItem(items, productId);

  let newQuantity = quantity;

  if (item !== null) {
    newQuantity = item.quantity + quantity;
  }

  if (newQuantity > getStock(product)) {
    return false;
  }

  if (item !== null) {
    item.quantity = newQuantity;
    item.stock = product.stock;
  } else {
    items.push({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      oldPrice: product.oldPrice || product.price,
      image: product.image,
      stock: product.stock,
      quantity: quantity
    });
  }

  saveCart(items);
  return true;
}

function removeFromCart(productId) {
  const items = getCartItems();
  const newItems = [];

  for (let i = 0; i < items.length; i++) {
    if (String(items[i].id) !== String(productId)) {
      newItems.push(items[i]);
    }
  }

  saveCart(newItems);
}

function updateQuantity(productId, quantity) {
  const items = getCartItems();
  const item = findCartItem(items, productId);

  quantity = Math.floor(Number(quantity));

  if (item === null || quantity < 1 || quantity > getStock(item)) {
    return false;
  }

  item.quantity = quantity;
  saveCart(items);
  return true;
}

function increaseQuantity(productId) {
  const item = findCartItem(getCartItems(), productId);

  if (item === null) {
    return false;
  }

  return updateQuantity(productId, item.quantity + 1);
}

function decreaseQuantity(productId) {
  const item = findCartItem(getCartItems(), productId);

  if (item === null) {
    return false;
  }

  return updateQuantity(productId, item.quantity - 1);
}

function clearCart() {
  localStorage.removeItem("promo");
  saveCart([]);
}


function getCartCount() {
  const items = getCartItems();
  let count = 0;

  for (let i = 0; i < items.length; i++) {
    count = count + items[i].quantity;
  }

  return count;
}

function getSubtotal() {
  const items = getCartItems();
  let subtotal = 0;

  for (let i = 0; i < items.length; i++) {
    subtotal = subtotal + items[i].price * items[i].quantity;
  }

  return subtotal;
}


function applyPromo(code) {
  if (code.trim().toUpperCase() !== PROMO_CODE) {
    return false;
  }

  localStorage.setItem("promo", "yes");
  return true;
}

function getDiscountTotal() {
  if (localStorage.getItem("promo") === null) {
    return 0;
  }

  return Math.min(PROMO_DISCOUNT, getSubtotal());
}

function getShipping() {
  const subtotal = getSubtotal();

  if (subtotal === 0 || subtotal >= FREE_SHIPPING_MIN) {
    return 0;
  }

  return SHIPPING_COST;
}

function getTax() {
  const taxable = getSubtotal() - getDiscountTotal();
  return Math.round(taxable * TAX_RATE * 100) / 100;
}

function getCartTotal() {
  const total = getSubtotal() - getDiscountTotal() + getShipping() + getTax();
  return Math.round(total * 100) / 100;
}
