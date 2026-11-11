<?php session_start(); require_once __DIR__ . "/db.php"; ?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laptop Store - High-Performance Workstations</title>
    <link rel="stylesheet" href="css/pages/products.css">
</head>
<body>

    <!-- Top Header Navigation -->
    <header class="store-header">
        <div class="header-container">
            <a href="index.html" class="logo-area" style="text-decoration:none; color:inherit;">
                <span class="logo-icon">💻</span>
                <span class="logo-text">Laptop Store</span>
            </a>
            <div class="search-bar-area">
                <select id="category-select">
                    <option value="">All Categories</option>
                </select>
                <input type="text" id="search-input" placeholder="Search ultra-books, RTX GPUs, specs...">
                <span class="search-shortcut">⌘K</span>
            </div>
            <div class="user-cart-area">
                <a href="cart.html" style="text-decoration:none;">
                    <div class="cart-badge-box">
                        🛒 Cart (0 items) <br><strong>$0.00</strong>
                    </div>
                </a>
                <a href="auth.html" style="text-decoration:none;">
                    <div class="user-avatar" title="Account / Profile">👤</div>
                </a>
            </div>
        </div>
        <nav class="sub-nav">
            <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="products.html" class="active">Products</a></li>
                <li><a href="categories.html">Categories</a></li>
                <li><a href="details.html?id=1">Details</a></li>
                <li><a href="wishlist.html">Wishlist</a></li>
                <li><a href="cart.html">Cart</a></li>
                <li><a href="checkout.html">Checkout</a></li>
                <li><a href="orders.html">Orders</a></li>
                <li><a href="admin/index.html">Admin Portal</a></li>
            </ul>
            <div class="quick-select">
                <span>QUICK SELECT:</span>
                <a href="#">Apple MacBook</a>
                <a href="#">Dell XPS</a>
                <a href="#">Lenovo ThinkPad</a>
                <a href="#">ASUS ROG</a>
            </div>
        </nav>
    </header>

    <!-- Breadcrumb & Status Bar -->
    <div class="breadcrumb-bar">
        <div class="container">
            <span>🏠 Home / Laptops / <strong>All Precision Laptops</strong></span>
            <span class="lab-stock-badge">🔵 148 BENCHMARKED SYSTEMS &nbsp;|&nbsp; Validated Lab Stock</span>
        </div>
    </div>

    <!-- Main Container -->
    <main class="products-page-container">

        <!-- Hero Banner -->
        <section class="hero-banner">
            <div>
                <span class="badge-pill">Q2 2025 ARCHITECTURE &nbsp; Next-Gen RTX 50-Series & Apple M4 Silicon Ready</span>
                <h1>Engineering-Grade Laptops & Portable Workstations</h1>
                <p>Factory stress-tested with Cinebench R24 and 4K Blender thermal loop certification.</p>
            </div>
        </section>

        <!-- Sidebar Filters -->
        <aside class="filters-sidebar">
            <div class="sidebar-header">
                <h2>⚡ Precision Filters</h2>
                <button id="clear-filters" class="btn-reset">Reset</button>
            </div>

            <!-- Price Range -->
            <div class="filter-group">
                <h3>PRICE RANGE &nbsp;&nbsp;&nbsp; <span style="font-size:11px; color:#0047ff;">$999 – $4,999</span></h3>
                <input type="range" id="price-slider" min="999" max="4999" value="4999" class="price-slider">
                <div class="price-inputs">
                    <input type="number" id="min-price" value="999">
                    <input type="number" id="max-price" value="4999">
                </div>
            </div>

            <!-- Availability -->
            <div class="filter-group">
                <h3>AVAILABILITY</h3>
                <div class="checkbox-list">
                    <label class="checkbox-item"><span><input type="checkbox" id="in-stock-checkbox"> In Stock Only</span></label>
                </div>
            </div>

            <!-- Brand & Ecosystem (لسه شكل بس: جدول المنتجات مفيهوش عمود براند) -->
            <div class="filter-group">
                <h3>BRAND & ECOSYSTEM</h3>
                <div class="checkbox-list">
                    <label class="checkbox-item"><input type="checkbox" checked> Apple <span class="count-badge">(28)</span></label>
                    <label class="checkbox-item"><input type="checkbox"> Dell XPS & Precision <span class="count-badge">(34)</span></label>
                    <label class="checkbox-item"><input type="checkbox"> Lenovo ThinkPad / Legion <span class="count-badge">(42)</span></label>
                    <label class="checkbox-item"><input type="checkbox"> ASUS ROG & ProArt <span class="count-badge">(26)</span></label>
                    <label class="checkbox-item"><input type="checkbox"> Razer Blade <span class="count-badge">(18)</span></label>
                    <label class="checkbox-item"><input type="checkbox"> HP OMEN / ZBook <span class="count-badge">(20)</span></label>
                </div>
            </div>

            <!-- Purpose & Form (بيتملي من الأقسام عن طريق products.js) -->
            <div class="filter-group">
                <h3>PURPOSE & FORM</h3>
                <div class="tags-cloud" id="purpose-tags"></div>
            </div>
        </aside>

        <!-- Main Content Area -->
        <section class="products-main-content">

            <!-- Applied Filters Bar -->
            <div class="active-filters-bar">
                <div class="applied-tags" id="applied-tags"></div>
                <div class="sort-view-options">
                    <label style="font-size:12px; color:#64748b;">Sort:</label>
                    <select id="sort-select">
                        <option value="performance">Performance: High to Low</option>
                        <option value="price-low-high">Price: Low to High</option>
                        <option value="price-high-low">Price: High to Low</option>
                        <option value="rating">Rating</option>
                    </select>
                    <div class="view-icons">
                        <button class="icon-btn active">⏹</button>
                        <button class="icon-btn">☰</button>
                    </div>
                </div>
            </div>

            <!-- Products Grid -->
            <div id="products-grid" class="products-grid">
                <!-- المنتجات يتم تعبئتها ديناميكياً عبر JavaScript -->
            </div>

            <!-- Pagination Bar (بيتبني من js/components/pagination.js) -->
            <div id="pagination" class="pagination-container"></div>

            <!-- Feature Highlight Box -->
            <div class="feature-highlight-card">
                <div class="icon-box">💻</div>
                <div class="text-content">
                    <h4>Can't decide between silicon configurations?</h4>
                    <p>Check real-world frame rates in Cyberpunk 2077 or DaVinci Resolve 4K timeline export benchmarks.</p>
                </div>
                <button class="outline-btn">View FPS Benchmark Matrix</button>
            </div>
        </section>

    </main>

    <!-- Footer -->
    <footer class="store-footer">
        <div class="footer-container">
            <div class="footer-col">
                <div class="logo-area">Laptop Store</div>
                <p>Premier computing retail platform delivering benchmarked workstations, high-fidelity gaming laptops, and ultra-thin executive devices.</p>
                <p class="cert">✔ ISO 9001:2020 Certified Guarantee<br>📞 24/7 Priority Tech Support: 1-800-LAPTOP</p>
            </div>
            <div class="footer-col">
                <h4>Navigation</h4>
                <ul>
                    <li><a href="index.html">Home</a></li>
                    <li><a href="products.html">Products Catalog</a></li>
                    <li><a href="categories.html">Categories & Brands</a></li>
                    <li><a href="details.html?id=1">Product Details</a></li>
                    <li><a href="cart.html">Cart</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Customer Care</h4>
                <ul>
                    <li><a href="auth.html">Account / Profile</a></li>
                    <li><a href="orders.html">Track Orders</a></li>
                    <li><a href="checkout.html">Express Checkout</a></li>
                    <li><a href="wishlist.html">Wishlist</a></li>
                    <li><a href="admin/index.html">Admin Portal</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h4>Pro & Enterprise</h4>
                <ul>
                    <li><a href="#">Corporate B2B Sales</a></li>
                    <li><a href="#">Educational Discounts</a></li>
                    <li><a href="#">Fleet IT Deployments</a></li>
                </ul>
            </div>
            <div class="footer-col newsletter">
                <h4>STAY CONNECTED</h4>
                <p>Subscribe for exclusive hardware drops and benchmark briefs.</p>
                <div class="subscribe-box">
                    <input type="email" placeholder="Enter company email">
                    <button>JOIN</button>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <span>VERIFIED SECURE: 🔒 256-Bit SSL Encryption &nbsp;|&nbsp;  Apple Pay &nbsp;|&nbsp; 💳 Visa / Mastercard &nbsp;|&nbsp; 🅿️ PayPal & Affirm 0% APR</span>
            <div class="footer-links">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Security Audits</a>
            </div>
            <p class="copy">© 2026 Laptop Store Inc. All specifications and performance metrics verified by internal testing labs.</p>
        </div>
    </footer>

    <script type="module" src="js/pages/products.js"></script>
</body>
</html>