const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Transport = require('./models/Transport');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const transportData = [
    // 1. CAR RENTALS
    {
        category: 'Rental Cars',
        name: 'Savaari Car Rentals',
        vehicleType: 'Sedan (Etios/Dzire)',
        capacity: 4,
        vehicleFeatures: { isAC: true, gps: true },
        operator: { name: 'Savaari', contact: '09045450000', verified: true, rating: 4.6 },
        pricingDetails: { amount: 2400, unit: 'per day (8hr/80km)', rateType: 'Per Day', perKmRate: 14, driverAllowance: 300, description: 'Extra: ₹14/km, ₹250/hr' },
        availability: { status: 'Available', operatingHours: '24/7' },
        liveUpdates: { status: 'Free', trafficStatus: 'Clear' },
        ratings: { overall: 4.6, safety: 4.8, cleanliness: 4.7, punctuality: 4.6, userReviewCount: 1540 },
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
        locationDetails: { address: 'Athanavoor Main Rd, Yelagiri', coordinates: [12.5790, 78.6380], landmarks: 'Near Gandhi Park' },
        fleet: [
            { model: 'Toyota Etios', category: 'Sedan', fuelType: 'Diesel', capacity: 4, price: 2400, priceUnit: '/day', features: ['AC', 'GPS', 'Large Trunk'] },
            { model: 'Toyota Innova', category: 'SUV', fuelType: 'Diesel', capacity: 7, price: 3800, priceUnit: '/day', features: ['AC', 'GPS', 'Carrier'] }
        ]
    },
    {
        category: 'Rental Cars',
        name: 'VPL Travels',
        vehicleType: 'SUV (Innova Crysta)',
        capacity: 7,
        vehicleFeatures: { isAC: true, gps: true },
        operator: { name: 'VPL Travels', contact: '+91 94441 88448', verified: true, rating: 4.5 },
        pricingDetails: { amount: 3500, unit: 'per day', rateType: 'Per Day', description: 'Driver allowance extra' },
        availability: { status: 'Available', operatingHours: '6 AM - 10 PM' },
        liveUpdates: { status: 'Free' },
        ratings: { overall: 4.5, safety: 4.7, cleanliness: 4.8, punctuality: 4.5, userReviewCount: 320 },
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
        locationDetails: { coordinates: [12.5790, 78.6380] }
    },
    {
        category: 'Rental Cars',
        name: 'GetMeCab Local',
        vehicleType: 'SUV (Ertiga/Xylo)',
        capacity: 6,
        vehicleFeatures: { isAC: true },
        operator: { name: 'GetMeCab', verified: true, rating: 4.2 },
        pricingDetails: { amount: 3000, unit: 'per day (8hr)', rateType: 'Per Day', description: 'Extra: ₹17/km' },
        availability: { status: 'Available', operatingHours: '24/7' },
        ratings: { overall: 4.2, safety: 4.3, cleanliness: 4.2, punctuality: 4.0, userReviewCount: 850 },
        image: 'https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&w=800&q=80',
        locationDetails: { coordinates: [12.5790, 78.6380] }
    },
    {
        category: 'Rental Cars',
        name: "Green Ride Rentals",
        vehicleType: "SUV",
        pricingDetails: { amount: 2500, unit: "Per Day (Self Drive)", rateType: "Per Day" },
        operator: { name: "Vijay Transport", contact: "+91 9988776655", verified: true, rating: 4.7 },
        availability: { status: "Available", operatingHours: "9 AM - 9 PM" },
        liveUpdates: { status: "Free", trafficStatus: "Clear" },
        vehicleFeatures: { isAC: true, gps: true },
        image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",
        ratings: { overall: 4.7 },
        locationDetails: { coordinates: [12.5790, 78.6380] }
    },
    {
        category: 'Rental Cars',
        name: "Hill View Rentals",
        vehicleType: "Swift",
        pricingDetails: { amount: 1500, unit: "Per Day", rateType: "Per Day" },
        operator: { name: "Ramesh", contact: "+91 9008877665", verified: false, rating: 4.2 },
        availability: { status: "Available", operatingHours: "8 AM - 10 PM" },
        liveUpdates: { status: "Free", trafficStatus: "Clear" },
        vehicleFeatures: { isAC: true, gps: true },
        image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2",
        ratings: { overall: 4.2 },
        locationDetails: { coordinates: [12.5790, 78.6380] }
    },

    // 2. BIKE RENTALS
    {
        category: 'Rental Bikes',
        name: 'Green Valley Bikes',
        vehicleType: 'Scooter (Activa/Jupiter)',
        capacity: 2,
        vehicleFeatures: { isAC: false, gps: false },
        operator: { name: 'GV Rentals', contact: '+91 98765 43210', verified: true, rating: 4.6 },
        pricingDetails: { amount: 500, unit: 'per day', rateType: 'Per Day', description: 'Helmet included. Fuel extra.' },
        availability: { status: 'Available', operatingHours: '8 AM - 8 PM' },
        ratings: { overall: 4.6, safety: 4.2, cleanliness: 4.5, punctuality: 4.8, userReviewCount: 200 },
        image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
        locationDetails: { address: 'Near Boat House Entrance, Yelagiri', coordinates: [12.5830, 78.6420], landmarks: 'Opposite to Nature Park' }
    },
    {
        category: 'Rental Bikes',
        name: 'Hills Rider',
        vehicleType: 'Bike (Pulsar/Apache)',
        capacity: 2,
        operator: { name: 'Local Operator', verified: false, rating: 4.0 },
        pricingDetails: { amount: 800, unit: 'per day', rateType: 'Per Day', description: 'ID Proof Required' },
        availability: { status: 'Available', operatingHours: '9 AM - 7 PM' },
        ratings: { overall: 4.0, safety: 4.0, cleanliness: 3.8, punctuality: 4.0, userReviewCount: 45 },
        image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
        locationDetails: { coordinates: [12.5790, 78.6380] }
    },
    {
        category: 'Rental Bikes',
        name: 'Yelagiri Bike Point',
        vehicleType: 'Bullet 350',
        pricingDetails: { amount: 800, unit: "Per Day", rateType: "Per Day" },
        operator: { name: "Subash", contact: "+91 9122334455", verified: true, rating: 4.8 },
        availability: { status: "Available", operatingHours: "8 AM - 8 PM" },
        liveUpdates: { status: "Free" },
        vehicleFeatures: { isAC: false, gps: false },
        image: "https://images.unsplash.com/photo-1558981403-c5f9899308bb?auto=format&fit=crop&w=800&q=80",
        ratings: { overall: 4.8 },
        locationDetails: { coordinates: [12.5790, 78.6380] }
    },

    // 3. TAXI SERVICES
    {
        category: 'Taxi Services',
        name: 'Athanavoor Auto Stand',
        vehicleType: 'Auto Rickshaw',
        capacity: 3,
        operator: { name: 'Auto Union', verified: true, rating: 4.3 },
        pricingDetails: { amount: 50, unit: 'min fare', rateType: 'Flat Rate', description: 'Scenic trips negotiable (~₹400 for 2hrs)' },
        availability: { status: 'Available', operatingHours: '6 AM - 10 PM' },
        ratings: { overall: 4.3, safety: 4.5, cleanliness: 3.8, punctuality: 4.8, userReviewCount: 120 },
        image: 'https://images.unsplash.com/photo-1620882352345-d8f8fb446698?auto=format&fit=crop&w=800&q=80',
        locationDetails: { coordinates: [12.5780, 78.6370] }
    },
    {
        category: 'Taxi Services',
        name: 'Royal Cabs',
        vehicleType: 'Sedan / SUV',
        capacity: 4,
        vehicleFeatures: { isAC: true, gps: true },
        operator: { name: 'Royal Cabs', contact: '+91 99999 88888', verified: true, rating: 4.7 },
        pricingDetails: { amount: 1500, unit: 'flat rate', rateType: 'Flat Rate', description: 'Jolarpettai Station Drop' },
        availability: { status: 'Available', operatingHours: '24/7' },
        ratings: { overall: 4.7, safety: 4.8, cleanliness: 4.5, punctuality: 4.6, userReviewCount: 85 },
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
        locationDetails: { coordinates: [12.5850, 78.6390] }
    },
    {
        category: 'Taxi Services',
        name: "Yelagiri Hills Taxi",
        vehicleType: "Sedan",
        pricingDetails: { amount: 800, unit: "Local Drop", rateType: "Local Drop" },
        operator: { name: "Ravichandran", contact: "+91 9443210000", verified: true, rating: 4.8 },
        availability: { status: "Available", operatingHours: "24/7" },
        liveUpdates: { status: "Free", trafficStatus: "Clear" },
        vehicleFeatures: { isAC: true, gps: true },
        image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",
        ratings: { overall: 4.8 },
        locationDetails: { coordinates: [12.5790, 78.6380] }
    },
    {
        category: 'Taxi Services',
        name: "Athanavoor Cab Point",
        vehicleType: "Innova",
        pricingDetails: { amount: 2000, unit: "Outstation Base", rateType: "Outstation Base" },
        operator: { name: "Suresh", contact: "+91 9334455667", verified: true, rating: 4.6 },
        availability: { status: "Available", operatingHours: "24/7" },
        liveUpdates: { status: "Free", trafficStatus: "Clear" },
        vehicleFeatures: { isAC: true, gps: true, carrier: true },
        image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2",
        ratings: { overall: 4.6 },
        locationDetails: { coordinates: [12.5790, 78.6380] }
    },

    // 4. PUBLIC BUSES
    {
        category: 'Public City Buses',
        name: 'TNSTC Route 444',
        vehicleType: 'Government Bus',
        capacity: 50,
        operator: { name: 'TNSTC', verified: true, rating: 3.8 },
        pricingDetails: { amount: 35, unit: 'per ticket', rateType: 'Flat Rate', minFare: 10 },
        availability: { status: 'Available', operatingHours: '5 AM - 9 PM' },
        route: {
            from: 'Tirupattur',
            to: 'Yelagiri (Athanavoor)',
            stops: ['Tirupattur', 'Jolarpettai', 'Ponneri', '14 Hairpin Bends', 'Athanavoor'],
            distance: '30 km',
            duration: '1 hr 15 mins'
        },
        liveUpdates: { status: 'On Time', currentPosition: [12.55, 78.61], trafficStatus: 'Moderate' },
        ratings: { overall: 3.8, safety: 4.2, cleanliness: 3.0, punctuality: 4.0, userReviewCount: 500 },
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
        locationDetails: { coordinates: [12.5500, 78.6100] }
    },
    {
        category: 'Public City Buses',
        name: 'Hill Circular Shuttle',
        vehicleType: 'Mini Bus',
        capacity: 25,
        operator: { name: 'TNSTC', verified: true, rating: 3.5 },
        pricingDetails: { amount: 15, unit: 'per trip', rateType: 'Flat Rate' },
        availability: { status: 'Busy', operatingHours: '7 AM - 6 PM' },
        route: {
            from: 'Athanavoor',
            to: 'Nilavoor',
            stops: ['Athanavoor', 'Nature Park', 'Mangalam', 'Nilavoor Lake'],
            distance: '6 km',
            duration: '20 mins'
        },
        liveUpdates: { status: 'Delayed', currentPosition: [12.575, 78.635] },
        ratings: { overall: 3.5, safety: 4.0, cleanliness: 3.5, punctuality: 3.2, userReviewCount: 150 },
        image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
        locationDetails: { coordinates: [12.5750, 78.6350] }
    },
    {
        category: 'Public City Buses',
        name: 'Yelagiri Public Bus TNSTC',
        vehicleType: 'Bus',
        pricingDetails: { amount: 30, unit: "One Way", rateType: "One Way" },
        operator: { name: "TNSTC", contact: "+91 04174 246565", verified: true, rating: 4.0 },
        availability: { status: "Available", operatingHours: "5 AM - 9 PM" },
        liveUpdates: { status: "Free" },
        route: { from: "Vaniyambadi", to: "Yelagiri", stops: ["Base", "Hairpin 7", "Athanavoor"] },
        image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957",
        ratings: { overall: 4.0 },
        locationDetails: { coordinates: [12.5500, 78.6100] }
    },

    // 5. INTERCITY BUSES
    {
        category: 'Intercity Buses',
        name: 'Bangalore Express (KSRTC)',
        vehicleType: 'Volvo Multi-Axle AC',
        capacity: 45,
        vehicleFeatures: { isAC: true, wifi: true, gps: true },
        operator: { name: 'KSRTC', verified: true, rating: 4.6 },
        pricingDetails: { amount: 450, unit: 'per seat', rateType: 'Flat Rate' },
        availability: { status: 'Available', operatingHours: '7 AM - 11 PM' },
        route: {
            from: 'Bangalore (Satellite)',
            to: 'Yelagiri (via Jolarpettai)',
            distance: '160 km',
            duration: '3.5 Hours'
        },
        ratings: { overall: 4.6, safety: 4.8, cleanliness: 4.7, punctuality: 4.9, userReviewCount: 1200 },
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
        locationDetails: { coordinates: [12.5600, 78.5500] }
    },
    {
        category: 'Intercity Buses',
        name: 'Chennai SETC Ultra Deluxe',
        vehicleType: 'Ultra Deluxe (2+2)',
        capacity: 40,
        vehicleFeatures: { isAC: true },
        operator: { name: 'SETC', verified: true, rating: 3.9 },
        pricingDetails: { amount: 350, unit: 'per seat', rateType: 'Flat Rate' },
        availability: { status: 'Available', operatingHours: '6 AM - 10 PM' },
        route: {
            from: 'Chennai (CMBT)',
            to: 'Yelagiri',
            distance: '230 km',
            duration: '4.5 Hours'
        },
        ratings: { overall: 3.9, safety: 4.1, cleanliness: 3.5, punctuality: 4.0, userReviewCount: 890 },
        image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
        locationDetails: { coordinates: [12.5600, 78.5500] }
    },

    // 6. JEEP SAFARI
    {
        category: 'Jeep Safari',
        name: 'Wild Hill Safari',
        vehicleType: 'Open Jeep (Thar/Gypsy)',
        capacity: 6,
        vehicleFeatures: { isAC: false, gps: true },
        operator: { name: 'Yelagiri Adventure Club', contact: '+91 99440 00000', verified: true, rating: 4.9 },
        pricingDetails: { amount: 4500, unit: 'per trip (4 hrs)', rateType: 'Per Trip', description: 'Includes Forest Entry' },
        availability: { status: 'Available', operatingHours: '6 AM - 5 PM' },
        safariDetails: {
            coveredSpots: ['Swamimalai Base', 'Mangalam Forest', 'Sunset View Point', 'Tribal Village'],
            duration: '4 Hours',
            packageInclusions: ['Binoculars', 'Water Bottle', 'Guide'],
            bestTime: 'Early Morning (6 AM)'
        },
        ratings: { overall: 4.9, safety: 4.8, cleanliness: 4.5, punctuality: 4.9, userReviewCount: 420 },
        image: 'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?auto=format&fit=crop&w=800&q=80',
        locationDetails: { coordinates: [12.5650, 78.6500] }
    },
    {
        category: 'Jeep Safari',
        name: 'Night Jungle Patrol',
        vehicleType: 'Modified Jeep',
        capacity: 5,
        vehicleFeatures: { isAC: false, gps: true },
        operator: { name: 'Night Owls', contact: '+91 98765 11111', verified: true, rating: 4.7 },
        pricingDetails: { amount: 5500, unit: 'per trip (3 hrs)', rateType: 'Per Trip', description: 'Night permits included' },
        availability: { status: 'Available', operatingHours: '7 PM - 11 PM' },
        safariDetails: {
            coveredSpots: ['Forest Perimeter', 'Observatory Road', 'Star Gazing Point'],
            duration: '3 Hours',
            packageInclusions: ['Flashlights', 'Snacks', 'Spotting Scope'],
            bestTime: 'Night (8 PM)'
        },
        ratings: { overall: 4.7, safety: 4.9, cleanliness: 4.8, punctuality: 4.8, userReviewCount: 150 },
        image: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&w=800&q=80',
        locationDetails: { coordinates: [12.5700, 78.6400] }
    },
    {
        category: 'Jeep Safari',
        name: "Forest Jeep Safari",
        vehicleType: "Mahindra Thar",
        pricingDetails: { amount: 1500, unit: "Per Slot (6 Pax)", rateType: "Flat Rate" },
        operator: { name: "Kumar", contact: "+91 9876543210", verified: true, rating: 4.9 },
        availability: { status: "Available", operatingHours: "6 AM - 6 PM" },
        liveUpdates: { status: "Free" },
        vehicleFeatures: { isAC: false, gps: true },
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
        ratings: { overall: 4.9 },
        locationDetails: { coordinates: [12.5650, 78.6500] }
    },
    {
        category: 'Jeep Safari',
        name: "Mangalam Jeep Tours",
        vehicleType: "Jeep",
        pricingDetails: { amount: 1200, unit: "Per Ride", rateType: "Per Ride" },
        operator: { name: "Babu", contact: "+91 9556677889", verified: true, rating: 4.5 },
        availability: { status: "Available", operatingHours: "Sunrise - Sunset" },
        liveUpdates: { status: "Free" },
        safariDetails: { coveredSpots: ["Swamimalai", "Rose Garden", "Boat House"] },
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf",
        ratings: { overall: 4.5 },
        locationDetails: { coordinates: [12.5650, 78.6500] }
    },

    // 7. PRIVATE DRIVERS
    {
        category: 'Private Drivers',
        name: 'Mr. Ravi Kumar',
        vehicleType: 'Driver Only',
        capacity: 1,
        operator: { name: 'Independent', contact: '+91 91234 56789', verified: true, rating: 4.8 },
        pricingDetails: { amount: 800, unit: 'per day (8 hrs)', rateType: 'Per Day', description: 'Food/Accomm extra for outstation' },
        availability: { status: 'Available', operatingHours: 'Flexible' },
        driverDetails: { experience: '15 Years', languages: ['Tamil', 'English', 'Hindi'], isVerified: true, attributes: ['Local Expert'] },
        ratings: { overall: 4.8, safety: 5.0, cleanliness: 5.0, punctuality: 4.9, userReviewCount: 88 },
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        locationDetails: { coordinates: [12.5790, 78.6380] }
    },
    {
        category: 'Private Drivers',
        name: 'Mr. Murugan',
        vehicleType: 'Driver Only',
        capacity: 1,
        operator: { name: 'Independent', contact: '+91 99887 77665', verified: true, rating: 4.6 },
        pricingDetails: { amount: 700, unit: 'per day', rateType: 'Per Day' },
        availability: { status: 'Busy', operatingHours: '6 AM - 8 PM' },
        driverDetails: { experience: '8 Years', languages: ['Tamil', 'Telugu'], isVerified: true, attributes: ['Light Motor Vehicle'] },
        ratings: { overall: 4.6, safety: 4.7, cleanliness: 4.5, punctuality: 4.8, userReviewCount: 45 },
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        locationDetails: { coordinates: [12.5830, 78.6420] }
    },
    {
        category: 'Private Drivers',
        name: "Elite Private Driver",
        vehicleType: "Driver Only",
        pricingDetails: { amount: 1200, unit: "8 Hours", rateType: "8 Hours" },
        operator: { name: "Dinesh", contact: "+91 9844556677", verified: true, rating: 4.9 },
        availability: { status: "Available", operatingHours: "Flexible" },
        liveUpdates: { status: "Free" },
        driverDetails: { experience: "12 Years", languages: ["Tamil", "English", "Hindi"], isVerified: true },
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
        ratings: { overall: 4.9 },
        locationDetails: { coordinates: [12.5790, 78.6380] }
    },
    {
        category: 'Private Drivers',
        name: "Local Pro Driver Service",
        vehicleType: "Driver Only",
        pricingDetails: { amount: 1000, unit: "Day Shift", rateType: "Day Shift" },
        operator: { name: "Arjun", contact: "+91 9887766554", verified: true, rating: 4.8 },
        availability: { status: "Available", operatingHours: "8 AM - 8 PM" },
        liveUpdates: { status: "Free" },
        driverDetails: { experience: "8 Years", languages: ["Tamil", "Kannada"], isVerified: true },
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        ratings: { overall: 4.8 },
        locationDetails: { coordinates: [12.5790, 78.6380] }
    },
    {
        category: 'Private Drivers',
        name: "Professional Tour Driver",
        vehicleType: "Driver Only",
        pricingDetails: { amount: 1500, unit: "Full Day", rateType: "Per Day" },
        operator: { name: "Suresh", contact: "+91 9443322110", verified: true, rating: 4.9 },
        availability: { status: "Available", operatingHours: "24/7" },
        driverDetails: { experience: "20 Years", languages: ["Tamil", "Malayalam", "English"], isVerified: true, attributes: ['Long Distance Expert'] },
        ratings: { overall: 4.9 },
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        locationDetails: { coordinates: [12.5790, 78.6380] }
    },
    {
        category: 'Private Drivers',
        name: "Eco-Friendly Guide Driver",
        vehicleType: "Driver Only",
        pricingDetails: { amount: 1100, unit: "8 Hour Shift", rateType: "Flat Rate" },
        operator: { name: "Arul", contact: "+91 9844332211", verified: true, rating: 4.7 },
        availability: { status: "Available", operatingHours: "6 AM - 6 PM" },
        driverDetails: { experience: "10 Years", languages: ["Tamil", "Kannada", "English"], isVerified: true, attributes: ['Non-smoker', 'Bird Watching Expert'] },
        ratings: { overall: 4.7 },
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
        locationDetails: { coordinates: [12.5830, 78.6420] }
    },
    {
        category: 'Taxi Services',
        name: "Yelagiri Green Cabs",
        vehicleType: "Electric Car",
        pricingDetails: { amount: 1200, unit: "Full Day Local", rateType: "Per Day" },
        operator: { name: "Green Yelagiri", contact: "+91 9112233445", verified: true, rating: 4.8 },
        availability: { status: "Available", operatingHours: "24/7" },
        vehicleFeatures: { isAC: true, gps: true },
        ratings: { overall: 4.8 },
        image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2",
        locationDetails: { coordinates: [12.5790, 78.6380] }
    },
    {
        category: 'Public City Buses',
        name: "Nilavoor Mini Shuttle",
        vehicleType: "Mini Bus",
        pricingDetails: { amount: 20, unit: "Local Loop", rateType: "Flat Rate" },
        operator: { name: "Local Union", contact: "N/A", verified: true, rating: 4.1 },
        availability: { status: "Available", operatingHours: "7 AM - 7 PM" },
        route: { from: "Athanavoor", to: "Nilavoor Side", stops: ["Main Stand", "Park", "Lake"] },
        ratings: { overall: 4.1 },
        image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e",
        locationDetails: { coordinates: [12.5750, 78.6350] }
    }
];

const seedTransport = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('ERROR: MONGODB_URI not found in environment!');
            process.exit(1);
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for Seeding...');
        
        await Transport.deleteMany();
        console.log('Cleared existing transport data.');

        const result = await Transport.insertMany(transportData);
        console.log(`Added ${result.length} transport services successfully.`);

        process.exit();
    } catch (error) {
        console.error('Seeding failed with Error:', error);
        process.exit(1);
    }
};

seedTransport();
