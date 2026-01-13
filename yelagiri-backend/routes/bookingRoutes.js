const express = require('express');
const router = express.Router();
const { 
    createBooking, 
    verifyPayment, 
    getUserBookings,
    getMyBookings,
    getBookingForConfirmation,
    getEmailPreview
} = require('../controllers/bookingController');

const { protect } = require('../middleware/authMiddleware');

router.post('/', createBooking); // Public for guest bookings
router.post('/verify-payment', verifyPayment); // Public for verification
router.get('/my-bookings', getMyBookings); // Public (uses email header)
router.get('/confirmation/:id', getBookingForConfirmation); // Public confirmation details
router.get('/:id/email-preview', getEmailPreview); // Public email preview
router.get('/:userId', getMyBookings);
router.post('/sync-mock', require('../controllers/bookingController').syncMockBooking);

module.exports = router;
