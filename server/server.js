require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// TODO: Add security middleware for production
// const helmet = require('helmet');          // npm install helmet
// const rateLimit = require('express-rate-limit'); // npm install express-rate-limit
// app.use(helmet());
// app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Connect to database and auto-seed if empty
connectDB().then(async () => {
  try {
    const Lead = require('./models/Lead');
    const leadCount = await Lead.countDocuments({});
    if (leadCount === 0) {
      console.log('⚡ Database is empty. Seeding automatically...');
      const seedData = require('./utils/seed');
      const mockReq = {};
      const mockRes = {
        json: (data) => console.log('✅ Auto-seed completed successfully!'),
        status: (code) => ({ json: (data) => console.error(`❌ Auto-seed failed with status ${code}:`, data) })
      };
      await seedData(mockReq, mockRes);
    }
  } catch (err) {
    console.error('❌ Error checking/seeding database:', err.message);
  }
});

const app = express();

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS — allow any origin so LAN and deployed clients can connect
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    // and any origin while running locally or sharing via LAN/ngrok
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/oauth',     require('./routes/oauth'));   // Real OAuth — Google / GitHub / Microsoft
app.use('/api/users',     require('./routes/users'));
app.use('/api/leads',     require('./routes/leads'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/activities',require('./routes/activities'));
app.use('/api/ai',        require('./routes/ai'));
app.use('/api/reports',   require('./routes/reports'));

// Health check and SMTP self-test
app.get('/api/health', async (req, res) => {
  const mongoose = require('mongoose');
  const nodemailer = require('nodemailer');
  
  const healthData = { 
    status: 'ok', 
    message: 'ManufactoCRM AI Server is running 🚀', 
    dbHost: mongoose.connection.host,
    dbName: mongoose.connection.db?.databaseName,
    timestamp: new Date(),
    smtp: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE,
      user: process.env.SMTP_USER,
      passLength: process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 0,
      passHasSpaces: process.env.SMTP_PASS ? process.env.SMTP_PASS.includes(' ') : false,
      from: process.env.SMTP_FROM
    }
  };

  const testEmail = req.query.testEmail;
  if (testEmail) {
    try {
      let transporter;
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        const isGmail = process.env.SMTP_HOST.includes('gmail.com');
        const transportOpts = isGmail 
          ? {
              service: 'gmail',
              auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
              connectionTimeout: 10000,
              timeout: 10000,
            }
          : {
              host: process.env.SMTP_HOST,
              port: parseInt(process.env.SMTP_PORT) || 587,
              secure: process.env.SMTP_SECURE === 'true',
              auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
              tls: { rejectUnauthorized: false },
              connectionTimeout: 10000,
              timeout: 10000,
            };
        transporter = nodemailer.createTransport(transportOpts);
      } else {
        throw new Error('SMTP credentials not configured in environment variables');
      }

      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || '"ManufactoCRM AI" <no-reply@manufactocrm.com>',
        to: testEmail,
        subject: '🔍 SMTP Diagnostics — Test Email',
        html: `<h3>SMTP Diagnostic Test</h3><p>If you received this, SMTP settings on Render are configured correctly! Time: ${new Date().toISOString()}</p>`
      });

      healthData.emailTest = {
        success: true,
        messageId: info.messageId,
        envelope: info.envelope,
        response: info.response
      };
    } catch (smtpErr) {
      healthData.emailTest = {
        success: false,
        error: smtpErr.message,
        code: smtpErr.code,
        command: smtpErr.command,
        response: smtpErr.response,
        stack: smtpErr.stack
      };
    }
  }

  res.json(healthData);
});

// Seed route (development only)
if (process.env.NODE_ENV === 'development') {
  app.post('/api/seed', require('./utils/seed'));
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
// Listen on 0.0.0.0 so the server is reachable from LAN and shared links
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 ManufactoCRM AI Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  console.log(`📍 Local API:   http://localhost:${PORT}/api`);
  console.log(`📍 Network API: http://<your-local-IP>:${PORT}/api\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
