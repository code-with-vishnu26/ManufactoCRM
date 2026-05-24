import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MdPerson, MdEmail, MdPhone, MdBusiness, MdWork, MdSchool, MdBarChart, MdReceipt, 
  MdEdit, MdShare, MdCloudUpload, MdAdd, MdLink, MdTrendingUp, MdHistory, 
  MdSmartToy, MdEvent, MdLock, MdLogout, MdDelete, MdCheck, MdClose, MdRefresh, 
  MdPictureAsPdf, MdOutlineFileDownload, MdArrowForward, MdFlashOn
} from 'react-icons/md';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const mockPerformanceData = [
  { month: 'Jan', revenue: 450000, leads: 12, won: 4 },
  { month: 'Feb', revenue: 600000, leads: 15, won: 6 },
  { month: 'Mar', revenue: 950000, leads: 22, won: 9 },
  { month: 'Apr', revenue: 800000, leads: 18, won: 7 },
  { month: 'May', revenue: 1450000, leads: 30, won: 14 }
];

const initialSkills = ['Enterprise Sales', 'Negotiation', 'CRM Systems', 'Lead Generation', 'AI Workflows'];

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // User Profile States
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Administrator',
    email: user?.email || 'admin@manufactocrm.com',
    phone: user?.phone || '+91 98765 43210',
    designation: user?.role === 'admin' ? 'Lead CRM Administrator' : 'Senior BDA Command Exec',
    department: user?.department || 'Enterprise Solutions',
    experience: '5+ Years',
    location: 'Mumbai, Maharashtra',
    coverImage: 'linear-gradient(135deg, #4f46e5 0%, #8b5cf6 50%, #ff4d6d 100%)',
    avatarLetter: user?.name ? user?.name[0].toUpperCase() : 'A',
    skills: initialSkills,
    socialLinks: {
      linkedin: 'https://linkedin.com/in/manufactocrm',
      twitter: 'https://twitter.com/manufactocrm',
      github: 'https://github.com/manufactocrm'
    }
  });

  // Action/Sync states
  const [syncing, setSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Modal Control States
  const [modals, setModals] = useState({
    editProfile: false,
    updatePhoneEmail: false,
    addSocial: false,
    addSkills: false,
    meeting: false,
    aiPitch: false,
    email: false,
    activities: false,
    deleteAccount: false,
    upgrade: false
  });

  // Modal Inputs & Temporary states
  const [editForm, setEditForm] = useState({ ...profileData });
  const [phoneEmailForm, setPhoneEmailForm] = useState({ email: profileData.email, phone: profileData.phone });
  const [socialForm, setSocialForm] = useState({ ...profileData.socialLinks });
  const [newSkill, setNewSkill] = useState('');
  const [meetingForm, setMeetingForm] = useState({ client: '', date: '', time: '', type: 'Video Conference' });
  const [aiPitchForm, setAiPitchForm] = useState({ lead: 'Tata Motors', tone: 'Professional', pitchResult: '', generating: false });
  const [emailForm, setEmailForm] = useState({ to: '', subject: '', body: '', sending: false });
  const [deleteConfirm, setDeleteConfirm] = useState('');
  
  // Custom user activities
  const [activitiesList, setActivitiesList] = useState([
    { id: 1, type: 'lead', title: 'Created new lead: Reliance Engineering', time: '10 mins ago', desc: 'Estimated deal value: ₹12,00,000' },
    { id: 2, type: 'meeting', title: 'Scheduled meeting with Sun Pharma', time: '2 hours ago', desc: 'Agenda: Technical product demonstration' },
    { id: 3, type: 'ai', title: 'Generated AI Sales Pitch for JSW Steel', time: 'Yesterday', desc: 'Saved draft pitch successfully to workspace' },
    { id: 4, type: 'email', title: 'Sent Follow-up Email to Tata Motors', time: '2 days ago', desc: 'Response status: Pending delivery' }
  ]);

  const toggleModal = (modalKey, val) => {
    setModals(prev => ({ ...prev, [modalKey]: val }));
    if (modalKey === 'editProfile' && val) setEditForm({ ...profileData });
    if (modalKey === 'updatePhoneEmail' && val) setPhoneEmailForm({ email: profileData.email, phone: profileData.phone });
    if (modalKey === 'addSocial' && val) setSocialForm({ ...profileData.socialLinks });
  };

  // Sync Data Handler
  const handleSyncData = () => {
    if (syncing) return;
    setSyncing(true);
    toast.loading('Synchronizing database nodes...', { id: 'sync-loader' });
    setTimeout(() => {
      setSyncing(false);
      toast.success('MERN database synced successfully! 🔄', { id: 'sync-loader' });
    }, 1200);
  };

  // Profile Edit Save
  const handleEditProfileSave = (e) => {
    e.preventDefault();
    setProfileData(prev => ({ ...prev, ...editForm }));
    toggleModal('editProfile', false);
    toast.success('Profile information saved!');
  };

  // Contact Info Save
  const handlePhoneEmailSave = (e) => {
    e.preventDefault();
    setProfileData(prev => ({ ...prev, ...phoneEmailForm }));
    toggleModal('updatePhoneEmail', false);
    toast.success('Contact information updated!');
  };

  // Cover & Avatar Upload Handlers
  const handleUploadCover = () => {
    toast.loading('Uploading cover image...', { id: 'cover-up' });
    setTimeout(() => {
      setProfileData(prev => ({
        ...prev,
        coverImage: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #4f46e5 100%)'
      }));
      toast.success('Cover image updated! 🎨', { id: 'cover-up' });
    }, 1000);
  };

  const handleChangeAvatar = () => {
    toast.loading('Selecting user avatar...', { id: 'avatar-up' });
    setTimeout(() => {
      toast.success('Avatar updated successfully! 👤', { id: 'avatar-up' });
    }, 800);
  };

  // Social Links Save
  const handleSocialSave = (e) => {
    e.preventDefault();
    setProfileData(prev => ({ ...prev, socialLinks: socialForm }));
    toggleModal('addSocial', false);
    toast.success('Social profiles linked successfully!');
  };

  // Skills handlers
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (profileData.skills.includes(newSkill.trim())) {
      toast.error('Skill already exists!');
      return;
    }
    setProfileData(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
    setNewSkill('');
    toast.success('Skill added! 🎯');
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfileData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skillToRemove) }));
    toast.success('Skill removed');
  };

  // Schedule Meeting
  const handleScheduleMeeting = (e) => {
    e.preventDefault();
    const newAct = {
      id: Date.now(),
      type: 'meeting',
      title: `Scheduled meeting with ${meetingForm.client}`,
      time: 'Just now',
      desc: `${meetingForm.type} on ${meetingForm.date} at ${meetingForm.time}`
    };
    setActivitiesList([newAct, ...activitiesList]);
    toggleModal('meeting', false);
    setMeetingForm({ client: '', date: '', time: '', type: 'Video Conference' });
    toast.success('Meeting scheduled & added to timeline! 📅');
  };

  // AI Sales Pitch Generator
  const handleGeneratePitch = () => {
    setAiPitchForm(prev => ({ ...prev, generating: true }));
    setTimeout(() => {
      const generatedText = `🎯 Enterprise Sales Pitch: ${aiPitchForm.lead}

Hello ${aiPitchForm.lead} Procurement Team,

I'm reaching out to introduce ManufactoCRM AI, our dedicated sales intelligence platform designed directly for mid-to-large scale manufacturing plants. We understand that tracking BDA follow-ups, machinery line leads, and raw materials pipelines requires high precision.

Key Value Points:
- Auto-sync MERN database connectivity.
- Dynamic drag-and-drop Kanban pipeline dashboards.
- Seamless, debounced smart autocomplete search.

We would love to schedule a quick 10-minute BDA walkthrough with your team to review. Let us know your availability.

Best regards,
${profileData.name}
${profileData.designation}`;

      setAiPitchForm(prev => ({ ...prev, pitchResult: generatedText, generating: false }));
      toast.success('AI Sales Pitch generated successfully! 🤖');
    }, 1500);
  };

  // Send Follow-up Email
  const handleSendEmail = (e) => {
    e.preventDefault();
    setEmailForm(prev => ({ ...prev, sending: true }));
    setTimeout(() => {
      const newAct = {
        id: Date.now(),
        type: 'email',
        title: `Sent Follow-up Email to ${emailForm.to}`,
        time: 'Just now',
        desc: `Subject: ${emailForm.subject}`
      };
      setActivitiesList([newAct, ...activitiesList]);
      setEmailForm({ to: '', subject: '', body: '', sending: false });
      toggleModal('email', false);
      toast.success('Follow-up email dispatched! ✉️');
    }, 1200);
  };

  // Delete Account Confirmation
  const handleDeleteAccount = (e) => {
    e.preventDefault();
    if (deleteConfirm !== 'DELETE') {
      toast.error('Please type DELETE to confirm account deletion.');
      return;
    }
    toast.error('Deleting account permanently...');
    setTimeout(() => {
      logout();
      navigate('/login');
      toast.success('Account deleted.');
    }, 2000);
  };

  // Export CSV Helper
  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\n"
      + `User Name,${profileData.name}\n`
      + `Designation,${profileData.designation}\n`
      + `Department,${profileData.department}\n`
      + "Total Revenue,₹42.5L\n"
      + "Assigned Leads,112\n"
      + "Conversion Rate,76%\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${profileData.name.replace(/\s+/g, '_')}_Performance_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Performance CSV downloaded! 📊');
  };

  // Download PDF Report Simulator
  const handleDownloadPDF = () => {
    toast.loading('Generating PDF binary stream...', { id: 'pdf-load' });
    setTimeout(() => {
      const textReport = `===========================================
      MANUFACTOCRM AI — USER PERFORMANCE REPORT
===========================================
User: ${profileData.name}
Role: ${profileData.designation}
Dept: ${profileData.department}
Date: ${new Date().toLocaleDateString()}
-------------------------------------------
Total Closed Revenue:  ₹42,50,000
Total Assigned Leads:  112 Leads
Overall Conversion:    76.2%
Completed CRM Tasks:   84 Tasks
-------------------------------------------
Generated automatically by BDA Sales Command.
===========================================`;

      const element = document.createElement("a");
      const file = new Blob([textReport], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${profileData.name.replace(/\s+/g, '_')}_CRM_Performance.pdf`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success('Performance PDF downloaded! 📄', { id: 'pdf-load' });
    }, 1000);
  };

  // Create New Lead helper redirect
  const handleCreateNewLeadClick = () => {
    navigate('/leads');
    setTimeout(() => {
      toast.success('Opening lead addition dialog... Click "New Lead"!');
    }, 500);
  };

  // Share profile copies mock link to clipboard
  const handleShareProfile = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Profile workspace URL copied to clipboard! 🔗');
  };

  return (
    <div style={{ paddingBottom: 50 }}>
      {/* Top Banner / Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1e293b', marginBottom: 4 }}>User Workspace Profile</h2>
          <p style={{ fontSize: 13, color: '#64748b' }}>Configure credentials, professional insights, and BDA targets</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleSyncData} className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
            <MdRefresh className={syncing ? 'animate-spin-slow' : ''} size={16} />
            {syncing ? 'Syncing...' : 'Sync Data'}
          </button>
          <button onClick={() => toggleModal('upgrade', true)} className="btn-primary" style={{ padding: '8px 16px', fontSize: 13, background: 'linear-gradient(135deg, #ea580c, #ff4d6d)', border: 'none' }}>
            <MdFlashOn size={16} /> Upgrade Plan
          </button>
        </div>
      </div>

      {/* Main Cover Banner & Header Card */}
      <div className="glass-card" style={{ overflow: 'hidden', marginBottom: 24 }}>
        {/* Cover Background */}
        <div style={{ 
          height: 180, 
          background: profileData.coverImage, 
          position: 'relative', 
          transition: 'background 0.5s ease' 
        }}>
          <button 
            onClick={handleUploadCover}
            style={{ 
              position: 'absolute', bottom: 12, right: 12, 
              background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', 
              color: 'white', padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, 
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, backdropFilter: 'blur(4px)' 
            }}
          >
            <MdCloudUpload size={14} /> Upload Cover Image
          </button>
        </div>

        {/* Profile Card Header Info */}
        <div style={{ padding: '24px 32px', position: 'relative', background: '#ffffff' }}>
          {/* Large Avatar container overlapping cover */}
          <div style={{ 
            position: 'absolute', top: -60, left: 32, 
            width: 110, height: 110, borderRadius: '50%', 
            background: user?.profilePic ? `url(${user.profilePic}) center/cover no-repeat` : 'linear-gradient(135deg, #4f46e5, #8b5cf6)', 
            border: '5px solid #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', 
            fontSize: 40, fontWeight: 800, color: 'white', 
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)', overflow: 'hidden'
          }}>
            {!user?.profilePic && profileData.avatarLetter}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingLeft: 130, minHeight: 60 }}>
            <div>
              <h3 style={{ fontSize: 22, fontWeight: 800, color: '#1e293b', marginBottom: 2 }}>{profileData.name}</h3>
              <p style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>
                {profileData.designation} · <span style={{ color: '#4f46e5' }}>{profileData.department}</span>
              </p>
              <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>📌 {profileData.location}</p>
            </div>
            
            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                onClick={() => toggleModal('editProfile', true)} 
                className="btn-secondary" 
                style={{ padding: '8px 14px', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <MdEdit size={15} /> Edit Profile
              </button>
              <button 
                onClick={handleChangeAvatar} 
                className="btn-secondary" 
                style={{ padding: '8px 14px', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <MdPerson size={15} /> Change Avatar
              </button>
              <button 
                onClick={handleShareProfile} 
                className="btn-secondary" 
                style={{ padding: '8px 14px', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <MdShare size={15} /> Share Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
        {/* Left Side: Contact, Professional info & controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Contact Information */}
          <div className="glass-card" style={{ padding: 22, background: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Contact Information</h4>
              <button onClick={() => toggleModal('updatePhoneEmail', true)} style={{ border: 'none', background: 'transparent', color: '#4f46e5', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Update</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <MdEmail size={16} color="#4f46e5" />
                <div>
                  <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>Work Email</div>
                  <div style={{ fontSize: 13, color: '#1e293b', fontWeight: 600 }}>{profileData.email}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <MdPhone size={16} color="#10b981" />
                <div>
                  <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>Phone Number</div>
                  <div style={{ fontSize: 13, color: '#1e293b', fontWeight: 600 }}>{profileData.phone}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <MdLink size={16} color="#e11d48" />
                <div>
                  <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>Social Profiles</div>
                  <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                    <a href={profileData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#4f46e5', fontWeight: 700, textDecoration: 'none' }}>LinkedIn</a>
                    <a href={profileData.socialLinks.twitter} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#4f46e5', fontWeight: 700, textDecoration: 'none' }}>Twitter</a>
                    <a href={profileData.socialLinks.github} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#4f46e5', fontWeight: 700, textDecoration: 'none' }}>GitHub</a>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => toggleModal('addSocial', true)} 
              className="btn-secondary" 
              style={{ width: '100%', padding: '8px 12px', fontSize: 12, marginTop: 16, justifyContent: 'center' }}
            >
              <MdLink size={14} /> Link Social Profiles
            </button>
          </div>

          {/* Professional Information */}
          <div className="glass-card" style={{ padding: 22, background: '#ffffff' }}>
            <h4 style={{ fontSize: 14, fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 }}>Professional Info</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>Designation</span>
                <span style={{ fontSize: 12, color: '#1e293b', fontWeight: 700 }}>{profileData.designation}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>Department</span>
                <span style={{ fontSize: 12, color: '#1e293b', fontWeight: 700 }}>{profileData.department}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>Experience Level</span>
                <span style={{ fontSize: 12, color: '#1e293b', fontWeight: 700 }}>{profileData.experience}</span>
              </div>
            </div>

            {/* Skills tags list */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Skills Tags</span>
                <button onClick={() => toggleModal('addSkills', true)} style={{ border: 'none', background: 'transparent', color: '#4f46e5', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
                  <MdAdd size={12} /> Add
                </button>
              </div>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {profileData.skills.map((skill) => (
                  <span 
                    key={skill}
                    style={{ 
                      fontSize: 10, fontWeight: 700, color: '#4f46e5', 
                      background: 'rgba(79, 70, 229, 0.08)', padding: '4px 10px', 
                      borderRadius: 100, display: 'inline-flex', alignItems: 'center', gap: 4 
                    }}
                  >
                    {skill}
                    <button 
                      onClick={() => handleRemoveSkill(skill)}
                      style={{ border: 'none', background: 'transparent', color: '#4f46e5', cursor: 'pointer', fontSize: 9, fontWeight: 800, padding: '0 2px' }}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Account Controls */}
          <div className="glass-card" style={{ padding: 22, background: '#ffffff' }}>
            <h4 style={{ fontSize: 14, fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 }}>Account Controls</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button onClick={() => navigate('/settings')} className="btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', fontSize: 13 }}>
                <MdLock size={16} color="#64748b" /> Change Password
              </button>
              <button 
                onClick={() => {
                  logout();
                  toast.success('Logged out successfully');
                  navigate('/login');
                }} 
                className="btn-secondary" 
                style={{ width: '100%', justifyContent: 'flex-start', fontSize: 13 }}
              >
                <MdLogout size={16} color="#ea580c" /> Logout Workspace
              </button>
              <button 
                onClick={() => toggleModal('deleteAccount', true)} 
                className="btn-secondary" 
                style={{ width: '100%', justifyContent: 'flex-start', fontSize: 13, color: '#ef4444', border: '1px solid rgba(239,68,68,0.15)', background: 'rgba(239,68,68,0.02)' }}
              >
                <MdDelete size={16} /> Delete Account permanently
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Performance, Recent Activity & AI Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Performance Section */}
          <div className="glass-card" style={{ padding: 24, background: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Performance Analytics</h4>
                <p style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>Closed Revenue closed in current quarter</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleDownloadPDF} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }}>
                  <MdPictureAsPdf size={14} /> Download PDF
                </button>
                <button onClick={handleExportCSV} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }}>
                  <MdOutlineFileDownload size={14} /> Export CSV
                </button>
                <button onClick={() => navigate('/analytics')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12, color: '#4f46e5', border: '1px solid rgba(79,70,229,0.15)' }}>
                  <MdTrendingUp size={14} /> View Analytics
                </button>
              </div>
            </div>

            {/* KPI metric blocks */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
              <div style={{ padding: 14, background: '#f8fafc', borderRadius: 12, border: '1px solid rgba(0,0,0,0.03)' }}>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Revenue closed</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#10b981', marginTop: 4 }}>₹42.5 Lakhs</div>
              </div>
              <div style={{ padding: 14, background: '#f8fafc', borderRadius: 12, border: '1px solid rgba(0,0,0,0.03)' }}>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Assigned Leads</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#4f46e5', marginTop: 4 }}>112 Leads</div>
              </div>
              <div style={{ padding: 14, background: '#f8fafc', borderRadius: 12, border: '1px solid rgba(0,0,0,0.03)' }}>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>Conversion Rate</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#ea580c', marginTop: 4 }}>76.2%</div>
              </div>
            </div>

            {/* Recharts Area Chart */}
            <div style={{ height: 180, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockPerformanceData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: '#ffffff', borderRadius: 10, border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 8px 20px rgba(0,0,0,0.04)', fontSize: 11 }} />
                  <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue (₹)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
              <button 
                onClick={() => {
                  navigate('/leads');
                  toast.success('Displaying your currently assigned leads!');
                }}
                className="btn-secondary" 
                style={{ padding: '6px 12px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5 }}
              >
                <MdArrowForward size={14} /> View Assigned Leads
              </button>
            </div>
          </div>

          {/* Quick Actions & AI Helpers */}
          <div className="glass-card" style={{ padding: 24, background: '#ffffff' }}>
            <h4 style={{ fontSize: 14, fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 }}>Quick CRM & AI Actions</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button onClick={handleCreateNewLeadClick} className="btn-secondary" style={{ justifyContent: 'flex-start', fontSize: 13 }}>
                <MdAdd size={16} color="#4f46e5" /> Create New Lead
              </button>
              <button onClick={() => toggleModal('meeting', true)} className="btn-secondary" style={{ justifyContent: 'flex-start', fontSize: 13 }}>
                <MdEvent size={16} color="#10b981" /> Schedule Meeting
              </button>
              <button onClick={() => toggleModal('aiPitch', true)} className="btn-secondary" style={{ justifyContent: 'flex-start', fontSize: 13, background: 'rgba(79,70,229,0.02)', border: '1px solid rgba(79,70,229,0.15)' }}>
                <MdSmartToy size={16} color="#8b5cf6" /> Generate AI Sales Pitch
              </button>
              <button onClick={() => toggleModal('email', true)} className="btn-secondary" style={{ justifyContent: 'flex-start', fontSize: 13 }}>
                <MdEmail size={16} color="#e11d48" /> Send Follow-up Email
              </button>
            </div>
          </div>

          {/* Recent Activity Timeline */}
          <div className="glass-card" style={{ padding: 24, background: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', letterSpacing: 0.5 }}>Activity timeline</h4>
              <button onClick={() => toggleModal('activities', true)} style={{ border: 'none', background: 'transparent', color: '#4f46e5', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>View All</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {activitiesList.slice(0, 3).map((act) => (
                <div key={act.id} style={{ display: 'flex', gap: 12 }}>
                  <div style={{ 
                    width: 8, height: 8, borderRadius: '50%', 
                    background: act.type === 'meeting' ? '#10b981' : act.type === 'ai' ? '#8b5cf6' : act.type === 'email' ? '#e11d48' : '#4f46e5', 
                    marginTop: 5, flexShrink: 0 
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{act.title}</span>
                      <span style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600 }}>{act.time}</span>
                    </div>
                    {act.desc && <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{act.desc}</div>}
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{ display: 'flex', gap: 8, marginTop: 20, borderTop: '1px solid rgba(0,0,0,0.03)', paddingTop: 14 }}>
              <button onClick={() => toast.success('Tasks Checklist drawer opened! 📝')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12, flex: 1, justifyContent: 'center' }}>
                View Recent Tasks
              </button>
              <button onClick={() => toast.success('Upcoming follow-up alerts synced! 🔔')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12, flex: 1, justifyContent: 'center' }}>
                View Follow-ups
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          INTERACTIVE MODALS
      ======================================================== */}
      <AnimatePresence>
        {/* EDIT PROFILE MODAL */}
        {modals.editProfile && (
          <div className="modal-overlay" onClick={() => toggleModal('editProfile', false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card" 
              style={{ width: '100%', maxWidth: 450, padding: 24, background: '#ffffff' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1e293b' }}>Edit Profile Information</h3>
                <button onClick={() => toggleModal('editProfile', false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}><MdClose size={18} /></button>
              </div>
              <form onSubmit={handleEditProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 5 }}>Full Name</label>
                  <input 
                    type="text" 
                    className="input-dark" 
                    value={editForm.name} 
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })} 
                    required 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 5 }}>Designation</label>
                  <input 
                    type="text" 
                    className="input-dark" 
                    value={editForm.designation} 
                    onChange={e => setEditForm({ ...editForm, designation: e.target.value })} 
                    required 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 5 }}>Department</label>
                  <input 
                    type="text" 
                    className="input-dark" 
                    value={editForm.department} 
                    onChange={e => setEditForm({ ...editForm, department: e.target.value })} 
                    required 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 5 }}>Location</label>
                  <input 
                    type="text" 
                    className="input-dark" 
                    value={editForm.location} 
                    onChange={e => setEditForm({ ...editForm, location: e.target.value })} 
                    required 
                  />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
                  <button type="button" onClick={() => toggleModal('editProfile', false)} className="btn-secondary" style={{ padding: '8px 16px' }}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ padding: '8px 16px' }}>Save Changes</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* UPDATE PHONE & EMAIL MODAL */}
        {modals.updatePhoneEmail && (
          <div className="modal-overlay" onClick={() => toggleModal('updatePhoneEmail', false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card" 
              style={{ width: '100%', maxWidth: 400, padding: 24, background: '#ffffff' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#1e293b' }}>Update Contact Channels</h3>
                <button onClick={() => toggleModal('updatePhoneEmail', false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}><MdClose size={18} /></button>
              </div>
              <form onSubmit={handlePhoneEmailSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 5 }}>Work Email Address</label>
                  <input 
                    type="email" 
                    className="input-dark" 
                    value={phoneEmailForm.email} 
                    onChange={e => setPhoneEmailForm({ ...phoneEmailForm, email: e.target.value })} 
                    required 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 5 }}>Phone Number</label>
                  <input 
                    type="text" 
                    className="input-dark" 
                    value={phoneEmailForm.phone} 
                    onChange={e => setPhoneEmailForm({ ...phoneEmailForm, phone: e.target.value })} 
                    required 
                  />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 10 }}>
                  <button type="button" onClick={() => toggleModal('updatePhoneEmail', false)} className="btn-secondary" style={{ padding: '8px 16px' }}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ padding: '8px 16px' }}>Save Changes</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* LINK SOCIAL PROFILES MODAL */}
        {modals.addSocial && (
          <div className="modal-overlay" onClick={() => toggleModal('addSocial', false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card" 
              style={{ width: '100%', maxWidth: 400, padding: 24, background: '#ffffff' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#1e293b' }}>Link Social Profiles</h3>
                <button onClick={() => toggleModal('addSocial', false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}><MdClose size={18} /></button>
              </div>
              <form onSubmit={handleSocialSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 5 }}>LinkedIn Profile URL</label>
                  <input 
                    type="url" 
                    className="input-dark" 
                    value={socialForm.linkedin} 
                    onChange={e => setSocialForm({ ...socialForm, linkedin: e.target.value })} 
                    required 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 5 }}>Twitter / X URL</label>
                  <input 
                    type="url" 
                    className="input-dark" 
                    value={socialForm.twitter} 
                    onChange={e => setSocialForm({ ...socialForm, twitter: e.target.value })} 
                    required 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 5 }}>GitHub Profile URL</label>
                  <input 
                    type="url" 
                    className="input-dark" 
                    value={socialForm.github} 
                    onChange={e => setSocialForm({ ...socialForm, github: e.target.value })} 
                    required 
                  />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 10 }}>
                  <button type="button" onClick={() => toggleModal('addSocial', false)} className="btn-secondary" style={{ padding: '8px 16px' }}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ padding: '8px 16px' }}>Save Changes</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* ADD SKILLS TAGS MODAL */}
        {modals.addSkills && (
          <div className="modal-overlay" onClick={() => toggleModal('addSkills', false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card" 
              style={{ width: '100%', maxWidth: 400, padding: 24, background: '#ffffff' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#1e293b' }}>Add Professional Skills</h3>
                <button onClick={() => toggleModal('addSkills', false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}><MdClose size={18} /></button>
              </div>
              <form onSubmit={handleAddSkill}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                  <input 
                    type="text" 
                    className="input-dark" 
                    placeholder="e.g. Contract Closing, Sales Strategy" 
                    value={newSkill} 
                    onChange={e => setNewSkill(e.target.value)} 
                    required 
                  />
                  <button type="submit" className="btn-primary" style={{ padding: '10px 16px' }}><MdAdd size={16} /> Add</button>
                </div>
              </form>
              <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 10, fontWeight: 600 }}>Suggested tags:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {['Steel Contracting', 'Price Negotiation', 'Supply Chain', 'API Mapping', 'Analytical Reports'].map((s) => (
                  <button 
                    key={s}
                    onClick={() => {
                      if (profileData.skills.includes(s)) return toast.error('Already added!');
                      setProfileData(prev => ({ ...prev, skills: [...prev.skills, s] }));
                      toast.success(`Skill "${s}" added!`);
                    }}
                    style={{ 
                      fontSize: 10, padding: '5px 10px', borderRadius: 100, border: '1px solid rgba(0,0,0,0.06)', 
                      background: '#f8fafc', color: '#64748b', cursor: 'pointer', fontWeight: 600 
                    }}
                  >
                    + {s}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* SCHEDULE MEETING MODAL */}
        {modals.meeting && (
          <div className="modal-overlay" onClick={() => toggleModal('meeting', false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card" 
              style={{ width: '100%', maxWidth: 420, padding: 24, background: '#ffffff' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#1e293b' }}>Schedule Client Meeting</h3>
                <button onClick={() => toggleModal('meeting', false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}><MdClose size={18} /></button>
              </div>
              <form onSubmit={handleScheduleMeeting} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 5 }}>Client/Company Name</label>
                  <input 
                    type="text" 
                    className="input-dark" 
                    placeholder="e.g. Tata Motors Ltd" 
                    value={meetingForm.client} 
                    onChange={e => setMeetingForm({ ...meetingForm, client: e.target.value })} 
                    required 
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 5 }}>Meeting Date</label>
                    <input 
                      type="date" 
                      className="input-dark" 
                      value={meetingForm.date} 
                      onChange={e => setMeetingForm({ ...meetingForm, date: e.target.value })} 
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 5 }}>Meeting Time</label>
                    <input 
                      type="time" 
                      className="input-dark" 
                      value={meetingForm.time} 
                      onChange={e => setMeetingForm({ ...meetingForm, time: e.target.value })} 
                      required 
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 5 }}>Conference Type</label>
                  <select 
                    className="input-dark"
                    value={meetingForm.type}
                    onChange={e => setMeetingForm({ ...meetingForm, type: e.target.value })}
                  >
                    <option>Video Conference</option>
                    <option>In-Person Meeting</option>
                    <option>Direct Telephone Call</option>
                  </select>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
                  <button type="button" onClick={() => toggleModal('meeting', false)} className="btn-secondary" style={{ padding: '8px 16px' }}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ padding: '8px 16px' }}>Schedule Meeting</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* AI SALES PITCH GENERATOR MODAL */}
        {modals.aiPitch && (
          <div className="modal-overlay" onClick={() => toggleModal('aiPitch', false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card" 
              style={{ width: '100%', maxWidth: 500, padding: 24, background: '#ffffff' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MdSmartToy color="#4f46e5" size={20} /> AI Sales Pitch Assistant
                </h3>
                <button onClick={() => toggleModal('aiPitch', false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}><MdClose size={18} /></button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 5 }}>Select Target Lead</label>
                    <select 
                      className="input-dark"
                      value={aiPitchForm.lead}
                      onChange={e => setAiPitchForm({ ...aiPitchForm, lead: e.target.value })}
                    >
                      <option>Tata Motors</option>
                      <option>Sun Pharma</option>
                      <option>JSW Steel</option>
                      <option>Reliance Engineering</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 5 }}>Select Pitch Tone</label>
                    <select 
                      className="input-dark"
                      value={aiPitchForm.tone}
                      onChange={e => setAiPitchForm({ ...aiPitchForm, tone: e.target.value })}
                    >
                      <option>Professional</option>
                      <option>Assertive / Closing</option>
                      <option>Technical Value-Driven</option>
                      <option>Brief / Elevator Pitch</option>
                    </select>
                  </div>
                </div>
                
                <button 
                  onClick={handleGeneratePitch} 
                  disabled={aiPitchForm.generating}
                  className="btn-primary" 
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <MdSmartToy size={16} /> 
                  {aiPitchForm.generating ? 'Generating with AI...' : 'Generate with AI'}
                </button>

                {aiPitchForm.pitchResult && (
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 5 }}>Generated Pitch Output</label>
                    <textarea 
                      readOnly 
                      className="input-dark" 
                      rows={8} 
                      style={{ fontSize: 12, resize: 'none', background: '#f8fafc', lineHeight: 1.6 }}
                      value={aiPitchForm.pitchResult}
                    />
                    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(aiPitchForm.pitchResult);
                          toast.success('Pitch text copied to clipboard! 📋');
                        }}
                        className="btn-secondary" 
                        style={{ flex: 1, padding: '8px 12px', fontSize: 12, justifyContent: 'center' }}
                      >
                        Copy Pitch
                      </button>
                      <button 
                        onClick={() => {
                          const element = document.createElement("a");
                          const file = new Blob([aiPitchForm.pitchResult], { type: 'text/plain' });
                          element.href = URL.createObjectURL(file);
                          element.download = `${aiPitchForm.lead.replace(/\s+/g, '_')}_AI_Pitch.txt`;
                          document.body.appendChild(element);
                          element.click();
                          document.body.removeChild(element);
                          toast.success('Pitch text exported! 📄');
                        }}
                        className="btn-secondary" 
                        style={{ flex: 1, padding: '8px 12px', fontSize: 12, justifyContent: 'center' }}
                      >
                        Export Text
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* SEND FOLLOW-UP EMAIL MODAL */}
        {modals.email && (
          <div className="modal-overlay" onClick={() => toggleModal('email', false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card" 
              style={{ width: '100%', maxWidth: 480, padding: 24, background: '#ffffff' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MdEmail color="#e11d48" size={18} /> Compose Follow-up Email
                </h3>
                <button onClick={() => toggleModal('email', false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}><MdClose size={18} /></button>
              </div>
              <form onSubmit={handleSendEmail} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 5 }}>To (Client/Lead Email)</label>
                  <input 
                    type="email" 
                    className="input-dark" 
                    placeholder="client@company.com" 
                    value={emailForm.to} 
                    onChange={e => setEmailForm({ ...emailForm, to: e.target.value })} 
                    required 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 5 }}>Email Subject</label>
                  <input 
                    type="text" 
                    className="input-dark" 
                    placeholder="Follow-up on ManufactoCRM AI demonstration" 
                    value={emailForm.subject} 
                    onChange={e => setEmailForm({ ...emailForm, subject: e.target.value })} 
                    required 
                  />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>Email Body</label>
                    <button 
                      type="button"
                      onClick={() => {
                        setEmailForm(prev => ({
                          ...prev,
                          body: `Dear Client,\n\nI hope this email finds you well. I am following up on our recent demonstration of ManufactoCRM AI. Our technical integration team is fully equipped to review your database schemas.\n\nPlease let me know if we can schedule a brief video sync this week.\n\nBest regards,\n${profileData.name}\n${profileData.designation}`
                        }));
                        toast.success('AI Email draft applied! 🤖');
                      }}
                      style={{ border: 'none', background: 'transparent', color: '#4f46e5', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}
                    >
                      🪄 Draft with AI
                    </button>
                  </div>
                  <textarea 
                    className="input-dark" 
                    rows={6} 
                    style={{ fontSize: 12, resize: 'none', lineHeight: 1.5 }}
                    placeholder="Write email contents here or use AI to draft..."
                    value={emailForm.body}
                    onChange={e => setEmailForm({ ...emailForm, body: e.target.value })}
                    required 
                  />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                  <button type="button" onClick={() => toggleModal('email', false)} className="btn-secondary" style={{ padding: '8px 16px' }}>Cancel</button>
                  <button type="submit" disabled={emailForm.sending} className="btn-primary" style={{ padding: '8px 16px', background: '#e11d48' }}>
                    {emailForm.sending ? 'Sending...' : 'Send Email'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* TIMELINE ACTIVITIES MODAL */}
        {modals.activities && (
          <div className="modal-overlay" onClick={() => toggleModal('activities', false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card" 
              style={{ width: '100%', maxWidth: 450, padding: 24, background: '#ffffff' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MdHistory color="#4f46e5" size={20} /> Complete BDA Activity Logs
                </h3>
                <button onClick={() => toggleModal('activities', false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}><MdClose size={18} /></button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 300, overflowY: 'auto', paddingRight: 5 }}>
                {activitiesList.map((act) => (
                  <div key={act.id} style={{ display: 'flex', gap: 12, paddingBottom: 12, borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                    <div style={{ 
                      width: 8, height: 8, borderRadius: '50%', 
                      background: act.type === 'meeting' ? '#10b981' : act.type === 'ai' ? '#8b5cf6' : act.type === 'email' ? '#e11d48' : '#4f46e5', 
                      marginTop: 5, flexShrink: 0 
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>{act.title}</span>
                        <span style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600 }}>{act.time}</span>
                      </div>
                      {act.desc && <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{act.desc}</div>}
                    </div>
                  </div>
                ))}
              </div>
              
              <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
                <button 
                  onClick={() => {
                    setActivitiesList([]);
                    toast.success('User activity logs cleared successfully!');
                  }}
                  className="btn-secondary" 
                  style={{ flex: 1, padding: '8px 12px', color: '#ef4444', borderColor: 'rgba(239,68,68,0.1)' }}
                >
                  Clear Activity Logs
                </button>
                <button onClick={() => toggleModal('activities', false)} className="btn-secondary" style={{ flex: 1, padding: '8px 12px' }}>
                  Close Logs
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* DELETE ACCOUNT MODAL */}
        {modals.deleteAccount && (
          <div className="modal-overlay" onClick={() => toggleModal('deleteAccount', false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card" 
              style={{ width: '100%', maxWidth: 400, padding: 24, background: '#ffffff' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#ef4444' }}>Danger Zone: Delete Account</h3>
                <button onClick={() => toggleModal('deleteAccount', false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}><MdClose size={18} /></button>
              </div>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16, lineHeight: 1.5 }}>
                This action is irreversible. All of your assigned leads, logged activity records, and configured credentials will be permanently erased from the CRM nodes.
              </p>
              <form onSubmit={handleDeleteAccount} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>Type <strong style={{ color: '#ef4444' }}>DELETE</strong> to confirm:</label>
                  <input 
                    type="text" 
                    className="input-dark" 
                    placeholder="DELETE" 
                    value={deleteConfirm} 
                    onChange={e => setDeleteConfirm(e.target.value)} 
                    required 
                  />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                  <button type="button" onClick={() => toggleModal('deleteAccount', false)} className="btn-secondary" style={{ padding: '8px 16px' }}>Cancel</button>
                  <button 
                    type="submit" 
                    className="btn-danger" 
                    style={{ padding: '8px 16px', background: deleteConfirm === 'DELETE' ? '#ef4444' : '#fca5a5', color: 'white', border: 'none' }}
                    disabled={deleteConfirm !== 'DELETE'}
                  >
                    Delete Account Permanently
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* ENTERPRISE UPGRADE MODAL */}
        {modals.upgrade && (
          <div className="modal-overlay" onClick={() => toggleModal('upgrade', false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card" 
              style={{ width: '100%', maxWidth: 440, padding: 28, background: '#ffffff', textAlign: 'center' }}
            >
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => toggleModal('upgrade', false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}><MdClose size={18} /></button>
              </div>
              
              <div style={{ fontSize: 50, marginBottom: 12 }}>🚀</div>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: '#1e293b', marginBottom: 8 }}>Upgrade to Enterprise Plan</h3>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20, lineHeight: 1.5 }}>
                Unlock unlimited AI generation prompts, automatic leads assignment algorithms, and complete team pipeline analytics.
              </p>
              
              <div style={{ padding: 16, background: '#edf2ff', borderRadius: 12, border: '1px solid rgba(79,70,229,0.1)', marginBottom: 24 }}>
                <span style={{ fontSize: 11, color: '#4f46e5', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>SaaS Premium Plan</span>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#4f46e5', marginTop: 4 }}>₹4,999<span style={{ fontSize: 14, color: '#64748b', fontWeight: 500 }}> / month</span></div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button 
                  onClick={() => {
                    toast.success('Successfully upgraded to Enterprise Plan! 🎉 Welcome to unlimited BDA command.');
                    toggleModal('upgrade', false);
                  }}
                  className="btn-primary" 
                  style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #4f46e5, #8b5cf6)', padding: '12px' }}
                >
                  Upgrade Plan
                </button>
                <button onClick={() => toggleModal('upgrade', false)} className="btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
