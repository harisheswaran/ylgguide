const crypto = require('crypto');

/**
 * Mock Payment Service - Simulates Razorpay for testing without credentials
 * This allows full testing of the booking flow without needing a real payment gateway
 */

/**
 * Create a mock payment order (simulates Razorpay order creation)
 */
async function createMockPaymentOrder(orderData) {
    const { amount, currency = 'INR', receipt, notes = {} } = orderData;
    
    // Generate a fake order ID
    const orderId = `order_mock_${crypto.randomBytes(10).toString('hex')}`;
    
    console.log('🎭 MOCK PAYMENT: Creating order', { orderId, amount, currency });
    
    return {
        id: orderId,
        entity: 'order',
        amount: Math.round(amount * 100), // Convert to paise
        amount_paid: 0,
        amount_due: Math.round(amount * 100),
        currency,
        receipt,
        status: 'created',
        attempts: 0,
        notes,
        created_at: Math.floor(Date.now() / 1000)
    };
}

/**
 * Verify mock payment signature (always returns true for testing)
 */
function verifyMockPaymentSignature(orderId, paymentId, signature) {
    console.log('🎭 MOCK PAYMENT: Verifying signature', { orderId, paymentId });
    // In mock mode, always return true
    return true;
}

/**
 * Simulate fetching payment details
 */
async function getMockPaymentDetails(paymentId) {
    console.log('🎭 MOCK PAYMENT: Fetching payment details', { paymentId });
    
    return {
        id: paymentId,
        entity: 'payment',
        amount: 1416000, // Mock amount in paise
        currency: 'INR',
        status: 'captured',
        method: 'card',
        captured: true,
        card: {
            last4: '1111',
            network: 'Visa',
            type: 'credit'
        },
        created_at: Math.floor(Date.now() / 1000)
    };
}

/**
 * Check if we're in mock mode
 */
function isMockMode() {
    // If user explicitly wants real payments, bypass mock mode
    if (process.env.FORCE_REAL_PAYMENTS === 'true') {
        return false;
    }

    const gateway = (process.env.PAYMENT_GATEWAY || 'RAZORPAY').toUpperCase();

    if (gateway === 'PHONEPE') {
        // PhonePe requires Merchant ID and Salt Key
        const hasPhonePeKeys = process.env.PHONEPE_MERCHANT_ID && 
                              process.env.PHONEPE_SALT_KEY && 
                              !process.env.PHONEPE_MERCHANT_ID.includes('xxxx');
        return !hasPhonePeKeys;
    } else {
        // Razorpay requires Key ID and Key Secret
        const hasRazorpayKeys = process.env.RAZORPAY_KEY_ID && 
                               process.env.RAZORPAY_KEY_SECRET && 
                               !process.env.RAZORPAY_KEY_ID.includes('xxxx');
        return !hasRazorpayKeys;
    }
}

module.exports = {
    createMockPaymentOrder,
    verifyMockPaymentSignature,
    getMockPaymentDetails,
    isMockMode
};
