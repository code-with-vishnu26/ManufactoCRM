import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdSearch, MdChevronRight, MdClose, MdAccessTime } from 'react-icons/md';
import toast from 'react-hot-toast';

const POSTS = [
  {
    id: 1,
    title: 'Transforming B2B Manufacturing Sales Cycles with Predictive AI',
    excerpt: 'Discover how top-tier manufacturing companies are leveraging predictive lead scoring to cut sales cycles by 40%...',
    body: 'In B2B manufacturing sales, cycles are notoriously long, often extending up to six months. With the advent of artificial intelligence, teams can now predict lead qualification rates with extreme accuracy. By analyzing variables like company size, industry category, and initial communications, AI modules can isolate high-value opportunities from cold leads, empowering sales executives to direct their energy exactly where it matters. In this article, we break down step-by-step methodologies to integrate predictive models into your weekly pipeline review.',
    cat: 'AI & Sales',
    date: 'May 20, 2026',
    readTime: '6 min read',
    author: 'Arjun Mehta'
  },
  {
    id: 2,
    title: 'Managing High-Performing BDA Teams in the Modern ERP Era',
    excerpt: 'Connecting CRM databases to your underlying SAP or Microsoft Dynamics ERP to ensure a unified client experience...',
    body: 'Sales reps are often bogged down by duplicate data entries across CRM and ERP platforms. Bridging this gap with deep system sync guarantees that client orders, payment schedules, and inventory levels are visible directly in the lead view. We share a checklist to evaluate custom integrations, optimize webhook listeners, and train your business development associates on real-time data transparency.',
    cat: 'Integrations',
    date: 'May 15, 2026',
    readTime: '5 min read',
    author: 'Divya Krishnan'
  },
  {
    id: 3,
    title: 'Why Generic CRMs Fail B2B Manufacturing Enterprises',
    excerpt: 'Standard HubSpot or Salesforce pipelines lack the structural nuances needed for heavy machinery and manufacturing sales...',
    body: 'Generic CRMs assume every sales cycle behaves like a typical software subscription. However, manufacturing involves heavy technical specifications, raw material price fluctuations, extended trial stages, and multiple corporate stakeholders. That is why a highly tailored solution, incorporating customized pipelines, industry-specific metadata, and specialized AI assistance, is critical to scale manufacturing revenues.',
    cat: 'CRM Strategy',
    date: 'May 10, 2026',
    readTime: '8 min read',
    author: 'Rohan Gupta'
  }
];

export default function Blog() {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [readingPost, setReadingPost] = useState(null);

  const categories = ['All', 'AI & Sales', 'Integrations', 'CRM Strategy'];

  const filteredPosts = POSTS.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCat === 'All' || post.cat === activeCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div style={{ background: 'var(--pub-bg)', color: 'var(--pub-text)', fontFamily: "'Inter', sans-serif", minHeight: '100vh', padding: '6rem 2rem 4rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <span style={{ display: 'inline-block', background: 'var(--pub-badge-pill-bg)', border: '1px solid var(--pub-badge-pill-border)', borderRadius: 100, padding: '6px 18px', fontSize: '0.82rem', color: 'var(--pub-badge-pill-text)', fontWeight: 600, marginBottom: '1.5rem' }}>Blog</span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)', fontWeight: 900, marginBottom: '1.2rem', color: 'var(--pub-text)' }}>Insights, News & Strategies</h1>
          <p style={{ color: 'var(--pub-text-sub)', fontSize: '1.1rem', maxWidth: 580, margin: '0 auto' }}>
            Learn how to leverage modern AI, granular CRM workflows, and team structure to drive manufacturing revenue.
          </p>
        </div>

        {/* Filters and Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '3rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCat(cat)} style={{
                padding: '0.5rem 1.2rem', borderRadius: 30, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                background: activeCat === cat ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'var(--pub-card-bg)',
                color: activeCat === cat ? '#fff' : 'var(--pub-text-sub)', transition: 'all 0.2s',
                border: activeCat === cat ? 'none' : '1px solid var(--pub-card-border)'
              }}>{cat}</button>
            ))}
          </div>
          <div style={{ position: 'relative', width: '100%', maxWidth: 300 }}>
            <MdSearch style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input type="text" placeholder="Search articles..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.4rem', background: 'var(--pub-input-bg)', border: '1px solid var(--pub-input-border)', borderRadius: 12, color: 'var(--pub-text)', outline: 'none' }} />
          </div>
        </div>

        {/* Blog Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {filteredPosts.map((post) => (
            <motion.div key={post.id} whileHover={{ y: -6, borderColor: 'rgba(99,102,241,0.3)' }}
              style={{
                background: 'var(--pub-card-bg)', border: '1px solid var(--pub-card-border)', borderRadius: 24, padding: '2rem',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer'
              }} onClick={() => setReadingPost(post)}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 600, background: 'rgba(99,102,241,0.1)', padding: '2px 10px', borderRadius: 40 }}>{post.cat}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--pub-text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}><MdAccessTime /> {post.readTime}</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--pub-text)', marginBottom: '0.8rem', lineHeight: 1.4 }}>{post.title}</h3>
                <p style={{ color: 'var(--pub-text-sub)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>{post.excerpt}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '1rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--pub-text-sub)' }}>By {post.author}</span>
                <span style={{ color: '#818cf8', fontWeight: 700, fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>Read Article <MdChevronRight /></span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal Reader */}
        <AnimatePresence>
          {readingPost && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '2rem' }}
              onClick={() => setReadingPost(null)}>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                style={{ width: '100%', maxWidth: 740, background: 'var(--pub-bg)', border: '1px solid var(--pub-card-border)', borderRadius: 24, padding: '2.5rem', position: 'relative', overflowY: 'auto', maxHeight: '85vh' }}
                onClick={e => e.stopPropagation()}>
                <button onClick={() => setReadingPost(null)} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
                  <MdClose size={20} />
                </button>
                <div style={{ marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: 600, background: 'rgba(99,102,241,0.1)', padding: '4px 12px', borderRadius: 40 }}>{readingPost.cat}</span>
                  <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', marginLeft: '1rem' }}>{readingPost.date} · {readingPost.readTime}</span>
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '1.2rem', color: 'var(--pub-text)', lineHeight: 1.3 }}>{readingPost.title}</h2>
                <div style={{ fontSize: '0.92rem', color: '#cbd5e1', fontWeight: 600, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                  By {readingPost.author} (Product & Tech Leadership Team)
                </div>
                <p style={{ color: 'var(--pub-text-sub)', fontSize: '1.05rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                  {readingPost.body}
                </p>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
