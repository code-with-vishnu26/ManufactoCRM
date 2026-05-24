import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MdPeople, MdSmartToy, MdViewKanban, MdBarChart,
  MdGroups, MdNotifications, MdAdminPanelSettings,
  MdOutlineFileDownload, MdCheck, MdArrowForward,
  MdRocketLaunch
} from 'react-icons/md';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const features = [
  {
    icon: MdPeople,
    title: 'Lead Management',
    tagline: 'Never lose a hot lead again',
    desc: 'Capture, qualify, and manage every manufacturing lead from inquiry to order. AI scoring tells your team exactly who needs attention right now.',
    color: '#4f46e5',
    bullets: [
      'AI lead scoring based on 40+ manufacturing signals',
      'Automatic lead capture from email, website, WhatsApp',
      'Custom qualification checklists for manufacturing specs',
    ],
  },
  {
    icon: MdSmartToy,
    title: 'AI Sales Assistant',
    tagline: 'Your 24/7 sales co-pilot',
    desc: 'Generate follow-up emails, meeting summaries, proposals, and objection-handling scripts — all trained on manufacturing industry data in Hindi and English.',
    color: '#8b5cf6',
    bullets: [
      'Context-aware email generation with lead history',
      'Auto-summarize meetings and update CRM notes',
      'Smart follow-up scheduling based on lead behavior',
    ],
  },
  {
    icon: MdViewKanban,
    title: 'Kanban Pipeline',
    tagline: 'See your entire sales pipeline at a glance',
    desc: 'Drag-and-drop sales pipeline with stages built for manufacturing sales cycles — from first inquiry to purchase order. Customize stages to match your process.',
    color: '#06b6d4',
    bullets: [
      'Custom pipeline stages for manufacturing sales',
      'Drag-and-drop deal management with bulk actions',
      'Stage-based automation triggers and alerts',
    ],
  },
  {
    icon: MdBarChart,
    title: 'Analytics Dashboard',
    tagline: 'Data-driven manufacturing sales decisions',
    desc: 'Real-time dashboards with sales performance, pipeline health, team activity, and conversion analytics — everything a VP of Sales needs in one place.',
    color: '#10b981',
    bullets: [
      'Real-time pipeline velocity and conversion tracking',
      'Team performance comparison and leaderboards',
      'Custom reports for management presentations',
    ],
  },
  {
    icon: MdGroups,
    title: 'Team Management',
    tagline: 'Align your entire sales organization',
    desc: 'Manage your sales team, assign territories, set targets, track activities, and collaborate on deals — from field sales to inside sales to management.',
    color: '#f59e0b',
    bullets: [
      'Territory and account assignment with workload balancing',
      'Activity tracking: calls, emails, site visits',
      'Sales target setting with progress dashboards',
    ],
  },
  {
    icon: MdNotifications,
    title: 'Smart Notifications',
    tagline: 'Act at the perfect moment, every time',
    desc: "AI-powered notifications alert your team when leads go cold, when competitors are contacted, or when a deal is at risk — before it's too late.",
    color: '#ef4444',
    bullets: [
      'AI-detected "at risk" deals with suggested actions',
      'WhatsApp, email, and mobile push alerts',
      'Configurable escalation rules for management',
    ],
  },
  {
    icon: MdAdminPanelSettings,
    title: 'Role-Based Access',
    tagline: 'The right data to the right people',
    desc: 'Granular role-based access control ensures sensitive pricing, competitor data, and customer information stays protected and properly governed.',
    color: '#a78bfa',
    bullets: [
      'Granular permissions: view, edit, export per data type',
      'Territory-based data isolation for large teams',
      'Audit logs for all sensitive data access',
    ],
  },
  {
    icon: MdOutlineFileDownload,
    title: 'Data Export & Reports',
    tagline: 'Your data, your way',
    desc: 'Export pipeline reports, lead lists, customer data, and analytics to Excel, PDF, or connect via API to your ERP, accounting, or marketing systems.',
    color: '#06b6d4',
    bullets: [
      'One-click export to Excel, PDF, CSV formats',
      'Scheduled automated report emails to management',
      'REST API for integration with SAP, Tally, custom ERPs',
    ],
  },
];

