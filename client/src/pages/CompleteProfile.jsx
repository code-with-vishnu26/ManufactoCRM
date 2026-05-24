import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  MdAdminPanelSettings, MdGroups, MdTrendingUp, MdHome,
  MdPhone, MdLocationOn, MdBusiness, MdArrowForward,
  MdWbSunny, MdNightsStay, MdCheckCircle,
} from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const ROLES = [
  {
    key: 'admin',
    label: 'Admin',
    desc: 'Full system access & team management',
    icon: MdAdminPanelSettings,
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.08)',
  },
  {
    key: 'team_lead',
    label: 'Team Lead',
    desc: 'Oversee teams and track performance',
    icon: MdGroups,
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.08)',
  },
  {
    key: 'sales_executive',
    label: 'Sales Executive',
    desc: 'Manage leads, deals and pipeline',
    icon: MdTrendingUp,
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.08)',
  },
  {
    key: 'webpage',
    label: 'Webpage',
    desc: 'Access the public ManufactoCRM website',
    icon: MdHome,
    color: '#10b981',
    bg: 'rgba(16,185,129,0.08)',
  },
];

const DEPARTMENTS = ['Sales', 'Marketing', 'Engineering', 'Operations', 'Management'];

export default function CompleteProfile() {
  const { user, completeProfile, loading } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState('sales_executive');
  const [form, setForm] = useState({ phone: '', address: '', department: 'Sales' });
  const [errors, setErrors] = useState({});

  const currentRoleColor = ROLES.find(r => r.key === selectedRole)?.color || '#6366f1';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.phone.trim()) errs.phone = 'Mobile number is required';
    else if (!/^\+?[0-9]{7,15}$/.test(form.phone.trim())) errs.phone = 'Enter a valid mobile number';
    if (!form.address.trim()) errs.address = 'Address is required';
    if (!form.department.trim()) errs.department = 'Department is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    toast.loading('Saving your profile...', { id: 'complete-profile' });
    const res = await completeProfile({
      role: selectedRole,
      phone: form.phone,
      address: form.address,
      department: form.department,
    });

    if (res.success) {
      toast.success('Profile complete! Welcome aboard 🚀', { id: 'complete-profile' });
      navigate(res.dashboardRoute, { replace: true });
    } else {
      toast.error(res.message || 'Failed to save profile', { id: 'complete-profile' });
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      fontFamily: "'Inter', sans-serif",
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      position: 'relative',
    }}>

      {/* Floating theme toggle */}
      <button
        onClick={toggleTheme}
        style={{
          position: 'fixed', top: 16, right: 16, zIndex: 100,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 10, padding: '8px 14px',
          display: 'flex', alignItems: 'center', gap: 6,
          color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600,
          cursor: 'pointer', transition: 'all 0.2s',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        }}
      >
        {isDark ? <MdWbSunny size={16} /> : <MdNightsStay size={16} />}
        {isDark ? 'Light' : 'Dark'}
      </button>

      {/* Animated background blobs */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '-15%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '100%', maxWidth: 560, zIndex: 1,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 24,
          padding: '2.5rem 2rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
          boxSizing: 'border-box',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          {/* Avatar from OAuth */}
          {user?.avatar && (
            <img
              src={user.avatar}
              alt={user.name}
              style={{
                width: 64, height: 64, borderRadius: '50%',
                border: `3px solid ${currentRoleColor}`,
                marginBottom: 12, objectFit: 'cover',
                boxShadow: `0 0 0 6px ${currentRoleColor}18`,
              }}
            />
          )}
          <h2 style={{ fontSize: 24, fontWeight: 900, margin: '0 0 6px', letterSpacing: '-0.5px' }}>
            Welcome, {user?.name?.split(' ')[0] || 'there'}! 👋
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>
            One quick step — choose your role and share your details to get started.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Role Selection */}
          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Choose Your Role
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {ROLES.map(role => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.key;
                return (
                  <motion.div
                    key={role.key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedRole(role.key)}
                    style={{
                      background: isSelected ? role.bg : 'var(--bg-primary)',
                      border: `2px solid ${isSelected ? role.color : 'var(--border-color)'}`,
                      borderRadius: 14,
                      padding: '14px 12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      position: 'relative',
                      boxShadow: isSelected ? `0 4px 20px ${role.color}20` : 'none',
                    }}
                  >
                    {/* Checkmark */}
                    {isSelected && (
                      <MdCheckCircle
                        size={18}
                        color={role.color}
                        style={{ position: 'absolute', top: 10, right: 10 }}
                      />
                    )}
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: role.bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: 8,
                    }}>
                      <Icon size={20} color={role.color} />
                    </div>
                    <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 3 }}>{role.label}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)', lineHeight: 1.4 }}>{role.desc}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>Mobile Number</label>
            <div style={{ position: 'relative' }}>
              <MdPhone style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
              <input
                name="phone" type="text" placeholder="+91 9876543210" value={form.phone} onChange={handleChange}
                style={{
                  width: '100%', padding: '12px 14px 12px 42px', borderRadius: 10, fontSize: 14.5,
                  background: 'var(--bg-primary)', border: `1px solid ${errors.phone ? '#ef4444' : 'var(--border-color)'}`,
                  color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s',
                }}
                onFocus={e => { e.target.style.borderColor = currentRoleColor; }}
                onBlur={e => { e.target.style.borderColor = errors.phone ? '#ef4444' : 'var(--border-color)'; }}
              />
            </div>
            {errors.phone && <p style={{ color: '#ef4444', fontSize: 11.5, margin: '4px 0 0' }}>{errors.phone}</p>}
          </div>

          {/* Address */}
          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>Address</label>
            <div style={{ position: 'relative' }}>
              <MdLocationOn style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
              <input
                name="address" type="text" placeholder="City, State, Country" value={form.address} onChange={handleChange}
                style={{
                  width: '100%', padding: '12px 14px 12px 42px', borderRadius: 10, fontSize: 14.5,
                  background: 'var(--bg-primary)', border: `1px solid ${errors.address ? '#ef4444' : 'var(--border-color)'}`,
                  color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s',
                }}
                onFocus={e => { e.target.style.borderColor = currentRoleColor; }}
                onBlur={e => { e.target.style.borderColor = errors.address ? '#ef4444' : 'var(--border-color)'; }}
              />
            </div>
            {errors.address && <p style={{ color: '#ef4444', fontSize: 11.5, margin: '4px 0 0' }}>{errors.address}</p>}
          </div>

          {/* Department */}
          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 6 }}>Department</label>
            <div style={{ position: 'relative' }}>
              <MdBusiness style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
              <select
                name="department" value={form.department} onChange={handleChange}
                style={{
                  width: '100%', padding: '12px 14px 12px 42px', borderRadius: 10, fontSize: 14.5,
                  background: 'var(--bg-primary)', border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box',
                  cursor: 'pointer', appearance: 'none', transition: 'all 0.2s',
                }}
              >
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={!loading ? { scale: 1.01 } : {}}
            whileTap={!loading ? { scale: 0.99 } : {}}
            style={{
              width: '100%', padding: '14px 20px', borderRadius: 12, border: 'none',
              background: loading ? 'var(--bg-card)' : `linear-gradient(135deg, ${currentRoleColor}, #8b5cf6)`,
              color: loading ? 'var(--text-muted)' : '#fff',
              fontSize: '1rem', fontWeight: 750, cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: loading ? 'none' : `0 6px 24px ${currentRoleColor}30`,
              transition: 'all 0.3s', marginTop: 4,
            }}
          >
            {loading ? (
              <><div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Saving...</>
            ) : (
              <>Get Started <MdArrowForward size={20} /></>
            )}
          </motion.button>

        </form>
      </motion.div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
