const express = require('express');
const router = express.Router();
const {
    getCategories,
    getProducts,
    getProductById,
    createOrder,
    getOrderById,
    getOrdersByIds
} = require('../controllers/shopController');

// We might want to import auth middleware if needed
// const { protect } = require('../middleware/authMiddleware');

router.get('/categories', getCategories);
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.post('/orders/my-orders', getOrdersByIds); // Must be before :id route
router.post('/orders', createOrder);
router.get('/orders/:id', getOrderById);

module.exports = router;
