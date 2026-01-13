const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Generate professional invoice PDF
 * @param {Object} invoiceData - Invoice data
 * @param {string} outputPath - Path to save PDF
 * @returns {Promise<string>} Path to generated PDF
 */
async function generateInvoicePDF(invoiceData, outputPath) {
    return new Promise((resolve, reject) => {
        try {
            // Create PDF document
            const doc = new PDFDocument({
                size: 'A4',
                margin: 50,
                info: {
                    Title: `Invoice ${invoiceData.invoiceNumber}`,
                    Author: process.env.COMPANY_NAME || 'Go Yelagiri',
                    Subject: 'Booking Invoice',
                    Keywords: 'invoice, booking, travel'
                }
            });

            // Ensure output directory exists
            const dir = path.dirname(outputPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            // Pipe to file
            const stream = fs.createWriteStream(outputPath);
            doc.pipe(stream);

            // Company details
            const companyName = process.env.COMPANY_NAME || 'Go Yelagiri';
            const companyAddress = process.env.COMPANY_ADDRESS || '123 Hill Station Road, Yelagiri Hills, Tamil Nadu 635853';
            const companyPhone = process.env.COMPANY_PHONE || '+91 98765 43210';
            const companyEmail = process.env.COMPANY_EMAIL || 'info@goyelagiri.com';
            const companyGST = process.env.COMPANY_GST_NUMBER || '33XXXXX1234X1ZX';

            // Colors
            const primaryColor = '#1A4D2E';
            const accentColor = '#C9A961';
            const textColor = '#333333';
            const lightGray = '#F8F9FA';

            // ... (Previous setup code remains same, handled by main function scope)

            // Header with company branding
            doc.fontSize(28)
               .fillColor(primaryColor)
               .font('Helvetica-Bold')
               .text(companyName, 50, 50);

            doc.fontSize(10)
               .fillColor(textColor)
               .font('Helvetica')
               .text(companyAddress, 50, 85, { width: 250 })
               .text(`Phone: ${companyPhone}`, 50, 110)
               .text(`Email: ${companyEmail}`, 50, 125)
               .text(`GST No: ${companyGST}`, 50, 140);

            // Invoice title and number
            doc.fontSize(24)
               .fillColor(primaryColor)
               .font('Helvetica-Bold')
               .text('INVOICE', 350, 50, { align: 'right' });

            doc.fontSize(11)
               .fillColor(textColor)
               .font('Helvetica')
               .text(invoiceData.invoiceNumber, 350, 80, { align: 'right' })
               .text(`Date: ${new Date(invoiceData.invoiceDate).toLocaleDateString('en-IN')}`, 350, 95, { align: 'right' })
               .text(`Due Date: ${new Date(invoiceData.dueDate).toLocaleDateString('en-IN')}`, 350, 110, { align: 'right' });

            // Horizontal line
            doc.strokeColor(accentColor)
               .lineWidth(2)
               .moveTo(50, 170)
               .lineTo(545, 170)
               .stroke();

            // Bill to section
            doc.fontSize(12)
               .fillColor(primaryColor)
               .font('Helvetica-Bold')
               .text('BILL TO:', 50, 190);

            doc.fontSize(11)
               .fillColor(textColor)
               .font('Helvetica')
               .text(invoiceData.guestName, 50, 210)
               .text(invoiceData.guestEmail, 50, 225)
               .text(invoiceData.guestPhone, 50, 240);

            // Payment status badge
            const statusX = 400;
            const statusY = 190;
            doc.roundedRect(statusX, statusY, 145, 30, 5)
               .fillAndStroke('#D4EDDA', '#C3E6CB');

            doc.fontSize(12)
               .fillColor('#155724')
               .font('Helvetica-Bold')
               .text('✓ PAYMENT RECEIVED', statusX + 10, statusY + 8);

            // Branching Logic for Content
            if (invoiceData.bookingDate) {
                renderGuideDetails(doc, invoiceData, primaryColor, textColor, lightGray, accentColor);
            } else {
                renderPackageDetails(doc, invoiceData, primaryColor, textColor, lightGray, accentColor);
            }

            // Footer
            const yPosition = 720;

            doc.fontSize(9)
               .fillColor('#6C757D')
               .font('Helvetica')
               .text('Thank you for choosing ' + companyName + '!', 50, yPosition, { align: 'center', width: 495 })
               .text('For any queries, please contact us at ' + companyEmail + ' or ' + companyPhone, 50, yPosition + 15, { align: 'center', width: 495 });

            // Terms and conditions
            doc.fontSize(8)
               .fillColor('#ADB5BD')
               .text('This is a computer-generated invoice and does not require a signature.', 50, yPosition + 40, { align: 'center', width: 495 })
               .text('All amounts are in Indian Rupees (INR). Payment terms: Immediate.', 50, yPosition + 52, { align: 'center', width: 495 });

            // Finalize PDF
            doc.end();

            stream.on('finish', () => {
                resolve(outputPath);
            });

            stream.on('error', (error) => {
                reject(error);
            });

        } catch (error) {
            reject(error);
        }
    });
}

// --- Helper Functions for Content Separation ---

function renderPackageDetails(doc, invoiceData, primaryColor, textColor, lightGray, accentColor) {
    let yPosition = 290;
    
    doc.fontSize(12)
       .fillColor(primaryColor)
       .font('Helvetica-Bold')
       .text('PACKAGE DETAILS:', 50, yPosition);

    yPosition += 25;

    // Package info box
    doc.roundedRect(50, yPosition, 495, 100, 5)
       .fillAndStroke(lightGray, '#E9ECEF');

    yPosition += 15;

    doc.fontSize(14)
       .fillColor(primaryColor)
       .font('Helvetica-Bold')
       .text(invoiceData.packageName, 65, yPosition);

    yPosition += 20;

    if (invoiceData.packageDescription) {
        doc.fontSize(10)
           .fillColor(textColor)
           .font('Helvetica')
           .text(invoiceData.packageDescription, 65, yPosition, { width: 465 });
        yPosition += 25;
    }

    doc.fontSize(10)
       .fillColor(textColor)
       .font('Helvetica')
       .text(`Check-in: ${new Date(invoiceData.checkInDate).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}`, 65, yPosition)
       .text(`Check-out: ${new Date(invoiceData.checkOutDate).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}`, 65, yPosition + 15)
       .text(`Number of Guests: ${invoiceData.numberOfGuests}`, 65, yPosition + 30);

    // Pricing table
    yPosition = 440;

    doc.fontSize(12)
       .fillColor(primaryColor)
       .font('Helvetica-Bold')
       .text('PRICING BREAKDOWN:', 50, yPosition);

    yPosition += 25;

    // Table header
    doc.roundedRect(50, yPosition, 495, 30, 5)
       .fillAndStroke(primaryColor, primaryColor);

    doc.fontSize(11)
       .fillColor('#FFFFFF')
       .font('Helvetica-Bold')
       .text('Description', 65, yPosition + 8)
       .text('Amount (INR)', 450, yPosition + 8);

    yPosition += 30;

    // Base amount row
    doc.fontSize(10)
       .fillColor(textColor)
       .font('Helvetica')
       .text('Package Base Amount', 65, yPosition + 10)
       .text(`₹${invoiceData.baseAmount.toLocaleString('en-IN')}`, 450, yPosition + 10);

    yPosition += 30;

    // GST row
    doc.text(`GST (${invoiceData.gstRate}%)`, 65, yPosition + 10)
       .text(`₹${invoiceData.gstAmount.toLocaleString('en-IN')}`, 450, yPosition + 10);

    yPosition += 30;

    // Separator line
    doc.strokeColor('#E9ECEF')
       .lineWidth(1)
       .moveTo(50, yPosition + 5)
       .lineTo(545, yPosition + 5)
       .stroke();

    yPosition += 15;

    // Total amount
    doc.roundedRect(50, yPosition, 495, 40, 5)
       .fillAndStroke(accentColor, accentColor);

    doc.fontSize(14)
       .fillColor('#FFFFFF')
       .font('Helvetica-Bold')
       .text('TOTAL AMOUNT', 65, yPosition + 12)
       .text(`₹${invoiceData.totalAmount.toLocaleString('en-IN')}`, 450, yPosition + 12);
}

function renderGuideDetails(doc, invoiceData, primaryColor, textColor, lightGray, accentColor) {
    let yPosition = 290;
    
    doc.fontSize(12)
       .fillColor(primaryColor)
       .font('Helvetica-Bold')
       .text('TREKKING DETAILS:', 50, yPosition);

    yPosition += 25;

    // Guide info box
    doc.roundedRect(50, yPosition, 495, 120, 5) // Slightly larger
       .fillAndStroke('#FBF8F1', '#D4C597');

    yPosition += 15;

    doc.fontSize(14)
       .fillColor(primaryColor)
       .font('Helvetica-Bold')
       .text('Trekking Guide Service', 65, yPosition);

    yPosition += 25;

    doc.fontSize(10)
       .fillColor(textColor)
       .font('Helvetica')
       .text(`Experience: ${invoiceData.packageName}`, 65, yPosition)
       .text(`Trek Date: ${new Date(invoiceData.bookingDate).toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}`, 65, yPosition + 15)
       .text(`Time Slot: ${invoiceData.bookingSlot}`, 65, yPosition + 30)
       .text(`Group Size: ${invoiceData.bookingPeople}`, 65, yPosition + 45);

    if (invoiceData.guidePhone) {
        doc.text(`Guide Contact: ${invoiceData.guidePhone}`, 65, yPosition + 60);
    }

    // Pricing table
    yPosition = 440;

    doc.fontSize(12)
       .fillColor(primaryColor)
       .font('Helvetica-Bold')
       .text('PRICING BREAKDOWN:', 50, yPosition);

    yPosition += 25;

    // Table header
    doc.roundedRect(50, yPosition, 495, 30, 5)
       .fillAndStroke('#4A5D23', '#4A5D23'); // Darker green for treks

    doc.fontSize(11)
       .fillColor('#FFFFFF')
       .font('Helvetica-Bold')
       .text('Description', 65, yPosition + 8)
       .text('Amount (INR)', 450, yPosition + 8);

    yPosition += 30;

    // Base amount row
    doc.fontSize(10)
       .fillColor(textColor)
       .font('Helvetica')
       .text('Base Amount', 65, yPosition + 10)
       .text(`₹${invoiceData.baseAmount.toLocaleString('en-IN')}`, 450, yPosition + 10);

    yPosition += 30;

    // GST row
    doc.text(`GST (${invoiceData.gstRate}%)`, 65, yPosition + 10)
       .text(`₹${invoiceData.gstAmount.toLocaleString('en-IN')}`, 450, yPosition + 10);

    yPosition += 30;

    // Separator line
    doc.strokeColor('#E9ECEF')
       .lineWidth(1)
       .moveTo(50, yPosition + 5)
       .lineTo(545, yPosition + 5)
       .stroke();

    yPosition += 15;

    // Total amount
    doc.roundedRect(50, yPosition, 495, 40, 5)
       .fillAndStroke('#8FA35F', '#8FA35F'); // Trek specific green

    doc.fontSize(14)
       .fillColor('#FFFFFF')
       .font('Helvetica-Bold')
       .text('TOTAL AMOUNT PAID', 65, yPosition + 12)
       .text(`₹${invoiceData.totalAmount.toLocaleString('en-IN')}`, 450, yPosition + 12);
}

module.exports = { generateInvoicePDF };
