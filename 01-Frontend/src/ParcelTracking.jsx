import React, { useState, useEffect, useMemo } from 'react';
import {
  Truck, Package, MapPin, Clock, Phone, CheckCircle2, Search,
  Calendar, ShieldCheck, User, AlertCircle, ArrowRight, Copy, Check,
  Sparkles, RefreshCw, ExternalLink
} from 'lucide-react';
import { api } from '@api/api.js';

export default function ParcelTracking({ onShopNow, initialOrderId }) {
  const [searchInput, setSearchInput] = useState(initialOrderId || '');
  const [activeOrder, setActiveOrder] = useState(null);
  const [searchedQuery, setSearchedQuery] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fallback demo orders to ensure anyone can test public tracking instantly
  const demoOrders = useMemo(() => [
    {
      id: 'GB-2026',
      customerName: 'Sazib Khan',
      customerPhone: '+880 1712-345678',
      address: 'House 42, Road 11, Dhanmondi, Dhaka',
      date: 'Today, 10:15 AM',
      status: 'Out for Delivery',
      eta: 'Today within 40 minutes (approx. 02:45 PM)',
      total: 18.50,
      paymentMethod: 'Cash on Delivery',
      currentStep: 4,
      rider: {
        name: 'Rahim Mia',
        phone: '+880 1812-987654',
        vehicle: 'Eco Electric Van #08',
        rating: 4.9,
        liveLocation: 'Mirpur Road, 1.8 km from delivery address'
      },
      items: [
        { name: 'Organic Fresh Broccoli', qty: 2, price: 3.49, unit: '1 head' },
        { name: 'Crisp Royal Gala Apples', qty: 1, price: 4.99, unit: '1 kg' },
        { name: 'Fresh Farm Free-Range Eggs', qty: 1, price: 6.53, unit: '1 dozen' }
      ],
      timeline: [
        { title: 'Order Confirmed', time: '10:15 AM', desc: 'Order placed & payment verified.', done: true },
        { title: 'Farm Harvested & Inspected', time: '11:30 AM', desc: 'Freshly harvested from GreenValley Organic Farm. Quality score: 100%.', done: true },
        { title: 'Packed in Eco Basket', time: '01:10 PM', desc: 'Carefully packed in temperature-controlled biodegradable box.', done: true },
        { title: 'Out for Delivery', time: '02:00 PM', desc: 'Assigned to Eco Rider Rahim Mia. In transit to your address.', done: true, current: true },
        { title: 'Delivered to Doorstep', time: 'Est. 02:45 PM', desc: 'Delivery confirmation & contactless handover.', done: false }
      ]
    },
    {
      id: 'GB-1003',
      customerName: 'Tanzina Akter',
      customerPhone: '+880 1911-234890',
      address: 'Plot 15, Sector 4, Uttara, Dhaka',
      date: 'Today, 11:20 AM',
      status: 'Shipped',
      eta: 'In transit - Estimated delivery today by 4:00 PM',
      total: 12.80,
      paymentMethod: 'Credit Card (Paid)',
      currentStep: 4,
      rider: {
        name: 'Mehedi Hasan',
        phone: '+880 1733-556677',
        vehicle: 'GreenBasket Cargo Van #02',
        rating: 4.88,
        liveLocation: 'Departed Central Fulfillment Hub towards Uttara'
      },
      items: [
        { name: 'Whole Grain Sourdough Bread', qty: 1, price: 4.50, unit: '1 loaf' },
        { name: 'Organic Vine Farm Tomatoes', qty: 2, price: 4.15, unit: '1 kg' }
      ],
      timeline: [
        { title: 'Order Confirmed', time: '11:20 AM', desc: 'Online payment authorized.', done: true },
        { title: 'Farm Harvested & Inspected', time: '12:05 PM', desc: 'Harvested fresh and packed with ice gels.', done: true },
        { title: 'Packed in Eco Basket', time: '01:00 PM', desc: 'Dispatched to delivery staging dock.', done: true },
        { title: 'Shipped & Out for Delivery', time: '01:45 PM', desc: 'Van #02 in transit towards destination.', done: true, current: true },
        { title: 'Delivered to Doorstep', time: 'Est. 04:00 PM', desc: 'Handover at doorstep.', done: false }
      ]
    },
    {
      id: 'GB-1001',
      customerName: 'Sarah Ahmed',
      customerPhone: '+880 1712-345678',
      address: 'House 24, Road 7, Dhanmondi, Dhaka',
      date: 'Yesterday, 02:32 PM',
      status: 'Delivered',
      eta: 'Delivered successfully yesterday at 04:15 PM',
      total: 24.50,
      paymentMethod: 'bKash (Verified)',
      currentStep: 5,
      rider: {
        name: 'Karim Ahmed',
        phone: '+880 1711-223344',
        vehicle: 'GreenBasket Bike #12',
        rating: 5.0,
        liveLocation: 'Package delivered & signature confirmed'
      },
      items: [
        { name: 'Organic Avocados', qty: 2, price: 4.99, unit: '2 pcs' },
        { name: 'Farm Fresh Organic Milk', qty: 1, price: 3.50, unit: '1 liter' },
        { name: 'Fresh Farm Free-Range Eggs', qty: 1, price: 6.53, unit: '1 dozen' }
      ],
      timeline: [
        { title: 'Order Confirmed', time: 'Yesterday 02:32 PM', desc: 'Order verified & payment processed.', done: true },
        { title: 'Farm Harvested & Inspected', time: 'Yesterday 03:00 PM', desc: 'Inspected for 100% certified pesticide-free grade.', done: true },
        { title: 'Packed in Eco Basket', time: 'Yesterday 03:25 PM', desc: 'Packed in insulated eco-friendly packaging.', done: true },
        { title: 'Out for Delivery', time: 'Yesterday 03:45 PM', desc: 'Dispatched with Eco Rider Karim Ahmed.', done: true },
        { title: 'Delivered to Doorstep', time: 'Yesterday 04:15 PM', desc: 'Handed to Sarah Ahmed. Signed & confirmed.', done: true, current: false }
      ]
    }
  ], []);

  // Fetch all orders from localStorage / database across storefront and admin
  const getCombinedOrders = () => {
    try {
      const storedGb = api.getOrders() || [];
      let storedAdmin = [];
      try {
        const rawAdmin = localStorage.getItem('greenbasket_orders');
        if (rawAdmin) {
          const parsed = JSON.parse(rawAdmin);
          if (Array.isArray(parsed)) storedAdmin = parsed;
        }
      } catch (e) {}

      const allStored = [...storedGb, ...storedAdmin];
      const storedFormatted = allStored.map(o => {
        // If matches a demo order with richer timeline, preserve demo richness
        const demoMatch = demoOrders.find(d => d.id.toLowerCase() === (o.id || '').toLowerCase());
        if (demoMatch && !o.status) return demoMatch;

        const rawStatus = o.status || 'Processing';
        let currentStep = 1;
        if (rawStatus === 'Harvested') currentStep = 2;
        if (rawStatus === 'Packed') currentStep = 3;
        if (rawStatus === 'Out for Delivery' || rawStatus === 'Shipped') currentStep = 4;
        if (rawStatus === 'Delivered') currentStep = 5;

        // Parse items if string
        let formattedItems = [];
        if (Array.isArray(o.items)) {
          formattedItems = o.items;
        } else if (typeof o.items === 'string') {
          formattedItems = o.items.split(',').map(s => {
            const cleanName = s.trim();
            return { name: cleanName, qty: 1, price: (Number(o.total) || 10) / Math.max(1, o.items.split(',').length), unit: '1 pack' };
          });
        } else {
          formattedItems = [{ name: 'Fresh Organic Produce Pack', qty: 1, price: o.total || 15.00, unit: '1 pack' }];
        }

        return {
          id: o.id,
          customerName: o.customerName || o.customer || 'Valued Customer',
          customerPhone: o.customerPhone || 'N/A',
          address: o.address || 'Standard Delivery Address',
          date: o.date || 'Today',
          status: rawStatus,
          eta: rawStatus === 'Delivered'
            ? 'Delivered successfully'
            : (rawStatus === 'Shipped' || rawStatus === 'Out for Delivery'
              ? 'Out for delivery - Estimated today within 1 hour'
              : 'Estimated delivery: Today within 2-4 hours'),
          total: Number(o.total || 0),
          paymentMethod: o.paymentMethod || 'Cash on Delivery',
          currentStep: currentStep,
          rider: {
            name: o.riderName || 'Rahim Mia',
            phone: o.riderPhone || '+880 1812-987654',
            vehicle: 'GreenBasket Eco Van #08',
            rating: 4.92,
            liveLocation: rawStatus === 'Delivered' ? 'Delivery completed' : 'Mirpur Road to Destination (approx. 2.1 km away)'
          },
          items: formattedItems,
          timeline: [
            { title: 'Order Confirmed', time: o.date || 'Today 10:00 AM', desc: 'Order received and payment verified.', done: currentStep >= 1, current: currentStep === 1 },
            { title: 'Farm Harvested & Inspected', time: '11:00 AM', desc: 'Harvested from certified organic farm.', done: currentStep >= 2, current: currentStep === 2 },
            { title: 'Packed in Eco Basket', time: '12:30 PM', desc: 'Sealed in insulated biodegradable packaging.', done: currentStep >= 3, current: currentStep === 3 },
            { title: 'Out for Delivery', time: '01:45 PM', desc: 'Assigned to courier for immediate delivery.', done: currentStep >= 4, current: currentStep === 4 },
            { title: 'Delivered to Doorstep', time: rawStatus === 'Delivered' ? 'Delivered' : 'Est. Today', desc: 'Handover at doorstep with signature confirmation.', done: currentStep >= 5, current: currentStep === 5 }
          ]
        };
      });

      // Combine demo orders with user stored orders (avoiding duplicate IDs)
      const existingIds = new Set(storedFormatted.map(o => o.id.toLowerCase()));
      const extraDemo = demoOrders.filter(d => !existingIds.has(d.id.toLowerCase()));
      return [...storedFormatted, ...extraDemo];
    } catch {
      return demoOrders;
    }
  };

  const handleSearch = (query) => {
    const raw = (query !== undefined ? query : searchInput).trim();
    if (!raw) return;

    setSearchedQuery(raw);
    const clean = raw.toLowerCase().replace('#', '').replace(/\s+/g, '');
    const all = getCombinedOrders();

    const found = all.find(o => {
      const oId = (o.id || '').toLowerCase().replace('#', '').replace(/\s+/g, '');
      const oPhone = (o.customerPhone || '').replace(/[^0-9]/g, '');
      const cleanPhone = clean.replace(/[^0-9]/g, '');
      const oName = (o.customerName || '').toLowerCase();

      return oId === clean ||
             oId.replace('gb-', '') === clean.replace('gb-', '') ||
             (cleanPhone.length >= 4 && oPhone.includes(cleanPhone)) ||
             (clean.length >= 3 && oName.includes(clean));
    });

    if (found) {
      setActiveOrder(found);
      setNotFound(false);
    } else {
      setActiveOrder(null);
      setNotFound(true);
    }
  };

  // Auto-search initial order on mount if provided or default to GB-2026 for rich live preview
  useEffect(() => {
    if (initialOrderId) {
      setSearchInput(initialOrderId);
      handleSearch(initialOrderId);
    } else {
      handleSearch('GB-2026');
    }
  }, [initialOrderId]);

  const copyTrackingId = (id) => {
    try {
      navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return { label: 'Delivered ✓', bg: '#10b981', color: '#fff' };
      case 'Out for Delivery':
      case 'Shipped':
        return { label: 'Out for Delivery 🚚', bg: '#f59e0b', color: '#172554' };
      case 'Packed':
        return { label: 'Packed in Basket 📦', bg: '#3b82f6', color: '#fff' };
      case 'Harvested':
        return { label: 'Harvested Fresh 🌱', bg: '#84cc16', color: '#142e0a' };
      default:
        return { label: 'Processing & Verifying ⏳', bg: '#64748b', color: '#fff' };
    }
  };

  const badge = activeOrder ? getStatusBadge(activeOrder.status) : null;
  const recentOrders = getCombinedOrders();

  return (
    <div className="parcel-tracking-page section-wrap">
      {/* Page Header */}
      <div className="track-hero">
        <div className="track-hero-badge">
          <Truck size={14} /> PUBLIC PARCEL TRACKING PORTAL
        </div>
        <h1>Track Your <em>Parcel & Delivery</em> Live</h1>
        <p>
          Real-time GPS delivery updates, farm harvest timeline, and courier contact details.
          Enter your Order ID (e.g. <b>GB-2026</b>) or registered phone number below.
        </p>

        {/* Tracking Search Input Card */}
        <form
          className="track-search-card"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <div className="track-search-box">
            <Search size={20} className="track-search-icon" />
            <input
              type="text"
              placeholder="Enter Order ID (e.g. GB-2026, GB-1001) or Phone..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              autoFocus
            />
            {searchInput && (
              <button
                type="button"
                className="track-clear-btn"
                onClick={() => setSearchInput('')}
                title="Clear"
              >
                ×
              </button>
            )}
          </div>
          <button type="submit" className="btn btn-primary track-submit-btn">
            Track Parcel <ArrowRight size={16} />
          </button>
        </form>

        {/* Quick Demo Buttons */}
        <div className="track-demo-chips">
          <span>Try Demo IDs:</span>
          <button
            type="button"
            className={`demo-chip ${searchInput === 'GB-2026' ? 'active-chip' : ''}`}
            onClick={() => {
              setSearchInput('GB-2026');
              handleSearch('GB-2026');
            }}
          >
            <Truck size={13} /> GB-2026 (Out for Delivery 🚚)
          </button>
          <button
            type="button"
            className={`demo-chip ${searchInput === 'GB-1003' ? 'active-chip' : ''}`}
            onClick={() => {
              setSearchInput('GB-1003');
              handleSearch('GB-1003');
            }}
          >
            <Package size={13} /> GB-1003 (In Transit 📦)
          </button>
          <button
            type="button"
            className={`demo-chip ${searchInput === 'GB-1001' ? 'active-chip' : ''}`}
            onClick={() => {
              setSearchInput('GB-1001');
              handleSearch('GB-1001');
            }}
          >
            <CheckCircle2 size={13} /> GB-1001 (Delivered ✅)
          </button>

          {recentOrders.length > 3 && (
            <button
              type="button"
              className="demo-chip recent-chip"
              onClick={() => {
                const latest = recentOrders[0];
                setSearchInput(latest.id);
                handleSearch(latest.id);
              }}
            >
              <Package size={13} /> Latest Order: {recentOrders[0].id}
            </button>
          )}
        </div>
      </div>

      {/* Not Found Alert */}
      {notFound && (
        <div className="track-not-found">
          <AlertCircle size={28} />
          <div>
            <h3>No parcel found for "{searchedQuery}"</h3>
            <p>
              Please verify the Order ID or phone number. Order IDs usually look like <b>GB-2026</b> or <b>GB-1001</b>.
              You can also click one of the demo buttons above to test live tracking.
            </p>
          </div>
        </div>
      )}

      {/* Active Parcel Tracking Details */}
      {activeOrder && (
        <div className="track-result-wrapper">
          {/* Order Header Card */}
          <div className="track-status-banner">
            <div className="track-status-left">
              <div className="track-id-row">
                <span className="track-id-label">PARCEL ID:</span>
                <span className="track-id-value">{activeOrder.id}</span>
                <button
                  type="button"
                  className="copy-btn"
                  onClick={() => copyTrackingId(activeOrder.id)}
                  title="Copy Tracking ID"
                >
                  {copied ? <Check size={14} color="#a5d83e" /> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="track-meta-row">
                <span><Calendar size={13} /> {activeOrder.date}</span>
                <span><MapPin size={13} /> {activeOrder.address}</span>
              </div>
            </div>

            <div className="track-status-right">
              <span
                className="status-pill"
                style={{ background: badge.bg, color: badge.color }}
              >
                {badge.label}
              </span>
              <div className="track-eta-text">
                <Clock size={13} />
                <b>{activeOrder.eta}</b>
              </div>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="track-stepper-card">
            <h3>Delivery Progress</h3>
            <div className="stepper-timeline">
              {activeOrder.timeline.map((step, idx) => {
                const isCompleted = step.done;
                const isCurrent = step.current;
                return (
                  <div
                    key={idx}
                    className={`stepper-step ${isCompleted ? 'step-done' : ''} ${isCurrent ? 'step-current' : ''}`}
                  >
                    <div className="stepper-node">
                      <div className="node-icon">
                        {idx === 0 && <CheckCircle2 size={16} />}
                        {idx === 1 && <Sparkles size={16} />}
                        {idx === 2 && <Package size={16} />}
                        {idx === 3 && <Truck size={16} />}
                        {idx === 4 && <ShieldCheck size={16} />}
                      </div>
                      {idx < activeOrder.timeline.length - 1 && (
                        <div className={`node-connector ${isCompleted && !isCurrent ? 'connector-done' : ''}`} />
                      )}
                    </div>
                    <div className="stepper-content">
                      <div className="step-time">{step.time}</div>
                      <div className="step-title">{step.title}</div>
                      <div className="step-desc">{step.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2-Column Split: Courier Info & Package Details */}
          <div className="track-details-grid">
            {/* Courier Rider Card */}
            <div className="track-detail-box rider-box">
              <div className="box-title">
                <Truck size={18} />
                <h4>Courier & Rider Information</h4>
              </div>
              <div className="rider-card-body">
                <div className="rider-profile">
                  <div className="rider-avatar">
                    <User size={26} />
                  </div>
                  <div className="rider-info">
                    <b>{activeOrder.rider.name}</b>
                    <small>Eco Delivery Specialist • ⭐ {activeOrder.rider.rating} (500+ deliveries)</small>
                    <span className="rider-vehicle">{activeOrder.rider.vehicle}</span>
                  </div>
                </div>

                <div className="rider-status-highlight">
                  <MapPin size={15} />
                  <span><b>Live Status:</b> {activeOrder.rider.liveLocation}</span>
                </div>

                <div className="rider-actions">
                  <a
                    href={`tel:${activeOrder.rider.phone.replace(/[^0-9+]/g, '')}`}
                    className="btn btn-primary rider-call-btn"
                  >
                    <Phone size={15} /> Call Rider ({activeOrder.rider.phone})
                  </a>
                </div>
              </div>
            </div>

            {/* Package Contents & Summary */}
            <div className="track-detail-box package-box">
              <div className="box-title">
                <Package size={18} />
                <h4>Parcel Contents ({activeOrder.items?.length || 0} items)</h4>
              </div>
              <div className="package-items-list">
                {activeOrder.items?.map((item, idx) => (
                  <div key={idx} className="package-item-row">
                    <div className="package-item-left">
                      <span className="package-item-dot">✦</span>
                      <div>
                        <b>{item.name}</b>
                        <small>{item.unit || '1 pack'} × {item.qty}</small>
                      </div>
                    </div>
                    <span className="package-item-price">
                      ${((Number(item.price) || 0) * (Number(item.qty) || 1)).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="package-summary-totals">
                <div>
                  <span>Customer:</span>
                  <b>{activeOrder.customerName}</b>
                </div>
                <div>
                  <span>Payment Method:</span>
                  <b>{activeOrder.paymentMethod}</b>
                </div>
                <div>
                  <span>Delivery Fee:</span>
                  <b style={{ color: 'var(--lime)' }}>FREE (Eco Promotion)</b>
                </div>
                <div className="package-grand-total">
                  <span>Total Amount:</span>
                  <b>${Number(activeOrder.total).toFixed(2)}</b>
                </div>
              </div>
            </div>
          </div>

          {/* Need Help / Support banner */}
          <div className="track-support-bar">
            <div>
              <b>Need help with this delivery?</b>
              <p>Our 24/7 GreenBasket concierge is available to assist with any special requests or delivery instructions.</p>
            </div>
            <div className="track-support-actions">
              <a href="tel:+18004733622" className="btn btn-yellow">
                <Phone size={14} /> Call Concierge: 1-800-473-3622
              </a>
              <button
                type="button"
                className="btn btn-primary"
                onClick={onShopNow}
              >
                Shop More Fresh Produce <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
