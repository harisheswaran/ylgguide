const express = require('express');
const router = express.Router();
const {
    getCategories,
    getCategoryBySlug,
    createCategory
} = require('../controllers/categoryController');

router.route('/')
    .get(getCategories)
    .post(createCategory);

router.route('/:slug')
    .get(getCategoryBySlug);

module.exports = router;
