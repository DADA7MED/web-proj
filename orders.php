<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Hardware Orders &amp; Live Tracking — Apex Laptop Store</title>
  <link rel="stylesheet" href="css/pages/orders.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>

  <nav class="orders-nav">
    <a href="index.html" class="logo">💻 Apex Laptop Store</a>
    <div class="links">
      <a href="index.html">Home</a>
      <a href="products.html">Products</a>
      <a href="categories.html">Categories</a>
      <a href="details.html?id=1">Details</a>
      <a href="wishlist.html">Wishlist</a>
      <a href="cart.html">Cart</a>
      <a href="orders.html" class="active">Orders</a>
      <a href="admin/index.html">Admin</a>
    </div>
    <a href="auth.html" style="color: #e2e8f0; text-decoration: none; font-size: 14px;">👤 Account</a>
  </nav>

  <main class="orders-container">
    <div id="placed-alert" class="success-banner" style="display: none;">
      <div class="icon"><i class="fa-solid fa-circle-check"></i></div>
      <div>
        <h3 style="margin: 0 0 4px; color: #fff; font-size: 18px;">Order Confirmed &amp; Silicon Allocated!</h3>
        <p style="margin: 0; color: #cbd5e1; font-size: 14px;">Thank you for your business. Your hardware configuration has been queued for ISO-certified quality assurance and bench burn-in.</p>
      </div>
    </div>

    <div class="search-box-wrap">
      <input type="text" id="order-search" class="search-input" placeholder="Search by Order ID (e.g. EXP-8849) or customer email...">
      <button type="button" id="search-btn" class="search-btn">Lookup Order</button>
    </div>

    <!-- Active Order Tracking View -->
    <section id="active-order-view" class="order-timeline-card" style="display: none;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
        <div>
          <span style="font-size: 12px; color: #94a3b8; text-transform: uppercase;">Tracking Order</span>
          <h1 id="order-heading-id" style="font-size: 24px; margin: 4px 0; color: #fff;">#EXP-8849</h1>
          <p id="order-placed-date" style="font-size: 13px; color: #94a3b8; margin: 0;">Placed on Nov 10, 2026</p>
        </div>
        <div style="text-align: right;">
          <span id="order-status-badge" class="status-badge processing">Processing</span>
          <div style="margin-top: 8px;">
            <button type="button" id="print-receipt-btn" style="background: none; border: 1px solid #334155; color: #cbd5e1; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer;">
              <i class="fa-solid fa-print"></i> Print Invoice
            </button>
          </div>
        </div>
      </div>

      <!-- 4-step Timeline -->
      <div class="timeline-steps">
        <div class="step-node completed" id="step-placed">
          <div class="step-dot"><i class="fa-solid fa-check"></i></div>
          <span class="step-label">Order Placed</span>
          <span class="step-time">Verified</span>
        </div>
        <div class="step-node active" id="step-lab">
          <div class="step-dot"><i class="fa-solid fa-microchip"></i></div>
          <span class="step-label">QA Testing</span>
          <span class="step-time">In Progress</span>
        </div>
        <div class="step-node" id="step-shipped">
          <div class="step-dot"><i class="fa-solid fa-truck"></i></div>
          <span class="step-label">Courier Dispatch</span>
          <span class="step-time">Pending</span>
        </div>
        <div class="step-node" id="step-delivered">
          <div class="step-dot"><i class="fa-solid fa-box-open"></i></div>
          <span class="step-label">Delivered</span>
          <span class="step-time">Arrival</span>
        </div>
      </div>

      <div class="orders-grid" style="margin-top: 28px;">
        <div>
          <h3 style="font-size: 16px; margin-top: 0; color: #fff; border-bottom: 1px solid #1e293b; padding-bottom: 8px;">Hardware In This Allocation</h3>
          <div id="order-items-list"></div>
        </div>

        <div>
          <h3 style="font-size: 16px; margin-top: 0; color: #fff; border-bottom: 1px solid #1e293b; padding-bottom: 8px;">Destination &amp; Billing</h3>
          <div style="font-size: 13px; line-height: 1.6; color: #cbd5e1;">
            <p style="margin: 0 0 10px;">
              <strong style="color: #fff;">Customer:</strong><br>
              <span id="order-customer-name">Alexander Vance</span><br>
              <span id="order-customer-email" style="color: #94a3b8;">demo@apex.com</span>
            </p>
            <p style="margin: 0 0 10px;">
              <strong style="color: #fff;">Delivery Address:</strong><br>
              <span id="order-shipping-address">742 Market Street, San Francisco, CA 94103</span>
            </p>
            <p style="margin: 0 0 10px;">
              <strong style="color: #fff;">Payment:</strong><br>
              <span id="order-payment-method">Credit Card</span> · <span style="color: #22c55e;">Authorized</span>
            </p>
            <div style="border-top: 1px solid #1e293b; padding-top: 10px; margin-top: 10px;">
              <div style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Subtotal</span> <strong id="order-subtotal">$0.00</strong></div>
              <div style="display:flex; justify-content:space-between; margin-bottom:4px; color:#38bdf8;"><span>Discount</span> <strong id="order-discount">-$0.00</strong></div>
              <div style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Shipping</span> <strong id="order-shipping">FREE</strong></div>
              <div style="display:flex; justify-content:space-between; margin-bottom:4px;"><span>Tax</span> <strong id="order-tax">$0.00</strong></div>
              <div style="display:flex; justify-content:space-between; font-size:15px; font-weight:700; color:#fff; border-top:1px solid #334155; padding-top:6px; margin-top:6px;">
                <span>Total Paid</span> <strong id="order-total" style="color: #38bdf8;">$0.00</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Orders History List -->
    <section>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <h2 style="font-size: 20px; margin: 0; color: #fff;">All Store Orders</h2>
        <span id="orders-count-label" style="font-size: 13px; color: #94a3b8;">Showing recent orders</span>
      </div>
      <div id="orders-history-list"></div>
    </section>
  </main>

  <script type="module" src="js/pages/orders.js"></script>
</body>
</html>
