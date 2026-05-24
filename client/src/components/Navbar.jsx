import { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MdMenu, MdNotifications, MdSearch, MdLightMode, MdDarkMode } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getInitials, getRoleLabel } from '../utils/helpers';
import API from '../services/api';
import toast from 'react-hot-toast';

const pageNames = {
  '/dashboard': 'Dashboard',
  '/leads': 'Lead Management',
  '/pipeline': 'Sales Pipeline',
  '/analytics': 'Analytics',
  '/team': 'Team Performance',
  '/ai': 'AI Sales Assistant',
  '/settings': 'Settings',
  '/profile': 'Profile',
};

const mockLeads = [
  { _id: '1', companyName: 'Tata Motors', clientName: 'Rajesh Kumar', estimatedDealValue: 850000 },
  { _id: '2', companyName: 'Sun Pharma', clientName: 'Dr. Nisha Shah', estimatedDealValue: 920000 },
  { _id: '3', companyName: 'JSW Steel', clientName: 'Abhishek Nair', estimatedDealValue: 1200000 },
];

const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const pageName = pageNames[pathname] || (pathname.startsWith('/leads/') ? 'Lead Details' : 'ManufactoCRM AI');

  // Profile Dropdown States
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileRef = useRef(null);

  // Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Notification States
  const [notifications, setNotifications] = useState([
    { id: 1, text: "JSW Steel lead requires urgent BDA follow-up today!", time: "10m ago", read: false },
    { id: 2, text: "Sun Pharma proposal sent successfully by Sneha!", time: "1h ago", read: false },
    { id: 3, text: "Tata Motors status updated to Closed Won 🎉", time: "3h ago", read: false }
  ]);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const searchRef = useRef(null);
  const notifRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

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
        // Fallback search
        const filtered = mockLeads.filter(l => 
          l.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.clientName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filtered);
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read! 🔔', { id: 'notif-read' });
  };

  return (
    <header style={{
      height: 60, display: 'flex', alignItems: 'center',
      padding: '0 24px',
      background: 'var(--glass-bg)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 50,
      transition: 'all 0.3s ease'
    }}>
      {/* LEFT — page title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1 }}>
        <button
          onClick={onMenuToggle}
          className="show-mobile"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 4 }}
        >
          <MdMenu size={22} />
        </button>
        <div>
          <h1 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif" }}>{pageName}</h1>
        </div>
      </div>

      {/* CENTER — Search Bar */}
      <div ref={searchRef} style={{ position: 'relative' }} className="hidden-mobile">
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px',
          background: 'var(--bg-secondary)', borderRadius: 8,
          border: '1px solid var(--border-color)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.01)',
          width: 260
        }}>
          <MdSearch size={15} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search leads, companies..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            style={{
              border: 'none', background: 'transparent', outline: 'none',
              fontSize: 12, color: 'var(--text-primary)', width: '100%', fontWeight: 500
            }}
          />
        </div>

        {/* Search Dropdown Overlay */}
        <AnimatePresence>
          {showSearchDropdown && (searchQuery.trim() !== '') && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              style={{
                position: 'absolute', top: '100%', left: 0, width: 260,
                background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                padding: 8, marginTop: 6, zIndex: 100
              }}
            >
              {searching ? (
                <div style={{ padding: 12, textAlign: 'center', color: 'var(--text-muted)', fontSize: 11, fontWeight: 600 }}>
                  <div style={{ width: 14, height: 14, border: '2px solid rgba(79,70,229,0.1)', borderTop: '2px solid #4f46e5', borderRadius: '50%', animation: 'spin 0.6s linear infinite', margin: '0 auto 6px' }} />
                  Searching...
                </div>
              ) : searchResults.length === 0 ? (
                <div style={{ padding: 12, textAlign: 'center', color: '#94a3b8', fontSize: 12, fontWeight: 500 }}>
                  No matching leads found 📭
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, padding: '4px 8px', textTransform: 'uppercase', letterSpacing: 0.5 }}>Search Results ({searchResults.length})</div>
                  {searchResults.slice(0, 5).map((lead) => (
                    <Link
                      key={lead._id}
                      to={`/leads/${lead._id}`}
                      onClick={() => {
                        setShowSearchDropdown(false);
                        setSearchQuery('');
                      }}
                      style={{
                        display: 'block', padding: '8px 10px', borderRadius: 8,
                        textDecoration: 'none', color: 'inherit', transition: 'background 0.2s'
                      }}
                      className="search-item-hover"
                    >
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{lead.companyName}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 1 }}>{lead.clientName} · <span style={{ color: '#10b981', fontWeight: 600 }}>{lead.estimatedDealValue ? `₹${(lead.estimatedDealValue/100000).toFixed(1)}L` : '—'}</span></div>
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* RIGHT — Theme + Notifications + Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, justifyContent: 'flex-end' }}>
        {/* Global Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
            borderRadius: 8, padding: 8, cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.01)',
            transition: 'all 0.2s'
          }}
          title="Toggle dark/light theme"
        >
          {isDark ? <MdLightMode size={16} /> : <MdDarkMode size={16} />}
        </button>

        {/* Notifications */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            style={{
              position: 'relative', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
              borderRadius: 8, padding: 8, cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex',
              boxShadow: '0 1px 3px rgba(0,0,0,0.01)', transition: 'all 0.2s'
            }}
          >
            <MdNotifications size={16} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: 5, right: 5, width: 6, height: 6, borderRadius: '50%',
                background: 'var(--accent-purple)', border: '1.5px solid var(--bg-secondary)'
              }} />
            )}
          </button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotifDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                style={{
                  position: 'absolute', top: '100%', right: 0, width: 300,
                  background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                  borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  padding: 12, marginTop: 6, zIndex: 100
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, borderBottom: '1px solid var(--border-color)', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      style={{ border: 'none', background: 'transparent', color: 'var(--accent-blue)', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 240, overflowY: 'auto' }}>
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item));
                        setShowNotifDropdown(false);
                      }}
                      style={{
                        padding: 8, borderRadius: 8, cursor: 'pointer',
                        background: n.read ? 'transparent' : 'rgba(99, 102, 241, 0.05)',
                        transition: 'background 0.2s', position: 'relative'
                      }}
                      className="notif-item-hover"
                    >
                      <div style={{ fontSize: 11.5, fontWeight: n.read ? 500 : 700, color: 'var(--text-primary)', paddingRight: 10, lineHeight: 1.4 }}>
                        {n.text}
                      </div>
                      <div style={{ fontSize: 9, color: 'var(--text-muted)', marginTop: 4, fontWeight: 600 }}>{n.time}</div>
                      {!n.read && (
                        <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-purple)' }} />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Avatar with Dropdown */}
        <div ref={profileRef} style={{ position: 'relative' }}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' }}
            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          >
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: user?.profilePic ? `url(${user.profilePic}) center/cover no-repeat` : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0, overflow: 'hidden'
            }}>
              {!user?.profilePic && getInitials(user?.name)}
            </div>
            <div className="hidden-mobile">
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{user?.name?.split(' ')[0]}</div>
              <div style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 500 }}>{getRoleLabel(user?.role)}</div>
            </div>
          </div>

          <AnimatePresence>
            {showProfileDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                style={{
                  position: 'absolute', top: '100%', right: 0, width: 220,
                  background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                  borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  padding: 8, marginTop: 6, zIndex: 100
                }}
              >
                <div style={{ padding: '8px 12px 10px', borderBottom: '1px solid var(--border-color)', marginBottom: 6 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)' }}>{user?.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <button
                    onClick={() => { setShowProfileDropdown(false); navigate('/profile'); }}
                    className="dropdown-item-hover"
                    style={{
                      display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px',
                      borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer',
                      fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)', transition: 'background 0.2s'
                    }}
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => { setShowProfileDropdown(false); navigate('/settings'); }}
                    className="dropdown-item-hover"
                    style={{
                      display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px',
                      borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer',
                      fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)', transition: 'background 0.2s'
                    }}
                  >
                    Account Settings
                  </button>
                  <button
                    onClick={() => { setShowProfileDropdown(false); logout(); toast.success('Logged out successfully'); navigate('/login'); }}
                    className="dropdown-item-hover"
                    style={{
                      display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px',
                      borderRadius: 8, border: 'none', background: 'transparent', cursor: 'pointer',
                      fontSize: 12.5, fontWeight: 600, color: '#ef4444', transition: 'background 0.2s'
                    }}
                  >
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        .search-item-hover:hover { background: #f1f5f9; }
        .notif-item-hover:hover { background: #f1f5f9; }
        .dropdown-item-hover:hover { background: #edf2ff; color: #4f46e5 !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </header>
  );};

export default Navbar;
