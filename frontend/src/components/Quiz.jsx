import React, { useState, useEffect } from 'react';
import { questionsAPI, quizAPI } from '../services/api';

const Quiz = () => {
    const [view, setView] = useState('class-select');
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [userAnswers, setUserAnswers] = useState({});
    const [showWarning, setShowWarning] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleClassSelect = async (cls) => {
        setSelectedClass(cls);
        setLoading(true);
        try {
            const res = await questionsAPI.getAll({ class: cls });
            // Extract unique chapters with normalized names and counts
            const chapterCounts = res.questions.reduce((acc, q) => {
                const name = q.chapter.trim();
                acc[name] = (acc[name] || 0) + 1;
                return acc;
            }, {});

            const chaptersWithCounts = Object.entries(chapterCounts).map(([name, count]) => ({
                name,
                count
            }));

            setChapters(chaptersWithCounts);
            setView('chapter-select');
        } catch (error) {
            console.error('Error fetching chapters:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChapterSelect = async (chapter) => {
        setSelectedChapter(chapter);
        setLoading(true);
        try {
            const res = await questionsAPI.getAll({ class: selectedClass, chapter });
            setQuestions(res.questions);
            setUserAnswers({});
            setCurrentQuestionIndex(0);
            setShowWarning(false);
            setView('quiz');
        } catch (error) {
            console.error('Error fetching questions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (questionId, option) => {
        setUserAnswers(prev => ({
            ...prev,
            [questionId]: option
        }));
        if (showWarning) setShowWarning(false);
    };

    const handleNextQuestion = () => {
        if (!userAnswers[questions[currentQuestionIndex]._id]) {
            setShowWarning(true);
            return;
        }

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setShowWarning(false);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setShowWarning(false);
        }
    };

    const handleSubmit = async () => {
        if (Object.keys(userAnswers).length < questions.length) {
            setShowWarning(true);
            return;
        }

        const { correct, total, percentage } = calculateScore();
        try {
            await quizAPI.submit({
                className: selectedClass,
                chapter: selectedChapter,
                score: correct,
                totalQuestions: total,
                percentage
            });
            window.dispatchEvent(new Event('quizCompleted'));
        } catch (error) {
            console.error('Failed to save quiz result:', error);
        }
        setView('result');
        window.scrollTo(0, 0);
    };

    const calculateScore = () => {
        let correct = 0;
        questions.forEach(q => {
            if (userAnswers[q._id] === q.correctAnswer) {
                correct++;
            }
        });
        return {
            correct,
            total: questions.length,
            percentage: Math.round((correct / questions.length) * 100)
        };
    };

    const handleRestart = () => {
        setUserAnswers({});
        setShowWarning(false);
        setCurrentQuestionIndex(0);
        setView('quiz');
    };

    const handleGoHome = () => {
        setSelectedClass(null);
        setSelectedChapter(null);
        setQuestions([]);
        setUserAnswers({});
        setShowWarning(false);
        setCurrentQuestionIndex(0);
        setView('class-select');
    };
    const renderClassSelection = () => {
        const classCardStyle = {
            background: '#fff',
            padding: '40px',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
            cursor: 'pointer',
            textAlign: 'center',
            width: '300px',
            border: '2px solid transparent',
            transition: 'all 0.3s ease'
        };
        return (
            <div className="class-selection" style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
                {['10', '12'].map(cls => (
                    <div
                        key={cls}
                        onClick={() => handleClassSelect(cls)}
                        className="class-card"
                        style={classCardStyle}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.borderColor = '#1a237e';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.borderColor = 'transparent';
                        }}
                    >
                        <h3 style={{ fontSize: '2rem', color: '#1a237e', marginBottom: '10px' }}>
                            Class {cls}
                        </h3>
                        <p style={{ color: '#666' }}>Mathematics</p>
                        <div style={{ marginTop: '20px', color: '#ffab00', fontWeight: 'bold' }}>
                            Start Practice →
                        </div>
                    </div>
                ))}
            </div>
        );
    };
    const renderChapterSelection = () => {
        if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading chapters...</div>;

        return (
            <div className="chapter-selection">
                <button
                    onClick={() => setView('class-select')}
                    style={{ marginBottom: '20px', background: 'none', border: 'none', color: '#1a237e', cursor: 'pointer' }}
                >
                    ← Back to Class Selection
                </button>
                <h3 style={{ marginBottom: '30px', color: '#333' }}>Select a Chapter</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                    {chapters.map(chapter => (
                        <div
                            key={chapter.name}
                            onClick={() => handleChapterSelect(chapter.name)}
                            style={{
                                background: '#fff',
                                padding: '25px',
                                borderRadius: '15px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                border: '1px solid #e2e8f0',
                                position: 'relative',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#1a237e'}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                        >
                            <h5 style={{ margin: 0, color: '#1e293b', fontSize: '1.1rem' }}>{chapter.name}</h5>
                            <span style={{
                                background: '#e0e7ff',
                                color: '#4338ca',
                                padding: '4px 10px',
                                borderRadius: '12px',
                                fontSize: '0.85rem',
                                fontWeight: '700'
                            }}>
                                {chapter.count} Qs
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };
    const renderQuiz = () => {
        if (!questions || questions.length === 0) {
            return (
                <div style={{
                    textAlign: 'center',
                    padding: '50px',
                    background: '#fff',
                    borderRadius: '15px'
                }}>
                    <h3>Questions coming soon!</h3>
                    <p>We are currently updating this chapter.</p>
                    <button
                        onClick={() => setView('chapter-select')}
                        className="btn-primary"
                        style={{ marginTop: '20px' }}
                    >
                        Back to Chapters
                    </button>
                </div>
            );
        }
        const currentQuestion = questions[currentQuestionIndex];
        const isLastQuestion = currentQuestionIndex === questions.length - 1;
        return (
            <div className="quiz-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <div>
                        <h4 style={{ margin: 0, color: '#1a237e' }}>{selectedChapter}</h4>
                        <small style={{ color: '#64748b' }}>Class {selectedClass}th</small>
                    </div>
                    <div style={{ background: '#e3f2fd', padding: '8px 16px', borderRadius: '20px', color: '#1565c0', fontWeight: '600' }}>
                        Question {currentQuestionIndex + 1} / {questions.length}
                    </div>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '10px', marginBottom: '40px' }}>
                    <div style={{
                        width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                        height: '100%',
                        background: '#1a237e',
                        borderRadius: '10px',
                        transition: 'width 0.3s ease'
                    }}></div>
                </div>
                <div style={{
                    background: '#fff',
                    padding: '40px',
                    borderRadius: '20px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    marginBottom: '30px'
                }}>
                    <h4 style={{ marginBottom: '25px', color: '#333', fontSize: '1.25rem', lineHeight: '1.6' }}>
                        {currentQuestion.question}
                    </h4>
                    <div style={{ display: 'grid', gap: '15px' }}>
                        {currentQuestion.options.map(option => (
                            <div
                                key={option}
                                onClick={() => handleAnswerSelect(currentQuestion._id, option)}
                                style={{
                                    padding: '15px 20px',
                                    borderRadius: '12px',
                                    border: `2px solid ${userAnswers[currentQuestion._id] === option ? '#1a237e' : '#e2e8f0'}`,
                                    background: userAnswers[currentQuestion._id] === option ? '#e8eaf6' : '#fff',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    border: `2px solid ${userAnswers[currentQuestion._id] === option ? '#1a237e' : '#cbd5e1'}`,
                                    marginRight: '15px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {userAnswers[currentQuestion._id] === option && (
                                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#1a237e' }}></div>
                                    )}
                                </div>
                                <span style={{ color: userAnswers[currentQuestion._id] === option ? '#1a237e' : '#475569', fontWeight: '500' }}>
                                    {option}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                {showWarning && (
                    <div className="alert alert-warning" style={{
                        color: '#d32f2f',
                        textAlign: 'center',
                        marginBottom: '20px',
                        fontWeight: 'bold',
                        padding: '10px',
                        background: '#ffebee',
                        borderRadius: '10px'
                    }}>
                        Please answer the question before proceeding.
                    </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
                    <button
                        onClick={handlePrevQuestion}
                        disabled={currentQuestionIndex === 0}
                        style={{
                            padding: '15px 30px',
                            fontSize: '1rem',
                            opacity: currentQuestionIndex === 0 ? 0.5 : 1,
                            cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
                            background: '#e2e8f0',
                            color: '#1e293b',
                            border: 'none',
                            borderRadius: '10px',
                            fontWeight: '600'
                        }}
                    >
                        Previous
                    </button>
                    {isLastQuestion ? (
                        <button
                            onClick={handleSubmit}
                            className="btn-primary"
                            style={{ padding: '15px 50px', fontSize: '1.1rem' }}
                        >
                            Submit Quiz
                        </button>
                    ) : (
                        <button
                            onClick={handleNextQuestion}
                            className="btn-primary"
                            style={{ padding: '15px 30px', fontSize: '1rem' }}
                        >
                            Next Question
                        </button>
                    )}
                </div>
            </div>
        );
    };
    const renderResults = () => {
        const { correct, total, percentage } = calculateScore();
        return (
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="result-header" style={{
                    textAlign: 'center',
                    background: '#fff',
                    padding: '40px',
                    borderRadius: '20px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    marginBottom: '40px'
                }}>
                    <h3 style={{ fontSize: '2rem', color: '#1a237e', marginBottom: '10px' }}>
                        Quiz Results
                    </h3>
                    <div style={{
                        fontSize: '4rem',
                        fontWeight: '800',
                        color: percentage >= 70 ? '#4caf50' : '#ffab00',
                        marginBottom: '10px'
                    }}>
                        {percentage}%
                    </div>
                    <p style={{ fontSize: '1.2rem', color: '#666' }}>
                        You scored <strong>{correct}</strong> out of <strong>{total}</strong>
                    </p>
                    <button
                        onClick={handleRestart}
                        className="btn-primary"
                        style={{ marginTop: '20px' }}
                    >
                        Take Another Quiz
                    </button>
                </div>
                <h3 style={{ marginBottom: '20px', color: '#1a237e' }}>Review Answers</h3>
                {questions.map((q, index) => {
                    const userAnswer = userAnswers[q._id];
                    const isCorrect = userAnswer === q.correctAnswer;
                    return (
                        <div
                            key={q._id}
                            className="review-card"
                            style={{
                                background: '#fff',
                                padding: '30px',
                                borderRadius: '15px',
                                boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                                marginBottom: '25px',
                                borderLeft: `5px solid ${isCorrect ? '#4caf50' : '#f44336'}`
                            }}
                        >
                            <h4 style={{ marginBottom: '15px', color: '#333' }}>
                                <span style={{ color: '#1a237e', marginRight: '10px' }}>
                                    Q{index + 1}.
                                </span>
                                {q.question}
                            </h4>
                            <div style={{ display: 'grid', gap: '10px' }}>
                                {q.options.map(option => {
                                    let optionStyle = {
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0',
                                        background: '#fff'
                                    };
                                    if (option === q.correctAnswer) {
                                        optionStyle = {
                                            ...optionStyle,
                                            background: '#e8f5e9',
                                            borderColor: '#4caf50',
                                            color: '#2e7d32',
                                            fontWeight: 'bold'
                                        };
                                    }
                                    else if (option === userAnswer && !isCorrect) {
                                        optionStyle = {
                                            ...optionStyle,
                                            background: '#ffebee',
                                            borderColor: '#f44336',
                                            color: '#c62828'
                                        };
                                    }
                                    return (
                                        <div key={option} style={optionStyle}>
                                            {option}
                                            {option === q.correctAnswer && <span style={{ float: 'right' }}>✅</span>}
                                            {option === userAnswer && !isCorrect && <span style={{ float: 'right' }}>❌</span>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };
    return (
        <section className="quiz-section" style={{
            padding: '120px 0 60px',
            minHeight: '100vh',
            backgroundColor: '#f8fafc'
        }}>
            <div className="container">
                <div className="section-header text-center" style={{ marginBottom: '40px' }}>
                    <div className="badge" style={{
                        background: '#e3f2fd',
                        color: '#1a237e',
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        marginBottom: '15px',
                        display: 'inline-block'
                    }}>
                        Board-Focused • NCERT-Aligned
                    </div>
                    <h2 className="section-title">
                        Practice <span className="highlight">Board-Level</span> Maths Questions
                    </h2>
                    <p className="section-subtitle">
                        Chapter-wise quizzes for Class 10th and 12th to boost your board exam preparation.
                    </p>
                </div>
                {view === 'class-select' && renderClassSelection()}
                {view === 'chapter-select' && renderChapterSelection()}
                {view === 'quiz' && renderQuiz()}
                {view === 'result' && renderResults()}
            </div>
        </section>
    );
};
export default Quiz;