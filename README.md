# Apex Laptop Store — Unified Web Project

An end-to-end e-commerce platform engineered for high-performance laptops, mobile workstations, and ultrabooks.

## 📁 Clean Three-Tier Directory Architecture

The repository is organized into three clean primary tiers:

```
web-proj/
├── backend/                  # ⚙️ PHP Backend Services & APIs
│   ├── api/                  # RESTful JSON endpoints (auth, products, categories, orders, wishlist)
│   ├── config/               # Database connection (db.php)
│   ├── includes/             # Layout partials (header, navbar, footer, init)
│   └── views/                # Server-side rendered PHP views
├── database/                 # 🗄️ Database Schema & SQL Dumps
│   ├── laptop_store_db.sql   # Clean, lightweight MySQL dump for phpMyAdmin
│   └── README.md             # MySQL import instructions
├── frontend/                 # 💻 Client-Side Application
│   ├── admin/                # Admin inventory, dashboard, and orders management
│   ├── assets/               # Product renders, category brand icons, and static data
│   ├── css/                  # Base tokens, component styles, and page-specific CSS
│   ├── js/                   # Reactive stores, services, utils, components, and controllers
│   ├── index.html            # Main storefront & showcase
│   ├── products.html         # Catalog, search & facet filter engine
│   ├── categories.html       # Hardware ecosystems & brand grids
│   ├── details.html          # Workstation hardware configurator
│   ├── cart.html             # Shopping cart with free shipping & promo tracker
│   ├── checkout.html         # Multi-step checkout flow (Part 6)
│   ├── orders.html           # Live 4-stage order tracking & invoice receipt (Part 6)
│   ├── wishlist.html         # Saved workstations & quick cart transfer
│   └── auth.html             # Customer authentication & profile portal
├── team_legacy/              # 📦 Original Team Submissions Archive
├── server.js                 # 🚀 High-performance local development server
├── ARCHITECTURE.md           # 📐 Detailed system architecture documentation
└── index.html                # Entrypoint linking directly to frontend/
```

## Team Contributions & Roles

| Member | Module / Role | Key Deliverables |
|---|---|---|
| **Mariam** | Home Page & Shared UI | `frontend/index.html`, `frontend/css/pages/home.css`, interactive benchmarks, cart drawer |
| **Habiba** | Products, Categories & Filters | `frontend/products.html`, `frontend/categories.html`, multi-facet filter engine, pagination |
| **a'laa** | Product Details & Wishlist | `frontend/details.html`, `frontend/wishlist.html`, hardware configurator, spec sheets |
| **Ahmed Hassan** | Shopping Cart | `frontend/cart.html`, free shipping calculator, promo code system, quantity manager |
| **DAD_A7MED** | Part 6: Checkout & Orders | `frontend/checkout.html`, `frontend/orders.html`, `ordersStore.js`, 4-stage live tracking, invoice generator |
| **Hagar** | Authentication & Profile | `frontend/auth.html`, `authStore.js`, role permissions, address book, demo logins |
| **Elsayed** | Admin Dashboard & Management | `frontend/admin/index.html`, `products.html`, `product-form.html`, `orders.html`, `categories.html` |

## Quick Start

```bash
# Start the live preview server (port 3000):
node server.js
```

Browse to `http://localhost:3000` to interact with the full live application.
