import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import {
  MdDashboard, MdPeople, MdAttachMoney, MdTrendingUp, MdTrendingDown,
  MdCheckCircle, MdSchedule, MdBusiness, MdAdd, MdDownload,
  MdAutoAwesome, MdPerson, MdGroups, MdSettings, MdStorage,
  MdBarChart, MdDataUsage, MdSpeed, MdStar, MdRefresh,
  MdLeaderboard, MdAssignment, MdExitToApp, MdNotifications
} from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import toast from 'react-hot-toast';

const COLORS = ['#4f46e5', '#8b5cf6', '#06b6d4', '#10b981', '#ff9f43', '#ef4444', '#f59e0b'];

// ─── Mock Data ────────────────────────────────────────────────────────────────
const mockRevenue = [
  { month: 'Jan', revenue: 3200000, target: 3000000 },
  { month: 'Feb', revenue: 4100000, target: 3500000 },
  { month: 'Mar', revenue: 3800000, target: 4000000 },
  { month: 'Apr', revenue: 5200000, target: 4500000 },
  { month: 'May', revenue: 4800000, target: 5000000 },
  { month: 'Jun', revenue: 6100000, target: 5500000 },
  { month: 'Jul', revenue: 5700000, target: 6000000 },
  { month: 'Aug', revenue: 6900000, target: 6500000 },
  { month: 'Sep', revenue: 7200000, target: 7000000 },
  { month: 'Oct', revenue: 6800000, target: 7500000 },
  { month: 'Nov', revenue: 8100000, target: 8000000 },
  { month: 'Dec', revenue: 9200000, target: 8500000 },
];

const mockLeadSources = [
  { name: 'Cold Call',     value: 32 },
  { name: 'Referral',      value: 24 },
  { name: 'LinkedIn',      value: 18 },
  { name: 'Trade Show',    value: 14 },
  { name: 'Website',       value: 8  },
  { name: 'Email Campaign',value: 4  },
];

const mockTeamPerf = [
  { name: 'Rahul V.',   leads: 18, revenue: 2850000, target: 3000000 },
  { name: 'Sneha J.',   leads: 14, revenue: 2180000, target: 2500000 },
  { name: 'Vikram S.',  leads: 12, revenue: 1750000, target: 2000000 },
  { name: 'Priya M.',   leads: 10, revenue: 1320000, target: 1800000 },
  { name: 'Arjun T.',   leads: 9,  revenue: 980000,  target: 1500000 },
];

const mockConversion = [
  { month: 'Jan', rate: 28 }, { month: 'Feb', rate: 32 }, { month: 'Mar', rate: 30 },
  { month: 'Apr', rate: 38 }, { month: 'May', rate: 35 }, { month: 'Jun', rate: 42 },
  { month: 'Jul', rate: 40 }, { month: 'Aug', rate: 45 }, { month: 'Sep', rate: 48 },
  { month: 'Oct', rate: 44 }, { month: 'Nov', rate: 52 }, { month: 'Dec', rate: 55 },
];

const mockActivities = [
  { id:1,  avatar:'RV', name:'Rahul Verma',    action:'created a new lead',       target:'Tata Motors',       time:'2m ago',   color:'#4f46e5' },
  { id:2,  avatar:'SJ', name:'Sneha Joshi',    action:'closed deal with',         target:'Sun Pharma',        time:'15m ago',  color:'#10b981' },
  { id:3,  avatar:'VS', name:'Vikram Singh',   action:'scheduled meeting with',   target:'JSW Steel',         time:'32m ago',  color:'#8b5cf6' },
  { id:4,  avatar:'PM', name:'Priya Mehta',    action:'updated status for',       target:'Infosys Ltd',       time:'1h ago',   color:'#f59e0b' },
  { id:5,  avatar:'AT', name:'Arjun Tiwari',   action:'sent proposal to',         target:'HDFC Bank',         time:'2h ago',   color:'#ef4444' },
  { id:6,  avatar:'NK', name:'Neha Kapoor',    action:'added note on',            target:'Reliance Industries',time:'3h ago', color:'#06b6d4' },
  { id:7,  avatar:'MS', name:'Mohan Sharma',   action:'completed follow-up with', target:'L&T Engineering',  time:'4h ago',   color:'#4f46e5' },
  { id:8,  avatar:'AD', name:'Asha Desai',     action:'generated AI report for',  target:'Wipro Limited',    time:'5h ago',   color:'#8b5cf6' },
  { id:9,  avatar:'KR', name:'Kiran Rao',      action:'converted lead',           target:'ITC Ltd',           time:'6h ago',   color:'#10b981' },
  { id:10, avatar:'DP', name:'Dev Patel',      action:'assigned lead to team',    target:'Mahindra & Mahindra',time:'8h ago', color:'#f59e0b' },
];

