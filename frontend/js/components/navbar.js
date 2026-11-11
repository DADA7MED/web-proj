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
    const next = getTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  }

  function updateThemeButtons(theme) {
    document.querySelectorAll('.theme-toggle-btn, #theme-toggle-btn').forEach(btn => {
      if (theme === 'dark') {
        btn.innerHTML = `🌙 <span class="theme-label">Dark (#000)</span>`;
        btn.setAttribute('title', 'Switch to Light Mode (#fff)');
      } else {
        btn.innerHTML = `☀️ <span class="theme-label">Light (#fff)</span>`;
        btn.setAttribute('title', 'Switch to Dark Mode (#000)');
      }
    });
  }

  // Inject Theme Button into navigation bar if missing
  function ensureThemeButton() {
    const containers = document.querySelectorAll('.nav-actions, .header-actions, .actions, .nav-right, .store-header .container, .nav-container');
    containers.forEach(container => {
      if (!container.querySelector('.theme-toggle-btn')) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'theme-toggle-btn';
        btn.setAttribute('aria-label', 'Toggle theme between dark (#000000) and light (#ffffff)');
        btn.addEventListener('click', toggleTheme);
        container.insertBefore(btn, container.firstChild);
      }
    });
    updateThemeButtons(getTheme());
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

  // Initialize
  ensureThemeButton();
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
