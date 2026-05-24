import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  MdMenu, 
  MdClose, 
  MdRocketLaunch, 
  MdNotifications, 
  MdDarkMode, 
  MdLightMode, 
  MdPerson, 
  MdDashboard, 
  MdSettings, 
  MdLogout,
  MdCheckCircle,
  MdOutlineClearAll,
  MdSearch
} from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../services/api';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Features', to: '/features' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'About', to: '/about' },
  { label: 'BDAs Directory', to: '/users' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
];

export default function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Auth & Theme contexts
  const { user, logout, getDashboardRoute } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  // Dropdowns state
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  // Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Refs for click outside
  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const searchRef = useRef(null);

  // Notifications state
  const [notifications, setNotifications] = useState([
    { id: 1, text: "JSW Steel lead requires urgent BDA follow-up today!", time: "10m ago", read: false },
    { id: 2, text: "Sun Pharma proposal sent successfully by Sneha!", time: "1h ago", read: false },
    { id: 3, text: "Tata Motors status updated to Closed Won 🎉", time: "3h ago", read: false },
    { id: 4, text: "AI recommendation: Schedule a follow-up with Aditya Birla Group", time: "5h ago", read: false }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setShowProfileDropdown(false);
    setShowNotifDropdown(false);
    setShowSearchDropdown(false);
    setSearchQuery('');
  }, [location]);

  // Debounced Lead Search API Query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      setSearching(true);
      try {
        const { data } = await API.get('/leads', { params: { search: searchQuery } });
        setSearchResults(data.leads || []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read! 🔔', { id: 'pub-notif-read' });
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast.success('Notifications cleared! 📭', { id: 'pub-notif-clear' });
  };

  const handleLogout = () => {
    toast.success('Logged out successfully 👋');
    logout(); // logout() already calls window.location.replace('/login')
  };

  return (
    <div style={{ 
      background: 'var(--bg-primary)', 
      color: 'var(--text-primary)', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }}>
      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled 
          ? (isDark ? 'rgba(5,5,8,0.92)' : 'rgba(244,246,250,0.92)')
          : 'transparent',
        backdropFilter: 'blur(18px)',
        borderBottom: scrolled ? '1px solid var(--border-color)' : '1px solid transparent',
        transition: 'all 0.3s ease',
        padding: '0 2rem',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 68 }}>
          {/* Logo */}
          <div onClick={() => window.location.reload()} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, userSelect: 'none' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 18px rgba(99,102,241,0.45)',
            }}>
              <MdRocketLaunch size={20} color="#fff" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.18rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Manufacto<span style={{ color: 'var(--accent-blue)' }}>CRM</span>{' '}
              <span style={{ fontSize: '0.72rem', background: 'linear-gradient(90deg,#6366f1,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700 }}>AI</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.8rem' }} className="desktop-nav">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} style={{
                color: location.pathname === link.to ? 'var(--accent-blue)' : 'var(--text-secondary)',
                textDecoration: 'none', fontSize: '0.92rem', fontWeight: 650,
                transition: 'color 0.2s',
              }}
                onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.target.style.color = location.pathname === link.to ? 'var(--accent-blue)' : 'var(--text-secondary)'}
              >
                {link.label}
              </Link>
            ))}
          </div>



          {/* Action Buttons Block */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {/* Global Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: 10,
                padding: 8,
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
              }}
              title="Toggle dark/light theme"
              onMouseEnter={e => e.target.style.borderColor = 'var(--accent-purple)'}
              onMouseLeave={e => e.target.style.borderColor = 'var(--border-color)'}
            >
              {isDark ? <MdLightMode size={16} /> : <MdDarkMode size={16} />}
            </button>

            {/* CONDITIONAL AUTH HEADER LOGIC */}
            {!user ? (
              <>
                {/* Notification Bell for logged-out visitors */}
                <div ref={notifRef} style={{ position: 'relative' }}>
                  <button
                    onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 10, padding: 8, cursor: 'pointer',
                      color: 'var(--text-secondary)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      position: 'relative', transition: 'all 0.2s'
                    }}
                    title="Notifications"
                  >
                    <MdNotifications size={16} />
                    {unreadCount > 0 && (
                      <span style={{
                        position: 'absolute', top: 4, right: 4,
                        width: 8, height: 8, borderRadius: '50%',
                        background: '#ef4444', border: '1.5px solid var(--bg-secondary)'
                      }} />
                    )}
                  </button>

                  {showNotifDropdown && (
                    <div style={{
                      position: 'absolute', top: '100%', right: 0, width: 320,
                      background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                      borderRadius: 14, boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                      padding: 12, marginTop: 10, zIndex: 1000
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid var(--border-color)' }}>
                        <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>Notifications</span>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button onClick={markAllRead} style={{ background: 'none', border: 'none', fontSize: 11, color: 'var(--accent-blue)', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                            <MdCheckCircle size={13} /> Mark all read
                          </button>
                          <button onClick={clearAllNotifications} style={{ background: 'none', border: 'none', fontSize: 11, color: '#ef4444', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                            <MdOutlineClearAll size={13} /> Clear
                          </button>
                        </div>
                      </div>
                      {notifications.length === 0 ? (
                        <div style={{ padding: '18px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No notifications</div>
                      ) : (
                        notifications.map(n => (
                          <div key={n.id} style={{ padding: '9px 10px', borderRadius: 8, marginBottom: 4, background: n.read ? 'transparent' : 'rgba(99,102,241,0.05)', borderLeft: n.read ? 'none' : '3px solid #6366f1', display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <span style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: n.read ? 500 : 700, lineHeight: 1.4 }}>{n.text}</span>
                            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{n.time}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                <Link to="/login" style={{
                  color: 'var(--text-secondary)', textDecoration: 'none',
                  fontSize: '0.9rem', fontWeight: 650, padding: '8px 16px',
                  transition: 'color 0.2s',
                }}
                  onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
                >Login</Link>
                <Link to="/register" style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: '#fff', textDecoration: 'none', fontSize: '0.9rem',
                  fontWeight: 600, padding: '9px 22px', borderRadius: 10,
                  boxShadow: '0 4px 20px rgba(99,102,241,0.35)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                  onMouseEnter={e => { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 6px 28px rgba(99,102,241,0.5)'; }}
                  onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = '0 4px 20px rgba(99,102,241,0.35)'; }}
                >Get Started</Link>
              </>
            ) : (
              <>
                {/* Profile Dropdown Trigger */}
                <div ref={profileRef} style={{ position: 'relative' }}>
                  <div 
                    style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' }} 
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  >
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 700, color: 'white', flexShrink: 0, overflow: 'hidden'
                    }}>
                      {user.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
                    </div>
                  </div>

                  {/* Profile Dropdown Menu */}
                  {showProfileDropdown && (
                    <div style={{
                      position: 'absolute', top: '100%', right: 0, width: 220,
                      background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                      borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                      padding: 8, marginTop: 10, zIndex: 1000
                    }}>
                      <div style={{ padding: '8px 12px 10px', borderBottom: '1px solid var(--border-color)', marginBottom: 6 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>{user.name}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Link 
                          to={`/${user?.role === 'admin' ? 'admin' : user?.role === 'team_lead' ? 'teamlead' : 'sales'}/profile`}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', 
                            borderRadius: 8, color: 'var(--text-primary)', textDecoration: 'none',
                            fontSize: 12.5, fontWeight: 600, transition: 'background 0.2s'
                          }}
                          className="dropdown-item-hover-pub"
                        >
                          <MdPerson size={16} /> My Profile
                        </Link>
                        
                        {/* Dashboard link — goes to role-specific dashboard */}
                        <Link 
                          to={getDashboardRoute(user?.role)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', 
                            borderRadius: 8, color: 'var(--text-primary)', textDecoration: 'none',
                            fontSize: 12.5, fontWeight: 600, transition: 'background 0.2s'
                          }}
                          className="dropdown-item-hover-pub"
                        >
                          <MdDashboard size={16} /> My Dashboard
                        </Link>

                        {/* Profile link — uses role-based path */}
                        <Link 
                          to={`/${user?.role === 'admin' ? 'admin' : user?.role === 'team_lead' ? 'teamlead' : 'sales'}/profile`}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', 
                            borderRadius: 8, color: 'var(--text-primary)', textDecoration: 'none',
                            fontSize: 12.5, fontWeight: 600, transition: 'background 0.2s'
                          }}
                          className="dropdown-item-hover-pub"
                        >
                          <MdSettings size={16} /> Settings
                        </Link>



                        <button 
                          onClick={handleLogout}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', 
                            borderRadius: 8, color: '#ef4444', textDecoration: 'none',
                            width: '100%', border: 'none', background: 'transparent', textAlign: 'left',
                            fontSize: 12.5, fontWeight: 600, transition: 'background 0.2s', cursor: 'pointer'
                          }}
                          className="dropdown-item-hover-pub"
                        >
                          <MdLogout size={16} /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Hamburger for Mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'none', padding: 4 }}
              className="hamburger-btn"
            >
              {menuOpen ? <MdClose size={28} /> : <MdMenu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{
            position: 'absolute', top: 68, left: 0, right: 0,
            background: 'var(--bg-secondary)', backdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--border-color)',
            padding: '1rem 2rem 1.5rem',
          }}>
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} style={{
                display: 'block', padding: '12px 0', color: 'var(--text-primary)',
                textDecoration: 'none', fontSize: '1rem', fontWeight: 650,
                borderBottom: '1px solid var(--border-color)',
              }}>{link.label}</Link>
            ))}
            <div style={{ marginTop: '1rem', display: 'flex', gap: 12, flexDirection: 'column' }}>
              {!user ? (
                <>
                  <Link to="/login" style={{ textAlign: 'center', padding: '10px', border: '1px solid var(--accent-blue)', borderRadius: 10, color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: 600 }}>Login</Link>
                  <Link to="/register" style={{ textAlign: 'center', padding: '10px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', borderRadius: 10, color: '#fff', textDecoration: 'none', fontWeight: 600 }}>Get Started</Link>
                </>
              ) : (
                <>
                  <Link to={getDashboardRoute(user?.role)} style={{ textAlign: 'center', padding: '10px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: 10, color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600 }}>My Dashboard</Link>
                  <button onClick={handleLogout} style={{ textAlign: 'center', padding: '10px', background: 'linear-gradient(135deg,#ef4444,#dc2626)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Logout</button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, paddingTop: 68 }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{
        background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)',
        padding: '3rem 2rem 2rem',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MdRocketLaunch size={18} color="#fff" />
                </div>
                <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>ManufactoCRM <span style={{ color: 'var(--accent-blue)' }}>AI</span></span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7 }}>
                AI-powered CRM designed specifically for manufacturing excellence.
              </p>
            </div>
            {[
              { title: 'Product', links: [{ label: 'Features', to: '/features' }, { label: 'Pricing', to: '/pricing' }, { label: 'Changelog', to: '#' }, { label: 'Roadmap', to: '#' }] },
              { title: 'Company', links: [{ label: 'About', to: '/about' }, { label: 'Careers', to: '/careers' }, { label: 'Blog', to: '/blog' }, { label: 'Press', to: '#' }] },
              { title: 'Support', links: [{ label: 'Help Center', to: '/help' }, { label: 'FAQ', to: '/faq' }, { label: 'Contact', to: '/contact' }, { label: 'Status', to: '#' }] },
              { title: 'Legal', links: [{ label: 'Privacy', to: '/privacy' }, { label: 'Terms', to: '/terms' }, { label: 'Security', to: '#' }, { label: 'GDPR', to: '#' }] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ color: 'var(--text-primary)', fontWeight: 700, marginBottom: '1rem', fontSize: '0.9rem' }}>{col.title}</h4>
                {col.links.map(l => (
                  <div key={l.label} style={{ marginBottom: '0.5rem' }}>
                    <Link to={l.to} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                      onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
                    >{l.label}</Link>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>© 2026 ManufactoCRM AI. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style>{`
        .dropdown-item-hover-pub:hover {
          background: var(--bg-primary);
          color: var(--accent-blue) !important;
        }
        .search-item-hover:hover {
          background: var(--bg-primary);
          color: var(--accent-blue) !important;
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: block !important; }
        }
      `}</style>
    </div>
  );
}
