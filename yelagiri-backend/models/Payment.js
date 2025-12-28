const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    // Reference to Booking
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    
    // Payment Gateway Information
    gatewayOrderId: {
        type: String,
        default: null
    },
    transactionId: {
        type: String,
        default: null
    },
    gatewayPaymentId: {
        type: String,
        default: null
    },
    gatewaySignature: {
        type: String,
        default: null
    },
    
    // Transaction Details
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'INR'
    },
    
    // Payment Status
    status: {
        type: String,
        enum: ['created', 'authorized', 'captured', 'refunded', 'failed'],
        default: 'created'
    },
    
    // Payment Method
    method: {
        type: String,
        default: null
        // e.g., 'card', 'netbanking', 'upi', 'wallet'
    },
    
    // Card/Bank Details (if available)
    cardNetwork: {
        type: String,
        default: null
        // e.g., 'Visa', 'Mastercard'
    },
    last4: {
        type: String,
        default: null
        // Last 4 digits of card
    },
    bankName: {
        type: String,
        default: null
    },
    
    // Webhook Data
    webhookPayload: {
        type: mongoose.Schema.Types.Mixed,
        default: null
        // Store complete webhook payload for debugging
    },
    webhookReceivedAt: {
        type: Date,
        default: null
    },
    
    // Verification
    signatureVerified: {
        type: Boolean,
        default: false
    },
    verifiedAt: {
        type: Date,
        default: null
    },
    
    // Retry Tracking
    retryAttempts: {
        type: Number,
        default: 0
    },
    
    // Error Logging
    errorCode: {
        type: String,
        default: null
    },
    errorDescription: {
        type: String,
        default: null
    },
    errorSource: {
        type: String,
        default: null
        // e.g., 'customer', 'gateway', 'business'
    },
    
    // Refund Information
    refundId: {
        type: String,
        default: null
    },
    refundAmount: {
        type: Number,
        default: 0
    },
    refundedAt: {
        type: Date,
        default: null
    },
    refundReason: {
        type: String,
        default: null
    },
    
    // Customer Information
    customerEmail: {
        type: String,
        required: true
    },
    customerPhone: {
        type: String,
        default: null
    },
    
    // Metadata
    notes: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

// Indexes for faster queries
paymentSchema.index({ gatewayOrderId: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ gatewayPaymentId: 1 });
paymentSchema.index({ booking: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ customerEmail: 1 });
paymentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Payment', paymentSchema);
