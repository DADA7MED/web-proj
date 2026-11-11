-- phpMyAdmin SQL Dump
-- Laptop Store Database (laptop_store_db)
-- مدمجة ومنظمة من ملفات الفريق الأصلية بدون تضخيم
-- Target: XAMPP / MariaDB / MySQL

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

CREATE DATABASE IF NOT EXISTS `laptop_store_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `laptop_store_db`;

-- --------------------------------------------------------
-- 1. جدول التصنيفات والبراندات (categories) - من شغل حبيبة
-- --------------------------------------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `models_count` varchar(50) DEFAULT NULL,
  `baseline_price` decimal(10,2) DEFAULT NULL,
  `badge_text` varchar(100) DEFAULT NULL,
  `type` varchar(50) DEFAULT 'category',
  `features` text DEFAULT NULL,
  `models_list` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `categories` (`id`, `name`, `slug`, `image`, `description`, `created_at`, `models_count`, `baseline_price`, `badge_text`, `type`, `features`, `models_list`) VALUES
(1, 'Ultrabooks & Thin-and-Light', 'ultrabooks', 'assets/images/products/zenith-pro-16.jpeg', 'Engineered for all-day flight travel, meeting runs, and silent operation.', '2026-10-31 23:35:08', '34 Models · Sub-3.0 lb', 1199.00, 'Engineered for all-day flight travel', 'category', '[\"18-24h Runtime\",\"16 - 32GB LPDDR5X\",\"14 - 16-inch 3K OLED\",\"From 2.18 lbs (0.99kg)\"]', NULL),
(2, 'Extreme Gaming Rigs', 'gaming-rigs', 'assets/images/products/vortex-18.jpeg', 'Peak framerate sustained under load featuring powerful discrete GPUs.', '2026-10-31 23:35:08', '48 Models · 175W Max TGP', 1899.00, 'Peak framerate sustained under load', 'category', '[\"RTX 5080 / 4090 16GB\",\"Up to 64GB DDR5-5600\",\"240Hz - 360Hz G-SYNC\",\"Dual Liquid Metal Fans\"]', NULL),
(3, 'Creator & Studio Workstations', 'workstations', 'assets/images/products/apex-14.jpeg', 'Color-critical panels and high-performance multi-core processors.', '2026-10-31 23:35:08', '20 Models · Factory Calibrated', 2199.00, 'Color-critical panels & high-core processors', 'category', '[\"100% DCI-P3 / AdobeRGB\",\"Up to 128GB Unified\",\"Dual Thunderbolt 4/5\",\"Dual Gen4 NVMe RAID\"]', NULL),
(4, '2-in-1 Convertibles & Touch', 'convertibles', 'assets/images/products/flexbook-13.jpeg', 'Geared for dynamic presentations, annotation, and digital illustration.', '2026-10-31 23:35:08', '21 Models · 4096 Stylus', 1299.00, 'Geared for dynamic presentations & touch', 'category', '[\"360° Hinge Design\",\"4096 Pressure Levels\",\"Up to 20h Battery\",\"Wacom-Class Stylus\"]', NULL),
(5, 'Apple', 'apple', 'assets/images/categories/apple.png', 'Cupertino, CA', '2026-11-02 20:06:55', '28 Systems', 1099.00, 'AppleCare+ Ready', 'brand', '[\"Unified Memory\", \"Liquid Retina XDR\", \"ProMotion 120Hz\"]', '[{\"name\":\"MacBook Pro 16-inch (M4 Max / M3 Max)\",\"price\":\"from $3,499\"}, {\"name\":\"MacBook Pro 14-inch (M4 Pro / M3 Pro)\",\"price\":\"from $1,999\"}, {\"name\":\"MacBook Air 15-inch & 13-inch (M3 Silicon)\",\"price\":\"from $1,099\"}]'),
(6, 'Dell Technologies', 'dell', 'assets/images/categories/dell.png', 'Round Rock, TX', '2026-11-02 20:06:55', '34 Systems', 1299.00, 'ProSupport Plus', 'brand', '[\"InfinityEdge Glass\", \"Dell Optimizer AI\", \"CNC Milled AI\"]', '[{\"name\":\"XPS 16 (Core Ultra 9, RTX 4070)\", \"price\":\"from $2,499\"}, {\"name\":\"XPS 13 & 14 Tandem OLED\", \"price\":\"from $1,299\"}, {\"name\":\"Precision 7680 ISV Mobile Rigs\", \"price\":\"from $2,899\"}]'),
(7, 'Lenovo ThinkPad & Legion', 'lenovo', 'assets/images/categories/lenovo.png', 'Beijing & Morrisville', '2026-11-02 20:06:55', '42 Systems', 1489.00, 'Premier Support', 'brand', '[\"TrackPoint Precision\", \"Coldfront 5.0 Thermals\", \"ThinkShield\"]', '[{\"name\":\"ThinkPad X1 Carbon Gen 12\", \"price\":\"from $1,489\"}, {\"name\":\"Legion Pro 7i Gen 9 (RTX 4090)\", \"price\":\"from $2,399\"}, {\"name\":\"ThinkPad P1 Gen 7 Mobile Studio\", \"price\":\"from $2,149\"}]');

-- --------------------------------------------------------
-- 2. جدول المنتجات (products) - من شغل حبيبة وآلاء
-- --------------------------------------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `slug` varchar(150) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `old_price` decimal(10,2) DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT 0.00,
  `reviews_count` int(11) DEFAULT 0,
  `stock` int(11) DEFAULT 0,
  `image` varchar(255) DEFAULT NULL,
  `specs` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `fk_category` (`category_id`),
  CONSTRAINT `fk_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `price`, `old_price`, `rating`, `reviews_count`, `stock`, `image`, `specs`, `created_at`) VALUES
