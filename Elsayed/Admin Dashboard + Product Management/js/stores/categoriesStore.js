// TEMP store with mock data. Replace with the real store; keep the same function names (getAll).
const KEY = "categories";
const seed = [
  { id: "cat-gaming", name: "Gaming Laptops" },
  { id: "cat-business", name: "Business Laptops" },
  { id: "cat-student", name: "Student Laptops" },
  { id: "cat-ultra", name: "Ultrabooks" },
];

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  localStorage.setItem(KEY, JSON.stringify(seed));
  return [...seed];
}

export const categoriesStore = {
  getAll: () => read(),
};
