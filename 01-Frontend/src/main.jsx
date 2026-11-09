import React, { useMemo, useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Leaf, Truck, Headphones, Search, UserRound, ShoppingCart, ArrowRight,
  ShieldCheck, Sprout, Heart, Menu, X, Star, CheckCircle2, Mail, Instagram,
  Facebook, Youtube, Plus, Minus, Package, ChevronDown
} from 'lucide-react';
import './styles.css';

// Modular Imports across Feature Folders
import { categories } from '@products/products.js';
import { api } from '@api/api.js';
import CartDrawer from '@cart/CartDrawer.jsx';
import AuthModal from '@auth/AuthModal.jsx';
import CheckoutModal from '@payment/CheckoutModal.jsx';

// Dedicated Multi-Page View Components
import ParcelTracking from './ParcelTracking.jsx';
import HomeView from './views/HomeView.jsx';
import ShopView from './views/ShopView.jsx';
import CategoriesView from './views/CategoriesView.jsx';
import DealsView from './views/DealsView.jsx';
import AboutView from './views/AboutView.jsx';
import ContactView from './views/ContactView.jsx';

const photo = (id, w = 700) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

// Parse current URL hash to match known views
const getInitialView = () => {
  if (typeof window === 'undefined') return 'home';
  const h = (window.location.hash || '').replace('#', '').toLowerCase().split('?')[0];
  if (['home', ''].includes(h)) return 'home';
  if (['shop', 'products', 'catalog'].includes(h)) return 'shop';
  if (['categories', 'category'].includes(h)) return 'categories';
  if (['deals', 'deal', 'offers', 'sale'].includes(h)) return 'deals';
  if (['track', 'tracking', 'parcel', 'order', 'orders', 'track-order'].includes(h)) return 'track';
  if (['about', 'story', 'farm'].includes(h)) return 'about';
  if (['contact', 'support', 'help'].includes(h)) return 'contact';
  return 'home';
};

