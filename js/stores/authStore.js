// js/stores/authStore.js
const USERS_KEY = 'laptop_store_users';
const CURRENT_USER_KEY = 'laptop_store_current_user';

const defaultUsers = [
  {
    id: 'user-001',
    name: 'Alexander Vance',
    email: 'demo@apex.com',
    password: 'password123',
    role: 'VIP Member',
    accountType: 'Pro Creator',
    phone: '+1 (555) 349-8821',
    address: '742 Market Street, Suite 400',
    city: 'San Francisco',
    postalCode: '94103',
    country: 'United States',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    memberSince: 'Oct 2024'
  },
  {
    id: 'admin-001',
    name: 'Admin Supervisor',
    email: 'admin@apex.com',
    password: 'admin123',
    role: 'Admin',
    accountType: 'Enterprise Administrator',
    phone: '+1 (555) 999-0000',
    address: 'One Infinite Loop',
    city: 'Cupertino',
    postalCode: '95014',
    country: 'United States',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    memberSince: 'Jan 2024'
  }
];

function getUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
      return defaultUsers;
    }
    return JSON.parse(raw);
  } catch (e) {
    return defaultUsers;
  }
}

function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (e) {}
}

export const authStore = {
  getCurrentUser() {
    try {
      const raw = localStorage.getItem(CURRENT_USER_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  },

  isAuthenticated() {
    return this.getCurrentUser() !== null;
  },

  login(email, password) {
    const users = getUsers();
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanPass = String(password || '').trim();

    const user = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      throw new Error('No account found with this email address.');
    }

    if (user.password !== cleanPass) {
      throw new Error('Incorrect password. Please verify and try again.');
    }

    const sessionUser = { ...user };
    delete sessionUser.password;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
    window.dispatchEvent(new CustomEvent('auth-updated', { detail: { user: sessionUser } }));
    return sessionUser;
  },

  register({ name, email, password, phone = '', accountType = 'Standard Customer', address = '', city = '', postalCode = '', country = 'United States' }) {
    if (!name || !name.trim()) throw new Error('Full name is required.');
    if (!email || !email.includes('@')) throw new Error('A valid email address is required.');
    if (!password || password.length < 6) throw new Error('Password must be at least 6 characters long.');

    const users = getUsers();
    const cleanEmail = email.trim().toLowerCase();
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('An account with this email already exists.');
    }

    const newUser = {
      id: `user-${Date.now().toString(36)}`,
      name: name.trim(),
      email: cleanEmail,
      password: password,
      role: 'Member',
      accountType: accountType,
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      postalCode: postalCode.trim(),
      country: country,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      memberSince: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };

    users.push(newUser);
    saveUsers(users);

    const sessionUser = { ...newUser };
    delete sessionUser.password;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
    window.dispatchEvent(new CustomEvent('auth-updated', { detail: { user: sessionUser } }));
    return sessionUser;
  },

  updateProfile(data) {
    const current = this.getCurrentUser();
    if (!current) throw new Error('You must be logged in to update your profile.');

    const users = getUsers();
    const index = users.findIndex(u => u.id === current.id || u.email.toLowerCase() === current.email.toLowerCase());

    const updatedUser = {
      ...(index !== -1 ? users[index] : current),
      ...data,
      id: current.id,
      email: current.email // preserve email identity
    };

    if (index !== -1) {
      users[index] = updatedUser;
      saveUsers(users);
    }

    const sessionUser = { ...updatedUser };
    delete sessionUser.password;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
    window.dispatchEvent(new CustomEvent('auth-updated', { detail: { user: sessionUser } }));
    return sessionUser;
  },

  logout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.dispatchEvent(new CustomEvent('auth-updated', { detail: { user: null } }));
  }
};

if (typeof window !== 'undefined') {
  window.authStore = authStore;
}
