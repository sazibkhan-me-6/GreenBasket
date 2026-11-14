import React, { useState, useEffect } from 'react';
import {
  X, UserRound, Lock, Mail, ShieldCheck, LogOut, Phone, MapPin, Eye, EyeOff,
  ShoppingBag, Truck, Calendar, CheckCircle2, AlertTriangle, ArrowRight, XCircle, Search
} from 'lucide-react';
import { api } from '@api/api.js';

/* ── Floating label input ── */
function FloatingInput({ id, label, type = 'text', value, onChange, icon, required, rightSlot, fieldError }) {
  return (
    <div style={{ position: 'relative', marginBottom: fieldError ? '4px' : '0' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        border: `1.5px solid ${fieldError ? '#e53935' : value ? '#56831d' : '#d4dec8'}`,
        borderRadius: '10px', padding: '10px 12px', background: '#ffffff',
        transition: 'border-color 0.2s'
      }}>
        <span style={{ color: '#718367', flexShrink: 0 }}>{icon}</span>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            id={id}
            type={type}
            required={required}
            value={value}
            onChange={onChange}
            placeholder=" "
            style={{
              border: 'none', outline: 'none', width: '100%',
              fontSize: '13px', background: 'transparent', color: '#162e0c',
              paddingTop: value ? '10px' : '0',
              transition: 'padding-top 0.15s'
            }}
            autoComplete={
              type === 'password' ? 'current-password'
              : type === 'email' ? 'email'
              : type === 'tel' ? 'tel'
              : 'off'
            }
          />
          <label htmlFor={id} style={{
            position: 'absolute', left: 0,
            top: value ? '-8px' : '50%',
            transform: value ? 'none' : 'translateY(-50%)',
            fontSize: value ? '10px' : '13px',
            color: value ? '#56831d' : '#a0ab97',
            fontWeight: value ? 700 : 400,
            pointerEvents: 'none',
            transition: 'all 0.15s ease',
            lineHeight: 1,
            background: value ? '#ffffff' : 'transparent',
            padding: value ? '0 3px' : '0',
            marginLeft: value ? '-3px' : '0'
          }}>
            {label}
          </label>
        </div>
        {rightSlot}
      </div>
      {fieldError && (
        <p style={{ color: '#e53935', fontSize: '10px', margin: '3px 0 0 4px' }}>{fieldError}</p>
      )}
    </div>
  );
}

/* ── Password strength helper ── */
function getStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}
const STRENGTH_LABEL = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLOR = ['#ccc', '#e53935', '#fb8c00', '#fdd835', '#43a047'];

