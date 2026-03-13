import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contestsAPI } from '../services/api';

const Contests = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContests();
  }, []);

  const loadContests = async () => {
    try {
      setLoading(true);
      const data = await contestsAPI.getActive();
      setContests(data.contests || []);
    } catch (error) {
      console.error('Error loading contests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNextSundayDate = () => {
    const date = new Date();
    const daysUntilSunday = (7 - date.getDay()) % 7;
    date.setDate(date.getDate() + daysUntilSunday);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getContestStatus = (contest) => {
    const now = new Date();
    const start = new Date(contest.startTime);
    const end = contest.endTime
      ? new Date(contest.endTime)
      : new Date(start.getTime() + contest.duration * 60000);

    const isActive = contest.isActive || (now >= start && now <= end);
    const isUpcoming = now < start;

    return { isActive, isUpcoming, start, end };
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="container contests-page">
      <div className="weekly-contest-section">
        <h3 className="section-heading">Weekly Contest</h3>
        <div className="test-schedule-banner">
          <h2 className="schedule-date">{getNextSundayDate()}</h2>
        </div>
        <div className="info-display-card schedule-card">
          <div className="schedule-list-item">
            <span>Maths</span>
            <span className="schedule-time">10:00 AM</span>
          </div>
        </div>
      </div>

      <div className="contests-section">
        {contests.length > 0 && (
          <>
            <h3 className="section-heading">Upcoming Contests</h3>
            <div className="row g-4">
              {contests.map((contest) => {
                const { isActive, isUpcoming, start, end } =
                  getContestStatus(contest);

                return (
                  <div key={contest._id} className="col-md-6 col-lg-4">
                    <div className="enrollment-card contest-card">
                      <div className="enrollment-header">
                        <span
                          className={`status-badge ${isActive ? 'active' : isUpcoming ? 'scheduled' : 'completed'}`}
                        >
                          {isActive
                            ? 'LIVE NOW'
                            : isUpcoming
                              ? 'UPCOMING'
                              : 'COMPLETED'}
                        </span>
                        <small className="question-count">
                          {contest.questions.length} Questions
                        </small>
                      </div>
                      <h5 className="enrollment-title">{contest.title}</h5>
                      {contest.description && (
                        <p className="contest-description">
                          {contest.description}
                        </p>
                      )}
                      <div className="contest-details">
                        <div className="contest-detail-item">
                          <i className="fas fa-play-circle"></i>
                          <span>
                            <strong>Start:</strong> {formatDateTime(start)}
                          </span>
                        </div>
                        <div className="contest-detail-item">
                          <i className="fas fa-stop-circle"></i>
                          <span>
                            <strong>End:</strong> {formatDateTime(end)}
                          </span>
                        </div>
                        <div className="contest-detail-item">
                          <i className="fas fa-hourglass-half"></i>
                          <span>
                            <strong>Duration:</strong> {contest.duration}{' '}
                            minutes
                          </span>
                        </div>
                      </div>
                      {isActive ? (
                        <Link
                          to={`/contest/${contest._id}`}
                          className="btn-primary mt-3 contest-action-btn"
                        >
                          Start Contest
                        </Link>
                      ) : isUpcoming ? (
                        <button
                          className="btn-secondary mt-3 contest-action-btn"
                          disabled
                        >
                          Starts Soon
                        </button>
                      ) : (
                        <Link
                          to={`/contest/${contest._id}/result`}
                          className="btn-secondary mt-3 contest-action-btn"
                        >
                          View Leaderboard
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Contests;
