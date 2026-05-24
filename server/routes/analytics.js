const express = require('express');
const router = express.Router();
const { getDashboardAnalytics, getTeamPerformance } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/dashboard', getDashboardAnalytics);
router.get('/team', authorize('admin', 'team_lead'), getTeamPerformance);

module.exports = router;
