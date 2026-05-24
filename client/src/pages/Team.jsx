import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdStar, MdTrendingUp, MdPeople, MdAttachMoney } from 'react-icons/md';
import API from '../services/api';
import { formatCurrency, getInitials } from '../utils/helpers';

const mockTeam = [
  { user:{name:'Rahul Verma',email:'rahul@manufactocrm.com'}, stats:{total:8,won:4,lost:1,active:3,revenue:2850000,conversionRate:50,targetProgress:57} },
  { user:{name:'Sneha Joshi',email:'sneha@manufactocrm.com'}, stats:{total:7,won:3,lost:2,active:2,revenue:2180000,conversionRate:43,targetProgress:44} },
  { user:{name:'Vikram Singh',email:'vikram@manufactocrm.com'}, stats:{total:5,won:2,lost:1,active:2,revenue:1750000,conversionRate:40,targetProgress:35} },
];

const TeamMemberCard = ({ member, rank, delay }) => {
  const { user, stats } = member;
  const isTop = rank === 1;
  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay}} className="glass-card card-hover" style={{padding:22,position:'relative'}}>
      {isTop && <div style={{position:'absolute',top:16,right:16,fontSize:20}}>🏆</div>}
      <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:18}}>
        <div style={{width:48,height:48,borderRadius:'50%',background:isTop?'linear-gradient(135deg,#f59e0b,#fbbf24)':'linear-gradient(135deg,#4f46e5,#8b5cf6)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,fontWeight:700,color:'white',flexShrink:0,boxShadow:isTop?'0 4px 20px rgba(245,158,11,0.25)':'0 4px 20px rgba(79,70,229,0.15)'}}>{getInitials(user.name)}</div>
        <div style={{flex:1}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <span style={{fontSize:15,fontWeight:700,color:'#1e293b'}}>{user.name}</span>
            <span style={{fontSize:11,padding:'2px 8px',borderRadius:20,background:isTop?'rgba(245,158,11,0.15)':'rgba(79,70,229,0.08)',color:isTop?'#ea580c':'#4f46e5',fontWeight:700}}>#{rank}</span>
          </div>
          <div style={{fontSize:12,color:'#64748b'}}>{user.email}</div>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:16}}>
        {[
          {icon:MdPeople,label:'Total Leads',value:stats.total,color:'#4f46e5'},
          {icon:MdTrendingUp,label:'Won',value:stats.won,color:'#10b981'},
          {icon:MdAttachMoney,label:'Revenue',value:formatCurrency(stats.revenue),color:'#ea580c'},
          {icon:MdTrendingUp,label:'Conv. Rate',value:`${stats.conversionRate}%`,color:'#8b5cf6'},
        ].map(({icon:Icon,label,value,color})=>(
          <div key={label} style={{background:'rgba(0,0,0,0.02)',borderRadius:10,padding:'10px 12px',border:'1px solid rgba(0,0,0,0.05)'}}>
            <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:4}}><Icon size={14} color={color}/><span style={{fontSize:11,color:'#64748b',fontWeight:600}}>{label}</span></div>
            <div style={{fontSize:16,fontWeight:800,color:'#1e293b'}}>{value}</div>
          </div>
        ))}
      </div>

      <div>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
          <span style={{fontSize:12,color:'#64748b',fontWeight:500}}>Monthly Target Progress</span>
          <span style={{fontSize:12,fontWeight:700,color:stats.targetProgress>=70?'#10b981':stats.targetProgress>=40?'#ea580c':'#ef4444'}}>{stats.targetProgress}%</span>
        </div>
        <div style={{height:6,background:'rgba(0,0,0,0.05)',borderRadius:3,overflow:'hidden'}}>
          <motion.div initial={{width:0}} animate={{width:`${stats.targetProgress}%`}} transition={{delay:delay+0.4,duration:1,ease:'easeOut'}}
            style={{height:'100%',borderRadius:3,background:stats.targetProgress>=70?'linear-gradient(90deg,#10b981,#059669)':stats.targetProgress>=40?'linear-gradient(90deg,#ea580c,#d97706)':'linear-gradient(90deg,#ef4444,#dc2626)'}}/>
        </div>
      </div>
    </motion.div>
  );
};

