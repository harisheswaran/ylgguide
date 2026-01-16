const Invoice = require('../models/Invoice');
const { generateInvoiceNumber } = require('../utils/invoiceNumberGenerator');
const { generateInvoicePDF } = require('../utils/invoiceGenerator');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const mongoose = require('mongoose');

// In-memory store for mock invoices
global.mockInvoices = global.mockInvoices || {};

// Temporary mock mode for database operations
const MOCK_DB_MODE = process.env.MOCK_DB_MODE === 'true';

/**
 * Create invoice for a booking
 * @param {Object} booking - Booking object
 * @returns {Promise<Object>} Created invoice
 */
/**
 * Create invoice for a booking
 * @param {Object} booking - Booking object
 * @returns {Promise<Object>} Created invoice
 */
async function createInvoice(booking) {
    try {
        // Check if invoice already exists for this booking
        if (!MOCK_DB_MODE) {
            const existingInvoice = await Invoice.findOne({ booking: booking._id });
            if (existingInvoice) {
                console.log('Invoice already exists for booking:', booking._id);
                // If it exists but PDF is missing, trigger regen and AWAIT it for preview consistency
                if (!existingInvoice.pdfPath || !fs.existsSync(existingInvoice.pdfPath)) {
                     console.log('Invoice PDF missing, regenerating and awaiting...');
                     await generateInvoicePDFAsync(existingInvoice);
                }
                return existingInvoice;
            }
        } else {
            // In Mock Mode, if invoice exists in memory, regenerate the PDF to ensure latest design
            // This aids development so we don't need to create new bookings constantly to see PDF changes
            const mockInvoiceKey = Object.keys(global.mockInvoices).find(key => global.mockInvoices[key].booking === booking._id);
            if (mockInvoiceKey) {
                console.log('🎭 MOCK MODE: Regenerating PDF for existing mock booking to reflect latest design.');
                const invoice = global.mockInvoices[mockInvoiceKey];
                await generateInvoicePDFAsync(invoice);
                return invoice;
            }
        }

        // Generate unique invoice number
        const invoiceNumber = MOCK_DB_MODE ? `INV-MOCK-${Date.now()}` : await generateInvoiceNumber();

        // Calculate GST
        const gstRate = parseFloat(process.env.GST_RATE) || 18;
        const baseAmount = booking.baseAmount || booking.totalAmount / (1 + gstRate / 100);
        const gstAmount = booking.taxAmount || (baseAmount * gstRate) / 100;

        let invoiceData;
        const isGuide = !!booking.bookingDate;

        if (isGuide) {
            invoiceData = prepareGuideInvoiceData(booking, invoiceNumber, baseAmount, gstRate, gstAmount);
        } else {
            invoiceData = preparePackageInvoiceData(booking, invoiceNumber, baseAmount, gstRate, gstAmount);
        }

        let invoice;
        if (MOCK_DB_MODE) {
            invoice = {
                _id: invoiceNumber,
                ...invoiceData,
                generationStatus: 'generated'
            };
        } else {
            invoice = new Invoice({
                ...invoiceData,
                generationStatus: 'pending'
            });
        }

        // Save and Generate
        if (MOCK_DB_MODE) {
            await generateInvoicePDFAsync(invoice);
        } else {
            await invoice.save();
            await generateInvoicePDFAsync(invoice);
        }

        return invoice;
    } catch (error) {
        console.error('Error creating invoice:', error);
        throw new Error('Failed to create invoice: ' + error.message);
    }
}

