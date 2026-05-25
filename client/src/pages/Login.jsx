import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MdFactory, MdEmail, MdLock, MdVisibility, MdVisibilityOff,
  MdArrowForward, MdLightMode, MdDarkMode, MdLockOutline,
  MdSecurity, MdAutoAwesome, MdBarChart, MdGroups, MdTrendingUp,
  MdInfoOutline
} from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import loginBanner from '../assets/login_banner.png';

// Social button icons (simple SVG paths)
const SocialIcon = ({ provider }) => {
  if (provider === 'google') return <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24"><path fill="#ea4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.2-5.136 4.2a6.2 6.2 0 1 1 0-12.4c1.688 0 3.132.614 4.254 1.7L21.36 4.8A9.9 9.9 0 0 0 12.24 2a10 10 0 1 0 0 20c5.38 0 9.878-3.9 9.878-9.7 0-.585-.054-1.16-.144-1.7H12.24z"/></svg>;
  if (provider === 'github') return <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24"><path fill="var(--text-primary)" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>;
  return <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24"><path fill="#0078d4" d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/></svg>;
};

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const { login, socialLogin, loading, user } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Redirect if already logged in (prevents back-button to login loop)
  useEffect(() => {
    if (user) {
      const dashboardRoutes = {
        admin:           '/admin/dashboard',
        team_lead:       '/teamlead/dashboard',
        sales_executive: '/sales/dashboard',
        webpage:         '/home',
      };
      const redirectRoute = dashboardRoutes[user.role] || '/sales/dashboard';
      navigate(redirectRoute, { replace: true });
    }
  }, [user, navigate]);

  // Social authentications listener — receives JWT from server OAuth callback popup
  useEffect(() => {
    const handleSocialAuthMessage = async (e) => {
      // Robustly construct backend URL origin validation
      let serverOrigin = '';
      try {
        const serverUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        if (serverUrl.startsWith('http')) {
          serverOrigin = new URL(serverUrl).origin;
        }
      } catch (err) {
        console.error('Failed to parse VITE_API_URL origin:', err);
      }

      const allowedOrigins = [window.location.origin, 'http://localhost:5000'];
      if (serverOrigin) allowedOrigins.push(serverOrigin);

      // Verify origin with strong fallbacks (e.g. railway.app subdomain match or localhost)
      const isAllowedOrigin = allowedOrigins.includes(e.origin) || 
                              e.origin.includes('localhost') || 
                              e.origin.endsWith('railway.app');

      if (!isAllowedOrigin) return;

      if (e.data && e.data.success && e.data.token && e.data.user) {
        toast.loading(`Signing in...`, { id: 'social-auth' });
        // Directly save the session using the token returned from the server OAuth callback
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
            toast.success(`Signed in successfully! 🚀`, { id: 'social-auth' });
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
    // Point to real backend OAuth endpoint
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const oauthUrl = `${backendUrl}/oauth/${provider}?origin=${encodeURIComponent(window.location.origin)}`;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    if (!form.password) errs.password = 'Password is required';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const res = await login(form.email, form.password);
    if (res.success) {
      toast.success('Welcome back! 🚀');
      const redirect = searchParams.get('redirect');
      if (redirect) {
        navigate(redirect, { replace: true });
      } else {
        navigate(res.dashboardRoute, { replace: true });
      }
    } else {
      toast.error(res.message);
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

      {/* Centering viewport wrapper that centers the card vertically so it moves up/down perfectly */}
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
          maxWidth: 1380, // Optimized centered wide container
          width: '95%', // Fluid centered width
          margin: '0 auto',
          boxSizing: 'border-box',
          alignItems: 'stretch', // Stretches columns to identical heights, preventing vertical jumps
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
            padding: '1.5rem 1.8rem', // Compact and premium padding
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start', // Prevent giant empty gaps vertically
            gap: '1rem', // Distribute elements naturally close together
            boxShadow: '0 10px 35px rgba(0,0,0,0.03)',
            height: '100%',
            boxSizing: 'border-box',
          }}
        >
          <div>
            {/* Left Header */}
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
                  Welcome Back to <br /><span style={{ color: '#6366f1' }}>ManufactoCRM AI</span>
                </h2>
              </div>
              <p style={{ fontSize: 14.5, color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                Sign in to continue managing your leads, teams and grow your business with AI.
              </p>
            </div>

            {/* Feature List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}> {/* Compact gap between items */}
              {[
                { title: 'Role-Based Access', desc: 'Secure access based on your role and permissions.', icon: MdSecurity },
                { title: 'Smart Analytics', desc: 'Real-time insights and AI-powered reports.', icon: MdBarChart },
                { title: 'Lead Management', desc: 'Track, manage and convert leads efficiently.', icon: MdTrendingUp },
                { title: 'Data Security', desc: 'Your data is safe with enterprise-grade security.', icon: MdLockOutline }
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.title} style={{ display: 'flex', gap: 14 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 10, // Compact size
                      background: 'rgba(99,102,241,0.06)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, border: '1px solid rgba(99,102,241,0.12)',
                    }}>
                      <Icon size={16} color="#6366f1" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)' }}>{item.title}</span>
                      <span style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{item.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{
            width: '100%',
            borderRadius: 16,
            overflow: 'hidden',
            border: '1px solid var(--border-color)', // Standard elegant border in both modes
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)', // Beautiful natural shadow
            display: 'flex',
            marginTop: '0.6rem', // Compact margin to save vertical height
            background: 'var(--bg-primary)', // Standard theme background
            position: 'relative',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'none'}
          >
            <img
              src={loginBanner}
              alt="Login Security Tech Illustration"
              style={{
                width: '100%',
                height: 150, // Reduced height to fit perfectly on one page without scrollbars
                objectFit: 'cover', // Cover full area for real photograph integration!
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
              color: '#10b981',
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
              <span>🛡️</span> SSL Secured Session
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="auth-panel-right"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 20,
            padding: '1.5rem 1.8rem', // Compact and premium padding
            boxShadow: '0 10px 35px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12, // Compact gap for vertical balance
            boxSizing: 'border-box',
          }}
        >
          {/* Header — no logo here, moved to left panel */}
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: 20, fontWeight: 900, margin: '0 0 4px 0', letterSpacing: '-0.4px' }}>Sign in to your account</h3>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', margin: 0 }}>Enter your credentials to access your workspace</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Email Address */}
            <div>
              <label style={{ display: 'block', fontSize: 12.5, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <MdEmail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} /> {/* Increased size & offset */}
                <input
                  name="email" type="email" placeholder="you@company.com" value={form.email} onChange={handleChange}
                  style={{
                    width: '100%', padding: '12px 14px 12px 40px', borderRadius: 8, fontSize: 14.5, // Taller input, larger font!
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

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <label style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-secondary)' }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: 12.5, color: '#6366f1', textDecoration: 'none', fontWeight: 700 }}>Forgot password?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <MdLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} /> {/* Increased size & offset */}
                <input
                  name="password" type={showPass ? 'text' : 'password'} placeholder="Enter your password" value={form.password} onChange={handleChange}
                  style={{
                    width: '100%', padding: '12px 38px 12px 40px', borderRadius: 8, fontSize: 14.5, // Taller input, larger font!
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
                  {showPass ? <MdVisibilityOff size={17} /> : <MdVisibility size={17} />} {/* Increased size */}
                </button>
              </div>
              {errors.password && <p style={{ color: '#ef4444', fontSize: 11, margin: '5px 0 0' }}>{errors.password}</p>}
            </div>

            {/* Remember Me Checkbox */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' }}>
                <input
                  type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
                  style={{ width: 15, height: 15, accentColor: '#6366f1', cursor: 'pointer' }}
                />
                <span style={{ fontSize: 13.5, color: 'var(--text-secondary)', fontWeight: 600 }}>Remember me</span> {/* Increased size */}
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)' }}>
                <span style={{ fontSize: 12.5, fontWeight: 600 }}>Keep me signed in</span> {/* Increased size */}
                <MdInfoOutline size={13} />
              </div>
            </div>

            {/* Actions Panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 2 }}>
              {/* Primary Sign In */}
              <button
                type="submit" disabled={loading}
                style={{
                  width: '100%', padding: '12px 18px', borderRadius: 10, border: 'none',
                  background: loading ? 'var(--bg-primary)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: loading ? 'var(--text-muted)' : '#fff',
                  fontSize: '1rem', fontWeight: 750, cursor: loading ? 'not-allowed' : 'pointer', // Larger text!
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: loading ? 'none' : '0 4px 15px rgba(99,102,241,0.15)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(99,102,241,0.25)'; } }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(99,102,241,0.15)'; }}
              >
                {loading ? (
                  <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Signing in...</>
                ) : (
                  <>Sign In <MdArrowForward size={18} /></>
                )}
              </button>

            </div>
          </form>

          {/* Bottom create account link */}
          <p style={{ textAlign: 'center', margin: '4px 0 0', fontSize: 14.5, color: 'var(--text-secondary)', fontWeight: 600 }}> {/* Increased size */}
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#6366f1', fontWeight: 750, textDecoration: 'none' }}>Create Account</Link>
          </p>

          {/* Or Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '6px 0 2px' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }} />
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>or sign in with</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }} />
          </div>

          {/* Social Buttons */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 4 }}>
            {[
              { key: 'google', label: 'Google' },
              { key: 'github', label: 'GitHub' },
              { key: 'microsoft', label: 'Microsoft' }
            ].map(p => (
              <button
                type="button" key={p.key} onClick={() => triggerSocialAuth(p.key)}
                style={{
                  flex: 1, padding: '12px 10px', borderRadius: 9, border: '1px solid var(--border-color)', // Taller button!
                  background: 'var(--bg-card)', color: 'var(--text-primary)', fontSize: 13.5, fontWeight: 700, // Larger text!
                  cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = 'var(--bg-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.background = 'var(--bg-card)'; }}
              >
                <SocialIcon provider={p.key} /> {p.label}
              </button>
            ))}
          </div>

          {/* Secure padlock footer */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            justifyContent: 'center', borderTop: '1px solid var(--border-color)',
            paddingTop: 16, marginTop: 4, // Increased padding
          }}>
            <MdLockOutline size={14} color="var(--text-muted)" /> {/* Increased size */}
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}> {/* Increased size */}
              Your data is secure and protected. We never share your information.
            </span>
          </div>
        </motion.div>
      </div>
    </div>



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
        }
        @media (max-width: 767px) {
          .auth-container {
            grid-template-columns: 1fr !important;
            max-width: 500px !important;
            padding: 1rem 1rem !important;
          }
          .auth-panel-left {
            display: none !important; /* Hide left decorative panel on mobile to fit form on a single screen without scrolling */
          }
        }
      `}</style>
    </div>
  );
}
