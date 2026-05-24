import { BrowserRouter, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import { Toaster, ToastBar, toast } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppLayout from './layouts/AppLayout';
import PublicLayout from './layouts/PublicLayout';
import AIAssistantWidget from './components/AIAssistantWidget';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';

// ─── Auth Pages ───────────────────────────────────────────────
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Unauthorized from './pages/Unauthorized';
import CompleteProfile from './pages/CompleteProfile';

// ─── Role Dashboards ─────────────────────────────────────────
import AdminDashboard    from './pages/admin/AdminDashboard';
import TeamLeadDashboard from './pages/teamlead/TeamLeadDashboard';
import SalesDashboard    from './pages/sales/SalesDashboard';

// ─── Shared CRM Pages ────────────────────────────────────────
import Dashboard   from './pages/Dashboard';
import Leads       from './pages/Leads';
import LeadDetails from './pages/LeadDetails';
import Pipeline    from './pages/Pipeline';
import Analytics   from './pages/Analytics';
import Team        from './pages/Team';
import AIAssistant from './pages/AIAssistant';
import Settings    from './pages/Settings';
import Profile     from './pages/Profile';
import Reports     from './pages/Reports';
import RoleManagement from './pages/RoleManagement';
import NotFound    from './pages/NotFound';

// ─── Public Website Pages ─────────────────────────────────────
import Home         from './pages/public/Home';
import About        from './pages/public/About';
import Features     from './pages/public/Features';
import Pricing      from './pages/public/Pricing';
import Contact      from './pages/public/Contact';
import Careers      from './pages/public/Careers';
import FAQ          from './pages/public/FAQ';
import HelpCenter   from './pages/public/HelpCenter';
import Privacy      from './pages/public/Privacy';
import Terms        from './pages/public/Terms';
import Blog         from './pages/public/Blog';
import Testimonials from './pages/public/Testimonials';
import Users        from './pages/public/Users';

// ============================================================
// GUEST ROUTE — Redirect logged-in users to their dashboard
// ============================================================
function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) {
    const routes = { admin: '/admin/dashboard', team_lead: '/teamlead/dashboard', sales_executive: '/sales/dashboard', webpage: '/home' };
    return <Navigate to={routes[user.role] || '/home'} replace />;
  }
  return children;
}

// ============================================================
// AI Widget — only on /users page
// ============================================================
function AIWidgetGate() {
  const location = useLocation();
  if (location.pathname !== '/users') return null;
  return <AIAssistantWidget />;
}

// ============================================================
// Smart Redirect — after login, goes to role's dashboard
// ============================================================
function SmartRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const routes = { admin: '/admin/dashboard', team_lead: '/teamlead/dashboard', sales_executive: '/sales/dashboard', webpage: '/home' };
  return <Navigate to={routes[user.role] || '/sales/dashboard'} replace />;
}

// ============================================================
// Lead Details Redirect — redirects root /leads/:id to role prefix
// ============================================================
function LeadDetailsRedirect() {
  const { id } = useParams();
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const routes = { admin: `/admin/leads/${id}`, team_lead: `/teamlead/leads/${id}`, sales_executive: `/sales/leads/${id}` };
  return <Navigate to={routes[user.role] || `/sales/leads/${id}`} replace />;
}

