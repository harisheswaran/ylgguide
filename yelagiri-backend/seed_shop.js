const mongoose = require('mongoose');
const dotenv = require('dotenv');
const ShopCategory = require('./models/ShopCategory');
const ShopProduct = require('./models/ShopProduct');

dotenv.config();

const categories = [
    {
        name: 'Handicrafts',
        slug: 'handicrafts',
        description: 'Local handmade items',
        image: '/images/shop/handicrafts.png'
    },
    {
        name: 'Spices & Honey',
        slug: 'spices-honey',
        description: 'Authentic local spices and pure honey',
        image: '/images/shop/spices-honey.png'
    },
    {
        name: 'Homemade Chocolates',
        slug: 'chocolates',
        description: 'Delicious homemade chocolates',
        image: '/images/shop/chocolates.png'
    },
    {
        name: 'Natural Oils',
        slug: 'natural-oils',
        description: 'Pure and organic natural oils',
        image: 'https://placehold.co/100x100?text=Oils'
    }
];

const products = [
    {
        name: 'Pure Hill Honey',
        slug: 'pure-hill-honey',
        description: '100% organic honey collected from Yelagiri hills.',
        price: 350,
        stock: 50,
        images: ['/images/shop/spices-honey.png'],
        vendor: {
            name: 'Yelagiri Naturals',
            location: {
                type: 'Point',
                coordinates: [78.6569, 12.5795], // Approx Yelagiri coords
                address: 'Main Road, Athanavur'
            },
            contact: '9998887776'
        }
    },
    {
        name: 'Jackfruit Chips',
        slug: 'jackfruit-chips',
        description: 'Crispy fried jackfruit chips made with coconut oil.',
        price: 120,
        stock: 100,
        images: ['https://placehold.co/400x300?text=Chips'],
        vendor: {
            name: 'Murugan Sweets',
            location: {
                type: 'Point',
                coordinates: [78.6400, 12.5700],
                address: 'Near Lake, Yelagiri'
            },
            contact: '8887776665'
        }
    },
    {
        name: 'Bamboo Basket',
        slug: 'bamboo-basket',
        description: 'Handwoven bamboo basket, eco-friendly and durable.',
        price: 250,
        stock: 20,
        images: ['/images/shop/handicrafts.png'],
        vendor: {
            name: 'Tribal Crafts',
            location: {
                type: 'Point',
                coordinates: [78.6300, 12.5800],
                address: 'Tribal Welfare Center'
            },
            contact: '7776665554'
        }
    },
    {
        name: 'Pure Eucalyptus Oil',
        slug: 'eucalyptus-oil',
        description: 'Fresh and pure Eucalyptus oil for cold and pain relief.',
        price: 150,
        stock: 80,
        images: ['https://placehold.co/400x300?text=Eucalyptus'],
        vendor: {
            name: 'Green Valley Oils',
            location: {
                type: 'Point',
                coordinates: [78.6500, 12.5750],
                address: 'Nature Park Road'
            },
            contact: '9876543210'
        }
    },
    {
        name: 'Wooden Keychain',
        slug: 'wooden-keychain',
        description: 'Hand-carved wooden keychain with Yelagiri motifs.',
        price: 50,
        stock: 200,
        images: ['/images/shop/handicrafts.png'],
        vendor: {
            name: 'Wood Arts',
            location: {
                type: 'Point',
                coordinates: [78.6450, 12.5720],
                address: 'Boat House Entrance'
            },
            contact: '8765432109'
        }
    },
    {
        name: 'Ragi Cookies',
        slug: 'ragi-cookies',
        description: 'Healthy and tasty cookies made from locally grown Ragi.',
        price: 80,
        stock: 60,
        images: ['/images/shop/spices-honey.png'], // Reusing spices/honey image or similar if possible. Spices img has honey jar, close enough or plain.
        vendor: {
            name: 'Women Self Help Group',
            location: {
                type: 'Point',
                coordinates: [78.6350, 12.5680],
                address: 'Community Hall'
            },
            contact: '7654321098'
        }
    }
];

const seedShop = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Clear existing data
        await ShopCategory.deleteMany({});
        await ShopProduct.deleteMany({});
        console.log('Cleared existing shop data');

        // Insert Categories
        const createdCategories = await ShopCategory.insertMany(categories);
        console.log(`Inserted ${createdCategories.length} categories`);

        // Map category IDs to products
        const productsWithCats = products.map((p, index) => {
            let catIndex = 0;
            // Better mapping:
            if (p.slug === 'pure-hill-honey') catIndex = createdCategories.findIndex(c => c.slug === 'spices-honey');
            if (p.slug === 'jackfruit-chips') catIndex = createdCategories.findIndex(c => c.slug === 'chocolates'); // close enough for demo
            if (p.slug === 'bamboo-basket') catIndex = createdCategories.findIndex(c => c.slug === 'handicrafts');
            if (p.slug === 'eucalyptus-oil') catIndex = createdCategories.findIndex(c => c.slug === 'natural-oils');
            if (p.slug === 'wooden-keychain') catIndex = createdCategories.findIndex(c => c.slug === 'handicrafts');
            if (p.slug === 'ragi-cookies') catIndex = createdCategories.findIndex(c => c.slug === 'spices-honey'); // Grouping with food

            return {
                ...p,
                category: createdCategories[catIndex]._id
            };
        });

        const createdProducts = await ShopProduct.insertMany(productsWithCats);
        console.log(`Inserted ${createdProducts.length} products`);

        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedShop();
