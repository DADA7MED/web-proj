// js/pages/cart.js
import {
  getCartItems,
  saveCart,
  loadCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  getCartCount,
  getSubtotal,
  applyPromo,
  getDiscountTotal,
  getShipping,
  getTax,
  getCartTotal,
  FREE_SHIPPING_MIN,
  PROMO_CODE
} from '../stores/cartStore.js';
import { initGlobalNavbar } from '../components/navbar.js';

const PRODUCTS_PAGE = "products.html";

function money(number) {
  return "$" + Number(number || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function showMessage(text, isError) {
  const box = document.getElementById("msg");
  if (!box) return;

  box.textContent = text;
  box.hidden = false;
  box.className = isError ? "msg error" : "msg";

  setTimeout(function () {
    box.hidden = true;
  }, 2500);
}

function increase(id) {
  const ok = increaseQuantity(id);
  if (!ok) {
    showMessage("Maximum available stock reached", true);
  }
  render();
}

function decrease(id) {
  decreaseQuantity(id);
  render();
}

function remove(id) {
  removeFromCart(id);
  showMessage("Product removed from cart", false);
  render();
}

function continueShopping() {
  window.location.href = PRODUCTS_PAGE;
}

function goToCheckout(method) {
  const items = getCartItems();
  if (items.length === 0) {
    showMessage("Your cart is empty. Add products first.", true);
    return;
  }
  window.location.href = "checkout.html?method=" + (method || 'card');
}

function usePromo() {
  const input = document.getElementById("promoInput");
  const code = input ? input.value : "";
  const ok = applyPromo(code);

  if (ok) {
    showMessage("Promo code applied: $150 Discount Unlocked!", false);
  } else {
    showMessage("Invalid promo code. Hint: use VIP-LAUNCH-EARLY", true);
  }

  render();
}

function renderItems() {
  const items = getCartItems();
  let html = "";

  for (let i = 0; i < items.length; i++) {
    const p = items[i];
    const itemTotal = (p.price || 0) * (p.quantity || 1);
    const oldPriceTotal = (p.oldPrice || p.price || 0) * (p.quantity || 1);
    const imgSrc = p.image || "assets/hero-laptop.jpg";

    html = html + `
      <article class="card">
        <a href="details.html?id=${p.id}"><img src="${imgSrc}" alt="${p.name}" onerror="this.src='assets/hero-laptop.jpg'"></a>

        <div class="info">
          <div class="name-row">
            <div>
              <h3><a href="details.html?id=${p.id}" style="color:inherit; text-decoration:none;">${p.name}</a></h3>
              <p>${p.description || (p.specs ? Object.values(p.specs).join(' · ') : 'Configured Workstation')}</p>
            </div>

            <div class="price">
              <b>${money(itemTotal)}</b>
              ${oldPriceTotal > itemTotal ? `<s>${money(oldPriceTotal)}</s>` : ''}
            </div>
          </div>

          <div class="actions">
            <div class="qty">
              <button type="button" onclick="decrease('${p.id}')">−</button>
              <span>${p.quantity}</span>
              <button type="button" onclick="increase('${p.id}')">+</button>
            </div>

            <button type="button" class="remove" onclick="remove('${p.id}')">🗑 Remove</button>
          </div>
        </div>
      </article>`;
  }

  const itemsContainer = document.getElementById("items");
  if (itemsContainer) itemsContainer.innerHTML = html;
}

function renderShippingBar() {
  const subtotal = getSubtotal();
  const min = typeof FREE_SHIPPING_MIN !== 'undefined' ? FREE_SHIPPING_MIN : 1000;
  let percent = (subtotal / min) * 100;
  if (percent > 100) percent = 100;

  const barFill = document.getElementById("barFill");
  const shipNote = document.getElementById("shipNote");

  if (barFill) barFill.style.width = percent + "%";

  if (shipNote) {
    if (percent >= 100) {
      shipNote.innerHTML = "<b>FREE PRIORITY SHIPPING UNLOCKED!</b><br>Complimentary 24-Hour Courier Dispatch";
    } else {
      shipNote.innerHTML = "<b>Add " + money(min - subtotal) + " more</b><br>to unlock complimentary priority shipping";
    }
  }
}

function renderSummary(count) {
  const discount = getDiscountTotal();
  const shipping = getShipping();

  let itemWord = count === 1 ? "Item" : "Items";
  let unitWord = count === 1 ? "unit" : "units";

  const countEl = document.getElementById("count");
  if (countEl) countEl.textContent = "(" + count + " " + itemWord + ")";

  const unitsText = document.getElementById("unitsText");
  if (unitsText) unitsText.textContent = "Subtotal (" + count + " " + unitWord + ")";

  const subtotalEl = document.getElementById("subtotal");
  if (subtotalEl) subtotalEl.textContent = money(getSubtotal());

  const taxEl = document.getElementById("tax");
  if (taxEl) taxEl.textContent = money(getTax());

  const totalEl = document.getElementById("total");
  if (totalEl) totalEl.textContent = money(getCartTotal());

  const discountEl = document.getElementById("discount");
  if (discountEl) {
    discountEl.textContent = discount > 0 ? "-" + money(discount) : "$0.00";
  }

  const shippingEl = document.getElementById("shipping");
  if (shippingEl) {
    shippingEl.textContent = shipping === 0 ? "FREE" : money(shipping);
  }
}

function render() {
  const count = getCartCount();
  const navCount = document.getElementById("navCount");
  if (navCount) navCount.textContent = count;

  const cartPage = document.getElementById("cartPage");
  const empty = document.getElementById("empty");

  if (count === 0) {
    if (cartPage) cartPage.hidden = true;
    if (empty) empty.hidden = false;
    return;
  }

  if (cartPage) cartPage.hidden = false;
  if (empty) empty.hidden = true;

  renderSummary(count);
  renderShippingBar();
  renderItems();
}

window.increase = increase;
window.decrease = decrease;
window.remove = remove;
window.continueShopping = continueShopping;
window.goToCheckout = goToCheckout;
window.usePromo = usePromo;
window.render = render;

if (typeof loadCart === 'function') {
  loadCart().then(() => {
    initGlobalNavbar();
    render();
  });
} else {
  document.addEventListener('DOMContentLoaded', () => {
    initGlobalNavbar();
    render();
  });
}
