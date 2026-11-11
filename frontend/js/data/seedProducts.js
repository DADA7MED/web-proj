// data/seedProducts.js
// نسخة احتياطية مطابقة للداتابيز، مدعومة بالبراندات لمنع ظهور نتائج فارغة عند الفلترة

export const seedProducts = [
    {
        id: 1,
        category_id: 3,
        name: 'Zenith Pro 16 Extreme Silicon Workstation',
        slug: 'zenith-pro-16',
        brand: 'Apple',
        price: 3148.00,
        old_price: 3299.00,
        rating: 4.95,
        reviews_count: 342,
        stock: 14,
        image: 'assets/images/products/zenith-pro-16.jpeg',
        specs: {
            "cpu": "Apple M4 Max (16-Core)",
            "ram": "64 GB Unified",
            "storage": "2 TB NVMe SSD",
            "gpu": "40-Core Apple GPU"
        },
        badge_text: 'EDITOR\'S CHOICE',
        baseline_price: 2499.00,
        models_count: 2,
        description: 'Apple Silicon engineering-grade workstation with Liquid Retina XDR display.'
    },
    {
        id: 2,
        category_id: 1,
        name: 'Apex Ultra-Portable 14 (Dell XPS Architecture)',
        slug: 'apex-ultra-portable-14',
        brand: 'Dell',
        price: 1299.00,
        old_price: 1499.00,
        rating: 4.80,
        reviews_count: 120,
        stock: 25,
        image: 'assets/images/products/apex-14.jpeg',
        specs: {
            "cpu": "Intel Core Ultra 7",
            "ram": "16 GB LPDDR5X",
            "storage": "512 GB SSD",
            "gpu": "Intel Arc Graphics"
        },
        badge_text: 'Q2 2025 ARCHITECTURE',
        baseline_price: 999.00,
        models_count: 3,
        description: 'Dell XPS class lightweight ultra-book designed for executive mobility and battery life.'
    },
    {
        id: 3,
        category_id: 2,
        name: 'Vortex Titan Gaming 18 (ASUS ROG Strix)',
        slug: 'vortex-titan-18',
        brand: 'ASUS',
        price: 2199.00,
        old_price: 2499.00,
        rating: 4.88,
        reviews_count: 95,
        stock: 8,
        image: 'assets/images/products/vortex-18.jpeg',
        specs: {
            "cpu": "Intel Core i9-14900HX",
            "ram": "32 GB DDR5-5600",
            "storage": "1 TB Gen5 SSD",
            "gpu": "NVIDIA RTX 4080 16GB"
        },
        badge_text: 'NEW RELEASE',
        baseline_price: 1899.00,
        models_count: 1,
        description: 'ASUS ROG flagship gaming workstation with 240Hz Nebula HDR display and vapor chamber.'
    },
    {
        id: 4,
        category_id: 4,
        name: 'FlexBook 360 Touch 13 (Lenovo ThinkPad Yoga)',
        slug: 'flexbook-360-13',
        brand: 'Lenovo',
        price: 1199.00,
        old_price: 1350.00,
        rating: 4.70,
        reviews_count: 64,
        stock: 19,
        image: 'assets/images/products/flexbook-13.jpeg',
        specs: {
            "cpu": "AMD Ryzen 7 AI",
            "ram": "16 GB LPDDR5X",
            "storage": "512 GB SSD",
            "gpu": "Radeon 780M"
        },
        badge_text: 'MIL-STD-810H',
        baseline_price: 950.00,
        models_count: 4,
        description: 'Lenovo ThinkPad enterprise 360° convertible with touch stylus and TrackPoint.'
    }
];
