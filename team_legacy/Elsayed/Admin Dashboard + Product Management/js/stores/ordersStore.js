// TEMP store with mock data. Replace with the real store; keep the same function names (getAll).
const KEY = "orders";
const day = 24 * 60 * 60 * 1000;
const seed = [
  { id: "EXP-8849", customerName: "Alexander Vance", createdAt: Date.now() - 1 * day, total: 3506.76, paymentMethod: "Credit Card", status: "Processing" },
  { id: "EXP-8850", customerName: "Elena Rostova", createdAt: Date.now() - 2 * day, total: 4199.0, paymentMethod: "Bank Transfer", status: "Shipped" },
  { id: "EXP-8848", customerName: "Apex Simulation Labs", createdAt: Date.now() - 3 * day, total: 14890.0, paymentMethod: "Net-30", status: "Pending" },
  { id: "EXP-8845", customerName: "Marcus Thorne", createdAt: Date.now() - 5 * day, total: 2899.0, paymentMethod: "Apple Pay", status: "Delivered" },
  { id: "EXP-8844", customerName: "Sara Ali", createdAt: Date.now() - 6 * day, total: 1200.0, paymentMethod: "Cash on Delivery", status: "Pending" },
  { id: "EXP-8840", customerName: "Omar Hassan", createdAt: Date.now() - 8 * day, total: 980.0, paymentMethod: "Credit Card", status: "Cancelled" },
];

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  localStorage.setItem(KEY, JSON.stringify(seed));
  return [...seed];
}

export const ordersStore = {
  getAll: () => read(),
};
