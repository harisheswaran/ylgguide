const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String
    },
    certifications: [{
        type: String
    }],
    languages: [{
        type: String
    }],
    expertise: [{
        type: String
    }],
    experience: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewsCount: {
        type: Number,
        default: 0
    },
    pricePerHour: {
        type: Number,
        required: true
    },
    pricePerDay: {
        type: Number
    },
    pricePerGroup: {
        type: Number
    },
    availability: [{
        date: Date,
        slots: [String]
    }],
    unavailableDates: [{
        type: Date
    }],
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [78.6366, 12.5807] // Yelagiri coordinates
        }
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    badges: [{
        type: String
    }],
    gallery: [{
        type: String
    }],
    contactNumber: {
        type: String
    },
    email: {
        type: String
    }
}, {
    timestamps: true
});

guideSchema.index({ location: '2dsphere' });
guideSchema.index({ name: 'text', bio: 'text' });

module.exports = mongoose.model('Guide', guideSchema);
