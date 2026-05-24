import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdChat, MdClose, MdSend, MdSmartToy } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const PRESETS = [
  {
    q: 'Ask About Features',
    a: 'ManufactoCRM AI provides high-end tools for manufacturing sales teams, including Kanban Pipelines, detailed BDA tracking, automated report generation, and role-based permissions for Admins, Team Leads, and Sales Executives.'
  },
  {
    q: 'How does lead management work?',
    a: 'Our Lead Management system lets you manage all details of a client lead: company name, industry, priority, estimated deal value, and notes. Sales Executives can update statuses, add custom follow-up notes, and track priority badges.'
  },
  {
    q: 'How do I assign leads?',
    a: 'Admins and Team Leads can assign leads directly to Sales Executives via the BDA dropdown selector on the Lead details page, or in the Kanban Pipeline boards.'
  },
  {
    q: 'What is the AI assistant?',
    a: 'ManufactoCRM includes built-in AI tools that can generate customized Sales Pitches, summarize complex client negotiation histories instantly, and generate executive summaries for leadership reports.'
  },
  {
    q: 'Pricing Help',
    a: 'We offer flexible tiers: Starter ($49/mo per user), Professional ($99/mo per user with AI features), and Enterprise (Custom pricing with dedicated clusters and custom AI models). Contact Sales for a free demo!'
  },
  {
    q: 'Contact Sales',
    a: 'You can reach our enterprise manufacturing sales team directly at sales@manufactocrm.ai or submit a request on our Contact page!'
  }
];

export default function AIAssistantWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Hello ${user ? user.name.split(' ')[0] : 'there'}! I am your ManufactoCRM AI assistant. How can I help you succeed today?`,
      time: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg = { sender: 'user', text, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Trigger typing
    setIsTyping(true);

    // AI logic (mock typing)
    setTimeout(() => {
      let replyText = "I'm here to assist you with ManufactoCRM AI. You can ask about our pricing plans, lead assigning, or custom AI report generators! Feel free to click one of our quick actions below.";
      
      const normalizedQuery = text.toLowerCase();
      // Check preset matches
      const match = PRESETS.find(p => 
        normalizedQuery.includes(p.q.toLowerCase()) || 
        p.q.toLowerCase().includes(normalizedQuery)
      );

      if (match) {
        replyText = match.a;
      } else if (normalizedQuery.includes('pricing') || normalizedQuery.includes('cost') || normalizedQuery.includes('plan')) {
        replyText = PRESETS.find(p => p.q === 'Pricing Help').a;
      } else if (normalizedQuery.includes('lead') || normalizedQuery.includes('pipeline') || normalizedQuery.includes('kanban')) {
        replyText = PRESETS.find(p => p.q === 'How does lead management work?').a;
      } else if (normalizedQuery.includes('assign') || normalizedQuery.includes('employee')) {
        replyText = PRESETS.find(p => p.q === 'How do I assign leads?').a;
      } else if (normalizedQuery.includes('ai') || normalizedQuery.includes('assistant') || normalizedQuery.includes('report')) {
        replyText = PRESETS.find(p => p.q === 'What is the AI assistant?').a;
      } else if (normalizedQuery.includes('contact') || normalizedQuery.includes('sales') || normalizedQuery.includes('email')) {
        replyText = PRESETS.find(p => p.q === 'Contact Sales').a;
      } else if (normalizedQuery.includes('hello') || normalizedQuery.includes('hi')) {
        replyText = `Hi! Hope your sales pipeline is active today. How can I guide you through ManufactoCRM AI?`;
      }

      setMessages(prev => [...prev, { sender: 'bot', text: replyText, time: new Date() }]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }}>
      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 30px rgba(99,102,241,0.45)',
          position: 'relative'
        }}
      >
        {isOpen ? <MdClose size={24} /> : <MdChat size={24} />}
        {!isOpen && (
          <span style={{
            position: 'absolute',
            top: -2,
            right: -2,
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: '#ef4444',
            border: '2px solid #fff',
            animation: 'pulse 1.5s infinite'
          }} />
        )}
      </motion.button>

      {/* Chatbot Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              bottom: 72,
              right: 0,
              width: 380,
              height: 520,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: 16,
              boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '16px 20px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <MdSmartToy size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: 0, lineHeight: 1.2 }}>Manufacto AI</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
                    <span style={{ fontSize: 10, opacity: 0.85, fontWeight: 500 }}>Online Assistant</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.8, padding: 4 }}
              >
                <MdClose size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div style={{
              flex: 1,
              padding: 20,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              background: 'var(--bg-primary)'
            }}>
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: m.sender === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                    background: m.sender === 'user' ? 'var(--accent-blue)' : 'var(--bg-secondary)',
                    color: m.sender === 'user' ? '#fff' : 'var(--text-primary)',
                    fontSize: 13,
                    lineHeight: 1.5,
                    border: m.sender === 'bot' ? '1px solid var(--border-color)' : 'none',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                  }}>
                    {m.text}
                  </div>
                  <span style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 4, padding: '0 2px' }}>
                    {m.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}

              {isTyping && (
                <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-secondary)', padding: '10px 16px', borderRadius: '12px 12px 12px 0', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>AI is typing</span>
                  <div style={{ display: 'flex', gap: 3 }}>
                    <span className="dot" style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent-purple)', animation: 'bounce 1.4s infinite ease-in-out' }} />
                    <span className="dot" style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent-purple)', animation: 'bounce 1.4s infinite ease-in-out 0.2s' }} />
                    <span className="dot" style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--accent-purple)', animation: 'bounce 1.4s infinite ease-in-out 0.4s' }} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Replies */}
            <div style={{
              padding: '10px 16px 6px',
              background: 'var(--bg-secondary)',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              gap: 8,
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              scrollbarWidth: 'none'
            }} className="no-scrollbar">
              {PRESETS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(p.q)}
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-secondary)',
                    borderRadius: 100,
                    padding: '6px 12px',
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { e.target.style.borderColor = 'var(--accent-blue)'; e.target.style.color = 'var(--accent-blue)'; }}
                  onMouseLeave={e => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.color = 'var(--text-secondary)'; }}
                >
                  {p.q}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }}
              style={{
                padding: 12,
                background: 'var(--bg-secondary)',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                gap: 8,
                alignItems: 'center'
              }}
            >
              <input
                type="text"
                placeholder="Ask assistant something..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                style={{
                  flex: 1,
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 10,
                  padding: '10px 14px',
                  color: 'var(--text-primary)',
                  fontSize: 13,
                  outline: 'none',
                  transition: 'border 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent-blue)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
              />
              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  width: 38,
                  height: 38,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(99,102,241,0.2)'
                }}
              >
                <MdSend size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1.0); }
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
