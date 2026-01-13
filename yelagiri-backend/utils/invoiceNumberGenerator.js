const Invoice = require('../models/Invoice');

// Temporary mock mode for database operations
const MOCK_DB_MODE = process.env.MOCK_DB_MODE === 'true';

/**
 * Generate unique invoice number in format: INV-YYYY-XXXX
 * @returns {Promise<string>} Invoice number
 */
async function generateInvoiceNumber() {
    if (MOCK_DB_MODE) {
        // Generate mock invoice number
        const currentYear = new Date().getFullYear();
        const randomNum = Math.floor(Math.random() * 9999) + 1;
        const paddedSequence = randomNum.toString().padStart(4, '0');
        return `INV-${currentYear}-${paddedSequence}`;
    }

    const currentYear = new Date().getFullYear();
    const prefix = process.env.INVOICE_PREFIX || 'INV';
    
    // Find the latest invoice for the current year
    const latestInvoice = await Invoice.findOne({
        invoiceNumber: new RegExp(`^${prefix}-${currentYear}-`)
    }).sort({ invoiceNumber: -1 });
    
    let sequenceNumber = 1;
    
    if (latestInvoice) {
        // Extract sequence number from last invoice
        const lastNumber = latestInvoice.invoiceNumber.split('-').pop();
        sequenceNumber = parseInt(lastNumber) + 1;
    }
    
    // Format: INV-2025-0001
    const paddedSequence = sequenceNumber.toString().padStart(4, '0');
    return `${prefix}-${currentYear}-${paddedSequence}`;
}

module.exports = { generateInvoiceNumber };
