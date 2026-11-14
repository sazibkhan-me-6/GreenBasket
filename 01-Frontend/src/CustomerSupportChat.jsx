import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, Phone, Clock } from 'lucide-react';

const INITIAL_MESSAGE = {
  id: 1,
  sender: 'support',
  name: 'GreenBasket Support',
  text: 'স্বাগতম! 🌱 Welcome to GreenBasket Live Support. আপনার অর্ডার, পণ্য বা যেকোনো বিষয়ে বাংলা বা ইংরেজিতে প্রশ্ন করতে পারেন। How can we assist you today?',
  time: 'Just now'
};

// Bilingual smart responses (Bangla & English)
function getSmartReply(userQuery) {
  const q = userQuery.toLowerCase().trim();

  // English detection
  const isBangla = /[\u0980-\u09FF]/.test(userQuery);

  // 1. Order Tracking / ট্র্যাক
  if (q.includes('track') || q.includes('ট্র্যাক') || q.includes('order status') || q.includes('আমার অর্ডার') || q.includes('parcel')) {
    return isBangla
      ? '📦 আপনার অর্ডার ট্র্যাক করতে ওয়েবসাইটের উপরে "Track Parcel Live" বাটনে ক্লিক করুন অথবা আপনার Order ID (যেমন: GB-1001) লিখে সার্চ করুন। আপনি রিয়েল-টাইম জিপিএস ম্যাপেও পার্সেল দেখতে পাবেন।'
      : '📦 To track your order, click the "Track Parcel Live" button at the top of the website or search using your Order ID (e.g., GB-1001). You can also view live GPS tracking on the map.';
  }

  // 2. Delivery Fee / ডেলিভারি চার্জ
  if (q.includes('delivery fee') || q.includes('shipping') || q.includes('charge') || q.includes('cost') || q.includes('ডেলিভারি চার্জ') || q.includes('চার্জ') || q.includes('ভাড়া')) {
    return isBangla
      ? '🚚 গ্রিন বাস্কেটে $49 বা তার বেশি অর্ডারে সারা দেশে ডেলিভারি সম্পূর্ণ ফ্রি! আর $49-এর নিচে স্ট্যান্ডার্ড ডেলিভারি চার্জ মাত্র $4.99।'
      : '🚚 At GreenBasket, delivery is 100% FREE on all orders over $49! For orders below $49, the standard delivery fee is just $4.99.';
  }

  // 3. Delivery Time / কত সময় লাগে
  if (q.includes('how long') || q.includes('time') || q.includes('when') || q.includes('সময়') || q.includes('কখন') || q.includes('কবে')) {
    return isBangla
      ? '⚡ ঢাকা মেট্রোপলিটন এলাকায় সেম-ডে অথবা ১২ থেকে ২৪ ঘণ্টার মধ্যে সুপার-ফ্রেশ ডেলিভারি সম্পন্ন হয়। অন্যান্য এলাকায় ১-২ দিনের মধ্যে পৌঁছে দেওয়া হয়।'
      : '⚡ In Dhaka Metro, we ensure same-day or 12–24 hour super-fresh delivery. For other areas, it takes 1–2 business days.';
  }

  // 4. Payment Methods / পেমেন্ট
  if (q.includes('payment') || q.includes('pay') || q.includes('bkash') || q.includes('nagad') || q.includes('cash') || q.includes('পেমেন্ট') || q.includes('বিকাশ') || q.includes('নগদ') || q.includes('টাকা')) {
    return isBangla
      ? '💳 আমাদের রয়েছে ক্যাশ অন ডেলিভারি (Cash on Delivery), বিকাশ (bKash), নগদ (Nagad) এবং ভিসা/মাস্টারকার্ড অনলাইন পেমেন্টের সহজ সুবিধা।'
      : '💳 We accept Cash on Delivery (COD), bKash, Nagad, as well as Visa & MasterCard online card payments.';
  }

  // 5. Freshness / Quality / অর্গানিক
  if (q.includes('fresh') || q.includes('organic') || q.includes('quality') || q.includes('ফ্রেশ') || q.includes('অর্গানিক') || q.includes('তাজা') || q.includes('খামার')) {
    return isBangla
      ? '🌿 আমাদের সকল সবজি ও ফল ১০০% সার্টিফাইড অর্গানিক খামার থেকে সরাসরি সংগ্রহ করা হয় এবং হাইজেনিক কোল্ড-প্যাকিংয়ের মাধ্যমে সম্পূর্ণ পুষ্টিমান অক্ষুণ্ণ রাখা হয়।'
      : '🌿 All our produce is 100% certified organic, harvested directly from verified local farms and hygienically packed to preserve maximum crispness and nutrients.';
  }

  // 6. Discount / Promo Code / অফার
  if (q.includes('discount') || q.includes('promo') || q.includes('coupon') || q.includes('offer') || q.includes('ছাড়') || q.includes('অফার') || q.includes('ডিসকাউন্ট')) {
    return isBangla
      ? '🎉 স্পেশাল অফার! চেকআউটে প্রোমোকোড "GREEN20" ব্যবহার করলেই পেয়ে যাবেন ফ্ল্যাট ২০% ইনস্ট্যান্ট ডিসকাউন্ট!'
      : '🎉 Special Offer! Use promo code "GREEN20" at checkout to get a flat 20% instant discount!';
  }

  // 7. Contact / Helpline / Phone / যোগাযোগ
  if (q.includes('contact') || q.includes('phone') || q.includes('call') || q.includes('number') || q.includes('হেল্প') || q.includes('ফোন') || q.includes('যোগাযোগ') || q.includes('নাম্বার')) {
    return isBangla
      ? '📞 আমাদের হেল্পলাইন ২৪/৭ খোলা: +880 1712-345678। এছাড়া সাপোর্ট ইমেইল: support@greenbasket.org।'
      : '📞 Our 24/7 hotline is +880 1712-345678. You can also reach our support team at support@greenbasket.org.';
  }

  // 8. Greetings
  if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('হ্যালো') || q.includes('হাই') || q.includes('সালাম') || q.includes('salam')) {
    return isBangla
      ? '👋 হ্যালো! GreenBasket-এ আপনাকে স্বাগতম। আজ আপনাকে কীভাবে সহায়তা করতে পারি?'
      : '👋 Hello! Welcome to GreenBasket. How can we help you today?';
  }

  // Fallback
  return isBangla
    ? 'ধন্যবাদ আপনার বার্তার জন্য! আমাদের একজন কাস্টমার কেয়ার প্রতিনিধি খুব শীঘ্রই আপনার সাথে যোগাযোগ করবেন। জরুরি প্রয়োজনে আমাদের হটলাইন +880 1712-345678-এ সরাসরি কল করতে পারেন।'
    : 'Thank you for your message! A customer care specialist has been notified. For urgent assistance, please call our hotline directly at +880 1712-345678.';
}

export default function CustomerSupportChat({ currentUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [input, setInput] = useState('');
  // In-memory messages only: resets on page reload and on chat close
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
      const replyText = getSmartReply(query);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'support',
        name: 'Support Agent',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 750);
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
                        maxWidth: '82%',
                        padding: '10px 14px',
                        borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        background: isUser ? '#2e5912' : '#ffffff',
                        color: isUser ? '#ffffff' : '#1a3311',
                        fontSize: '12.5px',
                        lineHeight: 1.45,
                        boxShadow: isUser ? '0 2px 6px rgba(46,89,18,0.25)' : '0 2px 6px rgba(0,0,0,0.05)',
                        border: isUser ? 'none' : '1px solid #e7ede0',
                        wordBreak: 'break-word'
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
