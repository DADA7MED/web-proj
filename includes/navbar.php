<?php
// includes/navbar.php — Unified Global Navigation Component
?>
<header class="global-navbar">
    <div class="nav-container">
        <a href="index.php" class="nav-logo">
            <span class="logo-icon">💻</span>
            <span class="logo-text">Laptop Store</span>
        </a>

        <div class="nav-search-area">
            <form action="products.php" method="GET" class="search-form">
                <i class="fa-solid fa-magnifying-glass search-icon"></i>
                <input type="text" name="search" placeholder="Search RTX 4090, M4 Max, OLED..." id="global-search-input">
            </form>
        </div>

        <nav class="nav-links">
            <a href="index.php" class="<?= isActive('index') ?>">Home</a>
            <a href="products.php" class="<?= isActive('products') ?>">Laptops</a>
            <a href="categories.php" class="<?= isActive('categories') ?>">Categories</a>
            <a href="wishlist.php" class="<?= isActive('wishlist') ?>">Wishlist</a>
            <a href="cart.php" class="<?= isActive('cart') ?>">Cart</a>
            <a href="orders.php" class="<?= isActive('orders') ?>">Orders</a>
            <a href="admin/index.html" class="admin-link">Admin Portal</a>
        </nav>

        <div class="nav-actions">
            <a href="cart.php" class="cart-action-btn" title="View Cart">
                <i class="fa-solid fa-cart-shopping"></i>
                <span class="cart-count badge" id="global-cart-badge" style="display:none;">0</span>
            </a>
            <a href="auth.php" class="account-action-btn" title="My Account">
                <i class="fa-regular fa-user"></i>
            </a>
        </div>
    </div>
</header>
