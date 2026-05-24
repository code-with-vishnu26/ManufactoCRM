import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import API from '../services/api';
import { formatCurrency } from '../utils/helpers';

const COLORS = ['#6366f1','#8b5cf6','#06b6d4','#10b981','#f59e0b','#ef4444','#ec4899'];

const mockMonthly = [
  {month:'Jan',leads:12,closed:4,revenue:380000,calls:28},
  {month:'Feb',leads:18,closed:6,revenue:520000,calls:42},
  {month:'Mar',leads:15,closed:5,revenue:450000,calls:35},
  {month:'Apr',leads:22,closed:9,revenue:780000,calls:58},
  {month:'May',leads:28,closed:11,revenue:920000,calls:72},
  {month:'Jun',leads:20,closed:8,revenue:680000,calls:61},
];

const mockPipeline = [
  {name:'New Lead',value:5},{name:'Contacted',value:4},{name:'Qualified',value:3},
  {name:'Proposal Sent',value:2},{name:'Negotiation',value:2},{name:'Closed Won',value:7},{name:'Closed Lost',value:3},
];

const mockIndustry = [
  {name:'Automotive',value:4},{name:'Electronics',value:3},{name:'Pharmaceutical',value:3},{name:'Steel & Metal',value:4},{name:'Chemical',value:3},{name:'Others',value:3},
];

