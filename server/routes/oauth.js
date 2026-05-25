const express = require('express');
const router  = express.Router();
const https   = require('https');
const http    = require('http');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DASHBOARD_ROUTES = {
  admin:           '/admin/dashboard',
  team_lead:       '/teamlead/dashboard',
  sales_executive: '/sales/dashboard',
  webpage:         '/home',
};

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

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
});

/** Simple HTTPS GET helper that follows one redirect */
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    lib.get(url, { headers: { 'User-Agent': 'ManufactoCRM-AI/1.0', Accept: 'application/json' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchJson(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { reject(new Error('JSON parse error')); }
      });
    }).on('error', reject);
  });
}

function postJson(url, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const u = new URL(url);
    const lib = u.protocol === 'https:' ? https : http;
    const req = lib.request({
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        Accept: 'application/json',
        'User-Agent': 'ManufactoCRM-AI/1.0',
        ...headers,
      },
    }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { reject(new Error('JSON parse error')); }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

/** Upsert user from social profile and return JWT + redirect HTML */
async function handleSocialUser({ name, email, avatar, provider }) {
  const lowerEmail = email.toLowerCase();
  let user = await User.findOne({ email: lowerEmail });
  let isNewUser = false;

  if (!user) {
    isNewUser = true;
    user = await User.create({
      name: name.trim(),
      email: lowerEmail,
      password: Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12),
      role: 'sales_executive', // temporary default — user will choose on profile page
      isVerified: true,
      isActive: true,
      avatar: avatar || '',
    });
    console.log(`[OAuth] New user via ${provider}: ${lowerEmail}`);
  }

  if (!user.isActive) throw new Error('Account deactivated. Contact your administrator.');

  if (!user.isVerified) {
    user.isVerified = true;
    user.verificationCode = '';
  }
  user.lastLogin = new Date();
  if (avatar && !user.avatar) user.avatar = avatar;
  await user.save({ validateBeforeSave: false });

  return {
    token: generateToken(user._id),
    user: safeUser(user),
    dashboardRoute: DASHBOARD_ROUTES[user.role] || '/sales/dashboard',
    needsProfile: isNewUser, // true only for brand-new OAuth users
  };
}

/** Build the HTML page that posts result to the opener and closes itself */
function buildCallbackHtml({ token, user, dashboardRoute, needsProfile, error, clientOrigin }) {
  const clientUrl = (clientOrigin || process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/+$/, '');
  if (error) {
    return `<!DOCTYPE html><html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding:30px;background:#fef2f2;color:#991b1b;text-align:center;">
      <div style="max-width:400px;margin:50px auto;padding:24px;background:#fff;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.08);border:1px solid #fee2e2;">
        <div style="font-size:40px;margin-bottom:12px;">⚠️</div>
        <h3 style="margin:0 0 10px;font-size:18px;font-weight:700;">Authentication Error</h3>
        <p style="margin:0 0 20px;font-size:14.5px;color:#7f1d1d;word-break:break-word;line-height:1.5;">${error}</p>
        <div style="font-size:12px;color:#9ca3af;">This window will close automatically...</div>
      </div>
      <script>
        setTimeout(function() {
          if (window.opener) {
            window.opener.postMessage({ success: false, error: ${JSON.stringify(error)} }, ${JSON.stringify(clientUrl)});
          }
          setTimeout(function() { window.close(); }, 8000);
        }, 300);
      </script></body></html>`;
  }
  return `<!DOCTYPE html><html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding:30px;background:#f0fdf4;color:#166534;text-align:center;">
    <div style="max-width:400px;margin:50px auto;padding:24px;background:#fff;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.08);border:1px solid #dcfce7;">
      <div style="font-size:40px;margin-bottom:12px;">🎉</div>
      <h3 style="margin:0 0 10px;font-size:18px;font-weight:700;">Authenticated!</h3>
      <p style="margin:0 0 20px;font-size:14.5px;color:#14532d;">Completing your sign in...</p>
      <div style="font-size:12px;color:#9ca3af;">Closing window...</div>
    </div>
    <script>
      setTimeout(function() {
        if (window.opener) {
          window.opener.postMessage({
            success: true,
            token: ${JSON.stringify(token)},
            user: ${JSON.stringify(user)},
            dashboardRoute: ${JSON.stringify(dashboardRoute)},
            needsProfile: ${JSON.stringify(!!needsProfile)}
          }, ${JSON.stringify(clientUrl)});
        }
        setTimeout(function() { window.close(); }, 8000);
      }, 300);
    </script></body></html>`;
}

