import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MdGroup, MdTrendingUp, MdCheckCircle, MdBarChart,
  MdLeaderboard, MdAssignment, MdPieChart, MdLogout,
  MdNotifications, MdPersonAdd,
} from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const stats = [
  { label: 'My Team Size',    value: '8',   icon: MdGroup,       color: '#8b5cf6', sub: '2 added this month' },
  { label: 'Active Leads',    value: '234', icon: MdTrendingUp,  color: '#6366f1', sub: '45 updated today' },
  { label: 'Closed This Month', value: '42',icon: MdCheckCircle, color: '#10b981', sub: '↑ 18% vs last month' },
  { label: 'Team Target',     value: '78%', icon: MdBarChart,    color: '#f59e0b', sub: '22% remaining' },
];

const teamMembers = [
  { name: 'Rahul Sharma',  leads: 52, closed: 14, revenue: '₹1.2Cr' },
  { name: 'Anjali Gupta',  leads: 48, closed: 12, revenue: '₹98L' },
  { name: 'Vikram Singh',  leads: 41, closed: 8,  revenue: '₹72L' },
  { name: 'Priya Nair',    leads: 39, closed: 6,  revenue: '₹58L' },
  { name: 'Amit Kumar',    leads: 54, closed: 2,  revenue: '₹38L' },
];

const pipelineStages = [
  { stage: 'Prospecting', count: 45, color: '#6366f1', pct: 55 },
  { stage: 'Negotiation', count: 23, color: '#8b5cf6', pct: 35 },
  { stage: 'Closing',     count: 12, color: '#10b981', pct: 10 },
];

const quickActions = [
  { label: 'View Leads',     icon: MdLeaderboard, path: '/teamlead/leads',     color: '#6366f1' },
  { label: 'Team Analytics', icon: MdPieChart,    path: '/teamlead/analytics', color: '#8b5cf6' },
  { label: 'Assign Leads',   icon: MdAssignment,  path: '/teamlead/leads',     color: '#10b981' },
  { label: 'Add Member',     icon: MdPersonAdd,   path: '/teamlead/team',      color: '#f59e0b' },
];

export default function TeamLeadDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MdGroup size={22} color="#fff" />
            </div>
            <span style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)', color: '#8b5cf6', padding: '3px 12px', borderRadius: 100, fontSize: 12, fontWeight: 700 }}>
              TEAM LEAD
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
            Team Lead Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>
            Welcome back, <strong style={{ color: 'var(--text-primary)' }}>{user?.name}</strong> · Managing {teamMembers.length} executives
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            <MdNotifications size={16} /> Alerts
          </button>
          <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: '1px solid rgba(139,92,246,0.3)', background: 'rgba(139,92,246,0.08)', color: '#8b5cf6', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            <MdLogout size={16} /> Logout
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div initial="hidden" animate="visible" variants={stagger}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: '2rem' }}>
        {stats.map((s, i) => (
          <motion.div key={i} variants={fadeUp}
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16, padding: '1.5rem' }}
            whileHover={{ y: -3, boxShadow: `0 8px 24px ${s.color}20` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={20} color={s.color} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, background: `linear-gradient(135deg, ${s.color}, ${s.color}aa)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', paddingRight: 4 }}>{s.value}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>{s.sub}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* 2-col grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16, marginBottom: '2rem' }}>
        {/* Team Performance */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16, padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.2rem' }}>Team Performance</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Member', 'Leads', 'Closed', 'Revenue'].map(h => (
                  <th key={h} style={{ textAlign: 'left', fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', paddingBottom: 10 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((m, i) => (
                <tr key={i} style={{ borderTop: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '10px 0', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{m.name}</td>
                  <td style={{ padding: '10px 8px', fontSize: 13, color: 'var(--text-secondary)' }}>{m.leads}</td>
                  <td style={{ padding: '10px 8px', fontSize: 13 }}>
                    <span style={{ color: '#10b981', fontWeight: 700 }}>{m.closed}</span>
                  </td>
                  <td style={{ padding: '10px 0', fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>{m.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Pipeline + Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16, padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.2rem' }}>Pipeline Overview</h3>
            {pipelineStages.map((p, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{p.stage}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{p.count} leads</span>
                </div>
                <div style={{ height: 6, background: 'var(--border-color)', borderRadius: 3 }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${p.pct}%` }} transition={{ duration: 0.8, delay: i * 0.15 }}
                    style={{ height: '100%', background: p.color, borderRadius: 3 }} />
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16, padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.2rem' }}>Quick Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {quickActions.map((a, i) => (
                <button key={i} onClick={() => navigate(a.path)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, border: `1px solid ${a.color}20`, background: `${a.color}08`, color: a.color, cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${a.color}18`; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = `${a.color}08`; e.currentTarget.style.transform = 'none'; }}>
                  <a.icon size={16} /> {a.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
