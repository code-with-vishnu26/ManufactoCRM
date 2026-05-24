import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

// ============================================================
// ROLE → DASHBOARD ROUTE MAP
// ============================================================
export const DASHBOARD_ROUTES = {
  admin:           '/admin/dashboard',
  team_lead:       '/teamlead/dashboard',
  sales_executive: '/sales/dashboard',
  webpage:         '/home',
};


// Role display configs
export const ROLE_CONFIG = {
  admin:           { label: 'Admin',           color: '#ef4444', bg: 'linear-gradient(135deg,#ef4444,#dc2626)', icon: '👑' },
  team_lead:       { label: 'Team Lead',       color: '#8b5cf6', bg: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', icon: '🎯' },
  sales_executive: { label: 'Sales Executive', color: '#6366f1', bg: 'linear-gradient(135deg,#6366f1,#4f46e5)', icon: '💼' },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true); // true on first mount

  // ============================================================
  // Get dashboard route for a given role
  // ============================================================
  const getDashboardRoute = useCallback((role) => {
    return DASHBOARD_ROUTES[role] || '/sales/dashboard';
  }, []);

  // ============================================================
  // Save session to localStorage
  // ============================================================
  const saveSession = (token, user) => {
    localStorage.setItem('manufacto_token', token);
    localStorage.setItem('manufacto_user', JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  // ============================================================
  // Clear session from localStorage
  // ============================================================
  const clearSession = useCallback(() => {
    localStorage.removeItem('manufacto_token');
    localStorage.removeItem('manufacto_user');
    setToken(null);
    setUser(null);
  }, []);

  // ============================================================
  // Validate token on app load — auto-restore OR auto-logout
  // ============================================================
  useEffect(() => {
    const bootstrapAuth = async () => {
      const storedToken = localStorage.getItem('manufacto_token');

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        // Validate token with server
        const { data } = await API.get('/auth/me', {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        if (data.success && data.user) {
          setToken(storedToken);
          setUser(data.user);
          localStorage.setItem('manufacto_user', JSON.stringify(data.user));
        } else {
          clearSession();
        }
      } catch (err) {
        clearSession();
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, [clearSession]);

  // ============================================================
  // LOGIN
  // ============================================================
  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      if (data.success) {
        saveSession(data.token, data.user);
        return { success: true, dashboardRoute: data.dashboardRoute || getDashboardRoute(data.user.role) };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      const isNotVerified = err.response?.data?.isNotVerified;
      const email = err.response?.data?.email;
      return { success: false, message: msg, isNotVerified, email };
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // REGISTER
  // ============================================================
  const register = async (formData) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', formData);
      if (data.success) {
        saveSession(data.token, data.user);
        return {
          success: true,
          dashboardRoute: data.dashboardRoute || getDashboardRoute(data.user.role),
          message: data.message,
        };
      }
      return { success: false, message: data.message || 'Registration failed' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // VERIFY EMAIL CODE
  // ============================================================
  const verifyCode = async (email, code) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/verify', { email, code });
      if (data.success) {
        saveSession(data.token, data.user);
        return { success: true, dashboardRoute: data.dashboardRoute || getDashboardRoute(data.user.role) };
      }
      return { success: false, message: data.message || 'Verification failed' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Verification failed. Please try again.';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // SOCIAL LOGIN
  // Supports two flows:
  //   1. Direct token  — real OAuth callback already verified user on server,
  //      passes { _directToken, _directUser, _dashboardRoute } to skip an extra API call.
  //   2. Legacy name/email — social popup sends profile, we POST to /auth/social-login.
  // ============================================================
  const socialLogin = async (socialData) => {
    setLoading(true);
    try {
      // ── Flow 1: real OAuth — server already authenticated the user ──
      if (socialData._directToken && socialData._directUser) {
        saveSession(socialData._directToken, socialData._directUser);
        return {
          success: true,
          dashboardRoute: socialData._dashboardRoute || getDashboardRoute(socialData._directUser.role),
        };
      }

      // ── Flow 2: legacy mock / name+email social login ──
      const { data } = await API.post('/auth/social-login', socialData);
      if (data.success) {
        saveSession(data.token, data.user);
        return { success: true, dashboardRoute: data.dashboardRoute || getDashboardRoute(data.user.role) };
      }
      return { success: false, message: data.message || 'Social login failed' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Social login failed. Please try again.';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // COMPLETE PROFILE (for new OAuth users)
  // ============================================================
  const completeProfile = async (profileData) => {
    setLoading(true);
    try {
      const storedToken = localStorage.getItem('manufacto_token');
      const { data } = await API.put('/auth/complete-profile', profileData, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      if (data.success) {
        saveSession(storedToken, data.user);
        return { success: true, dashboardRoute: data.dashboardRoute || getDashboardRoute(data.user.role) };
      }
      return { success: false, message: data.message || 'Profile completion failed' };
    } catch (err) {
      const msg = err.response?.data?.message || 'Profile completion failed. Please try again.';
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };


  // ============================================================
  // LOGOUT
  // ============================================================
  const logout = useCallback(() => {
    clearSession();
    window.location.replace('/login');
  }, [clearSession]);

  // ============================================================
  // Check if current user has a specific role
  // ============================================================
  const hasRole = useCallback((...roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      verifyCode,
      socialLogin,
      completeProfile,
      logout,
      hasRole,
      getDashboardRoute,
      ROLE_CONFIG,
      DASHBOARD_ROUTES,
      isAuthenticated: !!user,
      canManage: user ? ['admin', 'team_lead'].includes(user.role) : false,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within ThemeProvider');
  return ctx;
};
