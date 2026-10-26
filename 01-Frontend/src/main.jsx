import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Leaf, Truck, Headphones, Search, UserRound, ShoppingCart, ArrowRight,
  ShieldCheck, Sprout, Heart, Menu, X, Star, CheckCircle2, Mail, Instagram,
  Facebook, Youtube, Plus, Minus, ChevronRight
} from 'lucide-react';
import './styles.css';

const photo = (id, w=700) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;
const categories = [
  { name: 'Vegetables', count: '120+ items', image: photo('photo-1540420773420-3366772f4999', 450) },
  { name: 'Fruits', count: '80+ items', image: photo('photo-1610832958506-aa56368176cf', 450) },
  { name: 'Herbs & Greens', count: '60+ items', image: photo('photo-1466692476868-aef1dfb1e735', 450) },
  { name: 'Dairy & Eggs', count: '40+ items', image: photo('photo-1563636619-e9143da7973b', 450) },
  { name: 'Nuts & Seeds', count: '50+ items', image: photo('photo-1505576399274-565b52d4ac71', 450) },
];
const products = [
  { id: 1, name: 'Organic Tomatoes', unit: '250g / pack', price: 2.49, category: 'Vegetables', image: photo('photo-1546094096-0df4bcaaa337', 500), tag: 'Farm fresh' },
  { id: 2, name: 'Fresh Carrots', unit: '1kg / bag', price: 1.49, category: 'Vegetables', image: photo('photo-1445282768818-728615cc910a', 500), tag: 'Best seller' },
  { id: 3, name: 'Green Spinach', unit: '1 bunch', price: 1.29, category: 'Herbs & Greens', image: photo('photo-1576045057995-568f588f82fb', 500), tag: 'Organic' },
  { id: 4, name: 'Red Apples', unit: '500g / bag', price: 2.99, category: 'Fruits', image: photo('photo-1560806887-1e4cd0b6cbd6', 500), tag: 'Sweet & crisp' },
  { id: 5, name: 'Farm Eggs (6pcs)', unit: '6 eggs / pack', price: 1.99, category: 'Dairy & Eggs', image: photo('photo-1506976785307-8732e854ad03', 500), tag: 'Free range' },
  { id: 6, name: 'Sweet Oranges', unit: '1kg / bag', price: 2.79, category: 'Fruits', image: photo('photo-1547514701-42782101795e', 500), tag: 'Vitamin C' },
  { id: 7, name: 'Garden Herbs', unit: 'Fresh bunch', price: 1.59, category: 'Herbs & Greens', image: photo('photo-1501004318641-b39e6451bec6', 500), tag: 'Just picked' },
  { id: 8, name: 'Mixed Nuts', unit: '200g / pack', price: 3.49, category: 'Nuts & Seeds', image: photo('photo-1505576399274-565b52d4ac71', 500), tag: 'Energy boost' },
];

