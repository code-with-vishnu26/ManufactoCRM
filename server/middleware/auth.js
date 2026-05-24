const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Role → allowed dashboard prefix
const ROLE_PREFIXES = {
  admin:           '/admin',
  team_lead:       '/teamlead',
  sales_executive: '/sales',
};

// ============================================================
// protect — verify JWT, attach user to req
// ============================================================
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account has been deactivated.' });
    }

    req.user = user;

    // Fire-and-forget lastActive update
    User.findByIdAndUpdate(decoded.id, { lastActive: new Date() }).catch(() => {});

    if (user.role === 'sales_executive') {
      try {
        const Lead = require('../models/Lead');
        const count = await Lead.countDocuments({ assignedEmployee: user._id });
        const totalLeads = await Lead.countDocuments({});
        if (count < totalLeads && totalLeads > 0) {
          const leadsToAssign = await Lead.find({ assignedEmployee: { $ne: user._id } });
          if (leadsToAssign.length > 0) {
            await Promise.all(leadsToAssign.map(lead => {
              lead.assignedEmployee = user._id;
              if (lead.statusHistory && lead.statusHistory.length > 0) {
                lead.statusHistory[lead.statusHistory.length - 1].changedBy = user._id;
              }
              return lead.save();
            }));
            console.log(`✅ Dynamically assigned ${leadsToAssign.length} remaining leads to Sales Exec ${user.email} (${user._id})`);
          }
        }
      } catch (err) {
        console.error('Error assigning leads to Sales Exec:', err.message);
      }
    }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Session expired. Please login again.', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ success: false, message: 'Not authorized. Invalid token.', code: 'INVALID_TOKEN' });
  }
};

// ============================================================
// authorize — restrict to specified roles
// Usage: authorize('admin', 'team_lead')
// ============================================================
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}.`,
        code: 'FORBIDDEN',
        userRole: req.user.role,
        requiredRoles: roles,
      });
    }
    next();
  };
};

// ============================================================
// requireRole — strict single-role check
// Usage: requireRole('admin')
// ============================================================
const requireRole = (role) => authorize(role);

// ============================================================
// adminOnly — admin-only middleware shorthand
// ============================================================
const adminOnly = authorize('admin');

module.exports = { protect, authorize, requireRole, adminOnly, ROLE_PREFIXES };
