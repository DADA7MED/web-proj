// js/pages/products.js

import { productsStore } from '../stores/productsStore.js';
import { categoriesStore } from '../stores/categoriesStore.js';
import { cartStore } from '../stores/cartStore.js';
import { wishlistStore } from '../stores/wishlistStore.js';
import { createPagination } from '../components/pagination.js';
import { initGlobalNavbar } from '../components/navbar.js';

const PAGE_SIZE = 9;
const PRICE_MIN = 999;
const PRICE_MAX = 4999;
const DEFAULT_SORT = 'performance';

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, ch => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
));

document.addEventListener('DOMContentLoaded', async () => {
    initGlobalNavbar();
    await productsStore.init();

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
            productsGrid?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

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
        renderTags();
    }

    function renderTags() {
        if (!purposeTags) return;
        purposeTags.innerHTML = categoriesStore.getAllCategories().map(category => `
            <span class="tag-chip ${Number(currentOptions.category_id) === category.id ? 'active' : ''}"
                  data-id="${category.id}" style="cursor: pointer; display: inline-block; padding: 4px 10px; margin: 2px; border-radius: 6px; background: #f1f5f9; font-size: 12px;">${esc(category.name)}</span>
        `).join('');
    }

    function setCategory(id) {
        currentOptions.category_id = id ? Number(id) : null;
        if (categorySelect) categorySelect.value = id ? String(id) : '';
        update();
    }

    function applyUrlParams() {
        const params = new URLSearchParams(window.location.search);
        const categorySlug = params.get('category');
        if (categorySlug) {
            const category = categoriesStore.getCategoryBySlug(categorySlug);
            if (category) {
                currentOptions.category_id = category.id;
                if (categorySelect) categorySelect.value = String(category.id);
            }
        }

        const search = params.get('search');
        if (search) {
            currentOptions.searchQuery = search;
            if (searchInput) searchInput.value = search;
        }
    }

    function renderProducts(products) {
        if (!productsGrid) return;

        if (products.length === 0) {
            productsGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 48px; background: #fff; border-radius: 12px; border: 1px dashed #cbd5e1;">
                    <div style="font-size: 32px; margin-bottom: 12px;">💻</div>
                    <h3 style="font-size: 18px; margin-bottom: 8px;">No products found matching your filters</h3>
                    <p style="color: #64748b; font-size: 14px; margin-bottom: 16px;">Try adjusting your search query, selecting another category, or clearing your price filters.</p>
                    <button id="reset-all-btn" style="background: #0047ff; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: 600;">Reset Filters</button>
                </div>
            `;
            document.getElementById('reset-all-btn')?.addEventListener('click', resetFilters);
            return;
        }

        productsGrid.innerHTML = products.map(product => {
            const inWish = wishlistStore.has(product.id);
            return `
            <div class="product-card" data-id="${product.id}" style="background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; position: relative; box-shadow: 0 1px 3px rgba(0,0,0,0.05); display: flex; flex-direction: column;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                    ${product.badge_text ? `<span class="badge" style="background: #0047ff; color: #fff; font-size: 10px; padding: 4px 8px; border-radius: 4px; font-weight: bold; display: inline-block;">${esc(product.badge_text)}</span>` : '<span></span>'}
                    <button class="wishlist-toggle-btn" data-id="${product.id}" title="Save to wishlist" style="background: none; border: none; cursor: pointer; font-size: 18px; color: ${inWish ? '#ef4444' : '#94a3b8'}; transition: transform 0.2s;">
                        ${inWish ? '♥' : '♡'}
                    </button>
                </div>

                <a href="details.html?id=${product.id}" style="text-decoration: none; color: inherit; display: block;">
                    <div class="product-image" style="height: 160px; background: #f8fafc; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; overflow: hidden;">
                        ${product.image ? `<img src="${esc(product.image)}" alt="${esc(product.name)}" style="max-height: 100%; max-width: 100%; object-fit: contain; transition: transform 0.3s;" onerror="this.src='assets/hero-laptop.jpg'">` : 'Laptop Image'}
                    </div>
                    <div class="product-meta" style="font-size: 12px; color: #4b5563; margin-bottom: 4px;">
                        ★ ${Number(product.rating || 5).toFixed(1)} (${product.reviews_count || 12} reviews)
                    </div>
                    <h3 class="product-title" style="font-size: 15px; font-weight: 600; color: #111827; margin-bottom: 8px; line-height: 1.3; min-height: 40px;">${esc(product.name)}</h3>
                </a>

                <div class="product-specs" style="font-size: 11px; color: #374151; background: #f8fafc; padding: 8px 10px; border-radius: 6px; margin-bottom: 12px; flex-grow: 1;">
                    <div>⚙️ <strong>CPU:</strong> ${esc(product.specs?.cpu || 'Core Ultra')}</div>
                    <div>💾 <strong>RAM:</strong> ${esc(product.specs?.ram || '32 GB')}</div>
                    <div>💽 <strong>SSD:</strong> ${esc(product.specs?.storage || '1 TB')}</div>
                    ${product.specs?.gpu ? `<div>🎮 <strong>GPU:</strong> ${esc(product.specs.gpu)}</div>` : ''}
                </div>

                <div class="product-footer" style="display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 8px; border-top: 1px solid #f1f5f9;">
                    <div>
                        <span class="price" style="font-size: 18px; font-weight: 700; color: #111827;">$${Number(product.price).toFixed(2)}</span>
                        ${product.old_price ? `<span class="old-price" style="font-size: 12px; color: #9ca3af; text-decoration: line-through; margin-left: 6px;">$${Number(product.old_price).toFixed(2)}</span>` : ''}
                    </div>
                    <div style="display: flex; gap: 6px;">
                        <a href="details.html?id=${product.id}" style="text-decoration: none; background: #f1f5f9; color: #334155; padding: 7px 10px; border-radius: 6px; font-size: 12px; font-weight: 600;">Details</a>
                        <button class="add-to-cart-btn" data-id="${product.id}" style="background: #0047ff; color: #fff; border: none; padding: 7px 12px; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 12px;">
                            + Cart
                        </button>
                    </div>
                </div>

                <div class="stock-status" style="font-size: 11px; color: ${product.stock > 0 ? '#16a34a' : '#dc2626'}; margin-top: 6px; text-align: right;">
                    ${product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
                </div>
            </div>
            `;
        }).join('');

        // Wire Add to Cart buttons
        productsGrid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = btn.getAttribute('data-id');
                const ok = cartStore.addToCart(id, 1);
                if (ok) {
                    btn.textContent = '✓ Added';
                    btn.style.background = '#16a34a';
                    setTimeout(() => {
                        btn.textContent = '+ Cart';
                        btn.style.background = '#0047ff';
                    }, 1500);
                } else {
                    alert('Item is currently out of stock.');
                }
            });
        });

        // Wire Wishlist buttons
        productsGrid.querySelectorAll('.wishlist-toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = btn.getAttribute('data-id');
                const res = wishlistStore.toggle(id);
                btn.textContent = res.status === 'added' ? '♥' : '♡';
                btn.style.color = res.status === 'added' ? '#ef4444' : '#94a3b8';
            });
        });
    }

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
                ? chips.map(c => `<span class="filter-chip" data-remove="${c.key}" style="cursor:pointer; display:inline-block; margin:2px 4px; padding:2px 8px; background:#e0e7ff; color:#3730a3; border-radius:4px; font-size:12px;">${esc(c.label)} ✕</span>`).join('')
                : '<span style="color:#64748b; font-size:12px;">None</span>'}
            ${chips.length ? '<a href="#" data-action="clear-all" style="color:#0047ff; font-size:12px; text-decoration:none; font-weight:600; margin-left:8px;">Clear All</a>' : ''}
        `;

        appliedTags.querySelectorAll('[data-remove]').forEach(chip => {
            chip.addEventListener('click', () => {
                const key = chip.getAttribute('data-remove');
                if (key === 'category') setCategory(null);
                if (key === 'search') {
                    currentOptions.searchQuery = '';
                    if (searchInput) searchInput.value = '';
                    update();
                }
                if (key === 'stock') {
                    currentOptions.inStockOnly = false;
                    if (inStockCheckbox) inStockCheckbox.checked = false;
                    update();
                }
                if (key === 'price') {
                    currentOptions.minPrice = undefined;
                    currentOptions.maxPrice = undefined;
                    if (minPriceInput) minPriceInput.value = '';
                    if (maxPriceInput) maxPriceInput.value = '';
                    if (priceSlider) priceSlider.value = PRICE_MAX;
                    update();
                }
            });
        });

        appliedTags.querySelector('[data-action="clear-all"]')?.addEventListener('click', (e) => {
            e.preventDefault();
            resetFilters();
        });
    }

    function resetFilters() {
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
        if (inStockCheckbox) inStockCheckbox.checked = false;
        if (minPriceInput) minPriceInput.value = '';
        if (maxPriceInput) maxPriceInput.value = '';
        if (priceSlider) priceSlider.value = PRICE_MAX;
        if (sortSelect) sortSelect.value = DEFAULT_SORT;
        update();
    }

    function update({ resetPage = true } = {}) {
        const results = productsStore.queryProducts(currentOptions);
        pagination.setTotal(results.length, { resetPage });
        renderProducts(pagination.paginate(results));
        renderAppliedFilters();
        renderTags();
    }

    // Event listeners
    searchInput?.addEventListener('input', (e) => {
        currentOptions.searchQuery = e.target.value;
        update();
    });

    sortSelect?.addEventListener('change', (e) => {
        currentOptions.sortBy = e.target.value;
        update();
    });

    categorySelect?.addEventListener('change', (e) => {
        setCategory(e.target.value);
    });

    purposeTags?.addEventListener('click', (e) => {
        const chip = e.target.closest('[data-id]');
        if (chip) {
            const id = Number(chip.dataset.id);
            setCategory(currentOptions.category_id === id ? null : id);
        }
    });

    inStockCheckbox?.addEventListener('change', (e) => {
        currentOptions.inStockOnly = e.target.checked;
        update();
    });

    priceSlider?.addEventListener('input', (e) => {
        currentOptions.maxPrice = Number(e.target.value);
        if (maxPriceInput) maxPriceInput.value = e.target.value;
        update();
    });

    minPriceInput?.addEventListener('change', (e) => {
        currentOptions.minPrice = e.target.value ? Number(e.target.value) : undefined;
        update();
    });

    maxPriceInput?.addEventListener('change', (e) => {
        currentOptions.maxPrice = e.target.value ? Number(e.target.value) : undefined;
        if (priceSlider) priceSlider.value = e.target.value || PRICE_MAX;
        update();
    });

    clearFiltersBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        resetFilters();
    });

    // Initialize
    populateCategories();
    applyUrlParams();
    update();
});
