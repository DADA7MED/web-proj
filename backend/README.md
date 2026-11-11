# Apex Laptop Store — Backend Architecture

This directory houses all backend PHP services, REST API endpoints, database configurations, and server-side view templates.

## Directory Structure

```
backend/
├── api/                  # RESTful JSON Endpoints
│   ├── auth.php          # Session & User Authentication API
│   ├── categoriesApi.php # Catalog Categories & Brands API
│   ├── get_products.php  # Product Filtering & Query API
│   ├── orders.php        # Checkout & Order Submission API
│   └── wishlist.php      # User Wishlist Sync API
├── config/               # System & Database Configuration
│   └── db.php            # PDO & MySQLi Database Connector
├── includes/             # Reusable PHP Partials
│   ├── init.php          # Session initializer & helper functions
│   ├── header.php        # HTML <head> with base CSS tokens
│   ├── navbar.php        # Global navigation bar component
│   └── footer.php        # Global footer & social links
├── views/                # Full Server-Side Rendered PHP Pages
│   ├── index.php         # Home showcase
│   ├── products.php      # Products catalog
│   ├── categories.php    # Hardware ecosystems
│   ├── details.php       # Product hardware configurator
│   ├── cart.php          # Shopping cart
│   ├── checkout.php      # Secure checkout
│   ├── orders.php        # Live order tracking
│   ├── wishlist.php      # Wishlist manager
│   └── auth.php          # Customer portal & login
└── db.php                # Backward-compatibility connector bridge
```

## Running with Apache / XAMPP / WampServer

1. Point your Apache virtual host document root to the project directory or place inside `htdocs/web-proj`.
2. Import `database/laptop_store_db.sql` into MySQL / phpMyAdmin.
3. Verify credentials in `backend/config/db.php` (defaults: `localhost`, user `root`, no password, db `laptop_store_db`).
