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
  onOpenCheckout
}) {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');

  if (!isOpen) return null;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'GREEN20') {
      setDiscountPercent(20);
      setPromoMessage('20% discount applied! 🌱');
    } else {
      setDiscountPercent(0);
      setPromoMessage('Invalid promo code. Try "GREEN20"');
    }
  };

  const discountAmount = (cartTotal * discountPercent) / 100;
  const netSubtotal = Math.max(0, cartTotal - discountAmount);
  const deliveryFee = netSubtotal >= 49 || cartCount === 0 ? 0 : 4.99;
  const finalTotal = netSubtotal + deliveryFee;

  const cartProductList = products.filter(p => cart[p.id]);

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside className="cart-drawer" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-heading">
          <h2>Your Basket <span>({cartCount} items)</span></h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close basket">
            <X size={22}/>
          </button>
        </div>

        {/* Content */}
        {cartCount === 0 ? (
          <div className="cart-empty">
            <ShoppingCart size={44}/>
            <h3>Your basket is empty</h3>
            <p>Discover fresh, organic farm produce and start adding to your basket.</p>
            <button className="btn btn-primary" onClick={onClose} style={{ marginTop: '12px' }}>
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
                      <small>${p.price.toFixed(2)} / {p.unit.split(' / ')[0]}</small>
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
                    <b className="item-total">${(p.price * qty).toFixed(2)}</b>
                  </div>
                );
              })}
            </div>

            {/* Promo Code Box */}
            <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '6px', margin: '10px 0 5px' }}>
              <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
                <Tag size={13} style={{ position: 'absolute', left: '10px', color: '#6e8065' }}/>
                <input 
                  type="text" 
                  placeholder="Promo code (GREEN20)" 
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                  style={{ width: '100%', padding: '7px 8px 7px 30px', fontSize: '11px', borderRadius: '8px', border: '1px solid #d4decb', background: '#fff' }}
                />
              </div>
              <button 
                type="submit" 
                style={{ padding: '7px 12px', fontSize: '11px', fontWeight: 600, borderRadius: '8px', border: 'none', background: '#396317', color: '#fff', cursor: 'pointer' }}
              >
                Apply
              </button>
            </form>
            {promoMessage && (
              <small style={{ color: discountPercent > 0 ? '#34720e' : '#a82a2a', fontSize: '10px', marginBottom: '8px', display: 'block' }}>
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
                <div style={{ color: '#2f6c0d' }}>
                  <span>Discount (20%)</span>
                  <b>-${discountAmount.toFixed(2)}</b>
                </div>
              )}
              <div>
                <span>Delivery</span>
                <b>{deliveryFee === 0 ? <span style={{ color: '#387311' }}>FREE</span> : `$${deliveryFee.toFixed(2)}`}</b>
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
                <ShieldCheck size={14}/> 100% Secure Checkout Guaranteed
              </small>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