function prepareGuideInvoiceData(booking, invoiceNumber, baseAmount, gstRate, gstAmount) {
    // Extract number of guests from bookingPeople string (e.g., "2-4 People" -> 2)
    let numberOfGuests = 1;
    if (booking.bookingPeople) {
        const match = booking.bookingPeople.match(/(\d+)/);
        if (match) {
            numberOfGuests = parseInt(match[1], 10);
        }
    }
    
    return {
        invoiceNumber,
        bookingType: 'GuideBooking',
        booking: booking._id,
        invoiceDate: new Date(),
        dueDate: new Date(),
        guestName: booking.guestName,
        guestEmail: booking.guestEmail,
        guestPhone: booking.guestPhone,
        packageName: booking.packageName,
        packageDescription: booking.packageDescription || '',
        // Guide Specific
        bookingDate: booking.bookingDate,
        bookingSlot: booking.bookingSlot,
        bookingPeople: booking.bookingPeople,
        guideEmail: booking.guideEmail,
        guidePhone: booking.guidePhone,
        numberOfGuests: numberOfGuests,
        // Common Financials
        baseAmount,
        gstRate,
        gstAmount,
        totalAmount: booking.totalAmount,
        paymentStatus: 'paid',
        paymentMethod: booking.provider || 'Mock',
        gatewayPaymentId: booking.gatewayPaymentId
    };
}

function preparePackageInvoiceData(booking, invoiceNumber, baseAmount, gstRate, gstAmount) {
    return {
        invoiceNumber,
        bookingType: 'PackageBooking',
        booking: booking._id,
        invoiceDate: new Date(),
        dueDate: new Date(),
        guestName: booking.guestName,
        guestEmail: booking.guestEmail,
        guestPhone: booking.guestPhone,
        packageName: booking.packageName,
        packageDescription: booking.packageDescription || '',
        // Package Specific
        checkInDate: booking.checkIn,
        checkOutDate: booking.checkOut,
        numberOfGuests: booking.guests,
        rooms: booking.rooms,
        accommodationType: booking.accommodationType,
        // Common Financials
        baseAmount,
        gstRate,
        gstAmount,
        totalAmount: booking.totalAmount,
        paymentStatus: 'paid',
        paymentMethod: booking.provider || 'Mock',
        gatewayPaymentId: booking.gatewayPaymentId
    };
}

/**
 * Generate PDF for invoice (async compatible)
 * @param {Object} invoice - Invoice object
 */
async function generateInvoicePDFAsync(invoice) {
    try {
        // Update status to generating
        invoice.generationStatus = 'generating';
        if (!MOCK_DB_MODE && typeof invoice.save === 'function') {
            await invoice.save();
        }

        // Define PDF path (Absolute Path is CRITICAL for reliability)
        const invoiceDir = process.env.INVOICE_STORAGE_PATH 
            ? path.resolve(process.env.INVOICE_STORAGE_PATH)
            : path.join(__dirname, '../invoices');

        // Ensure directory exists
        if (!fs.existsSync(invoiceDir)) {
            fs.mkdirSync(invoiceDir, { recursive: true });
        }

        const fileName = `${invoice.invoiceNumber}.pdf`;
        const filePath = path.join(invoiceDir, fileName);

        // Generate PDF
        await generateInvoicePDF(invoice, filePath);

        // Update invoice with PDF path
        invoice.pdfPath = filePath;
        invoice.pdfUrl = `/api/invoices/${invoice._id || 'mock'}/download`;
        invoice.generationStatus = 'generated';
        invoice.generatedAt = new Date();
        
        if (!MOCK_DB_MODE && typeof invoice.save === 'function') {
            await invoice.save();
        } else if (MOCK_DB_MODE) {
            // Save to in-memory store
            global.mockInvoices[invoice.invoiceNumber] = invoice;
            console.log(`🧠 Saved mock invoice ${invoice.invoiceNumber} to memory store`);
        }

        console.log('✅ Invoice PDF generated successfully:', invoice.invoiceNumber);
    } catch (error) {
        console.error('❌ Error generating invoice PDF:', error);
        invoice.generationStatus = 'failed';
        if (!MOCK_DB_MODE && typeof invoice.save === 'function') {
            await invoice.save();
        }
    }
}