export default function Features() {
  return (
    <div style={{ background: 'var(--pub-bg)', color: 'var(--pub-text)', overflowX: 'hidden', fontFamily: "'Inter', sans-serif" }}>

      {/* ====== HERO ====== */}
      <section style={{ position: 'relative', padding: '100px 24px 80px', overflow: 'hidden', textAlign: 'center' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <div style={{ position: 'absolute', top: '-10%', left: '20%', width: '60%', height: '70%', background: 'radial-gradient(ellipse, rgba(79,70,229,0.12) 0%, transparent 70%)' }} />
        </div>
        <div style={{ maxWidth: 760, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'inline-block', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 100, padding: '5px 16px', marginBottom: 20 }}>
              <span style={{ fontSize: 12, color: '#8b5cf6', fontWeight: 700, letterSpacing: '0.08em' }}>FEATURES</span>
            </div>
            <h1 style={{ fontSize: 'clamp(34px, 6vw, 64px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.1, marginBottom: 20, color: 'var(--pub-text)' }}>
              Everything you need to<br />
              <span style={{ background: 'linear-gradient(135deg, #818cf8, #a78bfa, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                dominate manufacturing sales
              </span>
            </h1>
            <p style={{ fontSize: 'clamp(16px, 2vw, 19px)', color: 'var(--pub-text-sub)', lineHeight: 1.7, marginBottom: 36 }}>
              8 powerful features, all deeply integrated, all built specifically for manufacturing sales teams. No bolt-on add-ons. No enterprise complexity.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" style={{
                background: 'linear-gradient(135deg, #4f46e5, #8b5cf6)',
                color: 'white', textDecoration: 'none',
                padding: '12px 28px', borderRadius: 10, fontWeight: 700, fontSize: 15,
                boxShadow: '0 8px 25px rgba(79,70,229,0.35)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <MdRocketLaunch size={18} /> Try Now
              </Link>
              <Link to="/contact?demo=true" style={{
                background: 'var(--pub-card-bg)', border: '1px solid var(--pub-card-border)',
                color: 'var(--pub-text)', textDecoration: 'none',
                padding: '12px 24px', borderRadius: 10, fontWeight: 600, fontSize: 15,
              }}>
                Request Demo
              </Link>
              <button
                onClick={() => document.getElementById('features-list')?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  background: 'transparent', border: '1px solid var(--pub-card-border)',
                  color: 'var(--pub-text-sub)',
                  padding: '12px 24px', borderRadius: 10, fontWeight: 600, fontSize: 15, cursor: 'pointer',
                }}
              >
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====== FEATURES ALTERNATING ====== */}
      <section id="features-list" style={{ padding: '60px 24px 100px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 80 }}>
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="feature-row"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 60,
                alignItems: 'center',
                direction: i % 2 === 0 ? 'ltr' : 'rtl',
              }}
            >
              {/* Text side */}
              <div style={{ direction: 'ltr' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${f.color}18`, border: `1px solid ${f.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <f.icon size={24} color={f.color} />
                  </div>
                  <span style={{ fontSize: 12, color: f.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {String(i + 1).padStart(2, '0')} · {f.tagline}
                  </span>
                </div>
                <h2 style={{ fontSize: 'clamp(26px, 3vw, 40px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 14, color: 'var(--pub-text)' }}>{f.title}</h2>
                <p style={{ color: 'var(--pub-text-sub)', fontSize: 16, lineHeight: 1.75, marginBottom: 24 }}>{f.desc}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                  {f.bullets.map((b, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: `${f.color}18`, border: `1px solid ${f.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                        <MdCheck size={12} color={f.color} />
                      </div>
                      <span style={{ color: 'var(--pub-text-sub)', fontSize: 14, lineHeight: 1.6 }}>{b}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <Link to="/register" style={{
                    background: `linear-gradient(135deg, ${f.color}, ${f.color}cc)`,
                    color: 'white', textDecoration: 'none',
                    padding: '10px 22px', borderRadius: 9, fontWeight: 700, fontSize: 14,
                    display: 'flex', alignItems: 'center', gap: 6,
                    boxShadow: `0 4px 16px ${f.color}35`,
                  }}>
                    Try Now <MdArrowForward size={15} />
                  </Link>
                  <Link to="/contact?demo=true" style={{
                    background: 'var(--pub-card-bg)', border: '1px solid var(--pub-card-border)',
                    color: 'var(--pub-text-sub)', textDecoration: 'none',
                    padding: '10px 22px', borderRadius: 9, fontWeight: 600, fontSize: 14,
                  }}>
                    Learn More
                  </Link>
                </div>
              </div>

              {/* Visual card side */}
              <div style={{ direction: 'ltr' }}>
                <motion.div
                  whileHover={{ y: -8, rotate: i % 2 === 0 ? 1 : -1 }}
                  style={{
                    background: 'var(--pub-card-bg)',
                    border: `1px solid ${f.color}30`,
                    borderRadius: 20, padding: 28,
                    boxShadow: `0 20px 60px ${f.color}15`,
                    minHeight: 260,
                    position: 'relative', overflow: 'hidden',
                  }}
                >
                  {/* Background accent */}
                  <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, background: `radial-gradient(circle, ${f.color}15, transparent)`, borderRadius: '50%' }} />

                  {/* Feature number */}
                  <div style={{ fontSize: 80, fontWeight: 900, color: `${f.color}15`, position: 'absolute', right: 20, bottom: 10, lineHeight: 1, fontFamily: 'monospace' }}>
                    {String(i + 1).padStart(2, '0')}
                  </div>

                  {/* Icon */}
                  <div style={{ width: 64, height: 64, borderRadius: 16, background: `${f.color}15`, border: `1px solid ${f.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, position: 'relative' }}>
                    <f.icon size={34} color={f.color} />
                  </div>

                  {/* Simulated content bars */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ height: 8, background: `${f.color}30`, borderRadius: 4, marginBottom: 8, width: '70%' }} />
                    <div style={{ height: 8, background: 'var(--pub-card-border)', borderRadius: 4, marginBottom: 8, width: '90%' }} />
                    <div style={{ height: 8, background: 'var(--pub-card-border)', borderRadius: 4, width: '55%' }} />
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[40, 65, 50, 80, 55].map((h, k) => (
                      <div key={k} style={{ flex: 1, background: `linear-gradient(to top, ${f.color}50, ${f.color}18)`, borderRadius: 4, height: h }} />
                    ))}
                  </div>

                  {/* Status badge */}
                  <div style={{ position: 'absolute', top: 20, right: 20, background: `${f.color}18`, border: `1px solid ${f.color}40`, borderRadius: 8, padding: '4px 10px', fontSize: 11, fontWeight: 700, color: f.color }}>
                    LIVE
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ====== CTA ====== */}
      <section style={{ padding: '60px 24px 100px', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div style={{ maxWidth: 680, margin: '0 auto', background: 'linear-gradient(135deg, rgba(79,70,229,0.1), rgba(139,92,246,0.07))', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 24, padding: '56px 40px' }}>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 44px)', fontWeight: 900, letterSpacing: '-1px', marginBottom: 16, color: 'var(--pub-text)' }}>
              All 8 features. One platform. 14 days free.
            </h2>
            <p style={{ color: 'var(--pub-text-sub)', fontSize: 17, marginBottom: 32 }}>
              No credit card. No setup fees. Full access from day one.
            </p>
            <Link to="/register" style={{
              background: 'linear-gradient(135deg, #4f46e5, #8b5cf6)',
              color: 'white', textDecoration: 'none',
              padding: '14px 36px', borderRadius: 12, fontWeight: 700, fontSize: 16,
              display: 'inline-flex', alignItems: 'center', gap: 8,
              boxShadow: '0 8px 30px rgba(79,70,229,0.4)',
            }}>
              Get All Features Free <MdArrowForward />
            </Link>
          </div>
        </motion.div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .feature-row {
            grid-template-columns: 1fr !important;
            direction: ltr !important;
          }
        }
      `}</style>
    </div>
  );
}
