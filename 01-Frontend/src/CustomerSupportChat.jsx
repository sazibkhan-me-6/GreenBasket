import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles, Phone, Clock, ChevronDown } from 'lucide-react';

const QUICK_PROMPTS = [
  'অর্ডার ট্র্যাক করব কিভাবে?',
  'ডেলিভারি চার্জ কত?',
  'ডেলিভারি হতে কত সময় লাগে?',
  'পেমেন্ট মেথড কি কি আছে?',
  'অর্গানিক সবজি কতদিন ফ্রেশ থাকে?'
];

const BOT_RESPONSES = {
  'অর্ডার ট্র্যাক করব কিভাবে?': 'আপনার অর্ডার ট্র্যাক করতে উপরের "Track Parcel Live" বাটনটিতে ক্লিক করুন অথবা আপনার Order ID (যেমন: GB-1001) দিয়ে সার্চ করুন।',
  'ডেলিভারি চার্জ কত?': 'GreenBasket-এ $49-এর বেশি অর্ডারে সারা দেশে ডেলিভারি একদম ফ্রি! $49-এর নিচে স্ট্যান্ডার্ড ডেলিভারি চার্জ মাত্র $4.99।',
  'ডেলিভারি হতে কত সময় লাগে?': 'সাধারণত ঢাকা শহরের ভেতরে সেম-ডে অথবা ১২-২৪ ঘণ্টার মধ্যে আমরা সুপার-ফ্রেশ ডেলিভারি নিশ্চিত করি।',
  'পেমেন্ট মেথড কি কি আছে?': 'আমাদের রয়েছে ক্যাশ অন ডেলিভারি (Cash on Delivery), বিকাশ (bKash), নগদ (Nagad) এবং ভিসা/মাস্টারকার্ড পেমেন্টের সুবিধা।',
  'অর্গানিক সবজি কতদিন ফ্রেশ থাকে?': 'আমাদের পণ্য সরাসরি খামার থেকে সংগ্রহ করে কোল্ড-চেইন বজায় রেখে প্যাকেজিং করা হয়, ফলে সাধারণ রেফ্রিজারেশনে ৩-৭ দিন সম্পূর্ণ ফ্রেশ ও ক্রিস্পি থাকে।'
};

export default function CustomerSupportChat({ currentUser, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('gb_chat_messages');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 1,
        sender: 'support',
        name: 'GreenBasket Support',
        text: 'স্বাগতম! 🌱 GreenBasket লাইভ সাপোর্টে আপনাকে স্বাগতম। আপনার অর্ডার বা কোনো পণ্য নিয়ে যেকোনো প্রশ্ন থাকলে নিচে লিখুন বা নিচের অপশনগুলোতে ক্লিক করুন।',
        time: 'Just now'
      }
    ];
  });
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem('gb_chat_messages', JSON.stringify(messages));
    } catch (e) {}
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleOpen = () => {
    setIsOpen(true);
    setUnreadCount(0);
  };

  const handleSend = (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      name: currentUser?.name || 'Customer',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');

    setIsTyping(true);

    setTimeout(() => {
      let replyText = BOT_RESPONSES[query];
      if (!replyText) {
        const lower = query.toLowerCase();
        if (lower.includes('order') || lower.includes('ট্র্যাক') || lower.includes('track')) {
          replyText = 'আপনার অর্ডার ট্র্যাক করতে উপরের "Track Parcel Live" মেনু থেকে লাইভ জিপিএস লোকেশন দেখতে পারেন।';
        } else if (lower.includes('help') || lower.includes('সাহায্য') || lower.includes('call') || lower.includes('ফোন')) {
          replyText = 'আমাদের হটলাইন প্রতিদিন সকাল ৮টা থেকে রাত ১০টা পর্যন্ত খোলা রয়েছে: +880 1712-345678। এছাড়া যেকোনো সময় এখানে মেসেজ দিতে পারেন।';
        } else if (lower.includes('discount') || lower.includes('promo') || lower.includes('অফার')) {
          replyText = '🎉 নতুন কাস্টমারদের জন্য প্রোমোকোড GREEN20 ব্যবহার করলে পাচ্ছেন ফ্ল্যাট ২০% ছাড়!';
        } else {
          replyText = `ধন্যবাদ আপনার মেসেজের জন্য! আমাদের প্রতিনিধি খুব দ্রুত আপনার সাথে যোগাযোগ করবেন। জরুরি প্রয়োজনে আমাদের হটলাইন +880 1712-345678-এ কল করতে পারেন।`;
        }
      }

      const botMsg = {
        id: Date.now() + 1,
        sender: 'support',
        name: 'Support Agent',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 850);
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
              height: '520px',
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
                    Active Now (Replies in seconds)
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close Chat"
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

            {/* Quick Prompts */}
            <div
              style={{
                background: '#ffffff',
                borderTop: '1px solid #edf2e8',
                padding: '8px 12px',
                display: 'flex',
                gap: '6px',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                scrollbarWidth: 'none'
              }}
            >
              {QUICK_PROMPTS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleSend(q)}
                  style={{
                    background: '#f2f7ec',
                    border: '1px solid #d7e4cc',
                    color: '#284c13',
                    padding: '5px 10px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#e3eed6'}
                  onMouseLeave={e => e.currentTarget.style.background = '#f2f7ec'}
                >
                  {q}
                </button>
              ))}
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
                padding: '10px 14px',
                background: '#ffffff',
                borderTop: '1px solid #e5ede0'
              }}
            >
              <input
                type="text"
                placeholder="এখানে মেসেজ লিখুন..."
                value={input}
                onChange={e => setInput(e.target.value)}
                style={{
                  flex: 1,
                  border: '1px solid #d5decb',
                  borderRadius: '10px',
                  padding: '9px 12px',
                  fontSize: '12px',
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
                  width: '36px',
                  height: '36px',
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
