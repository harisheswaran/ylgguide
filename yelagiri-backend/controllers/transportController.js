const Transport = require('../models/Transport');
const externalService = require('../services/externalTransportService');
const fs = require('fs');
const csv = require('csv-parser');

/**
 * @desc    Get all transport options with advanced filtering
 * @route   GET /api/transport
 * @access  Public
 */
const getTransports = async (req, res) => {
    try {
        const { 
            category, 
            type, // vehicleType
            minPrice, 
            maxPrice, 
            isAC, 
            rating,
            search,
            page = 1,
            limit = 10
        } = req.query;
        
        let query = {};

        // Category Filter
        if (category && category !== 'All') {
            query.category = category;
        } else if (req.query.excludeCategory) {
            query.category = { $ne: req.query.excludeCategory };
        }

        // Vehicle Type Filter
        if (type) {
            query.vehicleType = new RegExp(type, 'i');
        }

        // Price Range Filter
        if (minPrice || maxPrice) {
            query['pricingDetails.amount'] = {};
            if (minPrice) query['pricingDetails.amount'].$gte = Number(minPrice);
            if (maxPrice) query['pricingDetails.amount'].$lte = Number(maxPrice);
        }

        // Feature Filters
        if (isAC === 'true') {
            query['vehicleFeatures.isAC'] = true;
        }
        if (req.query.wifi === 'true') {
            query['vehicleFeatures.wifi'] = true;
        }
        if (req.query.gps === 'true') {
            query['vehicleFeatures.gps'] = true;
        }

        // Rating Filter
        if (rating) {
            query['ratings.overall'] = { $gte: Number(rating) };
        }

        // Capacity Filter
        if (req.query.capacity) {
            query.capacity = { $gte: Number(req.query.capacity) };
        }

        // Search (Name, Route, Stops, Address)
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [
                { name: searchRegex },
                { 'route.from': searchRegex },
                { 'route.to': searchRegex },
                { 'route.stops': searchRegex },
                { 'locationDetails.address': searchRegex }
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const total = await Transport.countDocuments(query);
        let transports = await Transport.find(query)
            .sort({ 'ratings.overall': -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Note: Skipping external service logic for now to ensure pagination works on DB records
        // Re-integrate if needed after base functionality is stable

        res.json({
            success: true,
            count: transports.length,
            total,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
            },
            data: transports
        });
    } catch (error) {
        console.error('Error fetching transport data:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Add new transport service
 * @route   POST /api/transport
 * @access  Private/Admin
 */
const addTransport = async (req, res) => {
    try {
        const transport = await Transport.create(req.body);
        res.status(201).json({
            success: true,
            data: transport
        });
    } catch (error) {
        console.error('Error adding transport:', error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * @desc    Upload Transport CSV (Internal/Admin)
 * @route   POST /api/transport/upload
 */
const uploadTransportCSV = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Please upload a CSV file' });
    }

    const results = [];
    const filePath = req.file.path;

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            try {
                // Map CSV fields to Transport Schema
                const mappedData = results.map(row => ({
                    name: row.name,
                    category: row.category,
                    vehicleType: row.vehicleType,
                    price: {
                        amount: Number(row.priceAmount),
                        unit: row.priceUnit
                    },
                    operator: {
                        name: row.operatorName,
                        contact: row.contact,
                        verified: row.verified === 'true'
                    },
                    availability: {
                        status: row.status || 'Available'
                    }
                }));

                await Transport.insertMany(mappedData);
                
                // Clean up file
                fs.unlinkSync(filePath);

                res.status(200).json({
                    success: true,
                    message: `Successfully imported ${mappedData.length} records`,
                    count: mappedData.length
                });
            } catch (error) {
                console.error('CSV Import Error:', error);
                res.status(500).json({ success: false, message: 'Error saving CSV data to database' });
            }
        });
};

module.exports = {
    getTransports,
    addTransport,
    uploadTransportCSV
};
