// js/stores/productsStore.js
import { seedProducts } from '../data/seedProducts.js';
import { categoriesStore } from './categoriesStore.js';

const STORAGE_KEY = 'laptop_store_products';
// لو شكل الداتا اتغير، زوّدي الرقم ده: أي نسخة قديمة متخزنة في المتصفح بتتجاهل وبتتحمل من جديد
const STORAGE_VERSION = 2;
const API_URL = 'api/get_products.php';

// ---------- helpers ----------
const isSet = (v) => v !== undefined && v !== null && v !== '';
const optionalNumber = (v) => (isSet(v) ? Number(v) : null);

const parseObject = (v) => {
    if (v && typeof v === 'object' && !Array.isArray(v)) return v;
    if (typeof v === 'string' && v.trim()) {
        try {
            const parsed = JSON.parse(v);
            return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
        } catch {
            return {};
        }
    }
    return {};
};

const slugify = (text) =>
    String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// يوحّد شكل المنتج (الـ API بيرجع الأرقام كنصوص)
function normalizeProduct(p) {
    return {
        ...p,
        id: Number(p.id),
        category_id: Number(p.category_id),
        price: Number(p.price),
        old_price: optionalNumber(p.old_price),
        rating: Number(p.rating) || 0,
        reviews_count: Number(p.reviews_count) || 0,
        stock: Number(p.stock) || 0,
        baseline_price: optionalNumber(p.baseline_price),
        specs: parseObject(p.specs)
    };
}

class ProductsStore {
    constructor() {
        this.STORAGE_KEY = STORAGE_KEY;
        this.products = [];
        this.isInitialized = false;
        this._initPromise = null;
    }

    // ---------- التحميل ----------
    // الترتيب: LocalStorage ← الـ API (مرة واحدة) ← seedProducts
    // عشان التعديلات ماتضيعش بعد الـ refresh.
    async init() {
        if (this.isInitialized) return this.products;
        if (!this._initPromise) {
            this._initPromise = (async () => {
                await categoriesStore.init(); // لازم الأقسام تتحمل الأول عشان التحقق من category_id
                this.products = await this.loadProducts();
                this.isInitialized = true;
                return this.products;
            })().finally(() => { this._initPromise = null; });
        }
        return this._initPromise;
    }

    async loadProducts() {
        const stored = this._readStorage();
        if (stored) return stored.map(normalizeProduct);

        const fromApi = await this._fetchFromApi();
        const source = fromApi || seedProducts;
        const products = source.map(normalizeProduct);
        this.saveProducts(products);
        return products;
    }

