const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getReportsSummary,
  getLeadsReport,
  getTeamReport,
  exportReport
} = require('../controllers/reportsController');

// @route   GET /api/reports/summary
// @desc    Overall stats summary
// @access  Private
router.get('/summary', protect, getReportsSummary);

// @route   GET /api/reports/leads
// @desc    Leads performance report
// @access  Private
router.get('/leads', protect, getLeadsReport);

// @route   GET /api/reports/team
// @desc    Team performance report
// @access  Private
router.get('/team', protect, getTeamReport);

// @route   POST /api/reports/export
// @desc    Queue a report export
// @access  Private
router.post('/export', protect, exportReport);

module.exports = router;
