const nodemailer = require('nodemailer');

// Export a function to get the transporter (handles async Ethereal setup)
let transporterPromise;

const getTransporter = async () => {
    if (transporterPromise) return transporterPromise;

    transporterPromise = (async () => {
        // Check if real credentials exist
        if (process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your-email@gmail.com' && process.env.EMAIL_PASSWORD) {
            console.log('📧 Using REAL email configuration (Gmail/SMTP)');
            return nodemailer.createTransport({
                host: process.env.EMAIL_HOST || 'smtp.gmail.com',
                port: parseInt(process.env.EMAIL_PORT) || 587,
                secure: process.env.EMAIL_SECURE === 'true',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD
                }
            });
        }

        // Fallback: Automatic Ethereal account for testing
        console.log('🧪 No email credentials found. Generating a MOCK test account (Ethereal)...');
        const testAccount = await nodemailer.createTestAccount();
        console.log('✅ Mock email account ready!');
        console.log('- User:', testAccount.user);
        console.log('- Pass:', testAccount.pass);
        console.log('💡 Note: Emails sent this way won\'t land in real inboxes but you\'ll get a "Preview URL" in these logs.');

        return nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });
    })();

    return transporterPromise;
};

module.exports = { getTransporter };
