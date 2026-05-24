const Lead = require('../models/Lead');
const Activity = require('../models/Activity');

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
const getLeads = async (req, res, next) => {
  try {
    const { status, priority, assignedEmployee, search, page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const query = {};

    // Role-based filtering
    if (req.user.role === 'sales_executive') {
      query.assignedEmployee = req.user._id;
    }

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedEmployee && req.user.role !== 'sales_executive') query.assignedEmployee = assignedEmployee;

    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { clientName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .populate('assignedEmployee', 'name email avatar role')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      leads,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
const getLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate('assignedEmployee', 'name email avatar role')
      .populate('statusHistory.changedBy', 'name');

    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

    res.json({ success: true, lead });
  } catch (error) {
    next(error);
  }
};

// @desc    Create lead
// @route   POST /api/leads
// @access  Private
const createLead = async (req, res, next) => {
  try {
    const lead = await Lead.create({
      ...req.body,
      statusHistory: [{ status: req.body.status || 'New Lead', changedBy: req.user._id }]
    });

    await Activity.create({
      leadId: lead._id,
      action: 'Lead Created',
      description: `Lead created for ${lead.companyName}`,
      createdBy: req.user._id
    });

    const populated = await Lead.findById(lead._id).populate('assignedEmployee', 'name email avatar');
    res.status(201).json({ success: true, lead: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
const updateLead = async (req, res, next) => {
  try {
    let lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

    const statusChanged = req.body.status && req.body.status !== lead.status;

    if (statusChanged) {
      req.body.statusHistory = [
        ...lead.statusHistory,
        { status: req.body.status, changedBy: req.user._id }
      ];
    }

    lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    }).populate('assignedEmployee', 'name email avatar');

    if (statusChanged) {
      await Activity.create({
        leadId: lead._id,
        action: 'Status Updated',
        description: `Status changed to ${req.body.status}`,
        createdBy: req.user._id,
        metadata: { newStatus: req.body.status }
      });
    }

    res.json({ success: true, lead });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private (Admin/Team Lead)
const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });

    await Activity.deleteMany({ leadId: req.params.id });
    await lead.deleteOne();

    res.json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get leads for Kanban (all statuses grouped)
// @route   GET /api/leads/kanban
// @access  Private
const getKanbanLeads = async (req, res, next) => {
  try {
    const query = req.user.role === 'sales_executive' ? { assignedEmployee: req.user._id } : {};

    const leads = await Lead.find(query)
      .populate('assignedEmployee', 'name email avatar')
      .sort('-createdAt');

    const stages = ['New Lead', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost'];
    const kanban = {};
    stages.forEach(s => { kanban[s] = []; });
    leads.forEach(lead => {
      if (kanban[lead.status]) kanban[lead.status].push(lead);
    });

    res.json({ success: true, kanban });
  } catch (error) {
    next(error);
  }
};

module.exports = { getLeads, getLead, createLead, updateLead, deleteLead, getKanbanLeads };
