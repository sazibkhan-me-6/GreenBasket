import React from 'react';
import { ArrowRight, Star, Heart, CheckCircle2, Plus, Sparkles } from 'lucide-react';

export default function CategoriesView({
  categories,
  productsList,
  activeCategory,
  setActiveCategory,
  cart,
  favorites,
  addToCart,
  toggleFavorite,
  navigateTo
}) {
  const categoryProducts = activeCategory === 'All'
    ? productsList
    : productsList.filter(p => {
        const c1 = (p.category || '').toLowerCase();
        const c2 = (activeCategory || '').toLowerCase();
        return c1 === c2 || c1.includes(c2) || c2.includes(c1);
      });

  return (
    <div className="categories-page section-wrap">
      {/* Breadcrumb & Header */}
      <div className="page-header-banner">
        <div className="page-breadcrumb">
          <button type="button" onClick={() => navigateTo('home')}>Home</button>
          <span>/</span>
          <span className="current">Categories</span>
        </div>
        <h1>Browse by <em>Produce Category</em></h1>
        <p>Explore our organic assortment by category. Click any category option below to immediately view and shop its fresh harvest.</p>
      </div>

      {/* Category Cards Showcase */}
      <div className="category-showcase-grid">
        <button
          type="button"
          className={`category-showcase-card ${activeCategory === 'All' ? 'active-showcase' : ''}`}
          onClick={() => navigateTo('shop', 'All')}
          title="Click to open all products"
        >
          <div className="showcase-img-wrap">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=85"
              alt="All produce"
            />
          </div>
          <div className="showcase-info">
            <h3>All Collections</h3>
            <p>Every fresh harvest from our local partner farms</p>
            <div className="showcase-bottom-row">
              <span className="showcase-badge">{productsList.length} Items</span>
              <span className="showcase-cta">Open Products <ArrowRight size={13} /></span>
            </div>
          </div>
        </button>

        {categories.map(cat => {
          const count = productsList.filter(p => {
            const c1 = (p.category || '').toLowerCase();
            const c2 = (cat.name || '').toLowerCase();
            return c1 === c2 || c1.includes(c2) || c2.includes(c1);
          }).length;
          return (
            <button
              type="button"
              key={cat.name}
              className={`category-showcase-card ${activeCategory === cat.name ? 'active-showcase' : ''}`}
              onClick={() => navigateTo('shop', cat.name)}
              title={`Click to open ${cat.name} products`}
            >
              <div className="showcase-img-wrap">
                <img src={cat.image} alt={cat.name} />
              </div>
              <div className="showcase-info">
                <h3>{cat.name}</h3>
                <p>100% Certified organic & farm picked</p>
                <div className="showcase-bottom-row">
                  <span className="showcase-badge">{count || cat.count}</span>
                  <span className="showcase-cta">Open Products <ArrowRight size={13} /></span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filtered Produce Header */}
      <div className="section-heading" style={{ marginTop: '35px' }}>
        <div>
          <span className="heading-leaf">✦</span>
          <h2>
            {activeCategory === 'All' ? 'All Farm Fresh Produce' : `Fresh ${activeCategory}`}
            <small style={{ fontSize: '13px', color: 'var(--muted)', marginLeft: '10px', fontWeight: 400 }}>
              ({categoryProducts.length} items available)
            </small>
          </h2>
        </div>
        <button
          type="button"
          className="heading-view-all-btn"
          onClick={() => navigateTo('shop', activeCategory)}
        >
          Open in Full Shop View <ArrowRight size={16} />
        </button>
      </div>

      {/* Category Pills Filter Row on Categories Page */}
      <div className="filter-row" style={{ marginBottom: '18px' }}>
        <button
          className={activeCategory === 'All' ? 'filter active-filter' : 'filter'}
          onClick={() => setActiveCategory('All')}
        >
          All produce ({productsList.length})
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

      {/* Products Grid for Selected Category */}
      <div className="product-grid">
        {categoryProducts.map(p => {
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
                      <><Plus size={16} /> Add to Cart</>
                    )}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
