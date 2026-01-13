const PackageBooking = require('../models/PackageBooking');
const GuideBooking = require('../models/GuideBooking');
const User = require('../models/User');
const { createInvoice } = require('../services/invoiceService');
const { sendBookingConfirmationEmail } = require('../services/emailService');
const { createMockPaymentOrder, isMockMode } = require('../services/mockPaymentService');

// Temporary mock mode for database operations
const MOCK_DB_MODE = process.env.MOCK_DB_MODE === 'true';
global.mockBookings = global.mockBookings || {};

const createBooking = async (req, res) => {
    try {
        console.log('📩 createBooking Request Received:', req.body);
        
        // STRICT BRANCHING: Check if it's a guide booking (presence of bookingDate)
        if (req.body.bookingDate) {
            return await handleGuideBooking(req, res);
        } else {
            return await handlePackageBooking(req, res);
        }

    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// --- Helper Handler: PACKAGE BOOKING ---
const handlePackageBooking = async (req, res) => {
    const { 
        guestName, guestEmail, guestPhone, 
        packageName, packageDescription,
        checkIn, checkOut, guests, rooms = 1, 
        accommodationType, specialRequests,
        baseAmount
    } = req.body;

    // Calculate tax (18% GST)
    const taxAmount = (baseAmount * 18) / 100;
    const totalAmount = baseAmount + taxAmount;

    let booking;

    if (MOCK_DB_MODE) {
        booking = {
            _id: `mock_pkg_${Date.now()}`,
            guestName, guestEmail, guestPhone,
            packageName, packageDescription,
            checkIn, checkOut, guests, rooms,
            accommodationType, specialRequests,
            baseAmount, taxAmount, totalAmount,
            bookingStatus: 'pending',
            paymentStatus: 'unpaid',
            bookingDate: null, bookingSlot: null, guideEmail: null
        };
        global.mockBookings[booking._id] = booking;
        console.log('🎭 MOCK PACKAGE BOOKING created and saved to memory');
    } else {
        booking = new PackageBooking({
            guestName, guestEmail, guestPhone,
            packageName, packageDescription,
            checkIn, checkOut, guests, rooms,
            accommodationType, specialRequests,
            baseAmount, taxAmount, totalAmount,
            bookingStatus: 'pending',
            paymentStatus: 'unpaid'
        });
    }

    await processPaymentForBooking(booking, res);
};

// --- Helper Handler: GUIDE BOOKING ---
const handleGuideBooking = async (req, res) => {
    const { 
        guestName, guestEmail, guestPhone, 
        packageName, packageDescription,
        bookingDate, bookingSlot, bookingPeople,
        guideEmail, guidePhone,
        baseAmount
    } = req.body;

    // Calculate tax (18% GST)
    const taxAmount = (baseAmount * 18) / 100;
    const totalAmount = baseAmount + taxAmount;

    let booking;

    if (MOCK_DB_MODE) {
        booking = {
            _id: `mock_guide_${Date.now()}`,
            guestName, guestEmail, guestPhone,
            packageName, packageDescription,
            bookingDate, bookingSlot, bookingPeople,
            guideEmail, guidePhone,
            baseAmount, taxAmount, totalAmount,
            bookingStatus: 'pending',
            paymentStatus: 'unpaid',
            checkIn: null, checkOut: null, rooms: null
        };
        global.mockBookings[booking._id] = booking;
        console.log('🎭 MOCK GUIDE BOOKING created and saved to memory');
    } else {
        booking = new GuideBooking({
            guestName, guestEmail, guestPhone,
            packageName, packageDescription,
            bookingDate, bookingSlot, bookingPeople,
            guideEmail, guidePhone,
            baseAmount, taxAmount, totalAmount,
            bookingStatus: 'pending',
            paymentStatus: 'unpaid'
        });
    }

    await processPaymentForBooking(booking, res);
};

// --- Helper: Shared Payment Processing ---
const processPaymentForBooking = async (booking, res) => {
    // Handle Payment Initialization
    if (isMockMode() || MOCK_DB_MODE) {
        console.log('🎭 MOCK MODE: Initiating mock payment order');
        const mockOrder = await createMockPaymentOrder({
            amount: booking.totalAmount,
            receipt: `receipt_${Date.now()}` 
        });

        booking.gatewayOrderId = mockOrder.id;
        booking.provider = 'Mock';
        
        if (!MOCK_DB_MODE && typeof booking.save === 'function') {
            await booking.save();
        }

        return res.status(201).json({
            success: true,
            message: 'Booking created (Mock Mode)',
            data: {
                bookingId: booking._id,
                orderId: mockOrder.id,
                amount: booking.totalAmount,
                isMockMode: true,
                isRedirect: false
            }
        });
    }

    // Fallback for missing Real Payment Key
    console.warn('⚠️ Real payment requested but not implemented. Falling back to Mock.');
    const fallbackOrder = await createMockPaymentOrder({
            amount: booking.totalAmount,
            receipt: `receipt_${Date.now()}`
    });

    booking.gatewayOrderId = fallbackOrder.id;
    booking.provider = 'Mock';
    
    if (!MOCK_DB_MODE && typeof booking.save === 'function') {
        await booking.save();
    }

    res.status(201).json({
        success: true,
        message: 'Booking created (Fallback to Mock)',
        data: {
            bookingId: booking._id,
            orderId: fallbackOrder.id,
            amount: booking.totalAmount,
            isMockMode: true,
            isRedirect: false
        }
    });
};

// Helper: Find booking in either collection
const findBookingById = async (id) => {
    // Try Package first
    let booking = await PackageBooking.findById(id).populate('listing');
    if (booking) return booking;

    // Try Guide
    booking = await GuideBooking.findById(id);
    return booking;
};

// @desc    Verify payment and confirm booking
// @route   POST /api/bookings/verify-payment
const verifyPayment = async (req, res) => {
    try {
        const { order_id, bookingId } = req.body;

        let booking;
        
        if (MOCK_DB_MODE) {
            // Check memory store first
            if (global.mockBookings && global.mockBookings[bookingId]) {
                booking = global.mockBookings[bookingId];
                console.log('🧠 Retrieved mock booking from memory store');
            } else {
                // Mock booking for testing (Fallback)
                const isPkg = bookingId.toLowerCase().includes('pkg');
                const isGuide = bookingId.toLowerCase().includes('guide');
                
                booking = {
                    _id: bookingId,
                    bookingId: `BK${Date.now()}`,
                    guestName: 'Deepak Kumar',
                    guestEmail: 'deepak@test.com',
                    guestPhone: '+91 99887 76655',
                    packageName: isGuide ? 'Professional Trek with Arjun Swamy' : 'Elite Yelagiri Escape Package',
                    packageDescription: isGuide ? 'Expert-led mountain exploration through Yelagiri hills' : 'A luxury stay in the heart of Yelagiri with all amenities included.',
                    guests: 2,
                    rooms: isGuide ? null : 1,
                    accommodationType: isGuide ? null : 'cottage',
                    baseAmount: 12000,
                    taxAmount: 2160,
                    totalAmount: 14160,
                    paymentStatus: 'unpaid',
                    bookingStatus: 'pending',
                    // Fields for both types but set to null accordingly
                    bookingDate: isGuide ? new Date(Date.now() + 86400000).toISOString().split('T')[0] : null,
                    bookingSlot: isGuide ? '09:00 AM' : null,
                    bookingPeople: isGuide ? '2-4 People' : null,
                    checkIn: isGuide ? null : new Date(),
                    checkOut: isGuide ? null : new Date(Date.now() + 86400000 * 3)
                };
            }
            console.log('🎭 MOCK DB MODE: Mock booking verification');
        } else {
            booking = await findBookingById(bookingId);
            if (!booking) {
                return res.status(404).json({ success: false, message: 'Booking not found' });
            }
        }

        // Update status
        booking.paymentStatus = 'paid';
        booking.bookingStatus = 'confirmed';
        booking.paymentCompletedAt = Date.now();
        booking.confirmedAt = Date.now();
        
        // Skip database save in mock DB mode
        if (!MOCK_DB_MODE) {
            await booking.save();
        }

        // Generate Real Invoice
        let invoice;
        try {
            invoice = await createInvoice(booking);
        } catch (invoiceError) {
            console.error("Failed to generate invoice during verification:", invoiceError);
        }

        // Send Email (Added for Mock/Manual Flow)
        if (invoice) {
             try {
                console.log(`📧 Sending confirmation email for ${booking.bookingId || booking._id}...`);
                await sendBookingConfirmationEmail(booking, invoice);
                console.log(`   ✅ Email sent successfully.`);
            } catch (emailErr) {
                console.error('   ❌ Email notification failed:', emailErr);
            }
        }

        res.json({
            success: true,
            message: 'Payment verified',
            data: {
                bookingId: booking._id,
                invoiceId: invoice ? invoice.invoiceNumber : 'PENDING'
            }
        });

    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get bookings for a user by email (Standard & Guide separated)
// @route   GET /api/bookings/my-bookings
const getMyBookings = async (req, res) => {
    try {
        const email = req.headers['user-email'];
        if (!email) {
            return res.status(400).json({ success: false, message: 'User email is required' });
        }

        // Fetch all bookings for this email from BOTH collections
        const packages = await PackageBooking.find({ guestEmail: email }).sort({ createdAt: -1 });
        const guides = await GuideBooking.find({ guestEmail: email }).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: {
                packages,
                guides
            }
        });
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
    }
};

// @desc    Get bookings for a user (Legacy by ID)
// @route   GET /api/bookings/user/:userId
const getUserBookings = async (req, res) => {
    try {
        const pkgBookings = await PackageBooking.find({ user: req.params.userId }).sort({ createdAt: -1 });
        const gdeBookings = await GuideBooking.find({ user: req.params.userId }).sort({ createdAt: -1 });
        
        res.json({ success: true, data: [...pkgBookings, ...gdeBookings] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get booking by ID for Confirmation
// @route   GET /api/bookings/confirmation/:id
const getBookingForConfirmation = async (req, res) => {
    try {
        if (MOCK_DB_MODE) {
            // Check memory store
            if (global.mockBookings && global.mockBookings[req.params.id]) {
                const booking = global.mockBookings[req.params.id];
                console.log('🧠 Returning stored mock booking for confirmation');
                return res.json({ success: true, data: booking });
            }

            // Return smarter mock booking data for testing (Fallback)
            const isPkg = req.params.id.toLowerCase().includes('pkg');
            const isGuide = req.params.id.toLowerCase().includes('guide') && !isPkg;
            
            const mockBooking = {
                _id: req.params.id,
                bookingId: `BK${Date.now()}`,
                guestName: 'Deepak Kumar',
                guestEmail: 'deepak@test.com',
                guestPhone: '+91 99887 76655',
                packageName: isGuide ? 'Professional Trek with Arjun Swamy' : 'Elite Yelagiri Escape Package',
                packageDescription: isGuide ? 'Expert-led mountain exploration through Yelagiri hills' : 'A luxury stay in the heart of Yelagiri with all amenities included.',
                guests: 2,
                rooms: isGuide ? null : 1,
                accommodationType: isGuide ? null : 'cottage',
                specialRequests: 'Please arrange early check-in if possible',
                checkIn: new Date(Date.now() + 86400000),
                checkOut: new Date(Date.now() + 86400000 * 4),
                bookingDate: isGuide ? new Date(Date.now() + 86400000).toISOString().split('T')[0] : null,
                bookingSlot: isGuide ? '09:00 AM' : null,
                bookingPeople: isGuide ? '2-4 People' : null,
                guideEmail: isGuide ? 'arjun.swamy@yelaguide.com' : null,
                guidePhone: isGuide ? '+91 94432 12345' : null,
                baseAmount: 12000,
                taxAmount: 2160,
                totalAmount: 14160,
                paymentStatus: 'paid',
                bookingStatus: 'confirmed',
                createdAt: new Date()
            };
            console.log('🎭 MOCK DB MODE: Returning dynamic mock booking for confirmation');
            return res.json({ success: true, data: mockBooking });
        }
        
        const booking = await findBookingById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        res.json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Preview booking confirmation email
// @route   GET /api/bookings/:id/email-preview
const getEmailPreview = async (req, res) => {
    try {
        const { getBookingConfirmationEmail } = require('../utils/emailTemplates');
        
        let booking;
        
        if (MOCK_DB_MODE) {
            // Check memory store
            if (global.mockBookings && global.mockBookings[req.params.id]) {
                booking = global.mockBookings[req.params.id];
                console.log('🧠 Previewing stored mock booking detail');
            } else {
                // Mock booking for testing (Fallback)
                const isPkg = req.params.id.toLowerCase().includes('pkg');
                const isGuide = req.params.id.toLowerCase().includes('guide') && !isPkg;
                
                booking = {
                    _id: req.params.id,
                    bookingId: `BK${Date.now()}`,
                    guestName: 'Deepak Kumar',
                    guestEmail: 'deepak@test.com',
                    guestPhone: '+91 99887 76655',
                    packageName: isGuide ? 'Professional Trek with Arjun Swamy' : 'Elite Yelagiri Escape Package',
                    packageDescription: isGuide ? 'Expert-led mountain exploration through Yelagiri hills' : 'A luxury stay in the heart of Yelagiri with all amenities included.',
                    guests: 2,
                    rooms: isGuide ? null : 1,
                    checkIn: new Date(Date.now() + 86400000),
                    checkOut: new Date(Date.now() + 86400000 * 4),
                    // Trekking fields
                    bookingDate: isGuide ? new Date(Date.now() + 86400000).toISOString().split('T')[0] : null,
                    bookingSlot: isGuide ? '09:00 AM' : null,
                    bookingPeople: isGuide ? '2-4 People' : null,
                    guideEmail: isGuide ? 'arjun.swamy@yelaguide.com' : null,
                    guidePhone: isGuide ? '+91 94432 12345' : null,
                    baseAmount: 12000,
                    taxAmount: 2160,
                    totalAmount: 14160,
                    paymentStatus: 'paid',
                    bookingStatus: 'confirmed',
                    createdAt: new Date()
                };
            }
        } else {
            booking = await findBookingById(req.params.id);
            if (!booking) {
                return res.status(404).json({ success: false, message: 'Booking not found' });
            }
        }

        const { createInvoice } = require('../services/invoiceService');
        const invoice = await createInvoice(booking);

        const emailData = {
            guestName: booking.guestName,
            bookingId: (booking.bookingId || booking._id).toString(),
            packageName: booking.packageName,
            checkInDate: booking.checkIn,
            checkOutDate: booking.checkOut,
            guests: booking.guests,
            totalAmount: booking.totalAmount,
            baseAmount: booking.baseAmount || (booking.totalAmount / 1.18),
            gstAmount: booking.taxAmount || (booking.totalAmount - (booking.totalAmount / 1.18)),
            invoiceNumber: invoice.invoiceNumber,
            rooms: booking.rooms,
            accommodationType: booking.accommodationType,
            // Pass all guide fields for the template
            bookingDate: booking.bookingDate,
            bookingSlot: booking.bookingSlot,
            bookingPeople: booking.bookingPeople,
            guideEmail: booking.guideEmail,
            guidePhone: booking.guidePhone,
            invoiceUrl: `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000'}/api/invoices/${invoice.invoiceNumber}/download`
        };

        let htmlContent = getBookingConfirmationEmail(emailData);
        
        // Check for attachment to show in preview
        const hasAttachment = invoice.pdfPath && require('fs').existsSync(invoice.pdfPath);

        // Add a simulated attachment bar for the preview to show the user it's working
        const attachmentBar = `
            <div style="background: #f8f9fa; border-bottom: 2px solid #dee2e6; padding: 12px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; display: flex; flex-wrap: wrap; align-items: center; gap: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-weight: bold; color: #495057; font-size: 13px;">FROM:</span>
                    <span style="color: #6c757d; font-size: 13px;">Go Yelagiri &lt;no-reply@goyelagiri.com&gt;</span>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; margin-left: auto;">
                    <span style="font-weight: bold; color: #495057; font-size: 13px;">📎 ATTACHMENTS (${hasAttachment ? '1' : '0'}):</span>
                    ${hasAttachment ? `
                        <div style="background: white; border: 1px solid #ced4da; border-radius: 4px; padding: 4px 10px; font-size: 12px; color: #1a4d2e; display: flex; align-items: center; gap: 6px; font-weight: 500;">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                            Invoice-${invoice.invoiceNumber}.pdf
                        </div>
                    ` : `
                        <span style="color: #dc3545; font-size: 12px; font-weight: 500;">No attachment found</span>
                    `}
                </div>
            </div>
        `;
        
        htmlContent = attachmentBar + htmlContent;
        
        // Return HTML directly for preview
        res.setHeader('Content-Type', 'text/html');
        res.send(htmlContent);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const syncMockBooking = async (req, res) => {
    try {
        const booking = req.body;
        if (!booking || (!booking._id && !booking.bookingId)) {
            return res.status(400).json({ success: false, message: 'Invalid booking data' });
        }
        
        const id = booking.bookingId || booking._id; // Prefer bookingId if available for key
        
        // Ensure global store exists
        global.mockBookings = global.mockBookings || {};
        
        // Save to memory
        global.mockBookings[id] = booking;
        // Also save by _id if different
        if (booking._id && booking._id !== id) {
            global.mockBookings[booking._id] = booking;
        }

        console.log(`🧠 Synced mock booking ${id} from frontend to memory.`);
        res.json({ success: true });
    } catch (error) {
        console.error('Sync failed:', error);
        res.status(500).json({ success: false });
    }
};

module.exports = {
    createBooking,
    verifyPayment,
    getUserBookings,
    getMyBookings,
    getBookingForConfirmation,
    getEmailPreview,
    syncMockBooking
};
