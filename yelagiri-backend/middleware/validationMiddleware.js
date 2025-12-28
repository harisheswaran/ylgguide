const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

/**
 * Validation rules for creating a booking
 */
const validateCreateBooking = [
    body('guestName')
        .trim()
        .notEmpty().withMessage('Guest name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Guest name must be between 2 and 100 characters'),
    
    body('guestEmail')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),
    
    body('guestPhone')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
        .withMessage('Please provide a valid phone number'),
    
    body('packageName')
        .trim()
        .notEmpty().withMessage('Package name is required')
        .isLength({ min: 2, max: 200 }).withMessage('Package name must be between 2 and 200 characters'),
    
    body('checkIn')
        .notEmpty().withMessage('Check-in date is required')
        .isISO8601().withMessage('Check-in must be a valid date')
        .custom((value) => {
            const checkInDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (checkInDate < today) {
                throw new Error('Check-in date cannot be in the past');
            }
            return true;
        }),
    
    body('checkOut')
        .notEmpty().withMessage('Check-out date is required')
        .isISO8601().withMessage('Check-out must be a valid date')
        .custom((value, { req }) => {
            const checkInDate = new Date(req.body.checkIn);
            const checkOutDate = new Date(value);
            if (checkOutDate <= checkInDate) {
                throw new Error('Check-out date must be after check-in date');
            }
            return true;
        }),
    
    body('guests')
        .notEmpty().withMessage('Number of guests is required')
        .isInt({ min: 1, max: 50 }).withMessage('Number of guests must be between 1 and 50'),
    
    body('baseAmount')
        .notEmpty().withMessage('Base amount is required')
        .isFloat({ min: 1 }).withMessage('Base amount must be greater than 0'),
    
    handleValidationErrors
];

/**
 * Validation rules for verifying payment
 */
const validateVerifyPayment = [
    body('order_id')
        .trim()
        .notEmpty().withMessage('Order ID is required'),
    
    body('payment_id')
        .trim()
        .notEmpty().withMessage('Payment ID is required'),
    
    body('signature')
        .trim()
        .notEmpty().withMessage('Signature is required'),
    
    body('bookingId')
        .trim()
        .notEmpty().withMessage('Booking ID is required')
        .isMongoId().withMessage('Invalid booking ID'),
    
    handleValidationErrors
];

/**
 * Validation rules for MongoDB ObjectId params
 */
const validateMongoId = [
    param('id')
        .isMongoId().withMessage('Invalid ID format'),
    
    handleValidationErrors
];

/**
 * Validation rules for email param
 */
const validateEmail = [
    param('email')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    
    handleValidationErrors
];

/**
 * Validation rules for pagination
 */
const validatePagination = [
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    
    handleValidationErrors
];

module.exports = {
    validateCreateBooking,
    validateVerifyPayment,
    validateMongoId,
    validateEmail,
    validatePagination,
    handleValidationErrors
};
