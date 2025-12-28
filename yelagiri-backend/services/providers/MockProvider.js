const PaymentProvider = require('./PaymentProvider');
const crypto = require('crypto');

class MockProvider extends PaymentProvider {
    constructor() {
        super('Mock');
    }

    /**
     * Create a mock payment order
     */
    async createOrder(data) {
        const { amount, receipt } = data;
        
        // Simulate a slight delay
        await new Promise(resolve => setTimeout(resolve, 500));

        return {
            success: true,
            orderId: `mock_order_${Math.random().toString(36).substring(7)}`,
            amount: amount,
            currency: 'INR',
            isRedirect: false, // Mock mode uses a modal on the frontend
            isMockMode: true,
            provider: 'Mock'
        };
    }

    /**
     * Verify a mock signature
     */
    verifySignature(data) {
        // In mock mode, we just check if the signature is 'mock_signature'
        return data.signature === 'mock_signature';
    }

    /**
     * Handle mock webhook (usually not needed for local mock)
     */
    async handleWebhook(payload, signature) {
        return {
            event: 'payment.captured',
            orderId: payload.order_id,
            paymentId: 'mock_payment_' + Date.now(),
            amount: payload.amount,
            status: 'captured',
            raw: payload
        };
    }
}

module.exports = MockProvider;
