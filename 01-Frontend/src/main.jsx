import React, { useMemo, useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Leaf, Truck, Headphones, Search, UserRound, ShoppingCart, ArrowRight,
  ShieldCheck, Sprout, Heart, Menu, X, Star, CheckCircle2, Mail, Instagram,
  Facebook, Youtube, Plus, Minus
} from 'lucide-react';
import './styles.css';

// Modular Imports across Feature Folders
import { categories } from '@products/products.js';
import { api } from '@api/api.js';
import CartDrawer from '@cart/CartDrawer.jsx';
import AuthModal from '@auth/AuthModal.jsx';
import CheckoutModal from '@payment/CheckoutModal.jsx';

const photo = (id, w = 700) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

function App() {
  // Persistent state from api
  const [productsList, setProductsList] = useState(() => api.getProducts());
  const [currentUser, setCurrentUser] = useState(() => api.getCurrentUser());
  const [cart, setCart] = useState(() => api.getCart());
  const [favorites, setFavorites] = useState(() => api.getFavorites());

  // UI state
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [notice, setNotice] = useState('');

  const bridgeIframeRef = useRef(null);

  // Persist cart & favorites changes
  useEffect(() => {
    api.saveCart(cart);
  }, [cart]);

  useEffect(() => {
    api.saveFavorites(favorites);
  }, [favorites]);

  // Real-time synchronization with GreenBasket Admin Panel (greenbasket-admin-panel.vercel.app)
  useEffect(() => {
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
          stock: Number(p.stock) || 20,
          rating: p.rating || 4.9,
          reviews: p.reviews || 25
        };
      });
    };

    const handleMessage = (e) => {
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.type === 'GB_CATALOG_SYNC' || e.data.type === 'GB_PRODUCTS_UPDATED') {
        const normalized = normalizeCatalog(e.data.products);
        if (normalized) {
          setProductsList(normalized);
          api.saveProducts(normalized);
        }
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

    return () => {
      window.removeEventListener('message', handleMessage);
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

  const shownProducts = useMemo(() => {
    return productsList.filter(p =>
      (activeCategory === 'All' || p.category === activeCategory) &&
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [productsList, activeCategory, search]);

  const showToast = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 2200);
  };

  const addToCart = (id) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    showToast('Added to your basket');
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

  const handleLoginSuccess = (userEmail, password, role) => {
    const user = api.login(userEmail, password, role);
    setCurrentUser(user);
    showToast(`Signed in as ${user.name}`);
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    showToast('Signed out successfully.');
  };

  const handleOrderCompleted = (orderData) => {
    const newOrder = api.createOrder(orderData);
    setCart({});
    showToast(`Order #${newOrder.id} confirmed!`);

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
          <span><Truck size={14}/> FREE DELIVERY on orders over $49</span>
          <span><Sprout size={14}/> Eat Fresh, Live Healthy</span>
          <span><Headphones size={14}/> Support 24/7</span>
        </div>
      </div>

      {/* Main Header */}
      <header className="header">
        <a href="#home" className="brand" aria-label="GreenBasket home">
          <span className="brand-mark"><ShoppingCart size={29}/><Leaf size={16}/></span>
          <span><b>Green<span>Basket</span></b><small>Fresh from Nature</small></span>
        </a>

        <button 
          className="mobile-menu icon-btn" 
          onClick={() => setMenuOpen(!menuOpen)} 
          aria-label="Toggle menu"
        >
          {menuOpen ? <X/> : <Menu/>}
        </button>

        <nav className={menuOpen ? 'nav nav-open' : 'nav'}>
          {['Home', 'Shop', 'Categories', 'Deals', 'About Us', 'Contact'].map((item, i) =>
            <a 
              key={item} 
              className={i === 0 ? 'active' : ''} 
              href={['#home', '#products', '#categories', '#deals', '#about', '#contact'][i]} 
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </a>
          )}
        </nav>

        <div className="header-actions">
          {/* Search Trigger */}
          <button className="icon-btn" aria-label="Search" onClick={() => setSearchOpen(!searchOpen)}>
            <Search/>
          </button>

          {/* User Account / Profile */}
          <button 
            className="icon-btn account-btn" 
            aria-label="Account" 
            onClick={() => setAuthOpen(true)}
            title={currentUser ? currentUser.name : "Account"}
            style={{ position: 'relative' }}
          >
            <UserRound/>
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
            <ShoppingCart/>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>

        {/* Search Panel Dropdown */}
        {searchOpen && (
          <div className="search-panel">
            <Search size={18}/>
            <input 
              autoFocus 
              placeholder="Search fresh vegetables, fruits..." 
              value={search} 
              onChange={e => {
                setSearch(e.target.value); 
                document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <button onClick={() => { setSearch(''); setSearchOpen(false); }}>
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
            <div className="eyebrow"><span className="eyebrow-dot"></span> 100% ORGANIC & FRESH</div>
            <h1>Fresh Food.<br/>Healthy Life.<br/><em>Happy You.</em></h1>
            <p>Organic fruits, vegetables & greens<br className="desktop-break"/> delivered directly from farm to your door within 24h.</p>
            <a className="btn btn-primary" href="#products">Shop Now <ArrowRight size={18}/></a>
            <div className="hero-perks">
              <div><span className="perk-icon"><Leaf/></span><span><b>100% Organic</b><small>Certified produce</small></span></div>
              <div><span className="perk-icon"><Truck/></span><span><b>Fast Delivery</b><small>Same day free</small></span></div>
              <div><span className="perk-icon"><ShieldCheck/></span><span><b>Secure Checkout</b><small>Safe payments</small></span></div>
            </div>
          </div>
          <div className="hero-art">
            <div className="hero-glow"></div>
            <img src={photo('photo-1540420773420-3366772f4999', 1100)} alt="A colorful basket of fresh vegetables"/>
            <div className="fresh-stamp"><span>EAT FRESH</span><b>STAY<br/>HEALTHY</b><Leaf size={17}/></div>
            <span className="floating-leaf leaf-one">✦</span><span className="floating-leaf leaf-two">✦</span>
          </div>
        </section>

        {/* Farm Story Section */}
        <section className="farm-panel section-wrap" id="about">
          <div className="farmer-photo"><img src={photo('photo-1500382017468-9049fed747ef', 650)} alt="Sunlit green farm"/></div>
          <div className="farm-copy">
            <span className="kicker">WELCOME TO GREENBASKET</span>
            <h2>From Our Farm<br/>To <em>Your Table</em></h2>
            <p>We bring you the freshest, handpicked produce from trusted local growers. Certified quality you can trust, every single day.</p>
            <a href="#products" className="text-link">Explore Fresh Harvest <ArrowRight size={16}/></a>
          </div>
          <div className="farm-stats">
            <div><span className="stat-icon"><Sprout/></span><p><b>25+</b><small>Local Partner Farms</small></p></div>
            <div><span className="stat-icon"><Leaf/></span><p><b>500+</b><small>Organic Items</small></p></div>
            <div><span className="stat-icon"><Heart/></span><p><b>10K+</b><small>Happy Customers</small></p></div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="section-wrap section-block" id="categories">
          <div className="section-heading">
            <div><span className="heading-leaf">✦</span><h2>Shop by Category</h2></div>
            <a href="#products" onClick={() => setActiveCategory('All')}>View all <ArrowRight size={16}/></a>
          </div>
          <div className="category-grid">
            {categories.map(cat => (
              <button 
                className={'category-card ' + (activeCategory === cat.name ? 'category-active' : '')} 
                key={cat.name} 
                onClick={() => {
                  setActiveCategory(activeCategory === cat.name ? 'All' : cat.name);
                  document.querySelector('#products')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <img src={cat.image} alt={cat.name}/>
                <b>{cat.name}</b>
                <small>{cat.count}</small>
              </button>
            ))}
          </div>
        </section>

        {/* Promotional Deal Banner */}
        <section className="deal-banner section-wrap" id="deals">
          <div className="deal-copy">
            <span>LIMITED TIME OFFER</span>
            <h2>UP TO <em>30% OFF</em></h2>
            <h3>On Fresh Seasonal Vegetables</h3>
            <a href="#products" className="btn btn-yellow">Grab the Deal <ArrowRight size={16}/></a>
          </div>
          <div className="deal-image"><img src={photo('photo-1518843875459-f738682238a6', 900)} alt="Fresh seasonal vegetables"/></div>
          <div className="deal-seal"><span>Best Quality</span><b>Best Price</b></div>
        </section>

        {/* Why Choose Us */}
        <section className="section-wrap section-block why-block">
          <div className="section-heading"><div><span className="heading-leaf">✦</span><h2>Why Choose GreenBasket?</h2></div></div>
          <div className="benefit-grid">
            <div className="benefit"><Sprout/><span><b>Farm Fresh</b><small>Handpicked daily with care</small></span></div>
            <div className="benefit"><CheckCircle2/><span><b>100% Chemical Free</b><small>Safe for family & kids</small></span></div>
            <div className="benefit"><Leaf/><span><b>Sustainably Grown</b><small>Protects natural ecology</small></span></div>
            <div className="benefit"><ShieldCheck/><span><b>Money-Back Quality</b><small>Guaranteed freshness</small></span></div>
          </div>
        </section>

        {/* Products Grid Block */}
        <section className="section-wrap section-block products-block" id="products">
          <div className="section-heading">
            <div>
              <span className="heading-leaf">✦</span>
              <h2>{activeCategory === 'All' ? 'Farm Fresh Produce' : activeCategory}</h2>
            </div>
            <a href="#products" onClick={() => setActiveCategory('All')}>View all ({productsList.length}) <ArrowRight size={16}/></a>
          </div>

          <div className="filter-row">
            <button 
              className={activeCategory === 'All' ? 'filter active-filter' : 'filter'} 
              onClick={() => setActiveCategory('All')}
            >
              All products ({productsList.length})
            </button>
            {categories.map(c => (
              <button 
                key={c.name} 
                className={activeCategory === c.name ? 'filter active-filter' : 'filter'} 
                onClick={() => setActiveCategory(c.name)}
              >
                {c.name}
              </button>
            ))}
          </div>

          {shownProducts.length ? (
            <div className="product-grid">
              {shownProducts.map(p => {
                const hasDiscount = p.discountPrice && Number(p.discountPrice) > 0 && Number(p.discountPrice) < Number(p.price);
                return (
                  <article className="product-card" key={p.id}>
                    <div className="product-image">
                      <img src={p.image} alt={p.name}/>
                      {hasDiscount ? (
                        <span className="product-tag" style={{ background: '#e11d48', color: '#fff', fontWeight: 800 }}>
                          -{Math.round((1 - p.discountPrice / p.price) * 100)}% OFF
                        </span>
                      ) : (
                        <span className="product-tag">{p.tag || 'Organic'}</span>
                      )}
                      <button 
                        className={'heart-btn ' + (favorites.includes(p.id) ? 'hearted' : '')} 
                        aria-label="Toggle favorite" 
                        onClick={() => toggleFavorite(p.id)}
                      >
                        <Heart size={17} fill={favorites.includes(p.id) ? 'currentColor' : 'none'}/>
                      </button>
                    </div>
                    <div className="product-info">
                      <div className="rating">
                        <Star size={12} fill="currentColor"/> {p.rating || 4.9} 
                        <span>({p.reviews || 24} reviews)</span>
                      </div>
                      <h3>{p.name}</h3>
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
                        <button className="add-btn" onClick={() => addToCart(p.id)}>
                          {cart[p.id] ? (
                            <><CheckCircle2 size={15}/> Added ({cart[p.id]})</>
                          ) : (
                            <><Plus size={16}/> Add to Cart</>
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">No products found. Try another search.</div>
          )}
        </section>

        {/* Newsletter Section */}
        <section className="newsletter section-wrap">
          <div className="newsletter-icon"><Mail/></div>
          <div className="newsletter-copy">
            <h3>Stay Healthy, Stay Updated!</h3>
            <p>Subscribe to get best offers, health tips &<br/> fresh updates in your inbox.</p>
          </div>
          <form 
            className="subscribe-form" 
            onSubmit={e => {
              e.preventDefault();
              if (email.includes('@')) {
                setSubscribed(true);
                setEmail('');
                showToast('Subscribed to GreenBasket updates! 🌱');
              } else {
                showToast('Please enter a valid email address.');
              }
            }}
          >
            <input 
              type="email" 
              required 
              placeholder="Enter your email" 
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
          <p>Your trusted source for fresh, organic and healthy food. We care for you and the planet.</p>
          <div className="socials">
            <a href="https://facebook.com" aria-label="Facebook"><Facebook/></a>
            <a href="https://instagram.com" aria-label="Instagram"><Instagram/></a>
            <a href="https://youtube.com" aria-label="YouTube"><Youtube/></a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <a href="#products">Shop</a>
          <a href="#categories">Categories</a>
          <a href="#deals">Deals</a>
          <a href="#about">About Us</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="footer-col">
          <h4>Customer Service</h4>
          <a href="#account" onClick={(e) => { e.preventDefault(); setAuthOpen(true); }}>
            My Account {currentUser ? `(${currentUser.name})` : ''}
          </a>
          <a href="#contact">Track Order</a>
          <a href="#contact">Shipping & Delivery</a>
          <a href="#contact">Returns & Refunds</a>
          <a href="#contact">FAQs</a>
        </div>
        <div className="footer-col">
          <h4>Information</h4>
          <a href="#contact">Privacy Policy</a>
          <a href="#contact">Terms & Conditions</a>
          <a href="#contact">Refund Policy</a>
          <a href="#contact">Blog</a>
          <a href="#contact">Careers</a>
        </div>
        <div className="footer-col payment-col">
          <h4>Payment Methods</h4>
          <div className="payment-badges">
            <span>VISA</span>
            <span>PayPal</span>
            <span>Mastercard</span>
            <span>SSL SECURE</span>
          </div>
          <p><ShieldCheck size={14}/> Secure checkout</p>
        </div>
        <div className="copyright">
          © 2026 GreenBasket. All rights reserved. <span>Made with <Heart size={12} fill="currentColor" style={{ cursor: 'default' }} onClick={(e) => { if (e.detail === 3) window.open('https://greenbasket-admin-panel.vercel.app/', '_blank', 'noopener,noreferrer'); }}/> for fresh living.</span>
        </div>
      </footer>

      {/* Toast Notification */}
      {notice && (
        <div className="toast">
          <CheckCircle2 size={17}/>
          {notice}
          <button onClick={() => setNotice('')} aria-label="Dismiss"><X size={15}/></button>
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

createRoot(document.getElementById('root')).render(<App/>);
