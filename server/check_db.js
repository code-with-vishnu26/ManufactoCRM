require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Lead = require('./models/Lead');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');
    
    const userCount = await User.countDocuments({});
    const leadCount = await Lead.countDocuments({});
    console.log(`Users: ${userCount}, Leads: ${leadCount}`);

    const users = await User.find({}, 'name email role department');
    console.log('Users detail:');
    users.forEach(u => console.log(`- ${u.name} (${u.email}): ${u.role}`));

    const leads = await Lead.find({});
    console.log(`First 5 leads info:`);
    leads.slice(0, 5).forEach(l => console.log(`- ${l.companyName} (${l.clientName}): assigned to ${l.assignedEmployee}`));

    const leadAssignments = await Lead.aggregate([
      { $group: { _id: '$assignedEmployee', count: { $sum: 1 } } }
    ]);
    console.log('Assignments count:');
    for (const a of leadAssignments) {
      if (a._id) {
        const u = await User.findById(a._id);
        console.log(`- User ${u ? u.email : a._id}: ${a.count} leads`);
      } else {
        console.log(`- Unassigned: ${a.count} leads`);
      }
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
