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
                setStatusMessage({ text: 'Question updated successfully!', type: 'success' });
            } else {
                await questionsAPI.create(currentQuestion);
                setStatusMessage({ text: 'Question added successfully!', type: 'success' });
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
        <div className="admin-container">
            <h2 className="admin-header-title">Question Manager</h2>

            {statusMessage.text && (
                <div className={`status-message ${statusMessage.type === 'success' ? 'status-success' : 'status-error'}`}>
                    {statusMessage.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="admin-card" style={{ marginBottom: '40px' }}>
                <h3 style={{ color: '#1a237e', marginBottom: '20px' }}>{isEditing ? '📝 Edit Question' : '➕ Add New Question'}</h3>

                <div className="question-form-grid">
                    <div className="form-group">
                        <label className="form-label">Question Text</label>
                        <textarea
                            name="question"
                            value={currentQuestion.question}
                            onChange={handleInputChange}
                            placeholder="Type your question here..."
                            required
                            className="form-input"
                            style={{ minHeight: '100px' }}
                        />
                    </div>

                    <div className="options-grid-form">
                        {currentQuestion.options.map((opt, i) => (
                            <div key={i} className="form-group">
                                <label className="form-label">Option {i + 1}</label>
                                <input
                                    value={opt}
                                    onChange={(e) => handleOptionChange(i, e.target.value)}
                                    placeholder={`Enter option ${i + 1}`}
                                    required
                                    className="form-input"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="select-filters-grid">
                        <div className="form-group">
                            <label className="form-label">Correct Answer</label>
                            <select
                                name="correctAnswer"
                                value={currentQuestion.correctAnswer}
                                onChange={handleInputChange}
                                required
                                className="form-input"
                            >
                                <option value="">Select the correct option</option>
                                {currentQuestion.options.filter(opt => opt.trim() !== '').map((opt, i) => (
                                    <option key={i} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Class</label>
                            <select
                                name="class"
                                value={currentQuestion.class}
                                onChange={handleInputChange}
                                className="form-input"
                            >
                                <option value="10">Class 10</option>
                                <option value="12">Class 12</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Chapter Name</label>
                            <input
                                name="chapter"
                                value={currentQuestion.chapter}
                                onChange={handleInputChange}
                                placeholder="e.g. Real Numbers"
                                required
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button type="submit" className="btn-primary" style={{ flex: 2 }}>
                            {isEditing ? 'Update Question' : 'Save Question'}
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditing(false);
                                    setCurrentQuestion({ question: '', options: ['', '', '', ''], correctAnswer: '', class: '10', chapter: '' });
                                }}
                                className="btn-secondary"
                                style={{ flex: 1 }}
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            </form>

            <div className="admin-card">
                <h3 style={{ color: '#1a237e', marginBottom: '20px' }}>All Questions</h3>
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Class</th>
                                <th>Chapter</th>
                                <th>Question</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questions.map((q) => (
                                <tr key={q._id}>
                                    <td style={{ fontWeight: '600' }}>Class {q.class}</td>
                                    <td style={{ color: '#1a237e' }}>{q.chapter}</td>
                                    <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{q.question}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                onClick={() => {
                                                    setIsEditing(true);
                                                    setCurrentQuestion(q);
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                                className="btn-action btn-view"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (window.confirm('Are you sure you want to delete this question?')) {
                                                        try {
                                                            await questionsAPI.delete(q._id);
                                                            fetchQuestions();
                                                            setStatusMessage({ text: 'Question deleted successfully!', type: 'success' });
                                                            setTimeout(() => setStatusMessage({ text: '', type: '' }), 3000);
                                                        } catch (error) {
                                                            console.error('Delete error:', error);
                                                        }
                                                    }
                                                }}
                                                className="btn-action btn-delete"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default QuestionManager;
