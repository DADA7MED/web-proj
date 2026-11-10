// js/stores/productsStore.js
import { seedProducts } from '../data/seedProducts.js';
import { categoriesStore } from './categoriesStore.js';

const STORAGE_KEY = 'laptop_store_products';
const STORAGE_VERSION = 2;
const API_URL = typeof window !== 'undefined' && window.location.pathname.includes('/admin/')
  ? '../api/get_products.php'
  : 'api/get_products.php';

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

function extractBrand(name, specs = {}) {
    if (!name) return 'Apex';
    const text = (name + ' ' + JSON.stringify(specs)).toLowerCase();
    if (text.includes('apple') || text.includes('m4') || text.includes('macbook')) return 'Apple';
    if (text.includes('dell') || text.includes('xps') || text.includes('alienware')) return 'Dell';
    if (text.includes('lenovo') || text.includes('thinkpad') || text.includes('legion') || text.includes('yoga') || text.includes('flexbook')) return 'Lenovo';
    if (text.includes('asus') || text.includes('rog') || text.includes('zenbook') || text.includes('vortex') || text.includes('titan')) return 'ASUS';
    if (text.includes('hp') || text.includes('omen') || text.includes('spectre')) return 'HP';
    if (text.includes('razer')) return 'Razer';
    return 'Apex';
}

function normalizeProduct(p) {
    const specsObj = parseObject(p.specs);
    const brand = p.brand || specsObj.brand || extractBrand(p.name, specsObj);
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
        specs: specsObj,
        brand: brand,
        category: p.category || (categoriesStore.getCategoryById(p.category_id)?.name || 'Laptops')
    };
}

class ProductsStore {
    constructor() {
        this.STORAGE_KEY = STORAGE_KEY;
        this.products = [];
        this.isInitialized = false;
        this._initPromise = null;
    }

    async init() {
        if (this.isInitialized) return this.products;
        if (!this._initPromise) {
            this._initPromise = (async () => {
                await categoriesStore.init();
                const list = await this.loadProducts();
                this.products = list;
                this.isInitialized = true;
                return this.products;
            })().finally(() => {
                this._initPromise = null;
            });
        }
        return this._initPromise;
    }

    async loadProducts() {
        const stored = this._readStorage();
        if (stored) return stored.map(normalizeProduct);

        let data = await this._fetchFromApi();
        if (!data) {
            data = seedProducts;
        }

        const normalized = data.map(normalizeProduct);
        this.saveProducts(normalized);
        return normalized;
    }

