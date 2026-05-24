import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdFactory, MdEmail, MdLock, MdPerson, MdVisibility, MdVisibilityOff,
  MdArrowForward, MdHome, MdLightMode, MdDarkMode,
  MdSecurity, MdAutoAwesome, MdCheck,
  MdGroups, MdTrendingUp
} from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import BrowseAsUserModal from '../components/BrowseAsUserModal';
import registerBanner from '../assets/register_banner.png';

// Social button icons (simple SVG paths)
const SocialIcon = ({ provider }) => {
  if (provider === 'google') return <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24"><path fill="#ea4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.2-5.136 4.2a6.2 6.2 0 1 1 0-12.4c1.688 0 3.132.614 4.254 1.7L21.36 4.8A9.9 9.9 0 0 0 12.24 2a10 10 0 1 0 0 20c5.38 0 9.878-3.9 9.878-9.7 0-.585-.054-1.16-.144-1.7H12.24z"/></svg>;
  if (provider === 'github') return <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24"><path fill="var(--text-primary)" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>;
  return <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24"><path fill="#0078d4" d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/></svg>;
};

const ROLES = [
  {
    key: 'admin',
    label: 'Admin',
    icon: MdSecurity,
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.06)',
    desc: 'Full system control. Manage roles & users.'
  },
  {
    key: 'team_lead',
    label: 'Team Lead',
    icon: MdGroups,
    color: '#8b5cf6',
    bg: 'rgba(139, 92, 246, 0.06)',
    desc: 'Manage BDA leads, assign tasks and teams.'
  },
  {
    key: 'sales_executive',
    label: 'Sales Executive',
    icon: MdTrendingUp,
    color: '#6366f1',
    bg: 'rgba(99, 102, 241, 0.06)',
    desc: 'Manage personal leads & use sales AI.'
  },
  {
    key: 'webpage',
    label: 'Webpage',
    icon: MdHome,
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.06)',
    desc: 'Go to the public webpage.'
  }
];

