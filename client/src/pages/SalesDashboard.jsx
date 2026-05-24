import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  MdRocketLaunch, MdTrendingUp, MdSchedule, MdAttachMoney, MdCheckCircle,
  MdAutoAwesome, MdEmail, MdSummarize, MdPerson, MdStar,
  MdEmojiEvents, MdThumbUp, MdFlashOn, MdEdit, MdVisibility,
  MdCalendarToday, MdBusiness, MdPhone
} from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import toast from 'react-hot-toast';

const COLORS = ['#4f46e5','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4'];

// ─── Mock Data ────────────────────────────────────────────────────────────────
const mockMyLeads = [
  { id:'1', company:'Tata Motors',  contact:'Rajesh Kumar',    status:'Qualified',     priority:'High',     followUp:'2026-05-25', value:850000  },
  { id:'2', company:'Sun Pharma',   contact:'Dr. Nisha Shah',  status:'Proposal Sent', priority:'Critical', followUp:'2026-05-24', value:920000  },
  { id:'3', company:'JSW Steel',    contact:'Abhishek Nair',   status:'Negotiation',   priority:'High',     followUp:'2026-05-26', value:1200000 },
  { id:'4', company:'HCL Tech',     contact:'Pradeep Sharma',  status:'New Lead',      priority:'Medium',   followUp:'2026-05-28', value:650000  },
  { id:'5', company:'Bajaj Finserv',contact:'Kavita Reddy',    status:'Closed Won',    priority:'High',     followUp:'2026-05-30', value:750000  },
];

const mockLeadStatus = [
  { name:'New Lead',      value:6  },
  { name:'Qualified',     value:5  },
  { name:'Proposal Sent', value:4  },
  { name:'Negotiation',   value:2  },
  { name:'Closed Won',    value:3  },
];

const mockWeekly = [
  { day:'Mon', calls:4, emails:6, meetings:1 },
  { day:'Tue', calls:7, emails:9, meetings:2 },
  { day:'Wed', calls:3, emails:5, meetings:3 },
  { day:'Thu', calls:8, emails:11,meetings:2 },
  { day:'Fri', calls:6, emails:8, meetings:4 },
  { day:'Sat', calls:2, emails:3, meetings:0 },
];

const mockSchedule = [
  { time:'10:00 AM', company:'Tata Motors',   contact:'Rajesh Kumar',   type:'Demo Call',     color:'#4f46e5' },
  { time:'02:30 PM', company:'Sun Pharma',    contact:'Dr. Nisha Shah',  type:'Proposal Review',color:'#8b5cf6'},
  { time:'04:00 PM', company:'JSW Steel',     contact:'Abhishek Nair',   type:'Negotiation',   color:'#10b981' },
];

const mockAchievements = [
  { title:'Top Closer',      desc:'5 deals this month',     icon:'🏆', color:'#f59e0b', bg:'#fef3c7' },
  { title:'Speed Demon',     desc:'Fastest follow-up time', icon:'⚡', color:'#4f46e5', bg:'#eef2ff' },
  { title:'AI Power User',   desc:'50+ AI pitches generated',icon:'🤖',color:'#8b5cf6', bg:'#f5f3ff' },
  { title:'Streak Master',   desc:'30 days active streak',  icon:'🔥', color:'#ef4444', bg:'#fef2f2' },
];

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ s }) => {
  const map = { 'Closed Won':['#10b981','#d1fae5'], 'Negotiation':['#8b5cf6','#ede9fe'],
    'Proposal Sent':['#4f46e5','#eef2ff'], 'Qualified':['#06b6d4','#e0f2fe'], 'New Lead':['#64748b','#f1f5f9'] };
  const [c,bg] = map[s] || ['#64748b','#f1f5f9'];
  return <span style={{ fontSize:11, fontWeight:700, color:c, background:bg, padding:'3px 9px', borderRadius:20 }}>{s}</span>;
};

const PriBadge = ({ p }) => {
  const c = p==='Critical'?'#ef4444':p==='High'?'#f59e0b':'#10b981';
  return <span style={{ fontSize:10, fontWeight:700, color:c, background:`${c}15`, padding:'2px 8px', borderRadius:20 }}>{p}</span>;
};

