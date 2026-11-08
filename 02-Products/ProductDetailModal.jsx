import React, { useState } from 'react';
import { X, Star, Heart, CheckCircle2, ShoppingCart, Plus, Minus, ShieldCheck, Sprout, Leaf } from 'lucide-react';

export default function ProductDetailModal({
  product,
  onClose,
  cartQty = 0,
  onAddToCart,
  onChangeQty,
  isFavorite,
  onToggleFavorite
}) {
  if (!product) return null;

  const priceNum = Number(product.price) || 0;
  const hasDiscount = product.discountPrice && Number(product.discountPrice) > 0 && Number(product.discountPrice) < priceNum;
  const activePrice = hasDiscount ? Number(product.discountPrice) : priceNum;
  const savings = hasDiscount ? (priceNum - activePrice).toFixed(2) : 0;
  const discountPct = hasDiscount ? Math.round((1 - activePrice / priceNum) * 100) : 0;

  return (
    <div className="drawer-backdrop" onClick={onClose} style={{ zIndex: 65, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div 
        className="quick-view-card" 
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fcfdfa',
          color: '#1a3311',
          width: 'min(640px, calc(100% - 24px))',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '24px',
          boxShadow: '0 25px 70px rgba(0,0,0,0.45)',
          position: 'relative'
        }}
      >
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10, background: '#ffffffcc', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'grid', placeItems: 'center', cursor: 'pointer', color: '#334827', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          aria-label="Close"
        >
          <X size={18}/>
        </button>

        <div className="quick-view-grid">
          <div className="quick-view-photo-wrap">
            <img 
              src={product.image} 
              alt={product.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80';
              }}
            />
            {hasDiscount && (
              <span className="quick-view-discount-tag">
                -{discountPct}% OFF
              </span>
            )}
          </div>

          <div className="quick-view-content">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="product-category-pill">{product.category}</span>
              <button 
                type="button"
                onClick={() => onToggleFavorite(product.id)}
                className={'quick-view-heart-btn ' + (isFavorite ? 'hearted' : '')}
                aria-label="Favorite"
              >
                <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'}/>
              </button>
            </div>

            <h2 className="quick-view-title">{product.name}</h2>
            <p className="quick-view-unit">{product.unit}</p>

            <div className="quick-view-rating">
              <Star size={13} fill="#eab308" color="#eab308"/>
              <b>{product.rating || 4.9}</b>
              <span>({product.reviews || 28} verified reviews)</span>
            </div>

            <div className="quick-view-price-row">
              <span className="current-price">${activePrice.toFixed(2)}</span>
              {hasDiscount && (
                <>
                  <span className="strikethrough-price">${priceNum.toFixed(2)}</span>
                  <span className="save-badge">You save ${savings}!</span>
                </>
              )}
            </div>

            <div className="quick-view-stock-indicator">
              <CheckCircle2 size={14} color="#3c8213"/>
              <span>
                {product.stock > 0 
                  ? `In Stock (${product.stock} units available)` 
                  : 'Currently Out of Stock'}
              </span>
            </div>

            <p className="quick-view-desc">
              100% naturally grown produce harvested directly from certified local partner farms. Carefully packaged to retain maximum crispness, freshness and nutrients.
            </p>

            <div className="quick-view-features">
              <div><Sprout size={13} color="#457f12"/> <span>Certified 100% Organic</span></div>
              <div><ShieldCheck size={13} color="#457f12"/> <span>Pesticide & Chemical-Free</span></div>
              <div><Leaf size={13} color="#457f12"/> <span>Sustainably Handpicked</span></div>
            </div>

            <div className="quick-view-action-row">
              {cartQty > 0 ? (
                <div className="modal-qty-stepper">
                  <button onClick={() => onChangeQty(product.id, -1)} aria-label="Decrease">
                    <Minus size={16}/>
                  </button>
                  <span>{cartQty} in Basket</span>
                  <button onClick={() => onChangeQty(product.id, 1)} aria-label="Increase">
                    <Plus size={16}/>
                  </button>
                </div>
              ) : (
                <button 
                  type="button" 
                  className="btn btn-primary modal-add-btn" 
                  onClick={() => onAddToCart(product.id)}
                  disabled={product.stock <= 0}
                >
                  <ShoppingCart size={18}/> {product.stock > 0 ? 'Add to Basket' : 'Out of Stock'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
