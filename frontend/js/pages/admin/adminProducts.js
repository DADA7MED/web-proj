import { productsStore } from "../../stores/productsStore.js";
import { categoriesStore } from "../../stores/categoriesStore.js";
import { $, makeEl, formatMoney, debounce, initSidebarToggle } from "./adminUtils.js";

const LOW_STOCK = 5;
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect width="48" height="48" fill="#e9edf5"/><text x="24" y="30" font-size="18" text-anchor="middle" fill="#76849f">?</text></svg>'
  );

const tbody = $("#products-body");
const searchInput = $("#search");
const categorySelect = $("#category-filter");
const emptyState = $("#empty-state");
const resultCount = $("#result-count");
const dialog = $("#confirm-dialog");
const confirmText = $("#confirm-text");

let products = [];
let pendingDeleteId = null;

function stockBadge(stock) {
  if (stock <= 0) return makeEl("span", "admin-badge admin-badge--out", "Out of stock");
  if (stock <= LOW_STOCK) return makeEl("span", "admin-badge admin-badge--low", `Low · ${stock}`);
  return makeEl("span", "admin-badge admin-badge--ok", `${stock} in stock`);
}

function createRow(product) {
  const image = makeEl("img", "admin-thumb");
  image.alt = product.name;
  image.src = product.images?.[0] || product.image || PLACEHOLDER_IMAGE;
  image.addEventListener("error", () => { image.src = PLACEHOLDER_IMAGE; }, { once: true });
  const imageCell = makeEl("td");
  imageCell.append(image);

  const stockCell = makeEl("td");
  stockCell.append(stockBadge(Number(product.stock)));

  const editLink = makeEl("a", "admin-btn admin-btn--sm", "Edit");
  editLink.href = `product-form.html?id=${encodeURIComponent(product.id)}`;

  const deleteButton = makeEl("button", "admin-btn admin-btn--sm admin-btn--ghost-danger", "Delete");
  deleteButton.type = "button";
  deleteButton.dataset.action = "delete";
  deleteButton.dataset.id = product.id;

  const actions = makeEl("div", "admin-actions");
  actions.append(editLink, deleteButton);
  const actionsCell = makeEl("td");
  actionsCell.append(actions);

  const row = makeEl("tr");
  row.append(
    imageCell,
    makeEl("td", "admin-product-name", product.name),
    makeEl("td", "", product.brand),
    makeEl("td", "", product.category),
    makeEl("td", "", formatMoney(product.price)),
    stockCell,
    actionsCell
  );
  return row;
}

function getFilteredProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categorySelect.value;

  return products.filter((product) => {
    const matchesQuery =
      !query ||
      String(product.name).toLowerCase().includes(query) ||
      String(product.brand).toLowerCase().includes(query);
    const matchesCategory = !category || product.category === category;
    return matchesQuery && matchesCategory;
  });
}

function render() {
  const list = getFilteredProducts();
  tbody.replaceChildren(...list.map(createRow));
  emptyState.hidden = list.length !== 0;
  resultCount.textContent = `Showing ${list.length} of ${products.length} products`;
}

async function loadProducts() {
  const result = await productsStore.getAll();
  products = Array.isArray(result) ? result : [];
  render();
}

async function fillCategories() {
  const categories = await categoriesStore.getAll();
  for (const category of categories) {
    const option = makeEl("option", "", category.name);
    option.value = category.name;
    categorySelect.append(option);
  }
}

searchInput.addEventListener("input", debounce(render));
categorySelect.addEventListener("change", render);

tbody.addEventListener("click", (event) => {
  const button = event.target.closest('[data-action="delete"]');
  if (!button) return;

  const product = products.find((p) => p.id === button.dataset.id);
  if (!product) return;

  pendingDeleteId = product.id;
  confirmText.textContent = `"${product.name}" will be permanently removed.`;
  dialog.showModal();
});

$("#confirm-cancel").addEventListener("click", () => dialog.close());

$("#confirm-ok").addEventListener("click", async () => {
  if (pendingDeleteId) {
    await productsStore.remove(pendingDeleteId);
    pendingDeleteId = null;
    await loadProducts();
  }
  dialog.close();
});

initSidebarToggle();
fillCategories();
loadProducts();
