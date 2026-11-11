// js/pages/products.js

import { productsStore } from '../stores/productsStore.js';
import { categoriesStore } from '../stores/categoriesStore.js';
import { createPagination } from '../components/pagination.js';

const PAGE_SIZE = 9;
const PRICE_MIN = 999;
const PRICE_MAX = 4999;
const DEFAULT_SORT = 'performance'; // نفس أول خيار في قائمة الترتيب

// يمنع إن اسم منتج فيه < أو > يبوّظ الصفحة (مهم لما الأدمن يضيف منتجات)
const esc = (v) => String(v ?? '').replace(/[&<>"']/g, ch => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
));

document.addEventListener('DOMContentLoaded', async () => {
    // المنتجات والأقسام من نفس الـ Stores (LocalStorage ← API ← seed)
    await productsStore.init();

    // عناصر الواجهة
    const productsGrid = document.getElementById('products-grid');
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    const categorySelect = document.getElementById('category-select');
    const inStockCheckbox = document.getElementById('in-stock-checkbox');
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    const priceSlider = document.getElementById('price-slider');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const purposeTags = document.getElementById('purpose-tags');
    const appliedTags = document.getElementById('applied-tags');
    const paginationEl = document.getElementById('pagination');

    // حالة الفلاتر الحالية (كلها بتشتغل مع بعض)
    let currentOptions = {
        searchQuery: '',
        category_id: null,
        minPrice: undefined,
        maxPrice: undefined,
        inStockOnly: false,
        sortBy: DEFAULT_SORT
    };

    const pagination = createPagination({
        container: paginationEl,
        pageSize: PAGE_SIZE,
        itemLabel: 'high-performance laptops',
        onPageChange: () => {
            update({ resetPage: false });
            productsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    // ---------- الأقسام ----------
    function populateCategories() {
        const categories = categoriesStore.getAllCategories();

        if (categorySelect) {
            categorySelect.innerHTML = '<option value="">All Categories</option>';
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        }

        // قسم PURPOSE & FORM في الـ sidebar بقى من نفس الأقسام
        renderTags();
    }

    function renderTags() {
        if (!purposeTags) return;
        purposeTags.innerHTML = categoriesStore.getAllCategories().map(category => `
            <span class="tag-chip ${Number(currentOptions.category_id) === category.id ? 'active' : ''}"
                  data-id="${category.id}">${esc(category.name)}</span>
        `).join('');
    }

    function setCategory(id) {
        currentOptions.category_id = id ? Number(id) : null;
        if (categorySelect) categorySelect.value = id ? String(id) : '';
        update();
    }

    // ---------- الـ URL (جاي من صفحة الأقسام: products.php?category=ultrabooks) ----------
    function applyUrlParams() {
        const params = new URLSearchParams(window.location.search);

        const category = categoriesStore.getCategoryBySlug(params.get('category'));
        if (category) {
            currentOptions.category_id = category.id;
            if (categorySelect) categorySelect.value = String(category.id);
        }

        const search = params.get('search');
        if (search) {
            currentOptions.searchQuery = search;
            if (searchInput) searchInput.value = search;
        }
    }

    // ---------- العرض ----------
    function renderProducts(products) {
        if (products.length === 0) {
            productsGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                    <h3>No products found matching your filters.</h3>
                    <p>Try adjusting your search query or price range.</p>
                </div>
            `;
            return;
        }

        productsGrid.innerHTML = products.map(product => `
            <div class="product-card" data-id="${product.id}" style="background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; position: relative; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                ${product.badge_text ? `<span class="badge" style="background: #0047ff; color: #fff; font-size: 10px; padding: 4px 8px; border-radius: 4px; font-weight: bold; display: inline-block; margin-bottom: 8px;">${esc(product.badge_text)}</span>` : ''}
                <div class="product-image" style="height: 160px; background: #f3f4f6; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; color: #6b7280; font-size: 14px;">
                    ${product.image ? `<img src="${esc(product.image)}" alt="${esc(product.name)}" style="max-height: 100%; max-width: 100%; object-fit: contain;" onerror="this.style.display='none'">` : 'Laptop Image'}
                </div>
                <div class="product-meta" style="font-size: 12px; color: #4b5563; margin-bottom: 4px;">
                    ★ ${product.rating} (${product.reviews_count} reviews)
                </div>
                <h3 class="product-title" style="font-size: 16px; font-weight: 600; color: #111827; margin-bottom: 8px; height: 44px; overflow: hidden;">${esc(product.name)}</h3>

                <div class="product-specs" style="font-size: 12px; color: #374151; background: #f9fafb; padding: 8px; border-radius: 6px; margin-bottom: 12px;">
                    <div>⚙️ CPU: ${esc(product.specs?.cpu || 'N/A')}</div>
                    <div>💾 RAM: ${esc(product.specs?.ram || 'N/A')}</div>
                    <div>💽 Storage: ${esc(product.specs?.storage || 'N/A')}</div>
                </div>

                <div class="product-footer" style="display: flex; align-items: center; justify-content: space-between; margin-top: 12px;">
                    <div>
                        <span class="price" style="font-size: 18px; font-weight: 700; color: #111827;">$${Number(product.price).toFixed(2)}</span>
                        ${product.old_price ? `<span class="old-price" style="font-size: 12px; color: #9ca3af; text-decoration: line-through; margin-left: 6px;">$${Number(product.old_price).toFixed(2)}</span>` : ''}
                    </div>
                    <button class="add-to-cart-btn" data-id="${product.id}" style="background: #0047ff; color: #fff; border: none; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 13px;">
                        Add to Cart
                    </button>
                </div>
                <div class="stock-status" style="font-size: 11px; color: ${product.stock > 0 ? '#059669' : '#dc2626'}; margin-top: 8px; text-align: right;">
                    ${product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                </div>
            </div>
        `).join('');
    }

    // شريط APPLIED FILTERS بقى حقيقي (بيعرض الفلاتر الشغالة فعلاً)
    function renderAppliedFilters() {
        if (!appliedTags) return;

        const chips = [];
        const category = categoriesStore.getCategoryById(currentOptions.category_id);
        if (category) chips.push({ key: 'category', label: category.name });
        if (currentOptions.searchQuery.trim()) chips.push({ key: 'search', label: `"${currentOptions.searchQuery.trim()}"` });
        if (currentOptions.inStockOnly) chips.push({ key: 'stock', label: 'In Stock Only' });
        if (currentOptions.minPrice !== undefined || currentOptions.maxPrice !== undefined) {
            const min = currentOptions.minPrice ?? PRICE_MIN;
            const max = currentOptions.maxPrice ?? PRICE_MAX;
            chips.push({ key: 'price', label: `$${min.toLocaleString()} – $${max.toLocaleString()}` });
        }

        appliedTags.innerHTML = `
            <span>APPLIED FILTERS:</span>
            ${chips.length
                ? chips.map(c => `<span class="filter-chip" data-remove="${c.key}" style="cursor:pointer;">${esc(c.label)} ✕</span>`).join('')
                : '<span style="color:#64748b;">None</span>'}
            ${chips.length ? '<a href="#" data-action="clear-all" style="color:#0047ff; font-size:12px; text-decoration:none; font-weight:600;">Clear All</a>' : ''}
        `;
    }

    // الدورة الكاملة: بحث + فلترة + ترتيب ← pagination ← عرض
    function update({ resetPage = true } = {}) {
        const results = productsStore.queryProducts(currentOptions);
        pagination.setTotal(results.length, { resetPage });
        renderProducts(pagination.paginate(results));
        renderAppliedFilters();
        renderTags();
    }

    function resetPriceInputs() {
        if (minPriceInput) minPriceInput.value = String(PRICE_MIN);
        if (maxPriceInput) maxPriceInput.value = String(PRICE_MAX);
        if (priceSlider) priceSlider.value = String(PRICE_MAX);
    }

    function resetAllFilters() {
        currentOptions = {
            searchQuery: '',
            category_id: null,
            minPrice: undefined,
            maxPrice: undefined,
            inStockOnly: false,
            sortBy: DEFAULT_SORT
        };
        if (searchInput) searchInput.value = '';
        if (categorySelect) categorySelect.value = '';
        if (sortSelect) sortSelect.value = DEFAULT_SORT;
        if (inStockCheckbox) inStockCheckbox.checked = false;
        resetPriceInputs();
        update();
    }

    // ---------- الأحداث ----------
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentOptions.searchQuery = e.target.value;
            update();
        });
    }

    if (categorySelect) {
        categorySelect.addEventListener('change', (e) => setCategory(e.target.value));
    }

    if (purposeTags) {
        purposeTags.addEventListener('click', (e) => {
            const chip = e.target.closest('.tag-chip');
            if (!chip) return;
            const id = Number(chip.dataset.id);
            setCategory(Number(currentOptions.category_id) === id ? null : id); // كليك تاني يلغي الفلتر
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentOptions.sortBy = e.target.value;
            update();
        });
    }

    if (inStockCheckbox) {
        inStockCheckbox.addEventListener('change', (e) => {
            currentOptions.inStockOnly = e.target.checked;
            update();
        });
    }

    // السعر: الخانتين والـ slider مربوطين ببعض. لو القيمة هي الحد الافتراضي يبقى مفيش فلتر.
    function handlePriceFilter() {
        const min = Number(minPriceInput.value);
        const max = Number(maxPriceInput.value);
        currentOptions.minPrice = minPriceInput.value !== '' && min > PRICE_MIN ? min : undefined;
        currentOptions.maxPrice = maxPriceInput.value !== '' && max < PRICE_MAX ? max : undefined;
        update();
    }

    if (minPriceInput && maxPriceInput) {
        minPriceInput.addEventListener('input', handlePriceFilter);
        maxPriceInput.addEventListener('input', () => {
            if (priceSlider && maxPriceInput.value !== '') priceSlider.value = maxPriceInput.value;
            handlePriceFilter();
        });
    }

    if (priceSlider && maxPriceInput && minPriceInput) {
        priceSlider.addEventListener('input', () => {
            maxPriceInput.value = priceSlider.value;
            handlePriceFilter();
        });
    }

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', resetAllFilters);
    }

    if (appliedTags) {
        appliedTags.addEventListener('click', (e) => {
            if (e.target.closest('[data-action="clear-all"]')) {
                e.preventDefault();
                resetAllFilters();
                return;
            }

            const chip = e.target.closest('[data-remove]');
            if (!chip) return;

            switch (chip.dataset.remove) {
                case 'category':
                    currentOptions.category_id = null;
                    if (categorySelect) categorySelect.value = '';
                    break;
                case 'search':
                    currentOptions.searchQuery = '';
                    if (searchInput) searchInput.value = '';
                    break;
                case 'stock':
                    currentOptions.inStockOnly = false;
                    if (inStockCheckbox) inStockCheckbox.checked = false;
                    break;
                case 'price':
                    currentOptions.minPrice = undefined;
                    currentOptions.maxPrice = undefined;
                    resetPriceInputs();
                    break;
            }
            update();
        });
    }

    // ---------- التشغيل الأولي ----------
    populateCategories();
    applyUrlParams();
    update();
});