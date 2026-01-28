import express from 'express';
import Enrollment from '../models/Enrollment.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, async (req, res) => {
    try {
        const { courseId, ...enrollmentData } = req.body;

        if (courseId) {
            const course = await Course.findById(courseId);
            if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
        }

        const enrollment = await Enrollment.create({
            user: req.user.id,
            course: courseId,
            ...enrollmentData
        });

        await User.findByIdAndUpdate(req.user.id, { $push: { enrollments: enrollment._id } });
        await enrollment.populate('course');

        res.status(201).json({ success: true, message: 'Enrollment submitted', enrollment });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.put('/:id', protect, async (req, res) => {
    try {
        const enrollment = await Enrollment.findById(req.params.id);
        if (!enrollment) return res.status(404).json({ success: false, message: 'Not found' });

        if (enrollment.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const data = { ...req.body, status: 'pending', adminRemarks: '' };
        const updated = await Enrollment.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });

        res.status(200).json({ success: true, message: 'Enrollment resubmitted', enrollment: updated });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get('/', protect, async (req, res) => {
    try {
        const list = await Enrollment.find()
            .populate('user', 'name email')
            .populate('course', 'title price')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: list.length, enrollments: list });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get('/user/:userId', protect, async (req, res) => {
    try {
        if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        const list = await Enrollment.find({ user: req.params.userId })
            .populate('course')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: list.length, enrollments: list });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get('/:id', protect, async (req, res) => {
    try {
        const record = await Enrollment.findById(req.params.id)
            .populate('user', 'name email phone')
            .populate('course');

        if (!record) return res.status(404).json({ success: false, message: 'Not found' });

        if (record.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        res.status(200).json({ success: true, enrollment: record });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.put('/:id/status', protect, async (req, res) => {
    try {
        const { status, adminRemarks } = req.body;
        const record = await Enrollment.findById(req.params.id);

        if (!record) return res.status(404).json({ success: false, message: 'Not found' });

        record.status = status;
        if (adminRemarks !== undefined) record.adminRemarks = adminRemarks;

        await record.save();
        res.status(200).json({ success: true, message: 'Status updated', enrollment: record });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;