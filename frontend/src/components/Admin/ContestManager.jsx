import { useState, useEffect } from 'react';
import { contestsAPI } from '../../services/api';
import ConfirmDialog from '../ConfirmDialog';
import Toast from '../Toast';

const ContestManager = () => {
  const [contests, setContests] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showContestDetailsModal, setShowContestDetailsModal] = useState(false);
  const [bulkFile, setBulkFile] = useState(null);
  const [toast, setToast] = useState(null);
  const [contestDetails, setContestDetails] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    duration: 60,
  });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null });
  const [currentContest, setCurrentContest] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    duration: 60,
    questions: [{ question: '', options: ['', '', '', ''], correctAnswer: '' }],
  });
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      const res = await contestsAPI.getAll();
      setContests(res.contests || []);
    } catch (error) {
      console.error('Failed to fetch contests:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentContest((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...currentContest.questions];
    newQuestions[index][field] = value;
    setCurrentContest((prev) => ({ ...prev, questions: newQuestions }));
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...currentContest.questions];
    newQuestions[qIndex].options[oIndex] = value;
    setCurrentContest((prev) => ({ ...prev, questions: newQuestions }));
  };

  const addQuestion = () => {
    setCurrentContest((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        { question: '', options: ['', '', '', ''], correctAnswer: '' },
      ],
    }));
  };

  const removeQuestion = (index) => {
    if (currentContest.questions.length > 1) {
      const newQuestions = currentContest.questions.filter(
        (_, i) => i !== index
      );
      setCurrentContest((prev) => ({ ...prev, questions: newQuestions }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await contestsAPI.update(currentContest._id, currentContest);
        setToast({ message: 'Contest updated successfully!', type: 'success' });
      } else {
        await contestsAPI.create(currentContest);
        setToast({ message: 'Contest created successfully!', type: 'success' });
      }

      setIsEditing(false);
      setCurrentContest({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        duration: 60,
        questions: [
          { question: '', options: ['', '', '', ''], correctAnswer: '' },
        ],
      });
      fetchContests();
    } catch (error) {
      setToast({
        message: 'Error saving contest. Please try again.',
        type: 'error',
      });
    }
  };

  const handleBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
    ];

    if (
      !validTypes.includes(file.type) &&
      !file.name.match(/\.(xlsx|xls|csv)$/i)
    ) {
      setToast({
        message:
          'Invalid file type. Please upload .xlsx, .xls, or .csv file only.',
        type: 'error',
      });
      e.target.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setToast({
        message: 'File too large. Maximum size is 10MB.',
        type: 'error',
      });
      e.target.value = '';
      return;
    }

    setBulkFile(file);
    setShowContestDetailsModal(true);
    e.target.value = '';
  };

  const processBulkUpload = async () => {
    if (!bulkFile) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        setToast({ message: 'Processing file... Please wait.', type: 'info' });
        setShowContestDetailsModal(false);

        const result = await contestsAPI.bulkUpload(
          event.target.result,
          contestDetails
        );

        setToast({
          message: 'Success! Contest uploaded successfully!',
          type: 'success',
        });
        fetchContests();
        setShowBulkUpload(false);
        setBulkFile(null);
        setContestDetails({
          title: '',
          description: '',
          startTime: '',
          endTime: '',
          duration: 60,
        });
      } catch (error) {
        console.error('Upload error:', error);
        const errorMsg =
          error.response?.data?.message ||
          error.message ||
          'Upload failed. Please try again.';
        setToast({
          message: `Upload failed: ${errorMsg}`,
          type: 'error',
        });
      }
    };

    reader.onerror = () => {
      setToast({
        message: 'Failed to read file. Please try again.',
        type: 'error',
      });
    };

    reader.readAsDataURL(bulkFile);
  };

  const handleEdit = (contest) => {
    setCurrentContest(contest);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async () => {
    const { id } = deleteDialog;
    try {
      await contestsAPI.delete(id);
      fetchContests();
      setToast({ message: 'Contest deleted successfully!', type: 'success' });
    } catch (error) {
      setToast({ message: 'Error deleting contest.', type: 'error' });
    } finally {
      setDeleteDialog({ isOpen: false, id: null });
    }
  };

  const cancelDelete = () => {
    setDeleteDialog({ isOpen: false, id: null });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getContestStatus = (contest) => {
    const now = new Date();
    const start = new Date(contest.startTime);
    const end = new Date(
      contest.endTime || new Date(start.getTime() + contest.duration * 60000)
    );

    if (now < start) return 'scheduled';
    if (now >= start && now <= end) return 'active';
    return 'completed';
  };

  return (
    <div className="admin-container">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="question-manager-header">
        <h2 className="admin-header-title">Contest Manager</h2>
        <button
          onClick={() => setShowBulkUpload(!showBulkUpload)}
          className="btn-primary bulk-upload-btn"
        >
          <i className="fas fa-file-excel"></i>
          {showBulkUpload ? 'Hide' : 'Bulk Upload'}
        </button>
      </div>

      {showBulkUpload && (
        <div className="admin-card bulk-upload-card">
          <h4 className="bulk-upload-title">
            <i className="fas fa-upload"></i> Bulk Upload Contest
          </h4>
          <p className="bulk-upload-description">
            Upload an Excel file (.xlsx, .xls) or CSV with contest questions.
            Maximum file size: 10MB
          </p>
          <div
            style={{
              background: '#eff6ff',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '15px',
              border: '1px solid #bfdbfe',
            }}
          >
            <p
              style={{
                margin: '0 0 10px 0',
                color: '#1e40af',
                fontSize: '0.9rem',
                fontWeight: '600',
              }}
            >
              <i className="fas fa-info-circle"></i> Required Excel Columns:
            </p>
            <ul
              style={{
                margin: 0,
                paddingLeft: '20px',
                color: '#1e40af',
                fontSize: '0.85rem',
              }}
            >
              <li>
                <strong>Question Text</strong> - The question
              </li>
              <li>
                <strong>Option 1, Option 2, Option 3, Option 4</strong> - Four
                options
              </li>
              <li>
                <strong>Correct Answer</strong> - The correct option text
              </li>
            </ul>
            <p
              style={{
                margin: '10px 0 0 0',
                color: '#1e40af',
                fontSize: '0.85rem',
              }}
            >
              Optional: Add <strong>title</strong>, <strong>description</strong>
              , <strong>startTime</strong>, <strong>duration</strong> in first
              row
            </p>
          </div>
          <div
            style={{
              background: '#fef3c7',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '15px',
              border: '1px solid #fde68a',
            }}
          >
            <p style={{ margin: 0, color: '#92400e', fontSize: '0.9rem' }}>
              <i className="fas fa-star"></i> <strong>XP System:</strong> Each
              correct answer awards 3 XP. Students compete on the leaderboard!
            </p>
          </div>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleBulkUpload}
            className="bulk-upload-input"
          />
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-card question-form-card">
        <h3 className="question-form-title">
          {isEditing ? 'Edit Contest' : 'Add New Contest'}
        </h3>

        <div
          style={{
            background: '#fef3c7',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #fde68a',
          }}
        >
          <p style={{ margin: 0, color: '#92400e', fontSize: '0.9rem' }}>
            <i className="fas fa-star"></i> <strong>XP Reward:</strong> Each
            correct answer = 3 XP. Leaderboard ranks students by total XP
            earned!
          </p>
        </div>

        <div className="question-form-grid">
          <div className="form-group">
            <label className="form-label">Contest Title</label>
            <input
              type="text"
              name="title"
              value={currentContest.title}
              onChange={handleInputChange}
              placeholder="e.g., Weekly Maths Contest"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={currentContest.description}
              onChange={handleInputChange}
              placeholder="Contest description"
              className="form-input question-textarea"
              rows="3"
            />
          </div>

          <div className="select-filters-grid">
            <div className="form-group">
              <label className="form-label">Start Time</label>
              <input
                type="datetime-local"
                name="startTime"
                value={currentContest.startTime}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Time</label>
              <input
                type="datetime-local"
                name="endTime"
                value={currentContest.endTime}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Duration (minutes)</label>
              <input
                type="number"
                name="duration"
                value={currentContest.duration}
                onChange={handleInputChange}
                min="15"
                max="180"
                required
                className="form-input"
              />
              <small
                style={{
                  color: '#64748b',
                  fontSize: '0.85rem',
                  marginTop: '5px',
                  display: 'block',
                }}
              >
                Time per student to complete
              </small>
            </div>
          </div>

          <h4
            style={{
              marginTop: '20px',
              marginBottom: '15px',
              color: '#1a237e',
            }}
          >
            Contest Questions
          </h4>
          {currentContest.questions.map((q, qIndex) => (
            <div
              key={qIndex}
              className="question-block"
              style={{
                marginBottom: '20px',
                padding: '20px',
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                backgroundColor: '#f8fafc',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '15px',
                }}
              >
                <h5 style={{ color: '#1a237e', fontSize: '1.1rem' }}>
                  Question {qIndex + 1}
                </h5>
                {currentContest.questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIndex)}
                    className="btn-action btn-delete"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Question Text</label>
                <textarea
                  value={q.question}
                  onChange={(e) =>
                    handleQuestionChange(qIndex, 'question', e.target.value)
                  }
                  placeholder="Enter question"
                  required
                  className="form-input"
                  rows="2"
                />
              </div>

              <div className="options-grid-form">
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex} className="form-group">
                    <label className="form-label">Option {oIndex + 1}</label>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) =>
                        handleOptionChange(qIndex, oIndex, e.target.value)
                      }
                      placeholder={`Enter option ${oIndex + 1}`}
                      required
                      className="form-input"
                    />
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label className="form-label">Correct Answer</label>
                <select
                  value={q.correctAnswer}
                  onChange={(e) =>
                    handleQuestionChange(
                      qIndex,
                      'correctAnswer',
                      e.target.value
                    )
                  }
                  required
                  className="form-input"
                >
                  <option value="">Select the correct option</option>
                  {q.options
                    .filter((opt) => opt.trim() !== '')
                    .map((opt, oIndex) => (
                      <option key={oIndex} value={opt}>
                        {opt}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestion}
            className="btn-secondary"
            style={{ marginBottom: '20px', width: '100%' }}
          >
            <i className="fas fa-plus"></i> Add Question
          </button>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {isEditing ? 'Update Contest' : 'Save Contest'}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setCurrentContest({
                    title: '',
                    description: '',
                    startTime: '',
                    endTime: '',
                    duration: 60,
                    questions: [
                      {
                        question: '',
                        options: ['', '', '', ''],
                        correctAnswer: '',
                      },
                    ],
                  });
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="admin-card">
        <div className="questions-list-header">
          <h3 className="questions-list-title">All Contests</h3>
          <div className="class-filter-buttons">
            <button className="class-filter-btn active">
              Total ({contests.length})
            </button>
          </div>
        </div>

        <div className="enrollment-list-mobile">
          {contests.map((contest) => (
            <div key={contest._id} className="enrollment-card-mobile">
              <div className="enrollment-card-header">
                <div>
                  <div className="enrollment-student-name question-card-text">
                    {contest.title}
                  </div>
                  <div className="enrollment-date">
                    Start: {formatDateTime(contest.startTime)} • End:{' '}
                    {formatDateTime(
                      contest.endTime ||
                        new Date(
                          new Date(contest.startTime).getTime() +
                            contest.duration * 60000
                        )
                    )}{' '}
                    • {contest.questions.length} questions
                  </div>
                  <span className={`status-badge ${getContestStatus(contest)}`}>
                    {getContestStatus(contest).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="question-card-actions">
                <button
                  onClick={() => handleEdit(contest)}
                  className="btn-action btn-view"
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    setDeleteDialog({ isOpen: true, id: contest._id })
                  }
                  className="btn-action btn-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-table-wrapper enrollment-table-desktop">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Questions</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contests.map((contest) => (
                <tr key={contest._id}>
                  <td
                    className="question-table-text"
                    style={{ fontWeight: '600' }}
                  >
                    {contest.title}
                  </td>
                  <td>{formatDateTime(contest.startTime)}</td>
                  <td>
                    {formatDateTime(
                      contest.endTime ||
                        new Date(
                          new Date(contest.startTime).getTime() +
                            contest.duration * 60000
                        )
                    )}
                  </td>
                  <td>{contest.questions.length}</td>
                  <td>
                    <span
                      className={`status-badge ${getContestStatus(contest)}`}
                    >
                      {getContestStatus(contest).toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div className="question-table-actions">
                      <button
                        onClick={() => handleEdit(contest)}
                        className="btn-action btn-view"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          setDeleteDialog({ isOpen: true, id: contest._id })
                        }
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

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Delete Contest"
        message="Are you sure you want to delete this contest? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={cancelDelete}
      />

      {showContestDetailsModal && (
        <div
          className="modal-overlay"
          onClick={() => {
            setShowContestDetailsModal(false);
            setBulkFile(null);
          }}
        >
          <div
            className="modal-content-box"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '600px' }}
          >
            <button
              onClick={() => {
                setShowContestDetailsModal(false);
                setBulkFile(null);
              }}
              className="modal-close-btn"
            >
              &times;
            </button>

            <h3 style={{ marginBottom: '20px', color: '#1a237e' }}>
              Contest Details
            </h3>
            <p
              style={{
                color: '#64748b',
                marginBottom: '20px',
                fontSize: '0.9rem',
              }}
            >
              Provide contest information before uploading questions
            </p>

            <div className="form-group">
              <label className="form-label">Contest Title *</label>
              <input
                type="text"
                value={contestDetails.title}
                onChange={(e) =>
                  setContestDetails({
                    ...contestDetails,
                    title: e.target.value,
                  })
                }
                placeholder="e.g., Weekly Maths Contest"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                value={contestDetails.description}
                onChange={(e) =>
                  setContestDetails({
                    ...contestDetails,
                    description: e.target.value,
                  })
                }
                placeholder="Contest description (optional)"
                className="form-input"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Start Time *</label>
              <input
                type="datetime-local"
                value={contestDetails.startTime}
                onChange={(e) =>
                  setContestDetails({
                    ...contestDetails,
                    startTime: e.target.value,
                  })
                }
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Time *</label>
              <input
                type="datetime-local"
                value={contestDetails.endTime}
                onChange={(e) =>
                  setContestDetails({
                    ...contestDetails,
                    endTime: e.target.value,
                  })
                }
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Duration (minutes) *</label>
              <input
                type="number"
                value={contestDetails.duration}
                onChange={(e) =>
                  setContestDetails({
                    ...contestDetails,
                    duration: e.target.value,
                  })
                }
                min="15"
                max="180"
                required
                className="form-input"
              />
              <small
                style={{
                  color: '#64748b',
                  fontSize: '0.85rem',
                  marginTop: '5px',
                  display: 'block',
                }}
              >
                Duration per student to complete the contest
              </small>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={processBulkUpload}
                disabled={
                  !contestDetails.title ||
                  !contestDetails.startTime ||
                  !contestDetails.endTime
                }
                className="btn-primary"
                style={{ flex: 1 }}
              >
                Upload Contest
              </button>
              <button
                onClick={() => {
                  setShowContestDetailsModal(false);
                  setBulkFile(null);
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContestManager;
