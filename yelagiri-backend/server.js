const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ override: true });

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5000', 'http://127.0.0.1:5000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'user-email']
}));
app.use((req, res, next) => {
    console.log(`📡 [${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});
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

// Health check route
app.get('/', (req, res) => {
    res.json({ message: 'Yelagiri Guide API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
