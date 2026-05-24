import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MdSearch, MdLocationOn, MdStar, MdArrowForward, MdTrendingUp, 
  MdClose, MdDone, MdFilterList, MdCheckCircle, MdFactory, MdPerson
} from 'react-icons/md';
import toast from 'react-hot-toast';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

const bdaList = [
  {
    id: 1,
    name: 'Rahul Sharma',
    role: 'Sales Executive',
    department: 'Sales',
    city: 'Mumbai',
    rating: 4.9,
    leads: 48,
    avatar: 'RS',
    color: '#4f46e5',
    bio: 'Former senior business developer at Tata Steel. Over 6 years of expertise closing high-value heavy machinery contracts and structuring auto OEM logistics integrations.',
    specialities: ['Heavy Machinery', 'Auto OEMs', 'Steel Supply Lines'],
    dealsClosed: 32,
    revenueClosed: '₹14Cr+'
  },
  {
    id: 2,
    name: 'Anjali Gupta',
    role: 'Team Lead',
    department: 'Management',
    city: 'Bangalore',
    rating: 4.8,
    leads: 120,
    avatar: 'AG',
    color: '#db2777',
    bio: 'Highly experienced team lead coordinating a roster of 12 BDA associates. Expert at plant CRM digitizations and connecting SAP/Oracle ERP systems.',
    specialities: ['SAP Webhooks', 'Oracle ERP', 'Roster Coaching'],
    dealsClosed: 84,
    revenueClosed: '₹42Cr+'
  },
  {
    id: 3,
    name: 'Vikram Malhotra',
    role: 'Sales Manager',
    department: 'Sales',
    city: 'Delhi',
    rating: 4.7,
    leads: 85,
    avatar: 'VM',
    color: '#06b6d4',
    bio: 'Regional Sales Manager for North India. Specialized in structuring large-scale factory procurement workflows and managing government manufacturing tenders.',
    specialities: ['Procurement Contracts', 'Tender Mapping', 'Enterprise Accounts'],
    dealsClosed: 56,
    revenueClosed: '₹28Cr+'
  },
  {
    id: 4,
    name: 'Priya Krishnan',
    role: 'Support Specialist',
    department: 'Support',
    city: 'Chennai',
    rating: 4.9,
    leads: 210,
    avatar: 'PK',
    color: '#8b5cf6',
    bio: 'Ex-Salesforce Customer Success Architect. Dedicated to resolving custom client CRM tickets, training plant managers, and autogenerating BDA user guides.',
    specialities: ['User Onboarding', 'Troubleshooting', 'Hindi & English Training'],
    dealsClosed: 195,
    revenueClosed: '98% SLA Uptime'
  },
  {
    id: 5,
    name: 'Amit Deshmukh',
    role: 'Operations Director',
    department: 'Operations',
    city: 'Pune',
    rating: 4.6,
    leads: 35,
    avatar: 'AD',
    color: '#10b981',
    bio: 'Manufacturing flow architect with a passion for plant load balancing. Connects CRM workflows directly with factory floor capacity gauges to streamline shipping.',
    specialities: ['Plant Logistics', 'Floor Sync', 'Supply Chain Mapping'],
    dealsClosed: 25,
    revenueClosed: '₹18Cr+'
  },
  {
    id: 6,
    name: 'Ananya Roy',
    role: 'Sales Executive',
    department: 'Sales',
    city: 'Kolkata',
    rating: 4.8,
    leads: 62,
    avatar: 'AR',
    color: '#ea580c',
    bio: 'Enthusiastic enterprise sales representative specializing in chemical manufacturing pipelines and bulk pharmaceutical distributor contracts.',
    specialities: ['Bulk Chemicals', 'Pharma Logistics', 'Cold Chain Shipping'],
    dealsClosed: 41,
    revenueClosed: '₹22Cr+'
  }
];

