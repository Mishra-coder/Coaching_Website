import express from 'express';
import Question from '../models/Question.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const { class: classLevel, chapter } = req.query;
        let query = { isActive: true };
        if (classLevel) query.class = classLevel;
        if (chapter) query.chapter = chapter;

        const questions = await Question.find(query);
        res.status(200).json({ success: true, count: questions.length, questions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const question = await Question.create(req.body);
        res.status(201).json({ success: true, message: 'Question created', question });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!question) return res.status(404).json({ success: false, message: 'Question not found' });

        res.status(200).json({ success: true, message: 'Question updated', question });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const question = await Question.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
        if (!question) return res.status(404).json({ success: false, message: 'Question not found' });

        res.status(200).json({ success: true, message: 'Question deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
