import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, Phone, Clock } from 'lucide-react';

const INITIAL_MESSAGE = {
  id: 1,
  sender: 'support',
  name: 'GreenBasket Support',
  text: 'স্বাগতম! 🌱 Welcome to GreenBasket Live Support. আমাদের স্টোরের যেকোনো ফল, সবজি, পণ্য তালিকা, স্টক, দাম, ডেলিভারি বা অফার সম্পর্কে বাংলা বা ইংরেজিতে প্রশ্ন করতে পারেন। How can we assist you today?',
  time: 'Just now'
};

// Security boundary: Check for confidential/internal/admin system inquiries
function isRestrictedQuery(text) {
  const restrictedKeywords = [
    'admin', 'password', 'token', 'secret', 'gist', 'api key', 'apikey', 'database', 'backend',
    'source code', 'credentials', 'bypass', 'hack', 'internal', 'server', 'env', 'github token',
    'developer', 'root', 'login as admin', 'এডমিন', 'পাসওয়ার্ড', 'টোকেন', 'গোপন', 'ডাটাবেজ',
    'সার্ভার', 'ব্যাকএন্ড', 'সোর্স কোড', 'অ্যাডমিন', 'লগইন তথ্য', 'সিক্রেট'
  ];
  const q = text.toLowerCase();
  return restrictedKeywords.some(k => q.includes(k));
}

