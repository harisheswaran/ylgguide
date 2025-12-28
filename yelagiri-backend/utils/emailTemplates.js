/**
 * HTML Email Templates for Booking Confirmations
 */

/**
 * Generate booking confirmation email HTML
 * @param {Object} data - Email data
 * @returns {string} HTML email content
 */
function getBookingConfirmationEmail(data) {
    const {
        guestName,
        bookingId,
        packageName,
        checkInDate,
        checkOutDate,
        guests,
        totalAmount,
        invoiceNumber,
        companyName = process.env.COMPANY_NAME || 'Go Yelagiri',
        companyEmail = process.env.COMPANY_EMAIL || 'info@goyelagiri.com',
        companyPhone = process.env.COMPANY_PHONE || '+91 98765 43210',
        companyWebsite = process.env.COMPANY_WEBSITE || 'https://goyelagiri.com'
    } = data;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #1A4D2E 0%, #2D6A4F 100%);
            color: #ffffff;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .header p {
            margin: 10px 0 0;
            font-size: 16px;
            opacity: 0.9;
        }
        .content {
            padding: 30px;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #1A4D2E;
        }
        .success-badge {
            background: #D4EDDA;
            border: 1px solid #C3E6CB;
            color: #155724;
            padding: 12px 20px;
            border-radius: 6px;
            margin-bottom: 25px;
            text-align: center;
            font-weight: 500;
        }
        .booking-details {
            background: #F8F9FA;
            border-left: 4px solid #C9A961;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #E9ECEF;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-weight: 600;
            color: #495057;
        }
        .detail-value {
            color: #212529;
            text-align: right;
        }
        .total-amount {
            background: #1A4D2E;
            color: #ffffff;
            padding: 15px 20px;
            border-radius: 6px;
            margin: 20px 0;
            text-align: center;
        }
        .total-amount .label {
            font-size: 14px;
            opacity: 0.9;
            margin-bottom: 5px;
        }
        .total-amount .amount {
            font-size: 32px;
            font-weight: 700;
        }
        .info-box {
            background: #FFF3CD;
            border: 1px solid #FFEAA7;
            color: #856404;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
        }
        .info-box strong {
            display: block;
            margin-bottom: 5px;
        }
        .cta-button {
            display: inline-block;
            background: #C9A961;
            color: #ffffff;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: 600;
            text-align: center;
        }
        .footer {
            background: #F8F9FA;
            padding: 25px;
            text-align: center;
            border-top: 1px solid #E9ECEF;
        }
        .footer p {
            margin: 5px 0;
            font-size: 14px;
            color: #6C757D;
        }
        .contact-info {
            margin: 15px 0;
        }
        .contact-info a {
            color: #1A4D2E;
            text-decoration: none;
        }
        @media only screen and (max-width: 600px) {
            .container {
                margin: 10px;
            }
            .content {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Booking Confirmed!</h1>
            <p>Your luxury travel experience awaits</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                Dear ${guestName},
            </div>
            
            <div class="success-badge">
                ✓ Your payment has been successfully processed
            </div>
            
            <p>Thank you for choosing ${companyName}! We're thrilled to confirm your booking for an unforgettable experience in the beautiful hills of Yelagiri.</p>
            
            <div class="booking-details">
                <h3 style="margin-top: 0; color: #1A4D2E;">Booking Details</h3>
                <div class="detail-row">
                    <span class="detail-label">Booking ID:</span>
                    <span class="detail-value"><strong>${bookingId}</strong></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Invoice Number:</span>
                    <span class="detail-value">${invoiceNumber}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Package:</span>
                    <span class="detail-value">${packageName}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Check-in:</span>
                    <span class="detail-value">${new Date(checkInDate).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Check-out:</span>
                    <span class="detail-value">${new Date(checkOutDate).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Number of Guests:</span>
                    <span class="detail-value">${guests}</span>
                </div>
            </div>
            
            <div class="total-amount">
                <div class="label">Total Amount Paid</div>
                <div class="amount">₹${totalAmount.toLocaleString('en-IN')}</div>
            </div>
            
            <div class="info-box">
                <strong>📎 Invoice Attached</strong>
                Your official invoice is attached to this email. Please keep it for your records.
            </div>
            
            <p>We look forward to welcoming you to Yelagiri! If you have any questions or special requests, please don't hesitate to contact us.</p>
            
            <p style="margin-top: 30px;">
                <strong>What's Next?</strong><br>
                • You'll receive a reminder email 3 days before your check-in<br>
                • Please carry a valid ID proof for verification<br>
                • Arrive between 2:00 PM - 6:00 PM on your check-in date
            </p>
        </div>
        
        <div class="footer">
            <h4 style="color: #1A4D2E; margin-top: 0;">Need Help?</h4>
            <div class="contact-info">
                <p>📧 Email: <a href="mailto:${companyEmail}">${companyEmail}</a></p>
                <p>📞 Phone: <a href="tel:${companyPhone}">${companyPhone}</a></p>
                <p>🌐 Website: <a href="${companyWebsite}">${companyWebsite}</a></p>
            </div>
            <p style="margin-top: 20px; font-size: 12px; color: #ADB5BD;">
                © ${new Date().getFullYear()} ${companyName}. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>
    `;
}

/**
 * Generate plain text version of booking confirmation email
 * @param {Object} data - Email data
 * @returns {string} Plain text email content
 */
function getBookingConfirmationText(data) {
    const {
        guestName,
        bookingId,
        packageName,
        checkInDate,
        checkOutDate,
        guests,
        totalAmount,
        invoiceNumber,
        companyName = process.env.COMPANY_NAME || 'Go Yelagiri',
        companyEmail = process.env.COMPANY_EMAIL || 'info@goyelagiri.com',
        companyPhone = process.env.COMPANY_PHONE || '+91 98765 43210'
    } = data;

    return `
BOOKING CONFIRMED!

Dear ${guestName},

Thank you for choosing ${companyName}! Your booking has been confirmed.

BOOKING DETAILS
----------------
Booking ID: ${bookingId}
Invoice Number: ${invoiceNumber}
Package: ${packageName}
Check-in: ${new Date(checkInDate).toLocaleDateString('en-IN')}
Check-out: ${new Date(checkOutDate).toLocaleDateString('en-IN')}
Number of Guests: ${guests}

TOTAL AMOUNT PAID: ₹${totalAmount.toLocaleString('en-IN')}

Your invoice is attached to this email. Please keep it for your records.

WHAT'S NEXT?
• You'll receive a reminder email 3 days before your check-in
• Please carry a valid ID proof for verification
• Arrive between 2:00 PM - 6:00 PM on your check-in date

NEED HELP?
Email: ${companyEmail}
Phone: ${companyPhone}

We look forward to welcoming you to Yelagiri!

Best regards,
${companyName} Team
    `;
}

module.exports = {
    getBookingConfirmationEmail,
    getBookingConfirmationText
};
