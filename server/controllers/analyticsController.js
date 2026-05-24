const Lead = require('../models/Lead');
const User = require('../models/User');
const Activity = require('../models/Activity');

// @desc    Get dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private
const getDashboardAnalytics = async (req, res, next) => {
  try {
    const query = req.user.role === 'sales_executive' ? { assignedEmployee: req.user._id } : {};

    const [totalLeads, closedWon, closedLost, activeClients] = await Promise.all([
      Lead.countDocuments(query),
      Lead.countDocuments({ ...query, status: 'Closed Won' }),
      Lead.countDocuments({ ...query, status: 'Closed Lost' }),
      Lead.countDocuments({ ...query, status: { $in: ['Contacted', 'Qualified', 'Proposal Sent', 'Negotiation'] } })
    ]);

    const revenueResult = await Lead.aggregate([
      { $match: { ...query, status: 'Closed Won' } },
      { $group: { _id: null, total: { $sum: '$estimatedDealValue' } } }
    ]);
    const revenueGenerated = revenueResult[0]?.total || 0;

    const pendingFollowUps = await Lead.countDocuments({
      ...query,
      followUpDate: { $lte: new Date(), $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    const conversionRate = totalLeads > 0 ? ((closedWon / totalLeads) * 100).toFixed(1) : 0;

    // Monthly sales chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlySales = await Lead.aggregate([
      { $match: { ...query, createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          leads: { $sum: 1 },
          closedWon: { $sum: { $cond: [{ $eq: ['$status', 'Closed Won'] }, 1, 0] } },
          revenue: { $sum: { $cond: [{ $eq: ['$status', 'Closed Won'] }, '$estimatedDealValue', 0] } }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = monthlySales.map(item => ({
      month: months[item._id.month - 1],
      leads: item.leads,
      closed: item.closedWon,
      revenue: item.revenue
    }));

    // Pipeline distribution
    const pipelineData = await Lead.aggregate([
      { $match: query },
      { $group: { _id: '$status', count: { $sum: 1 }, value: { $sum: '$estimatedDealValue' } } }
    ]);

    // Lead source breakdown
    const sourceData = await Lead.aggregate([
      { $match: query },
      { $group: { _id: '$leadSource', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Priority distribution
    const priorityData = await Lead.aggregate([
      { $match: query },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      kpis: { totalLeads, closedWon, closedLost, activeClients, revenueGenerated, pendingFollowUps, conversionRate },
      charts: { monthlyData, pipelineData, sourceData, priorityData }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get team performance analytics
// @route   GET /api/analytics/team
// @access  Private (Admin/Team Lead)
const getTeamPerformance = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'sales_executive', isActive: true }).select('name email avatar');

    const performance = await Promise.all(users.map(async (user) => {
      const [total, won, lost, active] = await Promise.all([
        Lead.countDocuments({ assignedEmployee: user._id }),
        Lead.countDocuments({ assignedEmployee: user._id, status: 'Closed Won' }),
        Lead.countDocuments({ assignedEmployee: user._id, status: 'Closed Lost' }),
        Lead.countDocuments({ assignedEmployee: user._id, status: { $in: ['Contacted', 'Qualified', 'Proposal Sent', 'Negotiation'] } })
      ]);

      const revenueResult = await Lead.aggregate([
        { $match: { assignedEmployee: user._id, status: 'Closed Won' } },
        { $group: { _id: null, total: { $sum: '$estimatedDealValue' } } }
      ]);

      const revenue = revenueResult[0]?.total || 0;
      const conversionRate = total > 0 ? ((won / total) * 100).toFixed(1) : 0;
      const target = 500000; // Monthly target
      const targetProgress = Math.min((revenue / target) * 100, 100).toFixed(1);

      return {
        user: { _id: user._id, name: user.name, email: user.email, avatar: user.avatar },
        stats: { total, won, lost, active, revenue, conversionRate, targetProgress }
      };
    }));

    // Sort by revenue (leaderboard)
    performance.sort((a, b) => b.stats.revenue - a.stats.revenue);

    res.json({ success: true, performance });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardAnalytics, getTeamPerformance };
