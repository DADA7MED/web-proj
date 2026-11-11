# Apex Laptop Store — Frontend Application

This directory contains the entire modular client-side application organized by asset and code type.

## Directory Structure

```
frontend/
├── admin/                  # 🛡️ Admin Management System
│   ├── index.html          # Admin Dashboard & Statistics
│   ├── products.html       # Inventory List & Management
│   ├── product-form.html   # Product Creator & Editor
│   ├── orders.html         # Live Order Processing & Status Dropdowns
│   └── categories.html     # Categories & Brands Overview
├── assets/                 # 🖼️ Static Media & Data Assets
│   ├── data/               # Static JSON data seeds (e.g. cart.json)
│   ├── images/             # Product & Category imagery
│   │   ├── categories/     # Brand logos (Apple, Dell, Lenovo, etc.)
│   │   └── products/       # Laptop device renders (Zenith, Apex, Vortex, FlexBook)
│   └── hero-laptop.jpg     # Hero showcase visual
├── css/                    # 🎨 Stylesheets by Layer
│   ├── base.css            # Central design tokens, typography, navbar & footer
│   ├── components/         # Shared component styles
│   │   ├── navbar.css      # Floating navigation bar
│   │   └── product-card.css# Workstation product card styles
│   └── pages/              # Page-specific stylesheets
│       ├── home.css        # Hero, benchmarks, showcase
│       ├── products.css    # Facet filters, price slider, catalog grid
│       ├── categories.css  # Architecture cards & brand grids
│       ├── details.css     # Hardware configurator, specs blueprint
│       ├── cart.css        # Cart items, shipping bar, promo summary
│       ├── checkout.css    # Multi-step checkout form & payment methods
│       ├── orders.css      # 4-stage tracking timeline & invoice receipt
│       ├── wishlist.css    # Saved items grid & move-to-cart actions
│       ├── auth.css        # Login, registration & user profile portal
│       └── admin.css       # Sidebar, data tables & admin cards
├── js/                     # ⚡ Layered JavaScript Architecture
│   ├── components/         # Reactive UI Components
│   │   ├── navbar.js       # Dynamic cart & wishlist badges, user avatar
│   │   ├── cartDrawer.js   # Slide-over quick cart drawer
│   │   └── productCard.js  # Card builder with specs chips
│   ├── data/               # Seed & Fallback Datasets
│   │   ├── seedProducts.js # Workstations seed with verified specs
│   │   ├── seedCategories.js# Form factors & brands seed
│   │   └── seedWishlist.js # Default wishlist items
│   ├── pages/              # Page Controller Scripts
│   │   ├── home.js         # Home interactions & benchmarks slider
│   │   ├── products.js     # Query engine, pagination & filters
│   │   ├── categories.js   # Categories grid & brand direct search
│   │   ├── details.js      # Live hardware configurator & pricing
│   │   ├── cart.js         # Cart line items, quantities & promos
│   │   ├── checkout.js     # Checkout validation & order creator
│   │   ├── orders.js       # Live tracking & invoice rendering
│   │   ├── wishlist.js     # Wishlist grid & cart movers
│   │   ├── auth.js         # Auth state, demo logins & address book
│   │   └── admin/          # Admin controllers
│   │       ├── adminUtils.js# Formatting & sidebar helpers
│   │       ├── dashboard.js# Metric counters & low-stock alerts
│   │       ├── adminProducts.js# Catalog table & delete actions
│   │       ├── productForm.js# Add/edit product handler
│   │       └── adminOrders.js# Live order status updater
│   ├── services/           # External I/O Services
│   │   ├── apiService.js   # Fetch wrapper with timeout & error handling
│   │   └── storageService.js# Versioned localStorage with reactive dispatch
│   ├── stores/             # Reactive Client-Side Data Stores
│   │   ├── authStore.js    # Session, role & profile store
│   │   ├── cartStore.js    # Cart items, tax, shipping & promo calculations
│   │   ├── categoriesStore.js # Categories & brands state
│   │   ├── ordersStore.js  # Order history & status updater
│   │   ├── productsStore.js# Full catalog, search & facet query engine
│   │   └── wishlistStore.js# Saved items state
│   └── utils/              # Reusable Utility Functions
│       ├── dom.js          # Toast notifications, modal & DOM helpers
│       └── formatters.js   # Currency, date, and spec formatting
├── auth.html               # Customer Portal & Login
├── cart.html               # Shopping Cart Page
├── categories.html         # Hardware Ecosystems & Categories
├── checkout.html           # Multi-step Checkout Flow (Part 6)
├── details.html            # Workstation Hardware Configurator
├── index.html              # Main Storefront & Showcase
├── orders.html             # Live Order Tracking & Invoice Receipt (Part 6)
├── products.html           # Catalog, Search & Multi-facet Filters
└── wishlist.html           # Saved Workstations & Quick Movers
```
