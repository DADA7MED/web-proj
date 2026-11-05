// TEMP store with mock data. Replace with the real store; keep the same function names (getAll, getById, remove).
const KEY = "products";
const seed = [
  { id: "lp-001", name: "Dell XPS 15", brand: "Dell", category: "Ultrabooks", price: 1500, stock: 10, image: "" },
  { id: "lp-002", name: "MacBook Air M2", brand: "Apple", category: "Student Laptops", price: 1200, stock: 5, image: "" },
  { id: "lp-003", name: "Lenovo Legion 5", brand: "Lenovo", category: "Gaming Laptops", price: 1100, stock: 0, image: "" },
  { id: "lp-004", name: "ThinkPad T14", brand: "Lenovo", category: "Business Laptops", price: 980, stock: 3, image: "" },
  { id: "lp-005", name: "ASUS ROG Strix G16", brand: "ASUS", category: "Gaming Laptops", price: 1800, stock: 7, image: "" },
];

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  localStorage.setItem(KEY, JSON.stringify(seed));
  return [...seed];
}
function write(list) { localStorage.setItem(KEY, JSON.stringify(list)); }

export const productsStore = {
  getAll: () => read(),
  getById: (id) => read().find((p) => p.id === id) || null,
  remove: (id) => write(read().filter((p) => p.id !== id)),
};
