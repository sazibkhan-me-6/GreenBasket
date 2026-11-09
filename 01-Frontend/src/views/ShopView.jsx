import React, { useState, useMemo } from 'react';
import {
  Search, Star, Heart, CheckCircle2, Plus, ArrowRight,
  Filter, Sparkles, X, SlidersHorizontal
} from 'lucide-react';

export default function ShopView({
  productsList,
  categories,
  cart,
  favorites,
  addToCart,
  toggleFavorite,
  activeCategory,
  setActiveCategory,
  navigateTo
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');

  const filteredProducts = useMemo(() => {
    let list = productsList.filter(p => {
      const matchCat = activeCategory === 'All' || p.category.toLowerCase() === activeCategory.toLowerCase();
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCat && matchSearch;
    });

    if (sortBy === 'price-low') {
      list.sort((a, b) => {
        const priceA = a.discountPrice || a.price;
        const priceB = b.discountPrice || b.price;
        return priceA - priceB;
      });
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => {
        const priceA = a.discountPrice || a.price;
        const priceB = b.discountPrice || b.price;
        return priceB - priceA;
      });
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return list;
  }, [productsList, activeCategory, searchTerm, sortBy]);

  return (
    <div className="shop-page section-wrap">
      {/* Breadcrumb & Header */}
      <div className="page-header-banner">
        <div className="page-breadcrumb">
          <button type="button" onClick={() => navigateTo('home')}>Home</button>
          <span>/</span>
          <span className="current">Shop Catalog</span>
        </div>
        <h1>Fresh Organic <em>Produce Market</em></h1>
        <p>Directly harvested from local organic farms. 100% chemical-free and packed with vital nutrition.</p>
      </div>

      {/* Control Toolbar: Search, Category Pills, Sort */}
      <div className="shop-toolbar-card">
        {/* Search Input */}
        <div className="shop-search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search produce (e.g. Tomato, Apples, Eggs)..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button type="button" className="clear-search-btn" onClick={() => setSearchTerm('')}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* Sorting Dropdown */}
        <div className="shop-sort-box">
          <SlidersHorizontal size={15} />
          <span>Sort By:</span>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="default">Featured & Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Customer Rating</option>
          </select>
        </div>
      </div>

      {/* Category Pills Filter Row */}
      <div className="filter-row shop-category-pills">
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

      {/* Results Header Status */}
      <div className="shop-results-status">
        <span>
          Showing <b>{filteredProducts.length}</b> {filteredProducts.length === 1 ? 'item' : 'items'} in{' '}
          <em>{activeCategory}</em>
          {searchTerm && ` matching "${searchTerm}"`}
        </span>
        {(activeCategory !== 'All' || searchTerm) && (
          <button
            type="button"
            className="reset-filters-btn"
            onClick={() => {
              setActiveCategory('All');
              setSearchTerm('');
            }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length ? (
        <div className="product-grid shop-product-grid">
          {filteredProducts.map(p => {
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
      ) : (
        <div className="shop-empty-state">
          <Search size={42} opacity={0.4} />
          <h3>No fresh produce matched your search</h3>
          <p>Try searching with another keyword or resetting the category filter.</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setActiveCategory('All');
              setSearchTerm('');
            }}
          >
            Show All Produce
          </button>
        </div>
      )}
    </div>
  );
}