const Team = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/analytics/team')
      .then(r => setTeam(r.data.performance||[]))
      .catch(() => setTeam(mockTeam))
      .finally(() => setLoading(false));
  }, []);

  const sorted = [...team].sort((a,b) => b.stats.revenue - a.stats.revenue);

  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'60vh'}}><div style={{width:40,height:40,border:'3px solid rgba(79,70,229,0.1)',borderTop:'3px solid #4f46e5',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;

  const topPerformer = sorted[0];

  return (
    <div>
      <div style={{marginBottom:24}}>
        <h2 style={{fontSize:20,fontWeight:800,color:'#1e293b',marginBottom:4}}>Team Performance</h2>
        <p style={{fontSize:13,color:'#64748b'}}>Track your team's sales achievements and targets</p>
      </div>

      {/* Top Performer Banner */}
      {topPerformer && (
        <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} className="glass-card" style={{padding:'18px 22px',marginBottom:20,background:'linear-gradient(135deg,rgba(245,158,11,0.08),rgba(251,191,36,0.04))',border:'1px solid rgba(245,158,11,0.15)',display:'flex',alignItems:'center',gap:14}}>
          <span style={{fontSize:28}}>🏆</span>
          <div>
            <div style={{fontSize:11,color:'#ea580c',fontWeight:700,letterSpacing:1,textTransform:'uppercase',marginBottom:2}}>Top Performer this Month</div>
            <div style={{fontSize:16,fontWeight:800,color:'#ea580c'}}>{topPerformer.user.name}</div>
            <div style={{fontSize:13,color:'#ea580c',fontWeight:500}}>{formatCurrency(topPerformer.stats.revenue)} revenue · {topPerformer.stats.conversionRate}% conversion</div>
          </div>
        </motion.div>
      )}

      {/* Team Cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:16,marginBottom:20}}>
        {sorted.map((member, i) => <TeamMemberCard key={member.user._id||i} member={member} rank={i+1} delay={i*0.1}/>)}
      </div>

      {/* Leaderboard Table */}
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.4}} className="glass-card" style={{padding:22}}>
        <h3 style={{fontSize:15,fontWeight:800,color:'#1e293b',marginBottom:16}}>Leaderboard</h3>
        <table className="data-table">
          <thead><tr><th>Rank</th><th>Name</th><th>Total Leads</th><th>Won</th><th>Conversion</th><th>Revenue</th><th>Target</th></tr></thead>
          <tbody>
            {sorted.map((m,i)=>(
              <tr key={i}>
                <td><span style={{fontSize:15,fontWeight:700,color:i===0?'#f59e0b':i===1?'#94a3b8':i===2?'#cd7f32':'#475569'}}>{i===0?'🥇':i===1?'🥈':i===2?'🥉':`#${i+1}`}</span></td>
                <td><div style={{fontWeight:700,color:'#1e293b',fontSize:13}}>{m.user.name}</div></td>
                <td>{m.stats.total}</td>
                <td style={{color:'#10b981',fontWeight:700}}>{m.stats.won}</td>
                <td style={{color:'#8b5cf6',fontWeight:700}}>{m.stats.conversionRate}%</td>
                <td style={{color:'#ea580c',fontWeight:700}}>{formatCurrency(m.stats.revenue)}</td>
                <td>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <div style={{flex:1,height:4,background:'rgba(0,0,0,0.05)',borderRadius:2}}><div style={{height:'100%',borderRadius:2,background:'#4f46e5',width:`${m.stats.targetProgress}%`}}/></div>
                    <span style={{fontSize:11,color:'#64748b',minWidth:32,fontWeight:600}}>{m.stats.targetProgress}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default Team;
