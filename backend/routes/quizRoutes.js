import express from 'express';
import QuizResult from '../models/QuizResult.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/submit', protect, async (req, res) => {
    try {
        const { className, chapter, score, totalQuestions, percentage } = req.body;

        let quizResult = await QuizResult.findOne({
            user: req.user.id,
            class: className,
            chapter
        });

        if (quizResult) {
            if (score > quizResult.score) {
                quizResult.score = score;
                quizResult.totalQuestions = totalQuestions;
                quizResult.percentage = percentage;
                await quizResult.save();
            }
        } else {
            quizResult = await QuizResult.create({
                user: req.user.id,
                class: className,
                chapter,
                score,
                totalQuestions,
                percentage
            });
        }

        res.status(201).json({
            success: true,
            message: 'Quiz result saved successfully',
            quizResult
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.get('/history', protect, async (req, res) => {
    try {
        const history = await QuizResult.find({ user: req.user.id })
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: history.length,
            history
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;
