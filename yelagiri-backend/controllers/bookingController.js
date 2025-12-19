const Booking = require('../models/Booking');
const Listing = require('../models/Listing');
const User = require('../models/User');
const whatsappService = require('../services/whatsappService');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Public (for now)
const createBooking = async (req, res) => {
    try {
        const { userEmail, listingId, checkIn, checkOut, guests, rooms, totalAmount } = req.body;

        // Find user
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found. Please sign in.' });
        }

        const booking = await Booking.create({
            user: user._id,
            listing: listingId,
            checkIn,
            checkOut,
            guests,
            rooms,
            totalAmount: totalAmount || 0 // Handle total amount if not passed
        });

        // Send WhatsApp Notification
        try {
            const listing = await Listing.findById(listingId);
            if (user.mobile && listing) {
                await whatsappService.sendBookingConfirmation(user, {
                    hotelName: listing.name,
                    checkIn,
                    checkOut
                });
            }
        } catch (err) {
            console.error('Failed to send WhatsApp notification:', err);
        }

        res.status(201).json(booking);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get bookings for a user
// @route   GET /api/bookings/user/:userId
// @access  Public
const getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.params.userId }).populate('listing');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBooking,
    getUserBookings
};
