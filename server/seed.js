/**
 * Seed script — Creates 3 demo accounts for ManufactoCRM AI
 * Run: node server/seed.js
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: './server/.env' });

const User = require('./models/User');

const demoUsers = [
  {
    name: 'Super Admin',
    email: 'admin@manufactocrm.com',
    password: 'admin123',
    role: 'admin',
    department: 'Management',
  },
  {
    name: 'Priya Patel',
    email: 'teamlead@manufactocrm.com',
    password: 'lead123',
    role: 'team_lead',
    department: 'Sales',
  },
  {
    name: 'Rahul Sharma',
    email: 'rahul@manufactocrm.com',
    password: 'exec123',
    role: 'sales_executive',
    department: 'Sales',
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    for (const u of demoUsers) {
      const exists = await User.findOne({ email: u.email });
      if (exists) {
        console.log(`⚠️  Already exists: ${u.email}`);
        continue;
      }
      await User.create(u);
      console.log(`✅ Created: ${u.name} (${u.role}) — ${u.email} / ${u.password}`);
    }

    console.log('\n🎉 Seed complete! Demo accounts ready.\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
