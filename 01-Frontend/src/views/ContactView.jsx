import React, { useState } from 'react';
import {
  Phone, Mail, MapPin, Clock, Send, CheckCircle2,
  HelpCircle, ChevronDown, ChevronUp, Truck, ArrowRight
} from 'lucide-react';

export default function ContactView({ navigateTo, onShowToast }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Order & Delivery Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      onShowToast('Please fill in your name, email and message.');
      return;
    }
    setSubmitted(true);
    onShowToast('Your message has been sent! Our support team will reply within 2 hours. 🌿');
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'Order & Delivery Inquiry',
        message: ''
      });
      setSubmitted(false);
    }, 4000);
  };

  const faqs = [
    {
      q: 'How can I track my parcel or grocery delivery in real-time?',
      a: 'Simply click the "Track Parcel 📦" button in the top menu or on our homepage. Enter your Order ID (e.g. GB-2026) or phone number to see live status, rider contact details, and ETA.'
    },
    {
      q: 'How fast does delivery take after placing an order?',
      a: 'We offer same-day express delivery within 2 to 4 hours for local orders, and scheduled next-morning delivery for farm-harvested specialties.'
    },
    {
      q: 'Is all produce 100% certified organic and pesticide-free?',
      a: 'Yes! Every item in GreenBasket is grown on certified organic farms without synthetic pesticides, GMO seeds, or harmful chemical fertilizers.'
    },
    {
      q: 'What is your freshness return & refund policy?',
      a: 'We offer a 100% Happiness Guarantee. If any item arrives damaged or does not meet your expectations, contact our 24/7 hotline or email us for an instant replacement or full refund.'
    }
  ];

  return (
    <div className="contact-page section-wrap">
      {/* Breadcrumb & Header */}
      <div className="page-header-banner">
        <div className="page-breadcrumb">
          <button type="button" onClick={() => navigateTo('home')}>Home</button>
          <span>/</span>
          <span className="current">Contact & Support</span>
        </div>
        <h1>We're Always Here To <em>Help You Live Fresh</em></h1>
        <p>Questions about our harvest, delivery status, or custom orders? Reach our 24/7 dedicated support team.</p>
      </div>

      {/* 2-Column Split: Form & Info */}
      <div className="contact-grid">
        {/* Contact Form */}
        <div className="contact-form-card">
          <div className="card-heading">
            <Send size={18} />
            <h3>Send Us a Message</h3>
          </div>
          <p>Fill out the form below and our customer care team will respond within 2 hours.</p>

          {submitted ? (
            <div className="contact-success-box">
              <CheckCircle2 size={36} color="var(--lime)" />
              <h4>Message Received!</h4>
              <p>Thank you for reaching out. We have sent a confirmation email to <b>{formData.email || 'your inbox'}</b>.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sazib Khan"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. sazib@example.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number (Optional)</label>
                  <input
                    type="tel"
                    placeholder="+880 1712-345678"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Inquiry Subject</label>
                  <select
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  >
                    <option value="Order & Delivery Inquiry">Order & Delivery Inquiry</option>
                    <option value="Product Sourcing & Quality">Product Sourcing & Quality</option>
                    <option value="Wholesale & Farm Partnership">Wholesale & Farm Partnership</option>
                    <option value="Feedback & Suggestions">Feedback & Suggestions</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Your Message *</label>
                <textarea
                  rows="4"
                  required
                  placeholder="How can we assist you today?"
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Send Message <Send size={15} />
              </button>
            </form>
          )}
        </div>

        {/* Contact Info & Parcel Tracker Banner */}
        <div className="contact-info-col">
          {/* Quick Parcel Tracker Callout */}
          <div className="contact-track-callout">
            <div className="callout-icon"><Truck size={24} /></div>
            <div className="callout-text">
              <h4>Checking an Existing Parcel?</h4>
              <p>Track live delivery status, rider location, and order progress instantly.</p>
              <button
                type="button"
                className="btn btn-primary callout-btn"
                onClick={() => navigateTo('track')}
              >
                Open Parcel Tracker <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Contact Details List */}
          <div className="contact-details-card">
            <h3>Direct Contact Channels</h3>

            <div className="contact-item">
              <span className="contact-icon"><Phone /></span>
              <div>
                <b>Customer Service Hotline</b>
                <a href="tel:+18004733622">+1 (800) 473-3622 (Toll Free)</a>
                <small>Available 24 hours a day, 7 days a week</small>
              </div>
            </div>

            <div className="contact-item">
              <span className="contact-icon"><Mail /></span>
              <div>
                <b>Email Support</b>
                <a href="mailto:support@greenbasket.com">support@greenbasket.com</a>
                <small>Average response time: &lt; 2 hours</small>
              </div>
            </div>

            <div className="contact-item">
              <span className="contact-icon"><MapPin /></span>
              <div>
                <b>Fulfillment & Farm Hub</b>
                <address>GreenBasket Eco Hub, 104 Fresh Valley Avenue</address>
                <small>Organic farm distribution & dispatch center</small>
              </div>
            </div>

            <div className="contact-item">
              <span className="contact-icon"><Clock /></span>
              <div>
                <b>Operating Hours</b>
                <span>Monday – Sunday: 7:00 AM – 10:00 PM</span>
                <small>Express deliveries dispatch every 30 minutes</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="contact-faqs section-block">
        <div className="section-heading">
          <div>
            <span className="heading-leaf">✦</span>
            <h2>Frequently Asked Questions</h2>
          </div>
        </div>

        <div className="faqs-accordion">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className={`faq-item ${isOpen ? 'faq-open' : ''}`}>
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                >
                  <span className="faq-q-text">{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                {isOpen && (
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