    async _fetchFromApi() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            return Array.isArray(data) && data.length > 0 ? data : null;
        } catch (err) {
            console.error('Error fetching products from API, falling back to seed data:', err);
            return null;
        }
    }

    // إجبار إعادة التحميل من الداتابيز (بيمسح تعديلات LocalStorage)
    async syncFromDatabase() {
        const data = await this._fetchFromApi();
        if (!data) throw new Error('Could not load products from the database API.');
        this.products = data.map(normalizeProduct);
        this.saveProducts(this.products);
        this.isInitialized = true;
        return this.products;
    }

    // ---------- LocalStorage ----------
    _readStorage() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            const valid = parsed && parsed.version === STORAGE_VERSION && Array.isArray(parsed.items);
            return valid ? parsed.items : null;
        } catch (err) {
            console.error('Error reading products from LocalStorage:', err);
            return null;
        }
    }

    saveProducts(products) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, items: products }));
        } catch (err) {
            console.error('Error saving products to LocalStorage:', err);
        }
    }

    _assertReady() {
        if (!this.isInitialized) {
            throw new Error('productsStore is not ready. Call "await productsStore.init()" first.');
        }
    }

    // المنتجات حتى لو الـ store لسه ما اتهيّأش (بيستخدمها حارس حذف الأقسام)
    _peekProducts() {
        return this.isInitialized ? this.products : (this._readStorage() || []);
    }

    // ---------- القراءة ----------
    getAllProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(p => p.id === Number(id));
        if (!product) {
            console.warn(`Product with ID "${id}" was not found.`);
            return null;
        }
        return product;
    }

    getProductsByCategory(categoryId) {
        return this.products.filter(p => p.category_id === Number(categoryId));
    }

    // ---------- التحقق ----------
    validateProductData(data, isUpdate = false) {
        if (!data || typeof data !== 'object') {
            throw new Error('Product data is required.');
        }

        if (!isUpdate || data.name !== undefined) {
            if (typeof data.name !== 'string' || data.name.trim() === '') {
                throw new Error('Product name is required and must be a valid string.');
            }
        }

        if (!isUpdate || data.price !== undefined) {
            if (!isSet(data.price)) throw new Error('Product price is required.');
            const price = Number(data.price);
            if (!Number.isFinite(price) || price < 0) {
                throw new Error('Product price must be a non-negative number.');
            }
        }

        if (data.old_price !== undefined && isSet(data.old_price)) {
            const oldPrice = Number(data.old_price);
            if (!Number.isFinite(oldPrice) || oldPrice < 0) {
                throw new Error('Old price must be a non-negative number.');
            }
        }

        if (data.stock !== undefined) {
            const stock = Number(data.stock);
            if (!Number.isFinite(stock) || stock < 0) {
                throw new Error('Stock quantity cannot be negative.');
            }
        }

        // القسم إجباري عند الإضافة، ولازم يكون موجود
        if (!isUpdate || data.category_id !== undefined) {
            if (!isSet(data.category_id)) {
                throw new Error('Product category is required.');
            }
            if (!categoriesStore.getCategoryById(data.category_id)) {
                throw new Error(`Referenced category with ID "${data.category_id}" does not exist.`);
            }
        }
    }

    _nextId() {
        return Math.max(0, ...this.products.map(p => p.id)) + 1;
    }

    _uniqueSlug(base, ignoreId = null) {
        const root = slugify(base) || 'product';
        let slug = root;
        let n = 2;
        while (this.products.some(p => p.slug === slug && p.id !== ignoreId)) {
            slug = `${root}-${n++}`;
        }
        return slug;
    }

    // ---------- الإضافة والتعديل والحذف ----------
    addProduct(productData) {
        this._assertReady();
        this.validateProductData(productData, false);

        const newProduct = normalizeProduct({
            id: this._nextId(),
            category_id: productData.category_id,
            name: productData.name.trim(),
            slug: this._uniqueSlug(productData.slug || productData.name),
            price: productData.price,
            old_price: productData.old_price,
            rating: productData.rating !== undefined ? productData.rating : 5.0,
            reviews_count: productData.reviews_count,
            stock: productData.stock !== undefined ? productData.stock : 10,
            image: productData.image || '',
            specs: productData.specs || {},
            badge_text: productData.badge_text || '',
            baseline_price: productData.baseline_price,
            models_count: productData.models_count !== undefined ? productData.models_count : 1,
            description: productData.description || '',
            created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
        });

        this.products.push(newProduct);
        this.saveProducts(this.products);
        return newProduct;
    }

    updateProduct(id, updatedData) {
        this._assertReady();
        const index = this.products.findIndex(p => p.id === Number(id));
        if (index === -1) {
            throw new Error(`Cannot update. Product with ID "${id}" was not found.`);
        }

        this.validateProductData(updatedData, true);

        const current = this.products[index];
        const merged = { ...current, ...updatedData, id: current.id };
        if (updatedData.name !== undefined) merged.name = updatedData.name.trim();
        if (updatedData.slug !== undefined) merged.slug = this._uniqueSlug(updatedData.slug, current.id);

        this.products[index] = normalizeProduct(merged);
        this.saveProducts(this.products);
        return this.products[index];
    }

    deleteProduct(id) {
        this._assertReady();
        const index = this.products.findIndex(p => p.id === Number(id));
        if (index === -1) {
            throw new Error(`Cannot delete. Product with ID "${id}" was not found.`);
        }

        const deleted = this.products.splice(index, 1)[0];
        this.saveProducts(this.products);
        return deleted;
    }

    // ---------- البحث والفلترة والترتيب (بيشتغلوا مع بعض) ----------
    queryProducts(options = {}) {
        let result = [...this.products];

        // البحث: بيدور في الاسم والوصف والـ slug والبادج ومواصفات الجهاز (cpu/ram/gpu...)
        const query = (options.searchQuery || '').toLowerCase().trim();
        if (query) {
            const terms = query.split(/\s+/);
            result = result.filter(p => {
                const haystack = [
                    p.name, p.description, p.slug, p.badge_text,
                    ...Object.values(p.specs || {})
                ].filter(Boolean).join(' ').toLowerCase();
                return terms.every(term => haystack.includes(term));
            });
        }

        if (isSet(options.category_id)) {
            result = result.filter(p => p.category_id === Number(options.category_id));
        }

        if (isSet(options.minPrice)) {
            result = result.filter(p => p.price >= Number(options.minPrice));
        }
        if (isSet(options.maxPrice)) {
            result = result.filter(p => p.price <= Number(options.maxPrice));
        }

        if (options.inStockOnly) {
            result = result.filter(p => p.stock > 0);
        }

        if (options.sortBy) {
            result.sort((a, b) => {
                switch (options.sortBy) {
                    case 'price-low-high':
                        return a.price - b.price;
                    case 'price-high-low':
                        return b.price - a.price;
                    case 'rating':
                        return (b.rating || 0) - (a.rating || 0);
                    default: // 'performance'
                        return (b.reviews_count || 0) - (a.reviews_count || 0);
                }
            });
        }

        return result;
    }
}

export const productsStore = new ProductsStore();

// يمنع حذف قسم لسه فيه منتجات (عشان المنتجات ماتفضلش مربوطة بقسم مش موجود)
categoriesStore.addDeleteGuard((categoryId) => {
    const count = productsStore._peekProducts()
        .filter(p => Number(p.category_id) === Number(categoryId)).length;
    return count > 0
        ? `Cannot delete this category: ${count} product(s) still belong to it.`
        : null;
});