function App() {
  const [cart, setCart] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [notice, setNotice] = useState('');
  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const cartTotal = products.reduce((sum, p) => sum + p.price * (cart[p.id] || 0), 0);
  const shownProducts = useMemo(() => products.filter(p =>
    (activeCategory === 'All' || p.category === activeCategory) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  ), [activeCategory, search]);

  const addToCart = (id) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setNotice('Added to your basket');
    setTimeout(() => setNotice(''), 1800);
  };
  const changeQty = (id, amount) => setCart(prev => {
    const next = { ...prev, [id]: Math.max(0, (prev[id] || 0) + amount) };
    if (!next[id]) delete next[id];
    return next;
  });
  const toggleFavorite = id => setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return <div className="site-shell">
    <div className="top-strip">
      <div className="top-inner">
        <span><Truck size={14}/> FREE DELIVERY on orders over $49</span>
        <span><Sprout size={14}/> Eat Fresh, Live Healthy</span>
        <span><Headphones size={14}/> Support 24/7</span>
      </div>
    </div>
    <header className="header">
      <a href="#home" className="brand" aria-label="GreenBasket home">
        <span className="brand-mark"><ShoppingCart size={29}/><Leaf size={16}/></span>
        <span><b>Green<span>Basket</span></b><small>Fresh from Nature</small></span>
      </a>
      <button className="mobile-menu icon-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X/> : <Menu/>}</button>
      <nav className={menuOpen ? 'nav nav-open' : 'nav'}>
        {['Home', 'Shop', 'Categories', 'Deals', 'About Us', 'Contact'].map((item, i) =>
          <a key={item} className={i === 0 ? 'active' : ''} href={['#home','#products','#categories','#deals','#about','#contact'][i]} onClick={() => setMenuOpen(false)}>{item}</a>
        )}
      </nav>
      <div className="header-actions">
        <button className="icon-btn" aria-label="Search" onClick={() => setSearchOpen(!searchOpen)}><Search/></button>
        <button className="icon-btn account-btn" aria-label="Account" onClick={() => setNotice('Account sign-in can be connected to your backend.')}><UserRound/></button>
        <button className="icon-btn cart-trigger" aria-label="Open basket" onClick={() => setCartOpen(true)}><ShoppingCart/>{cartCount > 0 && <span className="cart-badge">{cartCount}</span>}</button>
      </div>
      {searchOpen && <div className="search-panel"><Search size={18}/><input autoFocus placeholder="Search fresh products..." value={search} onChange={e => {setSearch(e.target.value); document.querySelector('#products')?.scrollIntoView({behavior:'smooth'});}}/><button onClick={() => {setSearch('');setSearchOpen(false)}}><X size={18}/></button></div>}
    </header>

    <main>
      <section className="hero section-wrap" id="home">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot"></span> GOOD FOOD. GOOD MOOD.</div>
          <h1>Fresh Food.<br/>Healthy Life.<br/><em>Happy You.</em></h1>
          <p>100% organic fruits, vegetables & more<br className="desktop-break"/> delivered fresh to your door.</p>
          <a className="btn btn-primary" href="#products">Shop Now <ArrowRight size={18}/></a>
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

      <section className="farm-panel section-wrap" id="about">
        <div className="farmer-photo"><img src={photo('photo-1500382017468-9049fed747ef', 650)} alt="Sunlit green farm"/></div>
        <div className="farm-copy"><span className="kicker">WELCOME TO GREENBASKET</span><h2>From Our Farm<br/>To <em>Your Table</em></h2><p>We bring you the freshest, handpicked produce from trusted farms. Quality you can trust, every single time.</p><a href="#about" className="text-link" onClick={e=>{e.preventDefault();setNotice('We partner with local growers to bring you seasonal produce.')}}>Learn More <ArrowRight size={16}/></a></div>
        <div className="farm-stats">
          <div><span className="stat-icon"><Sprout/></span><p><b>25+</b><small>Local Farms</small></p></div>
          <div><span className="stat-icon"><Leaf/></span><p><b>500+</b><small>Fresh Products</small></p></div>
          <div><span className="stat-icon"><Heart/></span><p><b>10K+</b><small>Happy Customers</small></p></div>
        </div>
      </section>

      <section className="section-wrap section-block" id="categories">
        <div className="section-heading"><div><span className="heading-leaf">✦</span><h2>Shop by Category</h2></div><a href="#products" onClick={() => setActiveCategory('All')}>View all <ArrowRight size={16}/></a></div>
        <div className="category-grid">{categories.map(cat=><button className={'category-card '+(activeCategory===cat.name?'category-active':'')} key={cat.name} onClick={()=>{setActiveCategory(activeCategory===cat.name?'All':cat.name);document.querySelector('#products')?.scrollIntoView({behavior:'smooth'})}}><img src={cat.image} alt={cat.name}/><b>{cat.name}</b><small>{cat.count}</small></button>)}</div>
      </section>

      <section className="deal-banner section-wrap" id="deals">
        <div className="deal-copy"><span>LIMITED TIME OFFER</span><h2>UP TO <em>30% OFF</em></h2><h3>On Fresh Vegetables</h3><a href="#products" className="btn btn-yellow">Grab the Deal <ArrowRight size={16}/></a></div>
        <div className="deal-image"><img src={photo('photo-1518843875459-f738682238a6', 900)} alt="Fresh seasonal vegetables"/></div>
        <div className="deal-seal"><span>Best Quality</span><b>Best Price</b></div>
      </section>

      <section className="section-wrap section-block why-block">
        <div className="section-heading"><div><span className="heading-leaf">✦</span><h2>Why Choose Us?</h2></div></div>
        <div className="benefit-grid">
          <div className="benefit"><Sprout/><span><b>Farm Fresh</b><small>Handpicked with care</small></span></div>
          <div className="benefit"><CheckCircle2/><span><b>Chemical Free</b><small>Safe for you & family</small></span></div>
          <div className="benefit"><Leaf/><span><b>Sustainably Grown</b><small>Good for nature</small></span></div>
          <div className="benefit"><ShieldCheck/><span><b>Premium Quality</b><small>Best quality assured</small></span></div>
        </div>
      </section>

      <section className="section-wrap section-block products-block" id="products">
        <div className="section-heading"><div><span className="heading-leaf">✦</span><h2>{activeCategory === 'All' ? 'Top Picks For You' : activeCategory}</h2></div><a href="#products" onClick={() => setActiveCategory('All')}>View all <ArrowRight size={16}/></a></div>
        <div className="filter-row"><button className={activeCategory==='All'?'filter active-filter':'filter'} onClick={()=>setActiveCategory('All')}>All products</button>{categories.map(c=><button key={c.name} className={activeCategory===c.name?'filter active-filter':'filter'} onClick={()=>setActiveCategory(c.name)}>{c.name}</button>)}</div>
        {shownProducts.length ? <div className="product-grid">{shownProducts.map(p=><article className="product-card" key={p.id}>
          <div className="product-image"><img src={p.image} alt={p.name}/><span className="product-tag">{p.tag}</span><button className={'heart-btn '+(favorites.includes(p.id)?'hearted':'')} aria-label="Toggle favorite" onClick={()=>toggleFavorite(p.id)}><Heart size={17} fill={favorites.includes(p.id)?'currentColor':'none'}/></button></div>
          <div className="product-info"><div className="rating"><Star size={12} fill="currentColor"/> 4.9 <span>({Math.floor(p.id*17+12)} reviews)</span></div><h3>{p.name}</h3><small>{p.unit}</small><div className="product-bottom"><div><b>${p.price.toFixed(2)}</b><small> / {p.unit.split(' / ')[0]}</small></div><button className="add-btn" onClick={()=>addToCart(p.id)}>{cart[p.id] ? <><CheckCircle2 size={15}/> Added ({cart[p.id]})</> : <><Plus size={16}/> Add to Cart</>}</button></div></div>
        </article>)}</div> : <div className="empty-state">No products found. Try another search.</div>}
      </section>

      <section className="newsletter section-wrap">
        <div className="newsletter-icon"><Mail/></div><div className="newsletter-copy"><h3>Stay Healthy, Stay Updated!</h3><p>Subscribe to get best offers, health tips &<br/> fresh updates in your inbox.</p></div>
        <form className="subscribe-form" onSubmit={e=>{e.preventDefault();if(email.includes('@')){setSubscribed(true);setEmail('')}else setNotice('Please enter a valid email address.')}}><input type="email" required placeholder="Enter your email" value={email} onChange={e=>setEmail(e.target.value)}/><button type="submit">{subscribed?'Subscribed ✓':'Subscribe'}</button></form>
        <img src={photo('photo-1540420773420-3366772f4999', 350)} alt="" className="newsletter-produce"/>
      </section>
    </main>

    <footer className="footer section-wrap" id="contact">
      <div className="footer-brand"><a href="#home" className="brand"><span className="brand-mark"><ShoppingCart size={27}/><Leaf size={14}/></span><span><b>Green<span>Basket</span></b><small>Fresh from Nature</small></span></a><p>Your trusted source for fresh, organic and healthy food. We care for you and the planet.</p><div className="socials"><a href="https://facebook.com" aria-label="Facebook"><Facebook/></a><a href="https://instagram.com" aria-label="Instagram"><Instagram/></a><a href="https://youtube.com" aria-label="YouTube"><Youtube/></a></div></div>
      <div className="footer-col"><h4>Quick Links</h4><a href="#products">Shop</a><a href="#categories">Categories</a><a href="#deals">Deals</a><a href="#about">About Us</a><a href="#contact">Contact</a></div>
      <div className="footer-col"><h4>Customer Service</h4><a href="#contact">My Account</a><a href="#contact">Track Order</a><a href="#contact">Shipping & Delivery</a><a href="#contact">Returns & Refunds</a><a href="#contact">FAQs</a></div>
      <div className="footer-col"><h4>Information</h4><a href="#contact">Privacy Policy</a><a href="#contact">Terms & Conditions</a><a href="#contact">Refund Policy</a><a href="#contact">Blog</a><a href="#contact">Careers</a></div>
      <div className="footer-col payment-col"><h4>Payment Methods</h4><div className="payment-badges"><span>VISA</span><span>PayPal</span><span>Mastercard</span><span>SSL SECURE</span></div><p><ShieldCheck size={14}/> Secure checkout</p></div>
      <div className="copyright">© 2026 GreenBasket. All rights reserved. <span>Made with <Heart size={12} fill="currentColor"/> for fresh living.</span></div>
    </footer>

    {notice && <div className="toast"><CheckCircle2 size={17}/>{notice}<button onClick={()=>setNotice('')} aria-label="Dismiss"><X size={15}/></button></div>}
    {cartOpen && <div className="drawer-backdrop" onClick={()=>setCartOpen(false)}><aside className="cart-drawer" onClick={e=>e.stopPropagation()}><div className="drawer-heading"><h2>Your Basket <span>({cartCount})</span></h2><button className="icon-btn" onClick={()=>setCartOpen(false)} aria-label="Close basket"><X/></button></div>
      {cartCount===0 ? <div className="cart-empty"><ShoppingCart size={40}/><h3>Your basket is empty</h3><p>Discover something fresh today.</p><button className="btn btn-primary" onClick={()=>setCartOpen(false)}>Start Shopping <ArrowRight size={16}/></button></div> : <>
        <div className="cart-items">{products.filter(p=>cart[p.id]).map(p=><div className="cart-item" key={p.id}><img src={p.image} alt={p.name}/><div className="cart-item-info"><b>{p.name}</b><small>${p.price.toFixed(2)} each</small><div className="qty-control"><button onClick={()=>changeQty(p.id,-1)} aria-label="Decrease quantity"><Minus size={13}/></button><span>{cart[p.id]}</span><button onClick={()=>changeQty(p.id,1)} aria-label="Increase quantity"><Plus size={13}/></button></div></div><b className="item-total">${(p.price*cart[p.id]).toFixed(2)}</b></div>)}</div>
        <div className="cart-summary"><div><span>Subtotal</span><b>${cartTotal.toFixed(2)}</b></div><div><span>Delivery</span><b>{cartTotal>=49?'FREE':'$4.99'}</b></div><div className="grand-total"><span>Total</span><b>${(cartTotal+(cartTotal>=49?0:4.99)).toFixed(2)}</b></div><button className="btn btn-primary checkout-btn" onClick={()=>setNotice('Checkout demo: connect a payment provider to accept real orders.')}>Proceed to Checkout <ArrowRight size={17}/></button><small className="checkout-note"><ShieldCheck size={14}/> Secure checkout</small></div>
      </>}</aside></div>}
  </div>;
}

createRoot(document.getElementById('root')).render(<App/>);