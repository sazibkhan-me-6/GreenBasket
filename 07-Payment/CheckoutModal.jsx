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
  const cartItems = products.filter(p => cart[p.id]).map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
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
                      style={{ width: '100%', padding: '9px 11px', border: '1px solid #d1dcc7', borderRadius: '8px', fontSize: '12px', background: '#fff' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#4b5e43', marginBottom: '4px' }}>Phone Number</label>
                    <input 
                      required 
                      type="text" 
                      value={formData.phone} 
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      style={{ width: '100%', padding: '9px 11px', border: '1px solid #d1dcc7', borderRadius: '8px', fontSize: '12px', background: '#fff' }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '10px' }}>
                  <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: '#4b5e43', marginBottom: '4px' }}>Delivery Address</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.address} 
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    style={{ width: '100%', padding: '9px 11px', border: '1px solid #d1dcc7', borderRadius: '8px', fontSize: '12px', background: '#fff' }}
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div style={{ marginBottom: '18px' }}>
                <h4 style={{ margin: '0 0 10px', fontSize: '13px', color: '#273f1d' }}>2. Payment Method</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  <div 
                    onClick={() => setPaymentMethod('cod')}
                    style={{
                      border: paymentMethod === 'cod' ? '2px solid #7cb52a' : '1px solid #d1dcc7',
                      background: paymentMethod === 'cod' ? '#f0f8e3' : '#fff',
                      borderRadius: '10px',
                      padding: '12px 10px',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <Banknote size={22} color="#457019" style={{ margin: '0 auto 6px' }}/>
                    <b style={{ display: 'block', fontSize: '11px' }}>Cash on Delivery</b>
                    <small style={{ fontSize: '9px', color: '#687761' }}>Pay upon receipt</small>
                  </div>

                  <div 
                    onClick={() => setPaymentMethod('card')}
                    style={{
                      border: paymentMethod === 'card' ? '2px solid #7cb52a' : '1px solid #d1dcc7',
                      background: paymentMethod === 'card' ? '#f0f8e3' : '#fff',
                      borderRadius: '10px',
                      padding: '12px 10px',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <CreditCard size={22} color="#457019" style={{ margin: '0 auto 6px' }}/>
                    <b style={{ display: 'block', fontSize: '11px' }}>Debit / Credit Card</b>
                    <small style={{ fontSize: '9px', color: '#687761' }}>Visa, MC, Amex</small>
                  </div>

                  <div 
                    onClick={() => setPaymentMethod('mobile')}
                    style={{
                      border: paymentMethod === 'mobile' ? '2px solid #7cb52a' : '1px solid #d1dcc7',
                      background: paymentMethod === 'mobile' ? '#f0f8e3' : '#fff',
                      borderRadius: '10px',
                      padding: '12px 10px',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <Smartphone size={22} color="#457019" style={{ margin: '0 auto 6px' }}/>
                    <b style={{ display: 'block', fontSize: '11px' }}>Mobile Banking</b>
                    <small style={{ fontSize: '9px', color: '#687761' }}>bKash / Nagad</small>
                  </div>
                </div>
              </div>

              {/* Order summary breakdown */}
              <div style={{ background: '#f2f6ec', borderRadius: '12px', padding: '14px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                  <span style={{ color: '#55664d' }}>Basket items ({cartItems.reduce((acc, i) => acc + i.qty, 0)})</span>
                  <b>${cartTotal.toFixed(2)}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
                  <span style={{ color: '#55664d' }}>Estimated Delivery</span>
                  <b>{deliveryFee === 0 ? <span style={{ color: '#3f7c12' }}>FREE</span> : `$${deliveryFee.toFixed(2)}`}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #d6e2cb', paddingTop: '8px', fontSize: '15px' }}>
                  <b>Total to Pay</b>
                  <b style={{ color: '#264a13' }}>${grandTotal.toFixed(2)}</b>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ width: '100%', padding: '13px', fontSize: '14px', fontWeight: 700 }}
              >
                Confirm & Place Order <ArrowRight size={17}/>
              </button>
            </form>
          </div>
        ) : (
          /* Order Confirmation View */
          <div style={{ textAlign: 'center', padding: '15px 10px' }}>
            <div style={{ 
              width: '56px', 
              height: '56px', 
              borderRadius: '50%', 
              background: '#e3f5cb', 
              color: '#3e7a11', 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginBottom: '14px' 
            }}>
              <CheckCircle2 size={32}/>
            </div>
            <h2 style={{ margin: '0 0 6px', fontFamily: 'Manrope, sans-serif', fontSize: '24px', color: '#16310d' }}>
              Order Placed Successfully!
            </h2>
            <p style={{ margin: '0 0 16px', color: '#5c7052', fontSize: '13px' }}>
              Thank you, <b>{completedOrder?.customerName}</b>. Your fresh produce order has been received and is being prepared!
            </p>

            <div style={{ background: '#f3f6ee', borderRadius: '14px', padding: '16px', textAlign: 'left', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                <span style={{ color: '#68795f' }}>Order ID:</span>
                <b>{completedOrder?.id}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                <span style={{ color: '#68795f' }}>Total Amount:</span>
                <b>${completedOrder?.total}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                <span style={{ color: '#68795f' }}>Payment:</span>
                <b>{completedOrder?.paymentMethod}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#68795f' }}>Status:</span>
                <span style={{ color: '#27690f', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Truck size={13}/> Out for Preparation
                </span>
              </div>
            </div>

            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={onClose}
              style={{ width: '100%', padding: '12px' }}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
