import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { leaderboardAPI } from '../services/api';
import InitialsAvatar from './InitialsAvatar';
import xpIcon from '../assets/xps.png';

const UserAvatar = ({ user, size = 40, className = '' }) => {
  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name}
        className={className}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
        }}
      />
    );
  }
  return (
    <InitialsAvatar
      name={user?.name || '?'}
      size={size}
      className={className}
    />
  );
};

const PodiumAvatar = ({ user, size = 120 }) => {
  if (user?.avatar) {
    return (
      <img
        src={user.avatar}
        alt={user.name}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          objectFit: 'cover',
          objectPosition: 'center',
        }}
      />
    );
  }
  return <InitialsAvatar name={user?.name || '?'} size={size} />;
};

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await leaderboardAPI.getLeaderboard();
        setLeaderboard(data.leaderboard);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const topThree = leaderboard.slice(0, 3);

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-header">
        <div className="header-controls">
          <div className="time-filter-group">
            <button
              className={`time-filter-btn ${timeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setTimeFilter('all')}
            >
              All Time
            </button>
            <span className="filter-date">Mar 26</span>
          </div>
          <button className="info-button" onClick={() => setShowModal(true)}>
            How it Works
          </button>
        </div>

        <div className="contest-badge">MARCH 2026 CONTEST</div>
        <h1 className="page-title">Leaderboard</h1>

        {topThree.length > 0 && (
          <div className="top-three-podium">
            {[topThree[1], topThree[0], topThree[2]].map((user, idx) => {
              if (!user) return null;
              const actualRank = idx === 0 ? 2 : idx === 1 ? 1 : 3;
              const displayOrder =
                actualRank === 1 ? 2 : actualRank === 2 ? 1 : 3;
              return (
                <div
                  key={user._id}
                  className={`podium-position rank-${actualRank}`}
                  style={{ order: displayOrder }}
                >
                  <div className="podium-avatar-wrapper">
                    <div className="podium-avatar">
                      <PodiumAvatar
                        user={user}
                        size={actualRank === 1 ? 120 : 100}
                      />
                    </div>
                    <div className="rank-badge">{actualRank}</div>
                  </div>
                  <div className="podium-name">{user.name.split(' ')[0]}</div>
                  <div className="podium-score">
                    <img src={xpIcon} alt="XP" className="score-icon-img" />
                    {user.totalXP}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="leaderboard-content">
        <div className="action-banner">
          <div className="banner-message">
            <strong>Increase your XP to climb the leaderboard!</strong>
            <p>Solve quizzes, practice questions, and complete challenges.</p>
          </div>
          <div className="banner-actions">
            <button className="btn-primary" onClick={() => navigate('/quiz')}>
              Solve Quizzes
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="rankings-table">
            <thead>
              <tr>
                <th className="col-rank">RANK</th>
                <th className="col-change">CHANGE</th>
                <th className="col-name">NAME</th>
                <th className="col-score">XP THIS MONTH</th>
                <th className="col-time">LATEST SUBMISSION</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((user, index) => (
                <tr key={user._id} className="table-row">
                  <td className="rank-cell">
                    {index < 3 ? (
                      <div className={`medal-badge rank-${index + 1}`}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        {index + 1}
                      </div>
                    ) : (
                      <span className="rank-number">{index + 1}</span>
                    )}
                  </td>
                  <td className="change-cell">—</td>
                  <td className="name-cell">
                    <div className="user-info">
                      <UserAvatar user={user} size={40} />
                      <span className="user-name">{user.name}</span>
                    </div>
                  </td>
                  <td className="score-cell">
                    <span className="score-display">
                      <img src={xpIcon} alt="XP" className="score-icon-img" />
                      {user.totalXP}
                    </span>
                  </td>
                  <td className="time-cell">1 day ago</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="info-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">How XP Works</h2>

            <div className="info-section">
              <div className="section-icon">🏆</div>
              <h3 className="section-title">Monthly Leaderboard</h3>
              <p className="section-description">
                Earn more XP to climb on top of the leaderboard
              </p>
            </div>

            <div className="info-section">
              <div className="section-icon">⚡</div>
              <h3 className="section-title">What is XP</h3>
              <p className="section-description">
                A currency to measure your efforts and skills
              </p>
            </div>

            <div className="info-section">
              <div className="section-icon">⚡</div>
              <h3 className="section-title">How to Earn XP</h3>
              <p className="section-description">
                Earn XP from attending lectures and solving problems
              </p>
            </div>

            <div className="info-section">
              <div className="section-icon">2×</div>
              <h3 className="section-title">
                When is the 2X Multiplier applied
              </h3>
              <p className="section-description">
                Win 2x XP for solving questions before the deadline
              </p>
            </div>

            <button
              className="modal-close-btn"
              onClick={() => setShowModal(false)}
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
