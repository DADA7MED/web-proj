<?php session_start(); ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Cart | Laptop Store</title>
  <link rel="stylesheet" href="css/pages/cart.css">
  <style>
    .navbar {
      background: #0f172a;
      color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 28px;
    }
    .navbar .logo {
      font-size: 18px;
      font-weight: 700;
      color: #38bdf8;
      text-decoration: none;
    }
    .navbar .links {
      display: flex;
      gap: 20px;
    }
    .navbar .links a {
      color: #94a3b8;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
    }
    .navbar .links a.active, .navbar .links a:hover {
      color: #38bdf8;
    }
    .navbar .nav-actions {
      display: flex;
      gap: 16px;
      align-items: center;
      font-size: 14px;
    }
    .navbar .nav-actions a {
      color: #e2e8f0;
      text-decoration: none;
    }
  </style>
</head>

<body>
  <nav class="navbar">
    <a href="index.html" class="logo">💻 Laptop Store</a>

    <div class="links">
      <a href="index.html">Home</a>
      <a href="products.html">Products</a>
      <a href="categories.html">Categories</a>
      <a href="details.html?id=1">Details</a>
      <a href="wishlist.html">Wishlist</a>
      <a href="cart.html" class="active">Cart</a>
      <a href="orders.html">Orders</a>
      <a href="admin/index.html">Admin</a>
    </div>

    <div class="nav-actions">
      <span class="nav-cart" style="background: rgba(56, 189, 248, 0.1); padding: 6px 12px; border-radius: 6px; border: 1px solid rgba(56, 189, 248, 0.2);">
        🛒 Cart (<span id="navCount">0</span> items)
      </span>
      <a href="auth.html" title="Account / Profile">👤 Account</a>
    </div>
  </nav>

  <main>
    <div id="cartPage">
      <section class="top-box">
        <div class="top-row">
          <div>
            <small class="blue">● HARDWARE ALLOCATION VERIFIED</small>
            <h1>
              Your Engineered Cart
              <span id="count" class="light"></span>
            </h1>
          </div>
          <div class="ship-note" id="shipNote"></div>
        </div>

        <div class="bar">
          <div id="barFill"></div>
        </div>
      </section>

      <div class="layout">
        <section id="items"></section>

        <aside class="summary">
          <div class="sum-head">
            <h2>Order Summary</h2>
            <small>USD</small>
          </div>

          <div class="row">
            <span id="unitsText">Subtotal</span>
            <b id="subtotal"></b>
          </div>

          <div class="row blue">
            <span>VIP Promo Discount</span>
            <b id="discount"></b>
          </div>

          <div class="row">
            <span>Shipping</span>
            <b id="shipping"></b>
          </div>

          <div class="row">
            <span>Estimated Sales Tax</span>
            <b id="tax"></b>
          </div>

          <div class="total">
            <h3>Total Due</h3>
            <strong id="total"></strong>
          </div>

          <small class="label">PROMO CODE (USE: VIP-LAUNCH-EARLY)</small>

          <div class="promo">
            <input id="promoInput" placeholder="Enter code (VIP-LAUNCH-EARLY)">
            <button onclick="usePromo()">APPLY</button>
          </div>

          <button class="checkout" onclick="goToCheckout('standard')">
            Proceed to Secure Checkout
          </button>

          <p class="or">OR EXPRESS CHECKOUT</p>

          <div class="express">
            <button class="apple" onclick="goToCheckout('applepay')"> Pay</button>
            <button class="gpay" onclick="goToCheckout('gpay')">GPay</button>
            <button class="paypal" onclick="goToCheckout('paypal')">PayPal</button>
          </div>
        </aside>
      </div>
    </div>

    <div id="empty" class="empty" hidden>
      <div class="big-icon">🛒</div>
      <h2>Your Cart Is Empty</h2>
      <p style="color: #64748b; margin-bottom: 20px;">Explore our extreme-performance workstations and ultrabooks to configure your system.</p>
      <button class="checkout" onclick="continueShopping()">Explore Products Catalog</button>
    </div>

    <div id="msg" class="msg" hidden></div>
  </main>

  <script src="js/stores/cartStore.js"></script>
  <script src="js/pages/cart.js"></script>
</body>
</html>
