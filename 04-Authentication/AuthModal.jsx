import React, { useState } from 'react';
import { X, UserRound, Lock, Mail, ShieldCheck, CheckCircle2, LogOut, Phone, MapPin } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, currentUser, onLogout }) {
  const [tab, setTab] = useState('login'); // 'login' or 'register'
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }
    if (tab === 'register' && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    setError('');
    const extraData = tab === 'register' ? { name: name.trim(), phone: phone.trim(), address: address.trim(), isNew: true } : {};
    onLoginSuccess(email, password, 'customer', extraData);
    onClose();
  };

  const handleQuickDemo = () => {
    onLoginSuccess('customer@freshlife.org', 'password123', 'customer');
    onClose();
  };

  return (
    <div className="drawer-backdrop" onClick={onClose} style={{ zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div 
        className="auth-modal" 
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fcfdfa',
          color: '#1a3211',
          width: 'min(440px, calc(100% - 32px))',
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

        {currentUser ? (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '22px' }}>
              <div style={{ 
                width: '54px', 
                height: '54px', 
                borderRadius: '50%', 
                background: '#e9f5d1', 
                color: '#3d6c15', 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginBottom: '10px' 
              }}>
                <UserRound size={28}/>
              </div>
              <h2 style={{ margin: '0 0 6px', fontFamily: 'Manrope, sans-serif', fontSize: '22px', color: '#162e0c' }}>
                {currentUser.name}
              </h2>
              <span style={{ 
                display: 'inline-block',
                fontSize: '11px', 
                fontWeight: 700, 
                color: '#284f10', 
                background: '#dff1b8', 
                padding: '3px 10px', 
                borderRadius: '12px'
              }}>
                Verified Customer
              </span>
            </div>

            <div style={{ background: '#f4f7ee', padding: '14px', borderRadius: '12px', marginBottom: '18px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#67795d' }}>Email:</span>
                <b>{currentUser.email}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#67795d' }}>Membership:</span>
                <span style={{ color: '#3f7215', fontWeight: 600 }}>Active Member</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={() => {
                if (onLogout) onLogout();
                onClose();
              }}
              style={{ 
                width: '100%', 
                padding: '11px', 
                borderRadius: '12px', 
                border: '1px solid #d4deca', 
                background: '#ffffff', 
                color: '#9e2a2b', 
                cursor: 'pointer', 
                fontWeight: 600,
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <LogOut size={15}/> Sign Out
            </button>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '22px' }}>
              <div style={{ 
                width: '46px', 
                height: '46px', 
                borderRadius: '50%', 
                background: '#e9f5d1', 
                color: '#497c11', 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginBottom: '10px' 
              }}>
                <UserRound size={24}/>
              </div>
              <h2 style={{ margin: '0 0 6px', fontFamily: 'Manrope, sans-serif', fontSize: '22px', color: '#162e0c' }}>
                {tab === 'login' ? 'Welcome Back!' : 'Create an Account'}
              </h2>
              <p style={{ margin: 0, fontSize: '13px', color: '#66775d' }}>
                {tab === 'login' ? 'Sign in to access your GreenBasket orders' : 'Join GreenBasket for fresh organic rewards'}
              </p>
            </div>

            {/* Toggle Tabs */}
            <div style={{ display: 'flex', background: '#edf3e3', padding: '4px', borderRadius: '12px', marginBottom: '18px' }}>
              <button 
                type="button"
                onClick={() => setTab('login')} 
                style={{ 
                  flex: 1, 
                  padding: '8px', 
                  borderRadius: '8px', 
                  border: 'none', 
                  background: tab === 'login' ? '#ffffff' : 'transparent', 
                  fontWeight: 600, 
                  fontSize: '12px',
                  color: tab === 'login' ? '#1c3411' : '#697b61',
                  boxShadow: tab === 'login' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer' 
                }}
              >
                Sign In
              </button>
              <button 
                type="button"
                onClick={() => setTab('register')} 
                style={{ 
                  flex: 1, 
                  padding: '8px', 
                  borderRadius: '8px', 
                  border: 'none', 
                  background: tab === 'register' ? '#ffffff' : 'transparent', 
                  fontWeight: 600, 
                  fontSize: '12px',
                  color: tab === 'register' ? '#1c3411' : '#697b61',
                  boxShadow: tab === 'register' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer' 
                }}
              >
                New Account
              </button>
            </div>

            {error && (
              <div style={{ background: '#fdf2f2', border: '1px solid #f8d7da', color: '#9e2a2b', padding: '9px 12px', borderRadius: '8px', fontSize: '12px', marginBottom: '14px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {tab === 'register' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#3b4e31', marginBottom: '5px' }}>Full Name *</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #d4dec8', borderRadius: '10px', padding: '10px 12px', background: '#ffffff' }}>
                      <UserRound size={16} color="#718367"/>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. Sazib Ahmed" 
                        value={name} 
                        onChange={e => setName(e.target.value)}
                        style={{ border: 'none', outline: 'none', width: '100%', fontSize: '13px', background: 'transparent', color: '#162e0c' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#3b4e31', marginBottom: '5px' }}>Contact Phone *</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #d4dec8', borderRadius: '10px', padding: '10px 12px', background: '#ffffff' }}>
                      <Phone size={16} color="#718367"/>
                      <input 
                        type="tel" 
                        required 
                        placeholder="+880 1712-345678" 
                        value={phone} 
                        onChange={e => setPhone(e.target.value)}
                        style={{ border: 'none', outline: 'none', width: '100%', fontSize: '13px', background: 'transparent', color: '#162e0c' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#3b4e31', marginBottom: '5px' }}>Delivery Address</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #d4dec8', borderRadius: '10px', padding: '10px 12px', background: '#ffffff' }}>
                      <MapPin size={16} color="#718367"/>
                      <input 
                        type="text" 
                        placeholder="House #, Road #, Area, City" 
                        value={address} 
                        onChange={e => setAddress(e.target.value)}
                        style={{ border: 'none', outline: 'none', width: '100%', fontSize: '13px', background: 'transparent', color: '#162e0c' }}
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#3b4e31', marginBottom: '5px' }}>Email Address *</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #d4dec8', borderRadius: '10px', padding: '10px 12px', background: '#ffffff' }}>
                  <Mail size={16} color="#718367"/>
                  <input 
                    type="email" 
                    required 
                    placeholder="name@example.com" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    style={{ border: 'none', outline: 'none', width: '100%', fontSize: '13px', background: 'transparent', color: '#162e0c' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#3b4e31', marginBottom: '5px' }}>Password</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #d4dec8', borderRadius: '10px', padding: '10px 12px', background: '#ffffff' }}>
                  <Lock size={16} color="#718367"/>
                  <input 
                    type="password" 
                    required 
                    placeholder="••••••••" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    style={{ border: 'none', outline: 'none', width: '100%', fontSize: '13px', background: 'transparent', color: '#162e0c' }}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '6px', padding: '12px', fontSize: '13px' }}
              >
                {tab === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            {/* Quick Demo Login */}
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e7ede0', textAlign: 'center' }}>
              <button 
                type="button" 
                onClick={handleQuickDemo}
                style={{ width: '100%', padding: '8px 12px', fontSize: '12px', borderRadius: '8px', border: '1px solid #d0dcc5', background: '#f3f6ee', color: '#28411b', cursor: 'pointer', fontWeight: 600 }}
              >
                1-Click Demo Customer Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
