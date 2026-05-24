import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MdPerson, MdLock, MdNotifications, MdPalette, MdSettings, 
  MdSmartToy, MdSecurity, MdAdminPanelSettings, MdSave, MdRefresh, 
  MdCloudUpload, MdArrowForward, MdVpnKey, MdOutlineFileDownload, 
  MdDelete, MdOutlineLanguage, MdPeopleOutline, MdAdd, MdArrowBack, MdClose
} from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, updateUser, logout } = useAuth();
  
  // File input ref for native picture upload
  const fileInputRef = useRef(null);
  const [profilePic, setProfilePic] = useState(user?.profilePic || null);
  
  // Tab states - 8 categories directly matching user requirements
  const [activeTab, setActiveTab] = useState('profile');

  // 1. Profile Settings States
  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'Administrator',
    username: user?.username || 'admin_manufacto',
    phone: user?.phone || '+91 98765 43210',
    department: user?.department || 'Enterprise Solutions',
    isEditing: false
  });

  // 2. Security Settings States
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [twoFactor, setTwoFactor] = useState(false);

  // 3. Notification Settings States
  const [notifForm, setNotifForm] = useState({
    email: true,
    push: true,
    leadReminders: true,
    meetingReminders: false
  });

  // 4. Appearance Settings States
  const [darkMode, setDarkMode] = useState(false);
  const [activeTheme, setActiveTheme] = useState('indigo'); // indigo, violet, emerald, rose
  const [sidebarCollapsedSim, setSidebarCollapsedSim] = useState(false);

  // 5. System Preferences States
  const [systemForm, setSystemForm] = useState({
    language: 'English (US)',
    timezone: 'Asia/Kolkata (GMT+05:30)',
    dateFormat: 'DD/MM/YYYY',
    autoSave: true
  });

  // 6. AI Settings States
  const [aiForm, setAiForm] = useState({
    aiSuggestions: true,
    aiEmailGenerator: true,
    aiAutoSummary: false
  });

  // 7. Data & Privacy States
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // 8. Admin Settings States
  const [adminUsersList, setAdminUsersList] = useState([
    { id: 1, name: 'Rahul Verma', email: 'rahul@manufactocrm.com', role: 'Sales Executive' },
    { id: 2, name: 'Sneha Joshi', email: 'sneha@manufactocrm.com', role: 'Sales Executive' },
    { id: 3, name: 'Vikram Singh', email: 'vikram@manufactocrm.com', role: 'Team Lead' }
  ]);
  const [newEmployeeForm, setNewEmployeeForm] = useState({ name: '', email: '', role: 'Sales Executive' });
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);

  const [saving, setSaving] = useState(false);

  // Sync body theme class with darkMode toggle
  const toggleDarkMode = (val) => {
    setDarkMode(val);
    if (val) {
      document.body.classList.add('dark-theme-active');
      toast.success('Dark Mode simulated! 🌙 (Visual preferences saved)');
    } else {
      document.body.classList.remove('dark-theme-active');
      toast.success('Light Mode simulated! ☀️ (Visual preferences saved)');
    }
  };

  // --- SAVE HANDLERS ---

  // Profile Save
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      updateUser({ name: profileForm.name, phone: profileForm.phone, department: profileForm.department });
      setProfileForm(prev => ({ ...prev, isEditing: false }));
      toast.success('Profile changes saved successfully! 👤');
    }, 800);
  };

  // Password Save
  const handleSavePassword = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Security password updated! 🔑');
    }, 800);
  };

  // Notification Preferences Save
  const handleSaveNotifications = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('Notification preferences saved! 🔔');
    }, 600);
  };

  // System Preferences Save
  const handleSaveSystem = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('System preferences stored! ⚙️');
    }, 600);
  };

  // AI Preferences Save
  const handleSaveAI = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success('AI Model configurations saved! 🤖');
    }, 700);
  };

  // Invite/Add New Employee Save
  const handleAddEmployee = (e) => {
    e.preventDefault();
    const newEmp = {
      id: Date.now(),
      ...newEmployeeForm
    };
    setAdminUsersList([...adminUsersList, newEmp]);
    setShowAddEmployeeModal(false);
    setNewEmployeeForm({ name: '', email: '', role: 'Sales Executive' });
    toast.success(`Invite sent successfully to ${newEmp.email}! ✉️`);
  };

  // Upload Profile Picture - Natively triggers hidden file input click
  const handleUploadPic = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }

    toast.loading('Processing and updating profile photo...', { id: 'pic-up' });

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      setProfilePic(dataUrl);
      updateUser({ profilePic: dataUrl });
      toast.success('Avatar picture updated! 👤', { id: 'pic-up' });
    };
    reader.onerror = () => {
      toast.error('Failed to read selected image', { id: 'pic-up' });
    };
    reader.readAsDataURL(file);
  };

  // Enable 2FA handler
  const handleToggle2FA = () => {
    setTwoFactor(!twoFactor);
    toast.success(!twoFactor ? '2FA Enabled! QR Code dispatching.' : '2FA Disabled safely.');
  };

  // Logout from all devices
  const handleLogoutAllDevices = () => {
    toast.loading('Logging out sessions...', { id: 'session-out' });
    setTimeout(() => {
      toast.success('All other browser sessions terminated safely! 🔐', { id: 'session-out' });
    }, 1200);
  };

  // Reset Password (sends email link)
  const handleResetPasswordLink = () => {
    toast.success(`Password reset verification dispatched to ${user?.email || 'your email'}!`);
  };

  // Export Data JSON File
  const handleExportData = () => {
    const backupData = {
      user: user,
      timestamp: new Date().toISOString(),
      configuredSettings: {
        profileForm,
        notifForm,
        appearance: { darkMode, activeTheme },
        systemForm,
        aiForm
      }
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ManufactoCRM_Backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    toast.success('JSON Workspace Backup generated! 📥');
  };

  // Download Reports (System Activity)
  const handleDownloadReports = () => {
    const textData = `MANUFACTOCRM AI — CONFIGURATION AND AUDIT REPORT
Generated on: ${new Date().toLocaleString()}
User Node: ${profileForm.name}
Role Type: Admin Node
Status: SECURE / ONLINE`;

    const blob = new Blob([textData], { type: 'text/plain' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ManufactoCRM_Settings_Audit.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('System Audit report downloaded! 📊');
  };

  // Clear Activity Logs
  const handleClearLogs = () => {
    toast.success('Activity logs cleared from localStorage successfully!');
  };

  // Delete Account Action
  const handleDeleteAccountSubmit = (e) => {
    e.preventDefault();
    if (deleteConfirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm.');
      return;
    }
    toast.error('Deleting account permanently...');
    setTimeout(() => {
      logout();
      window.location.href = '/login';
    }, 2000);
  };

  const tabs = [
    { id: 'profile', icon: MdPerson, label: 'Profile Settings' },
    { id: 'security', icon: MdSecurity, label: 'Security' },
    { id: 'notifications', icon: MdNotifications, label: 'Notifications' },
    { id: 'appearance', icon: MdPalette, label: 'Appearance' },
    { id: 'system', icon: MdOutlineLanguage, label: 'System Preferences' },
    { id: 'ai', icon: MdSmartToy, label: 'AI Settings' },
    { id: 'privacy', icon: MdDelete, label: 'Data & Privacy' },
    { id: 'admin', icon: MdAdminPanelSettings, label: 'Admin Settings' }
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1e293b', marginBottom: 4 }}>System Settings</h2>
        <p style={{ fontSize: 13, color: '#64748b' }}>Configure your BDA workspace controls and system preferences</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 16 }}>
        {/* Left Side: Category tabs */}
        <div className="glass-card" style={{ padding: 10, height: 'fit-content', background: '#ffffff' }}>
          {tabs.map(({ id, icon: Icon, label }) => (
            <button 
              key={id} 
              onClick={() => setActiveTab(id)} 
              style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px', 
                borderRadius: 10, border: 'none', cursor: 'pointer', marginBottom: 2, fontSize: 13, fontWeight: 700,
                background: activeTab === id ? '#edf2ff' : 'transparent',
                color: activeTab === id ? '#4f46e5' : '#64748b', textAlign: 'left',
                transition: 'all 0.2s'
              }}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>

        {/* Right Side: Tab Contents wrapper */}
        <motion.div 
          key={activeTab} 
          initial={{ opacity: 0, x: 10 }} 
          animate={{ opacity: 1, x: 0 }} 
          className="glass-card" 
          style={{ padding: 28, background: '#ffffff', minHeight: 400 }}
        >
          {/* ==========================================
              1. PROFILE SETTINGS TAB
          ========================================== */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1e293b', marginBottom: 4 }}>Profile Settings</h3>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 22 }}>Update and configure your public profile details</p>

              {/* Hidden file input for native avatar upload */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                style={{ display: 'none' }} 
              />

              {/* Avatar section */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, padding: 16, background: '#f8fafc', borderRadius: 12, border: '1px solid rgba(0, 0, 0, 0.04)' }}>
                <div 
                  onClick={handleUploadPic}
                  style={{ 
                    width: 60, height: 60, borderRadius: '50%', 
                    background: profilePic ? `url(${profilePic}) center/cover no-repeat` : 'linear-gradient(135deg,#4f46e5,#8b5cf6)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    fontSize: 22, fontWeight: 700, color: 'white', 
                    boxShadow: '0 4px 14px rgba(79, 70, 229, 0.2)',
                    cursor: 'pointer', overflow: 'hidden', flexShrink: 0
                  }}
                >
                  {!profilePic && profileForm.name[0]?.toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#1e293b' }}>{profileForm.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>@{profileForm.username}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button type="button" onClick={handleUploadPic} className="btn-secondary" style={{ padding: '4px 10px', fontSize: 11, fontWeight: 700 }}>
                      <MdCloudUpload size={12} /> Update Picture
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setProfileForm(prev => ({ ...prev, isEditing: !prev.isEditing }))}
                      className="btn-secondary" 
                      style={{ padding: '4px 10px', fontSize: 11, fontWeight: 700, color: '#4f46e5', borderColor: 'rgba(79,70,229,0.1)' }}
                    >
                      {profileForm.isEditing ? 'Cancel Edit' : 'Edit Profile'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Input fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5, fontWeight: 600 }}>Full Name</label>
                  <input 
                    className="input-dark" 
                    value={profileForm.name} 
                    onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} 
                    disabled={!profileForm.isEditing} 
                    required 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5, fontWeight: 600 }}>Username</label>
                  <input 
                    className="input-dark" 
                    value={profileForm.username} 
                    onChange={e => setProfileForm({ ...profileForm, username: e.target.value })} 
                    disabled={!profileForm.isEditing} 
                    required 
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5, fontWeight: 600 }}>Work Phone</label>
                  <input 
                    className="input-dark" 
                    value={profileForm.phone} 
                    onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} 
                    disabled={!profileForm.isEditing} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5, fontWeight: 600 }}>Department</label>
                  <input 
                    className="input-dark" 
                    value={profileForm.department} 
                    onChange={e => setProfileForm({ ...profileForm, department: e.target.value })} 
                    disabled={!profileForm.isEditing} 
                  />
                </div>
              </div>

              {profileForm.isEditing && (
                <button type="submit" className="btn-primary" disabled={saving}>
                  <MdSave size={16} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </form>
          )}

          {/* ==========================================
              2. SECURITY TAB
          ========================================== */}
          {activeTab === 'security' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1e293b', marginBottom: 4 }}>Security Settings</h3>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 22 }}>Manage password, sessions, and multi-factor authorization</p>

              {/* Password change form */}
              <form onSubmit={handleSavePassword} style={{ marginBottom: 28, borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: 28 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5, fontWeight: 600 }}>Current Password</label>
                    <input 
                      type="password" 
                      className="input-dark" 
                      placeholder="••••••••" 
                      value={passwords.currentPassword} 
                      onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })} 
                      required 
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5, fontWeight: 600 }}>New Password</label>
                      <input 
                        type="password" 
                        className="input-dark" 
                        placeholder="••••••••" 
                        value={passwords.newPassword} 
                        onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })} 
                        required 
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5, fontWeight: 600 }}>Confirm New Password</label>
                      <input 
                        type="password" 
                        className="input-dark" 
                        placeholder="••••••••" 
                        value={passwords.confirmPassword} 
                        onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })} 
                        required 
                      />
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="submit" className="btn-primary" disabled={saving}>
                    <MdLock size={16} /> Change Password
                  </button>
                  <button type="button" onClick={handleResetPasswordLink} className="btn-secondary">
                    Reset Password Via Email
                  </button>
                </div>
              </form>

              {/* 2FA & sessions controls */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#1e293b', marginBottom: 2 }}>Two-Factor Authentication (2FA)</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>Provide an extra layer of defense on credentials checking</div>
                  </div>
                  <button 
                    onClick={handleToggle2FA} 
                    style={{
                      width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                      background: twoFactor ? '#4f46e5' : 'rgba(0,0,0,0.08)', transition: 'all 0.2s', position: 'relative'
                    }}
                  >
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: twoFactor ? '23px' : '3px', transition: 'left 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.15)' }} />
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid rgba(0,0,0,0.03)' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#1e293b', marginBottom: 2 }}>Logout From All Active Devices</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>Logout of other browsers, mobile clients, and laptop sessions</div>
                  </div>
                  <button onClick={handleLogoutAllDevices} className="btn-secondary" style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.15)', padding: '8px 16px', fontSize: 13 }}>
                    Logout From All Devices
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              3. NOTIFICATIONS TAB
          ========================================== */}
          {activeTab === 'notifications' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1e293b', marginBottom: 4 }}>Notification Settings</h3>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 22 }}>Define your reminder limits and BDA alerts</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                {[
                  { key: 'email', label: 'Enable Email Notifications', desc: 'Critical pipeline shifts are sent to work email' },
                  { key: 'push', label: 'Enable Push Notifications', desc: 'Browser banner triggers when leads status edits' },
                  { key: 'leadReminders', label: 'Lead Reminder Alerts', desc: 'Trigger auto-notifications on inactive assigned leads' },
                  { key: 'meetingReminders', label: 'Meeting Reminder Alerts', desc: 'Push alert 10 mins prior scheduled video calls' }
                ].map(({ key, label, desc }) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 2 }}>{label}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{desc}</div>
                    </div>
                    <button 
                      onClick={() => setNotifForm({ ...notifForm, [key]: !notifForm[key] })} 
                      style={{
                        width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                        background: notifForm[key] ? '#4f46e5' : 'rgba(0,0,0,0.08)', transition: 'all 0.2s', position: 'relative'
                      }}
                    >
                      <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: notifForm[key] ? '23px' : '3px', transition: 'left 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.15)' }} />
                    </button>
                  </div>
                ))}
              </div>

              <button onClick={handleSaveNotifications} className="btn-primary" disabled={saving}>
                <MdSave size={16} /> Save Notification Settings
              </button>
            </div>
          )}

          {/* ==========================================
              4. APPEARANCE TAB
          ========================================== */}
          {activeTab === 'appearance' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1e293b', marginBottom: 4 }}>Appearance Settings</h3>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 22 }}>Tailor colors, theme limits, and layout parameters</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Theme mode toggles */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#1e293b', marginBottom: 2 }}>Theme Display Mode</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>Choose between standard dark or modern light SaaS layouts</div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, background: '#f1f5f9', padding: 4, borderRadius: 8 }}>
                    <button 
                      onClick={() => toggleDarkMode(false)}
                      style={{ 
                        padding: '6px 12px', borderRadius: 6, border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                        background: !darkMode ? '#ffffff' : 'transparent', color: !darkMode ? '#4f46e5' : '#64748b',
                        boxShadow: !darkMode ? '0 2px 5px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s'
                      }}
                    >
                      Light Mode Toggle
                    </button>
                    <button 
                      onClick={() => toggleDarkMode(true)}
                      style={{ 
                        padding: '6px 12px', borderRadius: 6, border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                        background: darkMode ? '#ffffff' : 'transparent', color: darkMode ? '#4f46e5' : '#64748b',
                        boxShadow: darkMode ? '0 2px 5px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s'
                      }}
                    >
                      Dark Mode Toggle
                    </button>
                  </div>
                </div>

                {/* Theme Customizer Color Picker */}
                <div style={{ paddingTop: 14, borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#1e293b', marginBottom: 2 }}>Theme Customizer</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>Pick active brand color highlights for dashboard accents</div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {[
                      { id: 'indigo', color: '#4f46e5', label: 'Indigo Classic' },
                      { id: 'violet', color: '#8b5cf6', label: 'Violet Glow' },
                      { id: 'emerald', color: '#10b981', label: 'Emerald Mint' },
                      { id: 'rose', color: '#ff4d6d', label: 'Coral Rose' }
                    ].map((th) => (
                      <button
                        key={th.id}
                        onClick={() => {
                          setActiveTheme(th.id);
                          toast.success(`HIGHLIGHT ACCENT ACCESSED: ${th.label}`);
                        }}
                        style={{
                          padding: '8px 12px', borderRadius: 8, border: '1px solid',
                          borderColor: activeTheme === th.id ? th.color : 'rgba(0,0,0,0.08)',
                          background: activeTheme === th.id ? `${th.color}15` : '#ffffff',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s'
                        }}
                      >
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: th.color }} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: activeTheme === th.id ? th.color : '#64748b' }}>{th.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sidebar Collapse preview toggling */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#1e293b', marginBottom: 2 }}>Sidebar Collapse Toggle</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>Collapse sidebar layout by default on entering CRM</div>
                  </div>
                  <button 
                    onClick={() => {
                      setSidebarCollapsedSim(!sidebarCollapsedSim);
                      toast.success(sidebarCollapsedSim ? 'Sidebar expanded by default.' : 'Sidebar collapsed by default.');
                    }} 
                    style={{
                      width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                      background: sidebarCollapsedSim ? '#4f46e5' : 'rgba(0,0,0,0.08)', transition: 'all 0.2s', position: 'relative'
                    }}
                  >
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: sidebarCollapsedSim ? '23px' : '3px', transition: 'left 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.15)' }} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              5. SYSTEM PREFERENCES TAB
          ========================================== */}
          {activeTab === 'system' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1e293b', marginBottom: 4 }}>System Preferences</h3>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 22 }}>Configure local language nodes, date formats, and timezone limits</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5, fontWeight: 600 }}>Language Selection</label>
                    <select 
                      className="input-dark"
                      value={systemForm.language}
                      onChange={e => setSystemForm({ ...systemForm, language: e.target.value })}
                    >
                      <option>English (US)</option>
                      <option>Hindi (हिंदी)</option>
                      <option>Spanish (Español)</option>
                      <option>German (Deutsch)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5, fontWeight: 600 }}>Timezone Settings</label>
                    <select 
                      className="input-dark"
                      value={systemForm.timezone}
                      onChange={e => setSystemForm({ ...systemForm, timezone: e.target.value })}
                    >
                      <option>Asia/Kolkata (GMT+05:30)</option>
                      <option>America/New_York (EST/EDT)</option>
                      <option>Europe/London (GMT/BST)</option>
                      <option>Asia/Singapore (SGT)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#64748b', marginBottom: 5, fontWeight: 600 }}>Date Format Settings</label>
                    <select 
                      className="input-dark"
                      value={systemForm.dateFormat}
                      onChange={e => setSystemForm({ ...systemForm, dateFormat: e.target.value })}
                    >
                      <option>DD/MM/YYYY</option>
                      <option>MM/DD/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center', marginTop: 18 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>Auto-Save Toggle</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>Automatically save field revisions every 30s</div>
                    </div>
                    <button 
                      onClick={() => setSystemForm({ ...systemForm, autoSave: !systemForm.autoSave })} 
                      style={{
                        width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                        background: systemForm.autoSave ? '#4f46e5' : 'rgba(0,0,0,0.08)', transition: 'all 0.2s', position: 'relative'
                      }}
                    >
                      <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: systemForm.autoSave ? '23px' : '3px', transition: 'left 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.15)' }} />
                    </button>
                  </div>
                </div>
              </div>

              <button onClick={handleSaveSystem} className="btn-primary" disabled={saving}>
                <MdSave size={16} /> Save System Preferences
              </button>
            </div>
          )}

          {/* ==========================================
              6. AI SETTINGS TAB
          ========================================== */}
          {activeTab === 'ai' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1e293b', marginBottom: 4 }}>AI Settings</h3>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 22 }}>Customize system AI assistants and automated summaries</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                {[
                  { key: 'aiSuggestions', label: 'Enable AI Suggestions', desc: 'Real-time pitch suggestions on lead details timeline' },
                  { key: 'aiEmailGenerator', label: 'AI Email Generator Toggle', desc: 'Allows drafting client mail correspondence inside follow-up dialogs' },
                  { key: 'aiAutoSummary', label: 'AI Auto Summary Toggle', desc: 'Generate 1-sentence summaries for inactive cards automatically' }
                ].map(({ key, label, desc }) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 2 }}>{label}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>{desc}</div>
                    </div>
                    <button 
                      onClick={() => setAiForm({ ...aiForm, [key]: !aiForm[key] })} 
                      style={{
                        width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                        background: aiForm[key] ? '#4f46e5' : 'rgba(0,0,0,0.08)', transition: 'all 0.2s', position: 'relative'
                      }}
                    >
                      <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: aiForm[key] ? '23px' : '3px', transition: 'left 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.15)' }} />
                    </button>
                  </div>
                ))}
              </div>

              <button onClick={handleSaveAI} className="btn-primary" disabled={saving}>
                <MdSave size={16} /> Save AI Preferences
              </button>
            </div>
          )}

          {/* ==========================================
              7. DATA & PRIVACY TAB
          ========================================== */}
          {activeTab === 'privacy' && (
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1e293b', marginBottom: 4 }}>Data & Privacy</h3>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 22 }}>Export workspace nodes, backup parameters, and clear activity records</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 14, borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#1e293b', marginBottom: 2 }}>Export CRM Data</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>Download a complete JSON backup containing all configured settings</div>
                  </div>
                  <button onClick={handleExportData} className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }}>
                    Export Data
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6, paddingBottom: 14, borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#1e293b', marginBottom: 2 }}>Download System Audit Reports</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>Request a complete textual security audit of credential session keys</div>
                  </div>
                  <button onClick={handleDownloadReports} className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }}>
                    Download Reports
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6, paddingBottom: 14, borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#1e293b', marginBottom: 2 }}>Clear Local Activity Logs</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>Wipe CRM temporary operation logs clean from index DBs</div>
                  </div>
                  <button onClick={handleClearLogs} className="btn-secondary" style={{ padding: '8px 16px', fontSize: 13 }}>
                    Clear Activity Logs
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#ef4444', marginBottom: 2 }}>Delete Workspace Account</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>Delete your credentials permanently from Manufacto database nodes</div>
                  </div>
                  <button onClick={() => setDeleteConfirmationOpen(true)} className="btn-danger" style={{ padding: '8px 16px', fontSize: 13 }}>
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              8. ADMIN SETTINGS TAB
          ========================================== */}
          {activeTab === 'admin' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1e293b' }}>Admin Settings</h3>
                  <p style={{ fontSize: 13, color: '#64748b' }}>Manage roles, add employees, and modify workspace system permissions</p>
                </div>
                <button 
                  onClick={() => setShowAddEmployeeModal(true)} 
                  className="btn-primary" 
                  style={{ padding: '8px 14px', fontSize: 12 }}
                >
                  <MdAdd size={16} /> Add New Employee
                </button>
              </div>

              {/* Roles list */}
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 12, color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>Active Workspace Team ({adminUsersList.length})</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {adminUsersList.map((emp) => (
                    <div key={emp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid rgba(0,0,0,0.03)' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{emp.name}</div>
                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 1 }}>{emp.email}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <span style={{ 
                          fontSize: 10, fontWeight: 700, color: emp.role === 'Team Lead' ? '#db2777' : '#4f46e5', 
                          background: emp.role === 'Team Lead' ? '#fdf2f8' : '#edf2ff', padding: '3px 8px', borderRadius: 4 
                        }}>
                          {emp.role}
                        </span>
                        <button 
                          onClick={() => {
                            toast.success(`Permissions customizer opened for ${emp.name}!`);
                          }}
                          style={{ border: 'none', background: 'transparent', color: '#4f46e5', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                        >
                          System Permissions
                        </button>
                        <button 
                          onClick={() => {
                            setAdminUsersList(prev => prev.filter(e => e.id !== emp.id));
                            toast.success(`Removed team access for ${emp.name}.`);
                          }}
                          style={{ border: 'none', background: 'transparent', color: '#ef4444', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                        >
                          Revoke Access
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: 10, marginTop: 24, borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: 16 }}>
                <button 
                  onClick={() => toast.success('Role definitions database mapping synchronized!')}
                  className="btn-secondary" 
                  style={{ flex: 1, padding: '8px 12px', fontSize: 12, justifyContent: 'center' }}
                >
                  Manage Roles
                </button>
                <button 
                  onClick={() => toast.success('Active access control lists (ACL) saved!')}
                  className="btn-secondary" 
                  style={{ flex: 1, padding: '8px 12px', fontSize: 12, justifyContent: 'center' }}
                >
                  Manage Team Access
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* ==============================================
          MODALS
      ============================================== */}
      <AnimatePresence>
        {/* ADD EMPLOYEE MODAL (ADMIN SETTINGS) */}
        {showAddEmployeeModal && (
          <div className="modal-overlay" onClick={() => setShowAddEmployeeModal(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card" 
              style={{ width: '100%', maxWidth: 400, padding: 24, background: '#ffffff' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#1e293b' }}>Add New Employee</h3>
                <button onClick={() => setShowAddEmployeeModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}><MdClose size={18} /></button>
              </div>
              <form onSubmit={handleAddEmployee} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 5 }}>Employee Name</label>
                  <input 
                    type="text" 
                    className="input-dark" 
                    placeholder="e.g. Ramesh Patil" 
                    value={newEmployeeForm.name} 
                    onChange={e => setNewEmployeeForm({ ...newEmployeeForm, name: e.target.value })} 
                    required 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 5 }}>Corporate Email</label>
                  <input 
                    type="email" 
                    className="input-dark" 
                    placeholder="ramesh@manufactocrm.com" 
                    value={newEmployeeForm.email} 
                    onChange={e => setNewEmployeeForm({ ...newEmployeeForm, email: e.target.value })} 
                    required 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 5 }}>Workspace Role Designation</label>
                  <select 
                    className="input-dark"
                    value={newEmployeeForm.role}
                    onChange={e => setNewEmployeeForm({ ...newEmployeeForm, role: e.target.value })}
                  >
                    <option>Sales Executive</option>
                    <option>Team Lead</option>
                    <option>Administrator</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 5 }}>Profile Image</label>
                  <input type="file" onChange={(e) => setNewEmployeeForm({...newEmployeeForm, avatar: e.target.files[0]})} />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
                  <button type="button" onClick={() => setShowAddEmployeeModal(false)} className="btn-secondary" style={{ padding: '8px 16px' }}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ padding: '8px 16px' }}>Add Employee</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* DELETE ACCOUNT CONFIRMATION MODAL */}
        {deleteConfirmationOpen && (
          <div className="modal-overlay" onClick={() => setDeleteConfirmationOpen(false)}>
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
                <button onClick={() => setDeleteConfirmationOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}><MdClose size={18} /></button>
              </div>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16, lineHeight: 1.5 }}>
                Type <strong style={{ color: '#ef4444' }}>DELETE</strong> in the box below to permanently erase your profile and credentials from the system databases:
              </p>
              <form onSubmit={handleDeleteAccountSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <input 
                  type="text" 
                  className="input-dark" 
                  placeholder="DELETE" 
                  value={deleteConfirmText} 
                  onChange={e => setDeleteConfirmText(e.target.value)} 
                  required 
                />
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                  <button type="button" onClick={() => setDeleteConfirmationOpen(false)} className="btn-secondary" style={{ padding: '8px 16px' }}>Cancel</button>
                  <button 
                    type="submit" 
                    className="btn-danger" 
                    style={{ padding: '8px 16px', background: deleteConfirmText === 'DELETE' ? '#ef4444' : '#fca5a5', color: 'white', border: 'none' }}
                    disabled={deleteConfirmText !== 'DELETE'}
                  >
                    Delete Account Permanently
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settings;
