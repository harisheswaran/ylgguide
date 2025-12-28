const express = require('express');
const router = express.Router();
const { 
    createBooking, 
    verifyPayment, 
    getUserBookings,
    getBookingForConfirmation
} = require('../controllers/bookingController');

const { protect } = require('../middleware/authMiddleware');

router.post('/', createBooking); // Public for guest bookings
router.post('/verify-payment', verifyPayment); // Public for verification
router.get('/confirmation/:id', getBookingForConfirmation); // Public confirmation details
router.get('/user/:userId', protect, getUserBookings);

module.exports = router;
