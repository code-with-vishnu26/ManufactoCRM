import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdRocketLaunch, MdAutoAwesome, MdInsights, MdPeople,
  MdStar, MdCheckCircle, MdArrowForward, MdBarChart,
  MdNotifications, MdSecurity, MdIntegrationInstructions,
  MdPlayArrow, MdTrendingUp, MdFactory, MdClose, MdPause,
  MdVolumeUp, MdVolumeMute, MdSpeed
} from 'react-icons/md';

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };

const stats = [
  { value: '200+', label: 'Manufacturing Companies' },
  { value: '₹500Cr+', label: 'Revenue Managed' },
  { value: '98%', label: 'Customer Satisfaction' },
  { value: '3x', label: 'Faster Lead Conversion' },
];

const features = [
  { icon: MdAutoAwesome, title: 'AI Lead Scoring', desc: 'Automatically score and prioritize leads using machine learning models trained on manufacturing industry data.' },
  { icon: MdInsights, title: 'Predictive Analytics', desc: 'Forecast revenue, identify churn risks, and uncover growth opportunities with advanced predictive models.' },
  { icon: MdPeople, title: 'Team Collaboration', desc: 'Unified workspace for Admin, Team Leads, and Sales Executives with role-based access and real-time sync.' },
  { icon: MdBarChart, title: 'Sales Pipeline', desc: 'Visual drag-and-drop pipeline with automated follow-up reminders and stage-based workflows.' },
  { icon: MdIntegrationInstructions, title: 'ERP Integration', desc: 'Seamlessly connect with SAP, Oracle, Tally, and other popular ERP systems used in manufacturing.' },
  { icon: MdSecurity, title: 'Enterprise Security', desc: 'SOC2 compliant with end-to-end encryption, audit logs, SSO, and granular permission controls.' },
];

const testimonials = [
  { name: 'Rajesh Sharma', role: 'VP Sales, AutoParts India', text: 'ManufactoCRM AI transformed our sales process. We went from managing leads in spreadsheets to a fully automated pipeline. Revenue up 40% in 6 months.', rating: 5 },
  { name: 'Priya Nair', role: 'MD, Precision Engineering Co.', text: 'The AI insights are genuinely impressive. It predicted which leads would convert a week before our team even called them. Phenomenal accuracy.', rating: 5 },
  { name: 'Vikram Patel', role: 'Sales Director, MetalWorks Ltd', text: 'Best CRM for manufacturing I have used in 15 years. The ERP integration alone saved us 20 hours a week of manual data entry.', rating: 5 },
];

const pricing = [
  { name: 'Starter', price: '₹999', period: '/mo', features: ['5 Users', 'Basic CRM', 'Email Support', '500 Leads/mo', 'Basic Reports'], cta: 'Start Free Trial', highlight: false },
  { name: 'Pro', price: '₹2,499', period: '/mo', features: ['25 Users', 'AI Lead Scoring', 'Priority Support', 'Unlimited Leads', 'Advanced Analytics', 'ERP Integration', 'Custom Workflows'], cta: 'Start Free Trial', highlight: true },
  { name: 'Enterprise', price: 'Custom', period: '', features: ['Unlimited Users', 'Full AI Suite', 'Dedicated Manager', 'Unlimited Everything', 'Custom Integrations', 'SLA Guarantee', 'On-premise option'], cta: 'Contact Sales', highlight: false },
];

