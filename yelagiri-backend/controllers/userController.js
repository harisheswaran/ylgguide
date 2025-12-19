const User = require('../models/User');

exports.getProfile = async (req, res) => {
    try {
        // Assume user email is passed in header from auth middleware
        const email = req.headers['user-email'];
        if (!email) return res.status(401).json({ message: 'Not authorized' });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, email, image, bloodGroup, emergencyContact, mobile } = req.body;

        // Use email from body or header to find user
        const targetEmail = email || req.headers['user-email'];

        let user = await User.findOne({ email: targetEmail });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = name || user.name;
        user.image = image || user.image;
        user.bloodGroup = bloodGroup || user.bloodGroup;
        user.emergencyContact = emergencyContact || user.emergencyContact;
        user.mobile = mobile || user.mobile;

        await user.save();

        res.status(200).json(user);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
