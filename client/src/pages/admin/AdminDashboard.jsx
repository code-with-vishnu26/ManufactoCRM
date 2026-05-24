import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MdPeople, MdLeaderboard, MdAttachMoney, MdCheckCircle,
  MdManageAccounts, MdBarChart, MdSettings, MdLogout,
  MdAdminPanelSettings, MdTrendingUp, MdNotifications,
} from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const stats = [
  { label: 'Total Users',     value: '24',    icon: MdPeople,       color: '#6366f1', sub: '+3 this month' },
  { label: 'Total Leads',     value: '1,248', icon: MdLeaderboard,  color: '#8b5cf6', sub: '+142 this week' },
  { label: 'Revenue Pipeline',value: '₹8.4Cr',icon: MdAttachMoney,  color: '#10b981', sub: 'Active pipeline' },
  { label: 'System Health',   value: '99.9%', icon: MdCheckCircle,  color: '#22c55e', sub: 'All systems go' },
];

const recentActivity = [
  { user: 'Rahul Sharma',  action: 'New user registered',       role: 'Sales Executive', time: '2m ago' },
  { user: 'Anjali Gupta',  action: 'Closed deal – JSW Steel',   role: 'Team Lead',       time: '18m ago' },
  { user: 'Vikram Singh',  action: 'Updated lead status',        role: 'Sales Executive', time: '45m ago' },
  { user: 'Priya Nair',    action: 'Generated AI proposal',      role: 'Sales Executive', time: '1h ago' },
  { user: 'Amit Kumar',    action: 'Added 12 new leads via CSV', role: 'Team Lead',       time: '2h ago' },
];

const teamBreakdown = [
  { role: 'Admin',           count: 1,  color: '#ef4444' },
  { role: 'Team Lead',       count: 3,  color: '#8b5cf6' },
  { role: 'Sales Executive', count: 8,  color: '#6366f1' },
];

const quickActions = [
  { label: 'Manage Users',  icon: MdManageAccounts, path: '/admin/users',    color: '#6366f1' },
  { label: 'View All Leads',icon: MdLeaderboard,    path: '/admin/leads',    color: '#8b5cf6' },
  { label: 'Analytics',     icon: MdBarChart,       path: '/admin/analytics',color: '#10b981' },
  { label: 'System Settings',icon: MdSettings,      path: '/admin/settings', color: '#f59e0b' },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg,#ef4444,#dc2626)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MdAdminPanelSettings size={22} color="#fff" />
            </div>
            <span style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444', padding: '3px 12px', borderRadius: 100, fontSize: 12, fontWeight: 700 }}>
              ADMIN
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
            Admin Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>
            Welcome back, <strong style={{ color: 'var(--text-primary)' }}>{user?.name}</strong> · Full system access
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            <MdNotifications size={16} /> Alerts
          </button>
          <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: '#ef4444', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
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
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
              <MdTrendingUp size={12} color="#10b981" />{s.sub}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* 2-col grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16, marginBottom: '2rem' }}>
        {/* Recent Activity */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16, padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.2rem' }}>Recent Activity</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['User', 'Action', 'Role', 'Time'].map(h => (
                  <th key={h} style={{ textAlign: 'left', fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', paddingBottom: 10 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((a, i) => (
                <tr key={i} style={{ borderTop: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '10px 0', fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>{a.user}</td>
                  <td style={{ padding: '10px 8px', fontSize: 12, color: 'var(--text-secondary)' }}>{a.action}</td>
                  <td style={{ padding: '10px 0', fontSize: 11 }}>
                    <span style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8', padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>{a.role}</span>
                  </td>
                  <td style={{ padding: '10px 0', fontSize: 11, color: 'var(--text-muted)' }}>{a.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Team Overview + Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16, padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.2rem' }}>Team Breakdown</h3>
            {teamBreakdown.map((t, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: t.color }} />
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{t.role}</span>
                </div>
                <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>{t.count}</span>
              </div>
            ))}
          </motion.div>

          {/* Quick Actions */}
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
