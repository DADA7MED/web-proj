// js/stores/ordersStore.js
const KEY = "orders";
const day = 24 * 60 * 60 * 1000;

const seed = [
  {
    id: "EXP-8849",
    customerName: "Alexander Vance",
    email: "demo@apex.com",
    createdAt: Date.now() - 1 * day,
    total: 3506.76,
    subtotal: 3299.00,
    discount: 150.00,
    shipping: 45.00,
    tax: 312.76,
    paymentMethod: "Credit Card",
    status: "Processing",
    shippingAddress: "742 Market Street, Suite 400, San Francisco, CA 94103",
    items: [
      { id: 1, name: "Zenith Pro 16 Extreme Silicon Workstation", price: 3148.00, quantity: 1, image: "assets/images/products/zenith-pro-16.jpeg" }
    ]
  },
  {
    id: "EXP-8850",
    customerName: "Elena Rostova",
    email: "elena@techworks.io",
    createdAt: Date.now() - 2 * day,
    total: 4199.00,
    subtotal: 4199.00,
    discount: 0,
    shipping: 0,
    tax: 0,
    paymentMethod: "Bank Transfer",
    status: "Shipped",
    shippingAddress: "128 Innovation Way, Seattle, WA 98101",
    items: [
      { id: 3, name: "Vortex Titan Gaming 18", price: 2199.00, quantity: 1, image: "assets/images/products/vortex-18.jpeg" },
      { id: 2, name: "Apex Ultra-Portable 14", price: 1299.00, quantity: 1, image: "assets/images/products/apex-14.jpeg" }
    ]
  },
  {
    id: "EXP-8848",
    customerName: "Apex Simulation Labs",
    email: "procurement@apexlabs.corp",
    createdAt: Date.now() - 3 * day,
    total: 14890.00,
    subtotal: 14890.00,
    discount: 0,
    shipping: 0,
    tax: 0,
    paymentMethod: "Net-30",
    status: "Pending",
    shippingAddress: "Building 4, Silicon Boulevard, Austin, TX 78701",
    items: [
      { id: 1, name: "Zenith Pro 16 Extreme Silicon Workstation", price: 3148.00, quantity: 4, image: "assets/images/products/zenith-pro-16.jpeg" }
    ]
  },
  {
    id: "EXP-8845",
    customerName: "Marcus Thorne",
    email: "marcus.thorne@gmail.com",
    createdAt: Date.now() - 5 * day,
    total: 2899.00,
    subtotal: 2899.00,
    discount: 0,
    shipping: 0,
    tax: 0,
    paymentMethod: "Apple Pay",
    status: "Delivered",
    shippingAddress: "55 Wall St, New York, NY 10005",
    items: [
      { id: 1, name: "Zenith Pro 16 Extreme Silicon Workstation", price: 2899.00, quantity: 1, image: "assets/images/products/zenith-pro-16.jpeg" }
    ]
  },
  {
    id: "EXP-8844",
    customerName: "Sara Ali",
    email: "sara.ali@outlook.com",
    createdAt: Date.now() - 6 * day,
    total: 1200.00,
    subtotal: 1199.00,
    discount: 0,
    shipping: 0,
    tax: 1.00,
    paymentMethod: "Cash on Delivery",
    status: "Pending",
    shippingAddress: "Downtown District 5, Cairo, Egypt",
    items: [
      { id: 4, name: "FlexBook 360 Touch 13", price: 1199.00, quantity: 1, image: "assets/images/products/flexbook-13.jpeg" }
    ]
  },
  {
    id: "EXP-8840",
    customerName: "Omar Hassan",
    email: "omar.h@techhub.net",
    createdAt: Date.now() - 8 * day,
    total: 980.00,
    subtotal: 980.00,
    discount: 0,
    shipping: 0,
    tax: 0,
    paymentMethod: "Credit Card",
    status: "Cancelled",
    shippingAddress: "Al-Bahr St, Banha, Egypt",
    items: [
      { id: 2, name: "Apex Ultra-Portable 14", price: 980.00, quantity: 1, image: "assets/images/products/apex-14.jpeg" }
    ]
  }
];

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  localStorage.setItem(KEY, JSON.stringify(seed));
  return [...seed];
}

function write(orders) {
  try {
    localStorage.setItem(KEY, JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent('orders-updated', { detail: { orders } }));
  } catch (e) {
    console.error('Error saving orders:', e);
  }
}

export const ordersStore = {
  getAll() {
    return read();
  },

  getById(id) {
    const list = read();
    return list.find(o => String(o.id).toLowerCase() === String(id).toLowerCase()) || null;
  },

  getUserOrders(email) {
    const list = read();
    if (!email) return list;
    return list.filter(o => o.email && o.email.toLowerCase() === email.toLowerCase());
  },

  createOrder(orderData) {
    const list = read();
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const newOrder = {
      id: `EXP-${randNum}`,
      customerName: orderData.customerName || "Customer",
      email: orderData.email || "",
      phone: orderData.phone || "",
      shippingAddress: orderData.shippingAddress || "",
      city: orderData.city || "",
      postalCode: orderData.postalCode || "",
      country: orderData.country || "United States",
      paymentMethod: orderData.paymentMethod || "Credit Card",
      shippingMethod: orderData.shippingMethod || "Express Ground",
      status: "Processing",
      createdAt: Date.now(),
      subtotal: Number(orderData.subtotal || 0),
      discount: Number(orderData.discount || 0),
      shipping: Number(orderData.shipping || 0),
      tax: Number(orderData.tax || 0),
      total: Number(orderData.total || 0),
      items: Array.isArray(orderData.items) ? orderData.items : []
    };

    list.unshift(newOrder);
    write(list);
    return newOrder;
  },

  updateStatus(id, newStatus) {
    const list = read();
    const order = list.find(o => String(o.id).toLowerCase() === String(id).toLowerCase());
    if (!order) throw new Error(`Order ${id} not found.`);

    order.status = newStatus;
    write(list);
    return order;
  },

  cancelOrder(id) {
    return this.updateStatus(id, 'Cancelled');
  }
};

if (typeof window !== 'undefined') {
  window.ordersStore = ordersStore;
}
