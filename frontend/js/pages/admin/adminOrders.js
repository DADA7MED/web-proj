// js/pages/admin/adminOrders.js
import { ordersStore } from "../../stores/ordersStore.js";
import { formatMoney, formatDate, initSidebarToggle } from "./adminUtils.js";

document.addEventListener("DOMContentLoaded", () => {
  initSidebarToggle();

  const tbody = document.getElementById("orders-body");
  const searchInput = document.getElementById("search-orders");
  const statusFilter = document.getElementById("status-filter");
  const emptyState = document.getElementById("empty-orders");

  function render() {
    const orders = ordersStore.getAll();
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const statusVal = statusFilter ? statusFilter.value : "";

    const filtered = orders.filter(o => {
      const matchQ = !query ||
        String(o.id).toLowerCase().includes(query) ||
        String(o.customerName || '').toLowerCase().includes(query) ||
        String(o.email || '').toLowerCase().includes(query);
      const matchS = !statusVal || String(o.status).toLowerCase() === statusVal.toLowerCase();
      return matchQ && matchS;
    });

    if (emptyState) emptyState.hidden = filtered.length !== 0;

    tbody.innerHTML = filtered.map(order => {
      const st = String(order.status || 'Pending').toLowerCase();
      return `
        <tr>
          <td class="admin-product-name"><a href="../orders.html?order_id=${order.id}" target="_blank" style="color: inherit;">#${order.id}</a></td>
          <td>${order.customerName || '–'}<br><small style="color: #64748b;">${order.email || ''}</small></td>
          <td>${formatDate(order.createdAt)}</td>
          <td>${order.paymentMethod || 'Online'}</td>
          <td>${formatMoney(order.total)}</td>
          <td><span class="admin-badge admin-badge--${st}">${order.status}</span></td>
          <td>
            <select class="admin-input admin-input--sm order-status-select" data-id="${order.id}">
              <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
              <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
              <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
              <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
              <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('.order-status-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const id = select.getAttribute('data-id');
        const newStatus = e.target.value;
        ordersStore.updateStatus(id, newStatus);
        render();
      });
    });
  }

  searchInput?.addEventListener('input', render);
  statusFilter?.addEventListener('change', render);

  render();
});
