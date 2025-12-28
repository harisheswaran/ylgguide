const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const { processWebhook } = require('../services/paymentService');
const { createInvoice } = require('../services/invoiceService');
const { sendBookingConfirmationEmail } = require('../services/emailService');

/**
 * @desc    Handle incoming payment webhooks (Unified)
 * @route   POST /api/payments/webhook
 * @access  Public (verified via provider-specific signature)
 */
const handleWebhook = async (req, res) => {
    try {
        // processWebhook automatically detects provider and verifies signature
        const event = await processWebhook(req);
        
        console.log(`🔔 Webhook received:`, event.status);

        if (event.status === 'captured') {
            await handlePaymentSuccess(event);
        } else if (event.status === 'failed') {
            await handlePaymentFailed(event);
        }

        // Always respond with 200 to acknowledge receipt
        res.status(200).json({ success: true });

    } catch (error) {
        console.error('Webhook processing error:', error);
        res.status(200).json({ success: false, error: error.message });
    }
};

/**
 * Handle successful payment event (Unified)
 */
async function handlePaymentSuccess(event) {
    try {
        const { orderId, transactionId, paymentId, amount, raw } = event;

        // Find payment record by either ID
        const query = transactionId ? { transactionId } : { gatewayOrderId: orderId };
        const payment = await Payment.findOne(query);

        if (!payment) {
            console.error('Payment record not found for:', transactionId || orderId);
            return;
        }

        // Check if already processed
        if (payment.status === 'captured') return;

        // Update payment record
        payment.gatewayPaymentId = paymentId;
        payment.status = 'captured';
        payment.webhookPayload = raw;
        payment.webhookReceivedAt = new Date();
        payment.signatureVerified = true;
        payment.verifiedAt = new Date();
        await payment.save();

        // Find and update booking
        const booking = await Booking.findById(payment.booking);
        if (!booking) return;

        if (booking.bookingStatus === 'confirmed') return;

        booking.gatewayPaymentId = paymentId;
        booking.bookingStatus = 'confirmed';
        booking.paymentStatus = 'paid';
        booking.paymentCompletedAt = new Date();
        booking.confirmedAt = new Date();
        await booking.save();

        // Generate invoice and send email
        const invoice = await createInvoice(booking);
        try {
            await sendBookingConfirmationEmail(booking, invoice);
        } catch (emailErr) {
            console.error('Email notification failed:', emailErr);
        }

    } catch (error) {
        console.error('Error in handlePaymentSuccess:', error);
    }
}

/**
 * Handle payment failed event
 */
async function handlePaymentFailed(event) {
    try {
        const { orderId, transactionId, status, raw } = event;

        const query = transactionId ? { transactionId } : { gatewayOrderId: orderId };
        const payment = await Payment.findOneAndUpdate(
            query,
            {
                status: 'failed',
                webhookPayload: raw,
                webhookReceivedAt: new Date()
            },
            { new: true }
        );

        if (payment) {
            await Booking.findByIdAndUpdate(payment.booking, {
                bookingStatus: 'failed',
                paymentStatus: 'failed'
            });
        }

    } catch (error) {
        console.error('Error handling payment failed:', error);
    }
}

/**
 * @desc    Get payment details
 * @route   GET /api/payments/:paymentId
 * @access  Admin
 */
const getPayment = async (req, res) => {
    try {
        const payment = await Payment.findOne({ 
            gatewayPaymentId: req.params.paymentId 
        }).populate('booking');

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        res.json({
            success: true,
            data: payment
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch payment'
        });
    }
};

/**
 * @desc    Get all payments (Admin)
 */
const getAllPayments = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const payments = await Payment.find()
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .populate('booking');

        res.json({
            success: true,
            data: payments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch payments'
        });
    }
};

module.exports = {
    handleWebhook,
    getPayment,
    getAllPayments
};
