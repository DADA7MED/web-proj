// js/pages/wishlist.js
import { wishlistStore } from "../stores/wishlistStore.js";
import { cartStore } from "../stores/cartStore.js";
import { initGlobalNavbar } from "../components/navbar.js";

const productGrid = document.getElementById("product-grid");
const emptyWishlist = document.getElementById("empty-wishlist");
const wishlistCount = document.getElementById("wishlist-count");
const sortSelect = document.getElementById("sort");
const clearButton = document.getElementById("clear-wishlist");
const statusMessage = document.getElementById("status-message");

const totalElement = document.getElementById("wishlist-total");
const savingsElement = document.getElementById("wishlist-savings");

const moveAllButton = document.getElementById("move-all-cart");

let wishlistProducts = [];

function showMessage(message, isError = false) {
    if (!statusMessage) return;
    statusMessage.textContent = message;
    statusMessage.classList.toggle("error", isError);
    statusMessage.classList.toggle("success", !isError && Boolean(message));
    setTimeout(() => {
        if (statusMessage) statusMessage.textContent = "";
    }, 2500);
}

function formatPrice(price) {
    const amount = Number(price) || 0;
    return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getProductSpecs(product) {
    if (!product.specs) return {};
    if (typeof product.specs === "object") return product.specs;
    try {
        return JSON.parse(product.specs);
    } catch {
        return {};
    }
}

function updateSummary() {
    const total = wishlistProducts.reduce((sum, p) => sum + (Number(p.price) || 0), 0);
    const savings = wishlistProducts.reduce((sum, p) => {
        const cur = Number(p.price) || 0;
        const old = Number(p.old_price) || 0;
        return sum + Math.max(old - cur, 0);
    }, 0);

    if (wishlistCount) wishlistCount.textContent = wishlistProducts.length;
    if (totalElement) totalElement.textContent = formatPrice(total);
    if (savingsElement) savingsElement.textContent = formatPrice(savings);
}

function createSpecItem(label, value) {
    if (!value) return null;
    const item = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = `${label}: `;
    item.append(strong, document.createTextNode(String(value)));
    return item;
}

function createProductCard(product) {
    const card = document.createElement("article");
    card.className = "product-card";

    // Image
    const imageContainer = document.createElement("div");
    imageContainer.className = "product-image";

    const image = document.createElement("img");
    image.src = product.image || "assets/hero-laptop.jpg";
    image.alt = product.name || "Laptop";
    image.loading = "lazy";
    image.onerror = () => { image.src = "assets/hero-laptop.jpg"; };
    imageContainer.appendChild(image);

    // Info
    const info = document.createElement("div");
    info.className = "product-info";

    const brand = document.createElement("span");
    brand.className = "product-brand";
    brand.textContent = product.brand || "APEX WORKSTATIONS";

    const name = document.createElement("h2");
    const nameLink = document.createElement("a");
    nameLink.href = `details.html?id=${product.id}`;
    nameLink.textContent = product.name || "Engineered Laptop";
    nameLink.style.color = "inherit";
    nameLink.style.textDecoration = "none";
    name.appendChild(nameLink);

    // Specs
    const specs = getProductSpecs(product);
    const specifications = document.createElement("div");
    specifications.className = "product-specs";

    const specItems = [
        ["CPU", specs.cpu],
        ["RAM", specs.ram],
        ["Storage", specs.storage],
        ["GPU", specs.gpu]
    ];

    specItems.forEach(([label, value]) => {
        const item = createSpecItem(label, value);
        if (item) specifications.appendChild(item);
    });

    // Rating
    const rating = document.createElement("p");
    rating.className = "rating";
    const productRating = Number(product.rating) || 4.9;
    const reviewsCount = Number(product.reviews_count) || 24;
    rating.textContent = `★ ${productRating.toFixed(1)} (${reviewsCount} reviews)`;

    // Price
    const priceContainer = document.createElement("div");
    priceContainer.className = "product-price";

    const currentPrice = document.createElement("span");
    currentPrice.className = "price";
    currentPrice.textContent = formatPrice(product.price);
    priceContainer.appendChild(currentPrice);

    if (Number(product.old_price) > Number(product.price)) {
        const oldPrice = document.createElement("span");
        oldPrice.className = "old-price";
        oldPrice.textContent = formatPrice(product.old_price);
        priceContainer.appendChild(oldPrice);
    }

    // Actions
    const actions = document.createElement("div");
    actions.className = "product-actions";

    const addToCartButton = document.createElement("button");
    addToCartButton.type = "button";
    addToCartButton.className = "btn btn-primary";
    addToCartButton.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Move to Cart';
    addToCartButton.addEventListener("click", () => {
        cartStore.addToCart(product.id, 1, product);
        wishlistStore.remove(product.id);
        showMessage(`“${product.name}” moved to cart!`);
        loadWishlist();
    });

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "btn btn-danger";
    removeButton.innerHTML = '<i class="fa-solid fa-trash-can"></i> Remove';
    removeButton.addEventListener("click", () => {
        wishlistStore.remove(product.id);
        showMessage("Item removed from wishlist.");
        loadWishlist();
    });

    actions.append(addToCartButton, removeButton);
    info.append(brand, name, specifications, rating, priceContainer, actions);
    card.append(imageContainer, info);

    return card;
}

function renderWishlist() {
    if (!productGrid || !emptyWishlist) return;

    productGrid.innerHTML = "";
    if (wishlistProducts.length === 0) {
        emptyWishlist.style.display = "block";
        productGrid.style.display = "none";
    } else {
        emptyWishlist.style.display = "none";
        productGrid.style.display = "grid";
        wishlistProducts.forEach(product => {
            productGrid.appendChild(createProductCard(product));
        });
    }

    updateSummary();
}

function sortProducts(criteria) {
    switch (criteria) {
        case "price-low":
            wishlistProducts.sort((a, b) => Number(a.price) - Number(b.price));
            break;
        case "price-high":
            wishlistProducts.sort((a, b) => Number(b.price) - Number(a.price));
            break;
        case "name":
            wishlistProducts.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
            break;
        default:
            break;
    }
    renderWishlist();
}

function loadWishlist() {
    wishlistProducts = wishlistStore.getAll();
    if (sortSelect) sortProducts(sortSelect.value);
    else renderWishlist();
}

document.addEventListener("DOMContentLoaded", () => {
    initGlobalNavbar();
    loadWishlist();

    sortSelect?.addEventListener("change", (e) => sortProducts(e.target.value));

    clearButton?.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear your wishlist?")) {
            wishlistStore.clear();
            showMessage("Wishlist cleared.");
            loadWishlist();
        }
    });

    moveAllButton?.addEventListener("click", () => {
        if (wishlistProducts.length === 0) {
            showMessage("Your wishlist is empty.", true);
            return;
        }
        wishlistProducts.forEach(p => cartStore.addToCart(p.id, 1, p));
        wishlistStore.clear();
        showMessage("All items moved to cart!");
        loadWishlist();
    });

    window.addEventListener("wishlist-updated", loadWishlist);
});
