import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MdAdd, MdSearch, MdFilterList, MdEdit, MdDelete, MdVisibility, MdChevronLeft, MdChevronRight, MdClose } from 'react-icons/md';
import API from '../services/api';
import { formatCurrency, formatDate, getStatusBadgeClass, getPriorityBadgeClass, PIPELINE_STAGES, INDUSTRIES, LEAD_SOURCES, PRIORITIES } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const INIT_FORM = { companyName:'', clientName:'', email:'', phone:'', industry:'Automotive', productInterest:'', leadSource:'Cold Call', status:'New Lead', followUpDate:'', notes:'', priority:'Medium', estimatedDealValue:'' };

const LeadModal = ({ lead, onClose, onSave, users }) => {
  const [form, setForm] = useState(lead ? { ...lead, followUpDate: lead.followUpDate ? lead.followUpDate.slice(0,10) : '', assignedEmployee: lead.assignedEmployee?._id || '' } : INIT_FORM);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await onSave(form);
    setLoading(false);
    if (res.success) onClose();
  };

  const F = ({ label, children }) => (
    <div>
      <label style={{ display:'block', fontSize:12, fontWeight:500, color:'#94a3b8', marginBottom:5 }}>{label}</label>
      {children}
    </div>
  );

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.95 }}
        className="glass-card" style={{ width:'100%', maxWidth:680, maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ padding:'22px 24px', borderBottom:'1px solid rgba(0,0,0,0.06)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h2 style={{ fontSize:17, fontWeight:800, color:'#1e293b' }}>{lead ? 'Edit Lead' : 'Create New Lead'}</h2>
          <button onClick={onClose} style={{ background:'rgba(0,0,0,0.04)', border:'none', borderRadius:8, padding:6, cursor:'pointer', color:'#64748b' }}><MdClose size={18}/></button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding:24 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
            <F label="Company Name *"><input className="input-dark" value={form.companyName} onChange={e=>setForm({...form,companyName:e.target.value})} required placeholder="Tata Motors Ltd"/></F>
            <F label="Client Name *"><input className="input-dark" value={form.clientName} onChange={e=>setForm({...form,clientName:e.target.value})} required placeholder="Rajesh Kumar"/></F>
            <F label="Email *"><input type="email" className="input-dark" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required placeholder="client@company.com"/></F>
            <F label="Phone *"><input className="input-dark" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} required placeholder="+91 9876543210"/></F>
            <F label="Industry">
              <select className="input-dark" value={form.industry} onChange={e=>setForm({...form,industry:e.target.value})}>
                {INDUSTRIES.map(i=><option key={i}>{i}</option>)}
              </select>
            </F>
            <F label="Lead Source">
              <select className="input-dark" value={form.leadSource} onChange={e=>setForm({...form,leadSource:e.target.value})}>
                {LEAD_SOURCES.map(s=><option key={s}>{s}</option>)}
              </select>
            </F>
            <F label="Status">
              <select className="input-dark" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
                {PIPELINE_STAGES.map(s=><option key={s}>{s}</option>)}
              </select>
            </F>
            <F label="Priority">
              <select className="input-dark" value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>
                {PRIORITIES.map(p=><option key={p}>{p}</option>)}
              </select>
            </F>
            <F label="Estimated Deal Value (₹)"><input type="number" className="input-dark" value={form.estimatedDealValue} onChange={e=>setForm({...form,estimatedDealValue:e.target.value})} placeholder="500000"/></F>
            <F label="Follow-up Date"><input type="date" className="input-dark" value={form.followUpDate} onChange={e=>setForm({...form,followUpDate:e.target.value})}/></F>
            {users.length > 0 && (
              <F label="Assigned Employee">
                <select className="input-dark" value={form.assignedEmployee || ''} onChange={e=>setForm({...form,assignedEmployee:e.target.value})}>
                  <option value="">Unassigned</option>
                  {users.map(u=><option key={u._id} value={u._id}>{u.name}</option>)}
                </select>
              </F>
            )}
            <F label="Product Interest"><input className="input-dark" value={form.productInterest} onChange={e=>setForm({...form,productInterest:e.target.value})} placeholder="ManufactoCRM Enterprise Plan"/></F>
          </div>
          <F label="Notes">
            <textarea className="input-dark" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} rows={3} placeholder="Additional notes about this lead..." style={{ resize:'vertical' }}/>
          </F>
          <div style={{ display:'flex', gap:10, marginTop:20, justifyContent:'flex-end' }}>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : lead ? 'Update Lead' : 'Create Lead'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const Leads = () => {
  const { canManage } = useAuth();
  const [leads, setLeads] = useState([]);
  const [pagination, setPagination] = useState({ total:0, page:1, pages:1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);

  const fetchLeads = async (pg = 1) => {
    setLoading(true);
    try {
      const params = { page: pg, limit: 10 };
      if (search) params.search = search;
      if (filterStatus) params.status = filterStatus;
      if (filterPriority) params.priority = filterPriority;
      const { data } = await API.get('/leads', { params });
      setLeads(data.leads);
      setPagination(data.pagination);
    } catch { setLeads(mockLeads); setPagination({ total: mockLeads.length, page: 1, pages: 1 }); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLeads(page); }, [page, filterStatus, filterPriority]);
  useEffect(() => {
    API.get('/users').then(r => setUsers(r.data.users || [])).catch(() => {});
  }, []);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchLeads(1); };

  const handleSave = async (form) => {
    try {
      if (editLead) {
        const { data } = await API.put(`/leads/${editLead._id}`, form);
        setLeads(prev => prev.map(l => l._id === editLead._id ? data.lead : l));
        toast.success('Lead updated!');
      } else {
        const { data } = await API.post('/leads', form);
        setLeads(prev => [data.lead, ...prev]);
        toast.success('Lead created!');
      }
      setEditLead(null);
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save lead');
      return { success: false };
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lead?')) return;
    try {
      await API.delete(`/leads/${id}`);
      setLeads(prev => prev.filter(l => l._id !== id));
      toast.success('Lead deleted');
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:800, color:'#1e293b', marginBottom:2 }}>Lead Management</h2>
          <p style={{ fontSize:13, color:'#64748b' }}>{pagination.total} total leads</p>
        </div>
        <button onClick={() => { setEditLead(null); setShowModal(true); }} className="btn-primary">
          <MdAdd size={18}/> New Lead
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card" style={{ padding:'14px 16px', marginBottom:16, display:'flex', gap:12, alignItems:'center', flexWrap:'wrap' }}>
        <form onSubmit={handleSearch} style={{ display:'flex', gap:8, flex:1, minWidth:200 }}>
          <div style={{ position:'relative', flex:1 }}>
            <MdSearch style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'#94a3b8' }} size={18}/>
            <input className="input-dark" placeholder="Search leads..." value={search} onChange={e=>setSearch(e.target.value)} style={{ paddingLeft:36 }}/>
          </div>
          <button type="submit" className="btn-secondary" style={{ padding:'10px 16px' }}><MdSearch size={16}/></button>
        </form>
        <select className="input-dark" style={{ width:160 }} value={filterStatus} onChange={e=>{setFilterStatus(e.target.value);setPage(1);}}>
          <option value="">All Statuses</option>
          {PIPELINE_STAGES.map(s=><option key={s}>{s}</option>)}
        </select>
        <select className="input-dark" style={{ width:140 }} value={filterPriority} onChange={e=>{setFilterPriority(e.target.value);setPage(1);}}>
          <option value="">All Priorities</option>
          {PRIORITIES.map(p=><option key={p}>{p}</option>)}
        </select>
        {(filterStatus||filterPriority||search) && (
          <button onClick={()=>{setFilterStatus('');setFilterPriority('');setSearch('');setPage(1);}} className="btn-secondary" style={{ padding:'10px 12px' }}>
            <MdClose size={16}/>
          </button>
        )}
      </div>

      {/* Table */}
      <div className="glass-card" style={{ overflow:'hidden' }}>
        {loading ? (
          <div style={{ padding:40, textAlign:'center', color:'#64748b' }}>
            <div style={{ width:36, height:36, border:'2px solid rgba(79,70,229,0.1)', borderTop:'2px solid #4f46e5', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 12px' }}/>
            Loading leads...
          </div>
        ) : leads.length === 0 ? (
          <div style={{ padding:60, textAlign:'center' }}>
            <p style={{ fontSize:40, marginBottom:12 }}>📭</p>
            <p style={{ fontSize:16, color:'#1e293b', fontWeight:800, marginBottom:6 }}>No leads found</p>
            <p style={{ fontSize:13, color:'#64748b' }}>Create your first lead to get started</p>
          </div>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Company</th><th>Contact</th><th>Status</th><th>Priority</th>
                  <th>Deal Value</th><th>Assigned To</th><th>Follow Up</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, i) => (
                  <motion.tr key={lead._id} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay: i * 0.03 }}>
                    <td>
                      <div style={{ fontWeight:700, color:'#1e293b', fontSize:13 }}>{lead.companyName}</div>
                      <div style={{ fontSize:11, color:'#64748b', marginTop: 1 }}>{lead.industry}</div>
                    </td>
                    <td>
                      <div style={{ fontSize:13, color:'#334155', fontWeight: 600 }}>{lead.clientName}</div>
                      <div style={{ fontSize:11, color:'#64748b', marginTop: 1 }}>{lead.email}</div>
                    </td>
                    <td><span className={`badge ${getStatusBadgeClass(lead.status)}`}>{lead.status}</span></td>
                    <td><span className={`badge ${getPriorityBadgeClass(lead.priority)}`}>{lead.priority}</span></td>
                    <td style={{ fontSize:13, fontWeight:700, color:'#10b981' }}>{formatCurrency(lead.estimatedDealValue)}</td>
                    <td style={{ fontSize:12, color:'#64748b', fontWeight: 600 }}>{lead.assignedEmployee?.name || '—'}</td>
                    <td style={{ fontSize:12, color:'#64748b' }}>{formatDate(lead.followUpDate)}</td>
                    <td>
                      <div style={{ display:'flex', gap:6 }}>
                        <Link to={`/leads/${lead._id}`} style={{ background:'rgba(79,70,229,0.08)', border:'1px solid rgba(79,70,229,0.15)', borderRadius:6, padding:'5px 8px', color:'#4f46e5', display:'inline-flex', cursor:'pointer', textDecoration:'none' }}><MdVisibility size={15}/></Link>
                        <button onClick={()=>{setEditLead(lead);setShowModal(true);}} style={{ background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.15)', borderRadius:6, padding:'5px 8px', color:'#10b981', cursor:'pointer', display:'flex' }}><MdEdit size={15}/></button>
                        {canManage && <button onClick={()=>handleDelete(lead._id)} style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.15)', borderRadius:6, padding:'5px 8px', color:'#ef4444', cursor:'pointer', display:'flex' }}><MdDelete size={15}/></button>}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div style={{ padding:'14px 16px', borderTop:'1px solid rgba(0,0,0,0.04)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:13, color:'#64748b' }}>Page {pagination.page} of {pagination.pages} · {pagination.total} total</span>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} className="btn-secondary" style={{ padding:'7px 12px' }}><MdChevronLeft size={18}/></button>
              <button onClick={()=>setPage(p=>Math.min(pagination.pages,p+1))} disabled={page===pagination.pages} className="btn-secondary" style={{ padding:'7px 12px' }}><MdChevronRight size={18}/></button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showModal && <LeadModal lead={editLead} onClose={()=>{setShowModal(false);setEditLead(null);}} onSave={handleSave} users={users}/>}
      </AnimatePresence>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

const mockLeads = [
  { _id:'1', companyName:'Tata Motors Ltd', clientName:'Rajesh Kumar', email:'rajesh@tata.com', industry:'Automotive', status:'Qualified', priority:'High', estimatedDealValue:850000, assignedEmployee:{name:'Rahul Verma'}, followUpDate:new Date(Date.now()+86400000) },
  { _id:'2', companyName:'Sun Pharma Ltd', clientName:'Dr. Nisha Shah', email:'nisha@sunpharma.com', industry:'Pharmaceutical', status:'Proposal Sent', priority:'Critical', estimatedDealValue:920000, assignedEmployee:{name:'Sneha Joshi'}, followUpDate:new Date(Date.now()+172800000) },
  { _id:'3', companyName:'JSW Steel', clientName:'Abhishek Nair', email:'abhishek@jsw.com', industry:'Steel & Metal', status:'Negotiation', priority:'High', estimatedDealValue:1200000, assignedEmployee:{name:'Vikram Singh'}, followUpDate:new Date(Date.now()+259200000) },
];

export default Leads;
