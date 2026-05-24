import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdDashboard, MdPeople, MdViewKanban, MdBarChart, MdGroups,
  MdSmartToy, MdSettings, MdLogout, MdChevronLeft, MdChevronRight,
  MdClose, MdAdminPanelSettings, MdArticle,
  MdSupportAgent, MdInsights, MdAttachMoney,
  MdRocketLaunch, MdKeyboardArrowRight,
} from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils/helpers';
import toast from 'react-hot-toast';

/* ─── Role config ─────────────────────────────────────────────────── */
const ROLE_CONFIG = {
  admin:           { gradient: 'linear-gradient(135deg,#ef4444,#dc2626)', accent: '#ef4444', label: 'Admin',         emoji: '👑' },
  team_lead:       { gradient: 'linear-gradient(135deg,#8b5cf6,#6d28d9)', accent: '#8b5cf6', label: 'Team Lead',     emoji: '🎯' },
  sales_executive: { gradient: 'linear-gradient(135deg,#4f46e5,#6366f1)', accent: '#6366f1', label: 'Sales Exec',    emoji: '⚡' },
};

/* ─── Nav items per role ──────────────────────────────────────────── */
const NAV_ITEMS = {
  admin: [
    { to: '/admin/dashboard', icon: MdDashboard,         label: 'Dashboard',       section: 'main' },
    { to: '/admin/leads',     icon: MdPeople,             label: 'Leads',           section: 'main' },
    { to: '/admin/pipeline',  icon: MdViewKanban,         label: 'Pipeline',        section: 'main' },
    { to: '/admin/analytics', icon: MdBarChart,           label: 'Analytics',       section: 'main' },
    { to: '/admin/team',      icon: MdGroups,             label: 'Team',            section: 'main' },
    { to: '/admin/ai',        icon: MdSmartToy,           label: 'AI Assistant',    section: 'tools' },
    { to: '/admin/roles',     icon: MdAdminPanelSettings, label: 'Role Management', section: 'tools' },
    { to: '/admin/reports',   icon: MdArticle,            label: 'Reports',         section: 'tools' },
    { to: '/admin/settings',  icon: MdSettings,           label: 'Settings',        section: 'other' },
  ],
  team_lead: [
    { to: '/teamlead/dashboard', icon: MdDashboard,  label: 'Dashboard',    section: 'main' },
    { to: '/teamlead/leads',     icon: MdPeople,     label: 'Leads',        section: 'main' },
    { to: '/teamlead/pipeline',  icon: MdViewKanban, label: 'Pipeline',     section: 'main' },
    { to: '/teamlead/analytics', icon: MdBarChart,   label: 'Analytics',    section: 'main' },
    { to: '/teamlead/team',      icon: MdGroups,     label: 'My Team',      section: 'main' },
    { to: '/teamlead/ai',        icon: MdSmartToy,   label: 'AI Assistant', section: 'tools' },
    { to: '/teamlead/reports',   icon: MdArticle,    label: 'Reports',      section: 'tools' },
    { to: '/teamlead/settings',  icon: MdSettings,   label: 'Settings',     section: 'other' },
  ],
  sales_executive: [
    { to: '/sales/dashboard', icon: MdDashboard,  label: 'Dashboard',    section: 'main' },
    { to: '/sales/leads',     icon: MdPeople,     label: 'My Leads',     section: 'main' },
    { to: '/sales/pipeline',  icon: MdViewKanban, label: 'My Pipeline',  section: 'main' },
    { to: '/sales/analytics', icon: MdBarChart,   label: 'Analytics',    section: 'main' },
    { to: '/sales/ai',        icon: MdSmartToy,   label: 'AI Assistant', section: 'tools' },
    { to: '/sales/settings',  icon: MdSettings,   label: 'Settings',     section: 'other' },
  ],
};

/* ─── Section labels ─────────────────────────────────────────────── */
const SECTION_LABELS = { main: 'MAIN MENU', tools: 'TOOLS', other: 'GENERAL' };

