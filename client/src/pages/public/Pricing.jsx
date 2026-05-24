import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdCheck, MdClose, MdArrowForward, MdRocketLaunch, MdStar, MdHelp } from 'react-icons/md';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const plans = [
  {
    name: 'Starter',
    price: '₹999',
    period: '/month',
    annual: '₹799',
    desc: 'Perfect for small manufacturing teams getting started with CRM',
    color: '#4f46e5',
    features: [
      '5 team members', '500 leads', '1 pipeline', 'Basic AI lead scoring',
      'Email integration', 'Standard reports', 'Mobile app', '8/5 email support',
      'Data export (CSV)', '5GB storage',
    ],
    notIncluded: ['AI Sales Assistant', 'WhatsApp integration', 'Advanced analytics', 'API access', 'Custom integrations', 'Dedicated CSM'],
    popular: false,
    cta: 'Choose Plan',
  },
  {
    name: 'Professional',
    price: '₹2,499',
    period: '/month',
    annual: '₹1,999',
    desc: 'For growing manufacturing businesses with active sales teams',
    color: '#8b5cf6',
    features: [
      '25 team members', 'Unlimited leads', '5 pipelines', 'Advanced AI scoring',
      'AI Sales Assistant (full)', 'WhatsApp + Email + SMS', 'Advanced analytics', 'Custom reports',
      'API access', 'Priority 24/7 support', 'Custom pipeline stages', '50GB storage',
      'Bulk email sequences', 'Team leaderboards',
    ],
    notIncluded: ['Dedicated CSM', 'White-label option', 'On-premise deployment', 'Custom AI model'],
    popular: true,
    cta: 'Start Free Trial',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    annual: null,
    desc: 'For large manufacturing enterprises with complex requirements',
    color: '#06b6d4',
    features: [
      'Unlimited team members', 'Unlimited everything', 'Unlimited pipelines', 'Custom AI model',
      'Dedicated AI training', 'White-label option', 'On-premise deployment', 'Dedicated CSM',
      'Custom integrations (SAP, Tally)', 'SSO/SAML', '99.99% SLA', 'Unlimited storage',
      'Priority enterprise support', 'Custom contract & invoicing',
    ],
    notIncluded: [],
    popular: false,
    cta: 'Contact Enterprise Sales',
  },
];

const comparisonFeatures = [
  { feature: 'Team Members', starter: '5', pro: '25', enterprise: 'Unlimited' },
  { feature: 'Leads / Contacts', starter: '500', pro: 'Unlimited', enterprise: 'Unlimited' },
  { feature: 'AI Lead Scoring', starter: 'Basic', pro: 'Advanced', enterprise: 'Custom Model' },
  { feature: 'AI Sales Assistant', starter: false, pro: true, enterprise: true },
  { feature: 'Kanban Pipeline', starter: '1 pipeline', pro: '5 pipelines', enterprise: 'Unlimited' },
  { feature: 'Analytics Dashboard', starter: 'Standard', pro: 'Advanced', enterprise: 'Custom' },
  { feature: 'WhatsApp Integration', starter: false, pro: true, enterprise: true },
  { feature: 'Email Integration', starter: true, pro: true, enterprise: true },
  { feature: 'Mobile App', starter: true, pro: true, enterprise: true },
  { feature: 'API Access', starter: false, pro: true, enterprise: true },
  { feature: 'Data Export', starter: 'CSV only', pro: 'CSV, Excel, PDF', enterprise: 'All formats' },
  { feature: 'Custom Integrations', starter: false, pro: false, enterprise: true },
  { feature: 'Dedicated CSM', starter: false, pro: false, enterprise: true },
  { feature: 'White-label', starter: false, pro: false, enterprise: true },
  { feature: 'Support', starter: '8/5 Email', pro: '24/7 Priority', enterprise: 'Dedicated Team' },
  { feature: 'SLA Guarantee', starter: '99.5%', pro: '99.9%', enterprise: '99.99%' },
  { feature: 'Storage', starter: '5GB', pro: '50GB', enterprise: 'Unlimited' },
];