// ─── Main Component ───────────────────────────────────────────────────────────
const SalesDashboard = () => {
  const { user } = useAuth();
  const [kpis, setKpis] = useState(null);
  const [aiLoading, setAiLoading] = useState('');

  useEffect(() => {
    API.get('/analytics/dashboard')
      .then(r => setKpis(r.data?.kpis))
      .catch(() => setKpis({ myLeads:20, dealsClosed:3, todayFollowups:4, targetPct:74, revenueGenerated:4370000 }));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';
  const kv = kpis || {};

  const handleAI = async (action) => {
    setAiLoading(action);
    toast.loading(`${action}…`, { id:'ai-sales' });
    await new Promise(r => setTimeout(r, 1600));
    toast.success(`${action} complete!`, { id:'ai-sales', icon:'🤖' });
    setAiLoading('');
  };

  const cardStyle = { background:'#fff', border:'1px solid rgba(0,0,0,0.06)', borderRadius:16, padding:22, boxShadow:'0 2px 8px rgba(0,0,0,0.04)' };

  return (
    <div style={{ padding:'4px 0 24px' }}>

      {/* ── Header ── */}
      <motion.div initial={{ opacity:0,y:-16 }} animate={{ opacity:1,y:0 }}
        style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
            <div style={{ width:36,height:36,borderRadius:10,background:'linear-gradient(135deg,#10b981,#059669)',display:'flex',alignItems:'center',justifyContent:'center' }}>
              <MdRocketLaunch size={20} color="white"/>
            </div>
            <h2 style={{ fontSize:21, fontWeight:800, color:'#1e293b', letterSpacing:'-0.3px' }}>
              My Sales Hub
            </h2>
          </div>
          <p style={{ fontSize:13, color:'#64748b', marginLeft:46 }}>
            Good {greeting}, <strong>{user?.name?.split(' ')[0]}</strong>! Here's your sales snapshot for today.
          </p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, background:'linear-gradient(135deg,#10b981,#059669)', borderRadius:12, padding:'10px 16px', color:'white', fontSize:13, fontWeight:700 }}>
          <MdFlashOn size={18}/> {kv.targetPct||74}% of target reached
        </div>
      </motion.div>

      {/* ── KPI Cards ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:14, marginBottom:20 }}>
        {[
          { icon:MdPerson,       label:'My Leads',       value:kv.myLeads||20,            color:'#4f46e5', sub:'total assigned'  },
          { icon:MdCheckCircle,  label:'Deals Closed',   value:kv.dealsClosed||3,          color:'#10b981', sub:'this month'      },
          { icon:MdSchedule,     label:"Today's Follow-ups", value:kv.todayFollowups||4,   color:'#ef4444', sub:'due today'       },
          { icon:MdTrendingUp,   label:'Monthly Target', value:`${kv.targetPct||74}%`,     color:'#f59e0b', sub:'progress'        },
          { icon:MdAttachMoney,  label:'Revenue',        value:`₹${((kv.revenueGenerated||4370000)/100000).toFixed(1)}L`, color:'#8b5cf6', sub:'generated' },
        ].map((kpi,i) => (
          <motion.div key={kpi.label} initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:i*0.06 }}
            style={{ ...cardStyle, padding:'18px 20px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
              <div style={{ width:38, height:38, borderRadius:10, background:`linear-gradient(135deg,${kpi.color},${kpi.color}bb)`,
                display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 3px 10px ${kpi.color}30` }}>
                <kpi.icon size={18} color="white"/>
              </div>
              <span style={{ fontSize:12, color:'#64748b', fontWeight:600 }}>{kpi.label}</span>
            </div>
            <div style={{ fontSize:22, fontWeight:800, color:'#1e293b' }}>{kpi.value}</div>
            <div style={{ fontSize:11, color:'#94a3b8', marginTop:4 }}>{kpi.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:16, marginBottom:16 }}>

        {/* My Leads Pie */}
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.3 }} style={cardStyle}>
          <div style={{ marginBottom:14 }}>
            <h3 style={{ fontSize:15, fontWeight:800, color:'#1e293b' }}>My Leads by Status</h3>
            <p style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>Current pipeline snapshot</p>
          </div>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie data={mockLeadStatus} cx="50%" cy="50%" outerRadius={65} dataKey="value" nameKey="name"
                label={({ value }) => value} labelLine={false}>
                {mockLeadStatus.map((_, i) => <Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
              </Pie>
              <Tooltip contentStyle={{ background:'#fff', border:'1px solid rgba(0,0,0,0.06)', borderRadius:10 }}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'4px 12px', marginTop:4 }}>
            {mockLeadStatus.map((s,i) => (
              <div key={s.name} style={{ display:'flex', alignItems:'center', gap:5, fontSize:11 }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:COLORS[i%COLORS.length] }}/>
                <span style={{ color:'#64748b' }}>{s.name} ({s.value})</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Activity Bar */}
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.35 }} style={cardStyle}>
          <div style={{ marginBottom:14 }}>
            <h3 style={{ fontSize:15, fontWeight:800, color:'#1e293b' }}>Weekly Activity</h3>
            <p style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>Calls, emails & meetings this week</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockWeekly} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false}/>
              <XAxis dataKey="day" tick={{ fill:'#94a3b8', fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:'#94a3b8', fontSize:11 }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ background:'#fff', border:'1px solid rgba(0,0,0,0.06)', borderRadius:10 }}/>
              <Bar dataKey="calls"    name="Calls"    fill="#4f46e5" radius={[3,3,0,0]}/>
              <Bar dataKey="emails"   name="Emails"   fill="#10b981" radius={[3,3,0,0]}/>
              <Bar dataKey="meetings" name="Meetings" fill="#f59e0b" radius={[3,3,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* ── My Leads Table ── */}
      <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.4 }} style={{ ...cardStyle, marginBottom:16 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <h3 style={{ fontSize:15, fontWeight:800, color:'#1e293b' }}>My Recent Leads</h3>
          <button onClick={() => toast('Loading all my leads…',{icon:'📋'})}
            style={{ fontSize:12, color:'#4f46e5', fontWeight:600, background:'none', border:'none', cursor:'pointer' }}>
            View All →
          </button>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'rgba(0,0,0,0.02)' }}>
                {['Company','Status','Priority','Follow-up Date','Deal Value','Actions'].map(h => (
                  <th key={h} style={{ padding:'10px 14px', fontSize:11, color:'#64748b', fontWeight:700, textAlign:'left', textTransform:'uppercase', letterSpacing:'0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockMyLeads.map((l,i) => (
                <motion.tr key={l.id} initial={{ opacity:0,x:-10 }} animate={{ opacity:1,x:0 }} transition={{ delay:0.42+i*0.04 }}
                  style={{ borderBottom:'1px solid rgba(0,0,0,0.04)' }}>
                  <td style={{ padding:'12px 14px' }}>
                    <div style={{ fontSize:13, fontWeight:700, color:'#1e293b' }}>{l.company}</div>
                    <div style={{ fontSize:11, color:'#64748b', marginTop:1 }}>{l.contact}</div>
                  </td>
                  <td style={{ padding:'12px 14px' }}><StatusBadge s={l.status}/></td>
                  <td style={{ padding:'12px 14px' }}><PriBadge p={l.priority}/></td>
                  <td style={{ padding:'12px 14px', fontSize:12, color:'#64748b' }}>{l.followUp}</td>
                  <td style={{ padding:'12px 14px', fontSize:13, fontWeight:700, color:'#10b981' }}>₹{(l.value/100000).toFixed(1)}L</td>
                  <td style={{ padding:'12px 14px' }}>
                    <div style={{ display:'flex', gap:6 }}>
                      <button onClick={() => toast(`Viewing ${l.company}…`,{icon:'👁️'})}
                        style={{ padding:'5px 8px', borderRadius:6, border:'1px solid rgba(79,70,229,0.2)', background:'rgba(79,70,229,0.06)', color:'#4f46e5', cursor:'pointer' }}>
                        <MdVisibility size={14}/>
                      </button>
                      <button onClick={() => toast(`Editing ${l.company}…`,{icon:'✏️'})}
                        style={{ padding:'5px 8px', borderRadius:6, border:'1px solid rgba(16,185,129,0.2)', background:'rgba(16,185,129,0.06)', color:'#10b981', cursor:'pointer' }}>
                        <MdEdit size={14}/>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ── Bottom Row: Schedule + AI Actions + Achievements ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16 }}>

        {/* Today's Schedule */}
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.5 }} style={cardStyle}>
          <div style={{ marginBottom:14 }}>
            <h3 style={{ fontSize:15, fontWeight:800, color:'#1e293b' }}>Today's Schedule</h3>
            <p style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>{mockSchedule.length} meetings & calls</p>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {mockSchedule.map((s,i) => (
              <div key={i} style={{ padding:'12px 14px', borderRadius:12, border:`1px solid ${s.color}20`, background:`${s.color}06` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
                  <span style={{ fontSize:12, fontWeight:700, color:s.color }}>{s.time}</span>
                  <span style={{ fontSize:10, fontWeight:700, color:s.color, background:`${s.color}15`, padding:'2px 8px', borderRadius:20 }}>{s.type}</span>
                </div>
                <div style={{ fontSize:13, fontWeight:700, color:'#1e293b' }}>{s.company}</div>
                <div style={{ fontSize:11, color:'#64748b', marginTop:2 }}>{s.contact}</div>
                <button onClick={() => toast.success(`Joined call with ${s.company}!`,{icon:'📞'})}
                  style={{ marginTop:8, padding:'6px 12px', borderRadius:8, border:'none', background:`linear-gradient(135deg,${s.color},${s.color}cc)`, color:'white', fontSize:11, fontWeight:700, cursor:'pointer' }}>
                  Join Call
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI Quick Actions */}
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.55 }} style={cardStyle}>
          <div style={{ marginBottom:14 }}>
            <h3 style={{ fontSize:15, fontWeight:800, color:'#1e293b' }}>AI Quick Actions</h3>
            <p style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>Powered by ManufactoAI</p>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {[
              { label:'Generate Pitch',    icon:MdAutoAwesome, color:'#4f46e5', action:'Generating pitch' },
              { label:'Write Email Draft', icon:MdEmail,       color:'#8b5cf6', action:'Writing email'   },
              { label:'Summarize Lead',    icon:MdSummarize,   color:'#10b981', action:'Summarizing lead'},
              { label:'Get Next Action',   icon:MdFlashOn,     color:'#f59e0b', action:'Analyzing data'  },
            ].map(ai => (
              <button key={ai.label} onClick={() => handleAI(ai.action)}
                disabled={!!aiLoading}
                style={{ padding:'12px 16px', borderRadius:10, border:`1px solid ${ai.color}20`,
                  background: aiLoading===ai.action ? `${ai.color}20` : `${ai.color}08`,
                  cursor: aiLoading ? 'not-allowed' : 'pointer',
                  display:'flex', alignItems:'center', gap:10, transition:'all 0.2s' }}>
                <div style={{ width:34, height:34, borderRadius:8, background:`linear-gradient(135deg,${ai.color},${ai.color}bb)`,
                  display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <ai.icon size={17} color="white"/>
                </div>
                <span style={{ fontSize:13, fontWeight:700, color:ai.color }}>
                  {aiLoading===ai.action ? '…' : ai.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Achievements */}
        <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.6 }} style={cardStyle}>
          <div style={{ marginBottom:14 }}>
            <h3 style={{ fontSize:15, fontWeight:800, color:'#1e293b' }}>My Achievements</h3>
            <p style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>Badges earned this month</p>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {mockAchievements.map((a,i) => (
              <motion.div key={a.title} initial={{ opacity:0,x:20 }} animate={{ opacity:1,x:0 }} transition={{ delay:0.62+i*0.06 }}
                style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', borderRadius:12, background:a.bg, border:`1px solid ${a.color}20` }}>
                <span style={{ fontSize:24 }}>{a.icon}</span>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:a.color }}>{a.title}</div>
                  <div style={{ fontSize:11, color:'#64748b', marginTop:1 }}>{a.desc}</div>
                </div>
                <MdStar size={16} color={a.color} style={{ marginLeft:'auto', flexShrink:0 }}/>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SalesDashboard;
