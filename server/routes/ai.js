const express = require('express');
const router = express.Router();
const { generateAIResponse, getAIHistory, saveAIResponse } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

// @route   POST /api/ai/generate
// @desc    Generate an AI response for a lead
// @access  Private
router.post('/generate', protect, generateAIResponse);

// @route   GET /api/ai/history
// @desc    Get last 20 AI generations (in-memory)
// @access  Private
router.get('/history', protect, getAIHistory);

// @route   POST /api/ai/save
// @desc    Save an AI response to a file
// @access  Private
router.post('/save', protect, saveAIResponse);

module.exports = router;
