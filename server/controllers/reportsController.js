const mongoose = require('mongoose');

// Helper: try to import models if available
let Lead, User, Activity;
try {
  Lead = require('../models/Lead');
  User = require('../models/User');
  Activity = require('../models/Activity');
} catch (_) {}

// ─────────────────────────────────────────────────────────────────────────────
// Mock data fallbacks (used when MongoDB is unavailable)
// ─────────────────────────────────────────────────────────────────────────────
const MOCK_SUMMARY = {
  totalLeads: 142,
  totalRevenuePipeline: 28750000,
  closedWon: 34,
  closedLost: 18,
  conversionRate: '23.9%',
  avgDealValue: 845588,
  activeLeads: 90,
  followUpsDueToday: 12,
  monthlyGrowth: '+14.2%',
  topIndustry: 'Automotive',
  totalActivities: 387,
  aiGenerationsThisMonth: 215
};

const MOCK_LEADS_REPORT = {
  byStatus: [
    { status: 'New Lead', count: 28, value: 5600000 },
    { status: 'Contacted', count: 22, value: 4400000 },
    { status: 'Qualified', count: 18, value: 3600000 },
    { status: 'Proposal Sent', count: 15, value: 3000000 },
    { status: 'Negotiation', count: 7, value: 1400000 },
    { status: 'Closed Won', count: 34, value: 8500000 },
    { status: 'Closed Lost', count: 18, value: 2250000 }
  ],
  byIndustry: [
    { industry: 'Automotive', count: 32, totalValue: 6400000 },
    { industry: 'Pharmaceutical', count: 24, totalValue: 4800000 },
    { industry: 'Electronics', count: 18, totalValue: 3600000 },
    { industry: 'Steel & Metal', count: 16, totalValue: 5200000 },
    { industry: 'Food & Beverage', count: 14, totalValue: 2100000 },
    { industry: 'Textile', count: 12, totalValue: 1800000 },
    { industry: 'Chemical', count: 14, totalValue: 3500000 },
    { industry: 'Plastics', count: 12, totalValue: 1350000 }
  ],
  byPriority: [
    { priority: 'Critical', count: 18, value: 9000000 },
    { priority: 'High', count: 34, value: 8500000 },
    { priority: 'Medium', count: 52, value: 7800000 },
    { priority: 'Low', count: 38, value: 3450000 }
  ],
  recentTrend: [
    { month: 'Jan', leads: 18, closed: 5, revenue: 2100000 },
    { month: 'Feb', leads: 22, closed: 6, revenue: 2800000 },
    { month: 'Mar', leads: 19, closed: 8, revenue: 3200000 },
    { month: 'Apr', leads: 25, closed: 7, revenue: 3500000 },
    { month: 'May', leads: 30, closed: 8, revenue: 4100000 }
  ]
};

const MOCK_TEAM_REPORT = {
  members: [
    {
      name: 'Arjun Sharma',
      role: 'admin',
      email: 'admin@manufactocrm.com',
      leadsAssigned: 0,
      leadsClosed: 0,
      revenueGenerated: 0,
      conversionRate: 'N/A',
      avgResponseTime: 'N/A',
      aiUsage: 12
    },
    {
      name: 'Priya Patel',
      role: 'team_lead',
      email: 'teamlead@manufactocrm.com',
      leadsAssigned: 45,
      leadsClosed: 12,
      revenueGenerated: 9600000,
      conversionRate: '26.7%',
      avgResponseTime: '2.1 hrs',
      aiUsage: 58
    },
    {
      name: 'Rahul Verma',
      role: 'sales_executive',
      email: 'rahul@manufactocrm.com',
      leadsAssigned: 32,
      leadsClosed: 9,
      revenueGenerated: 6750000,
      conversionRate: '28.1%',
      avgResponseTime: '1.8 hrs',
      aiUsage: 72
    },
    {
      name: 'Sneha Joshi',
      role: 'sales_executive',
      email: 'sneha@manufactocrm.com',
      leadsAssigned: 28,
      leadsClosed: 7,
      revenueGenerated: 4900000,
      conversionRate: '25.0%',
      avgResponseTime: '3.2 hrs',
      aiUsage: 45
    },
    {
      name: 'Vikram Singh',
      role: 'sales_executive',
      email: 'vikram@manufactocrm.com',
      leadsAssigned: 37,
      leadsClosed: 6,
      revenueGenerated: 3800000,
      conversionRate: '16.2%',
      avgResponseTime: '4.5 hrs',
      aiUsage: 38
    }
  ],
  topPerformer: 'Rahul Verma',
  totalTeamRevenue: 25050000,
  teamConversionRate: '23.9%'
};

