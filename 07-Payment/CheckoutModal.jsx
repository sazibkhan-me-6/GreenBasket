import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, CreditCard, Banknote, Smartphone, Truck, ArrowRight } from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose, cart, products, cartTotal, onOrderCompleted }) {
  const [step, setStep] = useState('form'); // 'form' or 'success'
  const [completedOrder, setCompletedOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [formData, setFormData] = useState({
    name: 'Sazib Ahmed',
    phone: '+880 1712-345678',
    address: 'House #24, Road #4, Dhanmondi, Dhaka',
    notes: 'Please call before delivery'
  });

  if (!isOpen) return null;

  const deliveryFee = cartTotal >= 49 ? 0 : 4.99;
  const grandTotal = cartTotal + deliveryFee;

  const getEffectivePrice = (p) => {
    if (p.discountPrice && Number(p.discountPrice) < Number(p.price)) {
      return Number(p.discountPrice);
    }
    return Number(p.price) || 0;
  };

  const cartItems = products.filter(p => cart[p.id]).map(p => ({
    id: p.id,
    name: p.name,
    price: getEffectivePrice(p),
    qty: cart[p.id],
    unit: p.unit
  }));

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const orderData = {
      items: cartItems,
      total: grandTotal.toFixed(2),
      customer: formData,
      paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : (paymentMethod === 'card' ? 'Credit/Debit Card' : 'Mobile Banking')
    };
    const order = onOrderCompleted(orderData);
    setCompletedOrder(order);
    setStep('success');
  };

  return (
    <div className="drawer-backdrop" onClick={onClose} style={{ zIndex: 70, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div 
        onClick={e => e.stopPropagation()} 
        style={{
          background: '#fcfdfa',
          color: '#1a3211',
          width: 'min(580px, calc(100% - 24px))',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '20px',
          padding: '28px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
          position: 'relative'
        }}
      >
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '18px', right: '18px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#687761' }}
          aria-label="Close"
        >
          <X size={20}/>
        </button>

        {step === 'form' ? (
          <div>
            <div style={{ borderBottom: '1px solid #e2e8da', paddingBottom: '14px', marginBottom: '20px' }}>
              <span style={{ fontSize: '10px', letterSpacing: '1px', color: '#56831d', fontWeight: 700 }}>CHECKOUT & PAYMENT</span>
              <h2 style={{ margin: '4px 0 0', fontFamily: 'Manrope, sans-serif', fontSize: '22px' }}>Complete Your Fresh Order</h2>
            </div>

            <form onSubmit={handlePlaceOrder}>
              {/* Customer Information */}
              <div style={{ marginBottom: '18px' }}>
                <h4 style={{ margin: '0 0 10px', fontSize: '13px', color: '#273f1d' }}>1. Shipping Details</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#4b5e43', marginBottom: '4px' }}>Recipient Name</label>
                    <input 
                      required 
                      type="text" 
                      value={formData.name} 
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      style={{ width: '100%', padding: '9px 11px', borderRadius: '8px', border: '1px solid #c8d6bf', fontSize: '12px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#4b5e43', marginBottom: '4px' }}>Phone Number</label>
                    <input 
                      required 
                      type="text" 
                      value={formData.phone} 
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      style={{ width: '100%', padding: '9px 11px', borderRadius: '8px', border: '1px solid #c8d6bf', fontSize: '12px' }}
                    />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#4b5e43', marginBottom: '4px' }}>Street / House Address</label>
                    <input 
                      required 
                      type="text" 
                      value={formData.address} 
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      style={{ width: '100%', padding: '9px 11px', borderRadius: '8px', border: '1px solid #c8d6bf', fontSize: '12px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 10px', fontSize: '13px', color: '#273f1d' }}>2. Payment Method</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  <button 
                    type="button" 
                    onClick={() => setPaymentMethod('cod')}
                    style={{ 
                      padding: '12px 10px', 
                      borderRadius: '12px', 
                      border: paymentMethod === 'cod' ? '2px solid #58921e' : '1px solid #d4dece',
                      background: paymentMethod === 'cod' ? '#eef7de' : '#ffffff',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <Banknote size={20} color="#3c6b14" style={{ margin: '0 auto 4px', display: 'block' }}/>
                    <b style={{ fontSize: '11px', display: 'block', color: '#1a3311' }}>Cash on Delivery</b>
                    <small style={{ fontSize: '9px', color: '#687d60' }}>Pay upon receipt</small>
                  </button>

                  <button 
                    type="button" 
                    onClick={() => setPaymentMethod('card')}
                    style={{ 
                      padding: '12px 10px', 
                      borderRadius: '12px', 
                      border: paymentMethod === 'card' ? '2px solid #58921e' : '1px solid #d4dece',
                      background: paymentMethod === 'card' ? '#eef7de' : '#ffffff',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <CreditCard size={20} color="#3c6b14" style={{ margin: '0 auto 4px', display: 'block' }}/>
                    <b style={{ fontSize: '11px', display: 'block', color: '#1a3311' }}>Credit / Debit Card</b>
                    <small style={{ fontSize: '9px', color: '#687d60' }}>Visa, MasterCard</small>
                  </button>

                  <button 
                    type="button" 
                    onClick={() => setPaymentMethod('mfs')}
                    style={{ 
                      padding: '12px 10px', 
                      borderRadius: '12px', 
                      border: paymentMethod === 'mfs' ? '2px solid #58921e' : '1px solid #d4dece',
                      background: paymentMethod === 'mfs' ? '#eef7de' : '#ffffff',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <Smartphone size={20} color="#3c6b14" style={{ margin: '0 auto 4px', display: 'block' }}/>
                    <b style={{ fontSize: '11px', display: 'block', color: '#1a3311' }}>Mobile Banking</b>
                    <small style={{ fontSize: '9px', color: '#687d60' }}>bKash / Nagad</small>
                  </button>
                </div>
              </div>

              {/* Order Items Preview */}
              <div style={{ background: '#f4f8ef', borderRadius: '12px', padding: '14px', marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                  <span>Items ({cartItems.length}):</span>
                  <b>${cartTotal.toFixed(2)}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                  <span>Delivery Fee:</span>
                  <b>{deliveryFee === 0 ? <span style={{ color: '#316911' }}>FREE</span> : `$${deliveryFee.toFixed(2)}`}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #d9e6d0', paddingTop: '8px', fontSize: '14px' }}>
                  <b style={{ color: '#17300c' }}>Grand Total:</b>
                  <b style={{ color: '#27570d', fontSize: '17px' }}>${grandTotal.toFixed(2)}</b>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '14px', gap: '8px' }}
              >
                Confirm & Place Order (${grandTotal.toFixed(2)}) <ArrowRight size={17}/>
              </button>
            </form>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0 10px' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#dcf1b5', color: '#386e11', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <CheckCircle2 size={36}/>
            </div>
            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '24px', margin: '0 0 8px', color: '#152e0a' }}>
              Thank You for Your Order!
            </h2>
            <p style={{ fontSize: '13px', color: '#5f7354', maxWidth: '380px', margin: '0 auto 18px' }}>
              Your order <b>#{completedOrder?.id}</b> has been received and is being prepared with 100% fresh, farm-picked produce.
            </p>

            <div style={{ background: '#f4f8ef', borderRadius: '12px', padding: '14px', textAlign: 'left', maxWidth: '420px', margin: '0 auto 20px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#687c5e' }}>Delivery To:</span>
                <b>{completedOrder?.customerName}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#687c5e' }}>Payment:</span>
                <b>{completedOrder?.paymentMethod}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#687c5e' }}>Total Amount:</span>
                <b style={{ color: '#2b5c0e', fontSize: '14px' }}>${Number(completedOrder?.total).toFixed(2)}</b>
              </div>
            </div>

            <button 
              className="btn btn-primary" 
              onClick={() => {
                setStep('form');
                onClose();
              }}
              style={{ padding: '11px 24px' }}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