export default function Register() {
  const [step, setStep] = useState(1); // 1 = basic details, 2 = profile details
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    department: 'Sales',
  });
  const [selectedRole, setSelectedRole] = useState('team_lead');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState({});
  const { register, socialLogin, loading } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [showBrowseModal, setShowBrowseModal] = useState(false);

  // Social authentications listener — receives JWT from server OAuth callback popup
  useEffect(() => {
    const handleSocialAuthMessage = async (e) => {
      const allowedOrigins = [window.location.origin, 'http://localhost:5000'];
      if (!allowedOrigins.includes(e.origin) && !e.origin.includes('localhost')) return;
      if (e.data && e.data.success && e.data.token && e.data.user) {
        toast.loading(`Signing in...`, { id: 'social-auth' });
        const res = await socialLogin({
          _directToken: e.data.token,
          _directUser:  e.data.user,
          _dashboardRoute: e.data.dashboardRoute,
        });
        if (res.success) {
          toast.dismiss('social-auth');
          // New OAuth user — send them to profile completion page
          if (e.data.needsProfile) {
            toast.success('Welcome! Please complete your profile to get started. 🎉', { id: 'social-auth' });
            navigate('/complete-profile', { replace: true });
          } else {
            toast.success(`Authenticated successfully! 🚀`, { id: 'social-auth' });
            navigate(res.dashboardRoute, { replace: true });
          }
        } else {
          toast.error(res.message || 'Sign in failed', { id: 'social-auth' });
        }
      } else if (e.data && e.data.success === false && e.data.error) {
        toast.error(e.data.error, { id: 'social-auth' });
      }
    };

    window.addEventListener('message', handleSocialAuthMessage);
    return () => window.removeEventListener('message', handleSocialAuthMessage);
  }, [socialLogin, navigate]);

  const triggerSocialAuth = (provider) => {
    const width  = 520;
    const height = 620;
    const left   = window.screen.width  / 2 - width  / 2;
    const top    = window.screen.height / 2 - height / 2;
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const oauthUrl = `${backendUrl}/oauth/${provider}`;
    window.open(
      oauthUrl,
      `oauth_${provider}`,
      `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes,scrollbars=yes`
    );
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateStep1 = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!selectedRole) errs.role = 'Please select a role';
    if (!form.phone.trim()) errs.phone = 'Mobile number is required';
    else if (!/^\+?[0-9]{7,15}$/.test(form.phone.trim())) errs.phone = 'Enter a valid mobile number';
    if (!form.address.trim()) errs.address = 'Address is required';
    if (!form.department.trim()) errs.department = 'Department is required';
    return errs;
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    const errs = validateStep1();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep(2); // Go to Step 2: Profile Details
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      toast.error('You must agree to the Terms & Conditions and Privacy Policy');
      return;
    }
    const errs = validateStep2();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});

    toast.loading('Creating your account...', { id: 'register' });
    const res = await register({
      name: form.name,
      email: form.email,
      password: form.password,
      role: selectedRole,
      phone: form.phone,
      address: form.address,
      department: form.department,
    });

    if (res.success) {
      toast.success('Welcome aboard! 🚀', { id: 'register' });
      navigate(res.dashboardRoute, { replace: true });
    } else {
      toast.error(res.message, { id: 'register' });
    }
  };

  const currentRoleColor = ROLES.find(r => r.key === selectedRole)?.color || '#8b5cf6';

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      fontFamily: "'Inter', sans-serif",
      color: 'var(--text-primary)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'background-color 0.3s ease',
      position: 'relative',
    }}>
      {/* Floating Theme Toggle */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        right: '1.5rem',
        zIndex: 10,
      }}>
        <button
          onClick={toggleTheme}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            padding: '8px 14px',
            borderRadius: 10,
            fontSize: 12.5,
            fontWeight: 700,
            cursor: 'pointer',
            color: 'var(--text-primary)',
            transition: 'all 0.2s',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          }}
        >
          {isDark ? (
            <><MdLightMode size={14} color="#f59e0b" /> Light</>
          ) : (
            <><MdDarkMode size={14} color="#6366f1" /> Dark</>
          )}
        </button>
      </div>

      {/* Centering viewport wrapper */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.2rem 0',
        boxSizing: 'border-box',
        width: '100%',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Main Dual-Panel Content */}
        <div className="auth-container" style={{
          display: 'grid',
          gap: '2.5rem',
          maxWidth: 1380,
          width: '95%',
          margin: '0 auto',
          boxSizing: 'border-box',
          alignItems: 'stretch',
        }}>
        {/* Left Panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="auth-panel-left"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 20,
            padding: '1.5rem 1.8rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            gap: '1rem',
            boxShadow: '0 10px 35px rgba(0,0,0,0.03)',
            height: '100%',
            boxSizing: 'border-box',
          }}
        >
          <div>
            {/* Left Logo and Title */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(99,102,241,0.25)',
                }}>
                  <MdFactory size={24} color="white" />
                </div>
                <h2 style={{ fontSize: 30, fontWeight: 900, letterSpacing: '-0.6px', margin: 0, lineHeight: 1.25 }}>
                  Join <span style={{ color: '#6366f1' }}>ManufactoCRM AI</span>
                </h2>
              </div>
              <p style={{ fontSize: 14.5, color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                Create your account and start managing leads, teams and growth smarter with AI.
              </p>
            </div>

            {/* Why Choose Us checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: '1.2rem' }}>
              <h4 style={{ fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6366f1', margin: '0 0 4px 0' }}>Why choose us?</h4>
              {[
                'Secure and role-based access',
                'AI-powered insights and automation',
                'Complete lead and pipeline management',
                'Advanced analytics and reporting',
                'Team collaboration made easy'
              ].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: 'rgba(99,102,241,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(99,102,241,0.15)',
                  }}>
                    <MdCheck size={12} color="#6366f1" />
                  </div>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>


            {/* Premium Tech Illustration Panel */}
            <div style={{
              width: '100%',
              borderRadius: 16,
              overflow: 'hidden',
              border: '1px solid var(--border-color)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              display: 'flex',
              marginTop: '0.6rem',
              background: 'var(--bg-primary)',
              position: 'relative',
              transition: 'transform 0.3s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              <img
                src={registerBanner}
                alt="Register Tech Illustration"
                style={{
                  width: '100%',
                  height: 150,
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              {/* Elegant transparent overlay badge */}
              <div style={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                background: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#8b5cf6',
                fontSize: 9.5,
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
              }}>
                <MdAutoAwesome size={10} color="#8b5cf6" /> Live Analytics
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Panel */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            /* ====== STEP 1: BASIC DETAILS ====== */
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="auth-panel-right"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 20,
                padding: '1.5rem 1.8rem',
                boxShadow: '0 10px 35px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                boxSizing: 'border-box',
              }}
            >
              {/* Steps Indicator */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                padding: '0 1.5rem',
              }}>
                <div style={{
                  position: 'absolute', top: 11, left: '12%', right: '12%',
                  height: 2, background: 'var(--border-color)', zIndex: 0,
                }} />
                <div style={{
                  position: 'absolute', top: 11, left: '12%', width: '0%',
                  height: 2, background: '#6366f1', zIndex: 0,
                }} />

                {[
                  { num: 1, label: 'Basic Info' },
                  { num: 2, label: 'Profile Details' },
                ].map((s, idx) => (
                  <div key={idx} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: 6, zIndex: 1, flex: 1,
                  }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: s.num === 1 ? '#6366f1' : 'var(--bg-primary)',
                      border: `2px solid ${s.num === 1 ? '#6366f1' : 'var(--border-color)'}`,
                      color: s.num === 1 ? 'white' : 'var(--text-secondary)',
                      fontSize: 11.5, fontWeight: 750,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {s.num}
                    </div>
                    <span style={{
                      fontSize: 10.5,
                      fontWeight: s.num === 1 ? 750 : 600,
                      color: s.num === 1 ? 'var(--text-primary)' : 'var(--text-secondary)',
                    }}>{s.label}</span>
                  </div>
                ))}
              </div>

              <div>
                <h3 style={{ fontSize: 20, fontWeight: 900, margin: '0 0 4px 0', letterSpacing: '-0.4px' }}>Create Your Account</h3>
                <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', margin: 0 }}>Fill in your basic details below</p>
              </div>

              {/* Form */}
              <form onSubmit={handleStep1Submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="input-grid" style={{ display: 'grid', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>Full Name</label>
                    <div style={{ position: 'relative' }}>
                      <MdPerson style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                      <input
                        name="name" type="text" placeholder="Enter your full name" value={form.name} onChange={handleChange}
                        style={{
                          width: '100%', padding: '12px 14px 12px 40px', borderRadius: 8, fontSize: 14.5,
                          background: 'var(--bg-primary)', border: `1px solid ${errors.name ? '#ef4444' : 'var(--border-color)'}`,
                          color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box',
                          transition: 'all 0.2s',
                        }}
                        onFocus={e => { e.target.style.borderColor = '#6366f1'; }}
                        onBlur={e => { e.target.style.borderColor = errors.name ? '#ef4444' : 'var(--border-color)'; }}
                      />
                    </div>
                    {errors.name && <p style={{ color: '#ef4444', fontSize: 11, margin: '5px 0 0' }}>{errors.name}</p>}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>Email Address</label>
                    <div style={{ position: 'relative' }}>
                      <MdEmail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                      <input
                        name="email" type="email" placeholder="Enter your email" value={form.email} onChange={handleChange}
                        style={{
                          width: '100%', padding: '12px 14px 12px 40px', borderRadius: 8, fontSize: 14.5,
                          background: 'var(--bg-primary)', border: `1px solid ${errors.email ? '#ef4444' : 'var(--border-color)'}`,
                          color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box',
                          transition: 'all 0.2s',
                        }}
                        onFocus={e => { e.target.style.borderColor = '#6366f1'; }}
                        onBlur={e => { e.target.style.borderColor = errors.email ? '#ef4444' : 'var(--border-color)'; }}
                      />
                    </div>
                    {errors.email && <p style={{ color: '#ef4444', fontSize: 11, margin: '5px 0 0' }}>{errors.email}</p>}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>Password</label>
                    <div style={{ position: 'relative' }}>
                      <MdLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                      <input
                        name="password" type={showPass ? 'text' : 'password'} placeholder="Create a strong password" value={form.password} onChange={handleChange}
                        style={{
                          width: '100%', padding: '12px 38px 12px 40px', borderRadius: 8, fontSize: 14.5,
                          background: 'var(--bg-primary)', border: `1px solid ${errors.password ? '#ef4444' : 'var(--border-color)'}`,
                          color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box',
                          transition: 'all 0.2s',
                        }}
                        onFocus={e => { e.target.style.borderColor = '#6366f1'; }}
                        onBlur={e => { e.target.style.borderColor = errors.password ? '#ef4444' : 'var(--border-color)'; }}
                      />
                      <button
                        type="button" onClick={() => setShowPass(!showPass)}
                        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: 0 }}
                      >
                        {showPass ? <MdVisibilityOff size={17} /> : <MdVisibility size={17} />}
                      </button>
                    </div>
                    {errors.password && <p style={{ color: '#ef4444', fontSize: 11, margin: '5px 0 0' }}>{errors.password}</p>}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>Confirm Password</label>
                    <div style={{ position: 'relative' }}>
                      <MdLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                      <input
                        name="confirmPassword" type={showConfirm ? 'text' : 'password'} placeholder="Confirm your password" value={form.confirmPassword} onChange={handleChange}
                        style={{
                          width: '100%', padding: '12px 38px 12px 40px', borderRadius: 8, fontSize: 14.5,
                          background: 'var(--bg-primary)', border: `1px solid ${errors.confirmPassword ? '#ef4444' : 'var(--border-color)'}`,
                          color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box',
                          transition: 'all 0.2s',
                        }}
                        onFocus={e => { e.target.style.borderColor = '#6366f1'; }}
                        onBlur={e => { e.target.style.borderColor = errors.confirmPassword ? '#ef4444' : 'var(--border-color)'; }}
                      />
                      <button
                        type="button" onClick={() => setShowConfirm(!showConfirm)}
                        style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: 0 }}
                      >
                        {showConfirm ? <MdVisibilityOff size={17} /> : <MdVisibility size={17} />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p style={{ color: '#ef4444', fontSize: 11, margin: '5px 0 0' }}>{errors.confirmPassword}</p>}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                  <button
                    type="submit"
                    style={{
                      width: '100%', padding: '12px 18px', borderRadius: 10, border: 'none',
                      background: `linear-gradient(135deg, #6366f1, #8b5cf6)`,
                      color: '#fff', fontSize: '1rem', fontWeight: 750, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      boxShadow: '0 4px 15px rgba(99,102,241,0.15)', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(99,102,241,0.25)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(99,102,241,0.15)'; }}
                  >
                    Create Account <MdArrowForward size={18} />
                  </button>

                  {/* Bottom sign in link */}
                  <p style={{ textAlign: 'center', margin: '4px 0 0', fontSize: 14.5, color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#6366f1', fontWeight: 750, textDecoration: 'none' }}>Sign In</Link>
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '6px 0' }}>
                    <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }} />
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>or sign up with</span>
                    <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }} />
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    {[
                      { key: 'google', label: 'Google' },
                      { key: 'github', label: 'GitHub' },
                      { key: 'microsoft', label: 'Microsoft' }
                    ].map(p => (
                      <button
                        type="button" key={p.key} onClick={() => triggerSocialAuth(p.key)}
                        style={{
                          flex: 1, padding: '12px 10px', borderRadius: 9, border: '1px solid var(--border-color)',
                          background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13.5, fontWeight: 700,
                          cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = 'var(--bg-primary)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.background = 'var(--bg-card)'; }}
                      >
                        <SocialIcon provider={p.key} /> {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </form>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', borderTop: '1px solid var(--border-color)', paddingTop: 16, marginTop: 4 }}>
                <MdLock size={14} color="var(--text-muted)" />
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
                  Your data is secure and protected. We never share your information.
                </span>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            /* ====== STEP 2: PROFILE DETAILS ====== */
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="auth-panel-right"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 20,
                padding: '1.5rem 1.8rem',
                boxShadow: '0 10px 35px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                boxSizing: 'border-box',
              }}
            >
              {/* Steps Indicator */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
                padding: '0 1.5rem',
              }}>
                <div style={{
                  position: 'absolute', top: 11, left: '12%', right: '12%',
                  height: 2, background: 'var(--border-color)', zIndex: 0,
                }} />
                <div style={{
                  position: 'absolute', top: 11, left: '12%', width: '38%',
                  height: 2, background: '#6366f1', zIndex: 0,
                }} />

                {[
                  { num: 1, label: 'Basic Info' },
                  { num: 2, label: 'Profile Details' },
                ].map((s, idx) => (
                  <div key={idx} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: 6, zIndex: 1, flex: 1,
                  }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: s.num <= 2 ? '#6366f1' : 'var(--bg-primary)',
                      border: `2px solid ${s.num <= 2 ? '#6366f1' : 'var(--border-color)'}`,
                      color: s.num <= 2 ? 'white' : 'var(--text-secondary)',
                      fontSize: 11.5, fontWeight: 750,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {s.num}
                    </div>
                    <span style={{
                      fontSize: 10.5,
                      fontWeight: s.num === 2 ? 750 : 600,
                      color: s.num === 2 ? 'var(--text-primary)' : 'var(--text-secondary)',
                    }}>{s.label}</span>
                  </div>
                ))}
              </div>

              <div>
                <h3 style={{ fontSize: 20, fontWeight: 900, margin: '0 0 4px 0', letterSpacing: '-0.4px' }}>Complete Your Profile</h3>
                <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', margin: 0 }}>Select your role and provide your contact information</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Roles grid */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 750, color: 'var(--text-secondary)', marginBottom: 6 }}>Roles</label>
                  <div className="roles-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                    {ROLES.map(role => {
                      const Icon = role.icon;
                      const isSelected = selectedRole === role.key;
                      return (
                        <div
                          key={role.key}
                          onClick={() => setSelectedRole(role.key)}
                          style={{
                            background: 'var(--bg-card)',
                            border: isSelected ? `2px solid ${role.color}` : '2px solid var(--border-color)',
                            borderRadius: 10,
                            padding: '10px 8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            position: 'relative',
                            boxShadow: isSelected ? `0 4px 12px ${role.color}08` : 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 6,
                            height: '100%',
                            boxSizing: 'border-box',
                          }}
                        >
                          <div style={{
                            position: 'absolute', top: 10, right: 10,
                            width: 14, height: 14, borderRadius: '50%',
                            border: `1.5px solid ${isSelected ? role.color : 'var(--text-muted)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            {isSelected && <div style={{ width: 8, height: 8, borderRadius: '50%', background: role.color }} />}
                          </div>

                          <div style={{
                            width: 32, height: 32, borderRadius: 8,
                            background: role.bg,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <Icon size={18} color={role.color} />
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <h4 style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', margin: 0, textAlign: 'center' }}>{role.label}</h4>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {errors.role && <p style={{ color: '#ef4444', fontSize: 11, margin: '5px 0 0' }}>{errors.role}</p>}
                </div>

                {/* Mobile No */}
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>Mobile Number</label>
                  <input
                    name="phone" type="text" placeholder="Enter your mobile number" value={form.phone} onChange={handleChange}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: 8, fontSize: 14.5,
                      background: 'var(--bg-primary)', border: `1px solid ${errors.phone ? '#ef4444' : 'var(--border-color)'}`,
                      color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box',
                      transition: 'all 0.2s',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#6366f1'; }}
                    onBlur={e => { e.target.style.borderColor = errors.phone ? '#ef4444' : 'var(--border-color)'; }}
                  />
                  {errors.phone && <p style={{ color: '#ef4444', fontSize: 11, margin: '5px 0 0' }}>{errors.phone}</p>}
                </div>

                {/* Address */}
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>Address</label>
                  <input
                    name="address" type="text" placeholder="Enter your address" value={form.address} onChange={handleChange}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: 8, fontSize: 14.5,
                      background: 'var(--bg-primary)', border: `1px solid ${errors.address ? '#ef4444' : 'var(--border-color)'}`,
                      color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box',
                      transition: 'all 0.2s',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#6366f1'; }}
                    onBlur={e => { e.target.style.borderColor = errors.address ? '#ef4444' : 'var(--border-color)'; }}
                  />
                  {errors.address && <p style={{ color: '#ef4444', fontSize: 11, margin: '5px 0 0' }}>{errors.address}</p>}
                </div>

                {/* Department */}
                <div>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>Department</label>
                  <select
                    name="department" value={form.department} onChange={handleChange}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: 8, fontSize: 14.5,
                      background: 'var(--bg-primary)', border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box',
                      transition: 'all 0.2s', cursor: 'pointer',
                    }}
                  >
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Operations">Operations</option>
                    <option value="Management">Management</option>
                  </select>
                </div>

                {/* Terms checkbox */}
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginTop: 2, userSelect: 'none' }}>
                  <input
                    type="checkbox" checked={agreeTerms} onChange={e => setAgreeTerms(e.target.checked)}
                    style={{ width: 14, height: 14, borderRadius: 3, accentColor: currentRoleColor, cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 650 }}>
                    I agree to the <span style={{ color: '#6366f1', fontWeight: 700 }}>Terms &amp; Conditions</span> and <span style={{ color: '#6366f1', fontWeight: 700 }}>Privacy Policy</span>
                  </span>
                </label>

                {/* Actions Grid */}
                <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                  <button
                    type="button" onClick={() => setStep(1)}
                    style={{
                      flex: 1, padding: '12px 18px', borderRadius: 10,
                      border: '1px solid var(--border-color)', background: 'transparent',
                      color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    Back
                  </button>
                  <button
                    type="submit" disabled={loading}
                    style={{
                      flex: 2, padding: '12px 18px', borderRadius: 10, border: 'none',
                      background: loading ? 'var(--bg-primary)' : `linear-gradient(135deg, ${currentRoleColor}, #8b5cf6)`,
                      color: loading ? 'var(--text-muted)' : '#fff', fontSize: '1rem', fontWeight: 750, cursor: loading ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      boxShadow: loading ? 'none' : `0 4px 15px ${currentRoleColor}15`,
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = `0 6px 18px ${currentRoleColor}25`; } }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = `0 4px 15px ${currentRoleColor}15`; }}
                  >
                    {loading ? (
                      <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Submitting...</>
                    ) : (
                      <>Get Started <MdArrowForward size={18} /></>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>

      {/* Guest Modal */}
      <BrowseAsUserModal isOpen={showBrowseModal} onClose={() => setShowBrowseModal(false)} />

      {/* Responsive stylesheet */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Responsive Grid Constraints */
        @media (min-width: 768px) {
          .auth-container {
            grid-template-columns: 45fr 55fr !important;
            max-width: 1200px !important;
            padding: 1.5rem 0 !important;
          }
          .input-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 767px) {
          .auth-container {
            grid-template-columns: 1fr !important;
            max-width: 500px !important;
            padding: 1rem 1rem !important;
          }
          .input-grid {
            grid-template-columns: 1fr !important;
          }
          .auth-panel-left {
            display: none !important;
          }
        }
        @media (max-width: 580px) {
          .roles-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 6px !important;
          }
        }
      `}</style>
    </div>
  );
}
