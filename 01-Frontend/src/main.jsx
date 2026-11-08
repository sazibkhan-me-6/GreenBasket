import React, { useMemo, useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Leaf, Truck, Headphones, Search, UserRound, ShoppingCart, ArrowRight,
  ShieldCheck, Sprout, Heart, Menu, X, Star, CheckCircle2, Mail, Instagram,
  Facebook, Youtube, Plus, Minus, ArrowUp, Sparkles, Eye
} from 'lucide-react';
import './styles.css';

// Modular Imports across Feature Folders
import { categories } from '@products/products.js';
import { api } from '@api/api.js';
import CartDrawer from '@cart/CartDrawer.jsx';
import AuthModal from '@auth/AuthModal.jsx';
import CheckoutModal from '@payment/CheckoutModal.jsx';
import ProductDetailModal from '@products/ProductDetailModal.jsx';

const photo = (id, w = 700) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

function App() {
  // Persistent state from api
  const [productsList, setProductsList] = useState(() => api.getProducts());
  const [currentUser, setCurrentUser] = useState(() => api.getCurrentUser());
  const [cart, setCart] = useState(() => api.getCart());
  const [favorites, setFavorites] = useState(() => api.getFavorites());

  // UI state
  const [activeCategory, setActiveCategory] = useState('All');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [notice, setNotice] = useState('');

  // Shared Promo Code State for Cart & Checkout
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [appliedPromoCode, setAppliedPromoCode] = useState('');

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

  // Persist cart & favorites changes
  useEffect(() => {
    api.saveCart(cart);
  }, [cart]);

  useEffect(() => {
    api.saveFavorites(favorites);
  }, [favorites]);

  // Floating Back to Top Button Listener
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 380);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Real-time synchronization with GreenBasket Admin Panel (greenbasket-admin-panel.vercel.app)
  useEffect(() => {
    let lastCloudTimestamp = 0;
    const GIST_RAW_URL = 'https://gist.githubusercontent.com/sazibkhan-me-6/5c3186e2427e5900031ae4ea398ac1e7/raw/greenbasket_catalog.json';

    // 1. Direct postMessage handler (0ms instant live sync from Admin tab or window.opener)
    const handleMessage = (e) => {
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.type === 'GB_CATALOG_SYNC' || e.data.type === 'GB_PRODUCTS_UPDATED') {
        lastCloudTimestamp = Date.now();
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

    // 2. BroadcastChannel for same-origin tabs (0ms instant sync)
    let ch;
    try {
      ch = new BroadcastChannel('gb_bridge_channel');
      ch.onmessage = (e) => {
        if (e.data && (e.data.type === 'GB_CATALOG_SYNC' || e.data.type === 'GB_PRODUCTS_UPDATED')) {
          handleMessage(e);
        }
      };
    } catch (err) {}

    // 3. URL Hash state bootstrapper (0ms instant load when opened from Admin)
    const checkSyncHash = () => {
      if (window.location.hash.startsWith('#sync=')) {
        try {
          const encoded = window.location.hash.slice(6);
          const raw = decodeURIComponent(escape(atob(encoded)));
          const data = JSON.parse(raw);
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

    // 4. Signal ready to admin opener if available
    try {
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({ type: 'GB_STOREFRONT_READY' }, '*');
      }
    } catch (err) {}

    // 5. Background Cloud Gist sync & polling (1-2s universal cloud sync across all devices)
    const fetchCloudCatalog = async () => {
      try {
        const res = await fetch(`${GIST_RAW_URL}?_t=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (!data || !Array.isArray(data.products) || data.products.length === 0) return;
        const cloudTime = new Date(data.updatedAt || 0).getTime();
        if (cloudTime > lastCloudTimestamp) {
          lastCloudTimestamp = cloudTime;
          const normalized = normalizeCatalog(data.products);
          if (normalized) {
            setProductsList(normalized);
            api.saveProducts(normalized);
          }
          if (data.settings) {
            setStoreSettings(data.settings);
            try { localStorage.setItem('gb_store_settings', JSON.stringify(data.settings)); } catch (err) {}
          }
        }
      } catch (err) {
        // quiet fallback
      }
    };

    fetchCloudCatalog();
    const gistInterval = setInterval(fetchCloudCatalog, 2500);

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

  // Dynamic list of category names based on catalog
  const dynamicCategories = useMemo(() => {
    const baseList = categories.map(c => c.name);
    const catalogList = productsList.map(p => p.category).filter(Boolean);
    return Array.from(new Set([...baseList, ...catalogList]));
  }, [productsList]);

  // Filtered products list
  const shownProducts = useMemo(() => {
    return productsList.filter(p => {
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      const q = search.trim().toLowerCase();
      const matchesSearch = !q || p.name.toLowerCase().includes(q) || (p.tag && p.tag.toLowerCase().includes(q)) || p.category.toLowerCase().includes(q);
      const matchesFavorites = !showOnlyFavorites || favorites.includes(p.id);
      return matchesCategory && matchesSearch && matchesFavorites;
    });
  }, [productsList, activeCategory, search, showOnlyFavorites, favorites]);

  const showToast = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 2400);
  };

  const addToCart = (id) => {
    const target = productsList.find(p => p.id === id);
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    showToast(target ? `Added "${target.name}" to basket 🌱` : 'Added to your basket');
  };

  const changeQty = (id, amount) => {
    setCart(prev => {
      const next = { ...prev, [id]: Math.max(0, (prev[id] || 0) + amount) };
      if (!next[id]) delete next[id];
      return next;
    });
  };

  const toggleFavorite = (id) => {
    const target = productsList.find(p => p.id === id);
    setFavorites(prev => {
      const isAlready = prev.includes(id);
      const updated = isAlready ? prev.filter(x => x !== id) : [...prev, id];
      showToast(isAlready ? `Removed "${target?.name}" from favorites` : `Saved "${target?.name}" to favorites ❤️`);
      return updated;
    });
  };

  const handleLoginSuccess = (userEmail, password, role) => {
    const user = api.login(userEmail, password, role);
    setCurrentUser(user);
    showToast(`Welcome, ${user.name}! 🌱`);
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    showToast('Signed out successfully.');
  };

  const handleOrderCompleted = (orderData) => {
    const newOrder = api.createOrder(orderData);
    setCart({});
    setAppliedDiscount(0);
    setAppliedPromoCode('');
    showToast(`Order #${newOrder.id} placed successfully!`);

    // Forward new order to the dedicated Admin Panel (greenbasket-admin-panel.vercel.app)
    try {
      const orderPayload = {
        type: 'GB_NEW_ORDER',
        order: {
          id: newOrder.id,
          customer: orderData.customer?.name || 'Store Customer',
          items: Array.isArray(orderData.items) ? orderData.items.map(it => `${it.name} (${it.qty})`).join(', ') : 'Fresh Grocery Pack',
          total: Number(orderData.total) || 0,
          status: 'Processing',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
        }
      };

      bridgeIframeRef.current?.contentWindow?.postMessage(orderPayload, '*');
      if (window.opener && !window.opener.closed) {
        try { window.opener.postMessage(orderPayload, '*'); } catch (err) {}
      }
      const ch = new BroadcastChannel('gb_bridge_channel');
      ch.postMessage(orderPayload);
      ch.close();
    } catch (e) {
      console.warn('Bridge order notification failed', e);
    }

    return newOrder;
  };

  return (
    <div className="site-shell">
      {/* Top Banner Strip */}
      <div className="top-strip">
        <div className="top-inner">
          <span><Truck size={14}/> {storeSettings.announcement || 'FREE DELIVERY on orders over $49'}</span>
          <span><Sprout size={14}/> Eat Fresh, Live Healthy</span>
          <span><Headphones size={14}/> 24/7 Customer Support</span>
        </div>
      </div>

      {/* Main Header */}
      <header className="header">
        <a href="#home" className="brand" aria-label="GreenBasket home">
          <span className="brand-mark"><ShoppingCart size={28}/><Leaf size={15}/></span>
          <span><b>Green<span>Basket</span></b><small>Fresh from Nature</small></span>
        </a>

        <button 
          className="mobile-menu icon-btn" 
          onClick={() => setMenuOpen(!menuOpen)} 
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22}/> : <Menu size={22}/>}
        </button>

        <nav className={menuOpen ? 'nav nav-open' : 'nav'}>
          {['Home', 'Shop', 'Categories', 'Deals', 'About Us', 'Contact'].map((item, i) =>
            <a 
              key={item} 
              className={i === 0 && !showOnlyFavorites ? 'active' : ''} 
              href={['#home', '#products', '#categories', '#deals', '#about', '#contact'][i]} 
              onClick={() => {
                setShowOnlyFavorites(false);
                setMenuOpen(false);
              }}
            >
              {item}
            </a>
          )}
          {/* Mobile Account Link */}
          <a 
            href="#account" 
            className="mobile-account-link"
            onClick={(e) => {
              e.preventDefault();
              setMenuOpen(false);
              setAuthOpen(true);
            }}
          >
            {currentUser ? `Account (${currentUser.name})` : 'Sign In / Register'}
          </a>
        </nav>

        <div className="header-actions">
          {/* Search Trigger */}
          <button className="icon-btn" aria-label="Search" onClick={() => setSearchOpen(!searchOpen)}>
            <Search size={20}/>
          </button>

          {/* User Account / Profile */}
          <button 
            className="icon-btn account-btn" 
            aria-label="Account" 
            onClick={() => setAuthOpen(true)}
            title={currentUser ? currentUser.name : "Account"}
            style={{ position: 'relative' }}
          >
            <UserRound size={20}/>
            {currentUser && (
              <span style={{ 
                position: 'absolute', 
                top: '4px', 
                right: '4px', 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                background: 'var(--lime)',
                boxShadow: '0 0 6px var(--lime)'
              }}></span>
            )}
          </button>

          {/* Cart Icon with badge */}
          <button className="icon-btn cart-trigger" aria-label="Open basket" onClick={() => setCartOpen(true)}>
            <ShoppingCart size={20}/>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>

        {/* Search Panel Dropdown */}
        {searchOpen && (
          <div className="search-panel">
            <Search size={18}/>
            <input 
              autoFocus 
              placeholder="Search organic vegetables, fruits, berries, herbs..." 
              value={search} 
              onChange={e => {
                setSearch(e.target.value); 
                setShowOnlyFavorites(false);
                document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <button onClick={() => { setSearch(''); setSearchOpen(false); }} aria-label="Close search">
              <X size={18}/>
            </button>
          </div>
        )}
      </header>

      {/* Main Page Content */}
      <main>
        {/* Hero Section */}
        <section className="hero section-wrap" id="home">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot"></span> 100% CERTIFIED ORGANIC & FRESH</div>
            <h1>Fresh Food.<br/>Healthy Life.<br/><em>Happy You.</em></h1>
            <p>Direct from pesticide-free partner farms to your kitchen table within 24 hours. Eat pure, live healthy.</p>
            <a className="btn btn-primary" href="#products" onClick={() => { setActiveCategory('All'); setShowOnlyFavorites(false); }}>
              Shop Fresh Harvest <ArrowRight size={18}/>
            </a>
            <div className="hero-perks">
              <div><span className="perk-icon"><Leaf size={15}/></span><span><b>100% Organic</b><small>Certified produce</small></span></div>
              <div><span className="perk-icon"><Truck size={15}/></span><span><b>Fast Delivery</b><small>Free over $49</small></span></div>
              <div><span className="perk-icon"><ShieldCheck size={15}/></span><span><b>Safe Checkout</b><small>100% Protected</small></span></div>
            </div>
          </div>
          <div className="hero-art">
            <div className="hero-glow"></div>
            <img src={photo('photo-1540420773420-3366772f4999', 1100)} alt="A colorful basket of fresh vegetables"/>
            <div className="fresh-stamp"><span>EAT FRESH</span><b>STAY<br/>HEALTHY</b><Leaf size={16}/></div>
            <span className="floating-leaf leaf-one">✦</span><span className="floating-leaf leaf-two">✦</span>
          </div>
        </section>

        {/* Farm Story Section */}
        <section className="farm-panel section-wrap" id="about">
          <div className="farmer-photo"><img src={photo('photo-1500382017468-9049fed747ef', 650)} alt="Sunlit green farm"/></div>
          <div className="farm-copy">
            <span className="kicker">WELCOME TO GREENBASKET</span>
            <h2>From Our Farm<br/>To <em>Your Table</em></h2>
            <p>We work directly with certified local organic farmers to bring you pure, non-GMO, chemical-free food every morning.</p>
            <a href="#products" className="text-link" onClick={() => { setActiveCategory('All'); setShowOnlyFavorites(false); }}>
              Explore Fresh Harvest <ArrowRight size={16}/>
            </a>
          </div>
          <div className="farm-stats">
            <div><span className="stat-icon"><Sprout size={16}/></span><p><b>25+</b><small>Partner Farms</small></p></div>
            <div><span className="stat-icon"><Leaf size={16}/></span><p><b>500+</b><small>Organic Items</small></p></div>
            <div><span className="stat-icon"><Heart size={16}/></span><p><b>10K+</b><small>Happy Homes</small></p></div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="section-wrap section-block" id="categories">
          <div className="section-heading">
            <div><span className="heading-leaf">✦</span><h2>Shop by Category</h2></div>
            <a href="#products" onClick={() => { setActiveCategory('All'); setShowOnlyFavorites(false); }}>
              View all ({productsList.length}) <ArrowRight size={16}/>
            </a>
          </div>
          <div className="category-grid">
            {categories.map(cat => (
              <button 
                className={'category-card ' + (activeCategory === cat.name && !showOnlyFavorites ? 'category-active' : '')} 
                key={cat.name} 
                onClick={() => {
                  setActiveCategory(activeCategory === cat.name ? 'All' : cat.name);
                  setShowOnlyFavorites(false);
                  document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <img 
                  src={cat.image} 
                  alt={cat.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = photo('photo-1540420773420-3366772f4999', 400);
                  }}
                />
                <b>{cat.name}</b>
                <small>{productsList.filter(p => p.category === cat.name).length || cat.count} items</small>
              </button>
            ))}
          </div>
        </section>

        {/* Promotional Deal Banner */}
        <section className="deal-banner section-wrap" id="deals">
          <div className="deal-copy">
            <span>LIMITED TIME PROMO</span>
            <h2>UP TO <em>30% OFF</em></h2>
            <h3>On Fresh Seasonal Vegetables & Fruits</h3>
            <a href="#products" className="btn btn-yellow" onClick={() => { setActiveCategory('Vegetables'); setShowOnlyFavorites(false); }}>
              Grab Deal Now <ArrowRight size={16}/>
            </a>
          </div>
          <div className="deal-image"><img src={photo('photo-1518843875459-f738682238a6', 900)} alt="Fresh seasonal vegetables"/></div>
          <div className="deal-seal"><span>Best Quality</span><b>Best Price</b></div>
        </section>

        {/* Why Choose Us */}
        <section className="section-wrap section-block why-block">
          <div className="section-heading"><div><span className="heading-leaf">✦</span><h2>Why Choose GreenBasket?</h2></div></div>
          <div className="benefit-grid">
            <div className="benefit"><Sprout size={24}/><span><b>Farm Fresh</b><small>Handpicked daily with utmost care</small></span></div>
            <div className="benefit"><CheckCircle2 size={24}/><span><b>100% Chemical Free</b><small>Pure and safe for whole family</small></span></div>
            <div className="benefit"><Leaf size={24}/><span><b>Sustainably Grown</b><small>Protects soil ecology and water</small></span></div>
            <div className="benefit"><ShieldCheck size={24}/><span><b>Freshness Guarantee</b><small>100% money back if not satisfied</small></span></div>
          </div>
        </section>

        {/* Products Grid Block */}
        <section className="section-wrap section-block products-block" id="products">
          <div className="section-heading">
            <div>
              <span className="heading-leaf">✦</span>
              <h2>
                {showOnlyFavorites 
                  ? 'Your Saved Favorites' 
                  : (activeCategory === 'All' ? 'Farm Fresh Produce' : activeCategory)}
              </h2>
            </div>
            {search && (
              <span className="search-active-pill">
                Filtered by "{search}" ({shownProducts.length})
                <button onClick={() => setSearch('')} title="Clear search"><X size={13}/></button>
              </span>
            )}
            <a href="#products" onClick={() => { setActiveCategory('All'); setShowOnlyFavorites(false); setSearch(''); }}>
              View all ({productsList.length}) <ArrowRight size={16}/>
            </a>
          </div>

          {/* Dynamic Filter Pills */}
          <div className="filter-row">
            <button 
              className={activeCategory === 'All' && !showOnlyFavorites ? 'filter active-filter' : 'filter'} 
              onClick={() => { setActiveCategory('All'); setShowOnlyFavorites(false); }}
            >
              All items ({productsList.length})
            </button>

            {dynamicCategories.filter(c => c !== 'All').map(cat => (
              <button 
                key={cat} 
                className={activeCategory === cat && !showOnlyFavorites ? 'filter active-filter' : 'filter'} 
                onClick={() => { setActiveCategory(cat); setShowOnlyFavorites(false); }}
              >
                {cat} ({productsList.filter(p => p.category === cat).length})
              </button>
            ))}

            {/* Wishlist Pill */}
            <button 
              className={'filter wishlist-pill ' + (showOnlyFavorites ? 'active-filter' : '')} 
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            >
              <Heart size={14} fill={showOnlyFavorites ? 'currentColor' : 'none'}/> 
              Wishlist ({favorites.length})
            </button>
          </div>

          {shownProducts.length ? (
            <div className="product-grid">
              {shownProducts.map(p => {
                const hasDiscount = p.discountPrice && Number(p.discountPrice) > 0 && Number(p.discountPrice) < Number(p.price);
                const discountPct = hasDiscount ? Math.round((1 - p.discountPrice / p.price) * 100) : 0;
                const inCartQty = cart[p.id] || 0;
                const isFav = favorites.includes(p.id);

                return (
                  <article className="product-card" key={p.id}>
                    <div className="product-image" onClick={() => setQuickViewProduct(p)} style={{ cursor: 'pointer' }}>
                      <img 
                        src={p.image} 
                        alt={p.name}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = photo('photo-1540420773420-3366772f4999', 500);
                        }}
                      />
                      {hasDiscount ? (
                        <span className="product-tag discount-tag">
                          -{discountPct}% OFF
                        </span>
                      ) : (
                        <span className="product-tag">{p.tag || 'Organic'}</span>
                      )}

                      <button 
                        className={'heart-btn ' + (isFav ? 'hearted' : '')} 
                        aria-label="Toggle favorite" 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(p.id);
                        }}
                      >
                        <Heart size={16} fill={isFav ? 'currentColor' : 'none'}/>
                      </button>

                      <span className="quick-view-badge" title="Quick view">
                        <Eye size={13}/> Quick View
                      </span>
                    </div>

                    <div className="product-info">
                      <div className="rating">
                        <Star size={12} fill="#eab308" color="#eab308"/> {p.rating || 4.9} 
                        <span>({p.reviews || 24})</span>
                      </div>

                      <h3 onClick={() => setQuickViewProduct(p)} style={{ cursor: 'pointer' }}>
                        {p.name}
                      </h3>
                      <small>{p.unit}</small>

                      <div className="product-bottom">
                        <div>
                          {hasDiscount ? (
                            <>
                              <b style={{ color: 'var(--lime)' }}>${Number(p.discountPrice).toFixed(2)}</b>
                              <span style={{ textDecoration: 'line-through', opacity: 0.55, fontSize: '11px', marginLeft: '5px' }}>
                                ${Number(p.price).toFixed(2)}
                              </span>
                              <small> / {p.unit.split(' / ')[0]}</small>
                            </>
                          ) : (
                            <>
                              <b>${Number(p.price).toFixed(2)}</b>
                              <small> / {p.unit.split(' / ')[0]}</small>
                            </>
                          )}
                        </div>

                        {/* In-Card Stepper / Add to Cart Button */}
                        {inCartQty > 0 ? (
                          <div className="card-qty-stepper">
                            <button 
                              type="button" 
                              onClick={() => changeQty(p.id, -1)} 
                              aria-label="Decrease quantity"
                            >
                              <Minus size={13}/>
                            </button>
                            <span className="qty-number">{inCartQty}</span>
                            <button 
                              type="button" 
                              onClick={() => changeQty(p.id, 1)} 
                              aria-label="Increase quantity"
                            >
                              <Plus size={13}/>
                            </button>
                          </div>
                        ) : (
                          <button 
                            className="add-btn" 
                            onClick={() => addToCart(p.id)}
                            disabled={p.stock <= 0}
                          >
                            <Plus size={15}/> Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <Sprout size={36} color="var(--lime)"/>
              <h3>No items found</h3>
              <p>
                {showOnlyFavorites 
                  ? "You haven't added any favorites yet. Tap the ❤️ on any produce to save it to your wishlist!"
                  : "We couldn't find any products matching your search. Try adjusting keywords or category."}
              </p>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => { setActiveCategory('All'); setShowOnlyFavorites(false); setSearch(''); }}
              >
                Browse All Fresh Harvest
              </button>
            </div>
          )}
        </section>

        {/* Newsletter Section */}
        <section className="newsletter section-wrap">
          <div className="newsletter-icon"><Mail size={22}/></div>
          <div className="newsletter-copy">
            <h3>Stay Healthy, Stay Updated!</h3>
            <p>Subscribe to receive seasonal recipes, secret discount coupons & fresh harvest alerts.</p>
          </div>
          <form 
            className="subscribe-form" 
            onSubmit={e => {
              e.preventDefault();
              if (email.includes('@')) {
                setSubscribed(true);
                setEmail('');
                showToast('Thank you! Subscribed to GreenBasket fresh updates 🌱');
              } else {
                showToast('Please enter a valid email address.');
              }
            }}
          >
            <input 
              type="email" 
              required 
              placeholder="Enter your email address" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
            />
            <button type="submit">{subscribed ? 'Subscribed ✓' : 'Subscribe'}</button>
          </form>
          <img src={photo('photo-1540420773420-3366772f4999', 350)} alt="" className="newsletter-produce"/>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer section-wrap" id="contact">
        <div className="footer-brand">
          <a href="#home" className="brand">
            <span className="brand-mark"><ShoppingCart size={27}/><Leaf size={14}/></span>
            <span><b>Green<span>Basket</span></b><small>Fresh from Nature</small></span>
          </a>
          <p>Your trusted daily source for certified organic fruits, vegetables, and farm fresh living.</p>
          <div className="socials">
            <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><Facebook size={18}/></a>
            <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><Instagram size={18}/></a>
            <a href="https://youtube.com" aria-label="YouTube" target="_blank" rel="noopener noreferrer"><Youtube size={18}/></a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <a href="#products" onClick={() => { setActiveCategory('All'); setShowOnlyFavorites(false); }}>Shop All</a>
          <a href="#categories">Categories</a>
          <a href="#deals">Special Deals</a>
          <a href="#about">About Our Farm</a>
          <a href="#contact">Contact Us</a>
        </div>
        <div className="footer-col">
          <h4>Customer Service</h4>
          <a href="#account" onClick={(e) => { e.preventDefault(); setAuthOpen(true); }}>
            My Account {currentUser ? `(${currentUser.name})` : ''}
          </a>
          <a href="#products" onClick={(e) => { e.preventDefault(); setShowOnlyFavorites(true); document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' }); }}>
            My Wishlist ({favorites.length})
          </a>
          <a href="#contact">Delivery Information</a>
          <a href="#contact">Freshness Guarantee</a>
          <a href="#contact">FAQs & Support</a>
        </div>
        <div className="footer-col">
          <h4>Information</h4>
          <a href="#contact">Privacy Policy</a>
          <a href="#contact">Terms & Conditions</a>
          <a href="#contact">Return Policy</a>
          <a href="#contact">Sustainable Farming</a>
          <a href="#contact">Contact: support@greenbasket.com</a>
        </div>
        <div className="footer-col payment-col">
          <h4>Payment Methods</h4>
          <div className="payment-badges">
            <span>VISA</span>
            <span>PayPal</span>
            <span>Mastercard</span>
            <span>bKash</span>
            <span>SSL SECURE</span>
          </div>
          <p><ShieldCheck size={14}/> 100% Secure SSL encrypted checkout</p>
        </div>
        <div className="copyright">
          © 2026 GreenBasket. All rights reserved. <span>Made with <Heart size={12} fill="currentColor" style={{ cursor: 'default' }} onClick={(e) => { if (e.detail === 3) window.open('https://greenbasket-admin-panel.vercel.app/', '_blank', 'noopener,noreferrer'); }}/> for fresh organic living.</span>
        </div>
      </footer>

      {/* Floating Back to Top Button */}
      {showScrollTop && (
        <button 
          type="button" 
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          title="Back to top"
        >
          <ArrowUp size={20}/>
        </button>
      )}

      {/* Toast Notification */}
      {notice && (
        <div className="toast">
          <CheckCircle2 size={17} color="#9ee038"/>
          <span>{notice}</span>
          <button onClick={() => setNotice('')} aria-label="Dismiss"><X size={15}/></button>
        </div>
      )}

      {/* Quick View Product Details Modal */}
      {quickViewProduct && (
        <ProductDetailModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          cartQty={cart[quickViewProduct.id] || 0}
          onAddToCart={addToCart}
          onChangeQty={changeQty}
          isFavorite={favorites.includes(quickViewProduct.id)}
          onToggleFavorite={toggleFavorite}
        />
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
        appliedDiscount={appliedDiscount}
        setAppliedDiscount={setAppliedDiscount}
        appliedPromoCode={appliedPromoCode}
        setAppliedPromoCode={setAppliedPromoCode}
      />

      {/* Checkout & Payment Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cart={cart}
        products={productsList}
        cartTotal={cartTotal}
        onOrderCompleted={handleOrderCompleted}
        appliedDiscount={appliedDiscount}
        appliedPromoCode={appliedPromoCode}
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

createRoot(document.getElementById('root')).render(<App/>);
