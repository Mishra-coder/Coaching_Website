import express from 'express';
import Question from '../models/Question.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all active questions (Public or Student)
// @route   GET /api/questions
router.get('/', async (req, res) => {
    try {
        const { class: classLevel, chapter } = req.query;
        let query = { isActive: true };
        if (classLevel) query.class = classLevel;
        if (chapter) query.chapter = chapter;

        const questions = await Question.find(query);
        res.status(200).json({
            success: true,
            count: questions.length,
            questions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @desc    Create a new question (Admin only)
// @route   POST /api/questions
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const question = await Question.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Question created successfully',
            question
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @desc    Update a question (Admin only)
// @route   PUT /api/questions/:id
router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const question = await Question.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Question updated successfully',
            question
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @desc    Delete a question (Admin only - Soft delete)
// @route   DELETE /api/questions/:id
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const question = await Question.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );
        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Question deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;
