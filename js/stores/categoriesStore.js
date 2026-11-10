// js/stores/categoriesStore.js
import { seedCategories } from '../data/seedCategories.js';

const STORAGE_KEY = 'laptop_store_categories';
// لو شكل الداتا اتغير، زوّدي الرقم ده: أي نسخة قديمة متخزنة في المتصفح بتتجاهل وبتتحمل من جديد
const STORAGE_VERSION = 2;
const API_URL = typeof window !== 'undefined' && window.location.pathname.includes('/admin/')
  ? '../api/categoriesApi.php'
  : 'api/categoriesApi.php';

// ---------- helpers ----------
const isSet = (v) => v !== undefined && v !== null && v !== '';

const parseArray = (v) => {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string' && v.trim()) {
    try {
      const parsed = JSON.parse(v);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const slugify = (text) =>
  String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// يوحّد شكل الداتا (الـ API بيرجع الـ id والأسعار كنصوص)
function normalize(item) {
  return {
    ...item,
    id: Number(item.id),
    type: item.type || 'category',
    baseline_price: Number(item.baseline_price) || 0,
    features: parseArray(item.features),
    models_list: parseArray(item.models_list)
  };
}

export const categoriesStore = {
  categories: [], // type = 'category'
  brands: [],     // type = 'brand'
  isLoading: false,
  isInitialized: false,
  _initPromise: null,
  _deleteGuards: [],

  // ---------- التحميل ----------
  // الترتيب: LocalStorage ← الـ API (مرة واحدة) ← seedCategories
  async init() {
    if (this.isInitialized) return this.getAll();
    if (!this._initPromise) {
      this._initPromise = this._load().finally(() => { this._initPromise = null; });
    }
    return this._initPromise;
  },

  // اسم قديم لسه مستخدم في categories.js و products.js
  async fetchCategories() {
    return this.init();
  },

  async _load() {
    this.isLoading = true;
    try {
      let data = this._readStorage();
      if (!data) data = await this._fetchFromApi();
      if (!data) data = seedCategories;

      this._setData(data.map(normalize));
      this._save();
      this.isInitialized = true;
      return this.getAll();
    } finally {
      this.isLoading = false;
    }
  },

  async _fetchFromApi() {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return Array.isArray(data) && data.length > 0 ? data : null;
    } catch (err) {
      console.error('Error loading categories from API, falling back to seed data:', err);
      return null;
    }
  },

  // إجبار إعادة التحميل من الداتابيز (بيمسح تعديلات LocalStorage)
  async syncFromDatabase() {
    const data = await this._fetchFromApi();
    if (!data) throw new Error('Could not load categories from the database API.');
    this._setData(data.map(normalize));
    this._save();
    this.isInitialized = true;
    return this.getAll();
  },

  // ---------- LocalStorage ----------
  _readStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const valid = parsed && parsed.version === STORAGE_VERSION
        && Array.isArray(parsed.items) && parsed.items.length > 0;
      return valid ? parsed.items : null;
    } catch (err) {
      console.error('Error reading categories from LocalStorage:', err);
      return null;
    }
  },

  _save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, items: this.getAll() }));
    } catch (err) {
      console.error('Error saving categories to LocalStorage:', err);
    }
  },

  _setData(list) {
    this.categories = list.filter(item => item.type !== 'brand');
    this.brands = list.filter(item => item.type === 'brand');
  },

  _assertReady() {
    if (!this.isInitialized) {
      throw new Error('categoriesStore is not ready. Call "await categoriesStore.init()" first.');
    }
  },

  // ---------- القراءة ----------
  getAll() {
    return [...this.categories, ...this.brands];
  },

  getAllCategories() {
    return this.categories;
  },

  getAllBrands() {
    return this.brands;
  },

  getCategoryById(id) {
    return this.categories.find(c => c.id === Number(id)) || null;
  },

  getCategoryBySlug(slug) {
    return this.categories.find(c => c.slug === slug) || null;
  },

  // ---------- التحقق ----------
  validateCategoryData(data, isUpdate = false, currentId = null) {
    if (!data || typeof data !== 'object') {
      throw new Error('Category data is required.');
    }

    if (!isUpdate || data.name !== undefined) {
      if (typeof data.name !== 'string' || data.name.trim() === '') {
        throw new Error('Category name is required.');
      }
      const duplicate = this.categories.some(
        c => c.id !== currentId && c.name.toLowerCase() === data.name.trim().toLowerCase()
      );
      if (duplicate) throw new Error(`A category named "${data.name.trim()}" already exists.`);
    }

    if (data.baseline_price !== undefined && isSet(data.baseline_price)) {
      const price = Number(data.baseline_price);
      if (!Number.isFinite(price) || price < 0) {
        throw new Error('Baseline price must be a non-negative number.');
      }
    }
  },

  _uniqueSlug(base, ignoreId = null) {
    const root = slugify(base) || 'category';
    let slug = root;
    let n = 2;
    while (this.getAll().some(c => c.slug === slug && c.id !== ignoreId)) {
      slug = `${root}-${n++}`;
    }
    return slug;
  },

  _nextId() {
    return Math.max(0, ...this.getAll().map(c => c.id)) + 1;
  },

  // ---------- الإضافة والتعديل والحذف ----------
  addCategory(categoryData) {
    this._assertReady();
    this.validateCategoryData(categoryData, false);

    const name = categoryData.name.trim();
    const newCategory = normalize({
      id: this._nextId(),
      type: 'category',
      name,
      slug: categoryData.slug ? this._uniqueSlug(categoryData.slug) : this._uniqueSlug(name),
      image: categoryData.image || '',
      description: categoryData.description || '',
      models_count: categoryData.models_count || '',
      baseline_price: categoryData.baseline_price,
      badge_text: categoryData.badge_text || '',
      features: categoryData.features || [],
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    });

    this.categories.push(newCategory);
    this._save();
    return newCategory;
  },

  updateCategory(id, updatedData) {
    this._assertReady();
    const index = this.categories.findIndex(c => c.id === Number(id));
    if (index === -1) {
      throw new Error(`Cannot update. Category with ID "${id}" was not found.`);
    }

    const current = this.categories[index];
    this.validateCategoryData(updatedData, true, current.id);

    const merged = { ...current, ...updatedData, id: current.id, type: current.type };
    if (updatedData.name !== undefined) merged.name = updatedData.name.trim();
    if (updatedData.slug !== undefined) merged.slug = this._uniqueSlug(updatedData.slug, current.id);

    this.categories[index] = normalize(merged);
    this._save();
    return this.categories[index];
  },

  deleteCategory(id) {
    this._assertReady();
    const index = this.categories.findIndex(c => c.id === Number(id));
    if (index === -1) {
      throw new Error(`Cannot delete. Category with ID "${id}" was not found.`);
    }

    const category = this.categories[index];
    for (const guard of this._deleteGuards) {
      const message = guard(category.id);
      if (message) throw new Error(message);
    }

    this.categories.splice(index, 1);
    this._save();
    return category;
  },

  // بيسمح لـ stores تانية تمنع حذف قسم لسه مستخدم (productsStore بيسجل guard هنا)
  addDeleteGuard(fn) {
    this._deleteGuards.push(fn);
  }
};