export default function Users() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [cityFilter, setCityFilter] = useState('All');
  
  // Modal states
  const [selectedBda, setSelectedBda] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingBda, setBookingBda] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('11:00 AM');
  const [loading, setLoading] = useState(false);

  const depts = ['All', 'Sales', 'Operations', 'Support', 'Management'];
  const cities = ['All', 'Mumbai', 'Bangalore', 'Delhi', 'Chennai', 'Pune', 'Kolkata'];

  const filteredBdaList = bdaList.filter(bda => {
    const matchesSearch = bda.name.toLowerCase().includes(search.toLowerCase()) || 
                          bda.role.toLowerCase().includes(search.toLowerCase()) ||
                          bda.specialities.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchesDept = deptFilter === 'All' || bda.department === deptFilter;
    const matchesCity = cityFilter === 'All' || bda.city === cityFilter;
    return matchesSearch && matchesDept && matchesCity;
  });

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate scheduling delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    setLoading(false);
    setShowBooking(false);
    toast.success(`Consultation successfully scheduled with ${bookingBda.name} for ${bookingDate} at ${bookingTime}! 📅`);
  };

  return (
    <div style={{ background: 'var(--pub-bg)', color: 'var(--pub-text)', fontFamily: "'Inter', sans-serif", minHeight: '100vh', padding: '5rem 2rem' }}>
      
      {/* Background radial glows */}
      <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
        
        {/* Header Block */}
        <motion.div initial="hidden" animate="visible" variants={stagger} style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <motion.div variants={fadeUp}>
            <span style={{ display: 'inline-block', background: 'var(--pub-badge-pill-bg)', border: '1px solid var(--pub-badge-pill-border)', borderRadius: 100, padding: '6px 18px', fontSize: '0.82rem', color: 'var(--pub-badge-pill-text)', fontWeight: 600, marginBottom: '1.2rem' }}>BDAs Directory</span>
          </motion.div>
          <motion.h1 variants={fadeUp} style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: '1.2rem', color: 'var(--pub-text)' }}>
            Meet Our AI-Powered{' '}
            <span style={{ background: 'linear-gradient(135deg,#818cf8,#c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>BDAs & Teams</span>
          </motion.h1>
          <motion.p variants={fadeUp} style={{ color: 'var(--pub-text-sub)', fontSize: '1.1rem', maxWidth: 620, margin: '0 auto' }}>
            Connect with our certified manufacturing business development associates to audit your sales pipelines and configure ERP SAP connections.
          </motion.p>
        </motion.div>

        {/* Filter and Search command board */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          style={{ background: 'var(--pub-card-bg)', border: '1px solid var(--pub-card-border)', borderRadius: 20, padding: '1.5rem', marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', backdropFilter: 'blur(10px)' }}>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ flex: 1, minWidth: 260, position: 'relative' }}>
              <MdSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={20} />
              <input 
                type="text" 
                placeholder="Search associate by name, role or specialities..." 
                value={search} 
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', background: 'var(--pub-input-bg)', border: '1px solid var(--pub-input-border)', borderRadius: 12, color: 'var(--pub-text)', outline: 'none', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            {/* Quick stats label */}
            <div style={{ fontSize: '0.88rem', color: '#818cf8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <MdCheckCircle size={16} /> {filteredBdaList.length} Active Associates Found
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', borderTop: '1px solid var(--pub-section-divider)', paddingTop: '1.2rem' }}>
            
            {/* Department Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <MdFilterList size={16} color="rgba(255,255,255,0.4)" />
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--pub-text-muted)', textTransform: 'uppercase' }}>Department:</span>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {depts.map(dept => (
                  <button key={dept} onClick={() => setDeptFilter(dept)}
                    style={{
                      background: deptFilter === dept ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(99,102,241,0.1)',
                      border: deptFilter === dept ? '1px solid #6366f1' : '1px solid rgba(99,102,241,0.25)',
                      borderRadius: 20, padding: '6px 16px', fontSize: '0.8rem', fontWeight: 700,
                      color: deptFilter === dept ? '#fff' : '#a5b4fc',
                      cursor: 'pointer', transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { if(deptFilter !== dept) { e.currentTarget.style.background = 'rgba(99,102,241,0.2)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)'; } }}
                    onMouseLeave={e => { if(deptFilter !== dept) { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)'; } }}
                  >{dept}</button>
                ))}
              </div>
            </div>

            {/* City Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
              <MdLocationOn size={16} color="rgba(255,255,255,0.4)" />
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--pub-text-muted)', textTransform: 'uppercase' }}>Region:</span>
              <select value={cityFilter} onChange={e => setCityFilter(e.target.value)}
                style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, color: '#a5b4fc', fontSize: '0.85rem', padding: '7px 14px', outline: 'none', cursor: 'pointer', fontWeight: 600 }}>
                {cities.map(city => <option key={city} value={city} style={{ background: '#0c0c24', color: '#fff' }}>{city}</option>)}
              </select>
            </div>

          </div>
        </motion.div>

        {/* Associates Cards Grid */}
        <motion.div initial="hidden" animate="visible" variants={stagger}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.8rem' }}>
          
          {filteredBdaList.map((bda, idx) => (
            <motion.div key={bda.id} variants={fadeUp}
              style={{ background: 'var(--pub-card-bg)', border: '1px solid var(--pub-card-border)', borderRadius: 24, padding: '2rem', display: 'flex', flexDirection: 'column', position: 'relative', transition: 'all 0.3s' }}
              whileHover={{ y: -5, borderColor: `${bda.color}44`, boxShadow: `0 12px 30px ${bda.color}15` }}
            >
              {/* Top Row: Avatar & Rating */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: `linear-gradient(135deg, ${bda.color}, ${bda.color}aa)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 800, color: '#fff', boxShadow: `0 4px 15px ${bda.color}33` }}>
                    {bda.avatar}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--pub-text)', marginBottom: '0.2rem' }}>{bda.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: '0.74rem', fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: `${bda.color}22`, border: `1px solid ${bda.color}33`, color: bda.color }}>{bda.role}</span>
                    </div>
                  </div>
                </div>
                
                {/* Rating score */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', padding: '4px 8px', borderRadius: 8 }}>
                  <MdStar size={14} color="#fbbf24" />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fbbf24' }}>{bda.rating}</span>
                </div>
              </div>

              {/* Bio summary */}
              <p style={{ color: 'var(--pub-text-sub)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.2rem', flex: 1 }}>
                {bda.bio.substring(0, 105)}...
              </p>

              {/* Stats badges */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', padding: '1rem 0', borderTop: '1px solid var(--pub-card-border)', borderBottom: '1px solid var(--pub-card-border)', marginBottom: '1.2rem' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--pub-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Closed Deals</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--pub-text)', marginTop: 2 }}>{bda.dealsClosed}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--pub-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Volume</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: bda.color, marginTop: 2 }}>{bda.revenueClosed}</div>
                </div>
              </div>

              {/* Specialities list */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {bda.specialities.map(spec => (
                  <span key={spec} style={{ fontSize: '0.75rem', background: 'var(--pub-card-bg)', border: '1px solid var(--pub-card-border)', borderRadius: 6, padding: '3px 8px', color: 'var(--pub-text-sub)' }}>
                    {spec}
                  </span>
                ))}
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button 
                  onClick={() => setSelectedBda(bda)}
                  style={{ 
                    flex: 1, padding: '11px', 
                    background: 'rgba(99,102,241,0.15)', 
                    border: '1px solid rgba(99,102,241,0.4)', 
                    borderRadius: 10, color: '#a5b4fc', 
                    fontSize: '0.85rem', fontWeight: 700, 
                    cursor: 'pointer', transition: 'all 0.2s' 
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.28)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.15)'; e.currentTarget.style.color = '#a5b4fc'; }}
                >
                  View Details
                </button>
                <button 
                  onClick={() => { setBookingBda(bda); setShowBooking(true); }}
                  style={{ 
                    flex: 1, padding: '11px', 
                    background: `linear-gradient(135deg, ${bda.color}, ${bda.color}cc)`, 
                    border: 'none', borderRadius: 10, color: '#fff', 
                    fontSize: '0.85rem', fontWeight: 700, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    gap: 6, cursor: 'pointer', transition: 'all 0.2s',
                    boxShadow: `0 4px 15px ${bda.color}40`
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none'; }}
                >
                  Book BDA <MdArrowForward size={15} />
                </button>
              </div>

            </motion.div>
          ))}
        </motion.div>

      </div>

      {/* ============================================================
          BDA PROFILE MODAL DRAWER
      ============================================================ */}
      <AnimatePresence>
        {selectedBda && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
            onClick={() => setSelectedBda(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: '100%', maxWidth: 580, background: 'var(--pub-bg)', border: '1px solid var(--pub-card-border)', borderRadius: 24, padding: '2rem', boxShadow: '0 25px 50px rgba(0,0,0,0.4)', position: 'relative' }}
              onClick={e => e.stopPropagation()}>
              
              <button onClick={() => setSelectedBda(null)} style={{ position: 'absolute', top: 20, right: 20, background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#cbd5e1' }}>
                <MdClose size={18} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: '1.5rem' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: `linear-gradient(135deg, ${selectedBda.color}, ${selectedBda.color}aa)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
                  {selectedBda.avatar}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--pub-text)', marginBottom: '0.2rem' }}>{selectedBda.name}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: 4, background: `${selectedBda.color}22`, border: `1px solid ${selectedBda.color}33`, color: selectedBda.color }}>{selectedBda.role}</span>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <MdLocationOn size={14} color="#818cf8" /> {selectedBda.city}, India
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ background: 'var(--pub-card-bg)', border: '1px solid var(--pub-card-border)', borderRadius: 16, padding: '1.2rem', marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '0.85rem', color: selectedBda.color, textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem' }}>Professional Bio</h4>
                <p style={{ color: 'var(--pub-text-sub)', fontSize: '0.92rem', lineHeight: 1.6 }}>{selectedBda.bio}</p>
              </div>

              {/* Achievements Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                {[
                  { label: 'Rating Score', val: `${selectedBda.rating} / 5.0` },
                  { label: 'Total Deals', val: selectedBda.dealsClosed },
                  { label: 'Volume Managed', val: selectedBda.revenueClosed }
                ].map((stat, i) => (
                  <div key={i} style={{ padding: '0.8rem', background: 'var(--pub-card-bg)', border: '1px solid var(--pub-card-border)', borderRadius: 12 }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--pub-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{stat.label}</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--pub-text)', marginTop: 4 }}>{stat.val}</div>
                  </div>
                ))}
              </div>

              {/* Specialities checklist */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '0.85rem', color: 'var(--pub-text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.8rem' }}>Industry Domains &amp; Specialities</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {selectedBda.specialities.map(spec => (
                    <span key={spec} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', background: 'var(--pub-card-border)', borderRadius: 20, padding: '4px 12px', color: 'var(--pub-text-sub)' }}>
                      <MdCheckCircle size={14} color="var(--pub-accent)" /> {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer action */}
              <div style={{ display: 'flex', gap: 12 }}>
                <button 
                  onClick={() => setSelectedBda(null)}
                  style={{ 
                    flex: 1, padding: '12px', 
                    background: 'var(--pub-card-border)', 
                    border: '1px solid var(--pub-card-border)', 
                    borderRadius: 12, color: 'var(--pub-text)', 
                    fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--pub-bg)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--pub-card-border)'; }}
                >
                  Close Profile
                </button>
                <button 
                  onClick={() => { setBookingBda(selectedBda); setSelectedBda(null); setShowBooking(true); }}
                  style={{ 
                    flex: 1.5, padding: '12px', 
                    background: `var(--pub-accent)`, 
                    border: 'none', borderRadius: 12, color: 'var(--pub-bg)', 
                    fontSize: '0.9rem', fontWeight: 700, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    gap: 6, cursor: 'pointer', transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                >
                  Schedule Free Audit <MdArrowForward size={16} />
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ============================================================
          BDA BOOKING POPUP DIALOG
      ============================================================ */}
      <AnimatePresence>
        {showBooking && bookingBda && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', zIndex: 2100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
            onClick={() => setShowBooking(false)}>
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }}
              style={{ width: '100%', maxWidth: 440, background: 'var(--pub-bg)', border: '1px solid var(--pub-card-border)', borderRadius: 24, padding: '2rem', boxShadow: '0 25px 60px rgba(0,0,0,0.5)', position: 'relative' }}
              onClick={e => e.stopPropagation()}>
              
              <button onClick={() => setShowBooking(false)} style={{ position: 'absolute', top: 20, right: 20, background: 'var(--pub-card-border)', border: '1px solid var(--pub-card-border)', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--pub-text)' }}>
                <MdClose size={20} />
              </button>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--pub-text)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <MdFactory size={22} color="var(--pub-accent)" /> Book Audit with {bookingBda.name}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--pub-text-sub)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                Schedule a 30-minute workspace audit call to map custom warehouse logistics or configure SAP/Oracle ERP synchronizers.
              </p>

              <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--pub-text-muted)', marginBottom: '0.3rem', fontWeight: 500 }}>Select Date *</label>
                  <input required type="date" min={new Date().toISOString().split('T')[0]} value={bookingDate} onChange={e => setBookingDate(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem 1rem', background: 'var(--pub-input-bg)', border: '1px solid var(--pub-input-border)', borderRadius: 10, color: 'var(--pub-text)', outline: 'none', colorScheme: 'dark' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--pub-text-muted)', marginBottom: '0.3rem', fontWeight: 500 }}>Select Time Slot *</label>
                  <select required value={bookingTime} onChange={e => setBookingTime(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem 1rem', background: 'var(--pub-input-bg)', border: '1px solid var(--pub-input-border)', borderRadius: 10, color: 'var(--pub-text)', outline: 'none', cursor: 'pointer' }}>
                    {['10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM'].map((slot) => (
                       <option key={slot} value={slot} style={{ background: 'var(--pub-bg)', color: 'var(--pub-text)' }}>{slot}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--pub-text-muted)', marginBottom: '0.3rem', fontWeight: 500 }}>Your Business Email *</label>
                  <input required type="email" placeholder="you@company.com"
                    style={{ width: '100%', padding: '0.7rem 1rem', background: 'var(--pub-input-bg)', border: '1px solid var(--pub-input-border)', borderRadius: 10, color: 'var(--pub-text)', outline: 'none' }} />
                </div>

                <button type="submit" disabled={loading}
                  style={{ 
                    width: '100%', marginTop: '0.5rem', padding: '13px', 
                    background: 'linear-gradient(135deg,#10b981,#059669)', 
                    border: 'none', borderRadius: 12, color: '#fff', 
                    fontWeight: 700, fontSize: '0.95rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    gap: 6, cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 18px rgba(16,185,129,0.4)',
                    opacity: loading ? 0.7 : 1, transition: 'all 0.2s'
                  }}
                >
                  {loading ? (
                    <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                  ) : (
                    <>Confirm Consultation <MdDone size={16} /></>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
