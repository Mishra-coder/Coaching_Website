import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

router.post('/register', async (req, res) => {
    try {
        console.log('Register request received:', req.body.email);
        const { name, email, password, phone } = req.body;

        if (await User.findOne({ email })) {
            console.warn('Register failed: Email already exists', email);
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        const user = await User.create({ name, email, password, phone });
        console.log('User created successfully:', user._id);
        const token = signToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/admin-register', async (req, res) => {
    try {
        const { email, password, secretKey } = req.body;

        if (await User.findOne({ email })) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        const user = await User.create({
            name: 'Admin',
            email,
            password,
            role: 'admin',
            phone: 'N/A'
        });
        const token = signToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        console.log('Login attempt:', req.body.email);
        const { email, password, secretKey } = req.body;

        if (!email || !password) {
            console.warn('Login failed: Missing credentials');
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.comparePassword(password))) {
            console.warn('Login failed: Invalid credentials for', email);
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        if (secretKey === 'admin123' && user.role !== 'admin') {
            console.log('Auto-promoting user to admin:', email);
            user.role = 'admin';
            await user.save();
        }

        if (user.role === 'admin' && secretKey !== 'admin123') {
            console.warn('Login failed: Invalid admin key for', email);
            return res.status(401).json({ success: false, message: 'Invalid admin secret key' });
        }

        console.log('Login successful for:', user.email);
        const token = signToken(user._id);

        res.status(200).json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('enrollments');
        res.status(200).json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.put('/profile', protect, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { name: req.body.name, phone: req.body.phone, address: req.body.address } },
            { new: true, runValidators: true }
        );
        res.status(200).json({ success: true, message: 'Profile updated', user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get('/all-students', protect, authorize('admin'), async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).select('-password').sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: students.length, students });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;