// ─────────────────────────────────────────────────────────────────────────────
// CONTROLLER: GET /api/reports/summary
// ─────────────────────────────────────────────────────────────────────────────
const getReportsSummary = async (req, res, next) => {
  try {
    // Attempt live DB query
    if (Lead && mongoose.connection.readyState === 1) {
      const [totalLeads, closedWon, closedLost, pipeline] = await Promise.all([
        Lead.countDocuments(),
        Lead.countDocuments({ status: 'Closed Won' }),
        Lead.countDocuments({ status: 'Closed Lost' }),
        Lead.aggregate([{ $group: { _id: null, total: { $sum: '$estimatedDealValue' } } }])
      ]);

      const totalRevenuePipeline = pipeline[0]?.total || 0;
      const activeLeads = totalLeads - closedWon - closedLost;
      const conversionRate = totalLeads > 0
        ? ((closedWon / totalLeads) * 100).toFixed(1) + '%'
        : '0%';

      return res.json({
        success: true,
        source: 'live',
        data: {
          totalLeads,
          totalRevenuePipeline,
          closedWon,
          closedLost,
          activeLeads,
          conversionRate,
          avgDealValue: totalLeads > 0 ? Math.round(totalRevenuePipeline / totalLeads) : 0,
          generatedAt: new Date()
        }
      });
    }

    // Fallback to mock data
    res.json({ success: true, source: 'mock', data: { ...MOCK_SUMMARY, generatedAt: new Date() } });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// CONTROLLER: GET /api/reports/leads
// ─────────────────────────────────────────────────────────────────────────────
const getLeadsReport = async (req, res, next) => {
  try {
    if (Lead && mongoose.connection.readyState === 1) {
      const [byStatus, byIndustry, byPriority] = await Promise.all([
        Lead.aggregate([
          { $group: { _id: '$status', count: { $sum: 1 }, value: { $sum: '$estimatedDealValue' } } },
          { $project: { status: '$_id', count: 1, value: 1, _id: 0 } },
          { $sort: { count: -1 } }
        ]),
        Lead.aggregate([
          { $group: { _id: '$industry', count: { $sum: 1 }, totalValue: { $sum: '$estimatedDealValue' } } },
          { $project: { industry: '$_id', count: 1, totalValue: 1, _id: 0 } },
          { $sort: { totalValue: -1 } }
        ]),
        Lead.aggregate([
          { $group: { _id: '$priority', count: { $sum: 1 }, value: { $sum: '$estimatedDealValue' } } },
          { $project: { priority: '$_id', count: 1, value: 1, _id: 0 } }
        ])
      ]);

      return res.json({
        success: true,
        source: 'live',
        data: { byStatus, byIndustry, byPriority, generatedAt: new Date() }
      });
    }

    res.json({ success: true, source: 'mock', data: { ...MOCK_LEADS_REPORT, generatedAt: new Date() } });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// CONTROLLER: GET /api/reports/team
// ─────────────────────────────────────────────────────────────────────────────
const getTeamReport = async (req, res, next) => {
  try {
    if (User && Lead && mongoose.connection.readyState === 1) {
      const salesUsers = await User.find({
        role: { $in: ['sales_executive', 'team_lead', 'sales_manager'] },
        isActive: true
      }).select('name email role');

      const membersData = await Promise.all(salesUsers.map(async (user) => {
        const [leadsAssigned, leadsClosed] = await Promise.all([
          Lead.countDocuments({ assignedEmployee: user._id }),
          Lead.countDocuments({ assignedEmployee: user._id, status: 'Closed Won' })
        ]);
        const revenueResult = await Lead.aggregate([
          { $match: { assignedEmployee: user._id, status: 'Closed Won' } },
          { $group: { _id: null, total: { $sum: '$estimatedDealValue' } } }
        ]);
        return {
          name: user.name,
          role: user.role,
          email: user.email,
          leadsAssigned,
          leadsClosed,
          revenueGenerated: revenueResult[0]?.total || 0,
          conversionRate: leadsAssigned > 0
            ? ((leadsClosed / leadsAssigned) * 100).toFixed(1) + '%'
            : '0%'
        };
      }));

      const topPerformer = membersData.reduce((prev, curr) =>
        curr.revenueGenerated > prev.revenueGenerated ? curr : prev,
        membersData[0] || {}
      );

      return res.json({
        success: true,
        source: 'live',
        data: {
          members: membersData,
          topPerformer: topPerformer?.name || 'N/A',
          totalTeamRevenue: membersData.reduce((sum, m) => sum + m.revenueGenerated, 0),
          generatedAt: new Date()
        }
      });
    }

    res.json({ success: true, source: 'mock', data: { ...MOCK_TEAM_REPORT, generatedAt: new Date() } });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// CONTROLLER: POST /api/reports/export
// ─────────────────────────────────────────────────────────────────────────────
const exportReport = async (req, res, next) => {
  try {
    const { reportType = 'summary', format = 'json', dateRange } = req.body;

    const validTypes = ['summary', 'leads', 'team'];
    const validFormats = ['json', 'csv', 'pdf'];

    if (!validTypes.includes(reportType)) {
      return res.status(400).json({ success: false, message: `Invalid report type. Use one of: ${validTypes.join(', ')}` });
    }
    if (!validFormats.includes(format)) {
      return res.status(400).json({ success: false, message: `Invalid format. Use one of: ${validFormats.join(', ')}` });
    }

    const jobId = `exp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const estimatedReady = new Date(Date.now() + 30000); // 30s simulated queue time

    res.json({
      success: true,
      status: 'export_queued',
      jobId,
      reportType,
      format,
      dateRange: dateRange || { from: 'last_30_days' },
      requestedBy: req.user?.name || 'Unknown',
      estimatedReady,
      downloadUrl: `/api/reports/download/${jobId}`,
      message: `Your ${reportType} report (${format.toUpperCase()}) has been queued. It will be ready in approximately 30 seconds.`
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getReportsSummary, getLeadsReport, getTeamReport, exportReport };
