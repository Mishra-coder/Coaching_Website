import express from 'express';
import Enrollment from '../models/Enrollment.js';
import User from '../models/User.js';
import Course from '../models/Course.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();
router.post('/', protect, async (req, res) => {
    try {
        const {
            courseId,
            studentName,
            fatherName,
            motherName,
            dateOfBirth,
            gender,
            address,
            aadharNumber,
            mobileNumber,
            photo
        } = req.body;
        let course = null;
        if (courseId) {
            course = await Course.findById(courseId);
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: 'Course not found'
                });
            }
        }
        const enrollment = await Enrollment.create({
            user: req.user.id,
            course: courseId,
            studentName,
            fatherName,
            motherName,
            dateOfBirth,
            gender,
            address,
            aadharNumber,
            mobileNumber,
            photo
        });
        await User.findByIdAndUpdate(
            req.user.id,
            { $push: { enrollments: enrollment._id } }
        );
        await enrollment.populate('course');
        res.status(201).json({
            success: true,
            message: 'Enrollment created successfully',
            enrollment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
router.get('/', protect, async (req, res) => {
    try {
        const enrollments = await Enrollment.find()
            .populate('user', 'name email')
            .populate('course', 'title price')
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: enrollments.length,
            enrollments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
router.get('/user/:userId', protect, async (req, res) => {
    try {
        if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this resource'
            });
        }
        const enrollments = await Enrollment.find({ user: req.params.userId })
            .populate('course')
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: enrollments.length,
            enrollments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
router.get('/:id', protect, async (req, res) => {
    try {
        const enrollment = await Enrollment.findById(req.params.id)
            .populate('user', 'name email phone')
            .populate('course');
        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: 'Enrollment not found'
            });
        }
        if (enrollment.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this resource'
            });
        }
        res.status(200).json({
            success: true,
            enrollment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
router.put('/:id/status', protect, async (req, res) => {
    try {
        const { status } = req.body;
        const enrollment = await Enrollment.findById(req.params.id);
        if (!enrollment) {
            return res.status(404).json({
                success: false,
                message: 'Enrollment not found'
            });
        }
        enrollment.status = status;
        await enrollment.save();
        res.status(200).json({
            success: true,
            message: 'Enrollment status updated',
            enrollment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
export default router;