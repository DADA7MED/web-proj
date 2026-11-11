// js/components/navbar.js — A Lap Global Navigation & Theme Switcher
import { cartStore } from '../stores/cartStore.js';
import { wishlistStore } from '../stores/wishlistStore.js';
import { authStore } from '../stores/authStore.js';

// Apply saved theme immediately on script execution to prevent flicker
(function applyInitialTheme() {
  if (typeof window === 'undefined') return;
  const saved = localStorage.getItem('alap_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  if (document.body) {
    document.body.classList.toggle('theme-dark', saved === 'dark');
    document.body.classList.toggle('theme-light', saved === 'light');
  }
})();

export function initGlobalNavbar() {
  // Theme Manager
  function getTheme() {
    return localStorage.getItem('alap_theme') || 'dark';
  }

  function applyTheme(theme) {
    localStorage.setItem('alap_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    if (document.body) {
      document.body.classList.toggle('theme-dark', theme === 'dark');
      document.body.classList.toggle('theme-light', theme === 'light');
    }
    updateThemeButtons(theme);
    window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme } }));
  }

  function toggleTheme() {
    const current = getTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  }

  function updateThemeButtons(theme) {
    // 1. Header toggle buttons
    document.querySelectorAll('.theme-toggle-btn, #theme-toggle-btn').forEach(btn => {
      if (theme === 'dark') {
        btn.innerHTML = `☀️ <span class="theme-label">نهار (أبيض)</span>`;
        btn.setAttribute('title', 'تبديل إلى الوضع النهاري الأبيض (#ffffff)');
      } else {
        btn.innerHTML = `🌙 <span class="theme-label">ليل (أسود 000)</span>`;
        btn.setAttribute('title', 'تبديل إلى الوضع المظلم الأسود (#000000)');
      }
    });

    // 2. Floating floating-theme-btn
    document.querySelectorAll('.floating-theme-btn, #floating-theme-toggle').forEach(btn => {
      if (theme === 'dark') {
        btn.innerHTML = `<span style="font-size:16px;">☀️</span> <span>الوضع النهاري (أبيض)</span>`;
        btn.setAttribute('title', 'تبديل إلى الوضع النهاري الأبيض (#ffffff)');
      } else {
        btn.innerHTML = `<span style="font-size:16px;">🌙</span> <span>الوضع المظلم (أسود #000)</span>`;
        btn.setAttribute('title', 'تبديل إلى الوضع المظلم الأسود (#000000)');
      }
    });
  }

  // Ensure header theme button is present in navigation
  function ensureHeaderThemeButton() {
    const containers = document.querySelectorAll('.header-actions, .nav-actions, .nav-right, .store-header .container, .header-inner, .site-top-header .header-right-actions');
    containers.forEach(container => {
      if (!container.querySelector('.theme-toggle-btn')) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'theme-toggle-btn';
        btn.id = 'theme-toggle-btn';
        btn.setAttribute('aria-label', 'Toggle theme');
        btn.addEventListener('click', toggleTheme);
        container.insertBefore(btn, container.firstChild);
      }
    });
  }

  // Ensure floating sticky theme button is present on the page
  function ensureFloatingThemeWidget() {
    if (!document.getElementById('alap-floating-theme')) {
      const widget = document.createElement('div');
      widget.id = 'alap-floating-theme';
      widget.className = 'alap-floating-theme';
      widget.innerHTML = `
        <button type="button" class="floating-theme-btn" id="floating-theme-toggle" aria-label="تبديل الثيم">
          <span style="font-size:16px;">☀️</span>
          <span>الوضع النهاري (أبيض)</span>
        </button>
      `;
      document.body.appendChild(widget);
      const floatBtn = widget.querySelector('#floating-theme-toggle');
      if (floatBtn) {
        floatBtn.addEventListener('click', toggleTheme);
      }
    }
  }

  // 1. Cart badge & total update
  function updateBadges() {
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
            el.innerHTML = `<span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#00e5cf; margin-right:6px;"></span>${user.name.split(' ')[0]}`;
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

  // Initialize
  ensureHeaderThemeButton();
  ensureFloatingThemeWidget();
  updateThemeButtons(getTheme());
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
