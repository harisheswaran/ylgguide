/**
 * Base Payment Provider Class
 * All payment gateways (Razorpay, PhonePe, etc.) must extend this class
 */
class PaymentProvider {
    constructor(name) {
        this.name = name;
    }

    /**
     * Create a payment order/transaction
     * @param {Object} data - Order data
     * @returns {Promise<Object>} Provider specific response
     */
    async createOrder(_data) {
        throw new Error('Method createOrder() must be implemented');
    }

    /**
     * Verify payment signature/checksum
     * @param {Object} data - Verification data
     * @returns {boolean}
     */
    verifySignature(_data) {
        throw new Error('Method verifySignature() must be implemented');
    }

    /**
     * Handle webhook events
     * @param {Object} payload - Raw webhook payload
     * @param {string} signature - Webhook signature
     * @returns {Promise<Object>} Processed event data
     */
    async handleWebhook(_payload, _signature) {
        throw new Error('Method handleWebhook() must be implemented');
    }
}

module.exports = PaymentProvider;
