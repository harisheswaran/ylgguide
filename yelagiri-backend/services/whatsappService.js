const sendWhatsAppMessage = async (to, message) => {
    // In a real application, this would use the WhatsApp Business API (e.g., via Twilio or Meta)
    // For this demo, we will log the message to the console.

    console.log('--- WHATSAPP NOTIFICATION ---');
    console.log(`To: ${to}`);
    console.log(`Message: ${message}`);
    console.log('-----------------------------');

    return true;
};

module.exports = {
    sendBookingConfirmation: async (user, booking) => {
        const message = `Hello ${user.name}, your booking at ${booking.hotelName} is confirmed! Check-in: ${booking.checkIn}, Check-out: ${booking.checkOut}.`;
        return sendWhatsAppMessage(user.mobile, message);
    },

    sendOrderConfirmation: async (user, order) => {
        const message = `Hello ${user.name}, your order #${order._id} for ₹${order.total} has been received and is being prepared.`;
        return sendWhatsAppMessage(user.mobile, message);
    },

    sendOtp: async (mobile, otp) => {
        const message = `Your Yelagiri Guide verification code is: ${otp}`;
        return sendWhatsAppMessage(mobile, message);
    }
};
