const mongoose = require('mongoose');

const shopOrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Linking to existing User model
        required: false
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ShopProduct',
            required: true
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        image: { type: String }
    }],
    shippingAddress: {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        phone: { type: String, required: true },
        location: { // For delivery tracking/routing
            lat: Number,
            lng: Number
        }
    },
    paymentMethod: {
        type: String,
        required: true,
        default: 'Cash on Delivery' // Keeping it simple for now
    },
    paymentResult: { // If we add real payment gateway later
        id: String,
        status: String,
        update_time: String,
        email_address: String
    },
    itemsPrice: { type: Number, required: true, default: 0.0 },
    taxPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
    status: {
        type: String,
        enum: ['Placed', 'Processing', 'Out for Delivery', 'Delivered', 'Cancelled'],
        default: 'Placed'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ShopOrder', shopOrderSchema);
