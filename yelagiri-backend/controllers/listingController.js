const Listing = require('../models/Listing');

// @desc    Get all listings
// @route   GET /api/listings
// @access  Public
const getListings = async (req, res) => {
    try {
        const { category, q, minPrice, maxPrice, rating, amenities, sort, page = 1, limit = 10, lat, lng } = req.query;
        let query = {};

        // Filter by category slug
        if (category) {
            const Category = require('../models/Category');
            const categoryDoc = await Category.findOne({ slug: category });
            if (categoryDoc) {
                query.category = categoryDoc._id;
            }
        }

        // Search functionality
        if (q) {
            query.$text = { $search: q };
        }

        // Price Filter
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Rating Filter
        if (rating) {
            query.rating = { $gte: Number(rating) };
        }

        // Amenities Filter
        if (amenities) {
            const amenitiesList = typeof amenities === 'string' ? amenities.split(',') : amenities;
            query.amenities = { $all: amenitiesList };
        }

        // Sorting
        let sortOptions = {};
        if (sort) {
            if (sort === 'price_asc') sortOptions.price = 1;
            if (sort === 'price_desc') sortOptions.price = -1;
            if (sort === 'rating_desc') sortOptions.rating = -1;
        } else {
            sortOptions.createdAt = -1; // Default sort
        }

        // Pagination
        const skip = (Number(page) - 1) * Number(limit);

        let listings;

        if (sort === 'distance' && lat && lng) {
            // Geo-spatial query for distance sorting
            listings = await Listing.aggregate([
                {
                    $geoNear: {
                        near: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
                        distanceField: 'distance',
                        spherical: true,
                        query: query
                    }
                },
                { $skip: skip },
                { $limit: Number(limit) }
            ]);

            // Populate category manually
            await Listing.populate(listings, { path: 'category' });
        } else {
            listings = await Listing.find(query)
                .populate('category')
                .sort(sortOptions)
                .skip(skip)
                .limit(Number(limit));
        }

        // Get total count for pagination
        const total = await Listing.countDocuments(query);

        res.json({
            listings,
            currentPage: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            totalListings: total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single listing
// @route   GET /api/listings/:id
// @access  Public
const getListingById = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id).populate('category');
        if (listing) {
            res.json(listing);
        } else {
            res.status(404).json({ message: 'Listing not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a listing
// @route   POST /api/listings
// @access  Public (should be protected in production)
const createListing = async (req, res) => {
    try {
        const listing = new Listing(req.body);
        const newListing = await listing.save();
        res.status(201).json(newListing);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a listing
// @route   PUT /api/listings/:id
// @access  Public (should be protected in production)
const updateListing = async (req, res) => {
    try {
        const listing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('category');

        if (listing) {
            res.json(listing);
        } else {
            res.status(404).json({ message: 'Listing not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a listing
// @route   DELETE /api/listings/:id
// @access  Public (should be protected in production)
const deleteListing = async (req, res) => {
    try {
        const listing = await Listing.findByIdAndDelete(req.params.id);
        if (listing) {
            res.json({ message: 'Listing deleted' });
        } else {
            res.status(404).json({ message: 'Listing not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getListings,
    getListingById,
    createListing,
    updateListing,
    deleteListing
};
