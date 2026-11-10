<?php
// api/get_products.php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/../db.php';

$products = [];

if (isset($conn) && $conn) {
    $query = "SELECT * FROM products";
    $result = mysqli_query($conn, $query);

    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            if (isset($row['specs']) && is_string($row['specs'])) {
                $decoded = json_decode($row['specs'], true);
                if ($decoded !== null) $row['specs'] = $decoded;
            }
            $products[] = $row;
        }
    }
}

// Fallback seed data if database is empty or not yet connected
if (empty($products)) {
    $products = [
        [
            "id" => 1,
            "category_id" => 3,
            "name" => "Zenith Pro 16 Extreme Silicon Workstation",
            "slug" => "zenith-pro-16",
            "price" => 3148.00,
            "old_price" => 3299.00,
            "rating" => 4.95,
            "reviews_count" => 342,
            "stock" => 14,
            "image" => "assets/images/products/zenith-pro-16.jpeg",
            "specs" => [
                "cpu" => "M4 Max (16-Core)",
                "ram" => "64 GB",
                "storage" => "2 TB SSD",
                "gpu" => "40-Core GPU"
            ],
            "badge_text" => "EDITOR'S CHOICE",
            "baseline_price" => 2499.00,
            "models_count" => 2,
            "description" => "Engineering-grade laptops & portable workstations with ultimate performance."
        ],
        [
            "id" => 2,
            "category_id" => 1,
            "name" => "Apex Ultra-Portable 14",
            "slug" => "apex-ultra-portable-14",
            "price" => 1299.00,
            "old_price" => 1499.00,
            "rating" => 4.80,
            "reviews_count" => 120,
            "stock" => 25,
            "image" => "assets/images/products/apex-14.jpeg",
            "specs" => [
                "cpu" => "Core Ultra 7",
                "ram" => "16 GB",
                "storage" => "512 GB SSD",
                "gpu" => "Intel Arc"
            ],
            "badge_text" => "Q2 2025 ARCHITECTURE",
            "baseline_price" => 999.00,
            "models_count" => 3,
            "description" => "Lightweight ultra-book designed for executive mobility and productivity."
        ],
        [
            "id" => 3,
            "category_id" => 2,
            "name" => "Vortex Titan Gaming 18",
            "slug" => "vortex-titan-18",
            "price" => 2199.00,
            "old_price" => 2499.00,
            "rating" => 4.88,
            "reviews_count" => 95,
            "stock" => 8,
            "image" => "assets/images/products/vortex-18.jpeg",
            "specs" => [
                "cpu" => "i9-14900HX",
                "ram" => "32 GB",
                "storage" => "1 TB SSD",
                "gpu" => "RTX 4080"
            ],
            "badge_text" => "NEW RELEASE",
            "baseline_price" => 1899.00,
            "models_count" => 1,
            "description" => "High-performance gaming rig with powerful GPU and high refresh rate."
        ],
        [
            "id" => 4,
            "category_id" => 4,
            "name" => "FlexBook 360 Touch 13",
            "slug" => "flexbook-360-13",
            "price" => 1199.00,
            "old_price" => 1350.00,
            "rating" => 4.70,
            "reviews_count" => 64,
            "stock" => 19,
            "image" => "assets/images/products/flexbook-13.jpeg",
            "specs" => [
                "cpu" => "Ryzen 7 AI",
                "ram" => "16 GB",
                "storage" => "512 GB SSD",
                "gpu" => "Radeon 780M"
            ],
            "badge_text" => "MIL-STD-810H",
            "baseline_price" => 950.00,
            "models_count" => 4,
            "description" => "Versatile convertible business laptop with secure enterprise features."
        ]
    ];
}

echo json_encode($products, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?>
