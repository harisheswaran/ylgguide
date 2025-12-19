const { Blob } = require('buffer');
global.File = class File extends Blob {
    constructor(fileBits, fileName, options) {
        super(fileBits, options);
        this.name = fileName;
        this.lastModified = options?.lastModified || Date.now();
    }
};

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const axios = require('axios');
const cheerio = require('cheerio');
const Listing = require('./models/Listing');
const Category = require('./models/Category');
const connectDB = require('./config/db');

dotenv.config();

const BOOKING_URL = 'https://www.booking.com/searchresults.en-gb.html?label=yelagiri-yYLb786nAnnBNxzrExEZugS392936638068%3Apl%3Ata%3Ap1%3Ap2%3Aac%3Aap%3Aneg%3Afi%3Atikwd-299594647645%3Alp1007810%3Ali%3Adec%3Adm%3Appccp%3DUmFuZG9tSVYkc2RlIyh9YZVcNNsENnH02-pWD53qm9c&gclid=Cj0KCQiAosrJBhD0ARIsAHebCNrV_VpBjmXC8ANZpWJFWeHaSZodTuIZi1q1ZDQ12k7nRnSVUQcvXysaAtm7EALw_wcB&aid=306395&city=900052697';

const seedData = async () => {
    try {
        await connectDB();
        console.log('MongoDB Connected');

        // Get Hotel Category
        let category = await Category.findOne({ slug: 'hotels-resorts' });
        if (!category) {
            // Fallback or create if not exists (though it should exist from previous seeds)
            category = await Category.findOne({ slug: 'hotels' });
        }

        if (!category) {
            console.error('Category "hotels-resorts" or "hotels" not found. Please seed categories first.');
            process.exit(1);
        }

        console.log(`Loading data from booking_data.json...`);
        const rawData = require('./booking_data.json');
        const listings = [];

        for (const item of rawData) {
            // Generate random price between 1500 and 8000
            const price = Math.floor(Math.random() * (8000 - 1500 + 1)) + 1500;
            // Generate random rating between 3.5 and 5.0
            const rating = (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1);
            // Generate random reviews count
            const reviewsCount = Math.floor(Math.random() * 500) + 10;

            const amenities = ['Free WiFi', 'Parking', 'Mountain View', 'Restaurant', 'Room Service'];
            if (Math.random() > 0.5) amenities.push('Swimming Pool');
            if (Math.random() > 0.5) amenities.push('Spa');
            if (Math.random() > 0.5) amenities.push('Gym');

            listings.push({
                name: item.name,
                description: `Experience a wonderful stay at ${item.name}. Located in the beautiful Yelagiri Hills, offering great amenities and scenic views.`,
                category: category._id,
                price: price,
                rating: parseFloat(rating),
                reviewsCount: reviewsCount,
                image: item.image,
                address: item.address || 'Yelagiri Hills',
                location: {
                    type: 'Point',
                    coordinates: [78.6394 + (Math.random() * 0.04 - 0.02), 12.5766 + (Math.random() * 0.04 - 0.02)] // Random coordinates around Yelagiri
                },
                amenities: amenities,
                features: amenities,
                offers: Math.random() > 0.6 ? ['10% OFF', 'Free Breakfast'] : [],
                phone: '+91 98765 43210',
                email: 'info@yelagiri-hotels.com',
                website: 'https://www.booking.com'
            });
        }

        console.log(`Found ${listings.length} listings.`);

        if (listings.length > 0) {
            // Upsert listings based on name
            for (const listing of listings) {
                await Listing.findOneAndUpdate(
                    { name: listing.name },
                    listing,
                    { upsert: true, new: true }
                );
            }
            console.log('Data imported successfully!');
        } else {
            console.log('No listings found. The selectors might need adjustment or the page structure has changed.');
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

seedData();
