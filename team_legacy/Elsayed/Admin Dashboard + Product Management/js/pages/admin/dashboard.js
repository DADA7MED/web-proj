import { productsStore } from "../../stores/productsStore.js";
import { categoriesStore } from "../../stores/categoriesStore.js";
import { ordersStore } from "../../stores/ordersStore.js";
import { $, makeEl, formatMoney, formatDate, initSidebarToggle } from "./adminUtils.js";

// Must match the order statuses agreed with the orders owner.
const PENDING_STATUS = "Pending";
const LOW_STOCK = 5;
const LOW_STOCK_SHOWN = 4;
const RECENT_ORDERS_COUNT = 5;

const toList = (value) => (Array.isArray(value) ? value : []);

function renderStats({ products, categories, orders }) {
  const pending = orders.filter(
    (o) => String(o.status).toLowerCase() === PENDING_STATUS.toLowerCase()
  ).length;

  $("#stat-products").textContent = products.length;
  $("#stat-categories").textContent = categories.length;
  $("#stat-orders").textContent = orders.length;
  $("#stat-pending").textContent = pending;

  $("#nav-products-count").textContent = products.length;
  const pendingBadge = $("#nav-pending-count");
  pendingBadge.textContent = pending;
  pendingBadge.hidden = pending === 0;
}

function renderLowStock(products) {
  const low = products
    .filter((p) => Number(p.stock) <= LOW_STOCK)
    .sort((a, b) => Number(a.stock) - Number(b.stock));

  const count = $("#low-stock-count");
  count.textContent = `${low.length} ${low.length === 1 ? "item" : "items"}`;
  count.hidden = low.length === 0;
  $("#low-stock-empty").hidden = low.length !== 0;

  const items = low.slice(0, LOW_STOCK_SHOWN).map((product) => {
    const stockText = Number(product.stock) <= 0 ? "Out of stock" : `${product.stock} left`;

    const info = makeEl("div");
    info.append(
      makeEl("p", "admin-list__title", product.name),
      makeEl("p", "admin-list__sub", `${product.brand} · ${stockText}`)
    );

    const restock = makeEl("a", "admin-btn admin-btn--sm", "Restock");
    restock.href = `product-form.html?id=${encodeURIComponent(product.id)}`;

    const item = makeEl("li", "admin-list__item");
    item.append(info, restock);
    return item;
  });

  $("#low-stock-list").replaceChildren(...items);
}

function renderCategoryBars(products, categories) {
  $("#category-empty").hidden = categories.length !== 0;

  const counts = {};
  for (const product of products) {
    counts[product.category] = (counts[product.category] || 0) + 1;
  }
  const max = Math.max(1, ...categories.map((c) => counts[c.name] || 0));

  const rows = categories.map((category) => {
    const count = counts[category.name] || 0;

    const label = makeEl("div", "admin-bars__label");
    label.append(makeEl("span", "", category.name), makeEl("span", "", String(count)));

    const fill = makeEl("div", "admin-bars__fill");
    fill.style.width = `${(count / max) * 100}%`;
    const track = makeEl("div", "admin-bars__track");
    track.append(fill);

    const row = makeEl("li", "admin-bars__row");
    row.append(label, track);
    return row;
  });

  $("#category-bars").replaceChildren(...rows);
}

function statusBadge(status) {
  const modifier = String(status || "").toLowerCase().replace(/[^a-z]/g, "");
  return makeEl("span", `admin-badge admin-badge--${modifier}`, status || "–");
}

function renderRecentOrders(orders) {
  $("#orders-empty").hidden = orders.length !== 0;

  const rows = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, RECENT_ORDERS_COUNT)
    .map((order) => {
      const statusCell = makeEl("td");
      statusCell.append(statusBadge(order.status));

      const row = makeEl("tr");
      row.append(
        makeEl("td", "admin-product-name", `#${order.id}`),
        makeEl("td", "", order.customerName || "–"),
        makeEl("td", "", formatDate(order.createdAt)),
        makeEl("td", "", order.paymentMethod || "–"),
        makeEl("td", "", formatMoney(order.total)),
        statusCell
      );
      return row;
    });

  $("#recent-orders-body").replaceChildren(...rows);
}

async function init() {
  try {
    const [products, categories, orders] = await Promise.all([
      productsStore.getAll(),
      categoriesStore.getAll(),
      ordersStore.getAll(),
    ]);

    const data = {
      products: toList(products),
      categories: toList(categories),
      orders: toList(orders),
    };

    $("#dashboard-error").hidden = true;
    renderStats(data);
    renderLowStock(data.products);
    renderCategoryBars(data.products, data.categories);
    renderRecentOrders(data.orders);
  } catch (error) {
    console.error(error);
    const box = $("#dashboard-error");
    box.textContent = "Could not load dashboard data. Please try again.";
    box.hidden = false;
  }
}

initSidebarToggle();
init();

window.addEventListener("storage", init);
window.addEventListener("pageshow", (event) => {
  if (event.persisted) init();
});
