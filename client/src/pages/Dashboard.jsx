import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { 
  MdTrendingUp, MdTrendingDown, MdPeople, MdAttachMoney, 
  MdCheckCircle, MdSchedule, MdBusiness, MdRefresh, MdAdd 
} from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { formatCurrency, timeAgo } from '../utils/helpers';
import AdminDashboard from './AdminDashboard';
import TeamLeadDashboard from './TeamLeadDashboard';
import SalesDashboard from './SalesDashboard';

const COLORS = ['#4f46e5', '#8b5cf6', '#06b6d4', '#10b981', '#ff9f43', '#ef4444', '#ff4d6d'];

// Mock fallback data (defined before component to prevent crash)
const mockMonthly = [
  { month: 'Jan', leads: 12, closed: 4, revenue: 380000 },
  { month: 'Feb', leads: 18, closed: 6, revenue: 520000 },
  { month: 'Mar', leads: 15, closed: 5, revenue: 450000 },
  { month: 'Apr', leads: 22, closed: 9, revenue: 780000 },
  { month: 'May', leads: 28, closed: 11, revenue: 920000 },
  { month: 'Jun', leads: 20, closed: 8, revenue: 680000 },
];
const mockSources = [
  { name: 'Jun', count: 2 }, { name: 'Feb', count: 4 },
  { name: 'Mar', count: 5 }, { name: 'Apr', count: 8 },
  { name: 'May', count: 6 }, { name: 'Jun', count: 6.5 },
];
const mockAnalytics = {
  kpis: { totalLeads: 20, activeClients: 9, conversionRate: 35, revenueGenerated: 5800000, closedWon: 7, pendingFollowUps: 5 },
  charts: { monthlyData: mockMonthly, pipelineData: [], sourceData: [] }
};
const mockLeads = [
  { _id: '1', companyName: 'Tata Motors', clientName: 'Rajesh Kumar', status: 'Closed Won', priority: 'High', estimatedDealValue: 850000 },
  { _id: '2', companyName: 'Sun Pharma', clientName: 'Dr. Nisha Shah', status: 'New Lead', priority: 'Critical', estimatedDealValue: 920000 },
  { _id: '3', companyName: 'JSW Steel', clientName: 'Abhishek Nair', status: 'New Lead', priority: 'High', estimatedDealValue: 1200000 },
];
const mockActivities = [
  { createdBy: { name: 'Rahul Verma' }, action: 'completed call', leadId: { companyName: 'Tata Motors' }, createdAt: new Date(Date.now() - 3600000) },
  { createdBy: { name: 'Sneha Joshi' }, action: 'sent proposal', leadId: { companyName: 'JSW Steel' }, createdAt: new Date(Date.now() - 7200000) },
  { createdBy: { name: 'Vikram Singh' }, action: 'scheduled meeting', leadId: { companyName: 'Sun Pharma' }, createdAt: new Date(Date.now() - 86400000) },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="custom-tooltip" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 10, padding: 12 }}>
        <p style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4, fontWeight: 500 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ fontSize: 12, fontWeight: 700, color: p.color }}>
            {p.name}: {p.name === 'Revenue' ? formatCurrency(p.value) : p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const { user, isAdmin, isTeamLead, isExec, isUser } = useAuth();

  // ── Role-based routing ──────────────────────────────────────────────────────
  if (isUser) return <Navigate to="/" replace />;
  if (isAdmin) return <AdminDashboard />;
  if (isTeamLead) return <TeamLeadDashboard />;
  if (isExec) return <SalesDashboard />;

  const [analytics, setAnalytics] = useState(mockAnalytics);
  const [activities, setActivities] = useState(mockActivities);
  const [loading, setLoading] = useState(true);
  const [leadsPeriod, setLeadsPeriod] = useState('Month');
  const [activitiesPeriod, setActivitiesPeriod] = useState('Month');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, activitiesRes] = await Promise.all([
        API.get('/analytics/dashboard'),
        API.get('/activities/recent')
      ]);
      setAnalytics(analyticsRes.data);
      setActivities(activitiesRes.data.activities || []);
    } catch (err) {
      setAnalytics(mockAnalytics);
      setActivities(mockActivities);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 44, height: 44, border: '3px solid rgba(79,70,229,0.1)', borderTop: '3px solid #4f46e5', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#64748b', fontSize: 13, fontWeight: 500 }}>Loading dashboard...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const kpis = analytics?.kpis || {};
  const charts = analytics?.charts || {};
  const monthlyData = charts.monthlyData || mockMonthly;

  return (
    <div style={{ padding: '4px 0 20px' }}>
      
      {/* Dynamic Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1e293b', letterSpacing: '-0.3px' }}>
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0]}! 👋
          </h2>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>Here's what's happening with your leads today.</p>
        </div>
        <button onClick={fetchData} className="btn-secondary" style={{ gap: 6, height: 38, fontSize: 13, borderRadius: 8, padding: '0 14px' }}>
          <MdRefresh size={16} /> Refresh
        </button>
      </div>

      {/* Main 3-Column Mockup Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 280px', gap: 16, marginBottom: 16 }}>
        
        {/* ================================================= */}
        {/* COLUMN 1: LEFT SIDEBAR KPI & TRENDING PROGRESS    */}
        {/* ================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          {/* Card 1: Your Current Balance (Revenue KPI) */}
          <div className="glass-card" style={{ padding: '20px 22px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>Revenue Generated</div>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 2, marginBottom: 4 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#94a3b8', marginTop: 3 }}>₹</span>
              <span style={{ fontSize: 28, fontWeight: 800, color: '#1e293b', letterSpacing: '-0.5px' }}>
                {(kpis.revenueGenerated || 5800000).toLocaleString('en-IN')}
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#10b981' }}>+15%</span>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>(Won: {kpis.closedWon || 7})</span>
            </div>

            {/* Coral capsule Action Button matching mockup Add Credit pill button */}
            <Link to="/app/leads" style={{ textDecoration: 'none' }}>
              <button style={{
                background: 'linear-gradient(135deg, #ff4d6d, #ef4444)',
                color: 'white',
                border: 'none',
                borderRadius: 24,
                padding: '11px 20px',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                boxShadow: '0 6px 15px rgba(255, 77, 109, 0.25)',
                transition: 'transform 0.2s',
                marginBottom: 16
              }}
              className="btn-primary"
              >
                <span>Add Lead</span>
                <span>→</span>
              </button>
            </Link>

            {/* Bottom Split Stats */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Sales: 75%</div>
                <div style={{ height: 3, background: '#4f46e5', borderRadius: 2, marginTop: 4, width: '75%' }} />
              </div>
              <div style={{ flex: 1, paddingLeft: 16 }}>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Referral: 25%</div>
                <div style={{ height: 3, background: '#ff9f43', borderRadius: 2, marginTop: 4, width: '25%' }} />
              </div>
            </div>
          </div>

          {/* Card 2: Circular Trending Indicator (BDA Conversion Rate) */}
          <div className="glass-card" style={{ padding: '20px 22px' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 2 }}>Trending</div>
            
            {/* SVG Circular Ring matching mockup */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0' }}>
              <div style={{ position: 'relative', width: 96, height: 96, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="96" height="96" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="6" fill="transparent" />
                  <circle cx="50" cy="50" r="40" stroke="#4f46e5" strokeWidth="6" fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - (kpis.conversionRate || 35) / 100)}`}
                    strokeLinecap="round" />
                </svg>
                <div style={{ position: 'absolute', textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#1e293b' }}>{kpis.conversionRate || 35}%</div>
                  <div style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', marginTop: 1 }}>Conv. rate</div>
                </div>
              </div>
            </div>

            {/* Bottom target split stats */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: 14, marginTop: 4 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#1e293b' }}>₹6.0L</div>
                <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500 }}>Target</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#1e293b' }}>₹2.5L</div>
                <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 500 }}>Last Month</div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* COLUMN 2: CENTRAL PERFORMANCE & AREA CHARTS      */}
        {/* ================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          {/* Top Row: 4 Metric Cards side-by-side */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {[
              { label: 'Total Leads', value: kpis.totalLeads || 0, color: '#6366f1', icon: MdPeople },
              { label: 'Follow-ups', value: kpis.pendingFollowUps || 0, color: '#ef4444', icon: MdSchedule },
              { label: 'Active Clients', value: kpis.activeClients || 0, color: '#06b6d4', icon: MdBusiness },
              { label: 'Closed Won', value: kpis.closedWon || 0, color: '#10b981', icon: MdCheckCircle }
            ].map(({ label, value, color, icon: Icon }, i) => (
              <div key={i} className="glass-card" style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={16} color={color} />
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>{label}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#4f46e5', marginTop: 1 }}>{value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Large Performance Line/Area Chart Card (Process & bandwidth calculation) */}
          <div className="glass-card" style={{ padding: 22 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: '#1e293b', letterSpacing: '-0.2px' }}>Monthly Sales Performance</h3>
                <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>Leads generated vs closed deals</p>
              </div>
              <select className="input-dark" style={{ width: 90, height: 30, padding: '0 8px', fontSize: 11, borderRadius: 6, background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.06)' }}>
                <option>Monthly</option>
                <option>Weekly</option>
                <option>Daily</option>
              </select>
            </div>

            {/* Sparkline metric details in the chart header */}
            <div style={{ display: 'flex', gap: 24, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>Total Leads</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#1e293b', marginTop: 2 }}>20 Leads</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>Lead Generation Rate</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#10b981', marginTop: 2 }}>100% Progress</div>
              </div>
            </div>

            {/* Mint Green Area Chart matching mockup line chart */}
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorLeadsLight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="leads" name="Leads Generated" stroke="#10b981" fill="url(#colorLeadsLight)" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>

            {/* Sparkline statistics under the chart */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: 14, marginTop: 10 }}>
              <div>
                <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>Closed Won</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#1e293b', marginTop: 2 }}>{kpis.closedWon || 7} Deals</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>Closed Lost</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#ef4444', marginTop: 2 }}>3 Deals</div>
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>Activities Logged</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#4f46e5', marginTop: 2 }}>148 Tasks</div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* COLUMN 3: RIGHT MINI CHARTS & BAR CHART          */}
        {/* ================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          {/* Card 1: Online Sell (Mini red Area Chart) */}
          <div className="glass-card" style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>Pipeline Estimate</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#10b981' }}>18% ↑</span>
            </div>
            
            <div style={{ fontSize: 18, fontWeight: 800, color: '#1e293b', letterSpacing: '-0.3px' }}>₹{(kpis.revenueGenerated/100000 || 58).toFixed(1)}L</div>

            {/* Red Area chart matching Online Sell mockup */}
            <ResponsiveContainer width="100%" height={56}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorOnlineRed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff4d6d" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#ff4d6d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="closed" name="Deals" stroke="#ff4d6d" fill="url(#colorOnlineRed)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Card 2: Notifications (Rounded vertical Bar Chart) */}
          <div className="glass-card" style={{ padding: 18, flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 800, color: '#1e293b' }}>Lead Sources</h3>
              <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>Performance distributions</p>
            </div>

            {/* Bar chart with orange/red rounded bars matching mockup */}
            <div style={{ flex: 1, minHeight: 120 }}>
              <ResponsiveContainer width="100%" height={130}>
                <BarChart data={mockSources}>
                  <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', borderRadius: 8 }} />
                  <Bar dataKey="count" name="Leads" fill="#ff4d6d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>

      {/* ================================================= */}
      {/* ROW 3: BOTTOM LEADS LIST & RECENT ACTIVITY FEEDS  */}
      {/* ================================================= */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16 }}>
        
        {/* Column 1: Leads list styled as "Orders" table */}
        <div className="glass-card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#1e293b' }}>Recent Leads</h3>
            
            {/* Tab switch matching mockup */}
            <div style={{ display: 'flex', gap: 2, background: 'rgba(0,0,0,0.03)', borderRadius: 6, padding: 2 }}>
              {['Day', 'Week', 'Month'].map(tab => (
                <button key={tab} onClick={() => setLeadsPeriod(tab)} style={{
                  padding: '4px 10px', fontSize: 11, fontWeight: 700, border: 'none', borderRadius: 4, cursor: 'pointer',
                  background: leadsPeriod === tab ? '#ffffff' : 'transparent',
                  color: leadsPeriod === tab ? '#1e293b' : '#94a3b8',
                  boxShadow: leadsPeriod === tab ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                }}
                className="btn-secondary"
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {mockLeads.slice(0, 3).map((lead, i) => (
              <div key={lead._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 2 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: '#edf2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#4f46e5', flexShrink: 0 }}>
                    {lead.companyName[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{lead.companyName}</div>
                    <div style={{ fontSize: 11, color: '#64748b', marginTop: 1 }}>{lead.clientName} · {lead.industry}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#10b981' }}>{formatCurrency(lead.estimatedDealValue)}</div>
                  <span className={`badge ${lead.status === 'Closed Won' ? 'badge-won' : 'badge-new'}`} style={{ marginTop: 2, padding: '2px 8px', fontSize: 10 }}>{lead.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Activity feed styled as "Invoices" table */}
        <div className="glass-card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: '#1e293b' }}>Recent BDA Activities</h3>
            
            {/* Tab switch matching mockup */}
            <div style={{ display: 'flex', gap: 2, background: 'rgba(0,0,0,0.03)', borderRadius: 6, padding: 2 }}>
              {['Day', 'Week', 'Month'].map(tab => (
                <button key={tab} onClick={() => setActivitiesPeriod(tab)} style={{
                  padding: '4px 10px', fontSize: 11, fontWeight: 700, border: 'none', borderRadius: 4, cursor: 'pointer',
                  background: activitiesPeriod === tab ? '#ffffff' : 'transparent',
                  color: activitiesPeriod === tab ? '#1e293b' : '#94a3b8',
                  boxShadow: activitiesPeriod === tab ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                }}
                className="btn-secondary"
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {activities.slice(0, 3).map((act, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 2 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#4f46e5,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                    {act.createdBy?.name?.[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>
                      <span style={{ color: '#4f46e5' }}>{act.createdBy?.name?.split(' ')[0]}</span> {act.action}
                    </div>
                    <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 1 }}>{timeAgo(act.createdAt)} · {act.leadId?.companyName || 'Lead'}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