// Comprehensive bilingual AI responder with real-time website & product catalog knowledge
function getSmartReply(userQuery, products = [], storeSettings = {}) {
  const q = userQuery.toLowerCase().trim();
  const isBangla = /[\u0980-\u09FF]/.test(userQuery);

  // 1. Strict Security Boundary: Refuse hidden or administrative topics
  if (isRestrictedQuery(userQuery)) {
    return isBangla
      ? '🔒 দুঃখিত, নিরাপত্তা ও গোপনীয়তা বিধিমালার কারণে সিস্টেমের অভ্যন্তরীণ বা অ্যাডমিন সংক্রান্ত তথ্য প্রকাশ করা সম্ভব নয়। সাধারণ পণ্য, অর্ডার বা ডেলিভারি বিষয়ে যেকোনো তথ্যের জন্য আমরা আপনাকে সাহায্য করতে পারি।'
      : '🔒 I apologize, but due to security and confidentiality policies, internal system details and administrative functions cannot be shared. We are glad to help you with products, orders, shipping, and shopping assistance.';
  }

  // 2. Dynamic Product & Catalog Search across all active items
  if (Array.isArray(products) && products.length > 0) {
    // Check if the user is asking about a specific product name or category
    const matchedProducts = products.filter(p => {
      const pName = (p.name || '').toLowerCase();
      const pCat = (p.category || '').toLowerCase();
      // Match full word or partial
      return q.includes(pName) || pName.split(' ').some(word => word.length > 3 && q.includes(word)) || (q.includes(pCat) && (q.includes('item') || q.includes('list') || q.includes('পণ্য') || q.includes('আছে')));
    });

    if (matchedProducts.length > 0) {
      const topP = matchedProducts[0];
      const effectivePrice = (topP.discountPrice && Number(topP.discountPrice) > 0 && Number(topP.discountPrice) < Number(topP.price))
        ? Number(topP.discountPrice)
        : Number(topP.price || 0);

      // Asking specifically about price / দাম
      if (q.includes('price') || q.includes('cost') || q.includes('how much') || q.includes('দাম') || q.includes('টাকা') || q.includes('কত')) {
        return isBangla
          ? `🥦 ${topP.name} (${topP.unit || 'per pack'})-এর বর্তমান মূল্য $${effectivePrice.toFixed(2)}${topP.discountPrice ? ` (আসল দাম ছিল $${Number(topP.price).toFixed(2)})` : ''}। এটি স্টকে আছে এবং সরাসরি কার্টে যোগ করতে পারেন!`
          : `🥦 ${topP.name} (${topP.unit || 'per pack'}) is currently priced at $${effectivePrice.toFixed(2)}${topP.discountPrice ? ` (regular price $${Number(topP.price).toFixed(2)})` : ''}. In stock and ready to order!`;
      }

      // Asking about stock or availability / স্টক বা আছে কিনা
      if (q.includes('stock') || q.includes('available') || q.includes('have') || q.includes('স্টক') || q.includes('আছে কি') || q.includes('পাওয়া যাবে')) {
        const inStock = Number(topP.stock || 20) > 0;
        return isBangla
          ? inStock
            ? `✅ হ্যাঁ, ${topP.name} বর্তমানে স্টকে উপলব্ধ রয়েছে! ইউনিট: ${topP.unit || 'pack'}, দাম: $${effectivePrice.toFixed(2)}।`
            : `⚠️ দুঃখিত, ${topP.name} সাময়িকভাবে স্টক-আউট রয়েছে। আমাদের পরবর্তী হার্ভেস্টে আবার পাওয়া যাবে।`
          : inStock
            ? `✅ Yes, ${topP.name} is currently in stock! Unit: ${topP.unit || 'pack'}, price: $${effectivePrice.toFixed(2)}.`
            : `⚠️ Sorry, ${topP.name} is currently out of stock. It will be replenished with our next harvest.`;
      }

      // General product inquiry
      return isBangla
        ? `🥬 ${topP.name}:\n• ক্যাটাগরি: ${topP.category || 'Fresh Harvest'}\n• ইউনিট: ${topP.unit || '1 pack'}\n• মূল্য: $${effectivePrice.toFixed(2)}\n• স্টক: ${topP.stock || 'Available'}\n• রেটিং: ⭐ ${topP.rating || '5.0'} (${topP.reviews || 10}+ reviews)\nআপনি সরাসরি এটি কার্টে যোগ করে অর্ডার করতে পারেন!`
        : `🥬 ${topP.name}:\n• Category: ${topP.category || 'Fresh Harvest'}\n• Unit: ${topP.unit || '1 pack'}\n• Price: $${effectivePrice.toFixed(2)}\n• Stock: ${topP.stock || 'Available'}\n• Rating: ⭐ ${topP.rating || '5.0'} (${topP.reviews || 10}+ reviews)\nYou can add this directly to your cart!`;
    }
  }

  // 3. Product Categories Inquiry
  if (q.includes('category') || q.includes('categories') || q.includes('ক্যাটাগরি') || q.includes('কী কী সবজি') || q.includes('কী কী পাওয়া যায়') || q.includes('পণ্য তালিকা') || q.includes('what products')) {
    return isBangla
      ? '🧺 GreenBasket-এ আপনি পাবেন:\n১. Vegetables (তাজা শাকসবজি — টমেটো, গাজর, ক্যাপসিকাম, ব্রকলি, আলু)\n২. Fruits (আম, আপেল, ড্রাগন ফ্রুট, অ্যাভোকাডো)\n৩. Herbs & Greens (পুদিনা, ধনেপাতা, পালং শাক)\n৪. Dairy (খাঁটি দুধ, পনির, মাখন)\n৫. Bakery (ফ্রেশ হোল-হুইট ব্রেড)\n৬. Pantry (অর্গানিক মধু ও ড্রাই ফ্রুটস)।'
      : '🧺 At GreenBasket, you can shop from:\n1. Vegetables (Tomatoes, Carrots, Bell Peppers, Broccoli, Avocados)\n2. Fruits (Apples, Mangoes, Dragon Fruit, Bananas)\n3. Herbs & Greens (Mint, Coriander, Spinach)\n4. Dairy (Farm-fresh milk, butter, cheese)\n5. Bakery (Artisan bread & baked goods)\n6. Pantry (Raw organic honey & staples).';
  }

  // 4. Greetings
  if (/^(hi|hello|hey|good morning|good evening|good afternoon|hola)\b/i.test(q) || /^(হাই|হ্যালো|সালাম|নমস্কার|কেমন আছেন)/i.test(q)) {
    return isBangla
      ? '👋 হ্যালো! GreenBasket-এ আপনাকে স্বাগতম। আপনি তাজা শাকসবজি, ফলমূল, অর্ডার ট্র্যাক বা ডেলিভারি সম্পর্কে যা জানতে চান বলুন।'
      : '👋 Hello! Welcome to GreenBasket. How can we help you today with our organic harvest, order tracking, or delivery?';
  }

  // 5. Order Tracking & Parcel Location
  if (q.includes('track') || q.includes('parcel') || q.includes('order status') || q.includes('where is my order') || q.includes('ট্র্যাক') || q.includes('পার্সেল') || q.includes('অর্ডার কোথায়') || q.includes('অর্ডারের অবস্থা')) {
    return isBangla
      ? '📦 আপনার অর্ডার ট্র্যাক করতে ওয়েবসাইটের উপরে থাকা "Track Parcel Live" বাটনে ক্লিক করুন অথবা আপনার Order ID (যেমন: GB-1001) দিয়ে সার্চ করুন। আপনি সরাসরি Google Maps-এ লাইভ লোকেশনও দেখতে পাবেন।'
      : '📦 To track your parcel, please click the "Track Parcel Live" button at the top header or search with your Order ID (e.g., GB-1001). You can also view live Google Maps GPS tracking for your delivery.';
  }

  // 6. How to place an order / Ordering Rules
  if (q.includes('how to order') || q.includes('place order') || q.includes('order kivabe') || q.includes('অর্ডার কিভাবে') || q.includes('অর্ডার করব কিভাবে') || q.includes('অর্ডার দিতে চাই')) {
    return isBangla
      ? '🛒 অর্ডার করার নিয়ম খুবই সহজ:\n১. পছন্দমতো সবজি বা ফল কার্টে যোগ করুন।\n২. কার্ট ওপেন করে "Sign In to Checkout"-এ ক্লিক করে আপনার অ্যাকাউন্ট লগইন বা তৈরি করুন।\n৩. ডেলিভারি ঠিকানা ও ফোন নম্বর দিয়ে ক্যাশ অন ডেলিভারি বা অনলাইনে পেমেন্ট নিশ্চিত করুন।'
      : '🛒 How to order:\n1. Add your desired fresh produce to the cart.\n2. Open your cart and click "Sign In to Checkout" to login or register.\n3. Enter your delivery address & phone number, choose your payment method, and confirm your order!';
  }

  // 7. Delivery Fees & Free Shipping
  if (q.includes('delivery fee') || q.includes('shipping fee') || q.includes('delivery charge') || q.includes('shipping charge') || q.includes('ডেলিভারি চার্জ') || q.includes('শিপিং') || q.includes('ডেলিভারি খরচ')) {
    return isBangla
      ? '🚚 গ্রিন বাস্কেটে $49 বা তার বেশি মূল্যের অর্ডারে সারা দেশে ডেলিভারি সম্পূর্ণ ফ্রি! আর $49-এর কম অর্ডারে ডেলিভারি চার্জ মাত্র $4.99।'
      : '🚚 At GreenBasket, delivery is 100% FREE on all orders of $49 or more! For orders below $49, standard delivery is only $4.99.';
  }

  // 8. Delivery Time & Speed
  if (q.includes('delivery time') || q.includes('how long') || q.includes('when will i get') || q.includes('কত সময়') || q.includes('কখন পাব') || q.includes('কবে আসবে') || q.includes('ডেলিভারি হতে কত দিন')) {
    return isBangla
      ? '⚡ ঢাকা শহরের মধ্যে সেম-ডে অথবা ১২–২৪ ঘণ্টার ভেতর দ্রুত ও সতেজ ডেলিভারি পৌঁছে দেওয়া হয়। অন্যান্য এলাকায় ১–২ কার্যদিবসের মধ্যে ডেলিভারি সম্পন্ন হয়।'
      : '⚡ In Dhaka city, we deliver within 12 to 24 hours (same-day delivery available). For outer regions, delivery usually takes 1 to 2 business days.';
  }

  // 9. Payment Methods
  if (q.includes('payment') || q.includes('bkash') || q.includes('nagad') || q.includes('cash on delivery') || q.includes('card') || q.includes('পেমেন্ট') || q.includes('বিকাশ') || q.includes('নগদ') || q.includes('টাকা পরিশোধ')) {
    return isBangla
      ? '💳 আমরা গ্রহণ করি:\n• ক্যাশ অন ডেলিভারি (পণ্য পেয়ে নগদ টাকা দিন)\n• বিকাশ (bKash) ও নগদ (Nagad)\n• ভিসা ও মাস্টারকার্ড (Debit/Credit Card)।'
      : '💳 Accepted Payment Methods:\n• Cash on Delivery (COD — pay upon arrival)\n• bKash & Nagad mobile banking\n• Visa & MasterCard debit/credit cards.';
  }

  // 10. Discounts, Coupons & Promo Codes
  const activePromo = storeSettings?.promoCode ? storeSettings.promoCode.trim().toUpperCase() : 'GREEN20';
  const activePct = Number(storeSettings?.promoDiscount) || 20;

  if (q.includes('discount') || q.includes('promo') || q.includes('coupon') || q.includes('offer') || q.includes('অফার') || q.includes('ডিসকাউন্ট') || q.includes('কুপন') || q.includes('ছাড়')) {
    return isBangla
      ? `🎉 স্পেশাল প্রোমো কোড: চেকআউটে "${activePromo}" ব্যবহার করলেই পেয়ে যাবেন ফ্ল্যাট ${activePct}% ইনস্ট্যান্ট ডিসকাউন্ট! এছাড়া হোমপেজের Deals সেকশনে প্রতিদিনের বিশেষ ছাড় দেখতে পারেন।`
      : `🎉 Special Promo Code: Enter coupon code "${activePromo}" at checkout for a flat ${activePct}% instant discount! You can also check our "Deals" page for daily flash savings.`;
  }

  // 11. Organic Quality & Freshness Guarantee
  if (q.includes('organic') || q.includes('fresh') || q.includes('quality') || q.includes('farm') || q.includes('অর্গানিক') || q.includes('তাজা') || q.includes('খামার') || q.includes('গুণগত মান')) {
    return isBangla
      ? '🌱 আমাদের প্রতিটি পণ্য ১০০% সার্টিফাইড রাসায়নিকমুক্ত অর্গানিক খামার থেকে ভোরের আলোয় তোলা হয় এবং বিশেষ তাপমাত্রা নিয়ন্ত্রিত প্যাকেজিংয়ে সরবরাহ করা হয়।'
      : '🌱 Every item is 100% certified pesticide-free organic, harvested fresh at dawn from partnered local farms and delivered under strict hygienic standards.';
  }

  // 12. Return & Refund Policy
  if (q.includes('return') || q.includes('refund') || q.includes('damaged') || q.includes('নষ্ট') || q.includes('রিটার্ন') || q.includes('ফেরত') || q.includes('পচা')) {
    return isBangla
      ? '🔄 আমাদের রয়েছে ১০০% মান সন্তুষ্টি পলিসি। ডেলিভারি গ্রহণের সময় পণ্যের মানে কোনো ত্রুটি পেলে সাথে সাথে রাইডারকে ফেরত দিতে পারেন অথবা ২৪ ঘণ্টার মধ্যে হেল্পলাইনে জানালে ফুল রিফান্ড বা রিপ্লেসমেন্ট প্রদান করা হবে।'
      : '🔄 We offer a 100% fresh satisfaction guarantee. If any produce is damaged or below standard upon arrival, hand it back to the rider or contact our helpline within 24 hours for an instant replacement or full refund.';
  }

  // 13. Account & Registration Assistance
  if (q.includes('account') || q.includes('register') || q.includes('sign in') || q.includes('login') || q.includes('সাইন ইন') || q.includes('অ্যাকাউন্ট') || q.includes('লগইন')) {
    return isBangla
      ? '👤 অ্যাকাউন্টে প্রবেশ করতে ওয়েবসাইটের উপরের "Account" বাটনে ক্লিক করুন। নতুন হলে "New Account" ট্যাবে নাম, ফোন ও ঠিকানা দিয়ে সহজে নিবন্ধন করে অর্ডার করতে পারবেন।'
      : '👤 To access your account, click the "Account" button in the top navigation. New customers can register in seconds by selecting the "New Account" tab.';
  }

  // 14. Helpline & Contact Info
  if (q.includes('contact') || q.includes('helpline') || q.includes('phone') || q.includes('call') || q.includes('email') || q.includes('ঠিকানা') || q.includes('যোগাযোগ') || q.includes('ফোন')) {
    return isBangla
      ? '📞 আমাদের কাস্টমার হেল্পলাইন: +880 1712-345678 (২৪/৭ খোলা)\n✉️ ইমেইল: support@greenbasket.org\n📍 প্রধান কার্যালয়: ধানমন্ডি, ঢাকা, বাংলাদেশ।'
      : '📞 Customer Helpline: +880 1712-345678 (24/7 Support)\n✉️ Email: support@greenbasket.org\n📍 Head Office: Dhanmondi, Dhaka, Bangladesh.';
  }

  // 15. Intelligent Fallback
  return isBangla
    ? 'ধন্যবাদ আপনার বার্তার জন্য! GreenBasket ওয়েবসাইটের পণ্য, দাম, স্টক, অর্ডার, ডেলিভারি বা সার্ভিস সম্পর্কে জানতে চাইলে একটু বিস্তারিত লিখুন, অথবা আমাদের ২৪/৭ হেল্পলাইন +880 1712-345678-এ সরাসরি কল করতে পারেন।'
    : 'Thank you for reaching out! Please feel free to ask about any GreenBasket products, pricing, stock, orders, delivery, or account services, or call our 24/7 hotline directly at +880 1712-345678.';
}

