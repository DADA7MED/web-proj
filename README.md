# Laptop Store — Unified Web Project

An end-to-end e-commerce platform engineered for high-performance laptops, mobile workstations, and ultrabooks.

## Team Contributions & Architecture

| Member | Module / Role | Key Deliverables |
|---|---|---|
| **Mariam** | Home Page & Shared UI | `index.html`, `css/pages/home.css`, interactive benchmarks, featured showcase, cart drawer |
| **Habiba** | Products, Categories & Filters | `products.html`, `categories.html`, multi-facet filter engine, pagination, category stores |
| **a'laa** | Product Details & Wishlist | `details.html`, `wishlist.html`, 3D configurator, spec blueprint, wishlist persistence |
| **Ahmed Hassan** | Shopping Cart | `cart.html`, free shipping calculator, promo code system, quantity manager |
| **DAD_A7MED** | Part 6: Checkout & Orders | `checkout.html`, `orders.html`, `ordersStore.js`, 4-stage live tracking, invoice generator |
| **Hagar** | Authentication & Profile | `auth.html`, `authStore.js`, role permissions, address book, demo logins |
| **Elsayed** | Admin Dashboard & Management | `admin/index.html`, `admin/products.html`, `admin/product-form.html`, `admin/orders.html`, `admin/categories.html` |

## Key Features
- **Centralized Data Stores (`js/stores/`)**: Reactive, synchronized state across all browser tabs via `localStorage` with fallback seed data.
- **Unified Navigation**: Seamless traversal across storefront, catalog, configuration, cart, checkout, orders, and admin panel.
- **Responsive & Modern Design**: Sleek dark and light themes, accessible typography (Outfit, Inter, JetBrains Mono), smooth micro-interactions.
- **Live Local Server**: Zero-dependency Node.js HTTP server configured for 0.0.0.0 on port 3000.

## Running the Project
```bash
node server.js
```
Open `http://localhost:3000` to browse the store.
