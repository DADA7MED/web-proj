<?php
// api/categoriesApi.php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/../db.php';

$categories = [];

if (isset($conn) && $conn) {
    $result = mysqli_query($conn, "SELECT * FROM categories ORDER BY id ASC");
    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            if (isset($row['features']) && is_string($row['features'])) {
                $decoded = json_decode($row['features'], true);
                if ($decoded !== null) $row['features'] = $decoded;
            }
            if (isset($row['models_list']) && is_string($row['models_list'])) {
                $decoded = json_decode($row['models_list'], true);
                if ($decoded !== null) $row['models_list'] = $decoded;
            }
            $categories[] = $row;
        }
    }
}

if (empty($categories)) {
    $categories = [
        [
            "id" => 1,
            "type" => "category",
            "name" => "Ultrabooks & Thin-and-Light",
            "slug" => "ultrabooks",
            "image" => "assets/images/products/zenith-pro-16.jpeg",
            "description" => "Engineered for all-day flight travel, meeting runs, and silent operation.",
            "models_count" => "34 Models · Sub-3.0 lb",
            "baseline_price" => 1199,
            "badge_text" => "Engineered for all-day flight travel",
            "features" => ["18-24h Runtime", "16 - 32GB LPDDR5X", "14 - 16-inch 3K OLED", "From 2.18 lbs (0.99kg)"]
        ],
        [
            "id" => 2,
            "type" => "category",
            "name" => "Extreme Gaming Rigs",
            "slug" => "gaming-rigs",
            "image" => "assets/images/products/vortex-18.jpeg",
            "description" => "Peak framerate sustained under load featuring powerful discrete GPUs.",
            "models_count" => "48 Models · 175W Max TGP",
            "baseline_price" => 1899,
            "badge_text" => "Peak framerate sustained under load",
            "features" => ["RTX 5080 / 4090 16GB", "Up to 64GB DDR5-5600", "240Hz - 360Hz G-SYNC", "Dual Liquid Metal Fans"]
        ],
        [
            "id" => 3,
            "type" => "category",
            "name" => "Creator & Studio Workstations",
            "slug" => "workstations",
            "image" => "assets/images/products/apex-14.jpeg",
            "description" => "Color-critical panels and high-performance multi-core processors.",
            "models_count" => "20 Models · Factory Calibrated",
            "baseline_price" => 2199,
            "badge_text" => "Color-critical panels & high-core processors",
            "features" => ["100% DCI-P3 / AdobeRGB", "Up to 128GB Unified", "Dual Thunderbolt 4/5", "Dual Gen4 NVMe RAID"]
        ],
        [
            "id" => 4,
            "type" => "category",
            "name" => "2-in-1 Convertibles & Touch",
            "slug" => "convertibles",
            "image" => "assets/images/products/flexbook-13.jpeg",
            "description" => "Geared for dynamic presentations, annotation, and digital illustration.",
            "models_count" => "21 Models · 4096 Stylus",
            "baseline_price" => 1299,
            "badge_text" => "Geared for dynamic presentations & touch",
            "features" => ["360° Hinge Design", "4096 Pressure Levels", "Up to 20h Battery", "Wacom-Class Stylus"]
        ]
    ];
}

echo json_encode($categories, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?>
