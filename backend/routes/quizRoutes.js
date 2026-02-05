import express from 'express';
import QuizResult from '../models/QuizResult.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/submit', protect, async (req, res) => {
    try {
        const { className, chapter, score, totalQuestions, percentage } = req.body;

        let record = await QuizResult.findOne({
            user: req.user.id,
            class: className,
            chapter
        });

        if (record) {
            // REVISE MODE: If record exists, do NOT update score/XP.
            // Just return success so user sees their result, but database XP stays same.
            return res.status(200).json({
                success: true,
                message: 'Revision completed. No new XP earned.',
                quizResult: record,
                isRevise: true
            });
        } else {
            record = await QuizResult.create({
                user: req.user.id,
                class: className,
                chapter,
                score,
                totalQuestions,
                percentage
            });
        }

        res.status(201).json({ success: true, message: 'Result saved', quizResult: record });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.get('/history', protect, async (req, res) => {
    try {
        const list = await QuizResult.find({ user: req.user.id }).sort({ date: -1 });
        res.status(200).json({ success: true, count: list.length, history: list });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export default router;