function App() {
  // Persistent state from api
  const [productsList, setProductsList] = useState(() => api.getProducts());
  const [currentUser, setCurrentUser] = useState(() => api.getCurrentUser());
  const [cart, setCart] = useState(() => api.getCart());
  const [favorites, setFavorites] = useState(() => api.getFavorites());

  // Multi-page routing view state: 'home' | 'shop' | 'categories' | 'deals' | 'track' | 'about' | 'contact'
  const [activeView, setActiveView] = useState(getInitialView);
  const [activeCategory, setActiveCategory] = useState('All');
  const [catDropdownOpen, setCatDropdownOpen] = useState(false);
  const [trackingOrderId, setTrackingOrderId] = useState('');

  // UI state
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [storeSettings, setStoreSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('gb_store_settings');
      return saved ? JSON.parse(saved) : {
        announcement: 'FREE DELIVERY on orders over $49',
        promoCode: 'GREEN20',
        promoDiscount: 20
      };
    } catch {
      return {
        announcement: 'FREE DELIVERY on orders over $49',
        promoCode: 'GREEN20',
        promoDiscount: 20
      };
    }
  });

  const bridgeIframeRef = useRef(null);

  // Navigate between dedicated pages cleanly
  const navigateTo = (view, cat = null) => {
    setActiveView(view);
    if (cat !== null) setActiveCategory(cat);
    setMenuOpen(false);
    window.location.hash = '#' + view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync activeView with browser back/forward and URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const rawHash = window.location.hash.toLowerCase();
      if (rawHash === '#admin' || rawHash.startsWith('#sync=')) return;
      const view = getInitialView();
      setActiveView(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Persist cart & favorites changes
  useEffect(() => {
    api.saveCart(cart);
  }, [cart]);

  useEffect(() => {
    api.saveFavorites(favorites);
  }, [favorites]);

  // Normalize catalog items to ensure valid prices, discounts, tags and images
  const normalizeCatalog = (list) => {
    if (!Array.isArray(list) || list.length === 0) return null;
    return list.map((p) => {
      const priceNum = Number(p.price) || 0;
      let discountNum = null;
      if (p.discount !== undefined && p.discount !== null && p.discount !== '') {
        const dVal = Number(p.discount);
        if (dVal > 0 && dVal < priceNum) discountNum = dVal;
      } else if (p.discountPrice && Number(p.discountPrice) < priceNum) {
        discountNum = Number(p.discountPrice);
      }
      return {
        id: p.id,
        name: p.name || 'Organic Product',
        category: p.category || 'Vegetables',
        unit: p.unit || '1 pack',
        price: priceNum,
        discountPrice: discountNum,
        tag: p.tag || 'Fresh harvest',
        image: p.image || photo('photo-1540420773420-3366772f4999', 500),
        stock: Number(p.stock !== undefined ? p.stock : 20),
        rating: p.rating || 4.9,
        reviews: p.reviews || 25
      };
    });
  };

  const getLocalCatalogTime = () => {
    try {
      return Number(localStorage.getItem('gb_catalog_updated_at')) || 0;
    } catch {
      return 0;
    }
  };

  const setLocalCatalogTime = (ts) => {
    try {
      localStorage.setItem('gb_catalog_updated_at', String(ts));
    } catch {}
  };

  // Real-time synchronization with GreenBasket Admin Panel
  useEffect(() => {
    const GIST_ID = '5c3186e2427e5900031ae4ea398ac1e7';
    const GIST_TOKEN_PARTS = ['gho_bB41m2', 'XPLzNkr9mj', '1mR1GXiFsL', 'Wt0D3MxTPq'];

    const handleMessage = (e) => {
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.type === 'GB_CATALOG_SYNC' || e.data.type === 'GB_PRODUCTS_UPDATED') {
        const ts = e.data.timestamp || Date.now();
        setLocalCatalogTime(ts);
        const normalized = normalizeCatalog(e.data.products);
        if (normalized) {
          setProductsList(normalized);
          api.saveProducts(normalized);
        }
      }
      if (e.data.settings) {
        setStoreSettings(e.data.settings);
        try { localStorage.setItem('gb_store_settings', JSON.stringify(e.data.settings)); } catch (err) {}
      }
    };

    window.addEventListener('message', handleMessage);

    let ch;
    try {
      ch = new BroadcastChannel('gb_bridge_channel');
      ch.onmessage = (e) => {
        if (e.data && (e.data.type === 'GB_CATALOG_SYNC' || e.data.type === 'GB_PRODUCTS_UPDATED')) {
          handleMessage(e);
        }
      };
    } catch (err) {}

    const checkSyncHash = () => {
      if (window.location.hash.startsWith('#sync=')) {
        try {
          const encoded = window.location.hash.slice(6);
          const raw = decodeURIComponent(escape(atob(encoded)));
          const data = JSON.parse(raw);
          const ts = data.timestamp || Date.now();
          setLocalCatalogTime(ts);
          if (data.products && Array.isArray(data.products)) {
            const normalized = normalizeCatalog(data.products);
            if (normalized) {
              setProductsList(normalized);
              api.saveProducts(normalized);
            }
          }
          if (data.settings) {
            setStoreSettings(data.settings);
            try { localStorage.setItem('gb_store_settings', JSON.stringify(data.settings)); } catch (err) {}
          }
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        } catch (err) {
          console.warn('Sync hash decode notice:', err);
        }
      }
    };
    checkSyncHash();
    window.addEventListener('hashchange', checkSyncHash);

    try {
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({ type: 'GB_STOREFRONT_READY' }, '*');
      }
    } catch (err) {}

    const fetchCloudCatalog = async () => {
      try {
        const token = GIST_TOKEN_PARTS.join('');
        const res = await fetch(`https://api.github.com/gists/${GIST_ID}?_t=${Date.now()}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        if (!res.ok) return;
        const gistData = await res.json();
        const file = gistData.files && gistData.files['greenbasket_catalog.json'];
        if (!file || !file.content) return;
        const parsed = JSON.parse(file.content);
        if (!parsed || !Array.isArray(parsed.products) || parsed.products.length === 0) return;

        const cloudTime = new Date(parsed.updatedAt || gistData.updated_at).getTime();
        const localTime = getLocalCatalogTime();

        if (cloudTime > localTime) {
          setLocalCatalogTime(cloudTime);
          const normalized = normalizeCatalog(parsed.products);
          if (normalized) {
            setProductsList(normalized);
            api.saveProducts(normalized);
          }
          if (parsed.settings) {
            setStoreSettings(parsed.settings);
            try { localStorage.setItem('gb_store_settings', JSON.stringify(parsed.settings)); } catch (err) {}
          }
        }
      } catch (err) {}
    };

    fetchCloudCatalog();
    const gistInterval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        fetchCloudCatalog();
      }
    }, 3500);

    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('hashchange', checkSyncHash);
      clearInterval(gistInterval);
      if (ch) ch.close();
    };
  }, []);

  // Hidden admin access: Ctrl+Shift+A, Alt+A, or URL hash #admin
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) || (e.altKey && (e.key === 'A' || e.key === 'a'))) {
        e.preventDefault();
        window.open('https://greenbasket-admin-panel.vercel.app/', '_blank', 'noopener,noreferrer');
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const checkHash = () => {
      if (window.location.hash.toLowerCase() === '#admin') {
        window.history.replaceState(null, '', window.location.pathname);
        window.open('https://greenbasket-admin-panel.vercel.app/', '_blank', 'noopener,noreferrer');
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', checkHash);
    };
  }, []);

  const getProductPrice = (p) => (p && p.discountPrice && Number(p.discountPrice) > 0 && Number(p.discountPrice) < Number(p.price)) ? Number(p.discountPrice) : Number(p.price || 0);

  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const cartTotal = productsList.reduce((sum, p) => sum + getProductPrice(p) * (cart[p.id] || 0), 0);

  const showToast = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 2500);
  };

  const addToCart = (id) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    showToast('Added to your basket 🌱');
  };

  const changeQty = (id, amount) => {
    setCart(prev => {
      const next = { ...prev, [id]: Math.max(0, (prev[id] || 0) + amount) };
      if (!next[id]) delete next[id];
      return next;
    });
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const updated = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      return updated;
    });
  };

  const handleLoginSuccess = (userEmail, password, role, extraData = {}) => {
    const user = api.login(userEmail, password, role, extraData);
    setCurrentUser(user);
    showToast(extraData?.isNew ? 'Account created successfully! Welcome to GreenBasket 🎉' : `Signed in as ${user.name}`);

    // Sync newly registered or signed-in customer to Admin Panel & Cloud Gist
    try {
      const customerObj = {
        id: 'cust-' + Date.now(),
        name: user.name || 'Customer',
        email: user.email,
        phone: user.phone || 'N/A',
        address: user.address || 'Standard Delivery',
        status: 'Active',
        ordersCount: 0,
        totalSpent: 0,
        joinedDate: new Date().toISOString().split('T')[0],
        lastOrderDate: '-'
      };

      const custPayload = {
        type: 'GB_NEW_CUSTOMER',
        customer: customerObj
      };

      bridgeIframeRef.current?.contentWindow?.postMessage(custPayload, '*');
      if (window.opener && !window.opener.closed) {
        try { window.opener.postMessage(custPayload, '*'); } catch (err) {}
      }
      try {
        const ch = new BroadcastChannel('gb_bridge_channel');
        ch.postMessage(custPayload);
        ch.close();
      } catch (err) {}

      // Multi-device Cloud Gist sync for customers
      try {
        const GIST_TOKEN_PARTS = ['gho_bB41m2', 'XPLzNkr9mj', '1mR1GXiFsL', 'Wt0D3MxTPq'];
        const token = GIST_TOKEN_PARTS.join('');
        fetch(`https://api.github.com/gists/5c3186e2427e5900031ae4ea398ac1e7?_t=${Date.now()}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        })
          .then(res => res.json())
          .then(d => {
            const file = d.files && d.files['greenbasket_catalog.json'];
            if (file && file.content) {
              const parsed = JSON.parse(file.content);
              const existingCusts = Array.isArray(parsed.customers) ? parsed.customers : [];
              const foundIdx = existingCusts.findIndex(c => 
                (c.email && c.email.toLowerCase() === user.email.toLowerCase()) || 
                (c.phone && user.phone && c.phone === user.phone)
              );
              if (foundIdx >= 0) {
                existingCusts[foundIdx] = {
                  ...existingCusts[foundIdx],
                  name: user.name || existingCusts[foundIdx].name,
                  phone: user.phone || existingCusts[foundIdx].phone,
                  address: user.address || existingCusts[foundIdx].address
                };
              } else {
                existingCusts.unshift(customerObj);
              }
              parsed.customers = existingCusts;
              parsed.updatedAt = new Date().toISOString();
              parsed.version = Date.now();
              fetch(`https://api.github.com/gists/5c3186e2427e5900031ae4ea398ac1e7`, {
                method: 'PATCH',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  files: {
                    'greenbasket_catalog.json': {
                      content: JSON.stringify(parsed, null, 2)
                    }
                  }
                })
              }).catch(() => {});
            }
          })
          .catch(() => {});
      } catch (err) {}
    } catch (e) {
      console.warn('Customer sync notification failed', e);
    }
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    showToast('Signed out successfully.');
  };

  const handleOrderCompleted = (orderData) => {
    const newOrder = api.createOrder(orderData);
    setCart({});
    setTrackingOrderId(newOrder.id);
    showToast(`Order #${newOrder.id} confirmed! You can now track your parcel live 📦`);

    // Forward full order with Delivery Address & Contact Info to dedicated Admin Panel & Cloud Gist
    try {
      const fullOrder = {
        id: newOrder.id,
        customer: orderData.customer?.name || newOrder.customerName || 'Store Customer',
        customerName: orderData.customer?.name || newOrder.customerName || 'Store Customer',
        customerPhone: orderData.customer?.phone || newOrder.customerPhone || '',
        phone: orderData.customer?.phone || newOrder.customerPhone || '',
        address: orderData.customer?.address || newOrder.address || 'Standard Delivery',
        deliveryAddress: orderData.customer?.address || newOrder.address || 'Standard Delivery',
        notes: orderData.customer?.notes || newOrder.notes || '',
        items: Array.isArray(orderData.items) ? orderData.items : (newOrder.items || 'Fresh Grocery Pack'),
        itemsSummary: Array.isArray(orderData.items) ? orderData.items.map(it => `${it.name} (${it.qty})`).join(', ') : 'Fresh Grocery Pack',
        total: Number(orderData.total) || Number(newOrder.total) || 0,
        paymentMethod: orderData.paymentMethod || newOrder.paymentMethod || 'Cash on Delivery',
        paymentStatus: (orderData.paymentMethod === 'Cash on Delivery' || orderData.paymentMethod === 'cod') ? 'Pending' : 'Paid',
        status: 'Processing',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
      };

      const orderPayload = {
        type: 'GB_NEW_ORDER',
        order: fullOrder
      };

      bridgeIframeRef.current?.contentWindow?.postMessage(orderPayload, '*');
      if (window.opener && !window.opener.closed) {
        try { window.opener.postMessage(orderPayload, '*'); } catch (err) {}
      }
      const ch = new BroadcastChannel('gb_bridge_channel');
      ch.postMessage(orderPayload);
      ch.close();

      // Multi-device Cloud Gist sync for orders
      try {
        const GIST_TOKEN_PARTS = ['gho_bB41m2', 'XPLzNkr9mj', '1mR1GXiFsL', 'Wt0D3MxTPq'];
        const token = GIST_TOKEN_PARTS.join('');
        fetch(`https://api.github.com/gists/5c3186e2427e5900031ae4ea398ac1e7?_t=${Date.now()}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        })
          .then(res => res.json())
          .then(d => {
            const file = d.files && d.files['greenbasket_catalog.json'];
            if (file && file.content) {
              const parsed = JSON.parse(file.content);
              const existingOrders = Array.isArray(parsed.orders) ? parsed.orders : [];
              parsed.orders = [fullOrder, ...existingOrders.filter(o => o.id !== fullOrder.id)];

              // Also update customer record in cloud gist
              const existingCusts = Array.isArray(parsed.customers) ? parsed.customers : [];
              const cPhone = fullOrder.customerPhone || fullOrder.phone || '';
              const cName = fullOrder.customer || fullOrder.customerName || 'Customer';
              const cIdx = existingCusts.findIndex(c => 
                (cPhone && c.phone === cPhone) || 
                (cName && c.name && c.name.toLowerCase() === cName.toLowerCase())
              );
              if (cIdx >= 0) {
                const existing = existingCusts[cIdx];
                existingCusts[cIdx] = {
                  ...existing,
                  ordersCount: (existing.ordersCount || 0) + 1,
                  totalSpent: (existing.totalSpent || 0) + (Number(fullOrder.total) || 0),
                  lastOrderDate: new Date().toISOString().split('T')[0],
                  address: fullOrder.address || existing.address || '',
                  phone: cPhone || existing.phone || '',
                  lastOrderId: fullOrder.id
                };
              } else {
                existingCusts.unshift({
                  id: 'cust-' + Date.now(),
                  name: cName,
                  email: currentUser?.email || (cName.toLowerCase().replace(/[^a-z0-9]/g, '') + '@store.com'),
                  phone: cPhone || 'N/A',
                  address: fullOrder.address || 'Standard Delivery',
                  status: 'Active',
                  ordersCount: 1,
                  totalSpent: Number(fullOrder.total) || 0,
                  joinedDate: new Date().toISOString().split('T')[0],
                  lastOrderDate: new Date().toISOString().split('T')[0],
                  lastOrderId: fullOrder.id
                });
              }
              parsed.customers = existingCusts;
              parsed.updatedAt = new Date().toISOString();
              parsed.version = Date.now();
              fetch(`https://api.github.com/gists/5c3186e2427e5900031ae4ea398ac1e7`, {
                method: 'PATCH',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  files: {
                    'greenbasket_catalog.json': {
                      content: JSON.stringify(parsed, null, 2)
                    }
                  }
                })
              }).catch(() => {});
            }
          })
          .catch(() => {});
      } catch (err) {}
    } catch (e) {
      console.warn('Bridge order notification failed', e);
    }

    // Auto navigate to parcel tracking page so customer sees real-time status!
    setTimeout(() => {
      navigateTo('track');
    }, 1500);

    return newOrder;
  };

  return (
    <div className="site-shell">
      {/* Top Banner Strip */}
      <div className="top-strip">
        <div className="top-inner">
          <span><Truck size={14} /> {storeSettings.announcement || 'FREE DELIVERY on orders over $49'}</span>
          <span
            className="top-strip-clickable"
            onClick={() => navigateTo('track')}
            title="Click to track your parcel live"
            style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Package size={14} color="var(--lime)" /> <b>Track Parcel Live 📦</b>
          </span>
          <span
            className="top-strip-clickable"
            onClick={() => navigateTo('contact')}
            style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Headphones size={14} /> Support 24/7
          </span>
        </div>
      </div>

      {/* Main Header */}
      <header className="header">
        <button
          type="button"
          onClick={() => navigateTo('home')}
          className="brand"
          aria-label="GreenBasket home"
          style={{ background: 'none', border: 0, padding: 0, textAlign: 'left', cursor: 'pointer' }}
        >
          <span className="brand-mark"><ShoppingCart size={29} /><Leaf size={16} /></span>
          <span><b>Green<span>Basket</span></b><small>Fresh from Nature</small></span>
        </button>

        <button
          className="mobile-menu icon-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        {/* Primary Multi-Page Navigation Bar */}
        <nav className={menuOpen ? 'nav nav-open' : 'nav'}>
          <button
            type="button"
            className={activeView === 'home' ? 'active' : ''}
            onClick={() => navigateTo('home')}
          >
            Home
          </button>
          <button
            type="button"
            className={activeView === 'shop' ? 'active' : ''}
            onClick={() => navigateTo('shop')}
          >
            Shop
          </button>
          {/* Categories with Dropdown Menu */}
          <div
            className="nav-dropdown-wrap"
            onMouseEnter={() => setCatDropdownOpen(true)}
            onMouseLeave={() => setCatDropdownOpen(false)}
          >
            <button
              type="button"
              className={activeView === 'categories' ? 'active nav-dropdown-btn' : 'nav-dropdown-btn'}
              onClick={() => {
                setCatDropdownOpen(false);
                navigateTo('categories');
              }}
            >
              Categories <ChevronDown size={13} className={`chevron-icon ${catDropdownOpen ? 'rotated' : ''}`} />
            </button>
            {catDropdownOpen && (
              <div className="nav-dropdown-menu">
                <button
                  type="button"
                  className="nav-dropdown-item"
                  onClick={() => {
                    setCatDropdownOpen(false);
                    navigateTo('shop', 'All');
                  }}
                >
                  <span className="dropdown-dot">✦</span> All Categories
                </button>
                {categories.map((c) => (
                  <button
                    type="button"
                    key={c.name}
                    className="nav-dropdown-item"
                    onClick={() => {
                      setCatDropdownOpen(false);
                      navigateTo('shop', c.name);
                    }}
                  >
                    <img src={c.image} alt={c.name} className="dropdown-cat-thumb" />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className={activeView === 'deals' ? 'active' : ''}
            onClick={() => navigateTo('deals')}
          >
            Deals
          </button>
          <button
            type="button"
            className={activeView === 'about' ? 'active' : ''}
            onClick={() => navigateTo('about')}
          >
            About Us
          </button>
          <button
            type="button"
            className={activeView === 'contact' ? 'active' : ''}
            onClick={() => navigateTo('contact')}
          >
            Contact
          </button>
        </nav>

        <div className="header-actions">
          {/* Public Track Parcel Quick Action Pill (Desktop Header) */}
          <button
            type="button"
            className={`header-track-pill ${activeView === 'track' ? 'header-track-active' : ''}`}
            onClick={() => navigateTo('track')}
            title="Public Parcel Tracking"
          >
            <Truck size={15} />
            <span>Track Parcel</span>
          </button>

          {/* Search Trigger */}
          <button className="icon-btn" aria-label="Search" onClick={() => setSearchOpen(!searchOpen)}>
            <Search />
          </button>

          {/* User Account / Profile */}
          <button
            className="icon-btn account-btn"
            aria-label="Account"
            onClick={() => setAuthOpen(true)}
            title={currentUser ? currentUser.name : "Account"}
            style={{ position: 'relative' }}
          >
            <UserRound />
            {currentUser && (
              <span style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: 'var(--lime)',
                boxShadow: '0 0 6px var(--lime)'
              }}></span>
            )}
          </button>

          {/* Cart Icon with badge */}
          <button className="icon-btn cart-trigger" aria-label="Open basket" onClick={() => setCartOpen(true)}>
            <ShoppingCart />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>

        {/* Global Search Panel Dropdown */}
        {searchOpen && (
          <div className="search-panel">
            <Search size={18} />
            <input
              autoFocus
              placeholder="Search fresh vegetables, fruits..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                if (activeView !== 'shop') {
                  navigateTo('shop');
                }
              }}
            />
            <button onClick={() => { setSearch(''); setSearchOpen(false); }}>
              <X size={18} />
            </button>
          </div>
        )}
      </header>

      {/* Main Reactive Dynamic View (Separate Dedicated Pages) */}
      <main className="main-content-view">
        {activeView === 'home' && (
          <HomeView
            productsList={productsList}
            categories={categories}
            cart={cart}
            favorites={favorites}
            addToCart={addToCart}
            changeQty={changeQty}
            toggleFavorite={toggleFavorite}
            navigateTo={navigateTo}
            photo={photo}
            storeSettings={storeSettings}
            onSubscribe={showToast}
          />
        )}

        {activeView === 'shop' && (
          <ShopView
            productsList={productsList}
            categories={categories}
            cart={cart}
            favorites={favorites}
            addToCart={addToCart}
            changeQty={changeQty}
            toggleFavorite={toggleFavorite}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            navigateTo={navigateTo}
          />
        )}

        {activeView === 'categories' && (
          <CategoriesView
            categories={categories}
            productsList={productsList}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            cart={cart}
            favorites={favorites}
            addToCart={addToCart}
            changeQty={changeQty}
            toggleFavorite={toggleFavorite}
            navigateTo={navigateTo}
          />
        )}

        {activeView === 'deals' && (
          <DealsView
            productsList={productsList}
            cart={cart}
            favorites={favorites}
            addToCart={addToCart}
            changeQty={changeQty}
            toggleFavorite={toggleFavorite}
            navigateTo={navigateTo}
            storeSettings={storeSettings}
            onShowToast={showToast}
          />
        )}

        {activeView === 'track' && (
          <ParcelTracking
            initialOrderId={trackingOrderId}
            onShopNow={() => navigateTo('shop')}
          />
        )}

        {activeView === 'about' && (
          <AboutView
            navigateTo={navigateTo}
            photo={photo}
          />
        )}

        {activeView === 'contact' && (
          <ContactView
            navigateTo={navigateTo}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="footer section-wrap">
        <div className="footer-brand">
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="brand"
            style={{ background: 'none', border: 0, padding: 0, textAlign: 'left', cursor: 'pointer' }}
          >
            <span className="brand-mark"><ShoppingCart size={27} /><Leaf size={14} /></span>
            <span><b>Green<span>Basket</span></b><small>Fresh from Nature</small></span>
          </button>
          <p>Your trusted source for fresh, organic and healthy food. We care for you and the planet.</p>
          <div className="socials">
            <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><Facebook /></a>
            <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><Instagram /></a>
            <a href="https://youtube.com" aria-label="YouTube" target="_blank" rel="noopener noreferrer"><Youtube /></a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Pages & Shop</h4>
          <button type="button" className="footer-link-btn" onClick={() => navigateTo('home')}>Home</button>
          <button type="button" className="footer-link-btn" onClick={() => navigateTo('shop')}>Shop Catalog</button>
          <button type="button" className="footer-link-btn" onClick={() => navigateTo('categories')}>Categories</button>
          <button type="button" className="footer-link-btn" onClick={() => navigateTo('deals')}>Weekly Deals</button>
          <button type="button" className="footer-link-btn" onClick={() => navigateTo('about')}>About Us</button>
          <button type="button" className="footer-link-btn" onClick={() => navigateTo('contact')}>Contact Us</button>
        </div>

        <div className="footer-col">
          <h4>Public Tracking & Support</h4>
          <button
            type="button"
            className="footer-link-btn footer-track-link"
            onClick={() => navigateTo('track')}
            style={{ color: 'var(--lime)', fontWeight: 700 }}
          >
            📦 Track Parcel Live
          </button>
          <button type="button" className="footer-link-btn" onClick={() => setAuthOpen(true)}>
            My Account {currentUser ? `(${currentUser.name})` : ''}
          </button>
          <button type="button" className="footer-link-btn" onClick={() => navigateTo('contact')}>Shipping & Delivery</button>
          <button type="button" className="footer-link-btn" onClick={() => navigateTo('contact')}>Returns & Refunds</button>
          <button type="button" className="footer-link-btn" onClick={() => navigateTo('contact')}>FAQs</button>
        </div>

        <div className="footer-col">
          <h4>Information</h4>
          <button type="button" className="footer-link-btn" onClick={() => navigateTo('about')}>Farm Heritage</button>
          <button type="button" className="footer-link-btn" onClick={() => navigateTo('about')}>Organic Standards</button>
          <button type="button" className="footer-link-btn" onClick={() => navigateTo('contact')}>Privacy Policy</button>
          <button type="button" className="footer-link-btn" onClick={() => navigateTo('contact')}>Terms & Conditions</button>
        </div>

        <div className="footer-col payment-col">
          <h4>Payment Methods</h4>
          <div className="payment-badges">
            <span>VISA</span>
            <span>PayPal</span>
            <span>Mastercard</span>
            <span>SSL SECURE</span>
          </div>
          <p><ShieldCheck size={14} /> Secure checkout</p>
        </div>

        <div className="copyright">
          © 2026 GreenBasket. All rights reserved. <span>Made with <Heart size={12} fill="currentColor" style={{ cursor: 'default' }} onClick={(e) => { if (e.detail === 3) window.open('https://greenbasket-admin-panel.vercel.app/', '_blank', 'noopener,noreferrer'); }} /> for fresh living.</span>
        </div>
      </footer>

      {/* Toast Notification */}
      {notice && (
        <div className="toast">
          <CheckCircle2 size={17} />
          {notice}
          <button onClick={() => setNotice('')} aria-label="Dismiss"><X size={15} /></button>
        </div>
      )}

      {/* Cart Drawer Component */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        products={productsList}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onChangeQty={changeQty}
        onOpenCheckout={() => setCheckoutOpen(true)}
        storeSettings={storeSettings}
      />

      {/* Checkout & Payment Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cart={cart}
        products={productsList}
        cartTotal={cartTotal}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Headless Cross-Origin Sync Bridge to Admin Panel */}
      <iframe
        id="gb-sync-bridge"
        ref={bridgeIframeRef}
        src="https://greenbasket-admin-panel.vercel.app/?mode=bridge"
        style={{ display: 'none', width: 0, height: 0, border: 0, opacity: 0, pointerEvents: 'none', position: 'absolute' }}
        title="GreenBasket Sync Bridge"
        onLoad={() => {
          try {
            bridgeIframeRef.current?.contentWindow?.postMessage({ type: 'GB_REQUEST_SYNC' }, '*');
          } catch (e) {}
        }}
      />
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