export default function CustomerSupportChat({ currentUser, products = [], storeSettings = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [input, setInput] = useState('');
  // In-memory messages only: completely cleared on chat close or page reload
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleOpen = () => {
    setIsOpen(true);
    setUnreadCount(0);
  };

  // Close chat AND reset chat history completely
  const handleClose = () => {
    setIsOpen(false);
    setMessages([INITIAL_MESSAGE]);
    setInput('');
    setIsTyping(false);
    setUnreadCount(0);
  };

  const handleSend = () => {
    const query = input.trim();
    if (!query) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      name: currentUser?.name || 'Customer',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const replyText = getSmartReply(query, products, storeSettings);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'support',
        name: 'Support Agent',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <>
      {/* Floating Chat Trigger Button (Bottom-Right) */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '8px'
        }}
      >
        {!isOpen && (
          <button
            onClick={handleOpen}
            aria-label="Open Live Chat"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'linear-gradient(135deg, #2e5912 0%, #437a1c 100%)',
              color: '#ffffff',
              border: '2px solid rgba(255,255,255,0.25)',
              borderRadius: '50px',
              padding: '12px 20px 12px 16px',
              boxShadow: '0 10px 30px rgba(22, 53, 11, 0.45)',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '13px',
              transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
              animation: 'gbBounce 2.5s infinite ease-in-out'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0) scale(1)'}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#a3e635',
                  color: '#1a3d0b',
                  display: 'grid',
                  placeItems: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
              >
                <MessageSquare size={19} />
              </div>
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#22c55e',
                  border: '2px solid #ffffff'
                }}
              />
            </div>
            <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
              <span style={{ display: 'block', fontSize: '13px', fontWeight: 800 }}>Live Support</span>
              <small style={{ fontSize: '10px', color: '#d9f99d', fontWeight: 500 }}>Online • Instant Reply</small>
            </div>
            {unreadCount > 0 && (
              <span
                style={{
                  background: '#ef4444',
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: 800,
                  padding: '2px 7px',
                  borderRadius: '12px',
                  marginLeft: '4px'
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>
        )}

        {/* Floating Chat Window */}
        {isOpen && (
          <div
            style={{
              width: 'min(380px, calc(100vw - 32px))',
              height: '490px',
              maxHeight: 'calc(100vh - 100px)',
              background: '#ffffff',
              borderRadius: '20px',
              boxShadow: '0 20px 60px rgba(12, 31, 6, 0.35), 0 0 0 1px rgba(0,0,0,0.06)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              animation: 'gbSlideUp 0.25s ease-out'
            }}
          >
            {/* Header */}
            <div
              style={{
                background: 'linear-gradient(135deg, #1d3d0c 0%, #325f16 100%)',
                color: '#ffffff',
                padding: '16px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      background: '#a3e635',
                      color: '#153209',
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: 800
                    }}
                  >
                    <Bot size={22} />
                  </div>
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: '#22c55e',
                      border: '2px solid #1d3d0c'
                    }}
                  />
                </div>
                <div>
                  <b style={{ display: 'block', fontSize: '14px', letterSpacing: '-0.2px' }}>GreenBasket Support</b>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#d9f99d' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a3e635' }} />
                    Active Now (বাংলা / English)
                  </div>
                </div>
              </div>
              <button
                onClick={handleClose}
                aria-label="Close Chat"
                title="চ্যাট শেষ ও বন্ধ করুন"
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  color: '#ffffff',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'grid',
                  placeItems: 'center',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              >
                <X size={17} />
              </button>
            </div>

            {/* Notification Banner */}
            <div
              style={{
                background: '#f0fdf4',
                borderBottom: '1px solid #dcfce7',
                padding: '7px 14px',
                fontSize: '11px',
                color: '#15803d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Clock size={12} /> ২৪/৭ লাইভ কাস্টমার অ্যাসিস্ট্যান্স
              </span>
              <a
                href="tel:+8801712345678"
                style={{ color: '#166534', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}
              >
                <Phone size={11} /> Call
              </a>
            </div>

            {/* Messages Area */}
            <div
              style={{
                flex: 1,
                padding: '14px 16px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                background: '#f8faf5'
              }}
            >
              {messages.map((m) => {
                const isUser = m.sender === 'user';
                return (
                  <div
                    key={m.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isUser ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '85%',
                        padding: '10px 14px',
                        borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        background: isUser ? '#2e5912' : '#ffffff',
                        color: isUser ? '#ffffff' : '#1a3311',
                        fontSize: '12.5px',
                        lineHeight: 1.5,
                        boxShadow: isUser ? '0 2px 6px rgba(46,89,18,0.25)' : '0 2px 6px rgba(0,0,0,0.05)',
                        border: isUser ? 'none' : '1px solid #e7ede0',
                        wordBreak: 'break-word',
                        whiteSpace: 'pre-line'
                      }}
                    >
                      {m.text}
                    </div>
                    <span style={{ fontSize: '9.5px', color: '#88987d', marginTop: '3px', padding: '0 4px' }}>
                      {m.time}
                    </span>
                  </div>
                );
              })}

              {isTyping && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#ffffff', border: '1px solid #e7ede0', padding: '8px 12px', borderRadius: '16px', width: 'fit-content' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#56831d', animation: 'gbPulse 1s infinite' }} />
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#56831d', animation: 'gbPulse 1s infinite 0.2s' }} />
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#56831d', animation: 'gbPulse 1s infinite 0.4s' }} />
                  <small style={{ fontSize: '10px', color: '#687761', marginLeft: '4px' }}>Typing reply...</small>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 14px',
                background: '#ffffff',
                borderTop: '1px solid #e5ede0'
              }}
            >
              <input
                type="text"
                placeholder="মেসেজ লিখুন / Type your message..."
                value={input}
                onChange={e => setInput(e.target.value)}
                style={{
                  flex: 1,
                  border: '1px solid #d5decb',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  fontSize: '12.5px',
                  outline: 'none',
                  background: '#fbfdf9',
                  color: '#1a3211'
                }}
              />
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send Message"
                style={{
                  background: input.trim() ? '#2e5912' : '#cbd5c0',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  width: '38px',
                  height: '38px',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: input.trim() ? 'pointer' : 'default',
                  transition: 'background 0.15s'
                }}
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        )}
      </div>

      <style>{`
        @keyframes gbBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes gbSlideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes gbPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </>
  );
}
