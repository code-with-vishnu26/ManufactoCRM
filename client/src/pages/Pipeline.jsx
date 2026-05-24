import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DndContext, DragOverlay, closestCorners, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MdRefresh, MdOpenInNew } from 'react-icons/md';
import API from '../services/api';
import { formatCurrency, getStatusBadgeClass, getPriorityBadgeClass, getInitials } from '../utils/helpers';
import toast from 'react-hot-toast';

const STAGES = ['New Lead','Contacted','Qualified','Proposal Sent','Negotiation','Closed Won','Closed Lost'];
const STAGE_COLORS = { 'New Lead':'#6366f1','Contacted':'#06b6d4','Qualified':'#f59e0b','Proposal Sent':'#8b5cf6','Negotiation':'#f97316','Closed Won':'#10b981','Closed Lost':'#ef4444' };

const KanbanCard = ({ lead }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: lead._id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className="kanban-card" style={{ userSelect:'none' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
          <div style={{ fontSize:13, fontWeight:700, color:'#1e293b', flex:1, paddingRight:8, lineHeight:1.4 }}>{lead.companyName}</div>
          <span className={`badge ${getPriorityBadgeClass(lead.priority)}`}>{lead.priority}</span>
        </div>
        <div style={{ fontSize:12, color:'#64748b', marginBottom:8 }}>{lead.clientName}</div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span style={{ fontSize:12, fontWeight:700, color:'#10b981' }}>{formatCurrency(lead.estimatedDealValue)}</span>
          <Link to={`/leads/${lead._id}`} onClick={e=>e.stopPropagation()} style={{ color:'#4f46e5', display:'inline-flex', textDecoration:'none' }}><MdOpenInNew size={14}/></Link>
        </div>
        {lead.assignedEmployee && (
          <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:8 }}>
            <div style={{ width:20, height:20, borderRadius:'50%', background:'linear-gradient(135deg,#4f46e5,#8b5cf6)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:700, color:'white' }}>{getInitials(lead.assignedEmployee.name)}</div>
            <span style={{ fontSize:11, color:'#64748b', fontWeight:600 }}>{lead.assignedEmployee.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const KanbanColumn = ({ stage, leads }) => {
  const color = STAGE_COLORS[stage];
  const totalValue = leads.reduce((sum,l) => sum + (l.estimatedDealValue||0), 0);

  return (
    <div className="kanban-column" style={{ minWidth:260, maxWidth:280 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:10, height:10, borderRadius:'50%', background:color }}/>
          <span style={{ fontSize:13, fontWeight:800, color:'#1e293b' }}>{stage}</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ fontSize:11, color:'#64748b', background:'rgba(0,0,0,0.04)', padding:'2px 7px', borderRadius:10, fontWeight:700 }}>{leads.length}</span>
        </div>
      </div>
      {leads.length > 0 && (
        <div style={{ fontSize:11, color:'#10b981', marginBottom:10, fontWeight:700 }}>{formatCurrency(totalValue)} total</div>
      )}
      <SortableContext items={leads.map(l=>l._id)} strategy={verticalListSortingStrategy}>
        <div style={{ display:'flex', flexDirection:'column', gap:8, minHeight:100 }}>
          {leads.map(lead => <KanbanCard key={lead._id} lead={lead}/>)}
          {leads.length === 0 && (
            <div style={{ padding:'20px 10px', textAlign:'center', border:'1px dashed rgba(0,0,0,0.08)', borderRadius:10 }}>
              <p style={{ fontSize:12, color:'#94a3b8', fontWeight:500 }}>Drop leads here</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};

const Pipeline = () => {
  const [kanban, setKanban] = useState(() => { const k={}; STAGES.forEach(s=>{k[s]=[]}); return k; });
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const fetchKanban = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/leads/kanban');
      setKanban(data.kanban);
    } catch {
      // Mock data
      const mock = {}; STAGES.forEach(s=>{mock[s]=[]});
      mockLeads.forEach(l => { if(mock[l.status]) mock[l.status].push(l); });
      setKanban(mock);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchKanban(); }, []);

  const findStage = (id) => {
    for (const stage of STAGES) {
      if (kanban[stage]?.find(l=>l._id===id)) return stage;
    }
    return null;
  };

  const handleDragStart = ({ active }) => setActiveId(active.id);

  const handleDragEnd = async ({ active, over }) => {
    setActiveId(null);
    if (!over) return;
    const fromStage = findStage(active.id);
    const toStage = findStage(over.id) || STAGES.find(s => over.id === s);
    if (!fromStage || !toStage || fromStage === toStage) return;

    const lead = kanban[fromStage].find(l=>l._id===active.id);
    if (!lead) return;

    setKanban(prev => ({
      ...prev,
      [fromStage]: prev[fromStage].filter(l=>l._id!==active.id),
      [toStage]: [{ ...lead, status:toStage }, ...prev[toStage]]
    }));

    try {
      await API.put(`/leads/${active.id}`, { status: toStage });
      toast.success(`Moved to ${toStage}`);
    } catch {
      toast.error('Failed to update status');
      fetchKanban();
    }
  };

  const activeLead = activeId ? Object.values(kanban).flat().find(l=>l._id===activeId) : null;

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh', flexDirection:'column', gap:16 }}>
      <div style={{ width:40, height:40, border:'3px solid rgba(79,70,229,0.1)', borderTop:'3px solid #4f46e5', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:800, color:'#1e293b', marginBottom:2 }}>Sales Pipeline</h2>
          <p style={{ fontSize:13, color:'#64748b' }}>Drag and drop leads between stages</p>
        </div>
        <button onClick={fetchKanban} className="btn-secondary"><MdRefresh size={16}/> Refresh</button>
      </div>

      {/* Stage totals */}
      <div style={{ display:'flex', gap:10, marginBottom:20, overflowX:'auto', paddingBottom:4 }}>
        {STAGES.map(stage => (
          <div key={stage} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:'8px 14px', background:'rgba(0,0,0,0.02)', borderRadius:10, border:`1px solid ${STAGE_COLORS[stage]}20`, flexShrink:0 }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:STAGE_COLORS[stage] }}/>
            <span style={{ fontSize:11, color:'#64748b', whiteSpace:'nowrap', fontWeight:600 }}>{stage}</span>
            <span style={{ fontSize:14, fontWeight:800, color:'#1e293b' }}>{kanban[stage]?.length||0}</span>
          </div>
        ))}
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div style={{ display:'flex', gap:14, overflowX:'auto', paddingBottom:16 }}>
          {STAGES.map(stage => <KanbanColumn key={stage} stage={stage} leads={kanban[stage]||[]}/>)}
        </div>
        <DragOverlay>
          {activeLead && (
            <div className="kanban-card" style={{ boxShadow:'0 20px 40px rgba(0,0,0,0.1)', transform:'rotate(2deg)', background:'#ffffff' }}>
              <div style={{ fontSize:13, fontWeight:700, color:'#1e293b' }}>{activeLead.companyName}</div>
              <div style={{ fontSize:12, color:'#64748b', marginTop:4 }}>{activeLead.clientName}</div>
              <div style={{ fontSize:12, fontWeight:700, color:'#10b981', marginTop:6 }}>{formatCurrency(activeLead.estimatedDealValue)}</div>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

const mockLeads = [
  { _id:'1', companyName:'Tata Motors', clientName:'Rajesh Kumar', status:'New Lead', priority:'High', estimatedDealValue:850000, assignedEmployee:{name:'Rahul Verma'} },
  { _id:'2', companyName:'Sun Pharma', clientName:'Dr. Nisha Shah', status:'Contacted', priority:'Critical', estimatedDealValue:920000, assignedEmployee:{name:'Sneha Joshi'} },
  { _id:'3', companyName:'JSW Steel', clientName:'Abhishek Nair', status:'Qualified', priority:'High', estimatedDealValue:1200000, assignedEmployee:{name:'Vikram Singh'} },
  { _id:'4', companyName:'Mahindra', clientName:'Deepak Iyer', status:'Proposal Sent', priority:'Medium', estimatedDealValue:750000, assignedEmployee:{name:'Rahul Verma'} },
  { _id:'5', companyName:'Cipla Ltd', clientName:'Dr. Rakesh Modi', status:'Negotiation', priority:'High', estimatedDealValue:780000, assignedEmployee:{name:'Sneha Joshi'} },
  { _id:'6', companyName:'Haldirams', clientName:'Suresh Gupta', status:'Closed Won', priority:'Medium', estimatedDealValue:450000, assignedEmployee:{name:'Vikram Singh'} },
  { _id:'7', companyName:'Dixon Tech', clientName:'Ritu Agarwal', status:'Closed Lost', priority:'Low', estimatedDealValue:290000, assignedEmployee:{name:'Rahul Verma'} },
];

export default Pipeline;
