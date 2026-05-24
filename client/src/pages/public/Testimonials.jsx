import { motion } from 'framer-motion';
import { MdStar, MdBusiness, MdArrowUpward } from 'react-icons/md';

const STATS = [
  { val: '40%', label: 'Reduction in Sales Cycle' },
  { val: '2.5x', label: 'Increase in Lead Conversion' },
  { val: '₹120Cr+', label: 'Deals Managed Annually' },
  { val: '99.2%', label: 'Customer Retention Rate' }
];

const REVIEWS = [
  {
    quote: "ManufactoCRM AI has completely transformed how our sales executives operate. We previously lost tracks of complex auto OEM leads; now our follow-up is perfectly managed by the AI scoring system.",
    author: "Rajesh Singhal",
    role: "Director of Sales",
    comp: "IndoForge Automotive",
    init: "IA",
    color: "#6366f1"
  },
  {
    quote: "Integrating our SAP ERP with the CRM took less than a week. The level of visibility our team leads and administrators have into estimated deal metrics has saved us millions.",
    author: "Sanjay Deshmukh",
    role: "Chief Operating Officer",
    comp: "MetaloFab heavy Industries",
    init: "MI",
    color: "#8b5cf6"
  },
  {
    quote: "The auto-generated Sales Pitches and Summaries are extremely contextual. Our BDAs save hours of research before calling top-tier pharmaceutical procurement officers.",
    author: "Dr. Nisha Gokhale",
    role: "VP of Business Development",
    comp: "AstraBio Pharma Labs",
    init: "AB",
    color: "#06b6d4"
  }
];

export default function Testimonials() {
  return (
    <div style={{ background: '#08081a', color: '#fff', fontFamily: "'Inter', sans-serif", minHeight: '100vh', padding: '6rem 2rem 4rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <span style={{ display: 'inline-block', background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 100, padding: '6px 18px', fontSize: '0.82rem', color: '#a5b4fc', fontWeight: 500, marginBottom: '1.5rem' }}>Testimonials</span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)', fontWeight: 900, marginBottom: '1.2rem' }}>Trusted by Industry Leaders</h1>
          <p style={{ color: 'rgba(255,255,255,0.58)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>
            See how major manufacturing enterprises, auto OEM suppliers, and heavy factories scaled their sales pipelines.
          </p>
        </div>

        {/* Growth Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '6rem' }}>
          {STATS.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem', marginBottom: '0.4rem' }}>
                {stat.val} <MdArrowUpward size={20} color="#10b981" />
              </div>
              <div style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.5)' }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Customer Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {REVIEWS.map((rev, i) => (
            <motion.div key={i} whileHover={{ y: -6 }}
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 24, padding: '2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', gap: '0.2rem', marginBottom: '1.2rem' }}>
                  {[...Array(5)].map((_, s) => <MdStar key={s} color="#f59e0b" size={20} />)}
                </div>
                <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, fontStyle: 'italic', marginBottom: '2rem' }}>
                  "{rev.quote}"
                </p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '1.2rem' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: `linear-gradient(135deg, ${rev.color}, ${rev.color}aa)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                  {rev.init}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '0.1rem' }}>{rev.author}</h4>
                  <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MdBusiness /> {rev.role}, {rev.comp}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
