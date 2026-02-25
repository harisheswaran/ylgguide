const express = require('express');
const router = express.Router();
const { signup, signin, verifyEmail, sendMobileOtp, verifyMobileOtp, sendEmailOtp, verifyEmailOtp } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/verify-email/:token', verifyEmail);
router.post('/mobile-otp', sendMobileOtp);
router.post('/verify-mobile', verifyMobileOtp);
router.post('/send-email-otp', sendEmailOtp);
router.post('/verify-email-otp', verifyEmailOtp);

module.exports = router;
