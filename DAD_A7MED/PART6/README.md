# Part 6: Checkout System & Order Management — DAD_A7MED

## Overview
This module implements the complete **Checkout Processing & Orders Management** pipeline for the Laptop Store web application.

## Implemented Pages & Features
1. **Checkout Flow (`checkout.html`)**:
   - Customer information & contact fields (integrated with `authStore`)
   - Delivery address with country/postal code support
   - Multi-tier shipping methods:
     - Express Ground (Free over $1,000)
     - Next-Flight Air ($45.00)
     - White-Glove Priority Overnight ($75.00)
   - Multi-option payment gateway:
     - Credit/Debit Card validation
     - Apple Pay / Google Pay
     - PayPal
     - Cash on Delivery / Net-30 Corporate Invoicing
   - Live Order Summary connected to `cartStore`
   - Instant VIP promo code application (`VIP-LAUNCH-EARLY` gives $150 discount)
   - Validation & automatic order generation in `ordersStore`

2. **Customer Orders & Live Tracking (`orders.html`)**:
   - Order confirmation & hardware allocation timeline:
     - Order Placed -> Hardware QA Testing -> Courier Dispatch -> Delivered
   - Order search by Order ID or customer email
   - Detailed itemized receipt with specifications and pricing
   - Printable invoice view
   - Historical orders list with status indicators

3. **Orders Data Store (`ordersStore.js`)**:
   - `getAll()`, `getById(id)`, `getUserOrders(email)`
   - `createOrder(orderData)`
   - `updateStatus(id, newStatus)`
   - Full persistence via LocalStorage synchronized with Admin Panel.
