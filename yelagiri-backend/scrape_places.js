const mongoose = require('mongoose');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Category = require('./models/Category');
const Listing = require('./models/Listing');

dotenv.config();

connectDB();

const scrapePlaces = async () => {
    try {
        const html = fs.readFileSync(path.join(__dirname, 'places.html'), 'utf8');
        const $ = cheerio.load(html);

        let spotsCategory = await Category.findOne({ slug: 'spots' });
        if (!spotsCategory) {
            console.log('Creating Tourist Spots category...');
            spotsCategory = await Category.create({
                slug: 'spots',
                name: 'Tourist Spots',
                icon: '⛰️',
                description: 'Explore beautiful attractions and viewpoints.'
            });
        }

        const places = [];

        // Iterate over each gallery item to get the ID and Image
        $('.gallery').each((index, element) => {
            const anchor = $(element).find('a');
            const onclick = anchor.attr('onclick');
            const img = anchor.find('img').attr('src');

            // Extract ID from onclick="return theFunction('funderaPark');"
            const idMatch = onclick ? onclick.match(/'([^']+)'/) : null;
            const placeId = idMatch ? idMatch[1] : null;

            if (placeId) {
                // Find the corresponding details div
                const detailsDiv = $(`#${placeId}`);
                if (detailsDiv.length > 0) {
                    const name = detailsDiv.find('h4').text().trim();

                    // Get all paragraphs for description
                    let description = '';
                    detailsDiv.find('p').each((i, el) => {
                        const text = $(el).text().trim();
                        // Filter out metadata paragraphs
                        if (!text.startsWith('Distance From') &&
                            !text.startsWith('Suggested duration') &&
                            !text.startsWith('Entry Fee') &&
                            !text.startsWith('Timing') &&
                            !text.startsWith('Google Review Rating') &&
                            !text.includes('reviews') &&
                            !text.startsWith('Note:')) {
                            description += text + '\n\n';
                        }
                    });

                    // Extract other metadata
                    const distance = detailsDiv.find("h5:contains('Distance From Elite Resort')").next('p').text().trim();
                    const duration = detailsDiv.find("h5:contains('Suggested duration')").next('p').text().trim();
                    const entryFee = detailsDiv.find("h5:contains('Entry Fee')").next('p').text().trim();
                    const timing = detailsDiv.find("h5:contains('Timing')").next('p').text().trim();
                    const googleMapLink = detailsDiv.find("a[href*='maps.app.goo.gl']").attr('href');

                    // Rating and Reviews
                    const ratingText = detailsDiv.find('.rating').first().text().trim();
                    const rating = parseFloat(ratingText) || 0;

                    const reviewsText = detailsDiv.find("p:contains('reviews')").first().text().trim();
                    const reviewsCount = parseInt(reviewsText.replace(/,/g, '').match(/\d+/)) || 0;

                    // Construct Image URL (using absolute URL from the site)
                    const imageUrl = `https://www.eliteresortyelagiri.com/${img.replace('./', '')}`;

                    // Construct Features/Amenities
                    const features = [];
                    if (distance) features.push(`Distance: ${distance}`);
                    if (duration) features.push(`Duration: ${duration}`);
                    if (timing) features.push(`Timing: ${timing}`);

                    // Parse Price/Entry Fee
                    let price = 0;
                    if (entryFee) {
                        const priceMatch = entryFee.match(/₹\s*(\d+)/);
                        if (priceMatch) {
                            price = parseInt(priceMatch[1]);
                        }
                    }

                    places.push({
                        name,
                        description: description.trim(),
                        image: imageUrl,
                        category: spotsCategory._id,
                        rating,
                        reviewsCount,
                        price,
                        features,
                        website: googleMapLink, // Storing map link in website field for now
                        address: 'Yelagiri Hills', // Default address
                        location: {
                            type: 'Point',
                            coordinates: [0, 0] // Placeholder
                        }
                    });
                }
            }
        });

        console.log(`Found ${places.length} places.`);

        // Insert into database
        for (const place of places) {
            await Listing.findOneAndUpdate(
                { name: place.name },
                place,
                { upsert: true, new: true }
            );
            console.log(`Processed: ${place.name}`);
        }

        console.log('Scraping and seeding completed successfully!');
        process.exit();

    } catch (error) {
        console.error('Error scraping places:', error);
        process.exit(1);
    }
};

scrapePlaces();
