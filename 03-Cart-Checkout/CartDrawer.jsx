import React, { useState } from 'react';
import { X, ShoppingCart, Plus, Minus, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  products,
  cartCount,
  cartTotal,
  onChangeQty,
  onOpenCheckout,
  storeSettings
}) {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');

  if (!isOpen) return null;

  const targetPromo = storeSettings?.promoCode ? storeSettings.promoCode.trim().toUpperCase() : 'GREEN20';
  const targetPct = Number(storeSettings?.promoDiscount) || 20;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === targetPromo) {
      setDiscountPercent(targetPct);
      setPromoMessage(`${targetPct}% discount applied! 🌱`);
    } else {
      setDiscountPercent(0);
      setPromoMessage(`Invalid code. Use "${targetPromo}" for ${targetPct}% off.`);
    }
  };

  const discountAmount = (cartTotal * discountPercent) / 100;
  const netSubtotal = Math.max(0, cartTotal - discountAmount);
  const deliveryFee = netSubtotal >= 49 || cartCount === 0 ? 0 : 4.99;
  const finalTotal = netSubtotal + deliveryFee;

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
            <ShoppingCart size={40}/>
            <h3>Your basket is empty</h3>
            <p>Discover something fresh today.</p>
            <button className="btn btn-primary" onClick={onClose}>
              Start Shopping <ArrowRight size={16}/>
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items List */}
            <div className="cart-items">
              {cartProductList.map(p => {
                const qty = cart[p.id];
                return (
                  <div className="cart-item" key={p.id}>
                    <img src={p.image} alt={p.name}/>
                    <div className="cart-item-info">
                      <b>{p.name}</b>
                      <small>
                        ${getItemPrice(p).toFixed(2)} each
                        {p.discountPrice && Number(p.discountPrice) < Number(p.price) && (
                          <span style={{ textDecoration: 'line-through', marginLeft: '5px', opacity: 0.6 }}>${Number(p.price).toFixed(2)}</span>
                        )}
                      </small>
                      <div className="qty-control">
                        <button
                          type="button"
                          onClick={() => onChangeQty(p.id, -1)}
                          title={qty === 1 ? 'Remove from basket' : 'Decrease by 1'}
                          aria-label="Decrease quantity"
                        >
                          {qty === 1 ? <X size={12}/> : <Minus size={12}/>}
                        </button>
                        <span>{qty}</span>
                        <button
                          type="button"
                          onClick={() => onChangeQty(p.id, 1)}
                          title="Increase quantity"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12}/>
                        </button>
                      </div>
                    </div>
                    <div className="cart-item-action-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                      <b className="item-total">${(getItemPrice(p) * qty).toFixed(2)}</b>
                      <button
                        type="button"
                        className="cart-remove-item-btn"
                        onClick={() => onChangeQty(p.id, -qty)}
                        title="Remove product from cart"
                        aria-label="Remove item"
                        style={{ background: 'none', border: 0, color: '#88987d', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
                      >
                        <X size={14}/>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '8px', padding: '10px 0 6px', borderTop: '1px solid #e2ebd8' }}>
              <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
                <Tag size={13} style={{ position: 'absolute', left: '10px', color: '#687b5f' }}/>
                <input 
                  type="text" 
                  placeholder="Promo code (GREEN20)" 
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px 8px 30px', fontSize: '12px', borderRadius: '8px', border: '1px solid #c9d8bd', background: '#ffffff', color: '#1a3311', outline: 'none' }}
                />
              </div>
              <button 
                type="submit" 
                style={{ padding: '8px 14px', fontSize: '11px', fontWeight: 700, borderRadius: '8px', border: 'none', background: '#305915', color: '#f3fbe9', cursor: 'pointer' }}
              >
                Apply
              </button>
            </form>
            {promoMessage && (
              <small style={{ color: discountPercent > 0 ? '#306911' : '#a12b2b', fontSize: '11px', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                {promoMessage}
              </small>
            )}

            {/* Cart Summary */}
            <div className="cart-summary">
              <div>
                <span>Subtotal</span>
                <b>${cartTotal.toFixed(2)}</b>
              </div>
              {discountPercent > 0 && (
                <div style={{ color: '#2b640e' }}>
                  <span>Promo Discount (20%)</span>
                  <b>-${discountAmount.toFixed(2)}</b>
                </div>
              )}
              <div>
                <span>Delivery</span>
                <b>{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</b>
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
                <ShieldCheck size={14}/> Secure checkout
              </small>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