// ─── GOOGLE OAuth ─────────────────────────────────────────────────────────────

/**
 * GET /api/oauth/google
 * Redirects the browser to Google's OAuth consent screen.
 */
router.get('/google', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) return res.status(503).send('Google OAuth not configured. Add GOOGLE_CLIENT_ID to server .env');

  const origin = req.query.origin || '';
  const state = encodeURIComponent(origin);

  const serverUrl = (process.env.SERVER_URL || 'http://localhost:5000').replace(/\/+$/, '');
  const redirect = encodeURIComponent(`${serverUrl}/api/oauth/google/callback`);
  const scope    = encodeURIComponent('openid email profile');
  res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirect}&response_type=code&scope=${scope}&state=${state}&access_type=offline`
  );
});

/**
 * GET /api/oauth/google/callback
 * Google redirects here after consent. Exchange code → token → profile → upsert user.
 */
router.get('/google/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    if (!code) throw new Error('Missing authorization code');

    const serverUrl = (process.env.SERVER_URL || 'http://localhost:5000').replace(/\/+$/, '');
    const redirectUri = `${serverUrl}/api/oauth/google/callback`;

    // Exchange code for access_token
    const tokenData = await postJson('https://oauth2.googleapis.com/token', {
      code,
      client_id:     process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri:  redirectUri,
      grant_type:    'authorization_code',
    });

    if (tokenData.error) throw new Error(tokenData.error_description || tokenData.error);

    // Fetch user profile
    const profile = await fetchJson(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenData.access_token}`
    );

    const result = await handleSocialUser({
      name:     profile.name || profile.email.split('@')[0],
      email:    profile.email,
      avatar:   profile.picture,
      provider: 'google',
    });

    res.send(buildCallbackHtml({ ...result, clientOrigin: state ? decodeURIComponent(state) : '' }));
  } catch (err) {
    console.error('[OAuth/Google]', err.message);
    res.send(buildCallbackHtml({ error: err.message, clientOrigin: req.query.state ? decodeURIComponent(req.query.state) : '' }));
  }
});

// ─── GITHUB OAuth ─────────────────────────────────────────────────────────────

