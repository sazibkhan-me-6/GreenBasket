import React, { useState, useEffect } from 'react';
import {
  Sparkles, Tag, Clock, Copy, Check, ArrowRight, ShieldCheck,
  Truck, Star, Heart, CheckCircle2, Plus, Percent
} from 'lucide-react';

export default function DealsView({
  productsList,
  cart,
  favorites,
  addToCart,
  toggleFavorite,
  navigateTo,
  storeSettings,
  onShowToast
}) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 35, seconds: 48 });

  // Countdown timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const promoCode = storeSettings?.promoCode || 'GREEN20';
  const promoDiscount = storeSettings?.promoDiscount || 20;

  const copyPromo = () => {
    try {
      navigator.clipboard.writeText(promoCode);
      setCopiedCode(true);
      onShowToast(`Copied coupon code ${promoCode} to clipboard! 🎉`);
      setTimeout(() => setCopiedCode(false), 2200);
    } catch {}
  };

  // Filter discounted items
  const discountedProducts = productsList.filter(
    p => p.discountPrice && Number(p.discountPrice) > 0 && Number(p.discountPrice) < Number(p.price)
  );

  // If few items have discounts, pick some more items to showcase
  const displayDeals = discountedProducts.length >= 3
    ? discountedProducts
    : productsList.slice(0, 6).map(p => ({
        ...p,
        discountPrice: p.discountPrice || Number((p.price * 0.8).toFixed(2))
      }));

  return (
    <div className="deals-page section-wrap">
      {/* Breadcrumb & Header */}
      <div className="page-header-banner">
        <div className="page-breadcrumb">
          <button type="button" onClick={() => navigateTo('home')}>Home</button>
          <span>/</span>
          <span className="current">Hot Deals & Offers</span>
        </div>
        <h1>Weekly Organic <em>Deals & Discounts</em></h1>
        <p>Save big on 100% certified farm harvests. Limited quantities available every week.</p>
      </div>

      {/* Flash Sale Banner & Countdown */}
      <div className="deals-hero-banner">
        <div className="deals-hero-copy">
          <div className="deals-badge">
            <Sparkles size={14} /> FLASH SALE LIVE NOW
          </div>
          <h2>UP TO <em>30% OFF</em> ON SEASONAL HARVESTS</h2>
          <p>Hand-harvested within 24 hours. Extra discounts applied at checkout automatically.</p>

          <div className="deals-countdown">
            <div className="timer-unit">
              <b>{String(timeLeft.hours).padStart(2, '0')}</b>
              <small>Hours</small>
            </div>
            <span>:</span>
            <div className="timer-unit">
              <b>{String(timeLeft.minutes).padStart(2, '0')}</b>
              <small>Mins</small>
            </div>
            <span>:</span>
            <div className="timer-unit">
              <b>{String(timeLeft.seconds).padStart(2, '0')}</b>
              <small>Secs</small>
            </div>
          </div>
        </div>

        {/* Coupon Code Card */}
        <div className="deals-coupon-card">
          <div className="coupon-tag"><Percent size={14} /> EXCLUSIVE COUPON</div>
          <h3>Save {promoDiscount}% Extra</h3>
          <p>Apply at checkout on any order over $30 for instant savings.</p>
          <div className="coupon-code-row">
            <span className="code-text">{promoCode}</span>
            <button
              type="button"
              className="copy-coupon-btn"
              onClick={copyPromo}
            >
              {copiedCode ? <Check size={14} color="#a5d83e" /> : <Copy size={14} />}
              <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Discounted Produce Grid */}
      <div className="section-heading" style={{ marginTop: '35px' }}>
        <div>
          <span className="heading-leaf">✦</span>
          <h2>Special Discounted Produce ({displayDeals.length})</h2>
        </div>
        <button
          type="button"
          className="heading-view-all-btn"
          onClick={() => navigateTo('shop')}
        >
          View Full Catalog <ArrowRight size={16} />
        </button>
      </div>

      <div className="product-grid">
        {displayDeals.map(p => {
          const discountPct = Math.round((1 - p.discountPrice / p.price) * 100);
          return (
            <article className="product-card" key={p.id}>
              <div className="product-image">
                <img src={p.image} alt={p.name} />
                <span className="product-tag" style={{ background: '#e11d48', color: '#fff', fontWeight: 800 }}>
                  -{discountPct}% OFF
                </span>
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
                    <b style={{ color: 'var(--lime)' }}>${Number(p.discountPrice).toFixed(2)}</b>
                    <span style={{ textDecoration: 'line-through', opacity: 0.55, fontSize: '11px', marginLeft: '5px' }}>
                      ${Number(p.price).toFixed(2)}
                    </span>
                    <small> / {(p.unit || '').split(' / ')[0]}</small>
                  </div>
                  <button className="add-btn" onClick={() => addToCart(p.id)}>
                    {cart[p.id] ? (
                      <><CheckCircle2 size={15} /> Added ({cart[p.id]})</>
                    ) : (
                      <><Plus size={16} /> Add to Cart</>
                    )}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Organic Value Bundles */}
      <div className="bundles-section section-block">
        <div className="section-heading">
          <div>
            <span className="heading-leaf">✦</span>
            <h2>Curated Farm Bundle Crates</h2>
          </div>
        </div>

        <div className="bundle-grid">
          <div className="bundle-card">
            <div className="bundle-badge">SAVE $8.00</div>
            <h3>Family Fresh Veggie Crate</h3>
            <p>12 types of seasonal organic vegetables (approx. 7kg). Ideal for a healthy family week.</p>
            <div className="bundle-price">
              <b>$29.99</b>
              <span>$37.99</span>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                if (productsList[0]) addToCart(productsList[0].id);
                onShowToast('Family Veggie Crate added to your basket!');
              }}
            >
              Add Crate to Basket
            </button>
          </div>

          <div className="bundle-card">
            <div className="bundle-badge">SAVE $10.00</div>
            <h3>Immunity & Vitality Fruit Basket</h3>
            <p>Orchard apples, organic oranges, ripe berries, avocados, and natural forest honey jar.</p>
            <div className="bundle-price">
              <b>$34.50</b>
              <span>$44.50</span>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                if (productsList[1]) addToCart(productsList[1].id);
                onShowToast('Immunity Fruit Basket added to your basket!');
              }}
            >
              Add Basket to Basket
            </button>
          </div>

          <div className="bundle-card">
            <div className="bundle-badge">SAVE $6.00</div>
            <h3>Green Pantry Starter Pack</h3>
            <p>Farm free-range eggs (1 dozen), sourdough bread loaf, cold-pressed olive oil & organic oats.</p>
            <div className="bundle-price">
              <b>$22.00</b>
              <span>$28.00</span>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                if (productsList[2]) addToCart(productsList[2].id);
                onShowToast('Green Pantry Pack added to your basket!');
              }}
            >
              Add Pack to Basket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
