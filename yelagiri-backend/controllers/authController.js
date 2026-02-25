const User = require('../models/User');
const crypto = require('crypto');
const whatsappService = require('../services/whatsappService');

const nodemailer = require('nodemailer');

// Configure Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Generate 6-digit numeric OTP for Mobile
const generateNumericOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Generate 3 letters + 3 numbers OTP for Email
const generateEmailOtp = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let otp = '';
    for (let i = 0; i < 3; i++) otp += letters.charAt(Math.floor(Math.random() * letters.length));
    for (let i = 0; i < 3; i++) otp += numbers.charAt(Math.floor(Math.random() * numbers.length));
    return otp;
};

exports.signup = async (req, res) => {
    try {
        const { name, email, password, mobile } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create verification token (legacy)
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

        // Note: Removing mandatory email check for login to allow users to login and verify later from profile
        // if (!user.emailVerified) {
        //     return res.status(401).json({ message: 'Please verify your email first' });
        // }

        // Return user info
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            image: user.image, // Ensure this maps correctly in frontend
            bloodGroup: user.bloodGroup,
            emergencyContact: user.emergencyContact,
            emergencyContactName: user.emergencyContactName,
            emailVerified: user.emailVerified,
            mobileVerified: user.mobileVerified,
            profileCompleted: user.profileCompleted
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

exports.sendEmailOtp = async (req, res) => {
    try {
        const { userId, email } = req.body;
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: 'User not found' });

        const otp = generateEmailOtp();
        user.emailOtp = otp;
        if (email) user.email = email; // Update email if provided
        await user.save();

        // Send Email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Yelagiri Guide - Email Verification OTP',
            text: `Your verification code is: ${otp}`
        };

        // If credentials are mostly placeholders, just log it
        if (!process.env.EMAIL_USER || process.env.EMAIL_USER.includes('example')) {
            console.log(`--- MOCK EMAIL OTP ---`);
            console.log(`To: ${user.email}`);
            console.log(`OTP: ${otp}`);
            console.log(`----------------------`);
            return res.json({ message: 'OTP sent to email (Mock Mode - Check Server Console)' });
        }

        await transporter.sendMail(mailOptions);
        res.json({ message: 'OTP sent to email' });

    } catch (error) {
        console.error('Email Send Error:', error);
        // Fallback to mock for demo purposes if email fails
        console.log(`--- FALLBACK MOCK EMAIL OTP ---`);
        console.log(`OTP: ${req.body.otp || 'GENERATED_ABOVE'}`);
        console.log(`-------------------------------`);
        res.status(500).json({ message: 'Failed to send email, please check server logs for OTP (Dev Mode)' });
    }
};

exports.verifyEmailOtp = async (req, res) => {
    try {
        const { userId, otp } = req.body;
        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!user.emailOtp || user.emailOtp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        user.emailVerified = true;
        user.emailOtp = undefined;

        // Check if profile is completed (both verified)
        if (user.mobileVerified) {
            user.profileCompleted = true;
        }

        await user.save();

        res.json({
            message: 'Email verified successfully',
            emailVerified: true,
            profileCompleted: user.profileCompleted
        });

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

        const otp = generateNumericOtp();
        user.mobileOtp = otp;
        if (mobile) user.mobile = mobile;
        await user.save();

        // Using WhatsApp service as mock SMS as per previous file content
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

        if (!user.mobileOtp || user.mobileOtp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        user.mobileVerified = true;
        user.mobileOtp = undefined;

        // Check if profile is completed (both verified)
        if (user.emailVerified) {
            user.profileCompleted = true;
        }

        await user.save();

        res.json({
            message: 'Mobile verified successfully',
            mobileVerified: true,
            profileCompleted: user.profileCompleted
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
