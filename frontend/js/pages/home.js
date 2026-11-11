// js/pages/home.js
import { cartStore } from '../stores/cartStore.js';
import { wishlistStore } from '../stores/wishlistStore.js';
import { authStore } from '../stores/authStore.js';
import { productsStore } from '../stores/productsStore.js';
import { initGlobalNavbar } from '../components/navbar.js';

const slugToId = {
  'zenith-pro-16': 1,
  'aura-studio': 2,
  'titan-forge': 3,
  'innovate-carbon': 4
};

document.addEventListener('DOMContentLoaded', async () => {
  // Init navbar and stores
  initGlobalNavbar();
  try {
    await productsStore.init();
  } catch (e) {}

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* ---------- Header: search, mobile nav ---------- */
  const searchToggle = $("#search-toggle");
  const searchBar = $("#search-bar");
  const siteSearch = $("#site-search");
  const menuToggle = $("#menu-toggle");
  const navMobile = $("#nav-mobile");

  if (searchToggle && searchBar) {
    searchToggle.addEventListener("click", () => {
      const open = searchBar.hasAttribute("hidden");
      searchBar.toggleAttribute("hidden", !open);
      if (open && siteSearch) siteSearch.focus();
    });
  }

  if (menuToggle && navMobile) {
    menuToggle.addEventListener("click", () => {
      const open = navMobile.hasAttribute("hidden");
      navMobile.toggleAttribute("hidden", !open);
      menuToggle.setAttribute("aria-expanded", String(open));
    });

    $$(".nav-mobile a").forEach((link) => {
      link.addEventListener("click", () => {
        navMobile.setAttribute("hidden", "");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  if (siteSearch) {
    siteSearch.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      const q = siteSearch.value.trim();
      if (!q) return;
      window.location.href = `products.html?search=${encodeURIComponent(q)}`;
    });
  }

  /* ---------- Cart Drawer Sync ---------- */
  const cartDrawer = $("#cart-drawer");
  const overlay = $("#overlay");
  const cartItems = $("#cart-items");
  const cartEmpty = $("#cart-empty");
  const cartCount = $("#cart-count");
  const cartSubtotal = $("#cart-subtotal");
  const cartToggle = $("#cart-toggle");
  const cartClose = $("#cart-close");
  const checkoutBtn = $("#checkout-btn");

  function money(n) {
    return `$${Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  function openCart() {
    if (!cartDrawer || !overlay) return;
    renderDrawerCart();
    cartDrawer.classList.add("is-open");
    cartDrawer.setAttribute("aria-hidden", "false");
    overlay.hidden = false;
  }

  function closeCart() {
    if (!cartDrawer || !overlay) return;
    cartDrawer.classList.remove("is-open");
    cartDrawer.setAttribute("aria-hidden", "true");
    overlay.hidden = true;
  }

  if (cartToggle) cartToggle.addEventListener("click", openCart);
  if (cartClose) cartClose.addEventListener("click", closeCart);
  if (overlay) overlay.addEventListener("click", closeCart);

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      window.location.href = "checkout.html";
    });
  }

  function renderDrawerCart() {
    if (!cartItems || !cartEmpty || !cartSubtotal) return;
    const items = cartStore.getItems();
    const count = cartStore.getCount();

    if (cartCount) {
      cartCount.textContent = count;
      cartCount.toggleAttribute("hidden", count === 0);
    }

    if (items.length === 0) {
      cartItems.innerHTML = "";
      cartEmpty.hidden = false;
      cartSubtotal.textContent = "$0.00";
      return;
    }

    cartEmpty.hidden = true;
    cartItems.innerHTML = items.map(item => `
      <li class="cart-item" data-id="${item.id}" style="display: flex; gap: 12px; align-items: center; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.08);">
        <img src="${item.image || 'assets/hero-laptop.jpg'}" alt="${item.name}" style="width: 54px; height: 54px; object-fit: contain; border-radius: 6px; background: rgba(255,255,255,0.05); padding: 4px;" onerror="this.src='assets/hero-laptop.jpg'">
        <div style="flex: 1; min-width: 0;">
          <h4 style="font-size: 13px; font-weight: 600; margin: 0 0 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #fff;">${item.name}</h4>
          <p style="font-size: 12px; color: #38bdf8; margin: 0;">${money(item.price)} × ${item.quantity}</p>
        </div>
        <div style="display: flex; align-items: center; gap: 6px;">
          <button class="drawer-qty-btn" data-action="decrease" data-id="${item.id}" style="background: rgba(255,255,255,0.1); border: none; color: #fff; width: 24px; height: 24px; border-radius: 4px; cursor: pointer;">-</button>
          <span style="font-size: 13px; font-weight: 600; min-width: 16px; text-align: center; color: #fff;">${item.quantity}</span>
          <button class="drawer-qty-btn" data-action="increase" data-id="${item.id}" style="background: rgba(255,255,255,0.1); border: none; color: #fff; width: 24px; height: 24px; border-radius: 4px; cursor: pointer;">+</button>
          <button class="drawer-remove-btn" data-id="${item.id}" style="background: none; border: none; color: #ef4444; margin-left: 6px; cursor: pointer; font-size: 14px;">✕</button>
        </div>
      </li>
    `).join('');

    cartSubtotal.textContent = money(cartStore.getSubtotal());

    // Bind drawer buttons
    cartItems.querySelectorAll('.drawer-qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const action = btn.getAttribute('data-action');
        if (action === 'increase') cartStore.increaseQuantity(id);
        else cartStore.decreaseQuantity(id);
        renderDrawerCart();
      });
    });

    cartItems.querySelectorAll('.drawer-remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        cartStore.removeFromCart(id);
        renderDrawerCart();
      });
    });
  }

  // Toast function
  function showToast(msg) {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("is-visible");
    setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 2800);
  }

  /* ---------- Add To Cart Buttons ---------- */
  $$(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      const slug = btn.getAttribute("data-id");
      const numId = slugToId[slug] || Number(slug) || 1;
      const name = btn.getAttribute("data-name") || "Engineered Laptop";
      const price = parseFloat(btn.getAttribute("data-price")) || 1999;

      cartStore.addToCart(numId, 1, {
        id: numId,
        name: name,
        price: price,
        image: `assets/images/products/${numId === 1 ? 'zenith-pro-16.jpeg' : numId === 2 ? 'apex-14.jpeg' : numId === 3 ? 'vortex-18.jpeg' : 'flexbook-13.jpeg'}`
      });

      showToast(`Added “${name}” to your cart`);
      openCart();
    });
  });

  /* ---------- Wishlist Buttons ---------- */
  function updateWishButtons() {
    $$(".wish-btn").forEach(btn => {
      const slug = btn.getAttribute("data-wish");
      const numId = slugToId[slug] || Number(slug) || 1;
      const active = wishlistStore.has(numId);
      btn.classList.toggle("is-active", active);
      const svg = btn.querySelector("svg path");
      if (svg) {
        svg.style.fill = active ? "#ef4444" : "none";
        svg.style.stroke = active ? "#ef4444" : "currentColor";
      }
    });
  }

  $$(".wish-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const slug = btn.getAttribute("data-wish");
      const numId = slugToId[slug] || Number(slug) || 1;
      const res = wishlistStore.toggle(numId);
      updateWishButtons();
      showToast(res.status === 'added' ? 'Added to your Wishlist ♥' : 'Removed from Wishlist');
    });
  });

  updateWishButtons();
  window.addEventListener('wishlist-updated', updateWishButtons);
  window.addEventListener('cart-updated', renderDrawerCart);

  /* ---------- Product Filtering (Category Tabs) ---------- */
  const filterBtns = $$(".filter-btn");
  const productCards = $$(".product-card");
  const emptyFilter = $("#empty-filter");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const filter = btn.getAttribute("data-filter");

      let count = 0;
      productCards.forEach(card => {
        const cat = card.getAttribute("data-category") || "";
        const match = filter === "all" || cat.includes(filter);
        card.classList.toggle("is-hidden", !match);
        if (match) count++;
      });

      if (emptyFilter) {
        emptyFilter.hidden = count > 0;
      }
    });
  });

  /* ---------- Interactive Benchmarks & Calculator ---------- */
  const benchSlider = $("#bench-slider");
  const benchWorkload = $("#bench-workload");
  const benchBars = $$(".bench-bar");

  function updateBenchmarks() {
    if (!benchSlider || !benchWorkload) return;
    const val = Number(benchSlider.value);
    const workloads = {
      1: { name: "8K ProRAW Timeline Scrubbing", apex: 98, rivalA: 64, rivalB: 52 },
      2: { name: "3D Blender Cycles Raytracing", apex: 95, rivalA: 71, rivalB: 58 },
      3: { name: "LLM Local Token Generation", apex: 99, rivalA: 55, rivalB: 48 },
      4: { name: "Multi-Track Unreal Engine 5 Bake", apex: 92, rivalA: 68, rivalB: 60 }
    };
    const current = workloads[val] || workloads[1];
    benchWorkload.textContent = current.name;

    const barApex = $("#bench-apex");
    const barA = $("#bench-rival-a");
    const barB = $("#bench-rival-b");

    if (barApex) barApex.style.width = `${current.apex}%`;
    if (barA) barA.style.width = `${current.rivalA}%`;
    if (barB) barB.style.width = `${current.rivalB}%`;
  }

  if (benchSlider) {
    benchSlider.addEventListener("input", updateBenchmarks);
    updateBenchmarks();
  }

  /* ---------- Newsletter Form ---------- */
  const newsletterForm = $("#newsletter-form");
  const formMsg = $("#form-msg");

  if (newsletterForm && formMsg) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = $("#email")?.value.trim();
      if (!email || !email.includes("@")) {
        formMsg.textContent = "Please enter a valid work or personal email.";
        formMsg.style.color = "#ef4444";
        return;
      }
      formMsg.textContent = "✓ VIP Pass Active! Promo code VIP-LAUNCH-EARLY saved to your clipboard.";
      formMsg.style.color = "#22c55e";
      cartStore.applyPromo("VIP-LAUNCH-EARLY");
      showToast("Applied $150 VIP Discount automatically!");
      newsletterForm.reset();
    });
  }

  /* ---------- Smooth CTA scrolling ---------- */
  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
    });
  });

  // Render initial drawer state
  renderDrawerCart();
});
