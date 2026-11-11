
import { wishlistStore } from "../stores/wishlistStore.js";

// Page elements
const productGrid = document.getElementById("product-grid");
const emptyWishlist = document.getElementById("empty-wishlist");
const wishlistCount = document.getElementById("wishlist-count");
const sortSelect = document.getElementById("sort");
const clearButton = document.getElementById("clear-wishlist");
const statusMessage = document.getElementById("status-message");

const totalElement = document.getElementById("wishlist-total");
const savingsElement = document.getElementById("wishlist-savings");

const shareButton = document.getElementById("share-wishlist");
const moveAllButton = document.getElementById("move-all-cart");
const priceAlertsButton = document.getElementById("price-alerts");
const enablePriceAlertsButton = document.getElementById("enable-price-alerts");

let wishlistProducts = [];

// Show status messages
function showMessage(message, isError = false) {
    if (!statusMessage) return;

    statusMessage.textContent = message;
    statusMessage.classList.toggle("error", isError);
    statusMessage.classList.toggle("success", !isError && Boolean(message));
}

// Format prices
function formatPrice(price) {
    const amount = Number(price) || 0;

    return `${amount.toLocaleString("en-US", {
        maximumFractionDigits: 2
    })} EGP`;
}

// Read product specifications
function getProductSpecs(product) {
    if (!product.specs) return {};

    if (typeof product.specs === "object") {
        return product.specs;
    }

    try {
        return JSON.parse(product.specs);
    } catch (error) {
        console.error("Invalid product specifications:", error);
        return {};
    }
}

// Update wishlist summary
function updateSummary() {
    const total = wishlistProducts.reduce(
        (sum, product) => sum + (Number(product.price) || 0),
        0
    );

    const savings = wishlistProducts.reduce((sum, product) => {
        const currentPrice = Number(product.price) || 0;
        const oldPrice = Number(product.old_price) || 0;

        return sum + Math.max(oldPrice - currentPrice, 0);
    }, 0);

    if (wishlistCount) {
        wishlistCount.textContent = wishlistProducts.length;
    }

    if (totalElement) {
        totalElement.textContent = formatPrice(total);
    }

    if (savingsElement) {
        savingsElement.textContent = formatPrice(savings);
    }
}

// Create specification element
function createSpecItem(label, value) {
    if (!value) return null;

    const item = document.createElement("p");

    const strong = document.createElement("strong");
    strong.textContent = `${label}: `;

    item.append(strong, document.createTextNode(String(value)));

    return item;
}

// Create product card
function createProductCard(product) {
    const card = document.createElement("article");
    card.className = "product-card";

    // Image
    const imageContainer = document.createElement("div");
    imageContainer.className = "product-image";

    const image = document.createElement("img");
    image.src = product.image || "";
    image.alt = product.name || "Laptop";
    image.loading = "lazy";

    image.onerror = () => {
        imageContainer.classList.add("image-unavailable");
        image.remove();
    };

    imageContainer.appendChild(image);

    // Information
    const info = document.createElement("div");
    info.className = "product-info";

    const brand = document.createElement("span");
    brand.className = "product-brand";
    brand.textContent = "LAPTOP STORE";

    const name = document.createElement("h2");
    name.textContent = product.name || "Unnamed Product";

    // Specifications
    const specs = getProductSpecs(product);
    const specifications = document.createElement("div");
    specifications.className = "product-specs";

    const specItems = [
        ["CPU", specs.cpu],
        ["RAM", specs.ram],
        ["Storage", specs.storage],
        ["GPU", specs.gpu],
        ["Display", specs.display]
    ];

    specItems.forEach(([label, value]) => {
        const item = createSpecItem(label, value);
        if (item) specifications.appendChild(item);
    });

    if (!specifications.children.length) {
        const noSpecs = document.createElement("p");
        noSpecs.className = "no-specs";
        noSpecs.textContent = "Specifications not available";
        specifications.appendChild(noSpecs);
    }

    // Rating
    const rating = document.createElement("p");
    rating.className = "rating";

    const productRating = Number(product.rating) || 0;
    const reviewsCount = Number(product.reviews_count) || 0;

    rating.textContent = productRating > 0
        ? `★ ${productRating.toFixed(1)} (${reviewsCount} reviews)`
        : "No ratings yet";

    // Price
    const priceContainer = document.createElement("div");
    priceContainer.className = "product-price";

    const currentPrice = document.createElement("span");
    currentPrice.className = "price";
    currentPrice.textContent = formatPrice(product.price);

    priceContainer.appendChild(currentPrice);

    const oldPriceValue = Number(product.old_price) || 0;
    const currentPriceValue = Number(product.price) || 0;

    if (oldPriceValue > currentPriceValue) {
        const oldPrice = document.createElement("span");
        oldPrice.className = "old-price";
        oldPrice.textContent = formatPrice(oldPriceValue);
        priceContainer.appendChild(oldPrice);
    }

    // Stock
    const stock = document.createElement("p");
    const inStock = Number(product.stock) > 0;

    stock.className = inStock ? "stock" : "stock out";
    stock.textContent = inStock
        ? `In Stock (${Number(product.stock)} available)`
        : "Out of Stock";

    // Actions
    const actions = document.createElement("div");
    actions.className = "card-actions";

    const detailsLink = document.createElement("a");
    detailsLink.className = "button";
    detailsLink.href = `product.php?id=${encodeURIComponent(product.id)}`;
    detailsLink.textContent = "View Details";

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-button";
    removeButton.textContent = "Remove";

    removeButton.addEventListener("click", () => {
        removeProduct(product.id, removeButton);
    });

    actions.append(detailsLink, removeButton);

    info.append(
        brand,
        name,
        specifications,
        rating,
        priceContainer,
        stock,
        actions
    );

    card.append(imageContainer, info);

    return card;
}

