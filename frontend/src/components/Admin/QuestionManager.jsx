import React, { useState, useEffect } from 'react';
import { questionsAPI } from '../../services/api';

const QuestionManager = () => {
    const [questions, setQuestions] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState({
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        class: '10',
        chapter: ''
    });

    useEffect(() => {
        fetchQuestions();
    }, []);

    const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

    const fetchQuestions = async () => {
        try {
            const res = await questionsAPI.getAll();
            setQuestions(res.questions);
        } catch (error) {
            console.error('Error fetching questions:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentQuestion(prev => ({ ...prev, [name]: value }));
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...currentQuestion.options];
        newOptions[index] = value;
        setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await questionsAPI.update(currentQuestion._id, currentQuestion);
                setStatusMessage({ text: 'Question updated successfully! ✨', type: 'success' });
            } else {
                await questionsAPI.create(currentQuestion);
                setStatusMessage({ text: 'Question added successfully! ✨', type: 'success' });
            }

            setTimeout(() => setStatusMessage({ text: '', type: '' }), 3000);

            setIsEditing(false);
            setCurrentQuestion({
                question: '',
                options: ['', '', '', ''],
                correctAnswer: '',
                class: '10',
                chapter: ''
            });
            fetchQuestions();
        } catch (error) {
            console.error('Error saving question:', error);
            setStatusMessage({ text: 'Error saving question. Please try again.', type: 'error' });
            setTimeout(() => setStatusMessage({ text: '', type: '' }), 3000);
        }
    };

    return (
        <div style={{ padding: '40px' }}>
            <h2 style={{ marginBottom: '30px', color: '#1a237e' }}>Question Manager</h2>

            {statusMessage.text && (
                <div style={{
                    padding: '15px 25px',
                    borderRadius: '12px',
                    marginBottom: '20px',
                    backgroundColor: statusMessage.type === 'success' ? '#ecfdf5' : '#fef2f2',
                    color: statusMessage.type === 'success' ? '#059669' : '#dc2626',
                    border: `1px solid ${statusMessage.type === 'success' ? '#10b981' : '#f87171'}`,
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    animation: 'slideIn 0.3s ease-out'
                }}>
                    {statusMessage.type === 'success' ? '✅' : '❌'} {statusMessage.text}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '30px', borderRadius: '20px', marginBottom: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                <h3 style={{ color: '#1a237e', marginBottom: '20px' }}>{isEditing ? '📝 Edit Question' : '➕ Add New Question'}</h3>
                <div style={{ display: 'grid', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontWeight: '600', color: '#475569' }}>Question Text</label>
                        <textarea
                            name="question"
                            value={currentQuestion.question}
                            onChange={handleInputChange}
                            placeholder="Type your question here..."
                            required
                            style={{ padding: '15px', borderRadius: '12px', border: '2px solid #e2e8f0', minHeight: '100px', outline: 'none', transition: 'border-color 0.2s' }}
                            onFocus={(e) => e.target.style.borderColor = '#1a237e'}
                            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                        {currentQuestion.options.map((opt, i) => (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontWeight: '600', color: '#475569' }}>Option {i + 1}</label>
                                <input
                                    value={opt}
                                    onChange={(e) => handleOptionChange(i, e.target.value)}
                                    placeholder={`Enter option ${i + 1}`}
                                    required
                                    style={{ padding: '12px', borderRadius: '10px', border: '2px solid #e2e8f0', outline: 'none' }}
                                    onFocus={(e) => e.target.style.borderColor = '#1a237e'}
                                    onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                />
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontWeight: '600', color: '#475569' }}>Correct Answer</label>
                            <select
                                name="correctAnswer"
                                value={currentQuestion.correctAnswer}
                                onChange={handleInputChange}
                                required
                                style={{ padding: '12px', borderRadius: '10px', border: '2px solid #e2e8f0', backgroundColor: '#fff', outline: 'none' }}
                            >
                                <option value="">Select the correct option</option>
                                {currentQuestion.options.filter(opt => opt.trim() !== '').map((opt, i) => (
                                    <option key={i} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontWeight: '600', color: '#475569' }}>Class</label>
                            <select
                                name="class"
                                value={currentQuestion.class}
                                onChange={handleInputChange}
                                style={{ padding: '12px', borderRadius: '10px', border: '2px solid #e2e8f0', outline: 'none' }}
                            >
                                <option value="10">Class 10</option>
                                <option value="12">Class 12</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontWeight: '600', color: '#475569' }}>Chapter Name</label>
                            <input
                                name="chapter"
                                value={currentQuestion.chapter}
                                onChange={handleInputChange}
                                placeholder="e.g. Real Numbers"
                                required
                                style={{ padding: '12px', borderRadius: '10px', border: '2px solid #e2e8f0', outline: 'none' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                        <button type="submit" className="btn-primary" style={{ flex: 2, padding: '15px' }}>
                            {isEditing ? 'Update Question' : 'Save Question'}
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setCurrentQuestion({ question: '', options: ['', '', '', ''], correctAnswer: '', class: '10', chapter: '' });
                                }}
                                style={{ flex: 1, background: '#f1f5f9', color: '#475569', padding: '15px', borderRadius: '12px', border: 'none', fontWeight: '600', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            </form>

        </div>
    );
};

export default QuestionManager;
