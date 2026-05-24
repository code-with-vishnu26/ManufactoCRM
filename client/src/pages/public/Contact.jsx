import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MdEmail, MdPhone, MdLocationOn, MdSend, MdDone, MdCalendarToday, MdAccessTime } from 'react-icons/md';
import toast from 'react-hot-toast';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export default function Contact() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('message');
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [demoDate, setDemoDate] = useState('');
  const [demoTime, setDemoTime] = useState('10:00 AM');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('demo') === 'true' || params.get('plan') === 'enterprise') {
      setActiveTab('demo');
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setSuccess(true);
    if (activeTab === 'message') {
      setSuccessMsg('Your message has been sent successfully! Our team will contact you within 24 hours.');
      toast.success('Your message has been sent successfully!');
    } else {
      setSuccessMsg(`Demo Call successfully scheduled for ${demoDate} at ${demoTime}! A Google Meet link and calendar invite have been sent to ${form.email}.`);
      toast.success('Demo scheduled successfully!');
    }
    setForm({ name: '', email: '', company: '', message: '' });
    setDemoDate('');
  };

  const inputStyle = {
    width: '100%', padding: '0.8rem 1rem',
    background: 'var(--pub-input-bg)', border: '1px solid var(--pub-input-border)',
    borderRadius: 10, color: 'var(--pub-text)', outline: 'none', fontFamily: "'Inter', sans-serif", fontSize: 14
  };

  return (
    <div style={{ background: 'var(--pub-bg)', color: 'var(--pub-text)', fontFamily: "'Inter', sans-serif", minHeight: '100vh', padding: '6rem 2rem 4rem' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <motion.div initial="hidden" animate="visible" variants={stagger} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <motion.div variants={fadeUp}>
            <span style={{ display: 'inline-block', background: 'var(--pub-badge-pill-bg)', border: '1px solid var(--pub-badge-pill-border)', borderRadius: 100, padding: '6px 18px', fontSize: '0.82rem', color: 'var(--pub-badge-pill-text)', fontWeight: 600, marginBottom: '1.5rem' }}>Contact Us</span>
          </motion.div>
          <motion.h1 variants={fadeUp} style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: '1.2rem', color: 'var(--pub-text)' }}>
            Get in Touch with{' '}
            <span style={{ background: 'linear-gradient(135deg,#818cf8,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Our Experts</span>
          </motion.h1>
          <motion.p variants={fadeUp} style={{ color: 'var(--pub-text-sub)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto' }}>
            Have questions about our manufacturing CRM platform? Contact us and we will help you choose the right solution for your business.
          </motion.p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'start' }}>
          {/* Info cards */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--pub-text)' }}>Contact Information</h2>
            {[
              { icon: MdEmail, title: 'Email Us', val: 'sales@manufactocrm.com', desc: 'Response within 24 hours' },
              { icon: MdPhone, title: 'Call Us', val: '+91 80 4912 3456', desc: 'Mon - Fri, 9 AM - 6 PM IST' },
              { icon: MdLocationOn, title: 'Our Headquarters', val: 'ManufactoCRM AI, 4th Floor, UB City, Bangalore, India', desc: 'Drop by for a coffee' }
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '1.2rem', padding: '1.5rem', background: 'var(--pub-card-bg)', border: '1px solid var(--pub-card-border)', borderRadius: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <item.icon size={22} color="var(--accent-blue)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.2rem', color: 'var(--pub-text)' }}>{item.title}</h3>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--pub-text)', marginBottom: '0.2rem' }}>{item.val}</div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--pub-text-muted)' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Form Card */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
            style={{ background: 'var(--pub-card-bg)', border: '1px solid var(--pub-card-border)', borderRadius: 24, padding: '2.5rem', boxShadow: '0 20px 50px rgba(0,0,0,0.08)' }}>
            
            {/* Tabs */}
            <div style={{ display: 'flex', background: 'var(--pub-input-bg)', border: '1px solid var(--pub-input-border)', borderRadius: 12, padding: '4px', marginBottom: '1.8rem' }}>
              <button type="button" onClick={() => { setActiveTab('message'); setSuccess(false); }} style={{
                flex: 1, background: activeTab === 'message' ? 'var(--accent-blue)' : 'transparent',
                border: 'none', color: activeTab === 'message' ? '#fff' : 'var(--pub-text-sub)', padding: '10px', borderRadius: 8,
                fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s'
              }}>Send Message</button>
              <button type="button" onClick={() => { setActiveTab('demo'); setSuccess(false); }} style={{
                flex: 1, background: activeTab === 'demo' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
                border: 'none', color: activeTab === 'demo' ? '#fff' : 'var(--pub-text-sub)', padding: '10px', borderRadius: 8,
                fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s'
              }}>Schedule Demo Call</button>
            </div>

            <AnimatePresence mode="wait">
              {success ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <MdDone size={32} color="#10b981" />
                  </div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--pub-text)' }}>Sent Successfully!</h3>
                  <p style={{ color: 'var(--pub-text-sub)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>{successMsg}</p>
                  <button onClick={() => setSuccess(false)} style={{ background: 'var(--pub-badge-pill-bg)', border: '1px solid var(--pub-badge-pill-border)', color: 'var(--pub-badge-pill-text)', padding: '10px 24px', borderRadius: 10, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}>
                    Submit Another Request
                  </button>
                </motion.div>
              ) : (
                <motion.form key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--pub-text-sub)', marginBottom: '0.4rem' }}>Your Name *</label>
                    <input required style={inputStyle} type="text" placeholder="John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--pub-text-sub)', marginBottom: '0.4rem' }}>Work Email *</label>
                    <input required style={inputStyle} type="email" placeholder="john@company.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--pub-text-sub)', marginBottom: '0.4rem' }}>Company Name</label>
                    <input style={inputStyle} type="text" placeholder="Acme Corporation" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
                  </div>

                  {activeTab === 'demo' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 500, color: 'var(--pub-text-sub)', marginBottom: '0.4rem' }}>
                          <MdCalendarToday size={14} /> Select Date *
                        </label>
                        <input required style={inputStyle} type="date" min={new Date().toISOString().split('T')[0]} value={demoDate} onChange={e => setDemoDate(e.target.value)} />
                      </div>
                      <div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 500, color: 'var(--pub-text-sub)', marginBottom: '0.4rem' }}>
                          <MdAccessTime size={14} /> Time Slot *
                        </label>
                        <select required value={demoTime} onChange={e => setDemoTime(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                          {['10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM'].map((slot) => (
                            <option key={slot} value={slot}>{slot}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--pub-text-sub)', marginBottom: '0.4rem' }}>
                      {activeTab === 'message' ? 'Your Message *' : 'Demo Focus / Custom Requirements'}
                    </label>
                    <textarea required={activeTab === 'message'} rows={4} style={{ ...inputStyle, resize: 'vertical' }}
                      placeholder={activeTab === 'message' ? "Tell us about your sales team size and current challenges..." : "What features or ERP integrations would you like to see during the demo?"} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
                  </div>

                  <button type="submit" disabled={loading} style={{
                    marginTop: '0.8rem', padding: '1rem',
                    background: activeTab === 'message' ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none', borderRadius: 12, color: '#fff', fontWeight: 700, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', transition: 'transform 0.2s, box-shadow 0.2s'
                  }}>
                    {loading ? (
                      <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                    ) : activeTab === 'message' ? (
                      <>Send Message <MdSend size={16} /></>
                    ) : (
                      <>Schedule Demo Call <MdCalendarToday size={16} /></>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
