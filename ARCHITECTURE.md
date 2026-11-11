# Project Architecture & Technical Design

## 🏛️ Architectural Overview

The **Laptop Store** application follows a modular, decoupled **Layered Architecture** designed to support both static hosting environments and full-stack PHP/MySQL production deployments.

```
┌────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                   │
│   Storefront (HTML/PHP)  ·  Admin Panel  ·  Components │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                  STATE & STORE LAYER                   │
│  productsStore  ·  categoriesStore  ·  cartStore       │
│  wishlistStore  ·  ordersStore      ·  authStore       │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                     SERVICES LAYER                     │
│    apiService (Fetch/REST)  ·  storageService (LS)     │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                   PERSISTENCE LAYER                    │
│   MySQL / MariaDB (laptop_store_db)  ·  LocalStorage   │
└────────────────────────────────────────────────────────┘
```

---

## 📁 Directory Structure & Organization

```
web-proj/
├── admin/                     # 🛡️ Admin Management Module (Elsayed)
│   ├── index.html             # Dashboard metrics & sales summary
│   ├── products.html          # Product catalog management
│   ├── product-form.html      # Add & Edit laptop form
│   ├── orders.html            # Customer order dispatch & status management
│   └── categories.html        # Category & Brand management
│
├── api/                       # 🔌 REST API Endpoints (PHP / Node fallback)
│   ├── get_products.php       # GET /api/get_products.php
│   ├── categoriesApi.php      # GET /api/categoriesApi.php
│   ├── wishlist.php           # GET, POST, DELETE /api/wishlist.php
│   ├── orders.php             # GET, POST /api/orders.php
│   └── auth.php               # POST (login, register, session)
│
├── assets/                    # 🖼️ Static Media & Product Photography
│   └── images/
│       ├── products/          # apex-14, flexbook-13, vortex-18, zenith-pro-16
│       └── categories/        # apple.png, dell.png, lenovo.png
│
├── config/                    # ⚙️ Configuration & Database Handlers
│   └── database.php           # PDO Database Connection
│
├── css/                       # 🎨 Cascading Style Sheets (Design System)
│   ├── base.css               # Design tokens, variables, global layout
│   └── pages/                 # Page-scoped stylesheets (home, products, details...)
│
├── database/                  # 🗄️ Database Schemas & Migrations
│   └── laptop_store_db.sql    # Master MySQL dump for phpMyAdmin
│
├── includes/                  # 🧩 Reusable PHP Templates (MVC View Partials)
│   ├── init.php               # Environment bootstrapping
│   ├── header.php             # HTML head & meta tags
│   ├── navbar.php             # Global navigation bar
│   └── footer.php             # Global footer & script tags
│
├── js/                        # ⚡ Frontend JavaScript Architecture
│   ├── components/            # Reusable UI Components
│   │   ├── navbar.js          # Reactive cart/wishlist counters
│   │   └── pagination.js      # Client-side pagination component
│   ├── services/              # Infrastructure Services
│   │   ├── apiService.js      # HTTP fetch wrapper
│   │   └── storageService.js  # LocalStorage with versioning
│   ├── stores/                # Centralized Reactive State
│   │   ├── productsStore.js   # Products state & multi-facet query engine
│   │   ├── categoriesStore.js # Categories & Brand ecosystems
│   │   ├── cartStore.js       # Shopping cart calculations & promos
│   │   ├── wishlistStore.js   # Wishlist state & persistence
│   │   ├── ordersStore.js     # Order placement & shipment status
│   │   └── authStore.js       # Customer session & role permissions
│   ├── utils/                 # Pure Functional Helpers
│   │   ├── formatters.js      # Currency, dates, slugification
│   │   └── dom.js             # Element creators, toasts, debounce
│   └── pages/                 # Page Controllers
│
├── server.js                  # 🚀 High-Performance Node.js Dev Server
└── README.md                  # Project overview & running instructions
```

---

## 👥 Module Ownership & Division of Responsibilities

| Role / Part | Owner | Deliverables |
|---|---|---|
| **Part 1: Home & Shared UI** | Mariam | `index.html`, `home.css`, interactive benchmarks, featured carousel |
| **Part 2: Products & Filtering** | Habiba | `products.html`, `categories.html`, price sliders, query engine |
| **Part 3: Product Details & Wishlist** | a'laa | `details.html`, `wishlist.html`, hardware configurator, spec sheets |
| **Part 4: Shopping Cart** | Ahmed Hassan | `cart.html`, free shipping progress, discount codes |
| **Part 5: Admin Panel** | Elsayed | `admin/index.html`, `products.html`, inventory actions |
| **Part 6: Checkout & Orders** | DAD_A7MED | `checkout.html`, `orders.html`, orders tracking, invoice view |
| **Part 7: Authentication & Profile** | Hagar | `auth.html`, `authStore.js`, login/register, customer dashboard |

---

## 🔄 Data Synchronization Flow (Resilient Fallback)

On every page load, each store resolves data in three tiered steps:
1. **LocalStorage**: If valid cached data exists, load immediately for sub-millisecond response.
2. **REST API**: If cache is cold, request from `api/get_products.php` or `api/categoriesApi.php`.
3. **Seed Data**: If database is offline, gracefully fall back to local seed data (`js/data/`).
