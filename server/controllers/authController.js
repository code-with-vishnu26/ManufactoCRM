const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const dns = require('dns').promises;

// Allowed roles
const ALLOWED_ROLES = ['admin', 'team_lead', 'sales_executive', 'webpage'];

// Dashboard route map
const DASHBOARD_ROUTES = {
  admin:            '/admin/dashboard',
  team_lead:        '/teamlead/dashboard',
  sales_executive:  '/sales/dashboard',
  webpage:          '/home',
};

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// Safe user object (no password)
const safeUser = (user) => ({
  _id:       user._id,
  name:      user.name,
  email:     user.email,
  role:      user.role,
  avatar:    user.avatar,
  department: user.department,
  theme:     user.theme,
  isActive:  user.isActive,
  isVerified: user.isVerified,
  lastLogin: user.lastLogin,
  createdAt: user.createdAt,
  notificationPreferences: user.notificationPreferences,
});

// Disposable domain blacklist
const DISPOSABLE_DOMAINS = [
  'mailinator.com', 'yopmail.com', 'tempmail.com', 'temp-mail.org', 
  '10minutemail.com', 'sharklasers.com', 'guerrillamail.com', 'dispostable.com',
  'getairmail.com', 'burnermail.io', 'trashmail.com', 'tempmailaddress.com',
  'maildrop.cc', 'tempmail.net', 'fakeinbox.com', 'throwawaymail.com'
];

// SMTP mail sending helper — sends beautiful HTML welcome + verification email
const sendVerificationEmail = async (email, name, code) => {
  try {
    let transporter;

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      // Production: use configured SMTP (e.g. Gmail, Mailgun, SendGrid)
      transporter = nodemailer.createTransport({
        host:   process.env.SMTP_HOST,
        port:   parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth:   { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        tls:    { rejectUnauthorized: false },
      });
    } else {
      // Development fallback: Ethereal test account (preview via URL in console)
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host:   'smtp.ethereal.email',
        port:   587,
        secure: false,
        auth:   { user: testAccount.user, pass: testAccount.pass },
      });
    }

    const fromAddress = process.env.SMTP_FROM || '"ManufactoCRM AI" <no-reply@manufactocrm.com>';

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Welcome to ManufactoCRM AI</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px 40px;text-align:center;">
              <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:12px;padding:10px 20px;margin-bottom:16px;">
                <span style="font-size:24px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">
                  Manufacto<span style="opacity:0.85;">CRM AI</span>
                </span>
              </div>
              <h1 style="margin:0;font-size:28px;font-weight:800;color:#ffffff;line-height:1.3;">
                🎉 Successfully Registered!
              </h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:15px;">
                Your account has been created. One last step to get started!
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 16px;font-size:16px;color:#334155;font-weight:600;">
                Hello, ${name}! 👋
              </p>
              <p style="margin:0 0 16px;font-size:14.5px;color:#64748b;line-height:1.7;">
                Welcome to <strong style="color:#6366f1;">ManufactoCRM AI</strong> — the intelligent CRM built for manufacturing excellence. We're thrilled to have you on board!
              </p>
              <p style="margin:0 0 24px;font-size:14.5px;color:#64748b;line-height:1.7;">
                To activate your workspace, please enter the verification code below in your browser:
              </p>

              <!-- OTP Box -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 28px;">
                    <div style="display:inline-block;background:#f8fafc;border:2px solid rgba(99,102,241,0.3);border-radius:14px;padding:20px 36px;">
                      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#94a3b8;margin-bottom:8px;">
                        Your Verification Code
                      </div>
                      <div style="font-size:36px;font-weight:900;letter-spacing:8px;color:#6366f1;font-family:'Courier New',monospace;">
                        ${code}
                      </div>
                      <div style="font-size:11px;color:#94a3b8;margin-top:8px;">
                        ⏱ Expires in 15 minutes
                      </div>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Features tease -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;padding:20px;">
                <tr>
                  <td style="padding:0 0 12px;">
                    <strong style="font-size:13px;color:#475569;text-transform:uppercase;letter-spacing:0.05em;">What awaits you:</strong>
                  </td>
                </tr>
                <tr><td style="padding:6px 0;font-size:13.5px;color:#475569;">✅ AI-powered lead management &amp; insights</td></tr>
                <tr><td style="padding:6px 0;font-size:13.5px;color:#475569;">✅ Role-based team collaboration</td></tr>
                <tr><td style="padding:6px 0;font-size:13.5px;color:#475569;">✅ Advanced sales analytics &amp; reports</td></tr>
                <tr><td style="padding:6px 0;font-size:13.5px;color:#475569;">✅ Smart pipeline management</td></tr>
              </table>

              <p style="margin:24px 0 0;font-size:12.5px;color:#94a3b8;text-align:center;line-height:1.5;">
                If you did not create this account, you can safely ignore this email.<br/>
                This code is valid for <strong>15 minutes</strong> only.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 40px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                © 2026 ManufactoCRM AI. All rights reserved.<br/>
                This is an automated message — please do not reply.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const info = await transporter.sendMail({
      from:    fromAddress,
      to:      email,
      subject: '🎉 Welcome to ManufactoCRM AI — Verify Your Workspace',
      html:    htmlContent,
    });

    console.log(`✉️  Verification email sent: ${info.messageId}`);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`📬 Preview email: ${previewUrl}`);
      return previewUrl;
    }
    return null;
  } catch (error) {
    console.error('❌ Failed to send verification email:', error.message);
    return null;
  }
};


