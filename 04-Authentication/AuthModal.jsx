import React, { useState } from 'react';
import { X, UserRound, Lock, Mail, ShieldCheck, LogOut, Phone, MapPin, Eye, EyeOff } from 'lucide-react';

/* ── Floating label input — defined OUTSIDE to prevent remount on every keystroke ── */
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
export default function AuthModal({ isOpen, onClose, onLoginSuccess, currentUser, onLogout }) {
  const [tab, setTab] = useState('login');
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

  if (!isOpen) return null;

  const strength = getStrength(password);

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
          width: 'min(440px, calc(100% - 32px))',
          borderRadius: '20px', padding: '28px',
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
          /* ── Logged-in view ── */
          <div>
            <div style={{ textAlign: 'center', marginBottom: '22px' }}>
              <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: '#e9f5d1', color: '#3d6c15', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                <UserRound size={28}/>
              </div>
              <h2 style={{ margin: '0 0 6px', fontFamily: 'Manrope, sans-serif', fontSize: '22px', color: '#162e0c' }}>{currentUser.name}</h2>
              <span style={{ display: 'inline-block', fontSize: '11px', fontWeight: 700, color: '#284f10', background: '#dff1b8', padding: '3px 10px', borderRadius: '12px' }}>
                Verified Customer
              </span>
            </div>
            <div style={{ background: '#f4f7ee', padding: '14px', borderRadius: '12px', marginBottom: '18px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#67795d' }}>Email:</span><b>{currentUser.email}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#67795d' }}>Membership:</span>
                <span style={{ color: '#3f7215', fontWeight: 600 }}>Active Member</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { if (onLogout) onLogout(); onClose(); }}
              style={{ width: '100%', padding: '11px', borderRadius: '12px', border: '1px solid #d4deca', background: '#ffffff', color: '#9e2a2b', cursor: 'pointer', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <LogOut size={15}/> Sign Out
            </button>
          </div>
        ) : (
          /* ── Auth form ── */
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