router.get('/github', (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) return res.status(503).send('GitHub OAuth not configured. Add GITHUB_CLIENT_ID to server .env');

  const origin = req.query.origin || '';
  const state = encodeURIComponent(origin);

  const serverUrl = (process.env.SERVER_URL || 'http://localhost:5000').replace(/\/+$/, '');
  const redirect = encodeURIComponent(`${serverUrl}/api/oauth/github/callback`);
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirect}&scope=user:email&state=${state}`
  );
});

router.get('/github/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    if (!code) throw new Error('Missing authorization code');

    // Exchange code for access_token
    const tokenData = await postJson(
      'https://github.com/login/oauth/access_token',
      { client_id: process.env.GITHUB_CLIENT_ID, client_secret: process.env.GITHUB_CLIENT_SECRET, code },
      { Accept: 'application/json' }
    );

    if (tokenData.error) throw new Error(tokenData.error_description || tokenData.error);

    const ghHeaders = {
      Authorization: `token ${tokenData.access_token}`,
      'User-Agent': 'ManufactoCRM-AI/1.0',
      Accept: 'application/json',
    };

    // Fetch profile with auth token
    const profileWithToken = await new Promise((resolve, reject) => {
      https.get('https://api.github.com/user', { headers: ghHeaders }, res => {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => { try { resolve(JSON.parse(d)); } catch { resolve({}); } });
      }).on('error', reject);
    });

    // Fetch emails with auth token
    const emailsWithToken = await new Promise((resolve, reject) => {
      https.get('https://api.github.com/user/emails', { headers: ghHeaders }, res => {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => { try { resolve(JSON.parse(d)); } catch { resolve([]); } });
      }).on('error', () => resolve([]));
    });

    const primaryEmail = profileWithToken.email ||
      (Array.isArray(emailsWithToken)
        ? emailsWithToken.find(e => e.primary && e.verified)?.email
        : null);

    if (!primaryEmail) throw new Error('GitHub account has no verified public email. Please make your email public in GitHub settings.');

    const result = await handleSocialUser({
      name:     profileWithToken.name || profileWithToken.login || primaryEmail.split('@')[0],
      email:    primaryEmail,
      avatar:   profileWithToken.avatar_url || '',
      provider: 'github',
    });

    res.send(buildCallbackHtml({ ...result, clientOrigin: state ? decodeURIComponent(state) : '' }));
  } catch (err) {
    console.error('[OAuth/GitHub]', err.message);
    res.send(buildCallbackHtml({ error: err.message, clientOrigin: req.query.state ? decodeURIComponent(req.query.state) : '' }));
  }
});

// ─── MICROSOFT OAuth ──────────────────────────────────────────────────────────

router.get('/microsoft', (req, res) => {
  const clientId = process.env.MICROSOFT_CLIENT_ID;
  if (!clientId) return res.status(503).send('Microsoft OAuth not configured. Add MICROSOFT_CLIENT_ID to server .env');

  const origin = req.query.origin || '';
  const state = encodeURIComponent(origin);

  const serverUrl = (process.env.SERVER_URL || 'http://localhost:5000').replace(/\/+$/, '');
  const redirect = encodeURIComponent(`${serverUrl}/api/oauth/microsoft/callback`);
  const scope    = encodeURIComponent('openid email profile User.Read');
  res.redirect(
    `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&redirect_uri=${redirect}&response_type=code&scope=${scope}&state=${state}`
  );
});

router.get('/microsoft/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    if (!code) throw new Error('Missing authorization code');

    const serverUrl = (process.env.SERVER_URL || 'http://localhost:5000').replace(/\/+$/, '');
    const redirectUri = `${serverUrl}/api/oauth/microsoft/callback`;

    // Exchange code for access_token
    const params = new URLSearchParams({
      client_id:     process.env.MICROSOFT_CLIENT_ID,
      client_secret: process.env.MICROSOFT_CLIENT_SECRET,
      code,
      redirect_uri:  redirectUri,
      grant_type:    'authorization_code',
    });

    const tokenResponse = await new Promise((resolve, reject) => {
      const payload = params.toString();
      const req2 = https.request({
        hostname: 'login.microsoftonline.com',
        path: '/common/oauth2/v2.0/token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(payload),
        },
      }, (res2) => {
        let d = '';
        res2.on('data', c => d += c);
        res2.on('end', () => { try { resolve(JSON.parse(d)); } catch { reject(new Error('Parse error')); } });
      });
      req2.on('error', reject);
      req2.write(payload);
      req2.end();
    });

    if (tokenResponse.error) throw new Error(tokenResponse.error_description || tokenResponse.error);

    // Get profile from Microsoft Graph
    const profile = await new Promise((resolve, reject) => {
      https.get('https://graph.microsoft.com/v1.0/me', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}`, Accept: 'application/json' }
      }, (res2) => {
        let d = '';
        res2.on('data', c => d += c);
        res2.on('end', () => { try { resolve(JSON.parse(d)); } catch { reject(new Error('Parse error')); } });
      }).on('error', reject);
    });

    const email = profile.mail || profile.userPrincipalName;
    if (!email) throw new Error('Microsoft account has no accessible email.');

    const result = await handleSocialUser({
      name:     profile.displayName || profile.givenName || email.split('@')[0],
      email,
      avatar:   '',
      provider: 'microsoft',
    });

    res.send(buildCallbackHtml({ ...result, clientOrigin: state ? decodeURIComponent(state) : '' }));
  } catch (err) {
    console.error('[OAuth/Microsoft]', err.message);
    res.send(buildCallbackHtml({ error: err.message, clientOrigin: req.query.state ? decodeURIComponent(req.query.state) : '' }));
  }
});

module.exports = router;
