const { getTransporter } = require('../config/email');
const { getBookingConfirmationEmail, getBookingConfirmationText } = require('../utils/emailTemplates');
const Invoice = require('../models/Invoice');
const fs = require('fs');
const nodemailer = require('nodemailer');

// Temporary mock mode for database operations
const MOCK_DB_MODE = process.env.MOCK_DB_MODE === 'true';

/**
 * Send booking confirmation email with invoice
 * @param {Object} booking - Booking object
 * @param {Object} invoice - Invoice object
 * @returns {Promise<Object>} Email send result
 */
async function sendBookingConfirmationEmail(booking, invoice) {
    try {
        const transporter = await getTransporter();
        const emailData = {
            guestName: booking.guestName,
            bookingId: booking._id.toString(),
            packageName: booking.packageName,
            checkInDate: booking.checkIn,
            checkOutDate: booking.checkOut,
            guests: booking.guests,
            totalAmount: booking.totalAmount,
            invoiceNumber: invoice.invoiceNumber,
            // Include financial breakdown for guide bookings
            baseAmount: invoice.baseAmount,
            gstAmount: invoice.gstAmount,
            // Trekking specific fields
            bookingDate: booking.bookingDate,
            bookingSlot: booking.bookingSlot,
            bookingPeople: booking.bookingPeople,
            guideEmail: booking.guideEmail,
            guidePhone: booking.guidePhone,
            invoiceUrl: `${process.env.NEXT_PUBLIC_API_URL || 'https://goyelagiri.com'}/api/invoices/${invoice.invoiceNumber}/download`
        };

        const htmlContent = getBookingConfirmationEmail(emailData);
        const textContent = getBookingConfirmationText(emailData);

        const mailOptions = {
            from: {
                name: process.env.EMAIL_FROM_NAME || 'Go Yelagiri',
                address: process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USER || 'no-reply@goyelagiri.com'
            },
            to: booking.guestEmail,
            subject: `Booking Confirmed - ${booking.packageName} | ${process.env.COMPANY_NAME || 'Go Yelagiri'}`,
            html: htmlContent,
            text: textContent,
            attachments: []
        };

        // Attach invoice PDF if available
        if (invoice.pdfPath && fs.existsSync(invoice.pdfPath)) {
            mailOptions.attachments.push({
                filename: `Invoice-${invoice.invoiceNumber}.pdf`,
                path: invoice.pdfPath,
                contentType: 'application/pdf'
            });
        }

        const result = await transporter.sendMail(mailOptions);

        // Update invoice email status (skip in mock mode)
        if (!MOCK_DB_MODE) {
            invoice.emailSent = true;
            invoice.emailSentAt = new Date();
            invoice.emailAttempts = (invoice.emailAttempts || 0) + 1;
            await invoice.save();
        }

        console.log('✅ Booking confirmation email sent to:', booking.guestEmail);
        
        // Log Ethereal preview URL if applicable
        const previewUrl = nodemailer.getTestMessageUrl(result);
        if (previewUrl) {
            console.log('🔗 VIEW EMAIL (Preview):', previewUrl);
        }

        return result;

    } catch (error) {
        console.error('❌ Error sending booking confirmation email:', error);
        
        // Update invoice email attempts (skip in mock mode)
        if (!MOCK_DB_MODE && invoice) {
            invoice.emailAttempts = (invoice.emailAttempts || 0) + 1;
            await invoice.save();
        }

        throw new Error('Failed to send confirmation email: ' + error.message);
    }
}

/**
 * Resend invoice email
 * @param {string} invoiceId - Invoice ID
 * @returns {Promise<Object>} Email send result
 */
async function resendInvoiceEmail(invoiceId) {
    try {
        let invoice;
        
        if (MOCK_DB_MODE) {
            // Mock invoice for testing
            invoice = {
                _id: invoiceId,
                invoiceNumber: `INV-MOCK-${Date.now()}`,
                booking: {
                    guestName: 'Mock User',
                    guestEmail: 'mock@example.com',
                    packageName: 'Mock Package'
                }
            };
        } else {
            invoice = await Invoice.findById(invoiceId).populate('booking');
            
            if (!invoice) {
                throw new Error('Invoice not found');
            }

            if (!invoice.booking) {
                throw new Error('Booking not found for invoice');
            }
        }

        return await sendBookingConfirmationEmail(invoice.booking, invoice);
    } catch (error) {
        console.error('Error resending invoice email:', error);
        throw new Error('Failed to resend invoice email: ' + error.message);
    }
}

/**
 * Send email with retry logic
 * @param {Object} mailOptions - Email options
 * @param {number} maxRetries - Maximum retry attempts
 * @returns {Promise<Object>} Email send result
 */
async function sendEmailWithRetry(mailOptions, maxRetries = 3) {
    let lastError;
    const transporter = await getTransporter();
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const result = await transporter.sendMail(mailOptions);
            console.log(`Email sent successfully on attempt ${attempt}`);
            return result;
        } catch (error) {
            console.error(`Email send attempt ${attempt} failed:`, error.message);
            lastError = error;
            
            if (attempt < maxRetries) {
                // Wait before retrying (exponential backoff)
                const delay = Math.pow(2, attempt) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    
    throw new Error(`Failed to send email after ${maxRetries} attempts: ${lastError.message}`);
}

/**
 * Send custom email
 * @param {Object} emailOptions - Email options
 * @returns {Promise<Object>} Email send result
 */
async function sendCustomEmail(emailOptions) {
    try {
        const transporter = await getTransporter();
        const { to, subject, html, text, attachments = [] } = emailOptions;

        const mailOptions = {
            from: {
                name: process.env.EMAIL_FROM_NAME || 'Go Yelagiri',
                address: process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USER || 'no-reply@goyelagiri.com'
            },
            to,
            subject,
            html,
            text,
            attachments
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Custom email sent to:', to);
        return result;

    } catch (error) {
        console.error('Error sending custom email:', error);
        throw new Error('Failed to send email: ' + error.message);
    }
}

module.exports = {
    sendBookingConfirmationEmail,
    resendInvoiceEmail,
    sendEmailWithRetry,
    sendCustomEmail
};

