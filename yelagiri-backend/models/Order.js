const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    items: [{
        name: String, // Store item name directly for now
        menuItem: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'MenuItem'
            // required: true // Relaxed for now
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: { // Price at time of order
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'preparing', 'ready', 'delivered', 'cancelled'],
        default: 'pending'
    },
    deliveryAddress: {
        type: String
        // Optional if dining in, required if delivery
    },
    orderType: {
        type: String,
        enum: ['dine-in', 'delivery', 'takeaway'],
        default: 'dine-in'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
