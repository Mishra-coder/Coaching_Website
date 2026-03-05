import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { contestsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ContestQuiz = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [contest, setContest] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadContest();
    }, [id]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && contest) {
            handleSubmit();
        }
    }, [timeLeft]);

    const loadContest = async () => {
        try {
            setLoading(true);
            const res = await contestsAPI.getById(id);
            const contestData = res.contest;
            
            const now = new Date();
            const endTime = new Date(contestData.endTime || new Date(contestData.startTime).getTime() + contestData.duration * 60000);
            
            if (now > endTime) {
                setError('This contest has ended. You can view the leaderboard.');
                setLoading(false);
                setTimeout(() => navigate(`/contest/${id}/result`), 2000);
                return;
            }
            
            setContest(contestData);
            setAnswers(new Array(contestData.questions.length).fill({ selectedAnswer: '' }));
            setTimeLeft(contestData.duration * 60);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load contest');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (answer) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = { selectedAnswer: answer };
        setAnswers(newAnswers);
    };

    const handleSubmit = async () => {
        if (submitting) return;
        
        try {
            setSubmitting(true);
            await contestsAPI.submit(id, answers);
            navigate(`/contest/${id}/result`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit contest');
            setSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="quiz-container">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="quiz-container">
                <div className="quiz-card">
                    <div className="form-alert">{error}</div>
                    <button onClick={() => navigate('/profile')} className="btn-primary">
                        Back to Profile
                    </button>
                </div>
            </div>
        );
    }

    if (!contest) return null;

    const question = contest.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / contest.questions.length) * 100;

    return (
        <div className="quiz-container">
            <div className="quiz-card">
                <div className="quiz-header">
                    <div className="quiz-header-left">
                        <h2 className="quiz-title">{contest.title}</h2>
                        <div className="quiz-progress-text">
                            Question {currentQuestion + 1} of {contest.questions.length}
                        </div>
                    </div>
                    <div className="quiz-timer" style={{ color: timeLeft < 60 ? '#ef4444' : '#1a237e' }}>
                        <i className="fas fa-clock"></i> {formatTime(timeLeft)}
                    </div>
                </div>

                <div className="quiz-progress-bar">
                    <div className="quiz-progress-fill" style={{ width: `${progress}%` }}></div>
                </div>

                <div className="quiz-question-section">
                    <h3 className="quiz-question-text">{question.question}</h3>
                    
                    <div className="quiz-options">
                        {question.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(option)}
                                className={`quiz-option ${answers[currentQuestion]?.selectedAnswer === option ? 'selected' : ''}`}
                            >
                                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                                <span className="option-text">{option}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="quiz-navigation">
                    <button
                        onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                        disabled={currentQuestion === 0}
                        className="btn-secondary"
                    >
                        <i className="fas fa-arrow-left"></i> Previous
                    </button>

                    {currentQuestion === contest.questions.length - 1 ? (
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="btn-primary"
                        >
                            {submitting ? 'Submitting...' : 'Submit Contest'}
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentQuestion(Math.min(contest.questions.length - 1, currentQuestion + 1))}
                            className="btn-primary"
                        >
                            Next <i className="fas fa-arrow-right"></i>
                        </button>
                    )}
                </div>

                <div className="quiz-question-grid">
                    {contest.questions.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentQuestion(index)}
                            className={`quiz-question-number ${currentQuestion === index ? 'active' : ''} ${answers[index]?.selectedAnswer ? 'answered' : ''}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ContestQuiz;
