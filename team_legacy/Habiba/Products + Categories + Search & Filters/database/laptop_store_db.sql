-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 03, 2026 at 01:30 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `laptop_store_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
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
  `models_list` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `image`, `description`, `created_at`, `models_count`, `baseline_price`, `badge_text`, `type`, `features`, `models_list`) VALUES
(1, 'Ultrabooks & Thin-and-Light', 'ultrabooks', 'assets/images/products/zenith-pro-16.jpeg', 'Engineered for all-day flight travel, meeting runs, and silent operation.', '2026-10-31 23:35:08', '34 Models · Sub-3.0 lb', 1199.00, 'Engineered for all-day flight travel', 'category', '[\"18-24h Runtime\",\"16 - 32GB LPDDR5X\",\"14 - 16-inch 3K OLED\",\"From 2.18 lbs (0.99kg)\"]', NULL),
(2, 'Extreme Gaming Rigs', 'gaming-rigs', 'assets/images/products/vortex-18.jpeg', 'Peak framerate sustained under load featuring powerful discrete GPUs.', '2026-10-31 23:35:08', '48 Models · 175W Max TGP', 1899.00, 'Peak framerate sustained under load', 'category', '[\"RTX 5080 / 4090 16GB\",\"Up to 64GB DDR5-5600\",\"240Hz - 360Hz G-SYNC\",\"Dual Liquid Metal Fans\"]', NULL),
(3, 'Creator & Studio Workstations', 'workstations', 'assets/images/products/apex-14.jpeg', 'Color-critical panels and high-performance multi-core processors.', '2026-10-31 23:35:08', '20 Models · Factory Calibrated', 2199.00, 'Color-critical panels & high-core processors', 'category', '[\"100% DCI-P3 / AdobeRGB\",\"Up to 128GB Unified\",\"Dual Thunderbolt 4/5\",\"Dual Gen4 NVMe RAID\"]', NULL),
(4, '2-in-1 Convertibles & Touch', 'convertibles', 'assets/images/products/flexbook-13.jpeg', 'Geared for dynamic presentations, annotation, and digital illustration.', '2026-10-31 23:35:08', '21 Models · 4096 Stylus', 1299.00, 'Geared for dynamic presentations & touch', 'category', '[\"360° Hinge Design\",\"4096 Pressure Levels\",\"Up to 20h Battery\",\"Wacom-Class Stylus\"]', NULL),
(5, 'Apple', 'apple', 'assets/images/categories/apple.png', 'Cupertino, CA', '2026-11-02 20:06:55', '28 Systems', 1099.00, 'AppleCare+ Ready', 'brand', '[\"Unified Memory\", \"Liquid Retina XDR\", \"ProMotion 120Hz\"]', '[\r\n  {\"name\":\"MacBook Pro 16-inch (M4 Max / M3 Max)\",\"price\":\"from $3,499\"},\r\n  {\"name\":\"MacBook Pro 14-inch (M4 Pro / M3 Pro)\",\"price\":\"from $1,999\"},\r\n  {\"name\":\"MacBook Air 15-inch & 13-inch (M3 Silicon)\",\"price\":\"from $1,099\"}\r\n]'),
(6, 'Dell Technologies', 'dell', 'assets/images/categories/dell.png', 'Round Rock, TX', '2026-11-02 20:06:55', '34 Systems', 1299.00, 'ProSupport Plus', 'brand', '[\"InfinityEdge Glass\", \"Dell Optimizer AI\", \"CNC Milled AI\"]', '[{\"name\":\"XPS 16 (Core Ultra 9, RTX 4070)\", \"price\":\"from $2,499\"}, {\"name\":\"XPS 13 & 14 Tandem OLED\", \"price\":\"from $1,299\"}, {\"name\":\"Precision 7680 ISV Mobile Rigs\", \"price\":\"from $2,899\"}]'),
(7, 'Lenovo ThinkPad & Legion', 'lenovo', 'assets/images/categories/lenovo.png', 'Beijing & Morrisville', '2026-11-02 20:06:55', '42 Systems', 1489.00, 'Premier Support', 'brand', '[\"TrackPoint Precision\", \"Coldfront 5.0 Thermals\", \"ThinkShield\"]', '[{\"name\":\"ThinkPad X1 Carbon Gen 12\", \"price\":\"from $1,489\"}, {\"name\":\"Legion Pro 7i Gen 9 (RTX 4090)\", \"price\":\"from $2,399\"}, {\"name\":\"ThinkPad P1 Gen 7 Mobile Studio\", \"price\":\"from $2,149\"}]');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `price`, `old_price`, `rating`, `reviews_count`, `stock`, `image`, `specs`, `created_at`) VALUES
(1, 3, 'Zenith Pro 16 Extreme Silicon Workstation', 'zenith-pro-16', 3148.00, 3299.00, 4.95, 342, 14, 'assets/images/products/zenith-pro-16.jpeg', '{\"cpu\": \"M4 Max (16-Core)\", \"ram\": \"64 GB\", \"storage\": \"2 TB SSD\", \"gpu\": \"40-Core GPU\"}', '2026-10-31 23:35:08'),
(2, 1, 'Apex Ultra-Portable 14', 'apex-ultra-portable-14', 1299.00, 1499.00, 4.80, 120, 25, 'assets/images/products/apex-14.jpeg', '{\"cpu\": \"Core Ultra 7\", \"ram\": \"16 GB\", \"storage\": \"512 GB SSD\", \"gpu\": \"Intel Arc\"}', '2026-10-31 23:35:08'),
(3, 2, 'Vortex Titan Gaming 18', 'vortex-titan-18', 2199.00, 2499.00, 4.88, 95, 8, 'assets/images/products/vortex-18.jpeg', '{\"cpu\": \"i9-14900HX\", \"ram\": \"32 GB\", \"storage\": \"1 TB SSD\", \"gpu\": \"RTX 4080\"}', '2026-10-31 23:35:08'),
(4, 4, 'FlexBook 360 Touch 13', 'flexbook-360-13', 1199.00, 1350.00, 4.70, 64, 19, 'assets/images/products/flexbook-13.jpeg', '{\"cpu\": \"Ryzen 7 AI\", \"ram\": \"16 GB\", \"storage\": \"512 GB SSD\", \"gpu\": \"Radeon 780M\"}', '2026-10-31 23:35:08');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `fk_category` (`category_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
