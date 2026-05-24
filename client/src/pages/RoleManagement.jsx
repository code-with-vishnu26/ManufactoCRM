import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdAdminPanelSettings, MdGroups, MdPerson, MdBarChart,
  MdSupportAgent, MdVisibility, MdManageAccounts, MdAdd,
  MdClose, MdCheck, MdEdit, MdSave, MdShield
} from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// ─── Permission Matrix ─────────────────────────────────────────────────────────
const ALL_PERMISSIONS = [
  { key:'leads_write',  label:'Leads Create'  },
  { key:'leads_read',   label:'Leads Read'    },
  { key:'analytics_read',label:'Analytics'   },
  { key:'team_read',    label:'Team Mgmt'     },
  { key:'ai_use',       label:'AI Use'        },
  { key:'admin_panel',  label:'Admin Panel'   },
  { key:'reports_read', label:'Reports'       },
  { key:'settings',     label:'Settings'      },
];

const ALL_ROLES = [
  { key:'admin',             label:'Admin',              icon:MdAdminPanelSettings, color:'#f59e0b', users:2 },
  { key:'team_lead',         label:'Team Lead',          icon:MdGroups,             color:'#8b5cf6', users:3 },
  { key:'sales_executive',   label:'Sales Executive',    icon:MdPerson,             color:'#10b981', users:8 },
  { key:'sales_manager',     label:'Sales Manager',      icon:MdBarChart,           color:'#4f46e5', users:2 },
  { key:'ops_director',      label:'Ops Director',       icon:MdManageAccounts,     color:'#ef4444', users:1 },
  { key:'support_specialist',label:'Support Specialist', icon:MdSupportAgent,       color:'#06b6d4', users:4 },
  { key:'viewer',            label:'Viewer',             icon:MdVisibility,         color:'#64748b', users:4 },
];

const INITIAL_MATRIX = {
  admin:             ['leads_write','leads_read','analytics_read','team_read','ai_use','admin_panel','reports_read','settings'],
  team_lead:         ['leads_write','leads_read','analytics_read','team_read','ai_use'],
  sales_executive:   ['leads_read','ai_use'],
  sales_manager:     ['leads_read','analytics_read','team_read','ai_use','reports_read'],
  ops_director:      ['analytics_read','leads_read','team_read'],
  support_specialist:['leads_read'],
  viewer:            ['analytics_read'],
};

const mockUsers = [
  { id:'u1', name:'Ananya Rao',     email:'ananya@manufactocrm.com',  role:'admin' },
  { id:'u2', name:'Rahul Verma',    email:'rahul@manufactocrm.com',   role:'sales_executive' },
  { id:'u3', name:'Sneha Joshi',    email:'sneha@manufactocrm.com',   role:'sales_executive' },
  { id:'u4', name:'Vikram Singh',   email:'vikram@manufactocrm.com',  role:'team_lead' },
  { id:'u5', name:'Priya Mehta',    email:'priya@manufactocrm.com',   role:'sales_manager' },
  { id:'u6', name:'Arjun Tiwari',   email:'arjun@manufactocrm.com',   role:'support_specialist' },
  { id:'u7', name:'Neha Kapoor',    email:'neha@manufactocrm.com',    role:'viewer' },
  { id:'u8', name:'Dev Patel',      email:'dev@manufactocrm.com',     role:'ops_director' },
];