(1, 3, 'Zenith Pro 16 Extreme Silicon Workstation', 'zenith-pro-16', 3148.00, 3299.00, 4.95, 342, 14, 'assets/images/products/zenith-pro-16.jpeg', '{\"brand\": \"Apple\", \"cpu\": \"Apple M4 Max (16-Core)\", \"ram\": \"64 GB\", \"storage\": \"2 TB SSD\", \"gpu\": \"40-Core GPU\"}', '2026-10-31 23:35:08'),
(2, 1, 'Apex Ultra-Portable 14 (Dell XPS)', 'apex-ultra-portable-14', 1299.00, 1499.00, 4.80, 120, 25, 'assets/images/products/apex-14.jpeg', '{\"brand\": \"Dell\", \"cpu\": \"Core Ultra 7\", \"ram\": \"16 GB\", \"storage\": \"512 GB SSD\", \"gpu\": \"Intel Arc\"}', '2026-10-31 23:35:08'),
(3, 2, 'Vortex Titan Gaming 18 (ASUS ROG)', 'vortex-titan-18', 2199.00, 2499.00, 4.88, 95, 8, 'assets/images/products/vortex-18.jpeg', '{\"brand\": \"ASUS\", \"cpu\": \"i9-14900HX\", \"ram\": \"32 GB\", \"storage\": \"1 TB SSD\", \"gpu\": \"RTX 4080\"}', '2026-10-31 23:35:08'),
(4, 4, 'FlexBook 360 Touch 13 (Lenovo ThinkPad)', 'flexbook-360-13', 1199.00, 1350.00, 4.70, 64, 19, 'assets/images/products/flexbook-13.jpeg', '{\"brand\": \"Lenovo\", \"cpu\": \"Ryzen 7 AI\", \"ram\": \"16 GB\", \"storage\": \"512 GB SSD\", \"gpu\": \"Radeon 780M\"}', '2026-10-31 23:35:08');

-- --------------------------------------------------------
-- 3. جدول المفضلة (wishlists & wishlist_items) - من شغل آلاء
-- --------------------------------------------------------
DROP TABLE IF EXISTS `wishlist_items`;
DROP TABLE IF EXISTS `wishlists`;

CREATE TABLE `wishlists` (
  `wishlist_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`wishlist_id`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `wishlist_items` (
  `wishlist_item_id` int(11) NOT NULL AUTO_INCREMENT,
  `wishlist_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `added_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`wishlist_item_id`),
  UNIQUE KEY `wishlist_id` (`wishlist_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `wishlist_items_ibfk_1` FOREIGN KEY (`wishlist_id`) REFERENCES `wishlists` (`wishlist_id`) ON DELETE CASCADE,
  CONSTRAINT `wishlist_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `wishlists` (`wishlist_id`, `user_id`, `created_at`) VALUES (1, 1, NOW());
INSERT INTO `wishlist_items` (`wishlist_item_id`, `wishlist_id`, `product_id`, `added_at`) VALUES (1, 1, 1, NOW());

-- --------------------------------------------------------
-- 4. جدول المقارنة (compare_items) - من شغل آلاء
-- --------------------------------------------------------
DROP TABLE IF EXISTS `compare_items`;
CREATE TABLE `compare_items` (
  `compare_item_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `added_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`compare_item_id`),
  UNIQUE KEY `user_id` (`user_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `compare_items_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- 5. جدول المستخدمين (users) - لجزء هاجر
-- --------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT 'Member',
  `phone` varchar(50) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `phone`, `address`, `created_at`) VALUES
(1, 'Alexander Vance', 'demo@apex.com', 'password123', 'VIP Member', '+1 (555) 019-2834', '742 Market Street, San Francisco, CA', NOW()),
(2, 'Admin Supervisor', 'admin@apex.com', 'admin123', 'Admin', '+1 (555) 999-0000', 'One Infinite Loop, Cupertino, CA', NOW());

-- --------------------------------------------------------
-- 6. جدول الطلبات (orders & order_items) - لجزء أحمد PART 6
-- --------------------------------------------------------
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;

CREATE TABLE `orders` (
  `id` varchar(50) NOT NULL,
  `customer_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `shipping_address` text NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `status` varchar(50) DEFAULT 'Processing',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` varchar(50) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `fk_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `orders` (`id`, `customer_name`, `email`, `shipping_address`, `payment_method`, `total`, `status`, `created_at`) VALUES
('EXP-8849', 'Alexander Vance', 'demo@apex.com', '742 Market Street, San Francisco, CA', 'Credit Card', 3506.76, 'Processing', NOW() - INTERVAL 1 DAY),
('EXP-8850', 'Elena Rostova', 'elena@techworks.io', '128 Innovation Way, Seattle, WA', 'Bank Transfer', 4199.00, 'Shipped', NOW() - INTERVAL 2 DAY);

INSERT INTO `order_items` (`order_id`, `product_id`, `quantity`, `price`) VALUES
('EXP-8849', 1, 1, 3148.00),
('EXP-8850', 3, 1, 2199.00),
('EXP-8850', 2, 1, 1299.00);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
