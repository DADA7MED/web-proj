// js/pages/orders.js
import { ordersStore } from '../stores/ordersStore.js';
import { authStore } from '../stores/authStore.js';

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const orderIdParam = urlParams.get('order_id');
  const placedParam = urlParams.get('placed');

  const placedAlert = document.getElementById('placed-alert');
  if (placedParam && placedAlert) {
    placedAlert.style.display = 'flex';
  }

  const allOrders = ordersStore.getAll();
  const searchInput = document.getElementById('order-search');
  const searchBtn = document.getElementById('search-btn');
  const activeView = document.getElementById('active-order-view');
  const historyList = document.getElementById('orders-history-list');

  function money(n) {
    return `$${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  function displayOrder(order) {
    if (!order) return;
    activeView.style.display = 'block';
    activeView.scrollIntoView({ behavior: 'smooth' });

    document.getElementById('order-heading-id').textContent = `#${order.id}`;
    document.getElementById('order-placed-date').textContent = `Placed on ${new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

    const statusBadge = document.getElementById('order-status-badge');
    const st = String(order.status || 'Processing').toLowerCase();
    statusBadge.className = `status-badge ${st}`;
    statusBadge.textContent = order.status;

    // Timeline steps
    const stepPlaced = document.getElementById('step-placed');
    const stepLab = document.getElementById('step-lab');
    const stepShipped = document.getElementById('step-shipped');
    const stepDelivered = document.getElementById('step-delivered');

    stepPlaced.className = 'step-node completed';
    stepLab.className = 'step-node';
    stepShipped.className = 'step-node';
    stepDelivered.className = 'step-node';

    if (st === 'processing') {
      stepLab.className = 'step-node active';
    } else if (st === 'shipped') {
      stepLab.className = 'step-node completed';
      stepShipped.className = 'step-node active';
    } else if (st === 'delivered') {
      stepLab.className = 'step-node completed';
      stepShipped.className = 'step-node completed';
      stepDelivered.className = 'step-node completed';
    }

    // Details
    document.getElementById('order-customer-name').textContent = order.customerName || 'Customer';
    document.getElementById('order-customer-email').textContent = order.email || '–';
    document.getElementById('order-shipping-address').textContent = order.shippingAddress || '–';
    document.getElementById('order-payment-method').textContent = order.paymentMethod || 'Credit Card';

    document.getElementById('order-subtotal').textContent = money(order.subtotal || order.total);
    document.getElementById('order-discount').textContent = order.discount > 0 ? `-${money(order.discount)}` : '$0.00';
    document.getElementById('order-shipping').textContent = (order.shipping === 0) ? 'FREE' : money(order.shipping || 0);
    document.getElementById('order-tax').textContent = money(order.tax || 0);
    document.getElementById('order-total').textContent = money(order.total);

    // Items list
    const itemsList = document.getElementById('order-items-list');
    const items = Array.isArray(order.items) && order.items.length ? order.items : [
      { name: "Zenith Pro 16 Extreme Silicon Workstation", price: order.total, quantity: 1, image: "assets/images/products/zenith-pro-16.jpeg" }
    ];

    itemsList.innerHTML = items.map(item => `
      <div style="display: flex; gap: 12px; align-items: center; padding: 10px 0; border-bottom: 1px solid #1e293b;">
        <img src="${item.image || 'assets/hero-laptop.jpg'}" alt="${item.name}" style="width: 48px; height: 48px; object-fit: contain; background: #090e1a; border-radius: 6px; padding: 2px;" onerror="this.src='assets/hero-laptop.jpg'">
        <div style="flex: 1; min-width: 0;">
          <h4 style="margin: 0 0 2px; font-size: 13px; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</h4>
          <span style="font-size: 12px; color: #94a3b8;">Qty: ${item.quantity || 1} × ${money(item.price)}</span>
        </div>
        <strong style="color: #fff; font-size: 13px;">${money((item.price || 0) * (item.quantity || 1))}</strong>
      </div>
    `).join('');
  }

  function renderHistory(orders) {
    if (!historyList) return;
    if (orders.length === 0) {
      historyList.innerHTML = '<p style="color: #94a3b8; text-align: center; padding: 24px;">No orders found.</p>';
      return;
    }

    historyList.innerHTML = orders.map(o => `
      <div class="history-item" data-id="${o.id}">
        <div>
          <strong style="color: #38bdf8; font-size: 15px;">#${o.id}</strong>
          <span style="color: #94a3b8; font-size: 13px; margin-left: 10px;">${o.customerName}</span>
          <p style="margin: 4px 0 0; font-size: 12px; color: #64748b;">${new Date(o.createdAt).toLocaleDateString()} · ${o.paymentMethod || 'Online'}</p>
        </div>
        <div style="text-align: right;">
          <strong style="font-size: 16px; color: #fff; display: block; margin-bottom: 4px;">${money(o.total)}</strong>
          <span class="status-badge ${String(o.status || 'processing').toLowerCase()}">${o.status}</span>
        </div>
      </div>
    `).join('');

    historyList.querySelectorAll('.history-item').forEach(item => {
      item.addEventListener('click', () => {
        const id = item.getAttribute('data-id');
        const found = ordersStore.getById(id);
        if (found) displayOrder(found);
      });
    });
  }

  function handleSearch() {
    const q = searchInput.value.trim().toLowerCase();
    if (!q) {
      renderHistory(allOrders);
      return;
    }
    const filtered = allOrders.filter(o =>
      String(o.id).toLowerCase().includes(q) ||
      String(o.customerName || '').toLowerCase().includes(q) ||
      String(o.email || '').toLowerCase().includes(q)
    );
    renderHistory(filtered);
    if (filtered.length > 0) {
      displayOrder(filtered[0]);
    }
  }

  if (searchBtn) searchBtn.addEventListener('click', handleSearch);
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSearch();
    });
  }

  // Print button
  document.getElementById('print-receipt-btn')?.addEventListener('click', () => {
    window.print();
  });

  // Initial order view
  if (orderIdParam) {
    const found = ordersStore.getById(orderIdParam);
    if (found) displayOrder(found);
  } else if (allOrders.length > 0) {
    displayOrder(allOrders[0]);
  }

  renderHistory(allOrders);
});