// Sort products
function getSortedProducts() {
    const products = [...wishlistProducts];

    if (sortSelect?.value === "low") {
        products.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortSelect?.value === "high") {
        products.sort((a, b) => Number(b.price) - Number(a.price));
    } else {
        products.sort((a, b) => {
            return new Date(b.added_at || 0) - new Date(a.added_at || 0);
        });
    }

    return products;
}

// Render wishlist
function renderWishlist() {
    if (!productGrid || !emptyWishlist) return;

    productGrid.replaceChildren();

    const isEmpty = wishlistProducts.length === 0;

    productGrid.hidden = isEmpty;
    emptyWishlist.hidden = !isEmpty;

    if (clearButton) clearButton.disabled = isEmpty;
    if (moveAllButton) moveAllButton.disabled = isEmpty;
    if (shareButton) shareButton.disabled = isEmpty;

    updateSummary();

    if (isEmpty) return;

    getSortedProducts().forEach(product => {
        productGrid.appendChild(createProductCard(product));
    });
}

// Remove one product
async function removeProduct(productId, button) {
    button.disabled = true;

    try {
        await wishlistStore.remove(productId);

        wishlistProducts = wishlistProducts.filter(
            product => Number(product.id) !== Number(productId)
        );

        renderWishlist();
        showMessage("Product removed from your wishlist.");
    } catch (error) {
        showMessage(error.message, true);
        button.disabled = false;
    }
}

// Clear wishlist
async function clearWishlist() {
    if (!wishlistProducts.length) return;

    const confirmed = window.confirm(
        "Are you sure you want to clear your wishlist?"
    );

    if (!confirmed) return;

    clearButton.disabled = true;

    try {
        await wishlistStore.clear();

        wishlistProducts = [];
        renderWishlist();

        showMessage("Your wishlist has been cleared.");
    } catch (error) {
        showMessage(error.message, true);
        clearButton.disabled = false;
    }
}

// Share wishlist
async function shareWishlist() {
    if (!wishlistProducts.length) {
        showMessage("Your wishlist is empty.", true);
        return;
    }

    const productNames = wishlistProducts
        .map(product => `- ${product.name}`)
        .join("\n");

    const shareText =
        `My Laptop Store Wishlist\n\n${productNames}\n\n${window.location.href}`;

    try {
        if (navigator.share) {
            await navigator.share({
                title: "My Laptop Store Wishlist",
                text: shareText,
                url: window.location.href
            });
        } else if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(shareText);
            showMessage("Wishlist details copied successfully.");
        } else {
            showMessage("Sharing is not supported in this browser.", true);
        }
    } catch (error) {
        if (error.name !== "AbortError") {
            showMessage("Could not share the wishlist.", true);
        }
    }
}

// Features not connected yet
function showUnavailableMessage(featureName) {
    showMessage(
        `${featureName} is not available yet. It needs to be connected to the store system.`,
        true
    );
}

// Load wishlist from API
async function loadWishlist() {
    if (productGrid) productGrid.hidden = true;
    if (emptyWishlist) emptyWishlist.hidden = true;

    showMessage("Loading your wishlist...");

    try {
        wishlistProducts = await wishlistStore.getAll();

        if (!Array.isArray(wishlistProducts)) {
            wishlistProducts = [];
        }

        renderWishlist();
        showMessage("");
    } catch (error) {
        wishlistProducts = [];
        renderWishlist();
        showMessage(error.message, true);
    }
}

// Event listeners
clearButton?.addEventListener("click", clearWishlist);
sortSelect?.addEventListener("change", renderWishlist);
shareButton?.addEventListener("click", shareWishlist);

moveAllButton?.addEventListener("click", () => {
    showUnavailableMessage("Move All to Cart");
});

priceAlertsButton?.addEventListener("click", () => {
    showUnavailableMessage("Price Alerts");
});

enablePriceAlertsButton?.addEventListener("click", () => {
    showUnavailableMessage("Price Alerts");
});

// Start page
loadWishlist();
