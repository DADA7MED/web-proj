// js/pages/admin/adminProductForm.js
import { productsStore } from "../../stores/productsStore.js";
import { categoriesStore } from "../../stores/categoriesStore.js";
import { initSidebarToggle } from "./adminUtils.js";

document.addEventListener("DOMContentLoaded", async () => {
  initSidebarToggle();
  await productsStore.init();
  await categoriesStore.init();

  const urlParams = new URLSearchParams(window.location.search);
  const editId = urlParams.get("id");

  const categorySelect = document.getElementById("p-category");
  const categories = categoriesStore.getAllCategories();
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat.id;
    opt.textContent = cat.name;
    categorySelect.appendChild(opt);
  });

  let editingProduct = null;
  if (editId) {
    editingProduct = productsStore.getProductById(editId);
    if (editingProduct) {
      document.getElementById("page-title").textContent = "Edit Product";
      document.getElementById("form-crumb-action").textContent = `Edit #${editingProduct.id}`;
      document.getElementById("save-btn").textContent = "Update Product";

      document.getElementById("p-name").value = editingProduct.name || "";
      document.getElementById("p-category").value = editingProduct.category_id || "";
      document.getElementById("p-brand").value = editingProduct.brand || "";
      document.getElementById("p-price").value = editingProduct.price || "";
      document.getElementById("p-old-price").value = editingProduct.old_price || "";
      document.getElementById("p-stock").value = editingProduct.stock || "";
      document.getElementById("p-badge").value = editingProduct.badge_text || "";
      document.getElementById("p-cpu").value = editingProduct.specs?.cpu || "";
      document.getElementById("p-ram").value = editingProduct.specs?.ram || "";
      document.getElementById("p-storage").value = editingProduct.specs?.storage || "";
      document.getElementById("p-gpu").value = editingProduct.specs?.gpu || "";
      document.getElementById("p-image").value = editingProduct.image || "";
      document.getElementById("p-desc").value = editingProduct.description || "";
    }
  }

  const form = document.getElementById("product-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
      name: document.getElementById("p-name").value.trim(),
      category_id: Number(document.getElementById("p-category").value),
      brand: document.getElementById("p-brand").value.trim() || "Apex",
      price: parseFloat(document.getElementById("p-price").value),
      old_price: document.getElementById("p-old-price").value ? parseFloat(document.getElementById("p-old-price").value) : null,
      stock: parseInt(document.getElementById("p-stock").value, 10),
      badge_text: document.getElementById("p-badge").value.trim(),
      image: document.getElementById("p-image").value.trim() || "assets/images/products/zenith-pro-16.jpeg",
      description: document.getElementById("p-desc").value.trim(),
      specs: {
        cpu: document.getElementById("p-cpu").value.trim(),
        ram: document.getElementById("p-ram").value.trim(),
        storage: document.getElementById("p-storage").value.trim(),
        gpu: document.getElementById("p-gpu").value.trim()
      }
    };

    try {
      if (editingProduct) {
        productsStore.updateProduct(editingProduct.id, data);
        alert("Product updated successfully!");
      } else {
        productsStore.addProduct(data);
        alert("Product added successfully!");
      }
      window.location.href = "products.html";
    } catch (err) {
      alert("Error: " + err.message);
    }
  });
});
