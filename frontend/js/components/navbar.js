// js/components/navbar.js
import { cartStore } from '../stores/cartStore.js';
import { wishlistStore } from '../stores/wishlistStore.js';
import { authStore } from '../stores/authStore.js';

export function initGlobalNavbar() {
  function updateBadges() {
    // 1. Cart badge & total
    const cartCount = cartStore.getCount();
    const cartTotal = cartStore.getSubtotal();
    
    document.querySelectorAll('.cart-count, #cart-count, #navCount, .nav-cart-count').forEach(el => {
      el.textContent = cartCount;
      if (cartCount > 0) {
        el.removeAttribute('hidden');
        el.style.display = 'inline-flex';
      } else {
        el.setAttribute('hidden', '');
      }
    });

    document.querySelectorAll('.cart-badge-box, .cart-pill-badge, .nav-cart-total').forEach(el => {
      if (el.classList.contains('cart-badge-box') || el.classList.contains('cart-pill-badge')) {
        el.innerHTML = `🛒 Cart (${cartCount} items) <br><strong>$${cartTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>`;
      }
    });

    // 2. Wishlist badge
    const wishCount = wishlistStore.getCount();
    document.querySelectorAll('.wishlist-count, #wishlist-count, #nav-wishlist-count').forEach(el => {
      el.textContent = wishCount;
      if (wishCount > 0) {
        el.removeAttribute('hidden');
        el.style.display = 'inline-flex';
      }
    });

    // 3. User session badge
    const user = authStore.getCurrentUser();
    document.querySelectorAll('.user-avatar-badge, #account-btn, .user-avatar').forEach(el => {
      if (user) {
        if (el.tagName === 'DIV' || el.tagName === 'SPAN') {
          el.title = `${user.name} (${user.email})`;
          if (el.classList.contains('user-avatar-badge')) {
            el.innerHTML = `<span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#22c55e; margin-right:6px;"></span>${user.name.split(' ')[0]}`;
          }
        }
      }
    });
  }

  // Update on events
  window.addEventListener('cart-updated', updateBadges);
  window.addEventListener('wishlist-updated', updateBadges);
  window.addEventListener('auth-updated', updateBadges);
  window.addEventListener('storage', updateBadges);

  // Initial update
  updateBadges();

  // Bind universal search bars
  const searchInputs = document.querySelectorAll('#search-input, #site-search, input[name="query"]');
  searchInputs.forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = input.value.trim();
        if (q && !window.location.pathname.endsWith('products.html')) {
          window.location.href = `products.html?search=${encodeURIComponent(q)}`;
        }
      }
    });
  });

  // Account button click
  const accountBtn = document.getElementById('account-btn');
  if (accountBtn) {
    accountBtn.addEventListener('click', () => {
      window.location.href = 'auth.html';
    });
  }
}

// Auto-run if loaded in browser
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobalNavbar);
  } else {
    initGlobalNavbar();
  }
}
