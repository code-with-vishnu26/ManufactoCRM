const Activity = require('../models/Activity');
const Lead = require('../models/Lead');

// @desc    Get activities for a lead
// @route   GET /api/activities/:leadId
// @access  Private
const getActivities = async (req, res, next) => {
  try {
    const activities = await Activity.find({ leadId: req.params.leadId })
      .populate('createdBy', 'name avatar')
      .sort('-createdAt');
    res.json({ success: true, activities });
  } catch (error) {
    next(error);
  }
};

// @desc    Create activity
// @route   POST /api/activities
// @access  Private
const createActivity = async (req, res, next) => {
  try {
    const { leadId, action, description, metadata } = req.body;

    const lead = await Lead.findById(leadId);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

    const activity = await Activity.create({
      leadId, action, description, metadata, createdBy: req.user._id
    });

    const populated = await Activity.findById(activity._id).populate('createdBy', 'name avatar');
    res.status(201).json({ success: true, activity: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent activities (dashboard)
// @route   GET /api/activities/recent
// @access  Private
const getRecentActivities = async (req, res, next) => {
  try {
    const activities = await Activity.find()
      .populate('createdBy', 'name avatar')
      .populate('leadId', 'companyName clientName status')
      .sort('-createdAt')
      .limit(10);
    res.json({ success: true, activities });
  } catch (error) {
    next(error);
  }
};

module.exports = { getActivities, createActivity, getRecentActivities };