// ============================================================
// Leads List Redirect — redirects root /leads to role prefix
// ============================================================
function LeadsRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  const routes = { admin: '/admin/leads', team_lead: '/teamlead/leads', sales_executive: '/sales/leads' };
  return <Navigate to={routes[user.role] || '/sales/leads'} replace />;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>

            {/* ============================================================
                ROOT — Always redirect to /login (no landing page by default)
            ============================================================ */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* ============================================================
                AUTH PAGES — Guests only; rendered WITHOUT any navbar/footer
                Login, Register, ForgotPassword have their own minimal header
            ============================================================ */}
            <Route path="/login"           element={<Login />} />
            <Route path="/register"        element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Unauthorized page — always accessible */}
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Complete Profile — for new OAuth users to fill role/phone/address */}
            <Route path="/complete-profile" element={<ProtectedRoute><CompleteProfile /></ProtectedRoute>} />

            {/* ============================================================
                PUBLIC WEBSITE — No auth required, has full navbar/footer
            ============================================================ */}
            <Route element={<ProtectedRoute><PublicLayout /></ProtectedRoute>}>
              <Route path="/home"         element={<Home />} />
              <Route path="/about"        element={<About />} />
              <Route path="/features"     element={<Features />} />
              <Route path="/pricing"      element={<Pricing />} />
              <Route path="/contact"      element={<Contact />} />
              <Route path="/careers"      element={<Careers />} />
              <Route path="/faq"          element={<FAQ />} />
              <Route path="/help"         element={<HelpCenter />} />
              <Route path="/privacy"      element={<Privacy />} />
              <Route path="/terms"        element={<Terms />} />
              <Route path="/blog"         element={<Blog />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/users"        element={<Users />} />
            </Route>

            {/* ============================================================
                ADMIN ROUTES — admin role only
            ============================================================ */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <RoleBasedRoute role="admin">
                  <AppLayout sidebarRole="admin" />
                </RoleBasedRoute>
              </ProtectedRoute>
            }>
              <Route index           element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="leads"     element={<Leads />} />
              <Route path="leads/:id" element={<LeadDetails />} />
              <Route path="pipeline"  element={<Pipeline />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="team"      element={<Team />} />
              <Route path="ai"        element={<AIAssistant />} />
              <Route path="settings"  element={<Settings />} />
              <Route path="profile"   element={<Profile />} />
              <Route path="roles"     element={<RoleManagement />} />
              <Route path="reports"   element={<Reports />} />
              <Route path="users"     element={<Team />} />
            </Route>

            {/* ============================================================
                TEAM LEAD ROUTES — team_lead role only
            ============================================================ */}
            <Route path="/teamlead" element={
              <ProtectedRoute>
                <RoleBasedRoute role="team_lead">
                  <AppLayout sidebarRole="team_lead" />
                </RoleBasedRoute>
              </ProtectedRoute>
            }>
              <Route index           element={<Navigate to="/teamlead/dashboard" replace />} />
              <Route path="dashboard" element={<TeamLeadDashboard />} />
              <Route path="leads"     element={<Leads />} />
              <Route path="leads/:id" element={<LeadDetails />} />
              <Route path="pipeline"  element={<Pipeline />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="team"      element={<Team />} />
              <Route path="ai"        element={<AIAssistant />} />
              <Route path="settings"  element={<Settings />} />
              <Route path="profile"   element={<Profile />} />
              <Route path="reports"   element={<Reports />} />
            </Route>

            {/* ============================================================
                SALES EXECUTIVE ROUTES — sales_executive role only
            ============================================================ */}
            <Route path="/sales" element={
              <ProtectedRoute>
                <RoleBasedRoute role="sales_executive">
                  <AppLayout sidebarRole="sales_executive" />
                </RoleBasedRoute>
              </ProtectedRoute>
            }>
              <Route index           element={<Navigate to="/sales/dashboard" replace />} />
              <Route path="dashboard" element={<SalesDashboard />} />
              <Route path="leads"     element={<Leads />} />
              <Route path="leads/:id" element={<LeadDetails />} />
              <Route path="pipeline"  element={<Pipeline />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="ai"        element={<AIAssistant />} />
              <Route path="settings"  element={<Settings />} />
              <Route path="profile"   element={<Profile />} />
            </Route>

            {/* ============================================================
                LEGACY /app/* routes — redirect to role-specific paths
            ============================================================ */}
            <Route path="/app/*"     element={<ProtectedRoute><SmartRedirect /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><SmartRedirect /></ProtectedRoute>} />
            <Route path="/leads"     element={<ProtectedRoute><LeadsRedirect /></ProtectedRoute>} />
            <Route path="/leads/:id" element={<ProtectedRoute><LeadDetailsRedirect /></ProtectedRoute>} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />

          </Routes>

          <AIWidgetGate />
        </BrowserRouter>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 600,
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#1e293b' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#1e293b' } },
            loading: { iconTheme: { primary: '#6366f1', secondary: '#1e293b' } },
            duration: 3500,
          }}
        >
          {(t) => (
            <ToastBar toast={t}>
              {({ icon, message }) => (
                <>
                  {icon}
                  {message}
                  {t.type !== 'loading' && (
                    <button
                      onClick={() => toast.dismiss(t.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        padding: '4px',
                        marginLeft: '8px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#f1f5f9';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#94a3b8';
                        e.currentTarget.style.background = 'transparent';
                      }}
                      aria-label="Close"
                    >
                      ✕
                    </button>
                  )}
                </>
              )}
            </ToastBar>
          )}
        </Toaster>

      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
