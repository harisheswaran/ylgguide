const express = require('express');
const router = express.Router();
const { createOrder, getMenu, addMenuItem } = require('../controllers/orderController');

const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.get('/menu/:listingId', getMenu);
router.post('/menu', addMenuItem);

module.exports = router;
