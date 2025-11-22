import express from 'express';
import QuizResult from '../models/QuizResult.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/quiz/submit
// @desc    Save quiz result
// @access  Private
router.post('/submit', protect, async (req, res) => {
    try {
        const { className, chapter, score, totalQuestions, percentage } = req.body;

        // Check if quiz result already exists for this user, class, and chapter
        let quizResult = await QuizResult.findOne({
            user: req.user.id,
            class: className,
            chapter
        });

        if (quizResult) {
            // If result exists, update only if new score is higher
            if (score > quizResult.score) {
                quizResult.score = score;
                quizResult.totalQuestions = totalQuestions;
                quizResult.percentage = percentage;
                await quizResult.save();
            }
            // If new score is lower or equal, keep the old (higher) score
            // We still return success so the frontend shows the result page
        } else {
            // Create new result
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

// @route   GET /api/quiz/history
// @desc    Get quiz history for current user
// @access  Private
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
