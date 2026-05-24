const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Lead = require('../models/Lead');
const Activity = require('../models/Activity');

const seedData = async (req, res) => {
  try {
    // Clear existing data
    const seedEmails = [
      'admin@manufactocrm.com',
      'teamlead@manufactocrm.com',
      'rahul@manufactocrm.com',
      'sneha@manufactocrm.com',
      'vikram@manufactocrm.com',
      'priya@manufactocrm.com',
      'arjun@manufactocrm.com',
      'kavya@manufactocrm.com',
      'ravi@manufactocrm.com'
    ];
    await User.deleteMany({ email: { $in: seedEmails } });
    await Lead.deleteMany({});
    await Activity.deleteMany({});

    // Create users — all 7 roles
    const users = await User.create([
      // ── Original users ────────────────────────────────────────────────────
      {
        name: 'Arjun Sharma',
        email: 'admin@manufactocrm.com',
        password: 'admin123',
        role: 'admin',
        department: 'Management',
        jobTitle: 'Chief Executive Officer'
      },
      {
        name: 'Priya Patel',
        email: 'teamlead@manufactocrm.com',
        password: 'lead123',
        role: 'team_lead',
        department: 'Sales',
        jobTitle: 'Sales Team Lead'
      },
      {
        name: 'Rahul Verma',
        email: 'rahul@manufactocrm.com',
        password: 'exec123',
        role: 'sales_executive',
        department: 'Sales',
        jobTitle: 'Business Development Associate'
      },
      {
        name: 'Sneha Joshi',
        email: 'sneha@manufactocrm.com',
        password: 'exec123',
        role: 'sales_executive',
        department: 'Sales',
        jobTitle: 'Business Development Associate'
      },
      {
        name: 'Vikram Singh',
        email: 'vikram@manufactocrm.com',
        password: 'exec123',
        role: 'sales_executive',
        department: 'Sales',
        jobTitle: 'Business Development Associate'
      },
      // ── Additional team members ───────────────────────────────────────────
      {
        name: 'Priya Sharma',
        email: 'priya@manufactocrm.com',
        password: 'lead123',
        role: 'team_lead',
        department: 'Sales',
        jobTitle: 'Sales Manager'
      },
      {
        name: 'Arjun Mehta',
        email: 'arjun@manufactocrm.com',
        password: 'lead123',
        role: 'team_lead',
        department: 'Operations',
        jobTitle: 'Operations Team Lead'
      },
      {
        name: 'Kavya Rao',
        email: 'kavya@manufactocrm.com',
        password: 'exec123',
        role: 'sales_executive',
        department: 'Customer Support',
        jobTitle: 'Support Specialist'
      },
      {
        name: 'Ravi Patel',
        email: 'ravi@manufactocrm.com',
        password: 'exec123',
        role: 'sales_executive',
        department: 'Finance',
        jobTitle: 'Finance Analyst'
      },
    ]);

    const [admin, teamLead, rahul, sneha, vikram, priyaSharma, arjunMehta, kavyaRao, raviPatel] = users;

    const industries = ['Automotive', 'Electronics', 'Food & Beverage', 'Textile', 'Chemical', 'Pharmaceutical', 'Steel & Metal', 'Plastics'];
    const statuses = ['New Lead', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost'];
    const priorities = ['Low', 'Medium', 'High', 'Critical'];
    const sources = ['Cold Call', 'Email Campaign', 'Referral', 'Trade Show', 'Website', 'LinkedIn'];

    const companies = [
      { company: 'Tata Motors Ltd', client: 'Rajesh Kumar', industry: 'Automotive', value: 850000 },
      { company: 'Infosys BPO', client: 'Anjali Mehta', industry: 'Electronics', value: 320000 },
      { company: 'Haldirams Foods', client: 'Suresh Gupta', industry: 'Food & Beverage', value: 450000 },
      { company: 'Arvind Mills', client: 'Kavitha Reddy', industry: 'Textile', value: 275000 },
      { company: 'BASF India', client: 'Mohammad Iqbal', industry: 'Chemical', value: 680000 },
      { company: 'Sun Pharma Ltd', client: 'Dr. Nisha Shah', industry: 'Pharmaceutical', value: 920000 },
      { company: 'JSW Steel', client: 'Abhishek Nair', industry: 'Steel & Metal', value: 1200000 },
      { company: 'Supreme Industries', client: 'Pooja Sharma', industry: 'Plastics', value: 380000 },
      { company: 'Mahindra & Mahindra', client: 'Deepak Iyer', industry: 'Automotive', value: 750000 },
      { company: 'Dixon Technologies', client: 'Ritu Agarwal', industry: 'Electronics', value: 290000 },
      { company: 'Parle Products', client: 'Santosh Rao', industry: 'Food & Beverage', value: 410000 },
      { company: 'Raymond Ltd', client: 'Meena Pillai', industry: 'Textile', value: 520000 },
      { company: 'Pidilite Industries', client: 'Kiran Desai', industry: 'Chemical', value: 340000 },
      { company: 'Cipla Ltd', client: 'Dr. Rakesh Modi', industry: 'Pharmaceutical', value: 780000 },
      { company: 'SAIL (Steel Auth)', client: 'Harish Chandra', industry: 'Steel & Metal', value: 1500000 },
      { company: 'Astral Poly Technik', client: 'Lata Krishnan', industry: 'Plastics', value: 490000 },
      { company: 'Bajaj Auto Ltd', client: 'Manoj Kulkarni', industry: 'Automotive', value: 630000 },
      { company: 'Havells India', client: 'Swati Bose', industry: 'Electronics', value: 410000 },
      { company: 'ITC Foods', client: 'Gaurav Tiwari', industry: 'Food & Beverage', value: 560000 },
      { company: 'Vardhman Textiles', client: 'Uma Shankar', industry: 'Textile', value: 320000 },
    ];

    const execs = [rahul, sneha, vikram];
    const leads = await Promise.all(companies.map((c, i) => {
      const status = statuses[i % statuses.length];
      const exec = execs[i % 3];
      return Lead.create({
        companyName: c.company,
        clientName: c.client,
        email: `${c.client.toLowerCase().replace(/\s/g, '.').replace(/[^a-z.]/g, '')}@${c.company.toLowerCase().replace(/\s/g, '').substring(0, 8)}.com`,
        phone: `+91 ${Math.floor(7000000000 + Math.random() * 2999999999)}`,
        industry: c.industry,
        productInterest: 'ManufactoCRM AI - Enterprise Plan',
        leadSource: sources[i % sources.length],
        status,
        assignedEmployee: exec._id,
        followUpDate: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000),
        priority: priorities[i % priorities.length],
        estimatedDealValue: c.value,
        notes: `Strong interest shown in ${c.industry} vertical. Decision maker engaged.`,
        statusHistory: [{ status, changedBy: exec._id }]
      });
    }));

    // Create activities
    const actions = ['Call Completed', 'Email Sent', 'Meeting Scheduled', 'Proposal Sent', 'Follow-up Completed'];
    await Promise.all(leads.slice(0, 10).map((lead, i) =>
      Activity.create({
        leadId: lead._id,
        action: actions[i % actions.length],
        description: `${actions[i % actions.length]} with ${lead.clientName} from ${lead.companyName}`,
        createdBy: execs[i % 3]._id
      })
    ));

    res.json({
      success: true,
      message: '✅ Database seeded successfully!',
      credentials: {
        admin: { email: 'admin@manufactocrm.com', password: 'admin123' },
        teamLead: { email: 'teamlead@manufactocrm.com', password: 'lead123' },
        salesExec1: { email: 'rahul@manufactocrm.com', password: 'exec123' },
        salesExec2: { email: 'sneha@manufactocrm.com', password: 'exec123' },
        salesExec3: { email: 'vikram@manufactocrm.com', password: 'exec123' },
        teamLead2: { email: 'priya@manufactocrm.com', password: 'lead123' },
        teamLead3: { email: 'arjun@manufactocrm.com', password: 'lead123' },
        salesExec4: { email: 'kavya@manufactocrm.com', password: 'exec123' },
        salesExec5: { email: 'ravi@manufactocrm.com', password: 'exec123' }
      },
      counts: { users: users.length, leads: leads.length }
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = seedData;
