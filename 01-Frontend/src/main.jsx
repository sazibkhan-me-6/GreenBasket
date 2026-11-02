import React, { useMemo, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Leaf, Truck, Headphones, Search, UserRound, ShoppingCart, ArrowRight,
  ShieldCheck, Sprout, Heart, Menu, X, Star, CheckCircle2, Mail, Instagram,
  Facebook, Youtube, Plus, Minus, Settings, LogOut, Package
} from 'lucide-react';
import './styles.css';

// Modular Imports across Feature Folders
import { categories } from '@products/products.js';
import { api } from '@api/api.js';
import CartDrawer from '@cart/CartDrawer.jsx';
import AuthModal from '@auth/AuthModal.jsx';
import AdminModal from '@admin/AdminModal.jsx';
import CheckoutModal from '@payment/CheckoutModal.jsx';

const photo = (id, w = 700) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

function App() {
  // Persistent state from api
  const [productsList, setProductsList] = useState(() => api.getProducts());
  const [ordersList, setOrdersList] = useState(() => api.getOrders());
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
  const [adminOpen, setAdminOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [notice, setNotice] = useState('');

  // Persist cart & favorites changes
  useEffect(() => {
    api.saveCart(cart);
  }, [cart]);

  useEffect(() => {
    api.saveFavorites(favorites);
  }, [favorites]);

  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const cartTotal = productsList.reduce((sum, p) => sum + (Number(p.price) || 0) * (cart[p.id] || 0), 0);

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
    showToast(`Signed in as ${user.name} (${user.role})`);
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    showToast('Signed out successfully.');
  };

  const handleAddProduct = (newProdData) => {
    const added = api.addProduct(newProdData);
    setProductsList(api.getProducts());
    showToast(`Added "${added.name}" to catalog!`);
  };

  const handleDeleteProduct = (id) => {
    api.deleteProduct(id);
    setProductsList(api.getProducts());
    showToast('Product removed from catalog.');
  };

  const handleOrderCompleted = (orderData) => {
    const newOrder = api.createOrder(orderData);
    setOrdersList(api.getOrders());
    setCart({}); // clear cart
    showToast(`Order ${newOrder.id} placed!`);
    return newOrder;
  };

  return (
    <div className="site-shell">
      {/* Top Banner Strip */}
      <div className="top-strip">
        <div className="top-inner">
          <span><Truck size={14}/> FREE DELIVERY on orders over $49</span>
          <span><Sprout size={14}/> 100% Certified Organic & Farm Fresh</span>
          <span><Headphones size={14}/> Customer Support 24/7</span>
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
          {/* Admin Dashboard shortcut button */}
          <button 
            className="icon-btn" 
            aria-label="Admin Panel" 
            onClick={() => setAdminOpen(true)}
            title="Open Admin Panel"
            style={{ position: 'relative' }}
          >
            <Settings size={21}/>
            <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', borderRadius: '50%', background: '#bdf142' }}></span>
          </button>

          {/* Search Trigger */}
          <button className="icon-btn" aria-label="Search" onClick={() => setSearchOpen(!searchOpen)}>
            <Search/>
          </button>

          {/* User Account / Profile */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button 
                onClick={() => setAuthOpen(true)}
                style={{ 
                  background: '#224d14', 
                  color: '#eff9d9', 
                  border: '1px solid #4a7d25', 
                  borderRadius: '20px', 
                  padding: '5px 12px', 
                  fontSize: '11px', 
                  fontWeight: 600, 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <UserRound size={14}/> {currentUser.name} 
                <span style={{ fontSize: '9px', background: '#98cf31', color: '#162e0c', padding: '1px 5px', borderRadius: '4px', textTransform: 'capitalize' }}>
                  {currentUser.role}
                </span>
              </button>
              <button 
                onClick={handleLogout} 
                className="icon-btn" 
                title="Log out"
                aria-label="Log out"
              >
                <LogOut size={16}/>
              </button>
            </div>
          ) : (
            <button className="icon-btn account-btn" aria-label="Sign in" onClick={() => setAuthOpen(true)} title="Sign In / Register">
              <UserRound/>
            </button>
          )}

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
              placeholder="Search farm fresh produce..." 
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
            <div className="eyebrow"><span className="eyebrow-dot"></span> GOOD FOOD. GOOD MOOD.</div>
            <h1>Fresh Food.<br/>Healthy Life.<br/><em>Happy You.</em></h1>
            <p>100% organic fruits, vegetables & greens<br className="desktop-break"/> delivered directly from farm to your door.</p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <a className="btn btn-primary" href="#products">Shop Now <ArrowRight size={18}/></a>
              <button 
                className="btn" 
                onClick={() => setAdminOpen(true)}
                style={{ background: '#1c4212', color: '#c5e85f', border: '1px solid #4a7726', fontSize: '13px' }}
              >
                <Settings size={15}/> Admin Dashboard
              </button>
            </div>
            <div className="hero-perks">
              <div><span className="perk-icon"><Leaf/></span><span><b>100% Organic</b><small>Pure & Natural</small></span></div>
              <div><span className="perk-icon"><Truck/></span><span><b>Fast Delivery</b><small>On Time, Every Time</small></span></div>
              <div><span className="perk-icon"><ShieldCheck/></span><span><b>Secure Payment</b><small>Safe & Protected</small></span></div>
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
              {shownProducts.map(p => (
                <article className="product-card" key={p.id}>
                  <div className="product-image">
                    <img src={p.image} alt={p.name}/>
                    <span className="product-tag">{p.tag || 'Organic'}</span>
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
                        <b>${Number(p.price).toFixed(2)}</b>
                        <small> / {p.unit.split(' / ')[0]}</small>
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
              ))}
            </div>
          ) : (
            <div className="empty-state">No products found matching "{search}". Try searching for something else!</div>
          )}
        </section>

        {/* Newsletter Section */}
        <section className="newsletter section-wrap">
          <div className="newsletter-icon"><Mail/></div>
          <div className="newsletter-copy">
            <h3>Stay Healthy, Stay Updated!</h3>
            <p>Subscribe to receive seasonal harvesting deals, discount promo codes & fresh updates.</p>
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
          <p>Your trusted doorstep source for 100% farm-fresh, organic and healthy produce. Dedicated to health and sustainable agriculture.</p>
          <div className="socials">
            <a href="https://facebook.com" aria-label="Facebook"><Facebook/></a>
            <a href="https://instagram.com" aria-label="Instagram"><Instagram/></a>
            <a href="https://youtube.com" aria-label="YouTube"><Youtube/></a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <a href="#products">Shop All</a>
          <a href="#categories">Browse Categories</a>
          <a href="#deals">Special Deals</a>
          <a href="#about">About Our Farm</a>
          <a href="#contact">Contact Support</a>
        </div>
        <div className="footer-col">
          <h4>Customer Service</h4>
          <a href="#" onClick={e => { e.preventDefault(); setAuthOpen(true); }}>My Account</a>
          <a href="#" onClick={e => { e.preventDefault(); setAdminOpen(true); }}>Admin Panel</a>
          <a href="#" onClick={e => { e.preventDefault(); setCartOpen(true); }}>Basket & Orders</a>
          <a href="#about">Shipping Policy</a>
          <a href="#about">FAQs</a>
        </div>
        <div className="footer-col">
          <h4>Information</h4>
          <a href="#about">Privacy Policy</a>
          <a href="#about">Terms & Conditions</a>
          <a href="#about">Return Policy</a>
          <a href="#about">Organic Certification</a>
          <a href="#about">Careers</a>
        </div>
        <div className="footer-col payment-col">
          <h4>Accepted Payments</h4>
          <div className="payment-badges">
            <span>VISA</span>
            <span>Mastercard</span>
            <span>bKash</span>
            <span>Nagad</span>
            <span>COD</span>
          </div>
          <p><ShieldCheck size={14}/> 256-bit SSL Encrypted Checkout</p>
        </div>
        <div className="copyright">
          © 2026 GreenBasket. All rights reserved. 
          <span>Made with <Heart size={12} fill="currentColor"/> for fresh living.</span>
        </div>
      </footer>

      {/* Toast Notice */}
      {notice && (
        <div className="toast">
          <CheckCircle2 size={17}/> {notice}
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
      />

      {/* Admin Panel Modal */}
      <AdminModal
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        products={productsList}
        orders={ordersList}
        onAddProduct={handleAddProduct}
        onDeleteProduct={handleDeleteProduct}
      />
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App/>);