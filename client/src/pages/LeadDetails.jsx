import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdArrowBack, MdEdit, MdDelete, MdAdd, MdBusiness, MdPerson, MdEmail, MdPhone, MdCalendarToday, MdAttachMoney, MdSmartToy } from 'react-icons/md';
import API from '../services/api';
import { formatCurrency, formatDate, formatDateTime, getStatusBadgeClass, getPriorityBadgeClass, timeAgo } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ACTIVITY_ACTIONS = ['Call Completed','Email Sent','Meeting Scheduled','Meeting Completed','Proposal Sent','Follow-up Scheduled','Follow-up Completed','Negotiation Started','Note Added','Other'];

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { canManage, user } = useAuth();
  const [lead, setLead] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [newActivity, setNewActivity] = useState({ action: 'Call Completed', description: '' });
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiType, setAiType] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [leadRes, actRes] = await Promise.all([
          API.get(`/leads/${id}`),
          API.get(`/activities/${id}`)
        ]);
        setLead(leadRes.data.lead);
        setActivities(actRes.data.activities);
      } catch {
        toast.error('Failed to load lead details');
        navigate('/leads');
      } finally { setLoading(false); }
    };
    fetchAll();
  }, [id]);

  const handleAddActivity = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/activities', { leadId: id, ...newActivity });
      setActivities(prev => [data.activity, ...prev]);
      setNewActivity({ action: 'Call Completed', description: '' });
      toast.success('Activity logged!');
    } catch { toast.error('Failed to log activity'); }
  };

  const generateAI = async (type) => {
    setAiLoading(true);
    setAiType(type);
    setActiveTab('ai');
    try {
      const { data } = await API.post('/ai/generate', { type, lead });
      setAiResponse(data.response.content);
    } catch { toast.error('AI generation failed'); }
    finally { setAiLoading(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this lead permanently?')) return;
    try {
      await API.delete(`/leads/${id}`);
      toast.success('Lead deleted');
      navigate('/leads');
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh', flexDirection:'column', gap:16 }}>
      <div style={{ width:40, height:40, border:'3px solid rgba(99,102,241,0.2)', borderTop:'3px solid #6366f1', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!lead) return null;

  const tabs = ['overview', 'activity', 'notes', 'ai'];
  const tabLabels = { overview:'Overview', activity:'Activity', notes:'Notes', ai:'AI Insights' };

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <Link to="/leads" style={{ background:'rgba(0,0,0,0.04)', border:'1px solid rgba(0,0,0,0.08)', borderRadius:8, padding:'7px 10px', display:'inline-flex', color:'#64748b', textDecoration:'none' }}><MdArrowBack size={18}/></Link>
          <div>
            <h2 style={{ fontSize:20, fontWeight:800, color:'#1e293b', marginBottom:4 }}>{lead.companyName}</h2>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <span className={`badge ${getStatusBadgeClass(lead.status)}`}>{lead.status}</span>
              <span className={`badge ${getPriorityBadgeClass(lead.priority)}`}>{lead.priority}</span>
            </div>
          </div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          {canManage && <button onClick={handleDelete} className="btn-danger" style={{ padding:'8px 14px' }}><MdDelete size={16}/></button>}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:20, background:'rgba(0,0,0,0.03)', borderRadius:12, padding:4, border:'1px solid rgba(0,0,0,0.06)', width:'fit-content' }}>
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding:'8px 18px', borderRadius:9, border:'none', cursor:'pointer', fontSize:13, fontWeight:700,
            background: activeTab===tab ? 'linear-gradient(135deg,#4f46e5,#8b5cf6)' : 'transparent',
            color: activeTab===tab ? 'white' : '#64748b', transition:'all 0.2s'
          }}>{tabLabels[tab]}</button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          {/* Contact Info */}
          <div className="glass-card" style={{ padding:22 }}>
            <h3 style={{ fontSize:11, fontWeight:700, color:'#94a3b8', marginBottom:16, textTransform:'uppercase', letterSpacing:1 }}>Contact Details</h3>
            {[
              { icon:MdPerson, label:'Client Name', value:lead.clientName },
              { icon:MdBusiness, label:'Company', value:lead.companyName },
              { icon:MdEmail, label:'Email', value:lead.email },
              { icon:MdPhone, label:'Phone', value:lead.phone },
              { icon:MdBusiness, label:'Industry', value:lead.industry },
              { icon:MdPerson, label:'Lead Source', value:lead.leadSource },
            ].map(({icon:Icon,label,value})=>(
              <div key={label} style={{ display:'flex', gap:12, marginBottom:14, alignItems:'flex-start' }}>
                <div style={{ width:32, height:32, borderRadius:8, background:'rgba(79,70,229,0.08)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Icon size={16} color="#4f46e5"/></div>
                <div><div style={{ fontSize:11, color:'#64748b', marginBottom:2, fontWeight:600 }}>{label}</div><div style={{ fontSize:13, color:'#1e293b', fontWeight:700 }}>{value||'—'}</div></div>
              </div>
            ))}
          </div>

          {/* Deal Info */}
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div className="glass-card" style={{ padding:22 }}>
              <h3 style={{ fontSize:11, fontWeight:700, color:'#94a3b8', marginBottom:16, textTransform:'uppercase', letterSpacing:1 }}>Deal Information</h3>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
                <span style={{ fontSize:13, color:'#64748b', fontWeight:500 }}>Deal Value</span>
                <span style={{ fontSize:15, fontWeight:800, color:'#10b981' }}>{formatCurrency(lead.estimatedDealValue)}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
                <span style={{ fontSize:13, color:'#64748b', fontWeight:500 }}>Assigned To</span>
                <span style={{ fontSize:13, fontWeight:700, color:'#1e293b' }}>{lead.assignedEmployee?.name||'Unassigned'}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
                <span style={{ fontSize:13, color:'#64748b', fontWeight:500 }}>Follow-up Date</span>
                <span style={{ fontSize:13, color:'#1e293b', fontWeight:700 }}>{formatDate(lead.followUpDate)}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between' }}>
                <span style={{ fontSize:13, color:'#64748b', fontWeight:500 }}>Created</span>
                <span style={{ fontSize:13, color:'#1e293b', fontWeight:700 }}>{formatDate(lead.createdAt)}</span>
              </div>
            </div>

            <div className="glass-card" style={{ padding:22 }}>
              <h3 style={{ fontSize:11, fontWeight:700, color:'#94a3b8', marginBottom:12, textTransform:'uppercase', letterSpacing:1 }}>AI Quick Actions</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {[
                  { type:'follow-up-email', label:'✉️ Follow-up Email' },
                  { type:'sales-pitch', label:'🎯 Sales Pitch' },
                  { type:'summarize-lead', label:'📊 Summarize Lead' },
                  { type:'next-action', label:'🚀 Next Action' },
                ].map(({type,label})=>(
                  <button key={type} onClick={()=>generateAI(type)} className="btn-secondary" style={{ justifyContent:'flex-start', fontSize:13, fontWeight:600 }}>
                    <MdSmartToy size={15}/> {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <div className="glass-card" style={{ padding:22 }}>
            <h3 style={{ fontSize:15, fontWeight:800, color:'#1e293b', marginBottom:16 }}>Log Activity</h3>
            <form onSubmit={handleAddActivity}>
              <label style={{ fontSize:12, color:'#64748b', marginBottom:5, display:'block', fontWeight:600 }}>Action Type</label>
              <select className="input-dark" value={newActivity.action} onChange={e=>setNewActivity({...newActivity,action:e.target.value})} style={{ marginBottom:12 }}>
                {ACTIVITY_ACTIONS.map(a=><option key={a}>{a}</option>)}
              </select>
              <label style={{ fontSize:12, color:'#64748b', marginBottom:5, display:'block', fontWeight:600 }}>Description</label>
              <textarea className="input-dark" value={newActivity.description} onChange={e=>setNewActivity({...newActivity,description:e.target.value})} rows={3} placeholder="Add details about this activity..." style={{ marginBottom:14, resize:'vertical' }}/>
              <button type="submit" className="btn-primary" style={{ width:'100%', justifyContent:'center' }}><MdAdd size={16}/> Log Activity</button>
            </form>
          </div>
          <div className="glass-card" style={{ padding:22, maxHeight:500, overflowY:'auto' }}>
            <h3 style={{ fontSize:15, fontWeight:800, color:'#1e293b', marginBottom:16 }}>Activity Timeline</h3>
            {activities.length === 0 ? <p style={{ color:'#64748b', fontSize:13, fontWeight:500 }}>No activities yet. Log your first interaction!</p> :
              activities.map((act,i)=>(
                <div key={i} style={{ display:'flex', gap:12, marginBottom:16, paddingBottom:16, borderBottom: i<activities.length-1?'1px solid rgba(0,0,0,0.04)':'none' }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:'#4f46e5', marginTop:5, flexShrink:0 }}/>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:'#1e293b', marginBottom:2 }}>{act.action}</div>
                    {act.description && <div style={{ fontSize:12, color:'#64748b', marginBottom:4, fontWeight:500 }}>{act.description}</div>}
                    <div style={{ fontSize:11, color:'#94a3b8', fontWeight:500 }}>{act.createdBy?.name} · {timeAgo(act.createdAt)}</div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="glass-card" style={{ padding:24 }}>
          <h3 style={{ fontSize:15, fontWeight:800, color:'#1e293b', marginBottom:16 }}>Notes</h3>
          <p style={{ fontSize:14, color:'#334155', lineHeight:1.7, fontWeight:500 }}>{lead.notes || 'No notes added yet.'}</p>
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="glass-card" style={{ padding:24 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
            <MdSmartToy size={20} color="#4f46e5"/>
            <h3 style={{ fontSize:15, fontWeight:800, color:'#1e293b' }}>AI Insights</h3>
            {aiType && <span style={{ fontSize:12, color:'#4f46e5', background:'rgba(79,70,229,0.08)', padding:'2px 10px', borderRadius:20, fontWeight:600 }}>{aiType.replace(/-/g,' ')}</span>}
          </div>
          {aiLoading ? (
            <div style={{ textAlign:'center', padding:40 }}>
              <div style={{ width:40, height:40, border:'3px solid rgba(79,70,229,0.1)', borderTop:'3px solid #4f46e5', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 12px' }}/>
              <p style={{ color:'#64748b', fontWeight:600 }}>Generating AI response...</p>
            </div>
          ) : aiResponse ? (
            <pre style={{ fontSize:13, color:'#1e293b', lineHeight:1.8, whiteSpace:'pre-wrap', fontFamily:"'Inter',sans-serif", background: '#f8fafc', padding: 16, borderRadius: 10, border: '1px solid rgba(0,0,0,0.06)' }}>{aiResponse}</pre>
          ) : (
            <div style={{ textAlign:'center', padding:40 }}>
              <p style={{ fontSize:36, marginBottom:12 }}>🤖</p>
              <p style={{ color:'#64748b', marginBottom:6, fontWeight:600 }}>Select an AI action from the Overview tab</p>
              <p style={{ color:'#94a3b8', fontSize:13, fontWeight:500 }}>Get AI-powered insights, email drafts, and recommendations</p>
            </div>
          )}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default LeadDetails;
