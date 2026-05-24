import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MdHome, MdSearchOff } from 'react-icons/md';

const NotFound = () => (
  <div style={{
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#0a0a0f', textAlign: 'center', padding: 20
  }}>
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
      <div style={{ fontSize: 80, marginBottom: 16 }}>🔍</div>
      <h1 style={{ fontSize: 80, fontWeight: 900, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 8 }}>404</h1>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: '#e2e8f0', marginBottom: 10 }}>Page Not Found</h2>
      <p style={{ color: '#64748b', fontSize: 15, marginBottom: 28 }}>The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', padding: '12px 24px', borderRadius: 12, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
        <MdHome size={18} /> Back to Dashboard
      </Link>
    </motion.div>
  </div>
);

export default NotFound;