// ─── Add Role Modal ────────────────────────────────────────────────────────────
const AddRoleModal = ({ onClose }) => {
  const [name, setName] = useState('');
  const [selected, setSelected] = useState([]);
  const toggle = (k) => setSelected(s => s.includes(k) ? s.filter(x=>x!==k) : [...s,k]);
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
      <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
        style={{ background:'#fff', borderRadius:16, padding:28, width:480, boxShadow:'0 20px 60px rgba(0,0,0,0.2)', maxHeight:'90vh', overflowY:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <h3 style={{ fontSize:17, fontWeight:800, color:'#1e293b' }}>Add New Role</h3>
          <button onClick={onClose} style={{ background:'rgba(0,0,0,0.06)', border:'none', borderRadius:8, padding:6, cursor:'pointer' }}><MdClose size={18}/></button>
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={{ fontSize:12, color:'#64748b', fontWeight:600, marginBottom:6, display:'block' }}>Role Name</label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Marketing Manager"
            style={{ width:'100%', padding:'9px 12px', borderRadius:8, border:'1px solid rgba(0,0,0,0.1)', fontSize:13, boxSizing:'border-box' }}/>
        </div>
        <div>
          <label style={{ fontSize:12, color:'#64748b', fontWeight:600, marginBottom:10, display:'block' }}>Permissions</label>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {ALL_PERMISSIONS.map(p => (
              <label key={p.key} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 12px', borderRadius:8,
                border:`1px solid ${selected.includes(p.key)?'#4f46e5':'rgba(0,0,0,0.08)'}`, background:selected.includes(p.key)?'#eef2ff':'transparent', cursor:'pointer' }}>
                <input type="checkbox" checked={selected.includes(p.key)} onChange={()=>toggle(p.key)} style={{ accentColor:'#4f46e5' }}/>
                <span style={{ fontSize:12, fontWeight:600, color:selected.includes(p.key)?'#4f46e5':'#475569' }}>{p.label}</span>
              </label>
            ))}
          </div>
        </div>
        <div style={{ display:'flex', gap:10, marginTop:20 }}>
          <button onClick={onClose} style={{ flex:1, padding:'10px', borderRadius:8, border:'1px solid rgba(0,0,0,0.1)', background:'white', cursor:'pointer', fontWeight:600 }}>Cancel</button>
          <button onClick={() => { if(!name) return toast.error('Enter a role name'); toast.success(`Role "${name}" created!`,{icon:'🛡️'}); onClose(); }}
            style={{ flex:1, padding:'10px', borderRadius:8, border:'none', background:'linear-gradient(135deg,#4f46e5,#8b5cf6)', color:'white', cursor:'pointer', fontWeight:700 }}>
            Create Role
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ─── Role Card ────────────────────────────────────────────────────────────────
const RoleCard = ({ role, perms, onToggle }) => {
  const [expanded, setExpanded] = useState(false);
  const Icon = role.icon;
  return (
    <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
      style={{ background:'#fff', border:'1px solid rgba(0,0,0,0.06)', borderRadius:14,
        padding:'18px 20px', boxShadow:'0 2px 8px rgba(0,0,0,0.04)', transition:'box-shadow 0.2s' }}>
      <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:12 }}>
        <div style={{ width:44, height:44, borderRadius:12, background:`linear-gradient(135deg,${role.color},${role.color}bb)`,
          display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <Icon size={22} color="white"/>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:14, fontWeight:800, color:'#1e293b' }}>{role.label}</span>
            <span style={{ fontSize:11, fontWeight:700, color:role.color, background:`${role.color}15`, padding:'2px 8px', borderRadius:20 }}>
              {role.users} users
            </span>
          </div>
          <div style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>Role key: {role.key}</div>
        </div>
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:14 }}>
        {perms.map(p => (
          <span key={p} style={{ fontSize:10, fontWeight:700, color:'#065f46', background:'#d1fae5', padding:'3px 9px', borderRadius:20, border:'1px solid #a7f3d0' }}>{p}</span>
        ))}
        {perms.length === 0 && <span style={{ fontSize:11, color:'#94a3b8' }}>No permissions assigned</span>}
      </div>
      <button onClick={() => setExpanded(!expanded)}
        style={{ width:'100%', padding:'8px', borderRadius:8, border:'1px solid rgba(79,70,229,0.2)', background:'rgba(79,70,229,0.05)',
          color:'#4f46e5', fontSize:12, fontWeight:700, cursor:'pointer' }}>
        <MdEdit size={13} style={{ marginRight:5, verticalAlign:'middle' }}/>{expanded?'Collapse':'Edit Permissions'}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
            style={{ overflow:'hidden', marginTop:12 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, padding:'12px', background:'rgba(0,0,0,0.02)', borderRadius:10 }}>
              {ALL_PERMISSIONS.map(p => {
                const active = perms.includes(p.key);
                return (
                  <label key={p.key} style={{ display:'flex', alignItems:'center', gap:7, padding:'7px 10px', borderRadius:8, cursor:'pointer',
                    border:`1px solid ${active?'#10b981':'rgba(0,0,0,0.06)'}`, background:active?'rgba(16,185,129,0.06)':'transparent' }}>
                    <input type="checkbox" checked={active} onChange={() => onToggle(role.key, p.key)} style={{ accentColor:'#10b981' }}/>
                    <span style={{ fontSize:11, fontWeight:600, color:active?'#065f46':'#64748b' }}>{p.label}</span>
                  </label>
                );
              })}
            </div>
            <button onClick={() => { toast.success(`Permissions saved for ${role.label}!`,{icon:'✅'}); setExpanded(false); }}
              style={{ width:'100%', marginTop:8, padding:'9px', borderRadius:8, border:'none', background:'linear-gradient(135deg,#10b981,#059669)', color:'white', fontWeight:700, fontSize:12, cursor:'pointer' }}>
              <MdSave size={14} style={{ marginRight:5, verticalAlign:'middle' }}/>Save Permissions
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const RoleManagement = () => {
  const { isAdmin } = useAuth();
  const [matrix, setMatrix]       = useState(INITIAL_MATRIX);
  const [users, setUsers]         = useState(mockUsers);
  const [showAddModal, setShowAddModal] = useState(false);

  const togglePerm = (role, perm) => {
    setMatrix(m => {
      const cur = m[role] || [];
      return { ...m, [role]: cur.includes(perm) ? cur.filter(x=>x!==perm) : [...cur,perm] };
    });
  };

  const updateUserRole = (userId, newRole) => {
    setUsers(u => u.map(user => user.id===userId ? {...user, role:newRole} : user));
    toast.success('User role updated!', { icon:'👤' });
  };

  if (!isAdmin) return (
    <div style={{ padding:40, textAlign:'center' }}>
      <div style={{ fontSize:40, marginBottom:12 }}>🔒</div>
      <h3 style={{ color:'#1e293b', fontWeight:800, fontSize:18, marginBottom:8 }}>Access Restricted</h3>
      <p style={{ color:'#64748b', fontSize:13 }}>Only administrators can manage roles and permissions.</p>
    </div>
  );

  const cardStyle = { background:'#fff', border:'1px solid rgba(0,0,0,0.06)', borderRadius:16, padding:22, boxShadow:'0 2px 8px rgba(0,0,0,0.04)' };

  return (
    <div style={{ padding:'4px 0 24px' }}>

      {/* ── Header ── */}
      <motion.div initial={{ opacity:0,y:-16 }} animate={{ opacity:1,y:0 }}
        style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
            <div style={{ width:36,height:36,borderRadius:10,background:'linear-gradient(135deg,#ef4444,#dc2626)',display:'flex',alignItems:'center',justifyContent:'center' }}>
              <MdShield size={20} color="white"/>
            </div>
            <h2 style={{ fontSize:22, fontWeight:800, color:'#1e293b', letterSpacing:'-0.3px' }}>Role & Permission Management</h2>
          </div>
          <p style={{ fontSize:13, color:'#64748b', marginLeft:46 }}>Control what each role can see and do in the system</p>
        </div>
        <button onClick={() => setShowAddModal(true)}
          style={{ display:'flex',alignItems:'center',gap:8,padding:'10px 18px',borderRadius:10,border:'none',
            background:'linear-gradient(135deg,#4f46e5,#8b5cf6)',color:'white',fontWeight:700,fontSize:13,cursor:'pointer',boxShadow:'0 4px 12px rgba(79,70,229,0.3)' }}>
          <MdAdd size={18}/> Add New Role
        </button>
      </motion.div>

      {/* ── Role Cards Grid ── */}
      <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.1 }} style={{ ...cardStyle, marginBottom:20 }}>
        <h3 style={{ fontSize:15, fontWeight:800, color:'#1e293b', marginBottom:16 }}>Role Overview</h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
          {ALL_ROLES.slice(0,4).map((r,i) => (
            <RoleCard key={r.key} role={r} perms={matrix[r.key]||[]} onToggle={togglePerm} delay={i*0.05}/>
          ))}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginTop:14 }}>
          {ALL_ROLES.slice(4).map((r,i) => (
            <RoleCard key={r.key} role={r} perms={matrix[r.key]||[]} onToggle={togglePerm} delay={(i+4)*0.05}/>
          ))}
        </div>
      </motion.div>

      {/* ── Permission Matrix Table ── */}
      <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.25 }} style={{ ...cardStyle, marginBottom:20 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <div>
            <h3 style={{ fontSize:15, fontWeight:800, color:'#1e293b' }}>Permission Matrix</h3>
            <p style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>Toggle permissions per role — click checkmarks to toggle</p>
          </div>
          <button onClick={() => toast.success('Matrix saved!',{icon:'💾'})}
            style={{ padding:'8px 16px', borderRadius:8, border:'none', background:'linear-gradient(135deg,#10b981,#059669)', color:'white', fontWeight:700, fontSize:12, cursor:'pointer' }}>
            <MdSave size={14} style={{ marginRight:5, verticalAlign:'middle' }}/>Save Matrix
          </button>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'rgba(0,0,0,0.03)' }}>
                <th style={{ padding:'10px 16px', fontSize:11, color:'#64748b', fontWeight:700, textAlign:'left', textTransform:'uppercase', letterSpacing:'0.5px', minWidth:140 }}>Permission</th>
                {ALL_ROLES.map(r => (
                  <th key={r.key} style={{ padding:'10px 12px', fontSize:11, color:r.color, fontWeight:700, textAlign:'center', textTransform:'uppercase', letterSpacing:'0.5px' }}>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                      <r.icon size={16}/>
                      <span>{r.label.split(' ')[0]}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ALL_PERMISSIONS.map((perm, pi) => (
                <tr key={perm.key} style={{ borderBottom:'1px solid rgba(0,0,0,0.04)', background:pi%2===0?'transparent':'rgba(0,0,0,0.01)' }}>
                  <td style={{ padding:'11px 16px', fontSize:13, fontWeight:600, color:'#334155' }}>{perm.label}</td>
                  {ALL_ROLES.map(role => {
                    const active = (matrix[role.key]||[]).includes(perm.key);
                    return (
                      <td key={role.key} style={{ padding:'11px 12px', textAlign:'center' }}>
                        <button onClick={() => { togglePerm(role.key, perm.key); toast(`${active?'Removed':'Added'} ${perm.label} for ${role.label}`,{icon:active?'🚫':'✅'}); }}
                          style={{ width:32, height:32, borderRadius:8, border:`1px solid ${active?'rgba(16,185,129,0.3)':'rgba(239,68,68,0.2)'}`,
                            background:active?'rgba(16,185,129,0.1)':'rgba(239,68,68,0.06)', cursor:'pointer',
                            display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto' }}>
                          {active
                            ? <MdCheck size={16} color="#10b981"/>
                            : <MdClose size={14} color="#ef4444"/>
                          }
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ── User Role Assignment ── */}
      <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ delay:0.35 }} style={cardStyle}>
        <div style={{ marginBottom:16 }}>
          <h3 style={{ fontSize:15, fontWeight:800, color:'#1e293b' }}>User Role Assignment</h3>
          <p style={{ fontSize:12, color:'#94a3b8', marginTop:2 }}>Assign or change roles for individual users</p>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'rgba(0,0,0,0.02)' }}>
                {['User','Email','Current Role','Change Role','Action'].map(h => (
                  <th key={h} style={{ padding:'10px 14px', fontSize:11, color:'#64748b', fontWeight:700, textAlign:'left', textTransform:'uppercase', letterSpacing:'0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => {
                const roleInfo = ALL_ROLES.find(r=>r.key===u.role);
                return (
                  <motion.tr key={u.id} initial={{ opacity:0,x:-10 }} animate={{ opacity:1,x:0 }} transition={{ delay:0.38+i*0.04 }}
                    style={{ borderBottom:'1px solid rgba(0,0,0,0.04)' }}>
                    <td style={{ padding:'12px 14px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                        <div style={{ width:34, height:34, borderRadius:'50%', background:`linear-gradient(135deg,${roleInfo?.color||'#64748b'},${roleInfo?.color||'#64748b'}99)`,
                          display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'white' }}>
                          {u.name.split(' ').map(n=>n[0]).join('').slice(0,2)}
                        </div>
                        <span style={{ fontSize:13, fontWeight:700, color:'#1e293b' }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ padding:'12px 14px', fontSize:12, color:'#64748b' }}>{u.email}</td>
                    <td style={{ padding:'12px 14px' }}>
                      <span style={{ fontSize:11, fontWeight:700, color:roleInfo?.color||'#64748b',
                        background:`${roleInfo?.color||'#64748b'}15`, padding:'3px 10px', borderRadius:20 }}>
                        {roleInfo?.label||u.role}
                      </span>
                    </td>
                    <td style={{ padding:'12px 14px' }}>
                      <select value={u.role} onChange={e => setUsers(prev => prev.map(usr => usr.id===u.id ? {...usr,role:e.target.value} : usr))}
                        style={{ padding:'6px 10px', borderRadius:8, border:'1px solid rgba(0,0,0,0.1)', fontSize:12, color:'#475569', cursor:'pointer', background:'white' }}>
                        {ALL_ROLES.map(r => <option key={r.key} value={r.key}>{r.label}</option>)}
                      </select>
                    </td>
                    <td style={{ padding:'12px 14px' }}>
                      <button onClick={() => updateUserRole(u.id, u.role)}
                        style={{ padding:'6px 14px', borderRadius:8, border:'none', background:'linear-gradient(135deg,#4f46e5,#8b5cf6)', color:'white', fontSize:12, fontWeight:700, cursor:'pointer' }}>
                        Update Role
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      <AnimatePresence>{showAddModal && <AddRoleModal onClose={() => setShowAddModal(false)}/>}</AnimatePresence>
    </div>
  );
};

export default RoleManagement;
