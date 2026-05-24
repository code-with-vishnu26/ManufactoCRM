require('dotenv').config();
const mongoose = require('mongoose');
const seedData = require('./seed');

const run = async () => {
  try {
    console.log('🔄 Connecting to MongoDB for seeding...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected. Seeding data...');
    
    // Mock req and res for the controller function
    const mockReq = {};
    const mockRes = {
      json: (data) => {
        console.log('\n🎉 Seeding completed successfully!');
        console.log('📊 Counts:', data.counts);
        console.log('\n🔑 Credentials:');
        console.log('   Admin:      email: "admin@manufactocrm.com", password: "admin123"');
        console.log('   Team Lead:  email: "teamlead@manufactocrm.com", password: "lead123"');
        console.log('   Sales Exec: email: "rahul@manufactocrm.com", password: "exec123"\n');
        process.exit(0);
      },
      status: (code) => {
        return {
          json: (data) => {
            console.error(`❌ Seeding failed with status ${code}:`, data);
            process.exit(1);
          }
        };
      }
    };
    
    await seedData(mockReq, mockRes);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

run();
