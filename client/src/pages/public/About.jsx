import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MdRocketLaunch, MdVisibility, MdGroups, MdEmojiObjects, MdVerified } from 'react-icons/md';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const team = [
  { name: 'Arjun Mehta', role: 'CEO & Co-Founder', bio: 'Former VP at SAP India with 18 years in manufacturing ERP. Passionate about AI-driven sales transformation.', initials: 'AM', color: '#6366f1' },
  { name: 'Divya Krishnan', role: 'CTO & Co-Founder', bio: 'Ex-Google Brain researcher. Built ML systems that processed 10M+ data points daily for Fortune 500 clients.', initials: 'DK', color: '#8b5cf6' },
  { name: 'Rohan Gupta', role: 'Head of Product', bio: 'Passionate product designer with expertise in B2B SaaS. Former product lead at Salesforce India.', initials: 'RG', color: '#3b82f6' },
  { name: 'Ananya Singh', role: 'Head of Customer Success', bio: '10+ years in manufacturing industry. Helped 50+ companies digitize their sales processes.', initials: 'AS', color: '#10b981' },
];

const timeline = [
  { year: '2021', title: 'Founded', desc: 'ManufactoCRM AI was founded with a vision to transform manufacturing sales with AI.' },
  { year: '2022', title: 'First 10 Customers', desc: 'Launched beta with 10 pilot manufacturing companies across India. Achieved 95% retention.' },
  { year: '2023', title: 'Series A Funding', desc: 'Raised ₹25 Cr Series A to expand product and team. Crossed 100 customer milestone.' },
  { year: '2024', title: 'AI Suite Launch', desc: 'Launched full AI suite with predictive analytics, auto-scoring, and ERP integrations.' },
  { year: '2025', title: '200+ Customers', desc: 'Expanded to 200+ manufacturing companies. Launched enterprise tier with dedicated support.' },
];

const values = [
  { icon: MdRocketLaunch, title: 'Innovation First', desc: 'We push boundaries with cutting-edge AI to solve real manufacturing challenges.' },
  { icon: MdVerified, title: 'Customer Trust', desc: "Every decision is made with our customers' success as the north star." },
  { icon: MdGroups, title: 'Team Excellence', desc: 'We hire the best and create an environment where great work thrives.' },
  { icon: MdEmojiObjects, title: 'Simplicity', desc: 'Complex problems deserve elegant solutions. We make powerful tools simple to use.' },
];