export default function Home() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div style={{ background: 'var(--pub-bg)', color: 'var(--pub-text)', fontFamily: "'Inter', sans-serif" }}>
      {/* Hero */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '6rem 2rem 4rem', overflow: 'hidden' }}>
        {/* Background glow */}
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '30%', left: '15%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '20%', right: '10%', width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <motion.div initial="hidden" animate="visible" variants={stagger} style={{ maxWidth: 860, position: 'relative', zIndex: 1 }}>

          <motion.h1 variants={fadeUp} style={{
            fontSize: 'clamp(2.4rem, 6vw, 4.2rem)', fontWeight: 900, lineHeight: 1.1,
            marginBottom: '1.5rem', letterSpacing: '-0.03em',
          }}>
            <span style={{ color: 'var(--pub-text)' }}>AI-Powered CRM for</span>{' '}
            <span style={{
              background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #60a5fa 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Manufacturing Excellence</span>
          </motion.h1>

          <motion.p variants={fadeUp} style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.22rem)', color: 'var(--pub-text-sub)',
            lineHeight: 1.75, maxWidth: 620, margin: '0 auto 2.5rem', fontWeight: 400,
          }}>
            Stop losing deals to disorganized pipelines. ManufactoCRM AI gives your manufacturing sales team predictive intelligence, automated workflows, and real-time insights to close 3x more deals.
          </motion.p>
          <motion.div variants={fadeUp} style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff', textDecoration: 'none', fontWeight: 700,
              padding: '14px 32px', borderRadius: 12, fontSize: '1rem',
              boxShadow: '0 6px 30px rgba(99,102,241,0.4)',
              display: 'inline-flex', alignItems: 'center', gap: 8,
              transition: 'all 0.2s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 40px rgba(99,102,241,0.55)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 30px rgba(99,102,241,0.4)'; }}
            >
              <MdRocketLaunch size={20} /> Get Started
            </Link>
            <button onClick={() => setShowDemo(true)} style={{
              border: '1.5px solid var(--pub-card-border)', color: 'var(--pub-text)',
              fontWeight: 600, padding: '14px 32px', cursor: 'pointer',
              borderRadius: 12, fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: 8,
              backdropFilter: 'blur(10px)', background: 'var(--pub-card-bg)',
              transition: 'all 0.2s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)'; e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--pub-card-border)'; e.currentTarget.style.background = 'var(--pub-card-bg)'; e.currentTarget.style.transform = 'none'; }}
            >
              <MdPlayArrow size={20} /> Watch Demo
            </button>
            <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} style={{
              border: '1.5px solid rgba(99,102,241,0.2)', color: 'var(--accent-blue)',
              fontWeight: 600, padding: '14px 32px', cursor: 'pointer',
              borderRadius: 12, fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: 8,
              backdropFilter: 'blur(10px)', background: 'rgba(99,102,241,0.05)',
              transition: 'all 0.2s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; e.currentTarget.style.background = 'rgba(99,102,241,0.15)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.background = 'rgba(99,102,241,0.05)'; e.currentTarget.style.transform = 'none'; }}
            >
              Explore Features
            </button>
            <Link to="/contact" style={{
              border: '1.5px solid var(--pub-card-border)', color: 'var(--pub-text)',
              textDecoration: 'none', fontWeight: 600, padding: '14px 32px',
              borderRadius: 12, fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: 8,
              backdropFilter: 'blur(10px)', background: 'var(--pub-card-bg)',
              transition: 'all 0.2s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--pub-card-border)'; e.currentTarget.style.background = 'var(--pub-card-bg)'; e.currentTarget.style.transform = 'none'; }}
            >
              Contact Sales
            </Link>
          </motion.div>

          <motion.p variants={fadeUp} style={{ color: 'var(--pub-text-muted)', fontSize: '0.82rem', marginTop: '1.2rem' }}>
            No credit card required · 14-day free trial · Cancel anytime
          </motion.p>
        </motion.div>
      </section>

      {/* Stats */}
      <section style={{ padding: '3rem 2rem', borderTop: '1px solid var(--pub-section-divider)', borderBottom: '1px solid var(--pub-section-divider)', background: 'var(--pub-card-bg)' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
          style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
          {stats.map((s, i) => (
            <motion.div key={i} variants={fadeUp} style={{ textAlign: 'center', padding: '1.5rem' }}>
              <div style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, background: 'linear-gradient(135deg,#818cf8,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', paddingRight: '4px', display: 'inline-block' }}>{s.value}</div>
              <div style={{ color: 'var(--pub-text-sub)', fontSize: '0.9rem', marginTop: '0.3rem', fontWeight: 500 }}>{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '6rem 2rem' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ color: '#818cf8', fontWeight: 600, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Everything You Need</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, marginTop: '0.8rem', color: 'var(--pub-text)' }}>
              Built for Manufacturing Sales Teams
            </h2>
            <p style={{ color: 'var(--pub-text-sub)', fontSize: '1.05rem', maxWidth: 520, margin: '1rem auto 0', lineHeight: 1.7 }}>
              Every feature purpose-built for the complex, long-cycle sales processes in the manufacturing industry.
            </p>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {features.map((f, i) => (
              <motion.div key={i} variants={fadeUp}
                style={{
                  background: 'var(--pub-card-bg)', border: '1px solid var(--pub-card-border)',
                  borderRadius: 16, padding: '2rem', cursor: 'default',
                  transition: 'border-color 0.3s, transform 0.3s, box-shadow 0.3s',
                }}
                whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(99,102,241,0.15)', borderColor: 'rgba(99,102,241,0.35)' }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
                  <f.icon size={24} color="#6366f1" />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.6rem', color: 'var(--pub-text)' }}>{f.title}</h3>
                <p style={{ color: 'var(--pub-text-sub)', fontSize: '0.9rem', lineHeight: 1.7 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Social proof banner */}
      <section style={{ padding: '2rem', background: 'rgba(99,102,241,0.06)', borderTop: '1px solid var(--pub-section-divider)', borderBottom: '1px solid var(--pub-section-divider)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          {['Tata Industries', 'Mahindra Mfg', 'L&T Engineering', 'BHEL Corp', 'Kirloskar Group', 'Godrej Industries'].map(co => (
            <div key={co} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <MdFactory size={18} color="#818cf8" />
              <span style={{ color: 'var(--pub-text-sub)', fontWeight: 600, fontSize: '0.88rem', whiteSpace: 'nowrap' }}>{co}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '6rem 2rem', background: 'rgba(99,102,241,0.02)' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ color: '#818cf8', fontWeight: 600, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Testimonials</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, marginTop: '0.8rem', color: 'var(--pub-text)' }}>Trusted by 200+ Manufacturing Teams</h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeUp}
                style={{ background: 'var(--pub-card-bg)', border: '1px solid var(--pub-card-border)', borderRadius: 16, padding: '2rem' }}
                whileHover={{ y: -3 }}
              >
                <div style={{ display: 'flex', gap: 3, marginBottom: '1rem' }}>
                  {[...Array(t.rating)].map((_, j) => <MdStar key={j} size={18} color="#fbbf24" />)}
                </div>
                <p style={{ color: 'var(--pub-text-sub)', fontSize: '0.93rem', lineHeight: 1.75, marginBottom: '1.5rem', fontStyle: 'italic' }}>"{t.text}"</p>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--pub-text)' }}>{t.name}</div>
                  <div style={{ fontSize: '0.82rem', color: '#818cf8', marginTop: '0.2rem' }}>{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Pricing preview */}
      <section style={{ padding: '6rem 2rem' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ color: '#818cf8', fontWeight: 600, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Simple Pricing</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, marginTop: '0.8rem', color: 'var(--pub-text)' }}>Start Free, Scale as You Grow</h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'stretch' }}>
            {pricing.map((p, i) => (
              <motion.div key={i} variants={fadeUp}
                style={{
                  background: p.highlight ? 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.12))' : 'var(--pub-card-bg)',
                  border: p.highlight ? '1.5px solid rgba(99,102,241,0.5)' : '1px solid var(--pub-card-border)',
                  borderRadius: 20, padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column',
                  position: 'relative', overflow: 'hidden',
                }}
                whileHover={{ y: -4 }}
              >
                {p.highlight && (
                  <div style={{ position: 'absolute', top: 16, right: 16, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', fontSize: '0.72rem', fontWeight: 700, padding: '4px 12px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Most Popular</div>
                )}
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--pub-text)', marginBottom: '0.5rem' }}>{p.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '2.4rem', fontWeight: 900, color: p.highlight ? '#a5b4fc' : 'var(--pub-text)' }}>{p.price}</span>
                  <span style={{ color: 'var(--pub-text-muted)', fontSize: '0.9rem' }}>{p.period}</span>
                </div>
                <div style={{ flex: 1 }}>
                  {p.features.map((f, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.7rem', color: 'var(--pub-text-sub)', fontSize: '0.9rem' }}>
                      <MdCheckCircle size={17} color={p.highlight ? '#818cf8' : '#10b981'} />
                      {f}
                    </div>
                  ))}
                </div>
                <Link to={p.cta === 'Contact Sales' ? '/contact' : '/register'} style={{
                  display: 'block', textAlign: 'center', marginTop: '1.8rem',
                  background: p.highlight ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'transparent',
                  border: p.highlight ? 'none' : '2px solid rgba(99,102,241,0.4)',
                  color: p.highlight ? '#fff' : '#6366f1',
                  textDecoration: 'none', fontWeight: 700, padding: '12px',
                  borderRadius: 10, fontSize: '0.95rem',
                  boxShadow: p.highlight ? '0 6px 24px rgba(99,102,241,0.35)' : 'none',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; if (!p.highlight) { e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; } }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; if (!p.highlight) { e.currentTarget.style.background = 'transparent'; } }}
                >{p.cta}</Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '5rem 2rem', background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))', borderTop: '1px solid rgba(99,102,241,0.15)' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <motion.div variants={fadeUp}>
            <MdTrendingUp size={48} color="#818cf8" style={{ marginBottom: '1rem' }} />
          </motion.div>
          <motion.h2 variants={fadeUp} style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 900, color: 'var(--pub-text)', marginBottom: '1rem' }}>
            Ready to Transform Your Sales?
          </motion.h2>
          <motion.p variants={fadeUp} style={{ color: 'var(--pub-text-sub)', fontSize: '1.05rem', marginBottom: '2rem', lineHeight: 1.7 }}>
            Join 200+ manufacturing companies already using ManufactoCRM AI to supercharge their sales teams.
          </motion.p>
          <motion.div variants={fadeUp} style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff',
              textDecoration: 'none', fontWeight: 700, padding: '14px 32px',
              borderRadius: 12, fontSize: '1.05rem', display: 'inline-flex', alignItems: 'center', gap: 8,
              boxShadow: '0 6px 30px rgba(99,102,241,0.4)',
            }}>
              Start Free Trial <MdArrowForward size={20} />
            </Link>
            <Link to="/contact" style={{
              border: '1.5px solid var(--pub-card-border)', color: 'var(--pub-text)',
              textDecoration: 'none', fontWeight: 600, padding: '14px 28px',
              borderRadius: 12, fontSize: '1rem', background: 'var(--pub-card-bg)',
              transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; e.currentTarget.style.background = 'rgba(99,102,241,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--pub-card-border)'; e.currentTarget.style.background = 'var(--pub-card-bg)'; }}
            >Talk to Sales</Link>
          </motion.div>
        </motion.div>
      </section>

      <AnimatePresence>
        {showDemo && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
            onClick={() => setShowDemo(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: '100%', maxWidth: 840, background: '#0a0a1f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}
              onClick={e => e.stopPropagation()}>
              
              {/* Header */}
              <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <MdFactory size={20} color="#818cf8" />
                  <span style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.3px' }}>ManufactoCRM AI — Product Tour</span>
                </div>
                <button onClick={() => setShowDemo(false)} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#cbd5e1' }}>
                  <MdClose size={18} />
                </button>
              </div>

              {/* Video Player */}
              <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#000' }}>
                <iframe
                  src="https://www.youtube.com/embed/z1H35x9lXm8?autoplay=1&rel=0"
                  title="ManufactoCRM AI Demo Video"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
