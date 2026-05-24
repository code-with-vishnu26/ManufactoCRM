const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, updatePassword, verifyCode, socialLogin, completeProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/verify', verifyCode);
router.post('/social-login', socialLogin);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.put('/complete-profile', protect, completeProfile);

module.exports = router;
