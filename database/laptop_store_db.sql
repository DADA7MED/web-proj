-- Laptop Store Database Master Schema (laptop_store_db)
-- Designed for XAMPP / MariaDB / MySQL
-- Supports Products, Categories, Specs, Wishlists, Compare, Users, and Orders

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
-- Table: categories
-- --------------------------------------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` enum('category','brand') NOT NULL DEFAULT 'category',
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `models_count` varchar(50) DEFAULT NULL,
  `baseline_price` decimal(10,2) DEFAULT NULL,
  `badge_text` varchar(100) DEFAULT NULL,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `models_list` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `categories` (`id`, `type`, `name`, `slug`, `image`, `description`, `models_count`, `baseline_price`, `badge_text`, `features`, `models_list`, `created_at`) VALUES
(1, 'category', 'Ultrabooks & Thin-and-Light', 'ultrabooks', 'assets/images/products/zenith-pro-16.jpeg', 'Engineered for all-day flight travel, meeting runs, and silent operation.', '34 Models · Sub-3.0 lb', 1199.00, 'Engineered for all-day flight travel', '["18-24h Runtime","16 - 32GB LPDDR5X","14 - 16-inch 3K OLED","From 2.18 lbs (0.99kg)"]', '[]', NOW()),
(2, 'category', 'Extreme Gaming Rigs', 'gaming-rigs', 'assets/images/products/vortex-18.jpeg', 'Peak framerate sustained under load featuring powerful discrete GPUs.', '48 Models · 175W Max TGP', 1899.00, 'Peak framerate sustained under load', '["RTX 5080 / 4090 16GB","Up to 64GB DDR5-5600","240Hz - 360Hz G-SYNC","Dual Liquid Metal Fans"]', '[]', NOW()),
(3, 'category', 'Creator & Studio Workstations', 'workstations', 'assets/images/products/apex-14.jpeg', 'Color-critical panels and high-performance multi-core processors.', '20 Models · Factory Calibrated', 2199.00, 'Color-critical panels & high-core processors', '["100% DCI-P3 / AdobeRGB","Up to 128GB Unified","Dual Thunderbolt 4/5","Dual Gen4 NVMe RAID"]', '[]', NOW()),
(4, 'category', '2-in-1 Convertibles & Touch', 'convertibles', 'assets/images/products/flexbook-13.jpeg', 'Geared for dynamic presentations, annotation, and digital illustration.', '21 Models · 4096 Stylus', 1299.00, 'Geared for dynamic presentations & touch', '["360° Hinge Design","4096 Pressure Levels","Up to 20h Battery","Wacom-Class Stylus"]', '[]', NOW());

-- --------------------------------------------------------
-- Table: products
-- --------------------------------------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `slug` varchar(150) NOT NULL,
  `brand` varchar(50) DEFAULT 'Apex',
  `price` decimal(10,2) NOT NULL,
  `old_price` decimal(10,2) DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT 5.00,
  `reviews_count` int(11) DEFAULT 0,
  `stock` int(11) DEFAULT 10,
  `image` varchar(255) DEFAULT NULL,
  `specs` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `badge_text` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `category_id` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `brand`, `price`, `old_price`, `rating`, `reviews_count`, `stock`, `image`, `specs`, `badge_text`, `description`, `created_at`) VALUES
(1, 3, 'Zenith Pro 16 Extreme Silicon Workstation', 'zenith-pro-16', 'Apex', 3148.00, 3299.00, 4.95, 342, 14, 'assets/images/products/zenith-pro-16.jpeg', '{"cpu":"M4 Max (16-Core)","ram":"64 GB","storage":"2 TB SSD","gpu":"40-Core GPU"}', 'EDITOR\'S CHOICE', 'Engineering-grade laptops & portable workstations with ultimate performance.', NOW()),
(2, 1, 'Apex Ultra-Portable 14', 'apex-ultra-portable-14', 'Apex', 1299.00, 1499.00, 4.80, 120, 25, 'assets/images/products/apex-14.jpeg', '{"cpu":"Core Ultra 7","ram":"16 GB","storage":"512 GB SSD","gpu":"Intel Arc"}', 'Q2 2025 ARCHITECTURE', 'Lightweight ultra-book designed for executive mobility and productivity.', NOW()),
(3, 2, 'Vortex Titan Gaming 18', 'vortex-titan-18', 'Apex', 2199.00, 2499.00, 4.88, 95, 8, 'assets/images/products/vortex-18.jpeg', '{"cpu":"i9-14900HX","ram":"32 GB","storage":"1 TB SSD","gpu":"RTX 4080"}', 'NEW RELEASE', 'High-performance gaming rig with powerful GPU and high refresh rate.', NOW()),
(4, 4, 'FlexBook 360 Touch 13', 'flexbook-360-13', 'Apex', 1199.00, 1350.00, 4.70, 64, 19, 'assets/images/products/flexbook-13.jpeg', '{"cpu":"Ryzen 7 AI","ram":"16 GB","storage":"512 GB SSD","gpu":"Radeon 780M"}', 'MIL-STD-810H', 'Versatile convertible business laptop with secure enterprise features.', NOW());

-- --------------------------------------------------------
-- Table: users
-- --------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT 'Member',
  `account_type` varchar(50) DEFAULT 'Personal',
  `phone` varchar(50) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `account_type`, `phone`, `address`, `created_at`) VALUES
(1, 'Alexander Vance', 'demo@apex.com', 'password123', 'VIP Member', 'Pro Creator', '+1 (555) 019-2834', '742 Market Street, San Francisco, CA 94103', NOW()),
(2, 'Admin Supervisor', 'admin@apex.com', 'admin123', 'Admin', 'Administrator', '+1 (555) 999-0000', 'One Infinite Loop, Cupertino, CA', NOW());

-- --------------------------------------------------------
-- Table: wishlists & wishlist_items
-- --------------------------------------------------------
DROP TABLE IF EXISTS `wishlist_items`;
DROP TABLE IF EXISTS `wishlists`;

CREATE TABLE `wishlists` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `wishlist_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `wishlist_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_wishlist_product` (`wishlist_id`, `product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table: orders & order_items
-- --------------------------------------------------------
DROP TABLE IF EXISTS `order_items`;
DROP TABLE IF EXISTS `orders`;

CREATE TABLE `orders` (
  `id` varchar(50) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `customer_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `shipping_address` text NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `shipping_method` varchar(50) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `discount` decimal(10,2) DEFAULT 0.00,
  `shipping_fee` decimal(10,2) DEFAULT 0.00,
  `tax` decimal(10,2) DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL,
  `status` enum('Pending','Processing','Shipped','Delivered','Cancelled') DEFAULT 'Processing',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` varchar(50) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_name` varchar(200) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `orders` (`id`, `customer_name`, `email`, `shipping_address`, `payment_method`, `shipping_method`, `subtotal`, `discount`, `shipping_fee`, `tax`, `total`, `status`, `created_at`) VALUES
('EXP-8849', 'Alexander Vance', 'demo@apex.com', '742 Market Street, San Francisco, CA', 'Credit Card', 'Express Ground', 3299.00, 150.00, 45.00, 312.76, 3506.76, 'Processing', NOW() - INTERVAL 1 DAY),
('EXP-8850', 'Elena Rostova', 'elena@techworks.io', '128 Innovation Way, Seattle, WA', 'Bank Transfer', 'Standard', 4199.00, 0.00, 0.00, 0.00, 4199.00, 'Shipped', NOW() - INTERVAL 2 DAY);

COMMIT;