// ============================================================
// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
// ============================================================
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, address, department } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    const lowerEmail = email.toLowerCase();
    const domain = lowerEmail.split('@')[1];

    // 1. Check disposable email domain list
    if (DISPOSABLE_DOMAINS.includes(domain)) {
      return res.status(400).json({ success: false, message: 'Disposable or temporary emails are not allowed. Please use a valid, original email address.' });
    }

    // 2. DNS MX Record lookup — reject if domain definitely has no MX records or doesn't exist.
    // Allow transient errors (timeout, temp server failure) to default to true.
    let hasMx = false;
    try {
      const mx = await dns.resolveMx(domain);
      if (mx && mx.length > 0) {
        hasMx = true;
      }
    } catch (dnsErr) {
      if (dnsErr.code === 'ENOTFOUND' || dnsErr.code === 'ENODATA') {
        hasMx = false;
      } else {
        console.warn(`⚠️ DNS MX lookup failed for ${domain} with error ${dnsErr.code || dnsErr.message}. Defaulting to true.`);
        hasMx = true;
      }
    }

    if (!hasMx) {
      return res.status(400).json({ success: false, message: 'Invalid or non-existent email domain. Please use a real email address (e.g. Gmail, Outlook, Yahoo, or your company email).' });
    }

    // Check duplicate email
    const existingUser = await User.findOne({ email: lowerEmail });
    if (existingUser) {
      // If user exists but is not verified, resend the code
      if (!existingUser.isVerified) {
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        existingUser.verificationCode = verificationCode;
        existingUser.verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000);
        await existingUser.save({ validateBeforeSave: false });
        await sendVerificationEmail(lowerEmail, existingUser.name, verificationCode);
        return res.status(200).json({
          success: true,
          needsVerification: true,
          email: lowerEmail,
          message: 'Verification code resent! Please check your email.',
        });
      }
      return res.status(400).json({ success: false, message: 'Email already registered. Please login.' });
    }

    // Validate role
    const assignedRole = role && ALLOWED_ROLES.includes(role) ? role : 'sales_executive';

    // Generate 6-digit OTP
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Create user — NOT verified yet
    const user = await User.create({
      name: name.trim(),
      email: lowerEmail,
      password,
      role: assignedRole,
      phone: phone || '',
      address: address || '',
      department: department || 'Sales',
      isVerified: false,
      isActive: true,
      verificationCode,
      verificationCodeExpiry,
    });

    // Send verification email
    await sendVerificationEmail(lowerEmail, name.trim(), verificationCode);

    // Return without token — user must verify email first
    res.status(201).json({
      success: true,
      needsVerification: true,
      email: lowerEmail,
      message: 'Account created! Please check your email for the 6-digit verification code.',
    });
  } catch (error) {
    next(error);
  }
};


