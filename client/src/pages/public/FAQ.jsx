import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdSearch, MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';

const FAQ_DATA = [
  {
    q: 'What is ManufactoCRM AI?',
    a: 'ManufactoCRM AI is a highly tailored CRM and Business Development Associate (BDA) Management system built specifically for manufacturing companies. It incorporates AI features, granular role hierarchies, pipeline visualizations, and deep lead insights to accelerate the B2B sales cycle.',
    cat: 'General'
  },
  {
    q: 'How does the AI BDA Assistant work?',
    a: 'The built-in AI Assistant analyzes lead details (such as products, estimated deal value, notes, and activity log) to automatically generate personalized cold emails, write specialized sales pitches, compile summaries, and suggest strategic next actions.',
    cat: 'AI Features'
  },
  {
    q: 'Can I integrate my existing ERP system?',
    a: 'Yes, ManufactoCRM AI supports deep integrations with major ERP systems like SAP, Oracle, and Microsoft Dynamics, enabling you to synchronize customer lists, order records, and inventory metrics in real-time.',
    cat: 'Integrations'
  },
  {
    q: 'What roles and permissions are supported?',
    a: 'We support 7 granular roles including: Super Admin, Enterprise Admin, Team Lead, Sales Exec, BDA, Support Exec, and Viewer. Admins can customize exact permission schemas dynamically from the Role Settings panel.',
    cat: 'Security & Access'
  },
  {
    q: 'Is my manufacturing data secure?',
    a: 'Absolutely. We enforce industry-standard AES-256 encryption at rest, TLS 1.3 in transit, automated multi-region backups, and dynamic JWT role checking on every single API endpoint to ensure full data isolation.',
    cat: 'Security & Access'
  },
  {
    q: 'How can I try the platform?',
    a: 'You can register for a free trial directly from our home page, or log in using one of our demo credentials (admin, teamlead, or executive) to explore the fully functional dashboard immediately.',
    cat: 'General'
  }
];

export default function FAQ() {
  const [activeCat, setActiveCat] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(null);

  const categories = ['All', 'General', 'AI Features', 'Integrations', 'Security & Access'];

  const filteredFaqs = FAQ_DATA.filter(faq => {
    const matchesCat = activeCat === 'All' || faq.cat === activeCat;
    const matchesSearch = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ background: 'var(--pub-bg)', color: 'var(--pub-text)', fontFamily: "'Inter', sans-serif", minHeight: '100vh', padding: '6rem 2rem 4rem' }}>
      <div style={{ maxWidth: 840, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{ display: 'inline-block', background: 'var(--pub-badge-pill-bg)', border: '1px solid var(--pub-badge-pill-border)', borderRadius: 100, padding: '6px 18px', fontSize: '0.82rem', color: 'var(--pub-badge-pill-text)', fontWeight: 600, marginBottom: '1.5rem' }}>FAQ</span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, marginBottom: '1.2rem', color: 'var(--pub-text)' }}>Frequently Asked Questions</h1>
          <p style={{ color: 'var(--pub-text-sub)', fontSize: '1.1rem', maxWidth: 580, margin: '0 auto' }}>
            Find answers to commonly asked questions about our AI-powered CRM system, setup, and features.
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ position: 'relative', marginBottom: '2.5rem' }}>
          <MdSearch style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--pub-text-muted)' }} size={22} />
          <input type="text" placeholder="Search FAQ topics..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'var(--pub-input-bg)', border: '1px solid var(--pub-input-border)', borderRadius: 16, color: 'var(--pub-text)', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }} />
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '2.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => { setActiveCat(cat); setExpandedIndex(null); }} style={{
              padding: '0.5rem 1.2rem', borderRadius: 30, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
              background: activeCat === cat ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'var(--pub-card-bg)',
              color: activeCat === cat ? '#fff' : 'var(--pub-text-sub)',
              border: activeCat === cat ? 'none' : '1px solid var(--pub-card-border)',
              transition: 'all 0.2s'
            }}>{cat}</button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredFaqs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--pub-text-muted)' }}>
              No matches found. Try searching for something else.
            </div>
          ) : (
            filteredFaqs.map((faq, i) => {
              const isOpen = expandedIndex === i;
              return (
                <div key={i} style={{ background: 'var(--pub-faq-bg)', border: '1px solid var(--pub-faq-border)', borderRadius: 16, overflow: 'hidden', transition: 'border-color 0.2s' }}>
                  <button onClick={() => setExpandedIndex(isOpen ? null : i)} style={{
                    width: '100%', padding: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left', color: 'var(--pub-text)'
                  }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 700 }}>{faq.q}</span>
                    {isOpen ? <MdKeyboardArrowUp size={22} color="#818cf8" /> : <MdKeyboardArrowDown size={22} color="var(--pub-text-muted)" />}
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        style={{ borderTop: '1px solid var(--pub-section-divider)' }}>
                        <p style={{ padding: '1.5rem', fontSize: '0.95rem', color: 'var(--pub-text-sub)', lineHeight: 1.7 }}>
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
