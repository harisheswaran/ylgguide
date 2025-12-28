const express = require('express');
const router = express.Router();
const {
    handleWebhook,
    getPayment,
    getAllPayments
} = require('../controllers/paymentController');
const { validateMongoId, validatePagination } = require('../middleware/validationMiddleware');
const { webhookLimiter } = require('../middleware/rateLimiter');

// Webhook route (no auth, verified via signature)
// Webhook body will be parsed as JSON by the global middleware
router.post('/webhook', webhookLimiter, handleWebhook);

// Admin routes (add auth middleware when ready)
router.get('/:paymentId', getPayment);
router.get('/', validatePagination, getAllPayments);

module.exports = router;
