const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Category = require('./models/Category');
const Listing = require('./models/Listing');

dotenv.config({ override: true });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yelagiri-guide';

connectDB();

const seedData = async () => {
    try {
        // Clear existing data
        await Category.deleteMany();
        await Listing.deleteMany();

        // Create Categories
        const hotels = await Category.create({
            slug: 'hotels',
            name: 'Hotels & Resorts',
            icon: '🏨',
            description: 'Find the best places to stay in Yelagiri.'
        });

        const spots = await Category.create({
            slug: 'spots',
            name: 'Tourist Spots',
            icon: '⛰️',
            description: 'Explore beautiful attractions and viewpoints.'
        });

        const restaurants = await Category.create({
            slug: 'restaurants',
            name: 'Restaurants',
            icon: '🍽️',
            description: 'Discover local cuisine and dining spots.'
        });

        const emergency = await Category.create({
            slug: 'emergency',
            name: 'Emergency',
            icon: '🚑',
            description: 'Hospitals, police stations, and help centers.'
        });

        const activities = await Category.create({
            slug: 'activities',
            name: 'Activities',
            icon: '🚣',
            description: 'Boating, trekking, and adventure sports.'
        });

        const shopping = await Category.create({
            slug: 'shopping',
            name: 'Shopping',
            icon: '🛍️',
            description: 'Local markets and souvenirs.'
        });

        // Create Listings
        await Listing.create([
            {
                name: 'Yelagiri Residency',
                description: 'Experience the best hospitality in Yelagiri. Our residency offers comfortable rooms, delicious food, and a serene environment. Perfect for families and couples.',
                address: 'Main Road, Yelagiri Hills, Tamil Nadu 635853',
                phone: '9876543210',
                email: 'contact@yelagiri-residency.com',
                website: 'https://example.com',
                features: ['Free Wi-Fi', 'Parking', 'Restaurant', 'Room Service'],
                category: hotels._id
            },
            {
                name: 'Hilltop Resort',
                description: 'Luxury resort situated at the highest point of Yelagiri. Enjoy breathtaking views and premium amenities.',
                address: 'Athanavur, Yelagiri Hills, Tamil Nadu 635853',
                phone: '9876543211',
                email: 'info@hilltop.com',
                website: 'https://hilltop.com',
                features: ['Swimming Pool', 'Spa', 'Gym', 'Conference Hall'],
                category: hotels._id
            },
            {
                name: 'Punganoor Lake',
                description: 'A beautiful man-made lake in the center of Yelagiri. Popular for boating and the adjacent park.',
                address: 'Center of Yelagiri, Tamil Nadu',
                features: ['Boating', 'Park', 'Walking Track'],
                category: spots._id
            },
            {
                name: 'Nature Park',
                description: 'A well-maintained park with a variety of flora. Features a musical fountain and aquarium.',
                address: 'Near Lake, Yelagiri Hills',
                features: ['Musical Fountain', 'Aquarium', 'Bamboo House'],
                category: spots._id
            },
            {
                name: 'Swamimalai Hills',
                description: 'Highest point in Yelagiri, perfect for trekking and sunrise views.',
                address: 'Yelagiri Hills',
                features: ['Trekking', 'Viewpoint', 'Photography'],
                category: spots._id
            },
            {
                name: 'Government Hospital',
                description: '24/7 Emergency services available.',
                address: 'Athanavur, Yelagiri',
                phone: '108',
                features: ['24/7', 'Ambulance', 'Emergency Care'],
                category: emergency._id
            },
            {
                name: 'Police Station',
                description: 'Yelagiri Police Station for any emergencies.',
                address: 'Main Road, Yelagiri',
                phone: '100',
                features: ['24/7', 'Emergency Response'],
                category: emergency._id
            },
            {
                name: 'Hilltop Restaurant',
                description: 'Multi-cuisine restaurant with amazing views.',
                address: 'Near Lake, Yelagiri',
                phone: '9876543212',
                features: ['Indian', 'Chinese', 'Continental'],
                category: restaurants._id
            },
            {
                name: 'Boating at Punganoor Lake',
                description: 'Enjoy pedal boating and row boating.',
                address: 'Punganoor Lake, Yelagiri',
                phone: '9876543213',
                features: ['Pedal Boat', 'Row Boat', 'Family Friendly'],
                category: activities._id
            },
            {
                name: 'Paragliding Point',
                description: 'Experience the thrill of paragliding.',
                address: 'Yelagiri Hills',
                phone: '9876543214',
                features: ['Paragliding', 'Certified Instructors', 'Safety Equipment'],
                category: activities._id
            },
            {
                name: 'Local Market',
                description: 'Buy fresh vegetables, fruits, and local products.',
                address: 'Main Road, Yelagiri',
                features: ['Fresh Produce', 'Handicrafts', 'Souvenirs'],
                category: shopping._id
            }
        ]);

        console.log('Data seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
