const express = require('express');
const router = express.Router();
const { signup, signin, verifyEmail, sendMobileOtp, verifyMobileOtp } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/verify-email/:token', verifyEmail);
router.post('/mobile-otp', sendMobileOtp);
router.post('/verify-mobile', verifyMobileOtp);

module.exports = router;
