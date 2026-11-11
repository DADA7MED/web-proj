// js/pages/auth.js
import { authStore } from '../stores/authStore.js';
import { ordersStore } from '../stores/ordersStore.js';
import { wishlistStore } from '../stores/wishlistStore.js';

document.addEventListener('DOMContentLoaded', () => {
  const authForms = document.getElementById('auth-forms-container');
  const profileContainer = document.getElementById('profile-container');

  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');

  const loginError = document.getElementById('login-error');
  const regError = document.getElementById('reg-error');

  function renderState() {
    const user = authStore.getCurrentUser();
    if (user) {
      if (authForms) authForms.style.display = 'none';
      if (profileContainer) profileContainer.style.display = 'block';

      document.getElementById('profile-name').textContent = user.name;
      document.getElementById('profile-email').textContent = user.email;
      document.getElementById('profile-role').textContent = `${user.role || 'Member'} · ${user.accountType || 'Personal'}`;

      const avatar = document.getElementById('profile-avatar');
      if (avatar && user.avatar) avatar.src = user.avatar;

      const phoneInput = document.getElementById('prof-phone');
      const addressInput = document.getElementById('prof-address');
      if (phoneInput) phoneInput.value = user.phone || '';
      if (addressInput) addressInput.value = user.address ? `${user.address}, ${user.city || ''}` : '';

      const userOrders = ordersStore.getUserOrders(user.email);
      document.getElementById('stat-orders-count').textContent = userOrders.length;
      document.getElementById('stat-wishlist-count').textContent = wishlistStore.getCount();
    } else {
      if (authForms) authForms.style.display = 'block';
      if (profileContainer) profileContainer.style.display = 'none';
    }
  }

  // Switch tabs
  tabLogin?.addEventListener('click', () => {
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
  });

  tabRegister?.addEventListener('click', () => {
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
    registerForm.style.display = 'block';
    loginForm.style.display = 'none';
  });

  // Login handler
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    loginError.style.display = 'none';
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-password').value;

    try {
      authStore.login(email, pass);
      renderState();
    } catch (err) {
      loginError.textContent = err.message;
      loginError.style.display = 'block';
    }
  });

  // Register handler
  registerForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    regError.style.display = 'none';
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const accountType = document.getElementById('reg-role').value;

    try {
      authStore.register({ name, email, password, accountType });
      renderState();
    } catch (err) {
      regError.textContent = err.message;
      regError.style.display = 'block';
    }
  });

  // Demo buttons
  document.getElementById('demo-user-btn')?.addEventListener('click', () => {
    authStore.login('demo@apex.com', 'password123');
    renderState();
  });

  document.getElementById('demo-admin-btn')?.addEventListener('click', () => {
    authStore.login('admin@apex.com', 'admin123');
    renderState();
  });

  // Logout
  document.getElementById('btn-logout')?.addEventListener('click', () => {
    authStore.logout();
    renderState();
  });

  // Update profile
  document.getElementById('profile-update-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const phone = document.getElementById('prof-phone').value;
    const address = document.getElementById('prof-address').value;
    authStore.updateProfile({ phone, address });
    alert('Profile updated successfully!');
  });

  renderState();
});