// ============================================================
// @desc    Verify email code
// @route   POST /api/auth/verify
// @access  Public
// ============================================================
const verifyCode = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ success: false, message: 'Email and verification code are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ success: false, message: 'Email already verified. Please sign in.' });
    }

    // Check code expiry (15 minutes)
    if (user.verificationCodeExpiry && new Date() > user.verificationCodeExpiry) {
      return res.status(400).json({ success: false, message: 'Verification code has expired. Please register again.' });
    }

    if (user.verificationCode !== code.trim()) {
      return res.status(400).json({ success: false, message: 'Invalid verification code. Please check your email.' });
    }

    // Verify user in MongoDB
    user.isVerified = true;
    user.verificationCode = '';
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Email successfully verified! Welcome to ManufactoCRM AI.',
      token,
      user: safeUser(user),
      dashboardRoute: DASHBOARD_ROUTES[user.role] || '/sales/dashboard',
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// @desc    Social Authentication (Signup or Signin)
// @route   POST /api/auth/social-login
// @access  Public
// ============================================================
const socialLogin = async (req, res, next) => {
  try {
    const { name, email, role, provider } = req.body;

    if (!email || !name) {
      return res.status(400).json({ success: false, message: 'Name and email are required for social login' });
    }

    const lowerEmail = email.toLowerCase();
    let user = await User.findOne({ email: lowerEmail });

    const assignedRole = role && ALLOWED_ROLES.includes(role) ? role : 'sales_executive';

    if (!user) {
      // Social Signup: Create verified user directly in MongoDB
      user = await User.create({
        name: name.trim(),
        email: lowerEmail,
        password: Math.random().toString(36).slice(-10), // random dummy password
        role: assignedRole,
        isVerified: true,
        isActive: true
      });
      console.log(`New user registered via social ${provider}: ${lowerEmail}`);
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account deactivated. Contact your administrator.' });
    }

    // Auto-verify social users if not already
    if (!user.isVerified) {
      user.isVerified = true;
      user.verificationCode = '';
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: `Successfully authenticated via ${provider}!`,
      token,
      user: safeUser(user),
      dashboardRoute: DASHBOARD_ROUTES[user.role] || '/sales/dashboard',
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// ============================================================
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account deactivated. Contact your administrator.' });
    }

    // Auto-verify any legacy accounts that were created before the email-verification step was removed
    if (!user.isVerified) {
      user.isVerified = true;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: safeUser(user),
      dashboardRoute: DASHBOARD_ROUTES[user.role] || '/sales/dashboard',
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// @desc    Get current logged-in user (token validation)
// @route   GET /api/auth/me
// @access  Private
// ============================================================
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Session invalid. Please login again.' });
    }
    res.json({
      success: true,
      user: safeUser(user),
      dashboardRoute: DASHBOARD_ROUTES[user.role] || '/sales/dashboard',
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Session expired. Please login again.' });
  }
};

// ============================================================
// @desc    Update profile
// @route   PUT /api/auth/profile
// @access  Private
// ============================================================
const updateProfile = async (req, res, next) => {
  try {
    const fields = ['name', 'phone', 'department', 'theme', 'notificationPreferences', 'avatar'];
    const updates = {};
    fields.forEach(field => { if (req.body[field] !== undefined) updates[field] = req.body[field]; });

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json({ success: true, user: safeUser(user) });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// @desc    Update password
// @route   PUT /api/auth/password
// @access  Private
// ============================================================
const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    const token = generateToken(user._id);
    res.json({ success: true, token, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// @desc    Complete profile for OAuth new users (set role, phone, address, dept)
// @route   PUT /api/auth/complete-profile
// @access  Private
// ============================================================
const completeProfile = async (req, res, next) => {
  try {
    const { role, phone, address, department } = req.body;

    if (!role || !phone || !address || !department) {
      return res.status(400).json({ success: false, message: 'Role, phone, address and department are required' });
    }

    if (!ALLOWED_ROLES.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role selected' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { role, phone, address, department },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      user: safeUser(user),
      dashboardRoute: DASHBOARD_ROUTES[role] || '/sales/dashboard',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, updateProfile, updatePassword, verifyCode, socialLogin, completeProfile, DASHBOARD_ROUTES };
