import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MdListAlt, MdCheckCircle, MdAttachMoney, MdStar,
  MdTrendingUp, MdAutoAwesome, MdPerson, MdAdd, MdLogout,
  MdNotifications, MdLocalFireDepartment,
} from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const stats = [
  { label: 'My Leads',     value: '48',    icon: MdListAlt,     color: '#6366f1', sub: '6 new today' },
  { label: 'Closed Deals', value: '12',    icon: MdCheckCircle, color: '#10b981', sub: 'This month' },
  { label: 'My Revenue',   value: '₹2.4Cr',icon: MdAttachMoney, color: '#8b5cf6', sub: 'Active pipeline' },
  { label: 'Success Rate', value: '75%',   icon: MdStar,        color: '#f59e0b', sub: '↑ 5% vs last month' },
];

const myLeads = [
  { name: 'Rajesh Verma',  company: 'JSW Steel Ltd',      status: 'Hot',  lastContact: '1h ago' },
  { name: 'Suneeta Iyer',  company: 'Tata Motors',        status: 'Warm', lastContact: '3h ago' },
  { name: 'Ravi Mahajan',  company: 'Mahindra & Mahindra',status: 'Cold', lastContact: '1d ago' },
  { name: 'Deepa Shah',    company: 'Sun Pharma',         status: 'Warm', lastContact: '2h ago' },
  { name: 'Karan Mehta',   company: 'L&T Engineering',    status: 'Hot',  lastContact: '30m ago' },
];

const STATUS_COLORS = { Hot: '#ef4444', Warm: '#f59e0b', Cold: '#6366f1' };

const tasks = [
  { text: 'Follow-up call with JSW Steel',          done: false },
  { text: 'Send proposal to Tata Motors',           done: true },
  { text: 'Update lead status for 3 contacts',      done: false },
];

const quickActions = [
  { label: 'Add New Lead',  icon: MdAdd,         path: '/sales/leads',    color: '#6366f1' },
  { label: 'My Pipeline',   icon: MdTrendingUp,  path: '/sales/pipeline', color: '#8b5cf6' },
  { label: 'AI Assistant',  icon: MdAutoAwesome, path: '/sales/ai',       color: '#10b981' },
  { label: 'My Profile',    icon: MdPerson,      path: '/sales/profile',  color: '#f59e0b' },
];

export default function SalesDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasksDone, setTasksDone] = useState(tasks.map(t => t.done));

  return (
    <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto', fontFamily: "'Inter', sans-serif" }}>

      {/* Header */}
      <motion.div initial="hidden" animate="visible" variants={fadeUp}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MdTrendingUp size={22} color="#fff" />
            </div>
            <span style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.25)', color: '#6366f1', padding: '3px 12px', borderRadius: 100, fontSize: 12, fontWeight: 700 }}>
              SALES EXECUTIVE
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 900, color: 'var(--text-primary)', margin: 0 }}>
            Sales Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>
            Welcome back, <strong style={{ color: 'var(--text-primary)' }}>{user?.name}</strong> · Let's close more deals today!
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            <MdNotifications size={16} />
          </button>
          <button onClick={() => navigate('/sales/leads', { state: { openAdd: true } })}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
            <MdAdd size={16} /> Add Lead
          </button>
          <button onClick={logout}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.08)', color: '#6366f1', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 16 }}>
        {/* My Leads Table */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16, padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>My Leads</h3>
            <button onClick={() => navigate('/sales/leads')}
              style={{ fontSize: 12, color: '#6366f1', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>
              View All →
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Lead', 'Company', 'Status', 'Last Contact'].map(h => (
                  <th key={h} style={{ textAlign: 'left', fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', paddingBottom: 10 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {myLeads.map((l, i) => (
                <tr key={i} style={{ borderTop: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '10px 0', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{l.name}</td>
                  <td style={{ padding: '10px 8px', fontSize: 12, color: 'var(--text-secondary)' }}>{l.company}</td>
                  <td style={{ padding: '10px 4px' }}>
                    <span style={{
                      background: `${STATUS_COLORS[l.status]}18`, color: STATUS_COLORS[l.status],
                      padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                      display: 'inline-flex', alignItems: 'center', gap: 4,
                    }}>
                      {l.status === 'Hot' && <MdLocalFireDepartment size={10} />}{l.status}
                    </span>
                  </td>
                  <td style={{ padding: '10px 0', fontSize: 11, color: 'var(--text-muted)' }}>{l.lastContact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Tasks + Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Today's Tasks */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 16, padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.2rem' }}>Today's Tasks</h3>
            {tasks.map((t, i) => (
              <div key={i} onClick={() => setTasksDone(d => d.map((v, j) => j === i ? !v : v))}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 0', borderBottom: i < tasks.length - 1 ? '1px solid var(--border-color)' : 'none', cursor: 'pointer' }}>
                <div style={{
                  width: 18, height: 18, borderRadius: 5, border: `2px solid ${tasksDone[i] ? '#10b981' : 'var(--border-color)'}`,
                  background: tasksDone[i] ? '#10b981' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, transition: 'all 0.2s',
                }}>
                  {tasksDone[i] && <MdCheckCircle size={12} color="#fff" />}
                </div>
                <span style={{ fontSize: 13, color: tasksDone[i] ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: tasksDone[i] ? 'line-through' : 'none', transition: 'all 0.2s', lineHeight: 1.4 }}>
                  {t.text}
                </span>
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
