const ShopProduct = require('../models/ShopProduct');
const ShopCategory = require('../models/ShopCategory');
const ShopOrder = require('../models/ShopOrder');

// @desc    Get all shop categories
// @route   GET /api/shop/categories
// @access  Public
const getCategories = async (req, res) => {
    try {
        const categories = await ShopCategory.find({ isActive: true });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all products (with optional filtering)
// @route   GET /api/shop/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const { category, keyword } = req.query;
        let query = { isAvailable: true };

        if (category) {
            // Find category ID by slug first
            const cat = await ShopCategory.findOne({ slug: category });
            if (cat) {
                query.category = cat._id;
            }
        }

        if (keyword) {
            query.name = { $regex: keyword, $options: 'i' };
        }

        const products = await ShopProduct.find(query).populate('category', 'name slug');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single product by ID
// @route   GET /api/shop/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await ShopProduct.findById(req.params.id).populate('category');
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new order
// @route   POST /api/shop/orders
// @access  Private (but we might allow guest checkout for now if User ID is optional, keeping it simple as per requirements)
const createOrder = async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        } = req.body;

        if (orderItems && orderItems.length === 0) {
            res.status(400);
            throw new Error('No order items');
            return;
        }

        // Ideally we get user from req.user (middleware)
        // For this independent module testing, we assume req.body.user or req.user exists
        // If not authenticated, we might need a dummy user or handle guest

        // checking if req.user is populated by auth middleware
        // If independent, we should probably ensure auth middleware is used on this route

        const order = new ShopOrder({
            user: req.user ? req.user._id : req.body.user, // Fallback for testing if auth not strictly enforced yet
            items: orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/shop/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await ShopOrder.findById(req.params.id).populate('user', 'name email');
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCategories,
    getProducts,
    getProductById,
    createOrder,
    getOrderById
};
