const Guide = require('../models/Guide');

// Get all guides with filters
exports.getGuides = async (req, res) => {
    try {
        const { 
            search, 
            expertise, 
            languages, 
            maxPrice, 
            minRating,
            lat,
            lng,
            radius = 10000 // default 10km
        } = req.query;

        let query = {};

        if (search) {
            query.$text = { $search: search };
        }

        if (expertise) {
            query.expertise = { $in: expertise.split(',') };
        }

        if (languages) {
            query.languages = { $in: languages.split(',') };
        }

        if (maxPrice) {
            query.pricePerHour = { $lte: parseInt(maxPrice) };
        }

        if (minRating) {
            query.rating = { $gte: parseFloat(minRating) };
        }

        if (lat && lng) {
            query.location = {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: parseInt(radius)
                }
            };
        }

        const guides = await Guide.find(query).sort({ rating: -1 });
        res.status(200).json({
            success: true,
            count: guides.length,
            guides
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching guides',
            error: error.message
        });
    }
};

// Get single guide
exports.getGuide = async (req, res) => {
    try {
        const guide = await Guide.findById(req.params.id);
        if (!guide) {
            return res.status(404).json({
                success: false,
                message: 'Guide not found'
            });
        }
        res.status(200).json({
            success: true,
            guide
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching guide',
            error: error.message
        });
    }
};

// Create guide (Admin only - for simplicity let's just create it)
exports.createGuide = async (req, res) => {
    try {
        const guide = await Guide.create(req.body);
        res.status(201).json({
            success: true,
            guide
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating guide',
            error: error.message
        });
    }
};

// Update guide
exports.updateGuide = async (req, res) => {
    try {
        const guide = await Guide.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!guide) {
            return res.status(404).json({
                success: false,
                message: 'Guide not found'
            });
        }
        res.status(200).json({
            success: true,
            guide
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating guide',
            error: error.message
        });
    }
};

// Delete guide
exports.deleteGuide = async (req, res) => {
    try {
        const guide = await Guide.findByIdAndDelete(req.params.id);
        if (!guide) {
            return res.status(404).json({
                success: false,
                message: 'Guide not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Guide deleted'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting guide',
            error: error.message
        });
    }
};
