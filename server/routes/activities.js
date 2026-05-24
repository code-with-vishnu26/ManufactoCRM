const express = require('express');
const router = express.Router();
const { getActivities, createActivity, getRecentActivities } = require('../controllers/activityController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/recent', getRecentActivities);
router.get('/:leadId', getActivities);
router.post('/', createActivity);

module.exports = router;
