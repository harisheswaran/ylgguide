/**
 * HTML Email Templates for Booking Confirmations
 */

/**
 * Generate booking confirmation email HTML
 * @param {Object} data - Email data
 * @returns {string} HTML email content
 */
/**
 * Generate booking confirmation email HTML
 * @param {Object} data - Email data
 * @returns {string} HTML email content
 */
function getBookingConfirmationEmail(data) {
    if (data.bookingDate) {
        return getGuideConfirmationEmail(data);
    }
    return getPackageConfirmationEmail(data);
}

/**
 * Generate plain text version of booking confirmation email
 * @param {Object} data - Email data
 * @returns {string} Plain text email content
 */
function getBookingConfirmationText(data) {
    if (data.bookingDate) {
        return getGuideConfirmationText(data);
    }
    return getPackageConfirmationText(data);
}

// --- Package Specific Templates ---

function getPackageConfirmationEmail(data) {
    const {
        guestName, bookingId, packageName, checkInDate, checkOutDate, guests, totalAmount, invoiceNumber,
        companyName = process.env.COMPANY_NAME || 'Go Yelagiri',
        companyEmail = process.env.COMPANY_EMAIL || 'info@goyelagiri.com',
        companyPhone = process.env.COMPANY_PHONE || '+91 98765 43210',
        companyWebsite = process.env.COMPANY_WEBSITE || 'https://goyelagiri.com',
        invoiceUrl
    } = data;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #1A4D2E 0%, #2D6A4F 100%); color: #ffffff; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
        .content { padding: 30px; }
        .booking-details { background: #F8F9FA; border-left: 4px solid #C9A961; padding: 20px; margin: 20px 0; border-radius: 4px; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #E9ECEF; }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { font-weight: 600; color: #495057; }
        .detail-value { color: #212529; text-align: right; }
        .total-amount { background: #1A4D2E; color: #ffffff; padding: 15px 20px; border-radius: 6px; margin: 20px 0; text-align: center; }
        .total-amount .amount { font-size: 32px; font-weight: 700; }
        .cta-button { display: inline-block; background: #C9A961; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 700; text-align: center; }
        .footer { background: #F8F9FA; padding: 25px; text-align: center; border-top: 1px solid #E9ECEF; font-size: 14px; color: #6C757D; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Booking Confirmed!</h1>
            <p>Your Luxury Experience Awaits</p>
        </div>
        <div class="content">
            <p>Dear <strong>${guestName}</strong>,</p>
            <p>Thank you for choosing ${companyName}! We are thrilled to confirm your stay.</p>
            
            <div class="booking-details">
                <h3 style="margin-top: 0; color: #1A4D2E;">Booking Details</h3>
                <div class="detail-row"><span class="detail-label">Booking ID:</span><span class="detail-value"><strong>${bookingId}</strong></span></div>
                <div class="detail-row"><span class="detail-label">Invoice Number:</span><span class="detail-value">${invoiceNumber}</span></div>
                <div class="detail-row"><span class="detail-label">Package:</span><span class="detail-value">${packageName}</span></div>
                <div class="detail-row"><span class="detail-label">Check-in:</span><span class="detail-value">${new Date(checkInDate).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span></div>
                <div class="detail-row"><span class="detail-label">Check-out:</span><span class="detail-value">${new Date(checkOutDate).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span></div>
                <div class="detail-row"><span class="detail-label">Guests:</span><span class="detail-value">${guests}</span></div>
            </div>

            <div class="total-amount">
                <div style="font-size: 14px; opacity: 0.9;">Total Amount Paid</div>
                <div class="amount">₹${totalAmount.toLocaleString('en-IN')}</div>
            </div>

            <div style="text-align: center;">
                <a href="${invoiceUrl}" class="cta-button">View & Download Invoice</a>
            </div>

            <p><strong>What's Next?</strong><br>
            • You'll receive a reminder email 3 days before your check-in<br>
            • Please carry a valid ID proof for verification<br>
            • Arrive between 2:00 PM - 6:00 PM on your check-in date</p>
        </div>
        <div class="footer">
            <p>Need Help? Call us at ${companyPhone}</p>
            <p>© ${new Date().getFullYear()} ${companyName}</p>
        </div>
    </div>
</body>
</html>`;
}

function getPackageConfirmationText(data) {
    const { guestName, bookingId, packageName, checkInDate, checkOutDate, guests, totalAmount, invoiceNumber, companyName, companyPhone, invoiceUrl } = data;
    return `BOOKING CONFIRMED!\n\nDear ${guestName},\n\nThank you for choosing ${companyName || 'Go Yelagiri'}!\n\nBOOKING DETAILS\n----------------\nBooking ID: ${bookingId}\nInvoice: ${invoiceNumber}\nPackage: ${packageName}\nCheck-in: ${new Date(checkInDate).toLocaleDateString()}\nCheck-out: ${new Date(checkOutDate).toLocaleDateString()}\nGuests: ${guests}\n\nTOTAL PAID: ₹${totalAmount.toLocaleString('en-IN')}\n\nINVOICE: ${invoiceUrl}\n\nNeed Help? Call ${companyPhone || '+91 98765 43210'}`;
}

// --- Guide Specific Templates ---

function getGuideConfirmationEmail(data) {
    const {
        guestName,
        bookingId,
        packageName,
        totalAmount,
        invoiceNumber,
        // Financial breakdown for guide bookings
        baseAmount,
        gstAmount,
        bookingDate,
        bookingSlot,
        bookingPeople,
        guideEmail,
        guidePhone,
        companyName = process.env.COMPANY_NAME || 'Go Yelagiri',
        companyPhone = process.env.COMPANY_PHONE || '+91 98765 43210',
        invoiceUrl
    } = data;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trek Confirmed</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #4A5D23 0%, #1A4D2E 100%); color: #ffffff; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
        .content { padding: 30px; }
        .booking-details { background: #F8F9FA; border-left: 4px solid #8FA35F; padding: 20px; margin: 20px 0; border-radius: 4px; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #E9ECEF; }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { font-weight: 600; color: #495057; }
        .detail-value { color: #212529; text-align: right; }
        .guide-box { border: 1px solid #BFA76A; background: #BFA76A10; padding: 15px; border-radius: 6px; margin: 20px 0; }
        .total-amount { background: #4A5D23; color: #ffffff; padding: 15px 20px; border-radius: 6px; margin: 20px 0; text-align: center; }
        .total-amount .amount { font-size: 32px; font-weight: 700; }
        .cta-button { display: inline-block; background: #8FA35F; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 700; text-align: center; }
        .footer { background: #F8F9FA; padding: 25px; text-align: center; border-top: 1px solid #E9ECEF; font-size: 14px; color: #6C757D; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏔️ Trek Confirmed!</h1>
            <p>Your Adventure Begins Soon</p>
        </div>
        <div class="content">
            <p>Dear <strong>${guestName}</strong>,</p>
            <p>Your trekking session has been successfully booked!</p>
            
            <div class="booking-details">
                <h3 style="margin-top: 0; color: #4A5D23;">Trek Summary</h3>
                <div class="detail-row"><span class="detail-label">Booking ID:</span><span class="detail-value"><strong>${bookingId}</strong></span></div>
                <div class="detail-row"><span class="detail-label">Invoice Number:</span><span class="detail-value">${invoiceNumber}</span></div>
                <div class="detail-row"><span class="detail-label">Experience:</span><span class="detail-value">${packageName}</span></div>
                <div class="detail-row"><span class="detail-label">Trek Date:</span><span class="detail-value">${new Date(bookingDate).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span></div>
                <div class="detail-row"><span class="detail-label">Time Slot:</span><span class="detail-value">${bookingSlot}</span></div>
                <div class="detail-row"><span class="detail-label">Group Size:</span><span class="detail-value">${bookingPeople}</span></div>
            </div>

            ${(guideEmail || guidePhone) ? `
            <div class="guide-box">
                <h4 style="margin-top: 0; color: #4A5D23;">📞 Your Guide's Contact</h4>
                ${guideEmail ? `<p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${guideEmail}">${guideEmail}</a></p>` : ''}
                ${guidePhone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> <a href="tel:${guidePhone}">${guidePhone}</a></p>` : ''}
                <p style="font-size: 11px; color: #666; margin-top: 10px;">* Coordinate with the guide for the meeting point.</p>
            </div>` : ''}

            <div class="detail-row">
                <span class="detail-label">Base Amount:</span>
                <span class="detail-value">₹${baseAmount.toLocaleString('en-IN')}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">GST (18%):</span>
                <span class="detail-value">₹${gstAmount.toLocaleString('en-IN')}</span>
            </div>
            <div class="total-amount">
                <div style="font-size: 14px; opacity: 0.9;">Total Paid</div>
                <div class="amount">₹${totalAmount.toLocaleString('en-IN')}</div>
            </div>

            <div style="text-align: center;">
                <a href="${invoiceUrl}" class="cta-button">Download Invoice</a>
            </div>

            <p><strong>What's Next?</strong><br>
            • Your guide will contact you shortly<br>
            • Meet 15 mins before ${bookingSlot}<br>
            • Carry ID proof & water</p>
        </div>
        <div class="footer">
            <p>Need Help? Call us at ${companyPhone}</p>
            <p>© ${new Date().getFullYear()} ${companyName}</p>
        </div>
    </div>
</body>
</html>`;
}

function getGuideConfirmationText(data) {
    const { guestName, bookingId, packageName, totalAmount, baseAmount, gstAmount, invoiceNumber, bookingDate, bookingSlot, bookingPeople, guideEmail, guidePhone, companyName, companyPhone, invoiceUrl } = data;
    return `TREK CONFIRMED!\n\nDear ${guestName},\n\nYour trek is booked!\n\nTREK DETAILS\n-------------\nBooking ID: ${bookingId}\nInvoice: ${invoiceNumber}\nExperience: ${packageName}\nTrek Date: ${new Date(bookingDate).toLocaleDateString()}\nTime Slot: ${bookingSlot}\nGroup Size: ${bookingPeople}\n\nBASE AMOUNT: ₹${baseAmount.toLocaleString('en-IN')}\nGST (18%): ₹${gstAmount.toLocaleString('en-IN')}\nTOTAL PAID: ₹${totalAmount.toLocaleString('en-IN')}\n\nINVOICE: ${invoiceUrl}\n\nGUIDE CONTACT\n${guideEmail || ''} ${guidePhone || ''}\n\nNeed Help? Call ${companyPhone || '+91 98765 43210'}`;
}

module.exports = {
    getBookingConfirmationEmail,
    getBookingConfirmationText,
    getGuideConfirmationEmail,
    getGuideConfirmationText
};
