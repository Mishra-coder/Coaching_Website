import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { contestsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import xpsIcon from '../assets/xps.png';

const ContestResult = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [result, setResult] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [view, setView] = useState('result');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [resultRes, leaderboardRes] = await Promise.all([
                contestsAPI.getMyResult(id),
                contestsAPI.getLeaderboard(id)
            ]);
            setResult(resultRes.result);
            setLeaderboard(leaderboardRes.leaderboard);
        } catch (err) {
            console.error('Failed to load result:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="quiz-container">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="quiz-container">
                <div className="quiz-card">
                    <div className="form-alert">No result found</div>
                    <button onClick={() => navigate('/profile')} className="btn-primary">
                        Back to Profile
                    </button>
                </div>
            </div>
        );
    }

    const myRank = leaderboard.findIndex(entry => entry.userId.toString() === user.id) + 1;
    const percentage = ((result.score / result.totalQuestions) * 100).toFixed(1);

    return (
        <div className="quiz-container">
            <div className="quiz-card">
                <div className="result-header">
                    <h2 className="quiz-title">{result.contest.title}</h2>
                    <div className="result-tabs">
                        <button
                            onClick={() => setView('result')}
                            className={`result-tab ${view === 'result' ? 'active' : ''}`}
                        >
                            My Result
                        </button>
                        <button
                            onClick={() => setView('leaderboard')}
                            className={`result-tab ${view === 'leaderboard' ? 'active' : ''}`}
                        >
                            Leaderboard
                        </button>
                    </div>
                </div>

                {view === 'result' ? (
                    <div className="result-content">
                        <div className="result-score-card">
                            <div className="result-score-circle">
                                <div className="result-score-number">{result.score}</div>
                                <div className="result-score-total">/ {result.totalQuestions}</div>
                            </div>
                            <div className="result-stats">
                                <div className="result-stat-item">
                                    <div className="result-stat-label">Percentage</div>
                                    <div className="result-stat-value">{percentage}%</div>
                                </div>
                                <div className="result-stat-item">
                                    <div className="result-stat-label">XP Earned</div>
                                    <div className="result-stat-value" style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                        <img 
                                            src={xpsIcon} 
                                            alt="XP" 
                                            style={{ width: '24px', height: '24px', objectFit: 'contain' }}
                                        />
                                        {result.xpEarned} XP
                                    </div>
                                </div>
                                <div className="result-stat-item">
                                    <div className="result-stat-label">Your Rank</div>
                                    <div className="result-stat-value">#{myRank}</div>
                                </div>
                            </div>
                        </div>

                        <div className="result-answers">
                            <h3 style={{ marginBottom: '20px', color: '#1a237e' }}>Your Answers</h3>
                            {result.answers.map((answer, index) => {
                                const question = result.contest.questions[index];
                                return (
                                    <div key={index} className={`result-answer-card ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                                        <div className="result-answer-header">
                                            <span className="result-question-number">Q{index + 1}</span>
                                            <span className={`result-answer-badge ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                                                {answer.isCorrect ? (
                                                    <><i className="fas fa-check"></i> Correct (+3 XP)</>
                                                ) : (
                                                    <><i className="fas fa-times"></i> Incorrect</>
                                                )}
                                            </span>
                                        </div>
                                        <div className="result-question-text">{question.question}</div>
                                        <div className="result-answer-details">
                                            <div className="result-answer-row">
                                                <span className="result-answer-label">Your Answer:</span>
                                                <span className={answer.isCorrect ? 'text-success' : 'text-danger'}>
                                                    {answer.selectedAnswer || 'Not answered'}
                                                </span>
                                            </div>
                                            {!answer.isCorrect && (
                                                <div className="result-answer-row">
                                                    <span className="result-answer-label">Correct Answer:</span>
                                                    <span className="text-success">{question.correctAnswer}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <button onClick={() => navigate('/profile')} className="btn-primary" style={{ width: '100%', marginTop: '20px' }}>
                            Back to Profile
                        </button>
                    </div>
                ) : (
                    <div className="leaderboard-content">
                        <div className="leaderboard-header">
                            <h3>Contest Leaderboard</h3>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <img 
                                    src={xpsIcon} 
                                    alt="XP" 
                                    style={{ width: '24px', height: '24px', objectFit: 'contain' }}
                                />
                                <p style={{ margin: 0 }}>
                                    Ranked by XP earned (3 XP per correct answer)
                                </p>
                            </div>
                        </div>

                        <div className="leaderboard-list">
                            {leaderboard.map((entry, index) => {
                                const isCurrentUser = entry.userId.toString() === user.id;
                                return (
                                    <div key={entry.userId} className={`leaderboard-item ${isCurrentUser ? 'current-user' : ''}`}>
                                        <div className="leaderboard-rank">
                                            {entry.rank <= 3 ? (
                                                <span className={`rank-medal rank-${entry.rank}`}>
                                                    {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                                                </span>
                                            ) : (
                                                <span className="rank-number">#{entry.rank}</span>
                                            )}
                                        </div>
                                        <div className="leaderboard-user">
                                            <div className="leaderboard-avatar">
                                                {entry.userName.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="leaderboard-user-info">
                                                <div className="leaderboard-user-name">
                                                    {entry.userName}
                                                    {isCurrentUser && <span className="you-badge">You</span>}
                                                </div>
                                                <div className="leaderboard-user-email">{entry.userEmail}</div>
                                            </div>
                                        </div>
                                        <div className="leaderboard-stats">
                                            <div className="leaderboard-xp">
                                                <img 
                                                    src={xpsIcon} 
                                                    alt="XP" 
                                                    style={{ width: '18px', height: '18px', objectFit: 'contain' }}
                                                />
                                                {entry.xpEarned} XP
                                            </div>
                                            <div className="leaderboard-score">
                                                {entry.score}/{entry.totalQuestions}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {leaderboard.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                                <p>No submissions yet</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContestResult;
