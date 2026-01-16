const Package = require('../models/Package');

// @desc    Get all packages
// @route   GET /api/packages
// @access  Public
const getPackages = async (req, res) => {
    try {
        const { type, duration, minPrice, maxPrice, rating, stars, amenities, sort } = req.query;
        let query = {};

        if (type && type !== 'All') {
            query.type = { $regex: type, $options: 'i' };
        }

        if (duration && duration !== 'All') {
            query.duration = { $regex: duration, $options: 'i' };
        }

        if (rating) {
            query.rating = { $gte: Number(rating) };
        }

        if (stars) {
            const starsList = typeof stars === 'string' ? stars.split(',').map(Number) : [Number(stars)];
            query.stars = { $middle: starsList }; // Simplified, actually depends on how frontend sends it
            // Better:
            if (Array.isArray(starsList)) query.stars = { $in: starsList };
        }

        if (amenities) {
            const amenList = typeof amenities === 'string' ? amenities.split(',') : amenities;
            query.amenities = { $all: amenList };
        }

        // Sorting
        let sortOptions = {};
        if (sort === 'Price: Low to High') sortOptions.priceNum = 1;
        if (sort === 'Price: High to Low') sortOptions.priceNum = -1;
        if (sort === 'Highest Rated') sortOptions.rating = -1;

        const packages = await Package.find(query).sort(sortOptions);
        
        // Manual price sorting helper if stored as string
        // (In a real app, price would be a number)
        
        res.json({
            success: true,
            count: packages.length,
            data: packages
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single package
// @route   GET /api/packages/:id
// @access  Public
const getPackageById = async (req, res) => {
    try {
        const pkg = await Package.findById(req.params.id);
        if (pkg) {
            res.json({ success: true, data: pkg });
        } else {
            res.status(404).json({ success: false, message: 'Package not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getPackages,
    getPackageById
};