/**
 * Get invoice by ID
 * @param {string} invoiceId - Invoice ID
 * @returns {Promise<Object>} Invoice object
 */
async function getInvoiceById(invoiceId) {
    try {
        // Check in-memory mock store first
        if (global.mockInvoices && global.mockInvoices[invoiceId]) {
            console.log(`🧠 Found invoice ${invoiceId} in mock store`);
            // Return object with necessary structure
            const mockData = global.mockInvoices[invoiceId];
            return {
                ...mockData,
                toObject: () => mockData
            };
        }

        // Try searching by Mongo ID if valid
        if (mongoose.Types.ObjectId.isValid(invoiceId)) {
            const invoice = await Invoice.findById(invoiceId).populate('booking');
            if (invoice) return invoice;
        }

        // Fallback: Try searching by Invoice Number
        console.log(`🔍 Searching by Invoice Number: ${invoiceId}`);
        const invoiceByNum = await Invoice.findOne({ invoiceNumber: invoiceId }).populate('booking');
        return invoiceByNum;
    } catch (error) {
        console.error('Error fetching invoice:', error);
        throw new Error('Failed to fetch invoice: ' + error.message);
    }
}

/**
 * Get invoice by booking ID
 * @param {string} bookingId - Booking ID
 * @returns {Promise<Object>} Invoice object
 */
async function getInvoiceByBookingId(bookingId) {
    try {
        const invoice = await Invoice.findOne({ booking: bookingId });
        return invoice;
    } catch (error) {
        console.error('Error fetching invoice by booking:', error);
        throw new Error('Failed to fetch invoice: ' + error.message);
    }
}

/**
 * Generate download token for invoice
 * @param {string} invoiceId - Invoice ID
 * @returns {string} Download token
 */
function generateDownloadToken(invoiceId) {
    const secret = process.env.INVOICE_TOKEN_SECRET || 'default-secret-change-this';
    const token = crypto
        .createHmac('sha256', secret)
        .update(invoiceId.toString())
        .digest('hex');
    return token;
}

/**
 * Verify download token
 * @param {string} invoiceId - Invoice ID
 * @param {string} token - Token to verify
 * @returns {boolean} Verification result
 */
function verifyDownloadToken(invoiceId, token) {
    const expectedToken = generateDownloadToken(invoiceId);
    return expectedToken === token;
}

/**
 * Get all invoices (admin)
 * @param {Object} filters - Query filters
 * @param {Object} options - Pagination options
 * @returns {Promise<Array>} List of invoices
 */
async function getAllInvoices(filters = {}, options = {}) {
    try {
        const { page = 1, limit = 20, sortBy = '-createdAt' } = options;
        
        const invoices = await Invoice.find(filters)
            .populate('booking')
            .sort(sortBy)
            .limit(limit)
            .skip((page - 1) * limit);

        const total = await Invoice.countDocuments(filters);

        return {
            invoices,
            total,
            page,
            pages: Math.ceil(total / limit)
        };
    } catch (error) {
        console.error('Error fetching invoices:', error);
        throw new Error('Failed to fetch invoices: ' + error.message);
    }
}

/**
 * Regenerate invoice PDF
 * @param {string} invoiceId - Invoice ID
 * @returns {Promise<Object>} Updated invoice
 */
async function regenerateInvoicePDF(invoiceId) {
    try {
        const invoice = await getInvoiceById(invoiceId);
        if (!invoice) {
            throw new Error('Invoice not found');
        }

        await generateInvoicePDFAsync(invoice);
        return invoice;
    } catch (error) {
        console.error('Error regenerating invoice PDF:', error);
        throw new Error('Failed to regenerate invoice: ' + error.message);
    }
}

module.exports = {
    createInvoice,
    getInvoiceById,
    getInvoiceByBookingId,
    generateDownloadToken,
    verifyDownloadToken,
    getAllInvoices,
    regenerateInvoicePDF
};
