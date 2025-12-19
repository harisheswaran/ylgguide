const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Check for custom header used by our frontend
    if (req.headers['user-email']) {
        try {
            // In a real app, we would verify a JWT token here.
            // For this hybrid/mock setup, we will trust the email sent from the client
            // provided it exists in our database (or we can just pass it through if we want to be lenient)

            const email = req.headers['user-email'];

            // Optional: Check if user exists in DB
            // const user = await User.findOne({ email });
            // if (!user) {
            //     return res.status(401).json({ message: 'User not found' });
            // }
            // req.user = user;

            req.user = { email }; // Attach email to request
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no user info' });
    }
};

module.exports = { protect };