export default function About() {
  const navigate = useNavigate();
  return (
    <div style={{ background: 'var(--pub-bg)', color: 'var(--pub-text)', fontFamily: "'Inter', sans-serif" }}>
      {/* Hero */}
      <section style={{ padding: '6rem 2rem 4rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, var(--pub-hero-glow) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <motion.div initial="hidden" animate="visible" variants={stagger} style={{ maxWidth: 740, margin: '0 auto', position: 'relative' }}>
          <motion.div variants={fadeUp}>
            <span style={{ display: 'inline-block', background: 'var(--pub-badge-pill-bg)', border: '1px solid var(--pub-badge-pill-border)', borderRadius: 100, padding: '6px 18px', fontSize: '0.82rem', color: 'var(--pub-badge-pill-text)', fontWeight: 600, marginBottom: '1.5rem' }}>Our Story</span>
          </motion.div>
          <motion.h1 variants={fadeUp} style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: '1.2rem', color: 'var(--pub-text)' }}>
            Built by Manufacturers,{' '}
            <span style={{ background: 'linear-gradient(135deg,#818cf8,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>for Manufacturers</span>
          </motion.h1>
          <motion.p variants={fadeUp} style={{ color: 'var(--pub-text-sub)', fontSize: '1.1rem', lineHeight: 1.75, maxWidth: 580, margin: '0 auto', marginBottom: '2rem' }}>
            We started ManufactoCRM AI because we were frustrated with generic CRMs that didn't understand the complexity of manufacturing sales cycles. So we built something better.
          </motion.p>
          <motion.div variants={fadeUp} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <button onClick={() => document.getElementById('team')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ background: 'var(--pub-badge-pill-bg)', border: '1px solid var(--pub-badge-pill-border)', borderRadius: 12, padding: '12px 24px', color: 'var(--pub-badge-pill-text)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease' }}>
              Meet Our Team
            </button>
            <button onClick={() => navigate('/contact')}
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', borderRadius: 12, padding: '12px 24px', color: '#fff', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)' }}>
              Contact Us
            </button>
            <button onClick={() => navigate('/contact?demo=true')}
              style={{ background: 'var(--pub-card-bg)', border: '1px solid var(--pub-card-border)', borderRadius: 12, padding: '12px 24px', color: 'var(--pub-text)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease' }}>
              Book Demo
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section style={{ padding: '4rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {[
            { icon: MdRocketLaunch, title: 'Our Mission', color: '#6366f1', text: 'To empower every manufacturing sales team in India and beyond with intelligent tools that eliminate busywork, surface insights, and help them focus on building relationships and closing deals.' },
            { icon: MdVisibility, title: 'Our Vision', color: '#8b5cf6', text: 'A world where manufacturing companies of all sizes have access to enterprise-grade AI sales technology that was previously only available to the largest corporations with unlimited budgets.' },
          ].map((item, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              style={{ background: 'var(--pub-card-bg)', border: '1px solid var(--pub-card-border)', borderRadius: 20, padding: '2.5rem' }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: `${item.color}22`, border: `1px solid ${item.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
                <item.icon size={26} color={item.color} />
              </div>
              <h2 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--pub-text)' }}>{item.title}</h2>
              <p style={{ color: 'var(--pub-text-sub)', fontSize: '0.97rem', lineHeight: 1.8 }}>{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: '4rem 2rem', background: 'var(--pub-card-bg)' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.h2 variants={fadeUp} style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, marginBottom: '3rem', color: 'var(--pub-text)' }}>Our Core Values</motion.h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {values.map((v, i) => (
              <motion.div key={i} variants={fadeUp}
                style={{ background: 'var(--pub-bg)', border: '1px solid var(--pub-card-border)', borderRadius: 16, padding: '1.8rem', textAlign: 'center' }}
                whileHover={{ y: -4 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <v.icon size={24} color="var(--accent-blue)" />
                </div>
                <h3 style={{ fontWeight: 700, marginBottom: '0.6rem', color: 'var(--pub-text)' }}>{v.title}</h3>
                <p style={{ color: 'var(--pub-text-sub)', fontSize: '0.88rem', lineHeight: 1.7 }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Team */}
      <section id="team" style={{ padding: '5rem 2rem' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ color: 'var(--accent-blue)', fontWeight: 600, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>The Team</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.8rem', color: 'var(--pub-text)' }}>Meet Our Leadership</h2>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {team.map((member, i) => (
              <motion.div key={i} variants={fadeUp}
                style={{ background: 'var(--pub-card-bg)', border: '1px solid var(--pub-card-border)', borderRadius: 20, padding: '2rem', textAlign: 'center' }}
                whileHover={{ y: -5 }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg, ${member.color}, ${member.color}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem', fontSize: '1.4rem', fontWeight: 800, color: '#fff', boxShadow: `0 8px 24px ${member.color}44` }}>
                  {member.initials}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--pub-text)', marginBottom: '0.3rem' }}>{member.name}</h3>
                <div style={{ color: member.color, fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.8rem' }}>{member.role}</div>
                <p style={{ color: 'var(--pub-text-sub)', fontSize: '0.85rem', lineHeight: 1.7 }}>{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Timeline */}
      <section style={{ padding: '5rem 2rem', background: 'var(--pub-card-bg)' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} style={{ maxWidth: 760, margin: '0 auto' }}>
          <motion.div variants={fadeUp} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--pub-text)' }}>Our Journey</h2>
          </motion.div>
          <div style={{ position: 'relative', paddingLeft: '2rem' }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: 'linear-gradient(180deg, #6366f1, #8b5cf6, transparent)' }} />
            {timeline.map((item, i) => (
              <motion.div key={i} variants={fadeUp} style={{ position: 'relative', marginBottom: '2.5rem', paddingLeft: '1.5rem' }}>
                <div style={{ position: 'absolute', left: -2.5, top: 6, width: 10, height: 10, borderRadius: '50%', background: '#818cf8', border: '2px solid var(--pub-bg)', boxShadow: '0 0 12px rgba(129,140,248,0.6)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '0.4rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--accent-blue)' }}>{item.year}</span>
                  <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--pub-text)' }}>{item.title}</span>
                </div>
                <p style={{ color: 'var(--pub-text-sub)', fontSize: '0.9rem', lineHeight: 1.7 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
