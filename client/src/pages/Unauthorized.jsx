import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdBlock, MdDashboard, MdLogout, MdArrowBack } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';

const ROLE_LABELS = {
  admin:           'Admin',
  team_lead:       'Team Lead',
  sales_executive: 'Sales Executive',
};

export default function Unauthorized() {
  const { user, logout, getDashboardRoute } = useAuth();
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    if (user) {
      navigate(getDashboardRoute(user.role), { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)', padding: '2rem', fontFamily: "'Inter', sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        style={{ maxWidth: 500, width: '100%', textAlign: 'center', position: 'relative', zIndex: 1 }}
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          style={{
            width: 88, height: 88, borderRadius: '50%',
            background: 'rgba(239,68,68,0.1)', border: '2px solid rgba(239,68,68,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 2rem',
          }}
        >
          <MdBlock size={42} color="#ef4444" />
        </motion.div>

        {/* 403 badge */}
        <div style={{
          display: 'inline-block', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: 100, padding: '4px 16px', fontSize: '0.78rem', fontWeight: 700,
          color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1.2rem',
        }}>
          403 — Access Denied
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 900,
          color: 'var(--text-primary)', marginBottom: '1rem', lineHeight: 1.2,
        }}>
          You don't have permission<br />to access this page.
        </h1>

        {/* Sub message */}
        <p style={{
          color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7,
          marginBottom: '2rem', maxWidth: 380, margin: '0 auto 2rem',
        }}>
          {user ? (
            <>
              You are logged in as <strong style={{ color: 'var(--text-primary)' }}>
                {user.name}
              </strong> ({ROLE_LABELS[user.role] || user.role}).
              This section is restricted to a different role.
              <br /><br />
              To access another role, please <strong>logout</strong> and sign in with the appropriate account.
            </>
          ) : (
            'Please log in to access this page.'
          )}
        </p>

        {/* Divider */}
        <div style={{ height: 1, background: 'var(--border-color)', marginBottom: '2rem' }} />

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={handleGoToDashboard}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff', border: 'none', borderRadius: 12,
              padding: '12px 24px', fontSize: '0.95rem', fontWeight: 700,
              cursor: 'pointer', boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(99,102,241,0.45)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.35)'; }}
          >
            <MdDashboard size={18} /> Go to My Dashboard
          </button>

          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--bg-card)', color: 'var(--text-secondary)',
              border: '1px solid var(--border-color)', borderRadius: 12,
              padding: '12px 24px', fontSize: '0.95rem', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            <MdArrowBack size={18} /> Go Back
          </button>

          <button
            onClick={logout}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(239,68,68,0.08)', color: '#ef4444',
              border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12,
              padding: '12px 24px', fontSize: '0.95rem', fontWeight: 600,
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
          >
            <MdLogout size={18} /> Logout &amp; Switch Account
          </button>
        </div>

        {/* Footer note */}
        <p style={{ marginTop: '2.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          ManufactoCRM AI · Role-Based Access Control
        </p>
      </motion.div>
    </div>
  );
}
