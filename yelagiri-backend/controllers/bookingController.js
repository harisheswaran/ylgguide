const Booking = require('../models/Booking');
const User = require('../models/User');
const { createInvoice } = require('../services/invoiceService');
const { sendBookingConfirmationEmail } = require('../services/emailService');
const { createMockPaymentOrder, isMockMode } = require('../services/mockPaymentService');

/**
 * @desc    Create a new booking and initiate payment
 * @route   POST /api/bookings
 */
const createBooking = async (req, res) => {
    try {
        const { 
            guestName, guestEmail, guestPhone, 
            packageName, packageDescription,
            checkIn, checkOut, guests, rooms = 1, 
            baseAmount 
        } = req.body;

        // Calculate tax (18% GST)
        const taxAmount = (baseAmount * 18) / 100;
        const totalAmount = baseAmount + taxAmount;

        // Create initial booking record
        const booking = new Booking({
            guestName,
            guestEmail,
            guestPhone,
            packageName,
            packageDescription,
            checkIn,
            checkOut,
            guests,
            rooms,
            baseAmount,
            taxAmount,
            totalAmount,
            bookingStatus: 'pending',
            paymentStatus: 'unpaid'
        });

        // Handle Payment Initialization
        if (isMockMode()) {
            console.log('🎭 MOCK MODE: Initiating mock payment order');
            const mockOrder = await createMockPaymentOrder({
                amount: totalAmount,
                receipt: `receipt_${Date.now()}`
            });

            booking.gatewayOrderId = mockOrder.id;
            booking.provider = 'Mock';
            await booking.save();

            return res.status(201).json({
                success: true,
                message: 'Booking created (Mock Mode)',
                data: {
                    bookingId: booking._id,
                    orderId: mockOrder.id,
                    amount: totalAmount,
                    isMockMode: true,
                    isRedirect: false
                }
            });
        }

        // TODO: Real Payment Integration (Cashfree/Razorpay)
        // For now, if mock mode is off and real key is missing, we fallback to mock
        // but logger warning.
        console.warn('⚠️ Real payment requested but not implemented. Falling back to Mock.');
        const fallbackOrder = await createMockPaymentOrder({
             amount: totalAmount,
             receipt: `receipt_${Date.now()}`
        });

        booking.gatewayOrderId = fallbackOrder.id;
        booking.provider = 'Mock';
        await booking.save();

        res.status(201).json({
            success: true,
            message: 'Booking created (Fallback to Mock)',
            data: {
                bookingId: booking._id,
                orderId: fallbackOrder.id,
                amount: totalAmount,
                isMockMode: true,
                isRedirect: false
            }
        });

    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Verify payment and confirm booking
// @route   POST /api/bookings/verify-payment
const verifyPayment = async (req, res) => {
    try {
        const { order_id, bookingId } = req.body;

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Update status
        booking.paymentStatus = 'paid';
        booking.bookingStatus = 'confirmed';
        booking.paymentCompletedAt = Date.now();
        booking.confirmedAt = Date.now();
        await booking.save();

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
                console.log(`📧 Sending confirmation email for ${booking.bookingId}...`);
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

// @desc    Get bookings for a user
// @route   GET /api/bookings/user/:userId
const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.params.userId }).sort({ createdAt: -1 });
        res.json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get booking by ID for Confirmation
// @route   GET /api/bookings/confirmation/:id
const getBookingForConfirmation = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('listing');
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        res.json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createBooking,
    verifyPayment,
    getUserBookings,
    getBookingForConfirmation
};
