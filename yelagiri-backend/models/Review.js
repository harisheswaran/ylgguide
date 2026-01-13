const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    user: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Update listing rating after saving a review
reviewSchema.post('save', async function() {
    const Listing = mongoose.model('Listing');
    const reviews = await this.constructor.find({ listing: this.listing });
    
    const count = reviews.length;
    const avgRating = reviews.reduce((acc, rev) => acc + rev.rating, 0) / count;
    
    await Listing.findByIdAndUpdate(this.listing, {
        rating: avgRating.toFixed(1),
        reviewsCount: count
    });
});

module.exports = mongoose.model('Review', reviewSchema);
