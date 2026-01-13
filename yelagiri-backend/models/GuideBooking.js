const mongoose = require('mongoose');

const guideBookingSchema = new mongoose.Schema({
    // Guest Information
    guestName: {
        type: String,
        required: true,
        trim: true
    },
    guestEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    guestPhone: {
        type: String,
        required: true,
        trim: true
    },
    
    // Package (Guide) Information
    packageName: { // Keeping packageName for consistency, effectively "Guide Name" or "Trek Name"
        type: String,
        required: true
    },
    packageDescription: {
        type: String,
        default: ''
    },
    
    // Guide Specific Details
    bookingDate: {
        type: String,
        required: true // Now required for GuideBooking
    },
    bookingSlot: {
        type: String,
        required: true
    },
    bookingPeople: {
        type: String,
        required: true
    },
    guideEmail: {
        type: String,
        default: null
    },
    guidePhone: {
        type: String,
        default: null
    },
    
    // Pricing
    baseAmount: {
        type: Number,
        required: true
    },
    taxAmount: {
        type: Number,
        required: true,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true
    },
    
    // Payment Information
    gatewayOrderId: {
        type: String,
        default: null
    },
    transactionId: {
        type: String,
        default: null
    },
    provider: {
        type: String,
        default: 'Mock'
    },
    gatewayPaymentId: {
        type: String,
        default: null
    },
    gatewaySignature: {
        type: String,
        default: null
    },
    
    // Status Tracking
    bookingStatus: {
        type: String,
        enum: ['pending', 'payment_initiated', 'paid', 'confirmed', 'cancelled', 'failed'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'processing', 'paid', 'failed', 'refunded'],
        default: 'unpaid'
    },
    
    // Timestamps
    paymentCompletedAt: {
        type: Date,
        default: null
    },
    confirmedAt: {
        type: Date,
        default: null
    },
    
    // Optional: Reference to user if authenticated
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }

}, {
    timestamps: true
});

// Index for faster queries
guideBookingSchema.index({ guestEmail: 1 });
guideBookingSchema.index({ gatewayOrderId: 1 });
guideBookingSchema.index({ transactionId: 1 });
guideBookingSchema.index({ gatewayPaymentId: 1 });
guideBookingSchema.index({ bookingStatus: 1 });
guideBookingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('GuideBooking', guideBookingSchema);
