const Review = require('../models/Review');
const Listing = require('../models/Listing');

// @desc    Get all reviews for a listing
// @route   GET /api/reviews/:listingId
// @access  Public
const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ listing: req.params.listingId }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a review
// @route   POST /api/reviews
// @access  Public (should be protected in production)
const addReview = async (req, res) => {
    try {
        const { listingId, user, rating, comment } = req.body;
        
        const listing = await Listing.findById(listingId);
        if (!listing) {
            // Check if it's one of our "hardcoded" package IDs for mock mode
            if (process.env.MOCK_DB_MODE !== 'true') {
                return res.status(404).json({ message: 'Listing not found' });
            }
        }

        const review = new Review({
            listing: listingId,
            user,
            rating,
            comment
        });

        const newReview = await review.save();
        res.status(201).json(newReview);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getReviews,
    addReview
};