/* ─── Main Component ──────────────────────────────────────────────── */
const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen, sidebarRole }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [spinning, setSpinning] = useState(false);

  const role = sidebarRole || user?.role || 'sales_executive';
  const rc = ROLE_CONFIG[role] || ROLE_CONFIG.sales_executive;
  const navItems = NAV_ITEMS[role] || NAV_ITEMS.sales_executive;

  // Group nav items by section
  const grouped = navItems.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

  const handleBrandClick = () => {
    if (spinning) return;
    setSpinning(true);
    setTimeout(() => setSpinning(false), 900);
  };

  const handleLogout = () => {
    toast.success('Logged out successfully 👋', { id: 'logout' });
    logout();
  };

  const handleProfileClick = () => {
    const prefix = role === 'admin' ? 'admin' : role === 'team_lead' ? 'teamlead' : 'sales';
    navigate(`/${prefix}/profile`);
    if (setMobileOpen) setMobileOpen(false);
  };

  /* ── Sidebar inner content ── */
  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* ── Brand Header ── */}
      <div
        onClick={handleBrandClick}
        style={{
          padding: collapsed ? '18px 0' : '20px 18px 16px',
          display: 'flex', alignItems: 'center',
          gap: 12, cursor: 'pointer', userSelect: 'none',
          justifyContent: collapsed ? 'center' : 'flex-start',
          borderBottom: '1px solid var(--border-color)',
          flexShrink: 0,
        }}
      >
        <motion.div
          animate={{ rotate: spinning ? 360 : 0 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          style={{
            width: 38, height: 38, borderRadius: 11, flexShrink: 0,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(99,102,241,0.4)',
          }}
        >
          <MdRocketLaunch size={20} color="white" />
        </motion.div>

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div style={{
                fontSize: 15, fontWeight: 900,
                color: 'var(--text-primary)',
                letterSpacing: '-0.4px', lineHeight: 1.15,
              }}>
                Manufacto<span style={{ color: '#6366f1' }}>CRM</span>
                <span style={{
                  fontSize: 10, fontWeight: 700, marginLeft: 4,
                  background: 'linear-gradient(90deg,#6366f1,#a78bfa)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>AI</span>
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.3px', marginTop: 1 }}>
                AI-Powered BDA System
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Role Badge ── */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ padding: '12px 18px 4px', flexShrink: 0 }}
          >
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: rc.gradient,
              padding: '5px 12px', borderRadius: 20,
              fontSize: 11, fontWeight: 700, color: 'white',
              letterSpacing: '0.3px',
              boxShadow: `0 4px 14px ${rc.accent}40`,
            }}>
              <span style={{ fontSize: 12 }}>{rc.emoji}</span>
              {rc.label}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Nav Items ── */}
      <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px 10px' }}>
        {Object.entries(grouped).map(([section, items], gi) => (
          <div key={section} style={{ marginBottom: 6 }}>
            {/* Section Label */}
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    fontSize: 9.5, fontWeight: 700, color: 'var(--text-muted)',
                    letterSpacing: '0.08em', padding: '10px 10px 4px',
                    textTransform: 'uppercase',
                  }}
                >
                  {SECTION_LABELS[section]}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Nav Links */}
            {items.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                title={collapsed ? label : ''}
                onClick={() => setMobileOpen && setMobileOpen(false)}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center',
                  gap: 11,
                  padding: collapsed ? '11px 0' : '10px 12px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  borderRadius: 10,
                  marginBottom: 2,
                  textDecoration: 'none',
                  fontSize: 13.5,
                  fontWeight: isActive ? 700 : 550,
                  color: isActive ? rc.accent : 'var(--text-secondary)',
                  background: isActive
                    ? `${rc.accent}14`
                    : 'transparent',
                  borderLeft: isActive && !collapsed ? `3px solid ${rc.accent}` : '3px solid transparent',
                  transition: 'all 0.18s ease',
                  position: 'relative',
                })}
                className="sidebar-nav-item"
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={19}
                      style={{ flexShrink: 0, color: isActive ? rc.accent : 'var(--text-secondary)' }}
                    />
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          style={{ flex: 1, whiteSpace: 'nowrap' }}
                        >
                          {label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {isActive && !collapsed && (
                      <MdKeyboardArrowRight size={16} style={{ flexShrink: 0, color: rc.accent, opacity: 0.7 }} />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* ── User Footer ── */}
      <div style={{
        padding: collapsed ? '12px 0' : '12px 10px',
        borderTop: '1px solid var(--border-color)',
        flexShrink: 0,
      }}>
        {/* Profile Row */}
        <motion.div
          onClick={handleProfileClick}
          whileHover={{ background: `${rc.accent}0e` }}
          whileTap={{ scale: 0.98 }}
          style={{
            display: 'flex', alignItems: 'center',
            gap: 10,
            padding: collapsed ? '10px 0' : '10px 12px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            borderRadius: 12,
            cursor: 'pointer',
            marginBottom: 4,
            transition: 'background 0.2s',
          }}
        >
          {/* Avatar */}
          <div style={{
            width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
            background: user?.profilePic
              ? `url(${user.profilePic}) center/cover no-repeat`
              : rc.gradient,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 800, color: 'white',
            boxShadow: `0 4px 12px ${rc.accent}40`,
            border: `2px solid ${rc.accent}50`,
          }}>
            {!user?.profilePic && getInitials(user?.name)}
          </div>

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ overflow: 'hidden', flex: 1 }}
              >
                <div style={{
                  fontSize: 13, fontWeight: 800, color: 'var(--text-primary)',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {user?.name?.split(' ')[0] || 'User'}
                </div>
                <div style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 600, marginTop: 1 }}>
                  {user?.email?.split('@')[0] || rc.label}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Logout Button */}
        <motion.button
          onClick={handleLogout}
          whileHover={{ background: 'rgba(239,68,68,0.1)' }}
          whileTap={{ scale: 0.97 }}
          style={{
            width: '100%', border: 'none',
            background: 'transparent',
            display: 'flex', alignItems: 'center',
            padding: collapsed ? '10px 0' : '9px 12px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: 10, borderRadius: 10,
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
            color: '#ef4444',
            transition: 'background 0.2s',
          }}
          title={collapsed ? 'Logout' : ''}
        >
          <MdLogout size={18} style={{ flexShrink: 0 }} />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Copyright */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                fontSize: 9, textAlign: 'center', color: 'var(--text-muted)',
                marginTop: 12, paddingTop: 10,
                borderTop: '1px solid var(--border-color)',
                opacity: 0.55, fontWeight: 500,
              }}
            >
              © 2026 ManufactoCRM AI. All rights reserved.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <motion.aside
        animate={{ width: collapsed ? 62 : 232 }}
        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
        style={{
          height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 100,
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-color)',
          boxShadow: '4px 0 24px rgba(0,0,0,0.05)',
          overflow: 'visible', display: 'flex', flexDirection: 'column',
        }}
        className="hidden-mobile"
      >
        <div style={{
          display: 'flex', flexDirection: 'column', height: '100%',
          width: '100%', overflowX: 'hidden', overflowY: 'hidden',
        }}>
          <SidebarContent />
        </div>

        {/* Collapse Toggle */}
        <motion.button
          onClick={() => setCollapsed(!collapsed)}
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.95 }}
          style={{
            position: 'absolute', right: -13, top: '50%',
            transform: 'translateY(-50%)',
            width: 26, height: 26, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: '2px solid var(--bg-secondary)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(99,102,241,0.45)',
            zIndex: 10,
          }}
        >
          {collapsed
            ? <MdChevronRight size={15} color="white" />
            : <MdChevronLeft size={15} color="white" />
          }
        </motion.button>
      </motion.aside>

      {/* ── Mobile Sidebar Overlay ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(4px)', zIndex: 200,
              }}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              style={{
                position: 'fixed', left: 0, top: 0, bottom: 0, width: 232,
                background: 'var(--bg-secondary)',
                borderRight: '1px solid var(--border-color)',
                boxShadow: '8px 0 40px rgba(0,0,0,0.15)',
                zIndex: 300, display: 'flex', flexDirection: 'column',
              }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                style={{
                  position: 'absolute', top: 12, right: 12,
                  background: 'var(--bg-primary)', border: '1px solid var(--border-color)',
                  borderRadius: 8, padding: 6, cursor: 'pointer',
                  color: 'var(--text-secondary)', display: 'flex',
                }}
              >
                <MdClose size={16} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Sidebar Styles ── */}
      <style>{`
        .sidebar-nav-item:hover {
          background: rgba(99,102,241,0.07) !important;
          color: var(--text-primary) !important;
        }
        .sidebar-nav-item:hover svg {
          color: var(--accent-blue) !important;
        }
        nav::-webkit-scrollbar { width: 3px; }
        nav::-webkit-scrollbar-track { background: transparent; }
        nav::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 6px; }
      `}</style>
    </>
  );
};

export default Sidebar;
