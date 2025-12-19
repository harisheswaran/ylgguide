const express = require('express');
const router = express.Router();
const {
    getListings,
    getListingById,
    createListing,
    updateListing,
    deleteListing
} = require('../controllers/listingController');

router.route('/')
    .get(getListings)
    .post(createListing);

router.route('/:id')
    .get(getListingById)
    .put(updateListing)
    .delete(deleteListing);

module.exports = router;
