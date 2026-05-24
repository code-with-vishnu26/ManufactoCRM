import { useState } from 'react';
import { motion } from 'framer-motion';
import { MdSearch, MdBook, MdContactSupport, MdCheck } from 'react-icons/md';
import toast from 'react-hot-toast';

const ARTICLES = [
  { id: 1, title: 'How to seed the mock data & log in', cat: 'Getting Started', views: 420 },
  { id: 2, title: 'Managing roles and custom permissions schemas', cat: 'Admin Controls', views: 180 },
  { id: 3, title: 'Using the AI assistant to write sales emails', cat: 'AI Features', views: 320 },
  { id: 4, title: 'Creating custom lead pipelines and custom kanban statuses', cat: 'CRM Settings', views: 240 },
  { id: 5, title: 'Configuring webhooks and automated notifications', cat: 'Integrations', views: 95 }
];

export default function HelpCenter() {
  const [search, setSearch] = useState('');
  const [ticket, setTicket] = useState({ subject: '', desc: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const filteredArticles = ARTICLES.filter(a => a.title.toLowerCase().includes(search.toLowerCase()));

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setSuccess(true);
    toast.success('Your support request has been logged successfully!');
    setTicket({ subject: '', desc: '' });
  };

  return (
    <div style={{ background: 'var(--pub-bg)', color: 'var(--pub-text)', fontFamily: "'Inter', sans-serif", minHeight: '100vh', padding: '6rem 2rem 4rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{ display: 'inline-block', background: 'var(--pub-badge-pill-bg)', border: '1px solid var(--pub-badge-pill-border)', borderRadius: 100, padding: '6px 18px', fontSize: '0.82rem', color: 'var(--pub-badge-pill-text)', fontWeight: 600, marginBottom: '1.5rem' }}>Help Center</span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, marginBottom: '1.2rem', color: 'var(--pub-text)' }}>How can we help you?</h1>
          <p style={{ color: 'var(--pub-text-sub)', fontSize: '1.1rem', maxWidth: 580, margin: '0 auto' }}>
            Find helpful documentation, tutorials, and support articles, or file a direct support ticket.
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '4rem', maxWidth: 680, margin: '0 auto 4rem' }}>
          <MdSearch style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--pub-text-muted)' }} size={22} />
          <input type="text" placeholder="Search documentation, guides..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'var(--pub-input-bg)', border: '1px solid var(--pub-input-border)', borderRadius: 16, color: 'var(--pub-text)', fontSize: '1rem', outline: 'none' }} />
        </div>

        {/* Help Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'start', marginBottom: '5rem' }}>
          {/* Documentation List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--pub-text)' }}>
              <MdBook size={24} color="var(--accent-blue)" /> Popular Articles
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredArticles.map(a => (
                <div key={a.id} style={{
                  padding: '1.2rem 1.5rem', background: 'var(--pub-card-bg)', border: '1px solid var(--pub-card-border)', borderRadius: 16,
                  cursor: 'pointer', transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }} onClick={() => toast.success(`Loading article: "${a.title}"`)}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.2rem', color: 'var(--pub-text)' }}>{a.title}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-blue)', background: 'var(--pub-badge-pill-bg)', padding: '2px 8px', borderRadius: 40 }}>{a.cat}</span>
                  </div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--pub-text-muted)' }}>{a.views} views</span>
                </div>
              ))}
            </div>
          </div>

          {/* Support Ticket */}
          <div style={{ background: 'var(--pub-card-bg)', border: '1px solid var(--pub-card-border)', borderRadius: 24, padding: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--pub-text)' }}>
              <MdContactSupport size={24} color="var(--accent-blue)" /> Open a Ticket
            </h2>
            <form onSubmit={handleSupportSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--pub-text-sub)', marginBottom: '0.4rem' }}>Subject *</label>
                <input required style={{ width: '100%', padding: '0.8rem 1rem', background: 'var(--pub-input-bg)', border: '1px solid var(--pub-input-border)', borderRadius: 10, color: 'var(--pub-text)', outline: 'none' }}
                  type="text" placeholder="e.g. Integration with SAP ERP" value={ticket.subject} onChange={e => setTicket({ ...ticket, subject: e.target.value })} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--pub-text-sub)', marginBottom: '0.4rem' }}>Description *</label>
                <textarea required rows={4} style={{ width: '100%', padding: '0.8rem 1rem', background: 'var(--pub-input-bg)', border: '1px solid var(--pub-input-border)', borderRadius: 10, color: 'var(--pub-text)', outline: 'none', resize: 'vertical' }}
                  placeholder="Detail your request..." value={ticket.desc} onChange={e => setTicket({ ...ticket, desc: e.target.value })} />
              </div>
              <button type="submit" disabled={loading} style={{
                padding: '1rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: 12,
                color: '#fff', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem'
              }}>
                {loading ? (
                  <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                ) : success ? (
                  <>Ticket Created! <MdCheck size={18} /></>
                ) : (
                  <>Submit Ticket</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
