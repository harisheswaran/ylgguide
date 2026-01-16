const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Package = require('./models/Package');

dotenv.config();

const packages = [
    {
        title: 'Prime Package',
        type: 'ESSENTIAL LUXURY',
        duration: '2 Days, 1 Night',
        price: '₹7,499',
        rating: 4.8,
        stars: 4,
        reviewsCount: 124,
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
        locationName: 'Athanavur',
        iconType: 'User',
        includes: ['Standard Mountain View Room', 'Buffet Breakfast', 'Guided Nature Walk', 'Evening Bonfire'],
        amenities: ['Wifi', 'Parking', 'Restaurant'],
        longDescription: "Escape to the hills with our Prime Package, perfect for a quick getaway. Enjoy a cozy stay with stunning mountain views, delicious breakfast, and immersive nature activities.",
        exclusions: ['Lunch and Dinner', 'Personal Expenses', 'Travel Insurance'],
        offers: ['10% off on Spa', 'Free Welcome Drink'],
        reviews: [
            { user: "Arun K.", rating: 5, comment: "Amazing experience for the price. The mountain view was breathtaking!", date: "2024-12-10" },
            { user: "Sanjana M.", rating: 4, comment: "Good service and delicious breakfast. Highly recommend.", date: "2024-11-25" }
        ]
    },
    {
        title: 'Gold Package',
        type: 'COMFORT+',
        duration: '3 Days, 2 Nights',
        price: '₹12,999',
        rating: 4.9,
        stars: 5,
        reviewsCount: 89,
        image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
        locationName: 'Nilavur',
        iconType: 'Trophy',
        includes: ['Deluxe Heritage Suite', 'Half-Board Dining', 'Boat Ride at Punganoor Lake', 'Private Sightseeing'],
        amenities: ['Wifi', 'Pool', 'Spa', 'Parking'],
        longDescription: "Indulge in comfort with our Gold Package. Stay in a heritage suite, savor gourmet meals, and explore the best of Yelagiri with a private boat ride and sightseeing tour.",
        exclusions: ['Alcoholic Beverages', 'Tips and Gratuities'],
        offers: ['Complimentary High Tea', 'Late Checkout (subject to availability)'],
        reviews: [
            { user: "Vikram R.", rating: 5, comment: "The heritage suite felt so royal. The boat ride was very peaceful.", date: "2024-12-15" }
        ]
    },
    {
        title: 'Premium Package',
        type: 'ELITE EXPERIENCE',
        duration: '4 Days, 3 Nights',
        price: '₹19,999',
        rating: 5.0,
        stars: 5,
        reviewsCount: 56,
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
        locationName: 'Swamimalai',
        iconType: 'ShieldCheck',
        includes: ['Presidential Villa stay', 'All-Inclusive Meals', 'Personal Butler Service', 'Exclusive Trekking Expedition'],
        amenities: ['Wifi', 'Pool', 'Spa', 'Gym', 'Bar', 'Parking'],
        longDescription: "Experience the pinnacle of luxury with our Premium Package. A presidential villa, personal butler, and exclusive adventures await you for a truly elite vacation.",
        exclusions: ['Airfare', 'Personal Shopping'],
        offers: ['Free Couple Spa Session', 'Champagne on Arrival'],
        reviews: [
            { user: "Elena D.", rating: 5, comment: "Best stay ever! The personal butler made everything so easy.", date: "2024-12-20" }
        ]
    },
    {
        title: 'Family Package',
        type: 'MEMORABLE MOMENTS',
        duration: '3 Days, 2 Nights',
        price: '₹15,499',
        rating: 4.7,
        stars: 4,
        reviewsCount: 156,
        image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80',
        locationName: 'Punganoor',
        iconType: 'Users',
        includes: ['Interconnected Family Suite', 'Kids Menu & Activities', 'Nature Park Visit', 'Outdoor Games Session'],
        amenities: ['Wifi', 'Pool', 'Play Area', 'Parking'],
        longDescription: "Create lasting memories with your loved ones. Our Family Package offers spacious suites, fun activities for kids, and nature excursions that everyone will enjoy.",
        exclusions: ['Extra Bed Charges', 'Babysitting Services'],
        offers: ['Kids Eat Free', 'Free Family Photo Session'],
        reviews: [
            { user: "The Reddys", rating: 5, comment: "Perfect for kids! They loved the nature park and the games.", date: "2024-12-05" }
        ]
    },
    {
        title: 'Couples Package',
        type: 'ROMANTIC RETREAT',
        duration: '2 Days, 1 Night',
        price: '₹9,999',
        rating: 4.9,
        stars: 5,
        reviewsCount: 210,
        image: 'https://images.unsplash.com/photo-1516589174184-e6646f6588a0?auto=format&fit=crop&w=800&q=80',
        locationName: 'Swamimalai',
        iconType: 'Heart',
        includes: ['Romantic Room Decor', 'Candle Light Dinner', 'Spa for Two', 'Sunset View Point Access'],
        amenities: ['Wifi', 'Spa', 'Jacuzzi', 'Parking'],
        longDescription: "Ignite the romance with our Couples Package. Enjoy intimate dinners, soothing spa treatments, and breathtaking sunsets in a setting designed for love.",
        exclusions: ['Photography', 'Flower Bouquets'],
        offers: ['Complimentary Wine', 'Room Upgrade (subject to availability)'],
        reviews: [
            { user: "Priya & Rahul", rating: 5, comment: "The candle light dinner was so romantic. A dream come true.", date: "2024-12-18" }
        ]
    },
    {
        title: 'Friends Adventure',
        type: 'GROUP FUN',
        duration: '3 Days, 2 Nights',
        price: '₹6,499 pp',
        rating: 4.8,
        stars: 3,
        reviewsCount: 95,
        image: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=800&q=80',
        locationName: 'Mangalam',
        iconType: 'Users',
        includes: ['Group Cabin / Cottages', 'Barbecue Night', 'Adventure Sports Access', 'Night Safari Trek'],
        amenities: ['Wifi', 'Bonfire', 'Parking', 'Games'],
        longDescription: "Gather your squad for an unforgettable adventure! Our Friends Package includes group accommodation, thrilling sports, and a lively barbecue night.",
        exclusions: ['Equipment Rental Damage', 'Personal Gear'],
        offers: ['1 Free Adventure Activity', 'Group Discount on F&B'],
        reviews: [
            { user: "Aditya & Gang", rating: 5, comment: "Barbecue night was the highlight! Great fun with friends.", date: "2024-12-22" }
        ]
    },
    {
        title: 'Honeymoon Package',
        type: 'ETERNAL LOVE',
        duration: '5 Days, 4 Nights',
        price: '₹29,999',
        rating: 5.0,
        stars: 5,
        reviewsCount: 42,
        image: 'https://images.unsplash.com/photo-1469796466635-455ede028684?auto=format&fit=crop&w=800&q=80',
        locationName: 'Swamimalai',
        iconType: 'Heart',
        includes: ['Ultra-Luxury Glass Villa', 'Private Dining Under Stars', 'Exotic Couple Rituals', 'Exclusive Gifts & Wine'],
        amenities: ['Wifi', 'Private Pool', 'Spa', 'Butler', 'Parking'],
        longDescription: "Celebrate your union in ultimate luxury. Our Honeymoon Package features a glass villa, private star-lit dining, and exclusive romantic rituals.",
        exclusions: ['Special Requests', 'External transport'],
        offers: ['Chauffeur Driven Pick-up', 'Customized Honeymoon Cake'],
        reviews: [
            { user: "Mr. & Mrs. Kapoor", rating: 5, comment: "Unforgettable honeymoon. The glass villa was magical.", date: "2024-12-23" }
        ]
    }
];

const seedPackages = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected...');

        await Package.deleteMany();
        console.log('Old packages removed.');

        await Package.insertMany(packages);
        console.log('Packages seeded successfully!');

        process.exit();
    } catch (error) {
        console.error('Error seeding packages:', error);
        process.exit(1);
    }
};

seedPackages();
