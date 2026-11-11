// js/pages/checkout.js
import { cartStore } from '../stores/cartStore.js';
import { ordersStore } from '../stores/ordersStore.js';
import { authStore } from '../stores/authStore.js';

document.addEventListener('DOMContentLoaded', () => {
  const items = cartStore.getItems();
  if (items.length === 0) {
    alert('Your cart is empty. Please add laptops or accessories to proceed.');
    window.location.href = 'cart.html';
    return;
  }

  // Auto-fill logged-in user profile if available
  const currentUser = authStore.getCurrentUser();
  if (currentUser) {
    const emailInput = document.getElementById('email');
    const nameInput = document.getElementById('fullName');
    const phoneInput = document.getElementById('phone');
    const addressInput = document.getElementById('address');
    const cityInput = document.getElementById('city');
    const zipInput = document.getElementById('postalCode');
    const countryInput = document.getElementById('country');

    if (emailInput && currentUser.email) emailInput.value = currentUser.email;
    if (nameInput && currentUser.name) nameInput.value = currentUser.name;
    if (phoneInput && currentUser.phone) phoneInput.value = currentUser.phone;
    if (addressInput && currentUser.address) addressInput.value = currentUser.address;
    if (cityInput && currentUser.city) cityInput.value = currentUser.city;
    if (zipInput && currentUser.postalCode) zipInput.value = currentUser.postalCode;
    if (countryInput && currentUser.country) countryInput.value = currentUser.country;
  }

  // Check URL query for express method (?method=applepay, etc.)
  const urlParams = new URLSearchParams(window.location.search);
  const methodParam = urlParams.get('method');
  if (methodParam) {
    const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    paymentRadios.forEach(radio => {
      if (radio.value.toLowerCase().includes(methodParam.toLowerCase())) {
        radio.checked = true;
        updateMethodStyles('paymentMethod');
      }
    });
  }

  // Render items in summary
  const summaryContainer = document.getElementById('summary-items');
  if (summaryContainer) {
    summaryContainer.innerHTML = items.map(item => `
      <div class="summary-item">
        <img src="${item.image || 'assets/hero-laptop.jpg'}" alt="${item.name}" onerror="this.src='assets/hero-laptop.jpg'">
        <div style="flex: 1; min-width: 0;">
          <h4 style="font-size: 13px; font-weight: 600; margin: 0 0 4px; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</h4>
          <span style="font-size: 12px; color: #94a3b8;">Qty: ${item.quantity} × $${Number(item.price || 0).toLocaleString('en-US')}</span>
        </div>
        <strong style="font-size: 13px; color: #fff;">$${(Number(item.price || 0) * (item.quantity || 1)).toLocaleString('en-US')}</strong>
      </div>
    `).join('');
  }

  function getSelectedShippingMethod() {
    return document.querySelector('input[name="shippingMethod"]:checked')?.value || 'standard';
  }

  function getSelectedPaymentMethod() {
    return document.querySelector('input[name="paymentMethod"]:checked')?.value || 'Credit Card';
  }

  function calculateTotals() {
    const shippingMethod = getSelectedShippingMethod();
    const subtotal = cartStore.getSubtotal();
    const discount = cartStore.getDiscountTotal();
    const shipping = cartStore.getShipping(shippingMethod);
    const tax = cartStore.getTax();
    const total = cartStore.getTotal(shippingMethod);

    const format = (n) => `$${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    document.getElementById('subtotal-val').textContent = format(subtotal);
    document.getElementById('discount-val').textContent = discount > 0 ? `-${format(discount)}` : '$0.00';
    document.getElementById('shipping-val').textContent = shipping === 0 ? 'FREE' : format(shipping);
    document.getElementById('tax-val').textContent = format(tax);
    document.getElementById('total-val').textContent = format(total);
    document.getElementById('btn-total').textContent = format(total);

    const standardPriceLabel = document.getElementById('shipping-method-price');
    if (standardPriceLabel) {
      standardPriceLabel.textContent = subtotal >= cartStore.FREE_SHIPPING_MIN ? 'FREE' : '$45.00';
    }

    return { subtotal, discount, shipping, tax, total };
  }

  function updateMethodStyles(name) {
    document.querySelectorAll(`input[name="${name}"]`).forEach(input => {
      const parent = input.closest('.method-option');
      if (parent) {
        parent.classList.toggle('selected', input.checked);
      }
    });

    if (name === 'paymentMethod') {
      const cardFields = document.getElementById('card-fields');
      const isCard = document.querySelector('input[name="paymentMethod"]:checked')?.value === 'Credit Card';
      if (cardFields) cardFields.style.display = isCard ? 'grid' : 'none';
    }
  }

  document.querySelectorAll('input[name="shippingMethod"]').forEach(input => {
    input.addEventListener('change', () => {
      updateMethodStyles('shippingMethod');
      calculateTotals();
    });
  });

  document.querySelectorAll('input[name="paymentMethod"]').forEach(input => {
    input.addEventListener('change', () => {
      updateMethodStyles('paymentMethod');
    });
  });

  // Promo code in checkout
  const applyPromoBtn = document.getElementById('apply-promo-btn');
  const promoInput = document.getElementById('checkout-promo');
  const promoStatus = document.getElementById('promo-status');

  if (applyPromoBtn && promoInput) {
    applyPromoBtn.addEventListener('click', () => {
      const code = promoInput.value.trim();
      const ok = cartStore.applyPromo(code);
      if (ok) {
        promoStatus.textContent = '✓ $150 VIP Discount Applied!';
        promoStatus.style.color = '#22c55e';
      } else {
        promoStatus.textContent = 'Invalid promo code. Use VIP-LAUNCH-EARLY';
        promoStatus.style.color = '#ef4444';
      }
      calculateTotals();
    });
  }

  // Place Order submission
  const checkoutForm = document.getElementById('checkout-form');
  const submitBtn = document.getElementById('submit-btn');

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('fullName').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const address = document.getElementById('address').value.trim();
      const city = document.getElementById('city').value.trim();
      const postalCode = document.getElementById('postalCode').value.trim();
      const country = document.getElementById('country').value;
      const paymentMethod = getSelectedPaymentMethod();
      const shippingMethod = getSelectedShippingMethod();

      if (!fullName || !email || !address || !city || !postalCode) {
        alert('Please fill in all required shipping fields.');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing & Allocating Hardware...';

      const totals = calculateTotals();

      const orderData = {
        customerName: fullName,
        email: email,
        phone: phone,
        shippingAddress: `${address}, ${city}, ${postalCode}, ${country}`,
        city: city,
        postalCode: postalCode,
        country: country,
        paymentMethod: paymentMethod,
        shippingMethod: shippingMethod,
        subtotal: totals.subtotal,
        discount: totals.discount,
        shipping: totals.shipping,
        tax: totals.tax,
        total: totals.total,
        items: items
      };

      setTimeout(() => {
        try {
          const newOrder = ordersStore.createOrder(orderData);
          cartStore.clearCart();
          window.location.href = `orders.html?order_id=${newOrder.id}&placed=true`;
        } catch (err) {
          alert('Could not place order: ' + err.message);
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Authorize & Place Order';
        }
      }, 900);
    });
  }

  updateMethodStyles('shippingMethod');
  updateMethodStyles('paymentMethod');
  calculateTotals();
});
