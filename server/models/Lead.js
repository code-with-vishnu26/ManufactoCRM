const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  clientName: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Phone is required']
  },
  industry: {
    type: String,
    enum: ['Automotive', 'Electronics', 'Food & Beverage', 'Textile', 'Chemical', 'Pharmaceutical', 'Steel & Metal', 'Plastics', 'Packaging', 'Other'],
    default: 'Other'
  },
  productInterest: {
    type: String,
    trim: true
  },
  leadSource: {
    type: String,
    enum: ['Cold Call', 'Email Campaign', 'Referral', 'Trade Show', 'Website', 'LinkedIn', 'Industry Event', 'Other'],
    default: 'Other'
  },
  status: {
    type: String,
    enum: ['New Lead', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost'],
    default: 'New Lead'
  },
  assignedEmployee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  followUpDate: {
    type: Date
  },
  notes: {
    type: String,
    default: ''
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  estimatedDealValue: {
    type: Number,
    default: 0
  },
  tags: [String],
  location: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  statusHistory: [{
    status: String,
    changedAt: { type: Date, default: Date.now },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }]
}, { timestamps: true });

// Indexes for performance
leadSchema.index({ status: 1, assignedEmployee: 1 });
leadSchema.index({ companyName: 'text', clientName: 'text', email: 'text' });

module.exports = mongoose.model('Lead', leadSchema);
