// js/data/seedCategories.js
// نسخة احتياطية مطابقة للداتابيز (نفس الـ ids والـ slugs والحقول).
// بتتستخدم بس لو LocalStorage فاضي والـ API مش شغال.

export const seedCategories = [
    {
        id: 1,
        type: 'category',
        name: 'Ultrabooks & Thin-and-Light',
        slug: 'ultrabooks',
        image: 'assets/images/products/zenith-pro-16.jpeg',
        description: 'Engineered for all-day flight travel, meeting runs, and silent operation.',
        models_count: '34 Models · Sub-3.0 lb',
        baseline_price: 1199,
        badge_text: 'Engineered for all-day flight travel',
        features: ['18-24h Runtime', '16 - 32GB LPDDR5X', '14 - 16-inch 3K OLED', 'From 2.18 lbs (0.99kg)'],
        models_list: []
    },
    {
        id: 2,
        type: 'category',
        name: 'Extreme Gaming Rigs',
        slug: 'gaming-rigs',
        image: 'assets/images/products/vortex-18.jpeg',
        description: 'Peak framerate sustained under load featuring powerful discrete GPUs.',
        models_count: '48 Models · 175W Max TGP',
        baseline_price: 1899,
        badge_text: 'Peak framerate sustained under load',
        features: ['RTX 5080 / 4090 16GB', 'Up to 64GB DDR5-5600', '240Hz - 360Hz G-SYNC', 'Dual Liquid Metal Fans'],
        models_list: []
    },
    {
        id: 3,
        type: 'category',
        name: 'Creator & Studio Workstations',
        slug: 'workstations',
        image: 'assets/images/products/apex-14.jpeg',
        description: 'Color-critical panels and high-performance multi-core processors.',
        models_count: '20 Models · Factory Calibrated',
        baseline_price: 2199,
        badge_text: 'Color-critical panels & high-core processors',
        features: ['100% DCI-P3 / AdobeRGB', 'Up to 128GB Unified', 'Dual Thunderbolt 4/5', 'Dual Gen4 NVMe RAID'],
        models_list: []
    },
    {
        id: 4,
        type: 'category',
        name: '2-in-1 Convertibles & Touch',
        slug: 'convertibles',
        image: 'assets/images/products/flexbook-13.jpeg',
        description: 'Geared for dynamic presentations, annotation, and digital illustration.',
        models_count: '21 Models · 4096 Stylus',
        baseline_price: 1299,
        badge_text: 'Geared for dynamic presentations & touch',
        features: ['360° Hinge Design', '4096 Pressure Levels', 'Up to 20h Battery', 'Wacom-Class Stylus'],
        models_list: []
    },
    {
        id: 5,
        type: 'brand',
        name: 'Apple',
        slug: 'apple',
        image: 'assets/images/categories/apple.png',
        description: 'Cupertino, CA',
        models_count: '28 Systems',
        baseline_price: 1099,
        badge_text: 'AppleCare+ Ready',
        features: ['Unified Memory', 'Liquid Retina XDR', 'ProMotion 120Hz'],
        models_list: [
            { name: 'MacBook Pro 16-inch (M4 Max / M3 Max)', price: 'from $3,499' },
            { name: 'MacBook Pro 14-inch (M4 Pro / M3 Pro)', price: 'from $1,999' },
            { name: 'MacBook Air 15-inch & 13-inch (M3 Silicon)', price: 'from $1,099' }
        ]
    },
    {
        id: 6,
        type: 'brand',
        name: 'Dell Technologies',
        slug: 'dell',
        image: 'assets/images/categories/dell.png',
        description: 'Round Rock, TX',
        models_count: '34 Systems',
        baseline_price: 1299,
        badge_text: 'ProSupport Plus',
        features: ['InfinityEdge Glass', 'Dell Optimizer AI', 'CNC Milled AI'],
        models_list: [
            { name: 'XPS 16 (Core Ultra 9, RTX 4070)', price: 'from $2,499' },
            { name: 'XPS 13 & 14 Tandem OLED', price: 'from $1,299' },
            { name: 'Precision 7680 ISV Mobile Rigs', price: 'from $2,899' }
        ]
    },
    {
        id: 7,
        type: 'brand',
        name: 'Lenovo ThinkPad & Legion',
        slug: 'lenovo',
        image: 'assets/images/categories/lenovo.png',
        description: 'Beijing & Morrisville',
        models_count: '42 Systems',
        baseline_price: 1489,
        badge_text: 'Premier Support',
        features: ['TrackPoint Precision', 'Coldfront 5.0 Thermals', 'ThinkShield'],
        models_list: [
            { name: 'ThinkPad X1 Carbon Gen 12', price: 'from $1,489' },
            { name: 'Legion Pro 7i Gen 9 (RTX 4090)', price: 'from $2,399' },
            { name: 'ThinkPad P1 Gen 7 Mobile Studio', price: 'from $2,149' }
        ]
    }
];