// ─── Animated Counter ─────────────────────────────────────────────────────────
const AnimatedNumber = ({ value, prefix = '', suffix = '', decimals = 0 }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const start = 0; const end = value; const duration = 1200;
    const step = (end - start) / (duration / 16);
    let current = start;
    ref.current = setInterval(() => {
      current += step;
      if (current >= end) { current = end; clearInterval(ref.current); }
      setDisplay(current);
    }, 16);
    return () => clearInterval(ref.current);
  }, [value]);
  const formatted = decimals > 0 ? display.toFixed(decimals) : Math.floor(display).toLocaleString('en-IN');
  return <span>{prefix}{formatted}{suffix}</span>;
};

// ─── KPI Card ─────────────────────────────────────────────────────────────────
const KpiCard = ({ icon: Icon, label, value, prefix, suffix, decimals, trend, trendLabel, color, delay }) => {
  const up = trend >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      style={{
        background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 16,
        padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)', position: 'relative', overflow: 'hidden'
      }}
    >
      <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, borderRadius: '0 0 0 80px', background: `${color}08` }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12,
          background: `linear-gradient(135deg, ${color}, ${color}cc)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 4px 12px ${color}30`
        }}>
          <Icon size={22} color="white" />
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700,
          color: up ? '#10b981' : '#ef4444',
          background: up ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
          padding: '3px 8px', borderRadius: 20
        }}>
          {up ? <MdTrendingUp size={14}/> : <MdTrendingDown size={14}/>}
          {Math.abs(trend)}%
        </div>
      </div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 800, color: '#1e293b', letterSpacing: '-0.5px' }}>
          <AnimatedNumber value={value} prefix={prefix} suffix={suffix} decimals={decimals} />
        </div>
        <div style={{ fontSize: 12, color: '#64748b', marginTop: 4, fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{trendLabel}</div>
      </div>
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { user } = useAuth();
  const [kpis, setKpis]         = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    API.get('/analytics/dashboard')
      .then(r => setKpis(r.data?.kpis))
      .catch(() => setKpis({
        totalRevenue: 71200000, totalUsers: 24, allLeads: 148,
        conversionRate: 42, monthlySales: 9200000, pendingTasks: 17
      }));
  }, []);

  const handleAiReport = async () => {
    setAiLoading(true);
    toast.loading('Generating AI report…', { id: 'ai-report' });
    try {
      await new Promise(r => setTimeout(r, 2000));
      toast.success('AI Report generated! Check your email.', { id: 'ai-report', icon: '🤖' });
    } catch {
      toast.error('Failed to generate report', { id: 'ai-report' });
    } finally { setAiLoading(false); }
  };

  const handleExport = () => {
    toast.success('Dashboard data exported as CSV!', { icon: '📊' });
  };

  const today = new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const kv = kpis || {};

  const cardStyle = {
    background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)',
    borderRadius: 16, padding: 22, boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
  };

  return (
    <div style={{ padding: '4px 0 24px' }}>

      {/* ── Header ── */}
      <motion.div initial={{ opacity:0,y:-16 }} animate={{ opacity:1,y:0 }}
        style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
            <div style={{ width:36,height:36,borderRadius:10,background:'linear-gradient(135deg,#4f46e5,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center' }}>
              <MdDashboard size={20} color="white"/>
            </div>
            <h2 style={{ fontSize:22, fontWeight:800, color:'#1e293b', letterSpacing:'-0.3px' }}>
              Admin Command Center
            </h2>
          </div>
          <p style={{ fontSize:13, color:'#64748b', marginLeft:46 }}>
            {greeting}, {user?.name?.split(' ')[0]}! · {today}
          </p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={handleAiReport} disabled={aiLoading}
            style={{ display:'flex',alignItems:'center',gap:8,padding:'10px 18px',borderRadius:10,border:'none',cursor:'pointer',
              background:'linear-gradient(135deg,#4f46e5,#8b5cf6)',color:'white',fontWeight:700,fontSize:13,
              boxShadow:'0 4px 12px rgba(79,70,229,0.3)',opacity:aiLoading?0.7:1 }}>
            <MdAutoAwesome size={16}/>{aiLoading ? 'Generating…' : 'Generate AI Report'}
          </button>
          <button onClick={handleExport}
            style={{ display:'flex',alignItems:'center',gap:8,padding:'10px 16px',borderRadius:10,border:'1px solid rgba(0,0,0,0.1)',
              cursor:'pointer',background:'white',color:'#475569',fontWeight:600,fontSize:13 }}>
            <MdDownload size={16}/> Export
          </button>
        </div>
      </motion.div>

      {/* ── KPI Cards ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:14, marginBottom:20 }}>
        <KpiCard icon={MdAttachMoney}  label="Total Revenue"    value={kv.totalRevenue||71200000}  prefix="₹" decimals={0} trend={18}  trendLabel="vs last year"   color="#4f46e5" delay={0}   />
        <KpiCard icon={MdPeople}       label="Total Users"      value={kv.totalUsers||24}           decimals={0} trend={12}  trendLabel="new this month" color="#8b5cf6" delay={0.05}/>
        <KpiCard icon={MdLeaderboard}  label="All Leads"        value={kv.allLeads||148}            decimals={0} trend={9}   trendLabel="vs last month"  color="#06b6d4" delay={0.1} />
        <KpiCard icon={MdTrendingUp}   label="Conversion Rate"  value={kv.conversionRate||42}       suffix="%" decimals={0} trend={7} trendLabel="improving"    color="#10b981" delay={0.15}/>
        <KpiCard icon={MdBarChart}     label="Monthly Sales"    value={kv.monthlySales||9200000}   prefix="₹" decimals={0} trend={15}  trendLabel="this month"     color="#f59e0b" delay={0.2} />
        <KpiCard icon={MdAssignment}   label="Pending Tasks"    value={kv.pendingTasks||17}         decimals={0} trend={-5}  trendLabel="action needed"  color="#ef4444" delay={0.25}/>
      </div>

      {/* ── Charts Row 1 ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:16, marginBottom:16 }}>

        {/* Revenue Trend */}
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.3 }} style={cardStyle}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
            <div>
              <h3 style={{ fontSize:15, fontWeight:800, color:'#1e293b' }}>Revenue Trend</h3>
              <p style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>12-month revenue vs target</p>
            </div>
            <div style={{ fontSize:13, fontWeight:700, color:'#10b981' }}>↑ 18% YoY</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={mockRevenue}>
              <defs>
                <linearGradient id="adminRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#4f46e5" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="adminTgtGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false}/>
              <XAxis dataKey="month" tick={{ fill:'#94a3b8', fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:'#94a3b8', fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v=>`₹${(v/100000).toFixed(0)}L`}/>
              <Tooltip formatter={(v,n) => [`₹${(v/100000).toFixed(1)}L`, n]} contentStyle={{ background:'#fff', border:'1px solid rgba(0,0,0,0.06)', borderRadius:10 }}/>
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#4f46e5" fill="url(#adminRevGrad)" strokeWidth={2.5} dot={false}/>
              <Area type="monotone" dataKey="target"  name="Target"  stroke="#10b981" fill="url(#adminTgtGrad)" strokeWidth={2} strokeDasharray="4 4" dot={false}/>
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:12, color:'#64748b' }}/>
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Lead Sources Pie */}
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.35 }} style={cardStyle}>
          <div style={{ marginBottom:16 }}>
            <h3 style={{ fontSize:15, fontWeight:800, color:'#1e293b' }}>Lead Sources</h3>
            <p style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>Breakdown by acquisition channel</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={mockLeadSources} cx="50%" cy="50%" outerRadius={75} dataKey="value" nameKey="name" label={({ name, value }) => `${value}%`} labelLine={false}>
                {mockLeadSources.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]}/>)}
              </Pie>
              <Tooltip formatter={(v,n) => [`${v}%`, n]} contentStyle={{ background:'#fff', border:'1px solid rgba(0,0,0,0.06)', borderRadius:10 }}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'6px 14px', marginTop:8 }}>
            {mockLeadSources.map((s,i) => (
              <div key={s.name} style={{ display:'flex', alignItems:'center', gap:5, fontSize:11 }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:COLORS[i%COLORS.length] }}/>
                <span style={{ color:'#64748b' }}>{s.name}</span>
                <span style={{ fontWeight:700, color:'#1e293b' }}>{s.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Charts Row 2 ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>

        {/* Team Performance Bar */}
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.4 }} style={cardStyle}>
          <div style={{ marginBottom:16 }}>
            <h3 style={{ fontSize:15, fontWeight:800, color:'#1e293b' }}>Team Performance</h3>
            <p style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>Revenue vs target by executive</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockTeamPerf} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false}/>
              <XAxis dataKey="name" tick={{ fill:'#94a3b8', fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:'#94a3b8', fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/100000).toFixed(0)}L`}/>
              <Tooltip formatter={(v,n) => [`₹${(v/100000).toFixed(1)}L`, n]} contentStyle={{ background:'#fff', border:'1px solid rgba(0,0,0,0.06)', borderRadius:10 }}/>
              <Bar dataKey="revenue" name="Revenue" fill="#4f46e5" radius={[4,4,0,0]}/>
              <Bar dataKey="target"  name="Target"  fill="#e0e7ff" radius={[4,4,0,0]}/>
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:12 }}/>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Monthly Conversion Line */}
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.45 }} style={cardStyle}>
          <div style={{ marginBottom:16 }}>
            <h3 style={{ fontSize:15, fontWeight:800, color:'#1e293b' }}>Monthly Conversion Rate</h3>
            <p style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>Lead-to-deal conversion % trend</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={mockConversion}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false}/>
              <XAxis dataKey="month" tick={{ fill:'#94a3b8', fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:'#94a3b8', fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v=>`${v}%`}/>
              <Tooltip formatter={(v) => [`${v}%`, 'Conversion Rate']} contentStyle={{ background:'#fff', border:'1px solid rgba(0,0,0,0.06)', borderRadius:10 }}/>
              <Line type="monotone" dataKey="rate" name="Conv. %" stroke="#10b981" strokeWidth={2.5}
                dot={{ fill:'#10b981', r:4, strokeWidth:2, stroke:'white' }}
                activeDot={{ r:6 }}/>
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* ── Bottom Row: Activity + System Status + Quick Actions ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr 1fr', gap:16 }}>

        {/* Activity Feed */}
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.5 }} style={cardStyle}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <h3 style={{ fontSize:15, fontWeight:800, color:'#1e293b' }}>Recent Activity</h3>
            <span style={{ fontSize:12, color:'#94a3b8' }}>Last 8 hours</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {mockActivities.map((act, i) => (
              <motion.div key={act.id} initial={{ opacity:0,x:-10 }} animate={{ opacity:1,x:0 }} transition={{ delay:0.5+i*0.04 }}
                style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom: i<mockActivities.length-1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>
                <div style={{ width:32, height:32, borderRadius:'50%', background:`linear-gradient(135deg,${act.color},${act.color}99)`,
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'white', flexShrink:0 }}>
                  {act.avatar}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, color:'#1e293b', fontWeight:600 }}>
                    <span style={{ color:act.color }}>{act.name}</span> {act.action} <span style={{ fontWeight:700 }}>{act.target}</span>
                  </div>
                  <div style={{ fontSize:10, color:'#94a3b8', marginTop:1 }}>{act.time}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.55 }} style={cardStyle}>
          <div style={{ marginBottom:16 }}>
            <h3 style={{ fontSize:15, fontWeight:800, color:'#1e293b' }}>System Status</h3>
            <p style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>All services operational</p>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {[
              { name:'API Health',   status:'Operational', uptime:'99.98%', color:'#10b981', icon:'⚡' },
              { name:'Database',     status:'Operational', uptime:'99.95%', color:'#10b981', icon:'🗄️' },
              { name:'AI Engine',    status:'Active',      uptime:'98.2%',  color:'#4f46e5', icon:'🤖' },
              { name:'Storage',      status:'77% Used',    uptime:'23% Free',color:'#f59e0b', icon:'💾' },
              { name:'Email Service',status:'Operational', uptime:'99.99%', color:'#10b981', icon:'📧' },
              { name:'Webhooks',     status:'Operational', uptime:'100%',   color:'#10b981', icon:'🔗' },
            ].map(s => (
              <div key={s.name} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 12px',
                borderRadius:10, background:'rgba(0,0,0,0.02)', border:'1px solid rgba(0,0,0,0.04)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:16 }}>{s.icon}</span>
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, color:'#1e293b' }}>{s.name}</div>
                    <div style={{ fontSize:11, color:'#94a3b8' }}>{s.uptime}</div>
                  </div>
                </div>
                <span style={{ fontSize:11, fontWeight:700, color:s.color,
                  background:`${s.color}15`, padding:'3px 8px', borderRadius:20 }}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.6 }} style={cardStyle}>
          <div style={{ marginBottom:16 }}>
            <h3 style={{ fontSize:15, fontWeight:800, color:'#1e293b' }}>Quick Actions</h3>
            <p style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>Admin shortcuts</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {[
              { label:'Create Lead',      icon:'➕', color:'#4f46e5', action:() => toast.success('Opening lead form…',{icon:'➕'}) },
              { label:'Add Employee',     icon:'👤', color:'#8b5cf6', action:() => toast.success('Opening employee form…',{icon:'👤'}) },
              { label:'Generate Report',  icon:'📊', color:'#10b981', action: handleAiReport },
              { label:'Export Data',      icon:'📥', color:'#06b6d4', action: handleExport },
              { label:'System Settings',  icon:'⚙️', color:'#f59e0b', action:() => toast('Navigating to settings…',{icon:'⚙️'}) },
              { label:'View Logs',        icon:'📋', color:'#ef4444', action:() => toast('Loading system logs…',{icon:'📋'}) },
            ].map(qa => (
              <button key={qa.label} onClick={qa.action}
                style={{ padding:'14px 12px', borderRadius:12, border:`1px solid ${qa.color}20`,
                  background:`${qa.color}08`, cursor:'pointer', textAlign:'center',
                  transition:'all 0.2s', display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}
                onMouseEnter={e => e.currentTarget.style.background = `${qa.color}16`}
                onMouseLeave={e => e.currentTarget.style.background = `${qa.color}08`}>
                <span style={{ fontSize:22 }}>{qa.icon}</span>
                <span style={{ fontSize:11, fontWeight:700, color:qa.color, lineHeight:1.2 }}>{qa.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default AdminDashboard;