/* ══════════════════════════════════════════════════════════ */
export default function AuthModal({ isOpen, onClose, onLoginSuccess, currentUser, onLogout, onTrackOrder }) {
  const [tab, setTab] = useState('login'); // for guest: 'login' | 'register'
  const [activeProfileTab, setActiveProfileTab] = useState('orders'); // for logged-in: 'orders' | 'profile'
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [orderRefreshKey, setOrderRefreshKey] = useState(0);
  const [cancellingId, setCancellingId] = useState(null);

  if (!isOpen) return null;

  const strength = getStrength(password);

  // Retrieve user orders
  const getUserOrders = () => {
    if (!currentUser) return [];
    try {
      const allOrders = api.getOrders() || [];
      const userEmail = (currentUser.email || '').toLowerCase().trim();
      const userPhone = (currentUser.phone || '').trim();
      const userName = (currentUser.name || '').toLowerCase().trim();

      return allOrders.filter(o => {
        const oEmail = (o.customerEmail || o.email || (o.customer && o.customer.email) || '').toLowerCase().trim();
        const oPhone = (o.customerPhone || o.phone || (o.customer && o.customer.phone) || '').trim();
        const oName = (o.customerName || o.customer || '').toLowerCase().trim();

        if (userEmail && oEmail && oEmail === userEmail) return true;
        if (userPhone && oPhone && oPhone === userPhone) return true;
        if (userName && oName && oName === userName) return true;
        return false;
      });
    } catch {
      return [];
    }
  };

  const userOrders = getUserOrders();

  const handleCancelOrder = (orderId) => {
    if (!window.confirm(`আপনি কি সত্যিই অর্ডার #${orderId} বাতিল (Cancel) করতে চান?`)) return;
    setCancellingId(orderId);
    try {
      api.cancelOrder(orderId);
      setOrderRefreshKey(k => k + 1);
    } catch (e) {
      console.error(e);
    }
    setCancellingId(null);
  };

  const validate = () => {
    const errs = {};
    if (tab === 'register') {
      if (!name.trim()) errs.name = 'Full name is required.';
      if (!phone.trim()) errs.phone = 'Phone number is required.';
      if (strength < 2) errs.password = 'Password too weak (min 8 chars, mix letters & numbers).';
      if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    }
    if (!email.includes('@')) errs.email = 'Enter a valid email address.';
    if (!password) errs.password = errs.password || 'Password is required.';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); setError(''); return; }
    setError(''); setFieldErrors({});
    const extraData = tab === 'register'
      ? { name: name.trim(), phone: phone.trim(), address: address.trim(), isNew: true }
      : {};
    const res = onLoginSuccess(email, password, 'customer', extraData, tab);
    if (res && res.error) {
      setError(res.error);
      return;
    }
    onClose();
  };

  const switchTab = (t) => { setTab(t); setFieldErrors({}); setError(''); };

  // Status badge styling
  const getStatusBadge = (status) => {
    const s = (status || 'Processing').toLowerCase();
    if (s.includes('cancel')) {
      return { bg: '#fee2e2', color: '#b91c1c', border: '#fca5a5', text: 'Cancelled' };
    }
    if (s.includes('deliver')) {
      return { bg: '#dcfce7', color: '#15803d', border: '#86efac', text: 'Delivered' };
    }
    if (s.includes('ship') || s.includes('out')) {
      return { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', text: 'Out for Delivery' };
    }
    return { bg: '#fef3c7', color: '#b45309', border: '#fde68a', text: 'Processing' };
  };

  return (
    <div
      className="drawer-backdrop"
      onClick={onClose}
      style={{ zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div
        className="auth-modal"
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fcfdfa', color: '#1a3211',
          width: currentUser ? 'min(560px, calc(100% - 24px))' : 'min(440px, calc(100% - 32px))',
          borderRadius: '20px', padding: '24px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
          position: 'relative', maxHeight: '90vh', overflowY: 'auto'
        }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '18px', right: '18px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#687761' }}
          aria-label="Close"
        >
          <X size={20}/>
        </button>

        {currentUser ? (
          /* ── LOGGED-IN CUSTOMER DASHBOARD & ORDERS ── */
          <div>
            {/* Customer Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px', borderBottom: '1px solid #e7ede0', paddingBottom: '16px' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #e9f5d1 0%, #cde8a2 100%)',
                color: '#2a5310', display: 'grid', placeItems: 'center', flexShrink: 0
              }}>
                <UserRound size={26}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h2 style={{ margin: 0, fontFamily: 'Manrope, sans-serif', fontSize: '20px', color: '#162e0c' }}>
                    {currentUser.name}
                  </h2>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#284f10', background: '#dff1b8', padding: '2px 8px', borderRadius: '10px' }}>
                    Verified Customer
                  </span>
                </div>
                <small style={{ color: '#607256', fontSize: '12px' }}>{currentUser.email}</small>
              </div>
            </div>

            {/* Profile Navigation Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => setActiveProfileTab('orders')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '9px',
                  borderRadius: '10px',
                  border: 'none',
                  background: activeProfileTab === 'orders' ? '#2e5912' : '#edf3e3',
                  color: activeProfileTab === 'orders' ? '#ffffff' : '#334e24',
                  fontWeight: 700,
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                <ShoppingBag size={15}/> My Orders ({userOrders.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveProfileTab('profile')}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '9px',
                  borderRadius: '10px',
                  border: 'none',
                  background: activeProfileTab === 'profile' ? '#2e5912' : '#edf3e3',
                  color: activeProfileTab === 'profile' ? '#ffffff' : '#334e24',
                  fontWeight: 700,
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                <UserRound size={15}/> Profile Details
              </button>
            </div>

            {/* TAB 1: MY ORDERS & LIVE STATUS */}
            {activeProfileTab === 'orders' && (
              <div>
                {userOrders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '36px 16px', background: '#f6f9f1', borderRadius: '14px', border: '1px dashed #d1dec6' }}>
                    <ShoppingBag size={34} color="#8a9c7e" style={{ margin: '0 auto 8px' }} />
                    <b style={{ display: 'block', fontSize: '14px', color: '#273f1d' }}>আপনার কোনো অর্ডার পাওয়া যায়নি</b>
                    <p style={{ margin: '4px 0 14px', fontSize: '12px', color: '#687b5f' }}>
                      তাজা অর্গানিক শাকসবজি ও ফলমূল ব্রাউজ করে প্রথম অর্ডারটি দিন।
                    </p>
                    <button
                      type="button"
                      onClick={onClose}
                      style={{
                        background: '#305915', color: '#fff', border: 'none',
                        padding: '8px 18px', borderRadius: '8px', fontSize: '12px',
                        fontWeight: 700, cursor: 'pointer'
                      }}
                    >
                      Shop Fresh Now
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
                    {userOrders.map((o) => {
                      const badge = getStatusBadge(o.status);
                      const isCancelled = (o.status || '').toLowerCase() === 'cancelled';
                      const canCancel = !isCancelled && (o.status || 'Processing').toLowerCase() !== 'delivered';

                      return (
                        <div
                          key={o.id}
                          style={{
                            background: '#ffffff',
                            border: '1px solid #dbe5d4',
                            borderRadius: '14px',
                            padding: '14px 16px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                          }}
                        >
                          {/* Order Card Header */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <div>
                              <b style={{ fontSize: '13.5px', color: '#162e0c' }}>Order #{o.id}</b>
                              <span style={{ fontSize: '11px', color: '#66795c', display: 'block', marginTop: '1px' }}>
                                📅 {o.date || 'Recent Order'} • {o.paymentMethod || 'Cash on Delivery'}
                              </span>
                            </div>
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              background: badge.bg,
                              color: badge.color,
                              border: `1px solid ${badge.border}`,
                              padding: '3px 9px',
                              borderRadius: '20px'
                            }}>
                              ● {badge.text}
                            </span>
                          </div>

                          {/* Ordered Items List */}
                          <div style={{ background: '#f7faf2', borderRadius: '8px', padding: '9px 12px', marginBottom: '10px' }}>
                            <small style={{ display: 'block', fontSize: '10.5px', fontWeight: 700, color: '#4b613e', marginBottom: '5px' }}>
                              অর্ডারকৃত পণ্যসমূহ:
                            </small>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              {(Array.isArray(o.items) ? o.items : []).map((it, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#273e1c' }}>
                                  <span>{it.name || 'Organic Produce'} <b style={{ color: '#56831d' }}>× {it.qty || 1}</b></span>
                                  <b>${((Number(it.price) || 0) * (Number(it.qty) || 1)).toFixed(2)}</b>
                                </div>
                              ))}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e1ebda', marginTop: '6px', paddingTop: '6px', fontSize: '12.5px' }}>
                              <b>সর্বমোট পরিশোধযোগ্য:</b>
                              <b style={{ color: '#254e12', fontSize: '13.5px' }}>${Number(o.total || 0).toFixed(2)}</b>
                            </div>
                          </div>

                          {/* Order Delivery Location & Actions */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                            <div style={{ fontSize: '11px', color: '#5a6e4f', display: 'flex', alignItems: 'center', gap: '4px', flex: 1, minWidth: '160px' }}>
                              <MapPin size={13} color="#4d7c18" style={{ flexShrink: 0 }} />
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {o.address || o.deliveryAddress || 'Standard Delivery'}
                              </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              {/* Live Track Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  onClose();
                                  if (onTrackOrder) onTrackOrder(o.id);
                                }}
                                style={{
                                  background: '#edf7e4',
                                  border: '1px solid #bcdca8',
                                  color: '#2b5a11',
                                  padding: '5px 10px',
                                  borderRadius: '8px',
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                <Truck size={12} /> ট্র্যাক করুন
                              </button>

                              {/* Cancel Order Button */}
                              {canCancel && (
                                <button
                                  type="button"
                                  onClick={() => handleCancelOrder(o.id)}
                                  disabled={cancellingId === o.id}
                                  style={{
                                    background: '#fef2f2',
                                    border: '1px solid #fecaca',
                                    color: '#b91c1c',
                                    padding: '5px 10px',
                                    borderRadius: '8px',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}
                                  title="অর্ডার ক্যানসেল করতে ক্লিক করুন"
                                >
                                  <XCircle size={12} /> ক্যানসেল
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: PROFILE DETAILS */}
            {activeProfileTab === 'profile' && (
              <div>
                <div style={{ background: '#f4f7ee', padding: '16px', borderRadius: '14px', marginBottom: '18px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#67795d' }}>Full Name:</span>
                    <b style={{ color: '#162e0c' }}>{currentUser.name}</b>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#67795d' }}>Email Address:</span>
                    <b style={{ color: '#162e0c' }}>{currentUser.email}</b>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#67795d' }}>Phone Number:</span>
                    <b style={{ color: '#162e0c' }}>{currentUser.phone || 'Not set'}</b>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#67795d' }}>Delivery Address:</span>
                    <b style={{ color: '#162e0c', maxWidth: '60%', textAlign: 'right' }}>
                      {currentUser.address || 'Standard Delivery'}
                    </b>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e1e9d8', paddingTop: '8px' }}>
                    <span style={{ color: '#67795d' }}>Account Status:</span>
                    <span style={{ color: '#3f7215', fontWeight: 700 }}>Active Member ●</span>
                  </div>
                </div>
              </div>
            )}

            {/* Sign Out Action */}
            <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #e7ede0' }}>
              <button
                type="button"
                onClick={() => { if (onLogout) onLogout(); onClose(); }}
                style={{
                  width: '100%', padding: '10px', borderRadius: '10px',
                  border: '1px solid #f0cfcf', background: '#fff5f5',
                  color: '#9e2a2b', cursor: 'pointer', fontWeight: 700,
                  fontSize: '12.5px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: '6px'
                }}
              >
                <LogOut size={15}/> Sign Out from GreenBasket
              </button>
            </div>
          </div>
        ) : (
          /* ── GUEST AUTH FORM (LOGIN / REGISTER) ── */
          <>
            <div style={{ textAlign: 'center', marginBottom: '22px' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: '#e9f5d1', color: '#497c11', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                <UserRound size={24}/>
              </div>
              <h2 style={{ margin: '0 0 6px', fontFamily: 'Manrope, sans-serif', fontSize: '22px', color: '#162e0c' }}>
                {tab === 'login' ? 'Welcome Back!' : 'Create an Account'}
              </h2>
              <p style={{ margin: 0, fontSize: '13px', color: '#66775d' }}>
                {tab === 'login' ? 'Sign in to access your GreenBasket orders' : 'Join GreenBasket for fresh organic rewards'}
              </p>
            </div>

            {/* Tab switcher */}
            <div style={{ display: 'flex', background: '#edf3e3', padding: '4px', borderRadius: '12px', marginBottom: '18px' }}>
              {['login', 'register'].map(t => (
                <button key={t} type="button" onClick={() => switchTab(t)}
                  style={{
                    flex: 1, padding: '8px', borderRadius: '8px', border: 'none',
                    background: tab === t ? '#ffffff' : 'transparent',
                    fontWeight: 600, fontSize: '12px',
                    color: tab === t ? '#1c3411' : '#697b61',
                    boxShadow: tab === t ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                    cursor: 'pointer'
                  }}
                >
                  {t === 'login' ? 'Sign In' : 'New Account'}
                </button>
              ))}
            </div>

            {error && (
              <div style={{ background: '#fdf2f2', border: '1px solid #f8d7da', color: '#9e2a2b', padding: '9px 12px', borderRadius: '8px', fontSize: '12px', marginBottom: '14px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tab === 'register' && (
                <>
                  <FloatingInput id="auth-name" label="Full Name *" type="text"
                    value={name} onChange={e => setName(e.target.value)}
                    icon={<UserRound size={16}/>} required fieldError={fieldErrors.name} />
                  <FloatingInput id="auth-phone" label="Contact Phone *" type="tel"
                    value={phone} onChange={e => setPhone(e.target.value)}
                    icon={<Phone size={16}/>} required fieldError={fieldErrors.phone} />
                  <FloatingInput id="auth-address" label="Delivery Address" type="text"
                    value={address} onChange={e => setAddress(e.target.value)}
                    icon={<MapPin size={16}/>} fieldError={fieldErrors.address} />
                </>
              )}

              <FloatingInput id="auth-email" label="Email Address *" type="email"
                value={email} onChange={e => setEmail(e.target.value)}
                icon={<Mail size={16}/>} required fieldError={fieldErrors.email} />

              <FloatingInput id="auth-password" label="Password *"
                type={showPassword ? 'text' : 'password'}
                value={password} onChange={e => setPassword(e.target.value)}
                icon={<Lock size={16}/>} required fieldError={fieldErrors.password}
                rightSlot={
                  <button type="button" onClick={() => setShowPassword(p => !p)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#718367', padding: '0', display: 'flex' }}>
                    {showPassword ? <EyeOff size={15}/> : <Eye size={15}/>}
                  </button>
                }
              />

              {/* Password strength bar */}
              {tab === 'register' && password.length > 0 && (
                <div style={{ marginTop: '-6px' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '3px' }}>
                    {[1,2,3,4].map(i => (
                      <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: i <= strength ? STRENGTH_COLOR[strength] : '#e0e0e0', transition: 'background 0.2s' }}/>
                    ))}
                  </div>
                  <span style={{ fontSize: '10px', color: STRENGTH_COLOR[strength], fontWeight: 600 }}>{STRENGTH_LABEL[strength]}</span>
                </div>
              )}

              {/* Confirm password */}
              {tab === 'register' && (
                <FloatingInput id="auth-confirm" label="Confirm Password *"
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  icon={<ShieldCheck size={16}/>} required fieldError={fieldErrors.confirmPassword}
                  rightSlot={
                    <button type="button" onClick={() => setShowConfirm(p => !p)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#718367', padding: '0', display: 'flex' }}>
                      {showConfirm ? <EyeOff size={15}/> : <Eye size={15}/>}
                    </button>
                  }
                />
              )}

              <button type="submit" className="btn btn-primary"
                style={{ width: '100%', marginTop: '6px', padding: '12px', fontSize: '13px' }}>
                {tab === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: '11px', color: '#8a9880', marginTop: '16px', marginBottom: 0 }}>
              {tab === 'login' ? "Don't have an account? Click 'New Account' above." : "Already have an account? Click 'Sign In' above."}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
