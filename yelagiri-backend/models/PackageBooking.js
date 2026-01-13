const mongoose = require('mongoose');

const packageBookingSchema = new mongoose.Schema({
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
    
    // Package Information
    packageName: {
        type: String,
        required: true
    },
    packageDescription: {
        type: String,
        default: ''
    },
    
    // Booking Details
    checkIn: {
        type: Date,
        required: true
    },
    checkOut: {
        type: Date,
        required: true
    },
    guests: {
        type: Number,
        required: true,
        min: 1
    },
    rooms: {
        type: Number,
        required: true,
        min: 1
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
    
    // Accommodation Details
    accommodationType: {
        type: String,
        enum: ['cottage', 'villa', 'resort', 'hotel', 'homestay', 'standard'],
        default: 'standard'
    },
    specialRequests: {
        type: String,
        default: ''
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
    },
    
    // Optional: Reference to listing if applicable
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: false
    }

}, {
    timestamps: true
});

// Index for faster queries
packageBookingSchema.index({ guestEmail: 1 });
packageBookingSchema.index({ gatewayOrderId: 1 });
packageBookingSchema.index({ transactionId: 1 });
packageBookingSchema.index({ gatewayPaymentId: 1 });
packageBookingSchema.index({ bookingStatus: 1 });
packageBookingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('PackageBooking', packageBookingSchema);
