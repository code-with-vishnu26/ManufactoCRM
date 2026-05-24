const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  leadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lead',
    required: true
  },
  action: {
    type: String,
    required: [true, 'Action is required'],
    enum: [
      'Lead Created',
      'Call Completed',
      'Email Sent',
      'Meeting Scheduled',
      'Meeting Completed',
      'Proposal Sent',
      'Follow-up Scheduled',
      'Follow-up Completed',
      'Negotiation Started',
      'Status Updated',
      'Note Added',
      'Lead Assigned',
      'Demo Scheduled',
      'Demo Completed',
      'Contract Sent',
      'Deal Closed Won',
      'Deal Closed Lost',
      'Other'
    ]
  },
  description: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { timestamps: true });

activitySchema.index({ leadId: 1, createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);
