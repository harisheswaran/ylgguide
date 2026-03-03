const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { Logger } = require('./config/logger');
const requestLogger = require('./middleware/requestLogger');

// Load env vars
dotenv.config({ override: true });

// Connect to database
connectDB();

const app = express();
const logger = Logger('Server');

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5000', 'http://127.0.0.1:5000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'user-email']
}));
app.use(requestLogger); // Log requests
app.use(express.json({ limit: '50mb' })); // Increased for base64 images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/listings', require('./routes/listingRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/invoices', require('./routes/invoiceRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/guides', require('./routes/guideRoutes'));
app.use('/api/transport', require('./routes/transportRoutes'));
app.use('/api/packages', require('./routes/packageRoutes'));
app.use('/api/shop', require('./routes/shopRoutes'));

// Health check route
app.get('/', (req, res) => {
    res.json({ message: 'Yelagiri Guide API is running' });
});

// Error handling middleware
app.use((err, req, res, _next) => {
    logger.error(err.stack); // Use logger
    res.status(500).json({ message: 'Something went wrong!' });
});

const listEndpoints = require('express-list-endpoints');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);

    // Log all registered routes
    try {
        const routeMaps = [
            { prefix: '/api/categories', router: require('./routes/categoryRoutes') },
            { prefix: '/api/listings', router: require('./routes/listingRoutes') },
            { prefix: '/api/bookings', router: require('./routes/bookingRoutes') },
            { prefix: '/api/orders', router: require('./routes/orderRoutes') },
            { prefix: '/api/users', router: require('./routes/userRoutes') },
            { prefix: '/api/auth', router: require('./routes/authRoutes') }
        ];

        logger.info('Registered Routes:');

        // Log root health check
        logger.info('GET /');

        routeMaps.forEach(({ prefix, router }) => {
            const endpoints = listEndpoints(router);
            endpoints.forEach(route => {
                route.methods.forEach(method => {
                    // Ensure path logic handles root slashes correctly if needed, usually listEndpoints returns '/' or '/:id'
                    const fullPath = route.path === '/' ? prefix : `${prefix}${route.path}`;
                    logger.info(`${method} ${fullPath}`);
                });
            });
        });

    } catch (err) {
        logger.error('Failed to list routes: ' + err.message);
    }
});

