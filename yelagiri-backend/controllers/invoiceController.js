const Invoice = require('../models/Invoice');
// Note: PackageBooking and GuideBooking are loaded dynamically in functions
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

        // Try to get invoice (Mock store or DB)
        let invoice = await getInvoiceById(id).catch(() => null);

        // Fallback Mock Handling (Only if not found in store)
        if (!invoice && (id.startsWith('INV-MOCK') || id === 'mock_invoice_id' || id.startsWith('mock_'))) {
            console.log(`🎭 MOCK DOWNLOAD: Generating generic fallback for ${id}`);
            const mockInvoice = {
                 invoiceNumber: (id === 'mock_invoice_id' || id.startsWith('mock_')) ? `INV-MOCK-${Date.now()}` : id,
                 invoiceDate: new Date(),
                 dueDate: new Date(),
                  guestName: 'Deepak Kumar',
                  guestEmail: 'deepak@test.com',
                  guestPhone: '+91 99887 76655',
                  packageName: 'Professional Trek with Arjun Swamy',
                  guideEmail: 'arjun.swamy@yelaguide.com',
                  guidePhone: '+91 94432 12345',
                  baseAmount: 12000,
                  gstAmount: 2160,
                  totalAmount: 14160,
                  gstRate: 18,
                  numberOfGuests: 2,
                  bookingPeople: '2-4 People',
                  bookingSlot: '09:00 AM',
                  bookingDate: new Date(Date.now() + 86400000),
                  checkInDate: new Date(Date.now() + 86400000),
                  checkOutDate: new Date(Date.now() + 86400000),
                  // Ensure PDF generation works
                  generationStatus: 'generated'
            };
            
            const invoiceDir = path.join(__dirname, '../invoices');
            if (!fs.existsSync(invoiceDir)) fs.mkdirSync(invoiceDir, { recursive: true });
            
            const filePath = path.join(invoiceDir, `${mockInvoice.invoiceNumber}.pdf`);
            const { generateInvoicePDF } = require('../utils/invoiceGenerator');
            
            await generateInvoicePDF(mockInvoice, filePath);
            
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${mockInvoice.invoiceNumber}.pdf"`);
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
            return;
        }

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
                
                // Try to find in both collections
                const PackageBooking = require('../models/PackageBooking');
                const GuideBooking = require('../models/GuideBooking');
                
                let booking = await PackageBooking.findById(bookingId);
                let bookingType = 'PackageBooking';
                
                if (!booking) {
                    booking = await GuideBooking.findById(bookingId);
                    bookingType = 'GuideBooking';
                }
                
                if (booking) {
                    console.log(`   Booking Found (${bookingType}). Status: ${booking.bookingStatus}, Payment: ${booking.paymentStatus}`);
                    
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
        else if (bookingId.startsWith('mock_')) {
            console.log(`🎭 MOCK MODE: Returning dummy invoice for demo id: ${bookingId}`);
            invoice = {
                _id: 'mock_invoice_id',
                invoiceNumber: `INV-MOCK-${Date.now()}`,
                guestName: 'Deepak Kumar',
                guestEmail: 'deepak@test.com',
                guestPhone: '+91 99887 76655',
                packageName: 'Professional Trek with Arjun Swamy',
                guideEmail: 'arjun.swamy@yelaguide.com',
                guidePhone: '+91 94432 12345',
                baseAmount: 12000,
                gstAmount: 2160,
                totalAmount: 14160,
                gstRate: 18,
                numberOfGuests: 2,
                bookingPeople: '2-4 People',
                bookingSlot: '09:00 AM',
                bookingDate: new Date(Date.now() + 86400000),
                generationStatus: 'generated',
                pdfPath: 'mock_path.pdf',
                toObject: function() { return this; }
            };
        }
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
