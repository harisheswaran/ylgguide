const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
    title: { type: String, required: true },
    type: { type: String, required: true },
    duration: { type: String, required: true },
    price: { type: String, required: true },
    rating: { type: Number, default: 0 },
    stars: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    image: { type: String },
    locationName: { type: String, default: 'Yelagiri' },
    iconType: { type: String }, // 'User', 'Trophy', 'ShieldCheck', 'Users', 'Heart', 'Sparkles'
    includes: [{ type: String }],
    amenities: [{ type: String }],
    longDescription: { type: String },
    exclusions: [{ type: String }],
    offers: [{ type: String }],
    reviews: [{
        user: String,
        rating: Number,
        comment: String,
        date: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('Package', packageSchema);
