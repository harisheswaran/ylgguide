const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Guide = require('./models/Guide');

dotenv.config();

const guides = [
    {
        name: 'Arjun Swamy',
        bio: 'Local trekker with 10+ years of experience in Yelagiri hills. Specialist in night treks and bird watching. I will take you to the most unseen caves of Swamimalai hills and ensure you witness the best sunrise of your life.',
        image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=400&q=80',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        locationName: 'Swamimalai',
        certifications: ['Certified Wilderness First Responder', 'Advanced Mountaineering Course', 'Eco-Tourism Specialist'],
        languages: ['English', 'Tamil', 'Hindi', 'Telugu'],
        expertise: ['Night Trekking', 'Bird Watching', 'Cave Exploration', 'Photography'],
        experience: 12,
        rating: 4.9,
        reviewsCount: 156,
        pricePerHour: 500,
        pricePerDay: 3000,
        pricePerGroup: 5000,
        isVerified: true,
        email: 'arjun.swamy@yelaguide.com',
        phone: '+91 94432 12345',
        badges: ['Top Rated', 'Local Expert', 'Eco-Warrior'],
        gallery: [
            'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80'
        ]
    },
    {
        name: 'Sravya Reddy',
        bio: 'Environmentalist and expert guide for hidden trails and nature photography. Passionate about preserving the local ecosystem while providing an immersive mountain experience.',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
        locationName: 'Nilavur',
        certifications: ['Environmental Conservation Certificate', 'Nature Photography Award 2023'],
        languages: ['English', 'Telugu', 'Tamil', 'Kannada'],
        expertise: ['Nature Photography', 'Eco Trails', 'Plant Identification'],
        experience: 6,
        rating: 4.8,
        reviewsCount: 89,
        pricePerHour: 400,
        pricePerDay: 2500,
        pricePerGroup: 4000,
        isVerified: true,
        email: 'sravya.reddy@yelaguide.com',
        phone: '+91 98845 67890',
        badges: ['Eco-Friendly', 'Rising Star'],
        gallery: [
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b??auto=format&fit=crop&w=800&q=80'
        ]
    },
    {
        name: 'Karthik Raja',
        bio: 'Born and raised in Yelagiri, I know every shortcut and waterfall in the region. Specialist in rock climbing and adventure camping.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        locationName: 'Mangalam',
        certifications: ['Certified Rock Climbing Instructor', 'NSS Volunteer'],
        languages: ['Tamil', 'English'],
        expertise: ['Rock Climbing', 'Adventure Camping', 'Survival Skills'],
        experience: 8,
        rating: 4.7,
        reviewsCount: 120,
        pricePerHour: 600,
        pricePerDay: 3500,
        pricePerGroup: 6000,
        isVerified: false,
        email: 'karthik.raja@yelaguide.com',
        phone: '+91 81223 34455',
        badges: ['Adventure Specialist'],
        gallery: [
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
        ]
    }
];

const seedGuides = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected...');

        await Guide.deleteMany();
        console.log('Old guides removed.');

        await Guide.insertMany(guides);
        console.log('Guides seeded successfully!');

        process.exit();
    } catch (error) {
        console.error('Error seeding guides:', error);
        process.exit(1);
    }
};

seedGuides();