const faqs = [
  { q: 'Is there a free trial?', a: 'Yes! All plans come with a 14-day free trial with full feature access. No credit card required. You can upgrade, downgrade, or cancel at any time.' },
  { q: 'Can I switch plans later?', a: 'Absolutely. You can upgrade or downgrade your plan at any time. When upgrading, you get immediate access. When downgrading, changes apply at the next billing cycle.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards, UPI, Net Banking, and bank transfers for annual plans. GST invoice provided for all transactions.' },
  { q: 'Is my data secure?', a: 'Yes. Your data is encrypted at rest (AES-256) and in transit (TLS 1.3). We are ISO 27001 compliant and host exclusively on AWS India data centers.' },
  { q: 'Do you offer discounts for annual billing?', a: 'Yes! Annual billing saves you 20% compared to monthly billing. The annual price is shown when you toggle to yearly pricing above.' },
  { q: 'What happens when I exceed my lead limit?', a: 'We will notify you when you reach 80% of your limit. You can upgrade anytime, and we will never delete your data if you exceed the limit.' },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div style={{ background: 'var(--pub-bg)', color: 'var(--pub-text)', overflowX: 'hidden', fontFamily: "'Inter', sans-serif" }}>

      {/* ====== HERO ====== */}
      <section style={{ position: 'relative', padding: '100px 24px 60px', overflow: 'hidden', textAlign: 'center' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <div style={{ position: 'absolute', top: '-10%', left: '15%', width: '70%', height: '80%', background: 'radial-gradient(ellipse, rgba(79,70,229,0.12) 0%, transparent 70%)' }} />
        </div>
        <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'inline-block', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: 100, padding: '5px 16px', marginBottom: 20 }}>
              <span style={{ fontSize: 12, color: '#8b5cf6', fontWeight: 700, letterSpacing: '0.08em' }}>PRICING</span>
            </div>
            <h1 style={{ fontSize: 'clamp(34px, 6vw, 62px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.1, marginBottom: 20, color: 'var(--pub-text)' }}>
              Simple, transparent pricing<br />
              <span style={{ background: 'linear-gradient(135deg, #818cf8, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                for every team
              </span>
            </h1>
            <p style={{ fontSize: 'clamp(16px, 2vw, 19px)', color: 'var(--pub-text-sub)', lineHeight: 1.7, marginBottom: 32 }}>
              Start free for 14 days. No credit card required. Cancel anytime.
            </p>

            {/* Billing toggle */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--pub-card-bg)', border: '1px solid var(--pub-card-border)', borderRadius: 50, padding: '5px 6px' }}>
              <button
                onClick={() => setAnnual(false)}
                style={{
                  background: !annual ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
                  border: 'none',
                  color: !annual ? '#fff' : 'var(--pub-text-sub)',
                  padding: '8px 20px', borderRadius: 40,
                  fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnual(true)}
                style={{
                  background: annual ? 'linear-gradient(135deg, #4f46e5, #8b5cf6)' : 'transparent',
                  border: 'none',
                  color: annual ? '#fff' : 'var(--pub-text-sub)',
                  padding: '8px 20px', borderRadius: 40,
                  fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                Annual <span style={{ background: '#10b981', borderRadius: 100, padding: '2px 8px', fontSize: 10, fontWeight: 800, color: '#fff' }}>SAVE 20%</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ====== PRICING CARDS ====== */}
      <section style={{ padding: '40px 24px 80px' }}>
        <motion.div
          initial="hidden" animate="visible" variants={stagger}
          style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, alignItems: 'start' }}
        >
          {plans.map((plan, i) => (
            <motion.div key={i} variants={fadeUp}
              style={{
                background: plan.popular ? 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(99,102,241,0.05))' : 'var(--pub-card-bg)',
                border: plan.popular ? '2px solid rgba(139,92,246,0.5)' : '1px solid var(--pub-card-border)',
                borderRadius: 22, padding: 32, position: 'relative',
                boxShadow: plan.popular ? '0 24px 64px rgba(139,92,246,0.18)' : '0 2px 12px rgba(0,0,0,0.06)',
                transform: plan.popular ? 'scale(1.03)' : 'scale(1)',
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #4f46e5, #8b5cf6)',
                  padding: '5px 18px', borderRadius: 100,
                  fontSize: 11, fontWeight: 800, color: 'white', whiteSpace: 'nowrap',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  <MdStar size={12} /> MOST POPULAR
                </div>
              )}

              {/* Plan name */}
              <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4, color: 'var(--pub-text)' }}>{plan.name}</h3>
              <p style={{ color: 'var(--pub-text-sub)', fontSize: 13, marginBottom: 20, lineHeight: 1.5 }}>{plan.desc}</p>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
                <span style={{ fontSize: 44, fontWeight: 900, color: plan.color, letterSpacing: '-2px' }}>
                  {annual && plan.annual ? plan.annual : plan.price}
                </span>
                <span style={{ color: 'var(--pub-text-muted)', fontSize: 14 }}>{plan.period}</span>
              </div>
              {annual && plan.annual && (
                <div style={{ marginBottom: 20 }}>
                  <span style={{ fontSize: 12, color: '#10b981', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 6, padding: '2px 8px', fontWeight: 700 }}>
                    Save 20% annually
                  </span>
                </div>
              )}

              {/* CTA Button */}
              <Link to={plan.name === 'Enterprise' ? '/contact?plan=enterprise' : `/register?plan=${plan.name.toLowerCase()}`} style={{
                display: 'block', textAlign: 'center',
                background: plan.popular ? 'linear-gradient(135deg, #4f46e5, #8b5cf6)' : 'transparent',
                border: plan.popular ? 'none' : `2px solid ${plan.color}`,
                color: plan.popular ? 'white' : plan.color,
                textDecoration: 'none',
                padding: '13px', borderRadius: 10, fontWeight: 700, fontSize: 15, marginBottom: 28,
                boxShadow: plan.popular ? '0 8px 25px rgba(79,70,229,0.4)' : 'none',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { if (!plan.popular) { e.currentTarget.style.background = `${plan.color}12`; } e.currentTarget.style.opacity = '0.9'; }}
                onMouseLeave={e => { if (!plan.popular) { e.currentTarget.style.background = 'transparent'; } e.currentTarget.style.opacity = '1'; }}
              >
                {plan.cta}
              </Link>

              {/* Features list */}
              <div style={{ borderTop: '1px solid var(--pub-card-border)', paddingTop: 24 }}>
                <p style={{ fontSize: 12, color: 'var(--pub-text-muted)', marginBottom: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>What's included</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {plan.features.map((f, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--pub-text-sub)' }}>
                      <MdCheck size={16} color={plan.color} style={{ flexShrink: 0 }} /> {f}
                    </div>
                  ))}
                  {plan.notIncluded.map((f, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--pub-text-muted)' }}>
                      <MdClose size={16} color="var(--pub-text-muted)" style={{ flexShrink: 0 }} /> {f}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ====== COMPARISON TABLE ====== */}
      <section style={{ padding: '60px 24px 80px', background: 'var(--pub-card-bg)', borderTop: '1px solid var(--pub-card-border)', borderBottom: '1px solid var(--pub-card-border)' }}>
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 48, color: 'var(--pub-text)' }}>
            Compare all plans
          </h2>
          <div style={{ maxWidth: 900, margin: '0 auto', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '14px 16px', textAlign: 'left', color: 'var(--pub-text-muted)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid var(--pub-card-border)' }}>Feature</th>
                  {['Starter', 'Professional', 'Enterprise'].map((p, i) => (
                    <th key={p} style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 800, fontSize: 14, color: i === 1 ? '#8b5cf6' : 'var(--pub-text)', borderBottom: '1px solid var(--pub-card-border)' }}>{p}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--pub-card-border)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '13px 16px', fontSize: 14, color: 'var(--pub-text-sub)', fontWeight: 500 }}>{row.feature}</td>
                    {[row.starter, row.pro, row.enterprise].map((val, j) => (
                      <td key={j} style={{ padding: '13px 16px', textAlign: 'center', fontSize: 14 }}>
                        {typeof val === 'boolean' ? (
                          val
                            ? <MdCheck size={18} color="#10b981" style={{ margin: '0 auto', display: 'block' }} />
                            : <MdClose size={18} color="var(--pub-text-muted)" style={{ margin: '0 auto', display: 'block' }} />
                        ) : (
                          <span style={{ color: j === 1 ? '#8b5cf6' : 'var(--pub-text-sub)', fontWeight: j === 1 ? 600 : 400 }}>{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </section>

      {/* ====== FAQ ====== */}
      <section style={{ padding: '60px 24px 80px' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(26px, 3.5vw, 40px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 12, color: 'var(--pub-text)' }}>
            Frequently asked questions
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--pub-text-sub)', fontSize: 16, marginBottom: 48 }}>
            Have more questions? <Link to="/contact" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>Contact our team →</Link>
          </p>
          <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{
                background: 'var(--pub-card-bg)',
                border: `1px solid ${openFaq === i ? 'rgba(139,92,246,0.4)' : 'var(--pub-card-border)'}`,
                borderRadius: 14, overflow: 'hidden',
                transition: 'border-color 0.2s',
              }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%', padding: '18px 20px', background: 'none', border: 'none',
                    color: 'var(--pub-text)', textAlign: 'left', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    fontSize: 15, fontWeight: 600,
                  }}
                >
                  <span>{faq.q}</span>
                  <span style={{ color: '#8b5cf6', fontSize: 22, fontWeight: 300, transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0, marginLeft: 12 }}>+</span>
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ padding: '0 20px 18px', color: 'var(--pub-text-sub)', fontSize: 14, lineHeight: 1.7 }}
                  >
                    {faq.a}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ====== CTA ====== */}
      <section style={{ padding: '40px 24px 100px', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div style={{ maxWidth: 680, margin: '0 auto', background: 'linear-gradient(135deg, rgba(79,70,229,0.1), rgba(139,92,246,0.07))', border: '1px solid rgba(139,92,246,0.2)', borderRadius: 24, padding: '56px 40px' }}>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 900, letterSpacing: '-1px', marginBottom: 14, color: 'var(--pub-text)' }}>
              Ready to get started?
            </h2>
            <p style={{ color: 'var(--pub-text-sub)', fontSize: 16, marginBottom: 32 }}>
              Join 200+ manufacturing companies. Start your 14-day free trial today.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" style={{
                background: 'linear-gradient(135deg, #4f46e5, #8b5cf6)',
                color: 'white', textDecoration: 'none',
                padding: '14px 32px', borderRadius: 12, fontWeight: 700, fontSize: 16,
                display: 'inline-flex', alignItems: 'center', gap: 8,
                boxShadow: '0 8px 30px rgba(79,70,229,0.4)',
              }}>
                <MdRocketLaunch size={18} /> Start Free Trial
              </Link>
              <Link to="/contact" style={{
                background: 'var(--pub-card-bg)', border: '1px solid var(--pub-card-border)',
                color: 'var(--pub-text)', textDecoration: 'none',
                padding: '14px 28px', borderRadius: 12, fontWeight: 600, fontSize: 16,
              }}>
                Talk to Sales
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
