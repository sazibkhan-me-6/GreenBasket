import React, { useState } from 'react';
import { X, ShoppingCart, Plus, Minus, ArrowRight, ShieldCheck, Tag, Sparkles, Truck } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  products,
  cartCount,
  cartTotal,
  onChangeQty,
  onOpenCheckout,
  storeSettings,
  appliedDiscount = 0,
  setAppliedDiscount,
  appliedPromoCode = '',
  setAppliedPromoCode
}) {
  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState('');

  if (!isOpen) return null;

  const targetPromo = storeSettings?.promoCode ? storeSettings.promoCode.trim().toUpperCase() : 'GREEN20';
  const targetPct = Number(storeSettings?.promoDiscount) || 20;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const cleanInput = promoInput.trim().toUpperCase();
    if (cleanInput === targetPromo) {
      if (setAppliedDiscount) setAppliedDiscount(targetPct);
      if (setAppliedPromoCode) setAppliedPromoCode(cleanInput);
      setPromoMessage(`🎉 Success! ${targetPct}% discount applied.`);
    } else {
      setPromoMessage(`Invalid promo code. Use "${targetPromo}" for ${targetPct}% off.`);
    }
  };

  const handleClearPromo = () => {
    if (setAppliedDiscount) setAppliedDiscount(0);
    if (setAppliedPromoCode) setAppliedPromoCode('');
    setPromoInput('');
    setPromoMessage('');
  };

  const discountAmount = (cartTotal * appliedDiscount) / 100;
  const netSubtotal = Math.max(0, cartTotal - discountAmount);
  const deliveryThreshold = Number(storeSettings?.freeDeliveryThreshold) || 49;
  const deliveryFee = netSubtotal >= deliveryThreshold || cartCount === 0 ? 0 : 4.99;
  const finalTotal = netSubtotal + deliveryFee;
  const neededForFreeShipping = Math.max(0, deliveryThreshold - netSubtotal);
  const progressPercent = Math.min(100, Math.round((netSubtotal / deliveryThreshold) * 100));

  const cartProductList = products.filter(p => cart[p.id]);
  const getItemPrice = (p) => (p && p.discountPrice && Number(p.discountPrice) > 0 && Number(p.discountPrice) < Number(p.price)) ? Number(p.discountPrice) : Number(p.price || 0);

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside className="cart-drawer" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-heading">
          <h2>Your Basket <span>({cartCount})</span></h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close basket">
            <X size={22}/>
          </button>
        </div>

        {/* Content */}
        {cartCount === 0 ? (
          <div className="cart-empty">
            <ShoppingCart size={44}/>
            <h3>Your basket is empty</h3>
            <p>Explore our fresh harvest and add organic items.</p>
            <button className="btn btn-primary" onClick={onClose}>
              Start Shopping <ArrowRight size={16}/>
            </button>
          </div>
        ) : (
          <>
            {/* Free Shipping Progress Tracker */}
            <div className="shipping-progress-box">
              <div className="shipping-progress-text">
                <Truck size={14} className="truck-icon"/>
                {netSubtotal >= deliveryThreshold ? (
                  <span><b>Congratulations!</b> You unlocked <em>FREE Delivery</em> 🎉</span>
                ) : (
                  <span>Add <b>${neededForFreeShipping.toFixed(2)}</b> more for <em>FREE Delivery</em></span>
                )}
              </div>
              <div className="shipping-bar-track">
                <div 
                  className="shipping-bar-fill" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Cart Items List */}
            <div className="cart-items">
              {cartProductList.map(p => {
                const qty = cart[p.id];
                return (
                  <div className="cart-item" key={p.id}>
                    <img 
                      src={p.image} 
                      alt={p.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80';
                      }}
                    />
                    <div className="cart-item-info">
                      <b>{p.name}</b>
                      <small>
                        ${getItemPrice(p).toFixed(2)} each
                        {p.discountPrice && Number(p.discountPrice) < Number(p.price) && (
                          <span style={{ textDecoration: 'line-through', marginLeft: '5px', opacity: 0.6 }}>${Number(p.price).toFixed(2)}</span>
                        )}
                      </small>
                      <div className="qty-control">
                        <button onClick={() => onChangeQty(p.id, -1)} aria-label="Decrease quantity">
                          <Minus size={13}/>
                        </button>
                        <span>{qty}</span>
                        <button onClick={() => onChangeQty(p.id, 1)} aria-label="Increase quantity">
                          <Plus size={13}/>
                        </button>
                      </div>
                    </div>
                    <b className="item-total">${(getItemPrice(p) * qty).toFixed(2)}</b>
                  </div>
                );
              })}
            </div>

            {/* Promo Code Input */}
            <div className="cart-promo-section">
              {appliedDiscount > 0 ? (
                <div className="applied-promo-tag">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={14} color="#5a9e1e"/>
                    <span>Promo <b>{appliedPromoCode}</b> applied ({appliedDiscount}% OFF)</span>
                  </div>
                  <button type="button" onClick={handleClearPromo} className="clear-promo-btn" title="Remove promo">
                    <X size={13}/>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="promo-input-form">
                  <div className="promo-input-wrap">
                    <Tag size={13} className="promo-tag-icon"/>
                    <input 
                      type="text" 
                      placeholder={`Promo code (${targetPromo})`} 
                      value={promoInput}
                      onChange={e => setPromoInput(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="apply-promo-btn">
                    Apply
                  </button>
                </form>
              )}
              {promoMessage && (
                <small className={'promo-message ' + (appliedDiscount > 0 ? 'success' : 'error')}>
                  {promoMessage}
                </small>
              )}
            </div>

            {/* Cart Summary */}
            <div className="cart-summary">
              <div>
                <span>Subtotal</span>
                <b>${cartTotal.toFixed(2)}</b>
              </div>
              {appliedDiscount > 0 && (
                <div style={{ color: '#2b640e' }}>
                  <span>Promo Discount ({appliedDiscount}%)</span>
                  <b>-${discountAmount.toFixed(2)}</b>
                </div>
              )}
              <div>
                <span>Delivery</span>
                <b>{deliveryFee === 0 ? <span style={{ color: '#387813' }}>FREE</span> : `$${deliveryFee.toFixed(2)}`}</b>
              </div>
              <div className="grand-total">
                <span>Total</span>
                <b>${finalTotal.toFixed(2)}</b>
              </div>

              <button 
                className="btn btn-primary checkout-btn" 
                onClick={() => {
                  onClose();
                  onOpenCheckout();
                }}
              >
                Proceed to Checkout <ArrowRight size={17}/>
              </button>
              <small className="checkout-note">
                <ShieldCheck size={14}/> 100% Secure Checkout & Fresh Guarantee
              </small>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
