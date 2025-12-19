const User = require('../models/User');
const crypto = require('crypto');
const whatsappService = require('../services/whatsappService');

// Generate random OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.signup = async (req, res) => {
    try {
        const { name, email, password, mobile } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create verification token
        const verificationToken = crypto.randomBytes(20).toString('hex');

        user = await User.create({
            name,
            email,
            password, // In real app, hash this!
            mobile,
            verificationToken,
            emailVerified: false
        });

        // Mock sending email
        console.log(`--- EMAIL VERIFICATION ---`);
        console.log(`To: ${email}`);
        console.log(`Link: http://localhost:5000/api/auth/verify-email/${verificationToken}`);
        console.log(`--------------------------`);

        res.status(201).json({
            message: 'User created. Please verify your email.',
            userId: user._id
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Simple password check (should be hashed in production)
        if (user.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.emailVerified) {
            return res.status(401).json({ message: 'Please verify your email first' });
        }

        // Return user info (no token for this simple implementation, relying on client storage/headers)
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            image: user.image,
            emailVerified: user.emailVerified,
            mobileVerified: user.mobileVerified
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(400).json({ message: 'Invalid token' });
        }

        user.emailVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.send('Email verified successfully! You can now login.');

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.sendMobileOtp = async (req, res) => {
    try {
        const { userId, mobile } = req.body;
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: 'User not found' });

        const otp = generateOtp();
        user.mobileOtp = otp;
        user.mobile = mobile; // Update mobile if provided
        await user.save();

        await whatsappService.sendOtp(user.mobile, otp);

        res.json({ message: 'OTP sent to mobile' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.verifyMobileOtp = async (req, res) => {
    try {
        const { userId, otp } = req.body;
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.mobileOtp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        user.mobileVerified = true;
        user.mobileOtp = undefined;
        await user.save();

        res.json({ message: 'Mobile verified successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
