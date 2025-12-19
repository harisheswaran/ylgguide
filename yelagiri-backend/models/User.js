const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String
    },
    password: {
        type: String,
        // required: true // Not required if using Google Auth
    },
    mobile: {
        type: String
    },
    bloodGroup: {
        type: String
    },
    emergencyContact: {
        type: String
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    mobileVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    mobileOtp: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
