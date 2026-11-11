// js/pages/categories.js
import { categoriesStore } from '../stores/categoriesStore.js';
import { initGlobalNavbar } from '../components/navbar.js';

// يضمن إن القيمة array دايماً (حتى لو NULL أو JSON string)
const toArray = (v) => {
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

// أيقونة لكل كاتيجوري حسب الـ slug (استبدليها بأيقونات مكتبتك لو عايزة)
const categoryIcons = {
  ultrabooks: '💻',
  'gaming-rigs': '🎮',
  workstations: '🎨',
  convertibles: '🔄'
};

// لوجو كل براند كأيقونة/حروف بدل الصور (زي التصميم). أي براند جديد بياخد أول 3 حروف من اسمه تلقائياً
const brandLogos = {
  apple: '💻',
  dell: 'DELL',
  lenovo: 'LEN',
  asus: 'ROG',
  razer: 'RZR',
  hp: 'HP'
};

// لو الصورة مش موجودة، الخلفية الرمادية تفضل ظاهرة بدل alt text
const imgFallback = `onerror="this.style.display='none'"`;

export async function renderCategoriesPage() {
  const container = document.getElementById('categories-container');
  if (!container) return;

  // جلب البيانات من الـ Store
  await categoriesStore.fetchCategories();

  // 1. الفئات الأساسية (Primary Form Factors)
  const categoriesHTML = categoriesStore.categories.map(cat => {
    const features = toArray(cat.features);
    // "34 Models · Sub-3.0 lb"  ->  ["34 Models", "Sub-3.0 lb"]
    const [modelsText, tagText] = (cat.models_count || '').split('·').map(s => s.trim());

    return `
      <div class="category-card" data-slug="${cat.slug}">
        <div class="card-top">
          <div class="card-icon">${categoryIcons[cat.slug] || '💻'}</div>
          <div class="card-badges">
            ${modelsText ? `<span class="models-badge">${modelsText}</span>` : ''}
            ${tagText ? `<span class="tag-badge">${tagText}</span>` : ''}
          </div>
        </div>

        <h3 class="card-title">${cat.name}</h3>
        <p class="card-desc">${cat.description}</p>

        ${features.length ? `
          <div class="features-grid">
            ${features.map(f => `<div class="feature-chip">${typeof f === 'object' ? f.text : f}</div>`).join('')}
          </div>` : ''}

        <div class="card-image-wrap">
          <img src="${cat.image}" alt="${cat.name}" loading="lazy" ${imgFallback}>
        </div>

        <div class="card-footer">
          <div class="price-box">
            <span class="price-label">BASELINE PRICE</span>
            <span class="price-value">$${Number(cat.baseline_price).toLocaleString()}</span>
          </div>
          <a href="products.html?category=${cat.slug}" class="btn-browse">Browse ${cat.name.split(' ')[0]} &rarr;</a>
        </div>
      </div>
    `;
  }).join('');

  // 2. البراندات المعتمدة (Authorized Brand Ecosystems)
  const brandsHTML = categoriesStore.brands.map(brand => {
    const models = toArray(brand.models_list);
    const tags = toArray(brand.features);
    const shortName = brand.name.split(' ')[0];
    const logo = brandLogos[brand.slug] || brand.name.slice(0, 3).toUpperCase();
    const logoClass = /^[A-Z]+$/.test(logo) ? 'brand-logo' : 'brand-logo logo-icon';

    return `
      <div class="brand-card">
        <div class="brand-header">
          <div class="brand-info">
            <div class="${logoClass}">${logo}</div>
            <div>
              <h3>${brand.name}</h3>
              <span class="location">${brand.description}</span>
            </div>
          </div>
          <span class="systems-count">${brand.models_count}</span>
        </div>

        ${tags.length ? `
          <div class="brand-tags">
            ${tags.map(tag => `<span class="brand-tag">${tag}</span>`).join('')}
          </div>` : ''}

        ${models.length ? `
          <div class="brand-models-list">
            ${models.map(m => `
              <div class="model-row">
                <span class="model-name">${m.name}</span>
                <span class="model-price">${m.price}</span>
              </div>
            `).join('')}
          </div>` : ''}

        <div class="brand-footer">
          <a href="products.html?brand=${brand.slug}" class="brand-link">View ${shortName} Ecosystem &rsaquo;</a>
          <span class="support-tag">${brand.badge_text}</span>
        </div>
      </div>
    `;
  }).join('');

  // تجميع الأقسام داخل الصفحة
  container.innerHTML = `
    <section class="section-form-factors">
      <h2 class="section-title"><span class="accent-bar">|</span> Primary Form Factors & Architectures</h2>
      <div class="cards-grid cats">
        ${categoriesHTML}
      </div>
    </section>

    <section class="section-brands">
      <h2 class="section-title"><span class="accent-bar">|</span> Authorized Brand Ecosystems</h2>
      <div class="cards-grid brands">
        ${brandsHTML}
      </div>
    </section>
  `;

  // 3. الأرقام الديناميكية في كارت Catalog Coverage (لو العناصر موجودة في الصفحة)
  const classesEl = document.getElementById('stat-classes');
  const brandsEl = document.getElementById('stat-brands');
  if (classesEl) classesEl.textContent = `${categoriesStore.categories.length} Classes`;
  if (brandsEl) brandsEl.textContent = `${categoriesStore.brands.length} Brands`;

  // 4. ملء القائمة المنسدلة في الهيدر
  const categorySelect = document.getElementById('category-select');
  if (categorySelect) {
    categoriesStore.categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat.slug;
      opt.textContent = cat.name;
      categorySelect.appendChild(opt);
    });
  }

  // 5. تشغيل البحث والفلترة
  setupSearch();
}

// البحث والفلترة على الكروت (من الهيدر ومن شريط LIVE اللي تحت الـ hero)
function setupSearch() {
  const headerInput = document.getElementById('search-input');
  const heroInput = document.querySelector('.search-input-mock input');
  const select = document.getElementById('category-select');
  const inputs = [headerInput, heroInput].filter(Boolean);
  if (!inputs.length) return;

  if (heroInput) heroInput.disabled = false;

  const grids = [...document.querySelectorAll('#categories-container .cards-grid')];
  grids.forEach(grid => {
    const msg = document.createElement('p');
    msg.className = 'no-results';
    msg.textContent = 'No matches found. Try a different keyword.';
    msg.style.display = 'none';
    grid.appendChild(msg);
  });

  const applyFilter = () => {
    const terms = inputs[0].value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const cat = select ? select.value : '';

    grids.forEach(grid => {
      let visible = 0;
      grid.querySelectorAll('.category-card, .brand-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        const matchText = terms.every(t => text.includes(t));
        const matchCat = !cat || !card.dataset.slug || card.dataset.slug === cat;
        const show = matchText && matchCat;
        card.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      grid.querySelector('.no-results').style.display = visible ? 'none' : '';
    });
  };

  // الشريطين مربوطين ببعض
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      inputs.forEach(other => { if (other !== input) other.value = input.value; });
      applyFilter();
    });
  });

  if (select) select.addEventListener('change', applyFilter);

  // اختصار Ctrl/⌘ + K يفتح البحث
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      (headerInput || heroInput).focus();
    }
  });
}

// تشغيل الفانكشن تلقائياً عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', renderCategoriesPage);