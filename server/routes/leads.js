const express = require('express');
const router = express.Router();
const { getLeads, getLead, createLead, updateLead, deleteLead, getKanbanLeads } = require('../controllers/leadController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/kanban', getKanbanLeads);
router.route('/').get(getLeads).post(createLead);
router.route('/:id')
  .get(getLead)
  .put(updateLead)
  .delete(authorize('admin', 'team_lead'), deleteLead);

module.exports = router;
