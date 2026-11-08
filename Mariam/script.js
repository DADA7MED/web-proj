(() => {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* ---------- Header: search, mobile nav ---------- */
  const searchToggle = $("#search-toggle");
  const searchBar = $("#search-bar");
  const siteSearch = $("#site-search");
  const menuToggle = $("#menu-toggle");
  const navMobile = $("#nav-mobile");

  searchToggle.addEventListener("click", () => {
    const open = searchBar.hasAttribute("hidden");
    searchBar.toggleAttribute("hidden", !open);
    if (open) siteSearch.focus();
  });

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

  siteSearch.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const q = siteSearch.value.trim().toLowerCase();
    if (!q) return;
    document.getElementById("products")?.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
    $$(".product-card").forEach((card) => {
      const hay = card.textContent.toLowerCase();
      card.classList.toggle("is-hidden", !hay.includes(q));
    });
    showToast(`Filtered products for “${siteSearch.value.trim()}”`);
  });

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

  /* ---------- Cart ---------- */
  const cart = [];
  const cartDrawer = $("#cart-drawer");
  const overlay = $("#overlay");
  const cartItems = $("#cart-items");
  const cartEmpty = $("#cart-empty");
  const cartCount = $("#cart-count");
  const cartSubtotal = $("#cart-subtotal");

  function money(n) {
    return `$${n.toLocaleString("en-US")}`;
  }

  function openCart() {
    cartDrawer.classList.add("is-open");
    cartDrawer.setAttribute("aria-hidden", "false");
    overlay.hidden = false;
  }

  function closeCart() {
    cartDrawer.classList.remove("is-open");
    cartDrawer.setAttribute("aria-hidden", "true");
    overlay.hidden = true;
  }

  function renderCart() {
    const totalQty = cart.reduce((s, i) => s + i.qty, 0);
    const total = cart.reduce((s, i) => s + i.qty * i.price, 0);
    cartCount.textContent = String(totalQty);
    cartCount.hidden = totalQty === 0;
    cartSubtotal.textContent = money(total);
    cartEmpty.hidden = cart.length > 0;
    cartItems.innerHTML = cart
      .map(
        (item) => `
        <li>
          <div>
            <strong>${item.name}</strong>
            <div class="label">${money(item.price)} × ${item.qty}</div>
          </div>
          <div>
            <button class="qty-btn" data-act="dec" data-id="${item.id}" aria-label="Decrease">−</button>
            <button class="qty-btn" data-act="inc" data-id="${item.id}" aria-label="Increase">+</button>
            <button class="remove-item" data-act="rm" data-id="${item.id}">Remove</button>
          </div>
        </li>`
      )
      .join("");
  }

  function addToCart({ id, name, price }) {
    const existing = cart.find((i) => i.id === id);
    if (existing) existing.qty += 1;
    else cart.push({ id, name, price: Number(price), qty: 1 });
    renderCart();
    showToast(`${name} added to cart`);
  }

  $$(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      addToCart(btn.dataset);
    });
  });

  cartItems.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-act]");
    if (!btn) return;
    const item = cart.find((i) => i.id === btn.dataset.id);
    if (!item) return;
    if (btn.dataset.act === "inc") item.qty += 1;
    if (btn.dataset.act === "dec") item.qty -= 1;
    if (btn.dataset.act === "rm" || item.qty <= 0) {
      const idx = cart.findIndex((i) => i.id === item.id);
      cart.splice(idx, 1);
    }
    renderCart();
  });

  $("#cart-toggle").addEventListener("click", openCart);
  $("#cart-close").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);
  $("#checkout-btn").addEventListener("click", () => {
    if (!cart.length) {
      showToast("Your cart is empty");
      return;
    }
    showToast("Checkout is a demo — silicon is reserved.");
    cart.length = 0;
    renderCart();
    closeCart();
  });

  /* ---------- Wishlist ---------- */
  $$(".wish-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const active = btn.classList.toggle("is-active");
      btn.setAttribute("aria-pressed", String(active));
      const name = btn.closest(".product-card")?.querySelector("h3")?.textContent || "Item";
      showToast(active ? `${name} saved to wishlist` : `${name} removed from wishlist`);
    });
  });

  /* ---------- Product filter ---------- */
  const filterBtns = $$(".filter-btn");
  const productCards = $$(".product-card");
  const emptyFilter = $("#empty-filter");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const key = btn.dataset.filter;
      let visible = 0;
      productCards.forEach((card) => {
        const cats = card.dataset.category.split(" ");
        const show = key === "all" || cats.includes(key);
        card.classList.toggle("is-hidden", !show);
        if (show) visible += 1;
      });
      emptyFilter.hidden = visible > 0;
    });
  });

  /* ---------- Category cards jump to products ---------- */
  $$(".category-card").forEach((card) => {
    card.addEventListener("click", () => {
      const title = card.querySelector("h3").textContent.toLowerCase();
      let filter = "all";
      if (title.includes("gaming")) filter = "gaming";
      else if (title.includes("creator")) filter = "creator";
      else if (title.includes("business") || title.includes("workstation")) filter = "business";
      else if (title.includes("ultrabook") || title.includes("2-in-1")) filter = "student";
      const target = filterBtns.find((b) => b.dataset.filter === filter);
      target?.click();
      $("#products").scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
    });
  });

  /* ---------- Newsletter ---------- */
  const form = $("#newsletter-form");
  const email = $("#email");
  const formMsg = $("#form-msg");
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const value = email.value.trim();
    formMsg.classList.remove("is-error", "is-success");
    if (!emailRe.test(value)) {
      formMsg.textContent = "Enter a valid email to claim the $50 credit.";
      formMsg.classList.add("is-error");
      email.focus();
      return;
    }
    formMsg.textContent = "Credit reserved. Check your inbox for the VIP drop code.";
    formMsg.classList.add("is-success");
    form.reset();
    showToast("$50 credit claimed");
  });

  /* ---------- Specialist / account ---------- */
  $("#specialist-btn").addEventListener("click", () => {
    showToast("A silicon specialist will join this chat shortly.");
  });
  $("#account-btn").addEventListener("click", () => {
    showToast("Account portal is a demo in this landing page.");
  });

  /* ---------- Countdown ---------- */
  const end = Date.now() + 48 * 3600 * 1000 + 12 * 60 * 1000 + 6 * 1000;
  function tick() {
    const diff = Math.max(0, end - Date.now());
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    $("#cd-h").textContent = String(h).padStart(2, "0");
    $("#cd-m").textContent = String(m).padStart(2, "0");
    $("#cd-s").textContent = String(s).padStart(2, "0");
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- Intersection Observer: sections + bars ---------- */
  const revealTargets = $$(".section, .category-card, .product-card, .review-card, .bench-card, .promo-banner, .newsletter-banner");
  revealTargets.forEach((el) => el.classList.add("js-reveal"));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        if (entry.target.classList.contains("bench-card") || entry.target.closest(".benchmarks")) {
          animateBars();
        }
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );
  revealTargets.forEach((el) => io.observe(el));

  let barsDone = false;
  function animateBars() {
    if (barsDone) return;
    barsDone = true;
    $$(".bar-fill").forEach((bar) => {
      const width = bar.dataset.width;
      requestAnimationFrame(() => {
        bar.style.width = prefersReduced ? width : width;
      });
    });
  }

  const benchCard = $(".bench-card");
  if (benchCard) {
    const barIo = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) animateBars();
      },
      { threshold: 0.35 }
    );
    barIo.observe(benchCard);
  }

  /* ---------- Toast ---------- */
  const toast = $("#toast");
  let toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2400);
  }

  renderCart();
})();
