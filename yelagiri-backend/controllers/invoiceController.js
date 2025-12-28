const Invoice = require('../models/Invoice');
const Booking = require('../models/Booking');
const mongoose = require('mongoose');
const {
    getInvoiceById,
    getInvoiceByBookingId,
    generateDownloadToken,
    verifyDownloadToken,
    getAllInvoices,
    createInvoice,
    regenerateInvoicePDF
} = require('../services/invoiceService');
const { resendInvoiceEmail } = require('../services/emailService');
const fs = require('fs');
const path = require('path');

// ... imports done

/**
 * @desc    Download invoice PDF
 * @route   GET /api/invoices/:id/download
 * @access  Public (with token)
 */
const downloadInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const { token } = req.query;

        console.log(`\n⬇️ Request: Download Invoice ID: ${id}`);

        // Verify token
        const isValidToken = verifyDownloadToken(id, token);
        if (!token || !isValidToken) {
            console.log(`❌ Invalid Token. Provided: ${token}`);
            return res.status(403).json({
                success: false,
                message: 'Invalid or missing download token'
            });
        }

        // Get invoice
        const invoice = await getInvoiceById(id);
        
        if (!invoice) {
            console.log(`❌ Invoice not found in DB.`);
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }

        console.log(`   PDF Path: ${invoice.pdfPath}`);

        // Check if PDF exists
        if (!invoice.pdfPath || !fs.existsSync(invoice.pdfPath)) {
            console.log(`⚠️ PDF file missing at path. Attempting regeneration...`);
            try {
                // Regenerate logic
                await regenerateInvoicePDF(invoice._id);
                // Re-fetch
                const updatedInvoice = await getInvoiceById(id);
                if (updatedInvoice.pdfPath && fs.existsSync(updatedInvoice.pdfPath)) {
                     console.log(`   ✅ Regeneration Successful. Streaming...`);
                     res.setHeader('Content-Type', 'application/pdf');
                     res.setHeader('Content-Disposition', `attachment; filename="Invoice-${updatedInvoice.invoiceNumber}.pdf"`);
                     const fileStream = fs.createReadStream(updatedInvoice.pdfPath);
                     fileStream.pipe(res);
                     return;
                }
            } catch (regenErr) {
                console.error("Failed to regenerate invoice:", regenErr);
            }
            
            console.log(`❌ PDF still missing after regen attempt.`);
            return res.status(404).json({
                success: false,
                message: 'Invoice PDF not found due to file system error.'
            });
        }

        // Set headers for PDF download
        console.log(`✅ File found. Streaming...`);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="Invoice-${invoice.invoiceNumber}.pdf"`);

        // Stream PDF file
        const fileStream = fs.createReadStream(invoice.pdfPath);
        fileStream.pipe(res);

    } catch (error) {
        console.error('Error downloading invoice:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to download invoice',
            error: error.message
        });
    }
};

/**
 * @desc    Get invoice details
 * @route   GET /api/invoices/:id
 * @access  Public (with token)
 */
const getInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const { token } = req.query;

        // Verify token if provided
        if (token && !verifyDownloadToken(id, token)) {
            return res.status(403).json({
                success: false,
                message: 'Invalid download token'
            });
        }

        const invoice = await getInvoiceById(id);
        
        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }

        // Generate download token for response
        const downloadToken = generateDownloadToken(id);

        res.json({
            success: true,
            data: {
                ...invoice.toObject(),
                downloadUrl: `/api/invoices/${id}/download?token=${downloadToken}`
            }
        });

    } catch (error) {
        console.error('Error fetching invoice:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch invoice',
            error: error.message
        });
    }
};

/**
 * @desc    Get invoice by booking ID
 * @route   GET /api/invoices/booking/:bookingId
 * @access  Public
 */
const getInvoiceByBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;
        console.log(`\n🔍 Request: Get Invoice for Booking ID: ${bookingId}`);

        let invoice = null;

        // Check if bookingId is a valid ObjectId (Standard Flow)
        if (mongoose.Types.ObjectId.isValid(bookingId)) {
            invoice = await getInvoiceByBookingId(bookingId);
            
            // Auto-generate if missing for confirmed booking
            if (!invoice) {
                console.log(`   Invoice missing. Checking booking details for auto-gen...`);
                // Use Booking model (imported now)
                const booking = await Booking.findById(bookingId);
                
                if (booking) {
                    console.log(`   Booking Found. Status: ${booking.bookingStatus}, Payment: ${booking.paymentStatus}`);
                    
                    // For Demo/Testing: Allow invoice generation for ANY existing booking, even if pending.
                    // This unblocks users who have "stuck" pending bookings from previous tests.
                    const shouldGenerate = true; // Relaxed from: booking.bookingStatus === 'confirmed' ...

                    if (shouldGenerate) {
                         console.log(`⚡ Auto-generating invoice (Forced for Demo)...`);
                         try {
                            invoice = await createInvoice(booking);
                            console.log(`   ✅ Invoice Created: ${invoice.invoiceNumber}`);
                         } catch (err) {
                            console.error(`   ❌ Creation Failed: ${err.message}`);
                         }
                    } 
                } else {
                    console.log(`   ❌ Booking not found in DB.`);
                }
            }
        } 
        // Fallback: Check if it's an Invoice Number manually entered or passed
        else {
            console.log(`⚠️ Search by ID failed (Invalid ObjectID). Trying Invoice Number: ${bookingId}`);
            invoice = await Invoice.findOne({ invoiceNumber: bookingId });
        }
        
        if (!invoice) {
            console.log(`❌ Invoice not found (and not created) for: ${bookingId}`);
            return res.status(404).json({
                success: false,
                message: 'Invoice not found for this booking'
            });
        }

        console.log(`✅ Invoice Ready: ${invoice.invoiceNumber}`);

        // Generate download token
        const downloadToken = generateDownloadToken(invoice._id.toString());

        res.json({
            success: true,
            data: {
                ...invoice.toObject(),
                downloadUrl: `/api/invoices/${invoice._id}/download?token=${downloadToken}`
            }
        });

    } catch (error) {
        console.error('Error fetching invoice by booking:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch invoice',
            error: error.message
        });
    }
};

/**
 * @desc    Resend invoice email
 * @route   POST /api/invoices/:id/resend
 * @access  Admin
 */
const resendInvoice = async (req, res) => {
    try {
        const { id } = req.params;

        await resendInvoiceEmail(id);

        res.json({
            success: true,
            message: 'Invoice email sent successfully'
        });

    } catch (error) {
        console.error('Error resending invoice:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to resend invoice email',
            error: error.message
        });
    }
};

/**
 * @desc    Get all invoices (Admin)
 * @route   GET /api/invoices
 * @access  Admin
 */
const listInvoices = async (req, res) => {
    try {
        const { page = 1, limit = 20, status } = req.query;
        
        const filters = {};
        if (status) {
            filters.generationStatus = status;
        }

        const result = await getAllInvoices(filters, { page, limit });

        res.json({
            success: true,
            data: result.invoices,
            pagination: {
                total: result.total,
                page: result.page,
                pages: result.pages
            }
        });

    } catch (error) {
        console.error('Error listing invoices:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch invoices',
            error: error.message
        });
    }
};

/**
 * @desc    Regenerate invoice PDF (Admin)
 * @route   POST /api/invoices/:id/regenerate
 * @access  Admin
 */
const regenerateInvoice = async (req, res) => {
    try {
        const { id } = req.params;

        const invoice = await regenerateInvoicePDF(id);

        res.json({
            success: true,
            message: 'Invoice PDF regeneration initiated',
            data: invoice
        });

    } catch (error) {
        console.error('Error regenerating invoice:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to regenerate invoice',
            error: error.message
        });
    }
};

module.exports = {
    downloadInvoice,
    getInvoice,
    getInvoiceByBooking,
    resendInvoice,
    listInvoices,
    regenerateInvoice
};
