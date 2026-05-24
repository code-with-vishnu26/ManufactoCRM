import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MdClose, MdRocketLaunch, MdPersonAdd, MdLogin, MdPublic } from 'react-icons/md';

/**
 * BrowseAsUserModal
 * Shown when a visitor clicks "Browse as User" on Login / Register pages.
 * They must Sign Up or Log In before accessing the public website.
 */
export default function BrowseAsUserModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 9000,
              background: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(6px)',
            }}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.88, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 30 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'fixed', inset: 0, zIndex: 9001,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 20, pointerEvents: 'none',
            }}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                pointerEvents: 'auto',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: 22,
                padding: '36px 32px 28px',
                width: '100%', maxWidth: 420,
                boxShadow: '0 32px 80px rgba(0,0,0,0.25)',
                position: 'relative',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                style={{
                  position: 'absolute', top: 14, right: 14,
                  background: 'var(--bg-primary)', border: '1px solid var(--border-color)',
                  borderRadius: 8, width: 30, height: 30,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: 'var(--text-muted)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              >
                <MdClose size={16} />
              </button>

              {/* Icon */}
              <div style={{
                width: 58, height: 58, borderRadius: 16,
                background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.08))',
                border: '1px solid rgba(16,185,129,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <MdPublic size={30} color="#10b981" />
              </div>

              {/* Heading */}
              <h2 style={{
                fontSize: 20, fontWeight: 900, textAlign: 'center',
                color: 'var(--text-primary)', marginBottom: 10, letterSpacing: '-0.4px',
              }}>
                Account Required to Browse
              </h2>
              <p style={{
                fontSize: 13.5, color: 'var(--text-secondary)', textAlign: 'center',
                lineHeight: 1.7, marginBottom: 26,
              }}>
                To explore the <strong style={{ color: 'var(--text-primary)' }}>ManufactoCRM</strong> website,
                you need a free account. Sign up in seconds or log in if you already have one.
              </p>

              {/* Divider with label */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
              }}>
                <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }} />
                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Choose an option</span>
                <div style={{ flex: 1, height: 1, background: 'var(--border-color)' }} />
              </div>

              {/* CTA Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

                {/* Sign Up — primary */}
                <Link
                  to="/register"
                  onClick={onClose}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '13px', borderRadius: 12,
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: '#fff', textDecoration: 'none',
                    fontSize: 14, fontWeight: 700,
                    boxShadow: '0 6px 20px rgba(99,102,241,0.35)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(99,102,241,0.5)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(99,102,241,0.35)'; }}
                >
                  <MdPersonAdd size={18} />
                  Create Free Account — Sign Up
                </Link>

                {/* Login — secondary */}
                <Link
                  to="/login"
                  onClick={onClose}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '12px', borderRadius: 12,
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)', textDecoration: 'none',
                    fontSize: 14, fontWeight: 600,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#6366f1'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                >
                  <MdLogin size={18} />
                  Already have an account? Sign In
                </Link>
              </div>

              {/* Footer note */}
              <p style={{
                fontSize: 11.5, color: 'var(--text-muted)', textAlign: 'center',
                marginTop: 18, lineHeight: 1.6,
              }}>
                🔒 Free forever · No credit card required · Cancel anytime
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
