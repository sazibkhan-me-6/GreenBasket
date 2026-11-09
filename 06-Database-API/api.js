// Mock Database & API Client using browser localStorage for instant reactivity
import { initialProducts } from '../02-Products/products.js';

const STORAGE_KEYS = {
  PRODUCTS: 'gb_products',
  ORDERS: 'gb_orders',
  USER: 'gb_current_user',
  CART: 'gb_cart',
  FAVORITES: 'gb_favorites',
};

// Safe localStorage helper
const getStore = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setStore = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Storage quota exceeded or disabled', e);
  }
};

export const api = {
  // --- Products ---
  getProducts: () => {
    const stored = getStore(STORAGE_KEYS.PRODUCTS, null);
    if (!stored || !Array.isArray(stored) || stored.length === 0) {
      setStore(STORAGE_KEYS.PRODUCTS, initialProducts);
      return initialProducts;
    }
    return stored;
  },

  addProduct: (productData) => {
    const products = api.getProducts();
    const newProduct = {
      id: Date.now(),
      rating: 5.0,
      reviews: 1,
      stock: Number(productData.stock) || 20,
      image: productData.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=500&q=85',
      tag: productData.tag || 'Fresh harvest',
      ...productData,
      price: Number(productData.price) || 1.99,
      discountPrice: productData.discountPrice ? Number(productData.discountPrice) : null,
    };
    const updated = [newProduct, ...products];
    setStore(STORAGE_KEYS.PRODUCTS, updated);
    return newProduct;
  },

  updateProduct: (id, updatedFields) => {
    const products = api.getProducts().map(p => {
      if (p.id === id) {
        const discountVal = updatedFields.discountPrice !== undefined && updatedFields.discountPrice !== '' 
          ? Number(updatedFields.discountPrice) 
          : (updatedFields.discountPrice === '' ? null : p.discountPrice);
        return {
          ...p,
          ...updatedFields,
          price: updatedFields.price !== undefined ? Number(updatedFields.price) : p.price,
          discountPrice: discountVal
        };
      }
      return p;
    });
    setStore(STORAGE_KEYS.PRODUCTS, products);
    return products;
  },

  deleteProduct: (id) => {
    const products = api.getProducts().filter(p => p.id !== id);
    setStore(STORAGE_KEYS.PRODUCTS, products);
    return products;
  },

  saveProducts: (products) => {
    setStore(STORAGE_KEYS.PRODUCTS, products);
    return products;
  },

  resetProducts: () => {
    setStore(STORAGE_KEYS.PRODUCTS, initialProducts);
    return initialProducts;
  },

  // --- Orders ---
  getOrders: () => {
    return getStore(STORAGE_KEYS.ORDERS, [
      {
        id: 'GB-1001',
        date: '2026-10-25 14:32',
        customerName: 'Sarah Jenkins',
        customerPhone: '+1 (555) 234-5678',
        address: '14 Elm Street, Green Valley',
        total: 24.50,
        status: 'Delivered',
        paymentMethod: 'Credit Card',
        items: [
          { name: 'Organic Tomatoes', qty: 2, price: 2.49 },
          { name: 'Farm Eggs (6pcs)', qty: 3, price: 1.99 },
          { name: 'Red Apples', qty: 4, price: 2.99 }
        ]
      }
    ]);
  },

  createOrder: ({ items, total, customer, paymentMethod }) => {
    const orders = api.getOrders();
    const custName = (customer && customer.name) ? customer.name : 'Valued Customer';
    const custPhone = (customer && customer.phone) ? customer.phone : '';
    const custAddr = (customer && customer.address) ? customer.address : 'Standard Delivery';
    const custNotes = (customer && customer.notes) ? customer.notes : '';
    const newOrder = {
      id: 'GB-' + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      customerName: custName,
      customer: custName,
      customerPhone: custPhone,
      phone: custPhone,
      address: custAddr,
      deliveryAddress: custAddr,
      notes: custNotes,
      total: Number(total),
      paymentMethod: paymentMethod || 'Cash on Delivery',
      paymentStatus: (paymentMethod === 'Cash on Delivery' || paymentMethod === 'cod') ? 'Pending' : 'Paid',
      status: 'Processing',
      items,
    };
    const updated = [newOrder, ...orders];
    setStore(STORAGE_KEYS.ORDERS, updated);
    return newOrder;
  },

  // --- Auth / User ---
  getCurrentUser: () => {
    return getStore(STORAGE_KEYS.USER, null);
  },

  login: (email, password, role = 'customer', extraData = {}) => {
    const user = {
      email,
      name: extraData.name || email.split('@')[0],
      phone: extraData.phone || '',
      address: extraData.address || '',
      role: role === 'admin' ? 'admin' : (email.includes('admin') ? 'admin' : 'customer'),
      token: 'jwt_mock_' + Date.now(),
    };
    setStore(STORAGE_KEYS.USER, user);
    return user;
  },

  logout: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch (e) {}
  },

  // --- Cart Persistence ---
  getCart: () => getStore(STORAGE_KEYS.CART, {}),
  saveCart: (cart) => setStore(STORAGE_KEYS.CART, cart),

  // --- Favorites Persistence ---
  getFavorites: () => getStore(STORAGE_KEYS.FAVORITES, []),
  saveFavorites: (favs) => setStore(STORAGE_KEYS.FAVORITES, favs),
};
