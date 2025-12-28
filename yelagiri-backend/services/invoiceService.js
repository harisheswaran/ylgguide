const Invoice = require('../models/Invoice');
const { generateInvoiceNumber } = require('../utils/invoiceNumberGenerator');
const { generateInvoicePDF } = require('../utils/invoiceGenerator');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

/**
 * Create invoice for a booking
 * @param {Object} booking - Booking object
 * @returns {Promise<Object>} Created invoice
 */
async function createInvoice(booking) {
    try {
        // Check if invoice already exists for this booking
        const existingInvoice = await Invoice.findOne({ booking: booking._id });
        if (existingInvoice) {
            console.log('Invoice already exists for booking:', booking._id);
            // If it exists but PDF is missing, trigger regen
            if (!existingInvoice.pdfPath || !fs.existsSync(existingInvoice.pdfPath)) {
                 console.log('Invoice PDF missing, regenerating...');
                 // We don't await this to keep response fast, but for robustness in test we might want to.
                 // Better to just let generateInvoicePDFAsync run.
                 generateInvoicePDFAsync(existingInvoice);
            }
            return existingInvoice;
        }

        // Generate unique invoice number
        const invoiceNumber = await generateInvoiceNumber();

        // Calculate GST
        const gstRate = parseFloat(process.env.GST_RATE) || 18;
        const baseAmount = booking.baseAmount || booking.totalAmount / (1 + gstRate / 100);
        const gstAmount = booking.taxAmount || (baseAmount * gstRate) / 100;

        // Create invoice
        const invoice = new Invoice({
            invoiceNumber,
            booking: booking._id,
            invoiceDate: new Date(),
            dueDate: new Date(), // Immediate payment
            guestName: booking.guestName,
            guestEmail: booking.guestEmail,
            guestPhone: booking.guestPhone,
            packageName: booking.packageName,
            packageDescription: booking.packageDescription || '',
            checkInDate: booking.checkIn,
            checkOutDate: booking.checkOut,
            numberOfGuests: booking.guests,
            baseAmount: baseAmount,
            gstRate: gstRate,
            gstAmount: gstAmount,
            totalAmount: booking.totalAmount,
            paymentStatus: 'paid',
            paymentMethod: booking.provider || 'Mock',
            gatewayPaymentId: booking.gatewayPaymentId,
            generationStatus: 'pending'
        });

        await invoice.save();

        // Generate PDF asynchronously
        await generateInvoicePDFAsync(invoice);

        return invoice;
    } catch (error) {
        console.error('Error creating invoice:', error);
        throw new Error('Failed to create invoice: ' + error.message);
    }
}

/**
 * Generate PDF for invoice (async)
 * @param {Object} invoice - Invoice object
 */
async function generateInvoicePDFAsync(invoice) {
    try {
        // Update status to generating
        invoice.generationStatus = 'generating';
        await invoice.save();

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
        invoice.pdfUrl = `/api/invoices/${invoice._id}/download`;
        invoice.generationStatus = 'generated';
        invoice.generatedAt = new Date();
        await invoice.save();

        console.log('Invoice PDF generated successfully:', invoice.invoiceNumber);
    } catch (error) {
        console.error('Error generating invoice PDF:', error);
        invoice.generationStatus = 'failed';
        await invoice.save();
    }
}

/**
 * Get invoice by ID
 * @param {string} invoiceId - Invoice ID
 * @returns {Promise<Object>} Invoice object
 */
async function getInvoiceById(invoiceId) {
    try {
        const invoice = await Invoice.findById(invoiceId).populate('booking');
        return invoice;
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
        const invoice = await Invoice.findById(invoiceId);
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
