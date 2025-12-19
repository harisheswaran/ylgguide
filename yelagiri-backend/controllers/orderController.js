const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Listing = require('../models/Listing');
const User = require('../models/User');
const whatsappService = require('../services/whatsappService');

// @desc    Create a new order
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
    try {
        const { listingId, items, total, userEmail, tableNumber, specialInstructions } = req.body;

        // Find user
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found. Please sign in.' });
        }

        const order = await Order.create({
            user: user._id, // Use ObjectId
            listing: listingId,
            items,
            total,
            status: 'pending',
            tableNumber,
            specialInstructions
        });

        // Send WhatsApp Notification
        try {
            if (user.mobile) {
                await whatsappService.sendOrderConfirmation(user, order);
            }
        } catch (err) {
            console.error('Failed to send WhatsApp notification:', err);
        }

        res.status(201).json(order);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get menu items for a restaurant
// @route   GET /api/orders/menu/:listingId
// @access  Public
const getMenu = async (req, res) => {
    try {
        const menuItems = await MenuItem.find({ listing: req.params.listingId });
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add menu item (for seeding/admin)
// @route   POST /api/orders/menu
// @access  Public
const addMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.create(req.body);
        res.status(201).json(menuItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    getMenu,
    addMenuItem
};
