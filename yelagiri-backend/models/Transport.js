const mongoose = require('mongoose');

const transportSchema = mongoose.Schema({
    category: {
        type: String,
        required: true,
        enum: [
            'Rental Cars', 'Rental Bikes', 'Vans', 
            'Private Buses', 'Public City Buses', 'Intercity Buses', 
            'Airport Shuttles', 'Taxi Services', 'Jeep Safari', 'Private Drivers', 'Taxi'
        ]
    },
    // A. Basic Service Info
    name: { type: String, required: true },
    vehicleType: { type: String }, // Service Type e.g. Taxi / Rental
    vehicleModel: { type: String }, // e.g. "Toyota Innova Crysta"
    capacity: { type: Number },
    luggageCapacity: { type: String }, // e.g. "3 Large Bags"
    image: { type: String },

    // B. Contact Details
    contactDetails: {
        phone: { type: String },
        whatsapp: { type: String },
        email: { type: String },
        website: { type: String },
        supportPhone: { type: String },
        pickupContactName: { type: String },
        pickupContactNumber: { type: String }
    },

    // Pricing & Availability
    pricingDetails: {
        rateType: { type: String, enum: ['Flat Rate', 'Per Km', 'Per Hour', 'Per Day', 'Per Trip', 'Local Drop', '8 Hours', 'Outstation Base', 'Day Shift', 'One Way', 'Per Ride'] },
        amount: { type: Number }, // Base rate
        unit: { type: String }, 
        minFare: { type: Number },
        perKmRate: { type: Number },
        perHourRate: { type: Number },
        driverAllowance: { type: Number },
        nightSurcharge: { type: Number },
        tollParkingExtra: { type: Boolean, default: true },
        description: { type: String }
    },
    availability: {
        status: { type: String, enum: ['Available', 'Busy', 'Offline'], default: 'Available' },
        workingDays: { type: [String], default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
        operatingHours: { type: String }
    },

    // Trip Coverage
    tripCoverage: {
        area: { type: String, enum: ['City', 'Outstation', 'Both'] },
        popularRoutes: [String],
        maxDistance: { type: String }
    },

    // Vehicle Features
    vehicleFeatures: {
        isAC: { type: Boolean, default: false },
        gps: { type: Boolean, default: false },
        musicSystem: { type: Boolean, default: false },
        chargingPorts: { type: Boolean, default: false },
        childSeat: { type: Boolean, default: false },
        carrier: { type: Boolean, default: false }
    },

    // Specific Details
    safariDetails: {
        coveredSpots: [String],
        duration: { type: String },
        packageInclusions: [String],
        bestTime: { type: String }
    },
    driverDetails: {
        isLicensed: { type: Boolean, default: true },
        experience: { type: String }, 
        languages: [String], 
        isVerified: { type: Boolean, default: false },
        attributes: [String] // e.g., "Non-smoker", "Pet friendly"
    },

    // Live Info
    liveUpdates: {
        currentLocation: { type: [Number], index: '2dsphere' },
        etaToPickup: { type: String },
        status: { type: String, enum: ['On Time', 'Delayed', 'Arrived', 'On Trip', 'Free'] },
        trafficStatus: { type: String },
        crowdLevel: { type: String },
        weatherCondition: { type: String }
    },

    // Route (For Buses/Fixed Trips)
    route: {
        from: { type: String },
        to: { type: String },
        stops: [String],
        distance: { type: String },
        duration: { type: String },
        path: { type: [[Number]], default: [] }
    },

    // Ratings & Safety
    ratings: {
        overall: { type: Number, default: 0 },
        safety: { type: Number, default: 0 },
        cleanliness: { type: Number, default: 0 },
        punctuality: { type: Number, default: 0 },
        totalTrips: { type: Number, default: 0 },
        userReviewCount: { type: Number, default: 0 }
    },
    safetyPolicies: {
        noContactRide: { type: Boolean, default: false },
        dailySanitized: { type: Boolean, default: true },
        maskRequired: { type: Boolean, default: false }
    },
    
    // Location & Map Integration
    locationDetails: {
        address: { type: String },
        city: { type: String, default: 'Yelagiri' },
        coordinates: { type: [Number], index: '2dsphere' }, // [lat, lng]
        googleMapsUrl: { type: String },
        landmarks: { type: String }
    },

    // Fleet / Inventory Details (For Agencies listing multiple vehicles)
    fleet: [{
        model: { type: String }, // e.g. "Toyota Innova Crysta"
        category: { type: String }, // e.g. "SUV", "Bike", "Van"
        fuelType: { type: String, enum: ['Petrol', 'Diesel', 'Electric'] },
        capacity: { type: Number }, // Seats
        count: { type: Number }, // How many available
        price: { type: Number },
        priceUnit: { type: String }, // e.g. "Per Day"
        features: [String], // ["AC", "Carrier"]
        image: { type: String }
    }],

    // Admin Fields
    adminData: {
        operatorId: { type: String },
        vehicleId: { type: String },
        commissionRate: { type: Number },
        isActive: { type: Boolean, default: true }
    },
    // Operator Info (Legacy/CSV)
    operator: {
        name: { type: String },
        contact: { type: String },
        verified: { type: Boolean, default: false },
        rating: { type: Number, default: 0 }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Transport', transportSchema);
