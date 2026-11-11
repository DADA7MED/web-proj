# Database Schema — Apex Laptop Store

This directory contains the production-ready MySQL relational database schema.

## File

- **`laptop_store_db.sql`** (Compact ~7.5 KB standard MySQL dump)

## Relational Tables

1. **`categories`**: Primary hardware form factors (`Ultrabooks`, `Extreme Gaming Rigs`, `Silicon Workstations`, `2-in-1 Convertibles`).
2. **`products`**: Workstations and laptops with pricing, ratings, stock, image paths, and JSON hardware specifications.
3. **`users`**: Customer and administrator credentials with hashed passwords and membership tiers.
4. **`orders`**: Customer checkout records with shipping addresses, shipping method, and fulfillment status (`Processing`, `In QA`, `Shipped`, `Delivered`).
5. **`order_items`**: Line items per order linking to `products` with configured specs and purchase unit price.
6. **`wishlists`**: User wishlist container records.
7. **`wishlist_items`**: Individual saved products per wishlist.
8. **`compare_items`**: Hardware benchmark comparison matrix.

## Import Instructions (phpMyAdmin / MySQL CLI)

### Via phpMyAdmin:
1. Open `http://localhost/phpmyadmin`.
2. Click **New** and create a database named `laptop_store_db` (Collation: `utf8mb4_unicode_ci`).
3. Select `laptop_store_db` and navigate to the **Import** tab.
4. Browse and select `laptop_store_db.sql`, then click **Go** / **Import**.

### Via MySQL Command Line:
```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS laptop_store_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p laptop_store_db < database/laptop_store_db.sql
```
