import React, { useState } from 'react';
import { X, UserRound, Lock, Mail, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [tab, setTab] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }
    setError('');
    onLoginSuccess(email, password, role);
    onClose();
  };

  const handleQuickDemo = (demoRole) => {
    const demoEmail = demoRole === 'admin' ? 'admin@greenbasket.com' : 'customer@freshlife.org';
    onLoginSuccess(demoEmail, 'password123', demoRole);
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
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
          position: 'relative',
          animation: 'slidein 0.2s ease-out'
        }}
      >
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '18px', right: '18px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#687761' }}
          aria-label="Close"
        >
          <X size={20}/>
        </button>

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

        {/* Tab Switcher */}
        <div style={{ display: 'flex', background: '#ecf0e4', borderRadius: '12px', padding: '4px', marginBottom: '18px' }}>
          <button 
            type="button" 
            onClick={() => { setTab('login'); setError(''); }}
            style={{ 
              flex: 1, 
              border: 'none', 
              borderRadius: '9px', 
              padding: '8px', 
              fontWeight: 600, 
              fontSize: '12px', 
              cursor: 'pointer', 
              background: tab === 'login' ? '#ffffff' : 'transparent',
              color: tab === 'login' ? '#1c3411' : '#68795f',
              boxShadow: tab === 'login' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            Sign In
          </button>
          <button 
            type="button" 
            onClick={() => { setTab('register'); setError(''); }}
            style={{ 
              flex: 1, 
              border: 'none', 
              borderRadius: '9px', 
              padding: '8px', 
              fontWeight: 600, 
              fontSize: '12px', 
              cursor: 'pointer', 
              background: tab === 'register' ? '#ffffff' : 'transparent',
              color: tab === 'register' ? '#1c3411' : '#68795f',
              boxShadow: tab === 'register' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            Register
          </button>
        </div>

        {error && (
          <div style={{ background: '#fde8e8', color: '#991b1b', padding: '9px 12px', borderRadius: '8px', fontSize: '12px', marginBottom: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#3b4e31', marginBottom: '5px' }}>Email Address</label>
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

          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#3b4e31', marginBottom: '5px' }}>Account Role</label>
            <select 
              value={role} 
              onChange={e => setRole(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #d4dec8', fontSize: '13px', background: '#ffffff', color: '#162e0c' }}
            >
              <option value="customer">Regular Customer</option>
              <option value="admin">Store Admin (Access Admin Dashboard)</option>
            </select>
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
          <span style={{ fontSize: '11px', color: '#7a8c72', fontWeight: 600 }}>Quick One-Click Demo:</span>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button 
              type="button" 
              onClick={() => handleQuickDemo('customer')}
              style={{ flex: 1, padding: '7px 10px', fontSize: '11px', borderRadius: '8px', border: '1px solid #d0dcc5', background: '#f3f6ee', color: '#28411b', cursor: 'pointer', fontWeight: 600 }}
            >
              Customer Demo
            </button>
            <button 
              type="button" 
              onClick={() => handleQuickDemo('admin')}
              style={{ flex: 1, padding: '7px 10px', fontSize: '11px', borderRadius: '8px', border: '1px solid #a3c948', background: '#eaf4cf', color: '#2b4d13', cursor: 'pointer', fontWeight: 700 }}
            >
              Admin Demo ✦
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
