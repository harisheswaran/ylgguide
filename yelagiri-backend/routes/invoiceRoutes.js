const express = require('express');
const router = express.Router();
const {
    downloadInvoice,
    getInvoice,
    getInvoiceByBooking,
    resendInvoice,
    listInvoices,
    regenerateInvoice
} = require('../controllers/invoiceController');
const { validateMongoId, validatePagination } = require('../middleware/validationMiddleware');
const { emailLimiter } = require('../middleware/rateLimiter');

// Public routes (token-protected)
router.get('/:id/download', downloadInvoice);
router.get('/:id', getInvoice);
router.get('/booking/:bookingId', getInvoiceByBooking);

// Admin routes (add auth middleware when ready)
router.post('/:id/resend', emailLimiter, validateMongoId, resendInvoice);
router.post('/:id/regenerate', validateMongoId, regenerateInvoice);
router.get('/', validatePagination, listInvoices);

module.exports = router;
