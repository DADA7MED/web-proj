// js/pages/details.js
import { productsStore } from '../stores/productsStore.js';
import { cartStore } from '../stores/cartStore.js';
import { wishlistStore } from '../stores/wishlistStore.js';
import { initGlobalNavbar } from '../components/navbar.js';

document.addEventListener('DOMContentLoaded', async () => {
  initGlobalNavbar();
  await productsStore.init();

  const urlParams = new URLSearchParams(window.location.search);
  const paramId = urlParams.get('id') || '1';
  const product = productsStore.getProductById(paramId) || productsStore.getAllProducts()[0];

  if (!product) {
    document.body.innerHTML = '<div style="text-align:center; padding:50px;"><h2>Product not found</h2><a href="products.html">Return to Catalog</a></div>';
    return;
  }

  // Populate dynamic product data
  const docTitle = document.getElementById('doc-title');
  if (docTitle) docTitle.textContent = `${product.name} - Product Details & Configurator`;

  const crumbName = document.getElementById('crumb-product-name');
  if (crumbName) crumbName.textContent = product.name;

  const productTitle = document.getElementById('product-title');
  if (productTitle) productTitle.textContent = product.name;

  const mainImg = document.getElementById('main-product-img');
  if (mainImg) {
    mainImg.src = product.image || 'assets/images/products/zenith-pro-16.jpeg';
    mainImg.alt = product.name;
    mainImg.onerror = () => { mainImg.src = 'assets/hero-laptop.jpg'; };
  }

  const skuCode = document.getElementById('sku-code');
  if (skuCode) skuCode.textContent = `SKU: ${product.slug ? product.slug.toUpperCase().slice(0, 10) : 'LP-2025'}`;

  const stockCount = document.getElementById('stock-count');
  if (stockCount) stockCount.textContent = `${product.stock || 12} Units Left for Express Dispatch`;

  const ratingNum = document.getElementById('rating-num');
  if (ratingNum) ratingNum.textContent = Number(product.rating || 4.9).toFixed(2);

  const reviewsCount = document.getElementById('reviews-count');
  if (reviewsCount) reviewsCount.textContent = `(${product.reviews_count || 120} benchmark-verified studio reviews)`;

  const displayPrice = document.getElementById('display-price');
  const displayOldPrice = document.getElementById('display-old-price');
  const btnPrice = document.getElementById('btn-price');
  const basePrice = Number(product.price) || 1999;

  if (displayPrice) {
    displayPrice.setAttribute('data-base', basePrice);
    displayPrice.textContent = `$${basePrice.toLocaleString('en-US')}`;
  }

  if (btnPrice) {
    btnPrice.textContent = basePrice.toLocaleString('en-US');
  }

  if (displayOldPrice) {
    if (product.old_price) {
      displayOldPrice.textContent = `$${Number(product.old_price).toLocaleString('en-US')}`;
      displayOldPrice.style.display = 'inline-block';
    } else {
      displayOldPrice.style.display = 'none';
    }
  }

  // Update dynamic spec option labels to match product
  if (product.specs?.cpu) {
    const cpuDefaultStrong = document.querySelector('input[name="cpu"][value="m4_max"]')?.closest('label')?.querySelector('strong');
    if (cpuDefaultStrong) cpuDefaultStrong.textContent = `${product.specs.cpu} (Baseline Configuration)`;
  }
  if (product.specs?.ram) {
    const ramDefaultStrong = document.querySelector('input[name="ram"][value="64"]')?.closest('label')?.querySelector('strong');
    if (ramDefaultStrong) ramDefaultStrong.textContent = product.specs.ram;
  }
  if (product.specs?.storage) {
    const storageDefaultSpan = document.querySelector('input[name="storage"][value="2tb"]')?.closest('label')?.querySelector('span:first-of-type, strong');
    if (storageDefaultSpan) storageDefaultSpan.textContent = product.specs.storage;
  }

  // Configurator price calculation
  function calculatePrice() {
    let additional = 0;
    const selectedRadios = document.querySelectorAll('input[type="radio"]:checked');
    selectedRadios.forEach(radio => {
      additional += parseFloat(radio.getAttribute('data-add') || 0);
    });

    const careCheckbox = document.getElementById('care-addon');
    if (careCheckbox && careCheckbox.checked) {
      additional += 249;
    }

    const qtyInput = document.getElementById('qty-input');
    const qty = parseInt(qtyInput ? qtyInput.value : 1) || 1;

    const unitPrice = Math.max(0, basePrice + additional);
    const totalPrice = unitPrice * qty;
    const formatted = totalPrice.toLocaleString('en-US');

    if (displayPrice) displayPrice.textContent = '$' + formatted;
    if (btnPrice) btnPrice.textContent = formatted;

    return { unitPrice, totalPrice, qty };
  }

  // Radio selection styling & re-calc
  document.querySelectorAll('.options-radio-stack input, .options-three-grid input').forEach(radio => {
    radio.addEventListener('change', (e) => {
      const groupName = e.target.name;
      document.querySelectorAll(`input[name="${groupName}"]`).forEach(r => {
        const card = r.closest('.config-option-card, .ram-card-item, .storage-card-item');
        if (card) card.classList.remove('selected');
      });
      const currentCard = e.target.closest('.config-option-card, .ram-card-item, .storage-card-item');
      if (currentCard) currentCard.classList.add('selected');

      calculatePrice();
    });
  });

  const careAddon = document.getElementById('care-addon');
  if (careAddon) {
    careAddon.addEventListener('change', calculatePrice);
  }

  // Quantity controls
  const qtyInput = document.getElementById('qty-input');
  const plusBtn = document.getElementById('plus-btn');
  const minusBtn = document.getElementById('minus-btn');

  if (plusBtn) {
    plusBtn.addEventListener('click', () => {
      qtyInput.value = parseInt(qtyInput.value || 1) + 1;
      calculatePrice();
    });
  }

  if (minusBtn) {
    minusBtn.addEventListener('click', () => {
      if (parseInt(qtyInput.value || 1) > 1) {
        qtyInput.value = parseInt(qtyInput.value) - 1;
        calculatePrice();
      }
    });
  }

  // Wishlist button handling
  const wishlistBtn = document.getElementById('wishlist-btn');
  function updateWishBtn() {
    if (!wishlistBtn) return;
    const active = wishlistStore.has(product.id);
    wishlistBtn.classList.toggle('active', active);
    const icon = wishlistBtn.querySelector('i');
    if (icon) {
      icon.className = active ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
    }
  }

  updateWishBtn();
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', () => {
      wishlistStore.toggle(product.id, product);
      updateWishBtn();
    });
  }

  // Add To Cart handling
  const configForm = document.getElementById('configurator-form');
  const submitBtn = document.querySelector('.primary-add-cart-btn');

  if (configForm) {
    configForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const { unitPrice, qty } = calculatePrice();

      const selectedCpu = document.querySelector('input[name="cpu"]:checked')?.value || 'm4_max';
      const selectedRam = document.querySelector('input[name="ram"]:checked')?.value || '64';
      const selectedStorage = document.querySelector('input[name="storage"]:checked')?.value || '2tb';

      const configuredSpecs = {
        cpu: selectedCpu.toUpperCase(),
        ram: `${selectedRam} GB`,
        storage: `${selectedStorage.toUpperCase()} SSD`
      };

      cartStore.addToCart(product.id, qty, {
        id: product.id,
        name: product.name,
        price: unitPrice,
        image: product.image,
        specs: configuredSpecs
      });

      if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Added to Cart!';
        submitBtn.style.background = '#16a34a';
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '#0047ff';
        }, 2000);
      }
    });
  }

  // Buy Now / Express Checkout
  const buyNowBtn = document.getElementById('buy-now-btn');
  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', () => {
      const { unitPrice, qty } = calculatePrice();
      cartStore.addToCart(product.id, qty, {
        id: product.id,
        name: product.name,
        price: unitPrice,
        image: product.image
      });
      window.location.href = 'checkout.html';
    });
  }

  // Mini peripheral Add buttons
  document.querySelectorAll('.add-mini-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const card = this.closest('.peripheral-card');
      const title = card ? card.querySelector('h4')?.textContent : 'Accessory';
      const priceText = card ? card.querySelector('.price')?.textContent : '$199';
      const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 199;

      cartStore.addToCart(`acc-${Date.now().toString(36)}`, 1, {
        name: title,
        price: price,
        image: card?.querySelector('img')?.src || 'assets/hero-laptop.jpg',
        specs: { type: 'Accessory' }
      });

      this.textContent = 'Added ✓';
      this.style.background = '#dcfce7';
      this.style.color = '#15803d';
      setTimeout(() => {
        this.textContent = 'Add +';
        this.style.background = '#eff6ff';
        this.style.color = '#2563eb';
      }, 2000);
    });
  });

  // Review submission button
  const reviewBtn = document.querySelector('.submit-bench-btn');
  if (reviewBtn) {
    reviewBtn.addEventListener('click', () => {
      alert('Thank you for contributing! Your benchmark review has been queued for verification.');
    });
  }
});
