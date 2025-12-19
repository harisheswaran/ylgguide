const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Create Categories
    const hotels = await prisma.category.upsert({
        where: { slug: 'hotels' },
        update: {},
        create: {
            slug: 'hotels',
            name: 'Hotels & Resorts',
            icon: '🏨',
            description: 'Find the best places to stay in Yelagiri.',
        },
    });

    const spots = await prisma.category.upsert({
        where: { slug: 'spots' },
        update: {},
        create: {
            slug: 'spots',
            name: 'Tourist Spots',
            icon: '⛰️',
            description: 'Explore beautiful attractions and viewpoints.',
        },
    });

    const emergency = await prisma.category.upsert({
        where: { slug: 'emergency' },
        update: {},
        create: {
            slug: 'emergency',
            name: 'Emergency',
            icon: '🚑',
            description: 'Hospitals, police stations, and help centers.',
        },
    });

    // Create Listings
    await prisma.listing.createMany({
        data: [
            {
                name: 'Yelagiri Residency',
                description: 'Comfortable stay with hill view.',
                address: 'Main Road, Yelagiri',
                phone: '9876543210',
                categoryId: hotels.id,
                features: JSON.stringify(['Free Wi-Fi', 'Parking', 'Restaurant']),
            },
            {
                name: 'Hilltop Resort',
                description: 'Luxury resort with swimming pool.',
                address: 'Athanavur, Yelagiri',
                phone: '9876543211',
                categoryId: hotels.id,
                features: JSON.stringify(['Swimming Pool', 'Spa', 'Gym']),
            },
            {
                name: 'Punganoor Lake',
                description: 'Man-made lake with boating facilities.',
                address: 'Center of Yelagiri',
                categoryId: spots.id,
                features: JSON.stringify(['Boating', 'Park']),
            },
            {
                name: 'Government Hospital',
                description: '24/7 Emergency services available.',
                address: 'Athanavur, Yelagiri',
                phone: '108',
                categoryId: emergency.id,
                features: JSON.stringify(['24/7', 'Ambulance']),
            },
        ],
    });

    console.log('Seed data created.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
