import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  MdGroups, MdTrendingUp, MdSchedule, MdPerson, MdAdd,
  MdAutoAwesome, MdBarChart, MdAssignment, MdCalendarToday,
  MdCheckCircle, MdPlayArrow, MdStar
} from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import toast from 'react-hot-toast';

const COLORS = ['#4f46e5', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

// ─── Mock Data ────────────────────────────────────────────────────────────────
const mockMembers = [
  { id:1, name:'Rahul Verma',    role:'Sr. Sales Executive', leads:18, won:9,  conversion:50, target:85, avatar:'RV', color:'#4f46e5' },
  { id:2, name:'Sneha Joshi',    role:'Sales Executive',     leads:14, won:6,  conversion:43, target:68, avatar:'SJ', color:'#8b5cf6' },
  { id:3, name:'Vikram Singh',   role:'Sales Executive',     leads:12, won:5,  conversion:42, target:60, avatar:'VS', color:'#10b981' },
  { id:4, name:'Priya Mehta',    role:'Jr. Sales Executive', leads:9,  won:3,  conversion:33, target:45, avatar:'PM', color:'#f59e0b' },
  { id:5, name:'Arjun Tiwari',   role:'Jr. Sales Executive', leads:7,  won:2,  conversion:29, target:35, avatar:'AT', color:'#06b6d4' },
];

const mockTeamPerf = [
  { name:'Rahul V.',  leads:18, revenue:2850000 },
  { name:'Sneha J.',  leads:14, revenue:2180000 },
  { name:'Vikram S.', leads:12, revenue:1750000 },
  { name:'Priya M.',  leads:9,  revenue:1320000 },
  { name:'Arjun T.',  leads:7,  revenue:980000  },
];

const mockLeadStatus = [
  { name:'New Lead',      value:22 },
  { name:'Qualified',     value:18 },
  { name:'Proposal Sent', value:14 },
  { name:'Negotiation',   value:10 },
  { name:'Closed Won',    value:9  },
  { name:'Closed Lost',   value:5  },
];

const mockUnassigned = [
  { id:'u1', company:'Bajaj Auto',    contact:'Suresh Patel',   industry:'Automotive',    value:750000,  priority:'High' },
  { id:'u2', company:'Dr Reddy\'s',   contact:'Dr. Meena Iyer', industry:'Pharma',        value:920000,  priority:'Critical' },
  { id:'u3', company:'Godrej Group',  contact:'Ravi Godrej',    industry:'Manufacturing', value:1100000, priority:'High' },
  { id:'u4', company:'SAIL',          contact:'Mohit Kumar',    industry:'Steel',         value:650000,  priority:'Medium' },
  { id:'u5', company:'Hero MotoCorp', contact:'Anand Jha',      industry:'Automotive',    value:830000,  priority:'High' },
];

// ─── KPI Card ─────────────────────────────────────────────────────────────────
const KpiCard = ({ icon: Icon, label, value, suffix='', color, sub, delay }) => (
  <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay }}
    style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.06)', borderRadius:16,
      padding:'18px 20px', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
      <div style={{ width:38, height:38, borderRadius:10, background:`linear-gradient(135deg,${color},${color}bb)`,
        display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 3px 10px ${color}30` }}>
        <Icon size={18} color="white"/>
      </div>
      <span style={{ fontSize:12, color:'#64748b', fontWeight:600 }}>{label}</span>
    </div>
    <div style={{ fontSize:22, fontWeight:800, color:'#1e293b', letterSpacing:'-0.4px' }}>{value}{suffix}</div>
    {sub && <div style={{ fontSize:11, color:'#94a3b8', marginTop:4 }}>{sub}</div>}
  </motion.div>
);

// ─── Member Card ──────────────────────────────────────────────────────────────
const MemberCard = ({ m, delay }) => (
  <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay }}
    style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.06)', borderRadius:14,
      padding:'16px 18px', boxShadow:'0 2px 6px rgba(0,0,0,0.04)' }}>
    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
      <div style={{ width:40, height:40, borderRadius:'50%', background:`linear-gradient(135deg,${m.color},${m.color}99)`,
        display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'white', flexShrink:0 }}>
        {m.avatar}
      </div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:13, fontWeight:700, color:'#1e293b' }}>{m.name}</div>
        <div style={{ fontSize:11, color:'#64748b' }}>{m.role}</div>
      </div>
      <div style={{ textAlign:'right' }}>
        <div style={{ fontSize:11, color:'#10b981', fontWeight:700 }}>{m.conversion}%</div>
        <div style={{ fontSize:10, color:'#94a3b8' }}>Conv.</div>
      </div>
    </div>
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
      {[
        { l:'Leads', v:m.leads, c:'#4f46e5' },
        { l:'Won',   v:m.won,   c:'#10b981' },
      ].map(s => (
        <div key={s.l} style={{ background:'rgba(0,0,0,0.02)', borderRadius:8, padding:'7px 10px', border:'1px solid rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize:10, color:'#94a3b8', marginBottom:2 }}>{s.l}</div>
          <div style={{ fontSize:15, fontWeight:800, color:s.c }}>{s.v}</div>
        </div>
      ))}
    </div>
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
        <span style={{ fontSize:11, color:'#64748b' }}>Target Progress</span>
        <span style={{ fontSize:11, fontWeight:700, color: m.target>=70?'#10b981':m.target>=50?'#f59e0b':'#ef4444' }}>{m.target}%</span>
      </div>
      <div style={{ height:5, background:'rgba(0,0,0,0.06)', borderRadius:3, overflow:'hidden' }}>
        <motion.div initial={{ width:0 }} animate={{ width:`${m.target}%` }} transition={{ delay:delay+0.4, duration:0.9, ease:'easeOut' }}
          style={{ height:'100%', borderRadius:3, background:m.target>=70?'linear-gradient(90deg,#10b981,#059669)':m.target>=50?'linear-gradient(90deg,#f59e0b,#d97706)':'linear-gradient(90deg,#ef4444,#dc2626)' }}/>
      </div>
    </div>
    <div style={{ display:'flex', gap:6, marginTop:12 }}>
      <button onClick={() => toast('Viewing profile…',{icon:'👤'})} style={{ flex:1, padding:'7px 10px', borderRadius:8, border:'1px solid rgba(79,70,229,0.2)', background:'rgba(79,70,229,0.05)', color:'#4f46e5', fontSize:11, fontWeight:600, cursor:'pointer' }}>
        View Profile
      </button>
      <button onClick={() => toast(`Messaging ${m.name}…`,{icon:'💬'})} style={{ flex:1, padding:'7px 10px', borderRadius:8, border:'1px solid rgba(16,185,129,0.2)', background:'rgba(16,185,129,0.05)', color:'#10b981', fontSize:11, fontWeight:600, cursor:'pointer' }}>
        Message
      </button>
    </div>
  </motion.div>
);

// ─── Priority Badge ───────────────────────────────────────────────────────────
const PriBadge = ({ p }) => {
  const c = p==='Critical'?'#ef4444':p==='High'?'#f59e0b':'#10b981';
  return <span style={{ fontSize:10, fontWeight:700, color:c, background:`${c}15`, padding:'2px 8px', borderRadius:20 }}>{p}</span>;
};

// ─── Calendar Modal ───────────────────────────────────────────────────────────
const CalendarModal = ({ onClose }) => (
  <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
    <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
      style={{ background:'#fff', borderRadius:16, padding:28, width:420, boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
      <h3 style={{ fontSize:17, fontWeight:800, color:'#1e293b', marginBottom:16 }}>Schedule Team Meeting</h3>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {['Meeting Title','Date & Time','Location / Link','Invite Members'].map(f => (
          <div key={f}>
            <label style={{ fontSize:12, color:'#64748b', fontWeight:600, marginBottom:5, display:'block' }}>{f}</label>
            <input style={{ width:'100%', padding:'9px 12px', borderRadius:8, border:'1px solid rgba(0,0,0,0.1)', fontSize:13, boxSizing:'border-box' }}
              placeholder={f}/>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', gap:10, marginTop:18 }}>
        <button onClick={onClose} style={{ flex:1, padding:'10px', borderRadius:8, border:'1px solid rgba(0,0,0,0.1)', background:'white', cursor:'pointer', fontWeight:600, fontSize:13 }}>Cancel</button>
        <button onClick={() => { toast.success('Meeting scheduled!',{icon:'📅'}); onClose(); }}
          style={{ flex:1, padding:'10px', borderRadius:8, border:'none', background:'linear-gradient(135deg,#4f46e5,#8b5cf6)', color:'white', cursor:'pointer', fontWeight:700, fontSize:13 }}>
          Schedule
        </button>
      </div>
    </motion.div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const TeamLeadDashboard = () => {
  const { user } = useAuth();
  const [showCalendar, setShowCalendar] = useState(false);
  const [kpis, setKpis] = useState(null);

  useEffect(() => {
    API.get('/analytics/team')
      .then(r => setKpis(r.data))
      .catch(() => setKpis({ teamLeads:60, pendingFollowUps:13, teamConversion:42, activeMembers:5, targetProgress:68 }));
  }, []);

  const handleAiReport = async () => {
    toast.loading('Generating team report…', { id:'team-report' });
    await new Promise(r => setTimeout(r, 1800));
    toast.success('Team report ready!', { id:'team-report', icon:'📊' });
  };

  const kv = kpis || {};

  const cardStyle = { background:'#fff', border:'1px solid rgba(0,0,0,0.06)', borderRadius:16, padding:22, boxShadow:'0 2px 8px rgba(0,0,0,0.04)' };

  return (
    <div style={{ padding:'4px 0 24px' }}>

      {/* ── Header ── */}
      <motion.div initial={{ opacity:0,y:-16 }} animate={{ opacity:1,y:0 }}
        style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
            <div style={{ width:36,height:36,borderRadius:10,background:'linear-gradient(135deg,#8b5cf6,#a78bfa)',display:'flex',alignItems:'center',justifyContent:'center' }}>
              <MdGroups size={20} color="white"/>
            </div>
            <h2 style={{ fontSize:22, fontWeight:800, color:'#1e293b', letterSpacing:'-0.3px' }}>
              Team Lead Center — {user?.name?.split(' ')[0]}'s Team
            </h2>
          </div>
          <p style={{ fontSize:13, color:'#64748b', marginLeft:46 }}>Manage your team's performance and lead assignments</p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={() => setShowCalendar(true)}
            style={{ display:'flex',alignItems:'center',gap:7,padding:'9px 16px',borderRadius:10,border:'1px solid rgba(0,0,0,0.1)',background:'white',color:'#475569',fontWeight:600,fontSize:13,cursor:'pointer' }}>
            <MdCalendarToday size={15}/> Schedule Meeting
          </button>
          <button onClick={handleAiReport}
            style={{ display:'flex',alignItems:'center',gap:7,padding:'9px 16px',borderRadius:10,border:'none',background:'linear-gradient(135deg,#8b5cf6,#4f46e5)',color:'white',fontWeight:700,fontSize:13,cursor:'pointer',boxShadow:'0 4px 12px rgba(139,92,246,0.3)' }}>
            <MdAutoAwesome size={15}/> AI Team Report
          </button>
        </div>
      </motion.div>

      {/* ── KPI Cards ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:14, marginBottom:20 }}>
        <KpiCard icon={MdAssignment}  label="Team Leads"       value={kv.teamLeads||60}        color="#4f46e5" sub="Total assigned"    delay={0}    />
        <KpiCard icon={MdSchedule}    label="Pending Follow-ups" value={kv.pendingFollowUps||13} color="#ef4444" sub="Require action"   delay={0.05} />
        <KpiCard icon={MdTrendingUp}  label="Team Conversion"  value={kv.teamConversion||42}   suffix="%" color="#10b981" sub="Leads → deals"   delay={0.1}  />
        <KpiCard icon={MdPerson}      label="Active Members"   value={kv.activeMembers||5}     color="#8b5cf6" sub="Online today"     delay={0.15} />
        <KpiCard icon={MdBarChart}    label="Monthly Target"   value={kv.targetProgress||68}   suffix="%" color="#f59e0b" sub="Progress toward goal" delay={0.2} />
      </div>

      {/* ── Charts ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:16, marginBottom:16 }}>

        {/* Team Performance Bar */}
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.25 }} style={cardStyle}>
          <div style={{ marginBottom:16 }}>
            <h3 style={{ fontSize:15, fontWeight:800, color:'#1e293b' }}>Team Performance — Revenue</h3>
            <p style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>Individual revenue generated this month</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockTeamPerf}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false}/>
              <XAxis dataKey="name" tick={{ fill:'#94a3b8', fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:'#94a3b8', fontSize:11 }} axisLine={false} tickLine={false} tickFormatter={v=>`${(v/100000).toFixed(0)}L`}/>
              <Tooltip formatter={(v,n) => [`₹${(v/100000).toFixed(1)}L`, n]} contentStyle={{ background:'#fff', border:'1px solid rgba(0,0,0,0.06)', borderRadius:10 }}/>
              <Bar dataKey="revenue" name="Revenue" fill="#8b5cf6" radius={[4,4,0,0]}>
                {mockTeamPerf.map((_, i) => <Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Lead Status Pie */}
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.3 }} style={cardStyle}>
          <div style={{ marginBottom:16 }}>
            <h3 style={{ fontSize:15, fontWeight:800, color:'#1e293b' }}>Lead Status — Team</h3>
            <p style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>Current pipeline distribution</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={mockLeadStatus} cx="50%" cy="50%" outerRadius={65} dataKey="value" nameKey="name"
                label={({ name, value }) => `${value}`} labelLine={false}>
                {mockLeadStatus.map((_, i) => <Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
              </Pie>
              <Tooltip contentStyle={{ background:'#fff', border:'1px solid rgba(0,0,0,0.06)', borderRadius:10 }}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'4px 12px' }}>
            {mockLeadStatus.map((s,i) => (
              <div key={s.name} style={{ display:'flex', alignItems:'center', gap:5, fontSize:11 }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:COLORS[i%COLORS.length] }}/>
                <span style={{ color:'#64748b' }}>{s.name} ({s.value})</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Team Members ── */}
      <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.35 }}
        style={{ ...cardStyle, marginBottom:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <h3 style={{ fontSize:15, fontWeight:800, color:'#1e293b' }}>Team Members</h3>
          <button onClick={() => toast.success('Opening invite form…',{icon:'📧'})}
            style={{ display:'flex',alignItems:'center',gap:6,padding:'7px 14px',borderRadius:8,border:'none',background:'linear-gradient(135deg,#4f46e5,#8b5cf6)',color:'white',fontWeight:600,fontSize:12,cursor:'pointer' }}>
            <MdAdd size={14}/> Invite Member
          </button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:12 }}>
          {mockMembers.map((m,i) => <MemberCard key={m.id} m={m} delay={0.38+i*0.05}/>)}
        </div>
      </motion.div>

      {/* ── Lead Assignment ── */}
      <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.55 }} style={cardStyle}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <div>
            <h3 style={{ fontSize:15, fontWeight:800, color:'#1e293b' }}>Unassigned Leads</h3>
            <p style={{ fontSize:12, color:'#94a3b8', marginTop:2 }}>Assign these leads to team members</p>
          </div>
          <button onClick={() => toast('Loading all unassigned leads…',{icon:'📋'})}
            style={{ fontSize:12, color:'#4f46e5', fontWeight:600, background:'none', border:'none', cursor:'pointer' }}>
            View All →
          </button>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'rgba(0,0,0,0.02)' }}>
                {['Company','Contact','Industry','Deal Value','Priority','Action'].map(h => (
                  <th key={h} style={{ padding:'10px 14px', fontSize:11, color:'#64748b', fontWeight:700, textAlign:'left', textTransform:'uppercase', letterSpacing:'0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockUnassigned.map((l,i) => (
                <tr key={l.id} style={{ borderBottom:'1px solid rgba(0,0,0,0.04)' }}>
                  <td style={{ padding:'12px 14px', fontSize:13, fontWeight:700, color:'#1e293b' }}>{l.company}</td>
                  <td style={{ padding:'12px 14px', fontSize:12, color:'#475569' }}>{l.contact}</td>
                  <td style={{ padding:'12px 14px', fontSize:12, color:'#64748b' }}>{l.industry}</td>
                  <td style={{ padding:'12px 14px', fontSize:13, fontWeight:700, color:'#10b981' }}>₹{(l.value/100000).toFixed(1)}L</td>
                  <td style={{ padding:'12px 14px' }}><PriBadge p={l.priority}/></td>
                  <td style={{ padding:'12px 14px' }}>
                    <button onClick={() => toast.success(`Lead assigned from ${l.company}!`,{icon:'✅'})}
                      style={{ padding:'6px 14px', borderRadius:8, border:'none', background:'linear-gradient(135deg,#4f46e5,#8b5cf6)', color:'white', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                      Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {showCalendar && <CalendarModal onClose={() => setShowCalendar(false)}/>}
    </div>
  );
};

export default TeamLeadDashboard;
