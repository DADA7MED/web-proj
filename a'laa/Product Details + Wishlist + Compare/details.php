<?php
require_once __DIR__ . '/config/database.php';

// جلب المنتج الأساسي من الداتابيز
$stmt = $pdo->query("SELECT * FROM products LIMIT 1");
$product = $stmt->fetch();

if (!$product) {
    die("لا توجد منتجات مسجلة في قاعدة البيانات.");
}

$product_id = $product['id'] ?? 1;

// التحقق من الـ Wishlist
$in_wishlist = false;
try {
    $wishlist_stmt = $pdo->prepare("SELECT * FROM wishlist_items WHERE product_id = ?");
    $wishlist_stmt->execute([$product_id]);
    if ($wishlist_stmt->fetch()) {
        $in_wishlist = true;
    }
} catch (Exception $e) {
    $in_wishlist = false;
}
?>
<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($product['name']) ?> - Product Details & Configurator</title>
    <link rel="stylesheet" href="css/pages/productdetails.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>

    <!-- Top Navigation Header -->
    
        <header class="site-top-header">
    <div class="top-bar-container">
        <div class="logo-area">
            <a href="product.php" style="text-decoration: none; color: inherit;">
                <span class="store-name"><i class="fa-solid fa-laptop"></i> Laptop Store</span>
            </a>
        </div>
        
        <!-- نموذج البحث وقائمة التصنيفات -->
        <form action="products.php" method="GET" class="categories-search-bar">
            <select name="category" class="cat-dropdown" style="border:none; background:transparent; outline:none; font-size:13px; cursor:pointer;">
                <option value="all">All Categories</option>
                <option value="creator">Creator & Studio</option>
                <option value="gaming">Gaming Workstations</option>
                <option value="ultrabooks">Ultra-books</option>
            </select>
            <div class="search-input-box">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input type="text" name="query" placeholder="Search ultra-books, RTX GPUs, specs...">
                <span class="kbd-shortcut">⌘K</span>
            </div>
            <button type="submit" style="display:none;"></button>
        </form>

        <div class="header-right-actions">
            <button id="wishlist-btn" class="wishlist-action-btn <?= $in_wishlist ? 'active' : '' ?>" data-id="<?= $product_id ?>">
                <i class="<?= $in_wishlist ? 'fa-solid' : 'fa-regular' ?> fa-heart"></i> Wishlist
            </button>
            <div class="cart-pill-badge">
                <i class="fa-solid fa-cart-shopping"></i> Cart (3 items) &nbsp; <strong>$2,499.00</strong>
            </div>
            <div class="user-avatar-badge">Anonymous</div>
        </div>
    </div>
        <!-- Sub Navigation Links -->
        <div class="sub-nav-links">
            <div class="nav-links-left">
                <a href="#">Home</a>
                <a href="products.php">Products</a>
                <a href="categories.php">Categories</a>
                <a href="#" class="active">Details</a>
                <a href="#">Cart</a>
                <a href="#">Checkout</a>
                <a href="#">Orders</a>
                <a href="#">Admin Portal</a>
            </div>
            <div class="quick-select-menu">
                <span class="qs-title">QUICK SELECT:</span>
                <a href="#">Apple M3 Max</a>
                <a href="#">Lenovo ThinkPad</a>
                <a href="#">ASUS ROG</a>
            </div>
        </div>
    </header>

    <!-- Flagship Launch Banner -->
    <div class="flagship-launch-banner">
        <p><i class="fa-solid fa-circle" style="font-size: 7px; color: #3b82f6;"></i> <strong>FLAGSHIP LAUNCH:</strong> Complimentary Pelican™ Hard Flight Case & 140W GaN Charging Brick included with every 2025 Zenith Pro. <a href="#">View Shipping Policy →</a></p>
    </div>

    <!-- Breadcrumb -->
    <div class="breadcrumb-trail">
        Home > Laptops > Creator & Studio > <strong><?= htmlspecialchars($product['name']) ?></strong>
    </div>

    <!-- Main Section 1: Product Details & Configurator -->
    <main class="product-details-main">
        <div class="product-main-grid">
            
            <!-- Left Column: Images & Features Grid -->
            <div class="left-column-content">
                <div class="main-display-box">
                    <div class="badge-tag-top">2025 FLAGSHIP WORKSTATION</div>
                    <div class="spin-360-badge"><i class="fa-solid fa-rotate"></i> 360° Studio Spin</div>
                    <div class="color-calibrated-text">Factory Color-Calibrated ΔE < 0.8</div>
                    
                    <img src="<?= htmlspecialchars($product['image']) ?>" alt="<?= htmlspecialchars($product['name']) ?>" class="main-laptop-img">
                    
                    <div class="specs-mini-footer">
                        <span><i class="fa-solid fa-microchip"></i> M4 Max 16C/40C</span>
                        <span><i class="fa-solid fa-memory"></i> 400 GB/s Uni-Mem</span>
                        <span><i class="fa-solid fa-sun"></i> 1,600 Nits Peak</span>
                        <span class="deep-zoom-link">Deep Zoom <i class="fa-solid fa-arrow-right"></i></span>
                    </div>
                </div>

                <!-- Bottom 3 Feature Cards -->
                <div class="features-trio-grid">
                    <div class="feat-card-item">
                        <i class="fa-solid fa-bolt lightning-icon"></i>
                        <h4>Thunderbolt 5</h4>
                        <p>Triple-bus 120 Gbps bandwidth for three 6K external displays.</p>
                    </div>
                    <div class="feat-card-item">
                        <i class="fa-solid fa-snowflake audio-icon"></i>
                        <h4>Sub-28 dB Acoustics</h4>
                        <p>Zero throttling even at continuous 140W sustained multi-core loads.</p>
                    </div>
                    <div class="feat-card-item">
                        <i class="fa-solid fa-battery-full battery-icon"></i>
                        <h4>99.9 Wh Cell</h4>
                        <p>FAA maximum legal flight capacity with 22-hour real battery life.</p>
                    </div>
                </div>
            </div>

            <!-- Right Column: Configurator & Options -->
            <div class="right-column-configurator">
                <div class="sku-dispatch-row">
                    <span class="sku-code">SKU: <?= htmlspecialchars($product['sku']) ?></span>
                    <span class="express-dispatch-stock"><i class="fa-solid fa-circle" style="color: #22c55e; font-size: 8px;"></i> <?= htmlspecialchars($product['stock']) ?> Units Left for Express Dispatch</span>
                </div>

                <h1 class="product-main-title"><?= htmlspecialchars($product['name']) ?></h1>
                <p class="product-desc-lead">Engineered for Unreal Engine 5, 8K DaVinci Resolve rendering, and high-context Local LLM Inference.</p>

                <div class="reviews-stars-row">
                    <div class="stars-gold">★★★★★</div>
                    <span class="rating-num-bold"><?= $product['rating'] ?></span>
                    <span class="reviews-count-text">(<?= $product['reviews_count'] ?> benchmark-verified studio reviews)</span>
                </div>

                <!-- Price Box -->
                <div class="price-display-box">
                    <span class="main-price-val" id="display-price" data-base="<?= $product['price'] ?>">$<?= number_format($product['price'], 0) ?></span>
                    <?php if(!empty($product['old_price'])): ?>
                        <span class="original-price-val">$<?= number_format($product['old_price'], 0) ?></span>
                        <span class="save-instant-badge">SAVE $400 INSTANT</span>
                    <?php endif; ?>
                </div>
                <p class="financing-subtext">Or $120.79/mo for 24 mos with 0% APR via Store Fleet Pre-Qualify ↗</p>

                <form id="configurator-form" action="cart-process.php" method="POST">
                    <input type="hidden" name="product_id" value="<?= $product_id ?>">

                    <!-- 1. Compute Architecture -->
                    <div class="config-section-block">
                        <div class="block-title-row">
                            <h3>1. Compute Architecture</h3>
                            <span class="benchmark-info-link">Benchmark: 38,400 Cinebench R24</span>
                        </div>
                        <div class="options-radio-stack">
                            <label class="config-option-card selected">
                                <input type="radio" name="cpu" value="m4_max" data-add="0" checked>
                                <div class="option-details-text">
                                    <strong>M4 Max (16-Core CPU / 40-Core GPU)</strong>
                                    <span>16 Performance cores, 16-Core Neural Engine (38 TOPS)</span>
                                </div>
                                <span class="included-tag-pill">Included</span>
                            </label>
                            <label class="config-option-card">
                                <input type="radio" name="cpu" value="m4_pro" data-add="-400">
                                <div class="option-details-text">
                                    <strong>M4 Pro (12-Core CPU / 18-Core GPU)</strong>
                                    <span>Ideal for audio production, photography & web compilation</span>
                                </div>
                                <span class="price-mod-pill">-$400</span>
                            </label>
                        </div>
                    </div>

                    <!-- 2. Unified High-Bandwidth RAM -->
                    <div class="config-section-block">
                        <div class="block-title-row">
                            <h3>2. Unified High-Bandwidth RAM</h3>
                            <span class="benchmark-info-link">400 GB/s Bus</span>
                        </div>
                        <div class="options-three-grid">
                            <label class="ram-card-item">
                                <input type="radio" name="ram" value="32" data-add="-200">
                                <strong>32 GB</strong>
                                <span>Standard<br>-$200</span>
                            </label>
                            <label class="ram-card-item selected">
                                <input type="radio" name="ram" value="64" data-add="0" checked>
                                <strong>64 GB</strong>
                                <span>Recommended<br>Default</span>
                            </label>
                            <label class="ram-card-item">
                                <input type="radio" name="ram" value="128" data-add="800">
                                <strong>128 GB</strong>
                                <span>70B LLM Cache<br>+$800</span>
                            </label>
                        </div>
                    </div>

                    <!-- 3. Internal Storage -->
                    <div class="config-section-block">
                        <div class="block-title-row">
                            <h3>3. Internal Storage (Gen 5 NVMe)</h3>
                            <span class="benchmark-info-link">7,400 MB/s Read</span>
                        </div>
                        <div class="options-three-grid">
                            <label class="storage-card-item">
                                <input type="radio" name="storage" value="1tb" data-add="-200">
                                <strong>1 TB</strong>
                                <span>-$200</span>
                            </label>
                            <label class="storage-card-item selected">
                                <input type="radio" name="storage" value="2tb" data-add="0" checked>
                                <span>2 TB</span>
                                <span>Default</span>
                            </label>
                            <label class="storage-card-item">
                                <input type="radio" name="storage" value="4tb" data-add="600">
                                <strong>4 TB</strong>
                                <span>+$600</span>
                            </label>
                        </div>
                    </div>

                    <!-- 4. Studio Display Glass -->
                    <div class="config-section-block">
                        <div class="block-title-row">
                            <h3>4. Studio Display Glass</h3>
                        </div>
                        <div class="config-option-card selected" style="padding: 10px 14px;">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <input type="checkbox" checked disabled>
                                <div class="option-details-text">
                                    <strong>16.2" Liquid XDR 3.2K 120Hz ProMotion</strong>
                                    <span>1,600 nits Peak, Nano-Texture Etched Anti-Glare</span>
                                </div>
                            </div>
                            <i class="fa-solid fa-lock" style="color: #64748b; font-size: 14px;"></i>
                        </div>
                    </div>

                    <!-- 3-Year Direct Care Option -->
                    <div class="config-section-block" style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; background: #fff;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div style="display: flex; gap: 10px; align-items: flex-start;">
                                <input type="checkbox" style="margin-top: 3px;" checked>
                                <div>
                                    <strong style="font-size: 13px;">3-Year Direct Zero-Pixel Elite Care</strong>
                                    <p style="font-size: 11px; color: #64748b; margin-top: 2px;">Includes accidental spill drops, global on-site courier replacement in 24 hours, and zero bright-subpixel replacement promise.</p>
                                </div>
                            </div>
                            <span style="font-size: 13px; font-weight: 700; color: #0f172a;">+$249</span>
                        </div>
                    </div>

                    <!-- Quantity & Add to Cart Bar -->
                    <div class="action-buttons-wrapper">
                        <div class="qty-changer-box">
                            <button type="button" id="minus-btn">-</button>
                            <input type="number" id="qty-input" name="quantity" value="1" min="1">
                            <button type="button" id="plus-btn">+</button>
                        </div>
                        <button type="submit" class="primary-add-cart-btn">
                            <i class="fa-solid fa-cart-shopping"></i> Add to Cart - $<span id="btn-price"><?= number_format($product['price'], 0) ?></span>
                        </button>
                    </div>
                </form>

                <div style="margin-top: 15px; text-align: center;">
                    <a href="#" style="font-size: 12px; color: #0056b3; text-decoration: none; font-weight: 600;"><i class="fa-solid fa-building"></i> Configure Enterprise Fleet & Corporate Leasing (Net 30)</a>
                </div>

                <div style="display: flex; justify-content: space-around; margin-top: 20px; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 15px; text-align: center;">
                    <div><i class="fa-solid fa-shield-halved"></i><br>30-Day Risk-Free Trial</div>
                    <div><i class="fa-solid fa-truck-fast"></i><br>Free Next-Day Air Flight</div>
                    <div><i class="fa-solid fa-box-open"></i><br>Zero-Bloatware Pure OS</div>
                </div>
            </div>

        </div>
    </main>

    <!-- Section 2: Benchmarks & Detailed Technical Specifications -->
    <section class="benchmarks-tech-section">
        <div class="inner-container">
            <div class="lab-validation-header">
                <span class="lab-badge"><i class="fa-solid fa-flask"></i> INTERNAL VALIDATION LAB BENCHMARKS</span>
                <h2>Proven Studio Workstation Compute Ratios</h2>
                <p>Performance comparison run on production firmware: Zenith Pro 16 (M4 Max) vs previous gen and competitors.</p>
                <div class="benchmark-tabs-pills">
                    <span class="pill-item">Creator Suite</span>
                    <span class="pill-item active">AI Training</span>
                    <span class="pill-item">Realtime 3D</span>
                </div>
            </div>

            <!-- 3 Benchmark Columns -->
            <div class="benchmark-three-columns">
                <div class="bench-col-card">
                    <h4>Blender 4.2 Monster 8K <span>Seconds (Lower is Better)</span></h4>
                    <p class="bench-desc">Cycles GPU Path Tracing scene with 16M polygons and hair physics.</p>
                    <div class="bench-bar-row"><span>Zenith Pro 16 (M4 Max)</span> <div class="bar-fill blue" style="width: 100%;"><span>38s</span></div></div>
                    <div class="bench-bar-row"><span>Dell XPS 16 (RTX 4070 Laptop)</span> <div class="bar-fill gray" style="width: 65%;"><span>64s</span></div></div>
                    <div class="bench-bar-row"><span>Zenith Pro 16 (Prior Gen M3 Max)</span> <div class="bar-fill gray" style="width: 75%;"><span>58s</span></div></div>
                    <span class="bench-note"><i class="fa-solid fa-bolt"></i> 1.68x Faster than competing RTX 4070</span>
                </div>

                <div class="bench-col-card">
                    <h4>DaVinci 8K ProRes Export <span>Minutes (Lower is Better)</span></h4>
                    <p class="bench-desc">Dual ProRes Encode Engines rendering 60min multicam 8K timeline.</p>
                    <div class="bench-bar-row"><span>Zenith Pro 16 (M4 Max)</span> <div class="bar-fill blue" style="width: 100%;"><span>4.2 min</span></div></div>
                    <div class="bench-bar-row"><span>Lenovo ThinkPad P16 (RTX 4080)</span> <div class="bar-fill gray" style="width: 60%;"><span>7.9 min</span></div></div>
                    <div class="bench-bar-row"><span>ASUS ROG Zephyrus G16</span> <div class="bar-fill gray" style="width: 50%;"><span>8.8 min</span></div></div>
                    <span class="bench-note"><i class="fa-solid fa-play"></i> Realtime playback without proxy files</span>
                </div>

                <div class="bench-col-card">
                    <h4>Cinebench 2024 Multi-Core <span>Points (Higher is Better)</span></h4>
                    <p class="bench-desc">Sustained multi-threaded CPU stress load across 30-minute burn.</p>
                    <div class="bench-bar-row"><span>Zenith Pro 16 (M4 Max)</span> <div class="bar-fill blue" style="width: 100%;"><span>2,410 pts</span></div></div>
                    <div class="bench-bar-row"><span>Core i9-14900HX Laptop</span> <div class="bar-fill gray" style="width: 75%;"><span>1,820 pts</span></div></div>
                    <div class="bench-bar-row"><span>Apple M3 Max 16-Core</span> <div class="bar-fill gray" style="width: 80%;"><span>1,900 pts</span></div></div>
                    <span class="bench-note"><i class="fa-solid fa-battery-full"></i> Constant peak clock under battery power</span>
                </div>
            </div>

            <!-- Detailed Technical Specifications -->
            <div class="blueprint-specs-container">
                <div class="blueprint-header-row">
                    <div>
                        <span class="blueprint-label">BLUEPRINT DOCUMENTATION</span>
                        <h3>Detailed Technical Specifications</h3>
                    </div>
                    <div class="blueprint-nav-pills">
                        <button class="bp-pill active">Silicon & Compute</button>
                        <button class="bp-pill">Thermal Design</button>
                        <button class="bp-pill">I/O & Display</button>
                        <button class="bp-pill">Battery & Power</button>
                        <button class="bp-pill">Chassis & Audio</button>
                    </div>
                </div>

                <div class="specs-grid-boxes">
                    <div class="spec-box-card">
                        <span class="box-tag">CPU ARCHITECTURE</span>
                        <h4>16-Core Silicon (12 Performance + 4 Efficiency)</h4>
                        <p>Built on second-gen 3nm lithography with 128KB L1 cache per core and 96MB combined L2 cache for instant context delivery.</p>
                    </div>
                    <div class="spec-box-card">
                        <span class="box-tag">GPU PIPELINE</span>
                        <h4>40-Core Hardware Ray-Tracing GPU</h4>
                        <p>Dynamic Caching architecture with hardware-accelerated mesh shading, 128 TFLOPs FP32 precision, and dual AV1 hardware decoders.</p>
                    </div>
                    <div class="spec-box-card">
                        <span class="box-tag">NEURAL ENGINE</span>
                        <h4>16-Core NPU (38 TOPS Peak Performance)</h4>
                        <p>Executes Llama-3 8B instruct models at 48 tokens/second entirely inside memory without offloading to cloud endpoints.</p>
                    </div>
                    <div class="spec-box-card">
                        <span class="box-tag">MEMORY SYSTEM</span>
                        <h4>64GB Unified LPDDR5X (400 GB/s)</h4>
                        <p>Zero-copy shared memory architecture allowing both CPU and 40 GPU cores full simultaneous address access to the entire pool.</p>
                    </div>
                </div>
            </div>

            <!-- Customer Reviews Section -->
            <div class="customer-reviews-wrapper">
                <div class="reviews-left-col">
                    <span class="ind-ratings-title">INDEPENDENT RATINGS</span>
                    <h3>Customer Reviews</h3>
                    <div class="big-rating-box">
                        <span class="huge-score">4.95</span>
                        <div>
                            <div class="stars-gold">★★★★★</div>
                            <span class="small-sub">Based on 342 verified purchases</span>
                        </div>
                    </div>
                    <div class="rating-bars-list">
                        <div class="rate-row"><span>5 Stars</span> <div class="bar-bg"><div class="fill" style="width: 95%;"></div></div> <span>95%</span></div>
                        <div class="rate-row"><span>4 Stars</span> <div class="bar-bg"><div class="fill" style="width: 4%;"></div></div> <span>4%</span></div>
                        <div class="rate-row"><span>3 Stars</span> <div class="bar-bg"><div class="fill" style="width: 1%;"></div></div> <span>1%</span></div>
                        <div class="rate-row"><span>2 Stars</span> <div class="bar-bg"><div class="fill" style="width: 0%;"></div></div> <span>0%</span></div>
                        <div class="rate-row"><span>1 Star</span> <div class="bar-bg"><div class="fill" style="width: 0%;"></div></div> <span>0%</span></div>
                    </div>
                    <button class="submit-bench-btn">Submit Benchmark Review</button>
                </div>

                <div class="reviews-right-col">
                    <!-- Review 1 -->
                    <div class="review-card-item">
                        <div class="rev-header">
                            <div class="user-badge-tag">DR</div>
                            <div>
                                <strong>David Rivera <span class="verified-badge">Verified Studio Pro</span></strong>
                                <p class="user-role-sub">Lead Colorist @ Lumina VFX • Conf: 64GB Unified / 2TB SSD</p>
                            </div>
                            <span class="rev-time">3 days ago</span>
                        </div>
                        <div class="stars-gold" style="margin: 8px 0;">★★★★★</div>
                        <p class="rev-text">"We cut 8K 12-bit raw RED footage directly off the SD Express card while commuting on Amtrak. The vapor chamber is dead silent; thermals sat at 68°C under continuous DaVinci timeline caching. The calibrated Liquid XDR screen completely matches our $30,000 Flanders Scientific master monitor."</p>
                        <div class="rev-actions-row">
                            <span><i class="fa-regular fa-thumbs-up"></i> 48 found helpful</span>
                            <span>Reply</span>
                        </div>
                    </div>

                    <!-- Review 2 -->
                    <div class="review-card-item">
                        <div class="rev-header">
                            <div class="user-badge-tag mc">MC</div>
                            <div>
                                <strong>Dr. Maya Chen <span class="verified-badge">Verified ML Researcher</span></strong>
                                <p class="user-role-sub">Postdoc AI Fellow • Conf: 128GB Unified / 4TB SSD</p>
                            </div>
                            <span class="rev-time">1 week ago</span>
                        </div>
                        <div class="stars-gold" style="margin: 8px 0;">★★★★★</div>
                        <p class="rev-text">"Having 128GB of zero-latency unified memory in a mobile chassis is transformative. I run quantized Llama-3-70B locally for sensitive bio-medical text classification with zero cloud latency. Unplugged from the wall, the inference speed is identical to AC power."</p>
                        <div class="rev-actions-row">
                            <span><i class="fa-regular fa-thumbs-up"></i> 72 found helpful</span>
                            <span>Reply</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </section>

    <!-- Section 3: Compatible Studio Peripherals -->
    <section class="compatible-peripherals-section">
        <div class="inner-container">
            <div class="peripherals-header-row">
                <div>
                    <span class="ecosystem-label">ENGINEERED ECOSYSTEM</span>
                    <h3>Compatible Studio Peripherals</h3>
                </div>
                <a href="#" class="explore-acc-link">Explore All Accessories →</a>
            </div>

            <div class="peripherals-four-grid">
                <!-- Item 1 -->
                <div class="peripheral-card">
                    <span class="peri-tag">WORKSTATION DOCK</span>
                    <img src="assets/images/products/zenith-pro-16.jpeg" alt="Dock">
                    <h4>Zenith Studio Thunderbolt 5 Dock</h4>
                    <p>14 Ports, 140W Host PD, 8K 120Hz display feed.</p>
                    <div class="peri-footer">
                        <span class="price">$349</span>
                        <button class="add-mini-btn">Add +</button>
                    </div>
                </div>
                <!-- Item 2 -->
                <div class="peripheral-card">
                    <span class="peri-tag">INPUT DEVICE</span>
                    <img src="assets/images/products/apex-14.jpeg" alt="Mouse">
                    <h4>Apex Precision Studio Mouse</h4>
                    <p>Haptic thumbwheel, 8,000 DPI sensor, glass tracking.</p>
                    <div class="peri-footer">
                        <span class="price">$129</span>
                        <button class="add-mini-btn">Add +</button>
                    </div>
                </div>
                <!-- Item 3 -->
                <div class="peripheral-card">
                    <span class="peri-tag">PROTECTION</span>
                    <img src="assets/images/products/flexbook-13.jpeg" alt="Vault">
                    <h4>Pelican™ Custom 16 Vault</h4>
                    <p>IP67 waterproof, pressure valve, dual locking.</p>
                    <div class="peri-footer">
                        <span class="price">$189</span>
                        <button class="add-mini-btn">Add +</button>
                    </div>
                </div>
                <!-- Item 4 -->
                <div class="peripheral-card">
                    <span class="peri-tag">POWER</span>
                    <img src="assets/images/products/vortex-18.jpeg" alt="Brick">
                    <h4>GaN 200W Tri-Port Studio Brick</h4>
                    <p>Simultaneous fast charge laptop, iPad and iPhone.</p>
                    <div class="peri-footer">
                        <span class="price">$119</span>
                        <button class="add-mini-btn">Add +</button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="site-main-footer">
        <div class="inner-container footer-grid">
            <div class="footer-col">
                <h4>Laptop Store</h4>
                <p>Premier computing retail platform delivering benchmarked workstations, high-fidelity gaming laptops, and ultra-thin executive devices.</p>
                <p class="iso-text">🛡️ ISO 9001:2020 Certified Guarantee</p>
                <p class="iso-text">📞 24/7 Priority Tech Support: 1-800-LAPTOP</p>
            </div>
            <div class="footer-col">
                <h4>Navigation</h4>
                <a href="#">Home</a>
                <a href="#">Products Catalog</a>
                <a href="#">Categories</a>
                <a href="#">Product Details</a>
                <a href="#">Compare Models</a>
                <a href="#">Cart</a>
            </div>
            <div class="footer-col">
                <h4>Customer Care</h4>
                <a href="#">Account / Orders</a>
                <a href="#">Express Checkout</a>
                <a href="#">Returns & Warranty</a>
                <a href="#">Financing & Trade-In</a>
                <a href="#">Admin Portal</a>
            </div>
            <div class="footer-col">
                <h4>Pro & Enterprise</h4>
                <a href="#">Corporate B2B Sales</a>
                <a href="#">Educational Discounts</a>
                <a href="#">Fleet IT Deployments</a>
            </div>
            <div class="footer-col">
                <h4>STAY CONNECTED</h4>
                <p style="font-size: 12px; color: #94a3b8; margin-bottom: 10px;">Subscribe for exclusive hardware drops and benchmark briefs.</p>
                <div class="newsletter-box">
                    <input type="email" placeholder="Enter company email">
                    <button>JOIN</button>
                </div>
            </div>
        </div>
        <div class="footer-bottom-bar">
            <div class="inner-container" style="display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #94a3b8;">
                <div>VERIFIED SECURE: 🔒 256-Bit SSL Encryption &nbsp;  Apple Pay &nbsp; 💳 Visa / Mastercard &nbsp; PayPal & Affirm 0% APR</div>
                <div style="display: flex; gap: 15px;">
                    <a href="#" style="color: #94a3b8; text-decoration: none;">Privacy Policy</a>
                    <a href="#" style="color: #94a3b8; text-decoration: none;">Terms of Service</a>
                    <a href="#" style="color: #94a3b8; text-decoration: none;">Security Audits</a>
                </div>
            </div>
        </div>
    </footer>

    <script src="js/pages/productdetails.js"></script>
</body>
</html>