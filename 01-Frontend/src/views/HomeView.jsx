import React, { useState } from 'react';
import {
  Leaf, Truck, Headphones, Search, ArrowRight, ShieldCheck,
  Sprout, Heart, Star, CheckCircle2, Mail, Sparkles, Package
} from 'lucide-react';

export default function HomeView({
  productsList,
  categories,
  cart,
  favorites,
  addToCart,
  toggleFavorite,
  navigateTo,
  photo,
  storeSettings,
  onSubscribe
}) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Top featured produce items
  const featuredProducts = productsList.slice(0, 5);

  const handleSubscribeSubmit = (e) => {
    e.preventDefault();
    if (email.includes('@')) {
      setSubscribed(true);
      setEmail('');
      onSubscribe('Subscribed to GreenBasket updates! 🌱');
    }
  };

  return (
    <div className="home-view">
      {/* Hero Section */}
      <section className="hero section-wrap">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-dot"></span> 100% ORGANIC & FRESH
          </div>
          <h1>
            Fresh Food.<br />
            Healthy Life.<br />
            <em>Happy You.</em>
          </h1>
          <p>
            Organic fruits, vegetables & greens<br className="desktop-break" /> delivered directly from farm to your door within 24h.
          </p>
          <div className="hero-actions" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigateTo('shop')}
            >
              Shop Now <ArrowRight size={18} />
            </button>
            <button
              type="button"
              className="btn track-hero-cta"
              onClick={() => navigateTo('track')}
              style={{
                background: 'rgba(255,255,255,0.12)',
                color: '#eff9d9',
                border: '1px solid rgba(196,233,90,0.3)',
                backdropFilter: 'blur(4px)'
              }}
            >
              <Truck size={17} color="#c4e95a" /> Track Parcel 📦
            </button>
          </div>
          <div className="hero-perks">
            <div>
              <span className="perk-icon"><Leaf /></span>
              <span><b>100% Organic</b><small>Certified produce</small></span>
            </div>
            <div>
              <span className="perk-icon"><Truck /></span>
              <span><b>Fast Delivery</b><small>Same day free</small></span>
            </div>
            <div>
              <span className="perk-icon"><ShieldCheck /></span>
              <span><b>Secure Checkout</b><small>Safe payments</small></span>
            </div>
          </div>
        </div>

        <div className="hero-art">
          <div className="hero-glow"></div>
          <img
            src={photo('photo-1540420773420-3366772f4999', 1100)}
            alt="A colorful basket of fresh vegetables"
          />
          <div className="fresh-stamp">
            <span>EAT FRESH</span>
            <b>STAY<br />HEALTHY</b>
            <Leaf size={17} />
          </div>
          <span className="floating-leaf leaf-one">✦</span>
          <span className="floating-leaf leaf-two">✦</span>
        </div>
      </section>

      {/* Farm Story Preview Section */}
      <section className="farm-panel section-wrap">
        <div className="farmer-photo">
          <img
            src={photo('photo-1500382017468-9049fed747ef', 650)}
            alt="Sunlit green farm"
          />
        </div>
        <div className="farm-copy">
          <span className="kicker">WELCOME TO GREENBASKET</span>
          <h2>From Our Farm<br />To <em>Your Table</em></h2>
          <p>
            We bring you the freshest, handpicked produce from trusted local growers. Certified quality you can trust, every single day.
          </p>
          <button
            type="button"
            className="text-link"
            onClick={() => navigateTo('about')}
            style={{ border: 0, cursor: 'pointer' }}
          >
            Read Our Farm Story <ArrowRight size={16} />
          </button>
        </div>
        <div className="farm-stats">
          <div>
            <span className="stat-icon"><Sprout /></span>
            <p><b>25+</b><small>Local Partner Farms</small></p>
          </div>
          <div>
            <span className="stat-icon"><Leaf /></span>
            <p><b>500+</b><small>Organic Items</small></p>
          </div>
          <div>
            <span className="stat-icon"><Heart /></span>
            <p><b>10K+</b><small>Happy Customers</small></p>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="section-wrap section-block">
        <div className="section-heading">
          <div>
            <span className="heading-leaf">✦</span>
            <h2>Shop by Category</h2>
          </div>
          <button
            type="button"
            className="heading-view-all-btn"
            onClick={() => navigateTo('categories')}
          >
            View all categories <ArrowRight size={16} />
          </button>
        </div>
        <div className="category-grid">
          {categories.slice(0, 5).map(cat => (
            <button
              className="category-card"
              key={cat.name}
              onClick={() => navigateTo('categories', cat.name)}
            >
              <img src={cat.image} alt={cat.name} />
              <b>{cat.name}</b>
              <small>{cat.count}</small>
            </button>
          ))}
        </div>
      </section>

      {/* Flash Deal Banner Preview */}
      <section className="deal-banner section-wrap">
        <div className="deal-copy">
          <span>LIMITED TIME OFFER</span>
          <h2>UP TO <em>30% OFF</em></h2>
          <h3>On Fresh Seasonal Vegetables</h3>
          <button
            type="button"
            className="btn btn-yellow"
            onClick={() => navigateTo('deals')}
          >
            Grab the Deal <ArrowRight size={16} />
          </button>
        </div>
        <div className="deal-image">
          <img
            src={photo('photo-1518843875459-f738682238a6', 900)}
            alt="Fresh seasonal vegetables"
          />
        </div>
        <div className="deal-seal">
          <span>Best Quality</span>
          <b>Best Price</b>
        </div>
      </section>

      {/* Featured Products Snippet */}
      <section className="section-wrap section-block products-block">
        <div className="section-heading">
          <div>
            <span className="heading-leaf">✦</span>
            <h2>Today's Fresh Harvest</h2>
          </div>
          <button
            type="button"
            className="heading-view-all-btn"
            onClick={() => navigateTo('shop')}
          >
            Explore all produce ({productsList.length}) <ArrowRight size={16} />
          </button>
        </div>

        <div className="product-grid">
          {featuredProducts.map(p => {
            const hasDiscount = p.discountPrice && Number(p.discountPrice) > 0 && Number(p.discountPrice) < Number(p.price);
            return (
              <article className="product-card" key={p.id}>
                <div className="product-image">
                  <img src={p.image} alt={p.name} />
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
                    <Heart size={17} fill={favorites.includes(p.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
                <div className="product-info">
                  <div className="rating">
                    <Star size={12} fill="currentColor" /> {p.rating || 4.9}
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
                          <small> / {(p.unit || '').split(' / ')[0]}</small>
                        </>
                      ) : (
                        <>
                          <b>${Number(p.price).toFixed(2)}</b>
                          <small> / {(p.unit || '').split(' / ')[0]}</small>
                        </>
                      )}
                    </div>
                    <button className="add-btn" onClick={() => addToCart(p.id)}>
                      {cart[p.id] ? (
                        <><CheckCircle2 size={15} /> Added ({cart[p.id]})</>
                      ) : (
                        <>+ Add to Cart</>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '22px' }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigateTo('shop')}
            style={{ padding: '12px 28px' }}
          >
            View Complete Produce Catalog <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-wrap section-block why-block">
        <div className="section-heading">
          <div><span className="heading-leaf">✦</span><h2>Why Choose GreenBasket?</h2></div>
        </div>
        <div className="benefit-grid">
          <div className="benefit"><Sprout /><span><b>Farm Fresh</b><small>Handpicked daily with care</small></span></div>
          <div className="benefit"><CheckCircle2 /><span><b>100% Chemical Free</b><small>Safe for family & kids</small></span></div>
          <div className="benefit"><Leaf /><span><b>Sustainably Grown</b><small>Protects natural ecology</small></span></div>
          <div className="benefit"><ShieldCheck /><span><b>Money-Back Quality</b><small>Guaranteed freshness</small></span></div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter section-wrap">
        <div className="newsletter-icon"><Mail /></div>
        <div className="newsletter-copy">
          <h3>Stay Healthy, Stay Updated!</h3>
          <p>Subscribe to get best offers, health tips &<br /> fresh updates in your inbox.</p>
        </div>
        <form className="subscribe-form" onSubmit={handleSubscribeSubmit}>
          <input
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <button type="submit">{subscribed ? 'Subscribed ✓' : 'Subscribe'}</button>
        </form>
        <img
          src={photo('photo-1540420773420-3366772f4999', 350)}
          alt=""
          className="newsletter-produce"
        />
      </section>
    </div>
  );
}
