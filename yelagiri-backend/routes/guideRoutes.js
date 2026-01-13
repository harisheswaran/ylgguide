const express = require('express');
const router = express.Router();
const {
    getGuides,
    getGuide,
    createGuide,
    updateGuide,
    deleteGuide
} = require('../controllers/guideController');

router.route('/')
    .get(getGuides)
    .post(createGuide);

router.route('/:id')
    .get(getGuide)
    .put(updateGuide)
    .delete(deleteGuide);

module.exports = router;