    async _fetchFromApi() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            return Array.isArray(data) && data.length > 0 ? data : null;
        } catch (err) {
            return null;
        }
    }

    async syncFromDatabase() {
        const data = await this._fetchFromApi();
        if (!data) throw new Error('Could not load products from the database API.');
        this.products = data.map(normalizeProduct);
        this.saveProducts(this.products);
        this.isInitialized = true;
        return this.products;
    }

    _readStorage() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            const valid = parsed && parsed.version === STORAGE_VERSION
                && Array.isArray(parsed.items) && parsed.items.length > 0;
            return valid ? parsed.items : null;
        } catch (err) {
            return null;
        }
    }

    saveProducts(products) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                version: STORAGE_VERSION,
                items: products
            }));
            // Also mirror to 'products' key for Ahmed Hassan's cartStore compatibility
            localStorage.setItem('products', JSON.stringify(products));
        } catch (err) {
            console.error('Error saving products:', err);
        }
    }

    _assertReady() {
        if (!this.isInitialized) {
            throw new Error('productsStore is not ready. Call "await productsStore.init()" first.');
        }
    }

    _peekProducts() {
        if (this.isInitialized) return this.products;
        const stored = this._readStorage();
        return stored ? stored.map(normalizeProduct) : seedProducts.map(normalizeProduct);
    }

    async getAll() {
        if (!this.isInitialized) await this.init();
        return this.getAllProducts();
    }

    getAllProducts() {
        this._assertReady();
        return [...this.products];
    }

    getProductById(id) {
        this._assertReady();
        const numId = Number(id);
        const product = this.products.find(p => p.id === numId || String(p.id) === String(id));
        return product ? { ...product } : null;
    }

    getById(id) {
        return this.getProductById(id);
    }

    getProductsByCategory(categoryId) {
        this._assertReady();
        const numId = Number(categoryId);
        return this.products.filter(p => p.category_id === numId);
    }

    validateProductData(data, isUpdate = false) {
        if (!data || typeof data !== 'object') {
            throw new Error('Product data is required.');
        }

        if (!isUpdate || data.name !== undefined) {
            if (typeof data.name !== 'string' || data.name.trim() === '') {
                throw new Error('Product name is required.');
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
                throw new Error('Product old price must be a non-negative number.');
            }
        }

        if (data.stock !== undefined) {
            const stock = Number(data.stock);
            if (!Number.isFinite(stock) || stock < 0) {
                throw new Error('Product stock must be a non-negative number.');
            }
        }

        if (!isUpdate || data.category_id !== undefined) {
            if (!isSet(data.category_id)) {
                throw new Error('Product category is required.');
            }
            if (!categoriesStore.getCategoryById(data.category_id)) {
                throw new Error(`Category with ID "${data.category_id}" does not exist.`);
            }
        }
    }

    _nextId() {
        return Math.max(0, ...this.products.map(p => p.id)) + 1;
    }

    _uniqueSlug(base, ignoreId = null) {
        const root = slugify(base) || 'laptop';
        let slug = root;
        let n = 2;
        while (this.products.some(p => p.slug === slug && p.id !== ignoreId)) {
            slug = `${root}-${n++}`;
        }
        return slug;
    }

    addProduct(productData) {
        this._assertReady();
        this.validateProductData(productData, false);

        const newProduct = normalizeProduct({
            id: this._nextId(),
            category_id: Number(productData.category_id),
            name: productData.name.trim(),
            slug: this._uniqueSlug(productData.slug || productData.name),
            price: Number(productData.price),
            old_price: productData.old_price ? Number(productData.old_price) : null,
            rating: productData.rating !== undefined ? Number(productData.rating) : 5.0,
            reviews_count: productData.reviews_count ? Number(productData.reviews_count) : 0,
            stock: productData.stock !== undefined ? Number(productData.stock) : 10,
            image: productData.image || 'assets/images/products/zenith-pro-16.jpeg',
            specs: productData.specs || {},
            badge_text: productData.badge_text || '',
            baseline_price: productData.baseline_price ? Number(productData.baseline_price) : null,
            models_count: productData.models_count !== undefined ? productData.models_count : 1,
            description: productData.description || '',
            brand: productData.brand || extractBrand(productData.name),
            category: categoriesStore.getCategoryById(productData.category_id)?.name || 'Laptops',
            created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
        });

        this.products.push(newProduct);
        this.saveProducts(this.products);
        window.dispatchEvent(new CustomEvent('products-updated'));
        return newProduct;
    }

    updateProduct(id, updatedData) {
        this._assertReady();
        const numId = Number(id);
        const index = this.products.findIndex(p => p.id === numId || String(p.id) === String(id));
        if (index === -1) {
            throw new Error(`Cannot update. Product with ID "${id}" was not found.`);
        }

        this.validateProductData(updatedData, true);

        const current = this.products[index];
        const merged = { ...current, ...updatedData, id: current.id };
        if (updatedData.name !== undefined) merged.name = updatedData.name.trim();
        if (updatedData.slug !== undefined) merged.slug = this._uniqueSlug(updatedData.slug, current.id);
        if (updatedData.category_id !== undefined) {
            merged.category = categoriesStore.getCategoryById(updatedData.category_id)?.name || merged.category;
        }

        this.products[index] = normalizeProduct(merged);
        this.saveProducts(this.products);
        window.dispatchEvent(new CustomEvent('products-updated'));
        return this.products[index];
    }

    deleteProduct(id) {
        this._assertReady();
        const numId = Number(id);
        const index = this.products.findIndex(p => p.id === numId || String(p.id) === String(id));
        if (index === -1) {
            throw new Error(`Cannot delete. Product with ID "${id}" was not found.`);
        }

        const deleted = this.products.splice(index, 1)[0];
        this.saveProducts(this.products);
        window.dispatchEvent(new CustomEvent('products-updated'));
        return deleted;
    }

    async remove(id) {
        if (!this.isInitialized) await this.init();
        return this.deleteProduct(id);
    }

    queryProducts(options = {}) {
        let result = [...this.products];

        const query = (options.searchQuery || '').toLowerCase().trim();
        if (query) {
            const terms = query.split(/\s+/);
            result = result.filter(p => {
                const haystack = [
                    p.name, p.description, p.slug, p.badge_text, p.brand,
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
                    default:
                        return (b.reviews_count || 0) - (a.reviews_count || 0);
                }
            });
        }

        return result;
    }
}

export const productsStore = new ProductsStore();

categoriesStore.addDeleteGuard((categoryId) => {
    const count = productsStore._peekProducts()
        .filter(p => Number(p.category_id) === Number(categoryId)).length;
    return count > 0
        ? `Cannot delete this category: ${count} product(s) still belong to it.`
        : null;
});
