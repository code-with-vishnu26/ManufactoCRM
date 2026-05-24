import { useState } from 'react';
import { motion } from 'framer-motion';
import { MdWork, MdLocationOn, MdAttachMoney, MdCardGiftcard, MdAccessTime, MdPeople } from 'react-icons/md';
import toast from 'react-hot-toast';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const JOBS = [
  { id: 1, title: 'Senior AI Engineer', dept: 'Engineering', loc: 'Bangalore / Remote', type: 'Full-time', sal: '₹28L - ₹38L' },
  { id: 2, title: 'Lead Full-Stack Developer', dept: 'Engineering', loc: 'Bangalore', type: 'Full-time', sal: '₹22L - ₹30L' },
  { id: 3, title: 'Product Designer (UX/UI)', dept: 'Product', loc: 'Remote', type: 'Full-time', sal: '₹16L - ₹22L' },
  { id: 4, title: 'Enterprise Account Executive', dept: 'Sales', loc: 'Mumbai', type: 'Full-time', sal: '₹14L - ₹20L + Commission' },
  { id: 5, title: 'Customer Success Manager', dept: 'Customer Success', loc: 'Bangalore', type: 'Full-time', sal: '₹10L - ₹15L' }
];

const PERKS = [
  { icon: MdAttachMoney, title: 'Competitive Compensation', desc: 'Top tier salaries with performance bonuses and equity options.' },
  { icon: MdAccessTime, title: 'Flexible Work Hours', desc: 'We value output over hours. Work when and where you are most productive.' },
  { icon: MdCardGiftcard, title: 'Comprehensive Benefits', desc: 'Full medical insurance for you and your family, plus wellness allowances.' },
  { icon: MdPeople, title: 'Incredible Culture', desc: 'A flat hierarchy, open communication, and regular fun team retreats.' }
];

export default function Careers() {
  const [selectedDept, setSelectedDept] = useState('All');

  const filteredJobs = selectedDept === 'All' ? JOBS : JOBS.filter(j => j.dept === selectedDept);

  const handleApply = (title) => {
    toast.success(`Application form opened for ${title}!`);
  };

  return (
    <div style={{ background: 'var(--pub-bg)', color: 'var(--pub-text)', fontFamily: "'Inter', sans-serif", minHeight: '100vh', padding: '6rem 2rem 4rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Hero */}
        <motion.div initial="hidden" animate="visible" variants={stagger} style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <motion.div variants={fadeUp}>
            <span style={{ display: 'inline-block', background: 'var(--pub-badge-pill-bg)', border: '1px solid var(--pub-badge-pill-border)', borderRadius: 100, padding: '6px 18px', fontSize: '0.82rem', color: 'var(--pub-badge-pill-text)', fontWeight: 600, marginBottom: '1.5rem' }}>Careers</span>
          </motion.div>
          <motion.h1 variants={fadeUp} style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: '1.2rem', color: 'var(--pub-text)' }}>
            Build the Future of{' '}
            <span style={{ background: 'linear-gradient(135deg,#818cf8,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Manufacturing SaaS</span>
          </motion.h1>
          <motion.p variants={fadeUp} style={{ color: 'var(--pub-text-sub)', fontSize: '1.1rem', maxWidth: 640, margin: '0 auto' }}>
            Join our mission to revolutionize B2B sales in the manufacturing sector. We are looking for talented, passionate individuals to help us build state-of-the-art AI systems.
          </motion.p>
        </motion.div>

        {/* Perks */}
        <section style={{ marginBottom: '5rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, textAlign: 'center', marginBottom: '3rem', color: 'var(--pub-text)' }}>Why Work With Us?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {PERKS.map((perk, i) => (
              <div key={i} style={{ padding: '2rem', background: 'var(--pub-card-bg)', border: '1px solid var(--pub-card-border)', borderRadius: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' }}>
                  <perk.icon size={24} color="var(--accent-blue)" />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.6rem', color: 'var(--pub-text)' }}>{perk.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--pub-text-sub)', lineHeight: 1.7 }}>{perk.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Job Openings */}
        <section>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, textAlign: 'center', marginBottom: '2.5rem', color: 'var(--pub-text)' }}>Open Positions</h2>

          {/* Department Filter */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
            {['All', 'Engineering', 'Product', 'Sales', 'Customer Success'].map(dept => (
              <button key={dept} onClick={() => setSelectedDept(dept)} style={{
                padding: '0.6rem 1.2rem', borderRadius: 50, border: selectedDept === dept ? 'none' : '1px solid var(--pub-card-border)',
                cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
                background: selectedDept === dept ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'var(--pub-card-bg)',
                color: selectedDept === dept ? '#fff' : 'var(--pub-text-sub)', transition: 'all 0.2s'
              }}>{dept}</button>
            ))}
          </div>

          {/* Job List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredJobs.map((job) => (
              <div key={job.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem',
                padding: '1.8rem 2.2rem', background: 'var(--pub-card-bg)', border: '1px solid var(--pub-card-border)', borderRadius: 20,
                transition: 'border-color 0.2s, transform 0.2s'
              }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--pub-text)' }}>{job.title}</h3>
                  <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', color: 'var(--pub-text-sub)' }}>
                      <MdWork size={16} /> {job.dept}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', color: 'var(--pub-text-sub)' }}>
                      <MdLocationOn size={16} /> {job.loc}
                    </span>
                    <span style={{ color: 'var(--accent-green)', fontWeight: 600, fontSize: '0.88rem' }}>{job.sal}</span>
                  </div>
                </div>
                <button onClick={() => handleApply(job.title)} style={{
                  padding: '0.8rem 1.6rem', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)',
                  borderRadius: 12, color: 'var(--accent-blue)', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Inter', sans-serif"
                }}>Apply Now</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
