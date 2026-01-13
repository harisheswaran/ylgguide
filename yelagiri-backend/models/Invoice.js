const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    // Invoice Identification
    invoiceNumber: {
        type: String,
        required: true,
        unique: true,
        // Format: INV-2025-0001
    },
    
    // Reference to Booking (can be either PackageBooking or GuideBooking)
    bookingType: {
        type: String,
        required: true,
        enum: ['PackageBooking', 'GuideBooking']
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'bookingType'
    },
    
    // Invoice Dates
    invoiceDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: true
    },
    
    // Guest Information (denormalized for invoice permanence)
    guestName: {
        type: String,
        required: true
    },
    guestEmail: {
        type: String,
        required: true
    },
    guestPhone: {
        type: String,
        required: true
    },
    
    // Package Details
    packageName: {
        type: String,
        required: true
    },
    packageDescription: {
        type: String,
        default: ''
    },
    checkInDate: {
        type: Date,
        required: false,
        default: null
    },
    checkOutDate: {
        type: Date,
        required: false,
        default: null
    },
    // Guide/Trekking Specific
    bookingDate: {
        type: String,
        default: null
    },
    bookingSlot: {
        type: String,
        default: null
    },
    bookingPeople: {
        type: String,
        default: null
    },
    guideEmail: {
        type: String,
        default: null
    },
    guidePhone: {
        type: String,
        default: null
    },
    numberOfGuests: {
        type: Number,
        required: false,
        default: null
    },
    
    // Pricing Breakdown
    baseAmount: {
        type: Number,
        required: true
    },
    gstRate: {
        type: Number,
        required: true,
        default: 18
        // Stored as percentage (e.g., 18 for 18%)
    },
    gstAmount: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    
    // Payment Information
    paymentStatus: {
        type: String,
        enum: ['paid', 'unpaid', 'partially_paid', 'refunded'],
        default: 'paid'
    },
    paymentMethod: {
        type: String,
        default: 'Mock'
    },
    gatewayPaymentId: {
        type: String,
        default: null
    },
    
    // PDF Storage
    pdfPath: {
        type: String,
        default: null
        // Relative path to PDF file
    },
    pdfUrl: {
        type: String,
        default: null
        // Full URL to access PDF
    },
    
    // Generation Status
    generationStatus: {
        type: String,
        enum: ['pending', 'generating', 'generated', 'failed'],
        default: 'pending'
    },
    generatedAt: {
        type: Date,
        default: null
    },
    
    // Email Status
    emailSent: {
        type: Boolean,
        default: false
    },
    emailSentAt: {
        type: Date,
        default: null
    },
    emailAttempts: {
        type: Number,
        default: 0
    },
    
    // Notes
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Indexes for faster queries
invoiceSchema.index({ invoiceNumber: 1 }, { unique: true });
invoiceSchema.index({ booking: 1 });
invoiceSchema.index({ guestEmail: 1 });
invoiceSchema.index({ invoiceDate: -1 });
invoiceSchema.index({ generationStatus: 1 });

// Virtual for formatted invoice number
invoiceSchema.virtual('formattedInvoiceNumber').get(function() {
    return this.invoiceNumber;
});

// Delete cached model to ensure schema changes are picked up
if (mongoose.models.Invoice) {
    delete mongoose.models.Invoice;
}

module.exports = mongoose.model('Invoice', invoiceSchema);

