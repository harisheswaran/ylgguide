const express = require('express');
const router = express.Router();
const {
    getCategories,
    getProducts,
    getProductById,
    createOrder,
    getOrderById
} = require('../controllers/shopController');

// We might want to import auth middleware if needed
// const { protect } = require('../middleware/authMiddleware');

router.get('/categories', getCategories);
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.post('/orders', createOrder); // Add protect middleware later if strictly needed
router.get('/orders/:id', getOrderById);

module.exports = router;