const Tooltip2 = ({active,payload,label}) => active&&payload?.length ? (
  <div style={{background:'#ffffff',border:'1px solid rgba(0,0,0,0.08)',borderRadius:10,padding:'10px 14px',boxShadow:'0 10px 30px rgba(0,0,0,0.06)'}}>
    <p style={{fontSize:12,color:'#64748b',marginBottom:4}}>{label}</p>
    {payload.map((p,i)=><p key={i} style={{fontSize:13,fontWeight:700,color:p.color}}>{p.name}: {p.name==='Revenue'?formatCurrency(p.value):p.value}</p>)}
  </div>
) : null;

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/analytics/dashboard')
      .then(r => setData(r.data))
      .catch(() => setData({ kpis:{totalLeads:20,activeClients:9,conversionRate:35,revenueGenerated:5800000,closedWon:7}, charts:{monthlyData:mockMonthly} }))
      .finally(() => setLoading(false));
  }, []);

  const monthly = data?.charts?.monthlyData || mockMonthly;

  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'60vh'}}><div style={{width:40,height:40,border:'3px solid rgba(79,70,229,0.1)',borderTop:'3px solid #4f46e5',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;

  return (
    <div>
      <div style={{marginBottom:24}}>
        <h2 style={{fontSize:20,fontWeight:800,color:'#1e293b',marginBottom:4}}>Analytics Dashboard</h2>
        <p style={{fontSize:13,color:'#64748b'}}>Comprehensive performance metrics and insights</p>
      </div>

      {/* Summary Cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:14,marginBottom:20}}>
        {[
          {label:'Total Leads',value:data?.kpis?.totalLeads||20,color:'#4f46e5'},
          {label:'Conversion Rate',value:`${data?.kpis?.conversionRate||35}%`,color:'#10b981'},
          {label:'Revenue',value:formatCurrency(data?.kpis?.revenueGenerated||5800000),color:'#ea580c'},
          {label:'Deals Won',value:data?.kpis?.closedWon||7,color:'#db2777'},
        ].map(({label,value,color},i)=>(
          <motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.08}} className="glass-card" style={{padding:'18px 20px'}}>
            <div style={{fontSize:22,fontWeight:800,color,marginBottom:4}}>{value}</div>
            <div style={{fontSize:12,color:'#64748b',fontWeight:600}}>{label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts grid */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="glass-card" style={{padding:22}}>
          <h3 style={{fontSize:14,fontWeight:800,color:'#1e293b',marginBottom:4}}>Lead Generation Trend</h3>
          <p style={{fontSize:12,color:'#64748b',marginBottom:16}}>Monthly leads generated</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthly}>
              <defs>
                <linearGradient id="gl1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/><stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" vertical={false}/>
              <XAxis dataKey="month" tick={{fill:'#94a3b8',fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:'#94a3b8',fontSize:11}} axisLine={false} tickLine={false}/>
              <Tooltip content={<Tooltip2/>}/>
              <Area type="monotone" dataKey="leads" name="Leads" stroke="#4f46e5" fill="url(#gl1)" strokeWidth={2}/>
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.25}} className="glass-card" style={{padding:22}}>
          <h3 style={{fontSize:14,fontWeight:800,color:'#1e293b',marginBottom:4}}>Revenue by Month</h3>
          <p style={{fontSize:12,color:'#64748b',marginBottom:16}}>Monthly revenue from closed deals</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthly}>
              <defs><linearGradient id="gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981"/><stop offset="100%" stopColor="#059669"/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" vertical={false}/>
              <XAxis dataKey="month" tick={{fill:'#94a3b8',fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:'#94a3b8',fontSize:11}} axisLine={false} tickLine={false} tickFormatter={v=>`₹${(v/100000).toFixed(0)}L`}/>
              <Tooltip content={<Tooltip2/>}/>
              <Bar dataKey="revenue" name="Revenue" fill="url(#gr)" radius={[6,6,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3}} className="glass-card" style={{padding:22}}>
          <h3 style={{fontSize:14,fontWeight:800,color:'#1e293b',marginBottom:4}}>Pipeline Distribution</h3>
          <p style={{fontSize:12,color:'#64748b',marginBottom:10}}>Leads by stage</p>
          <div style={{display:'flex',gap:16,alignItems:'center'}}>
            <ResponsiveContainer width={160} height={160}>
              <PieChart><Pie data={mockPipeline} cx="50%" cy="50%" outerRadius={70} innerRadius={40} dataKey="value" paddingAngle={3}>{mockPipeline.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}</Pie><Tooltip contentStyle={{background:'#ffffff',border:'1px solid rgba(0,0,0,0.08)',borderRadius:8,boxShadow:'0 10px 30px rgba(0,0,0,0.06)'}}/></PieChart>
            </ResponsiveContainer>
            <div style={{flex:1,display:'flex',flexDirection:'column',gap:6}}>
              {mockPipeline.map((item,i)=>(
                <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div style={{display:'flex',alignItems:'center',gap:6}}><div style={{width:8,height:8,borderRadius:2,background:COLORS[i%COLORS.length]}}/><span style={{fontSize:11,color:'#64748b',fontWeight:600}}>{item.name}</span></div>
                  <span style={{fontSize:12,fontWeight:700,color:'#1e293b'}}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.35}} className="glass-card" style={{padding:22}}>
          <h3 style={{fontSize:14,fontWeight:800,color:'#1e293b',marginBottom:4}}>Industry Breakdown</h3>
          <p style={{fontSize:12,color:'#64748b',marginBottom:16}}>Leads by industry sector</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockIndustry} layout="vertical">
              <defs><linearGradient id="gi" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#4f46e5"/><stop offset="100%" stopColor="#8b5cf6"/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" horizontal={false}/>
              <XAxis type="number" tick={{fill:'#94a3b8',fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis dataKey="name" type="category" tick={{fill:'#94a3b8',fontSize:11}} axisLine={false} tickLine={false} width={90}/>
              <Tooltip contentStyle={{background:'#ffffff',border:'1px solid rgba(0,0,0,0.08)',borderRadius:8,boxShadow:'0 10px 30px rgba(0,0,0,0.06)'}}/>
              <Bar dataKey="value" name="Leads" fill="url(#gi)" radius={[0,6,6,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Conversion & Activity line chart */}
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.4}} className="glass-card" style={{padding:22}}>
        <h3 style={{fontSize:15,fontWeight:800,color:'#1e293b',marginBottom:4}}>Activity vs Conversion Trend</h3>
        <p style={{fontSize:12,color:'#64748b',marginBottom:16}}>Calls made vs deals closed per month</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" vertical={false}/>
            <XAxis dataKey="month" tick={{fill:'#94a3b8',fontSize:11}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fill:'#94a3b8',fontSize:11}} axisLine={false} tickLine={false}/>
            <Tooltip content={<Tooltip2/>}/>
            <Legend wrapperStyle={{fontSize:12,color:'#64748b'}}/>
            <Line type="monotone" dataKey="calls" name="Calls" stroke="#06b6d4" strokeWidth={2} dot={{r:4,fill:'#06b6d4'}}/>
            <Line type="monotone" dataKey="closed" name="Closed" stroke="#10b981" strokeWidth={2} dot={{r:4,fill:'#10b981'}}/>
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default Analytics;
