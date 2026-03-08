import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/videos`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const readyVideos = (response.data.videos || []).filter(
        (v) => v.status === 'ready'
      );
      setVideos(readyVideos);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const getImageUrl = (url) => {
    return url;
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
      <div className="contests-section">
        {videos.length === 0 ? (
          <div className="video-empty-state">
            <i className="fas fa-video empty-icon"></i>
            <h3 className="empty-title">No Lectures Available</h3>
            <p className="empty-text">Coming soon</p>
          </div>
        ) : (
          <>
            <h3 className="section-heading">Available Lectures</h3>
            <div className="row g-4">
              {videos.map((video) => (
                <div key={video._id} className="col-md-6 col-lg-4">
                  <Link to={`/video/${video._id}`} className="video-link">
                    <div className="enrollment-card contest-card">
                      <div className="video-thumbnail">
                        {video.thumbnail ? (
                          <img
                            src={getImageUrl(video.thumbnail)}
                            alt={video.title}
                          />
                        ) : (
                          <div className="video-placeholder">
                            <i className="fas fa-video"></i>
                          </div>
                        )}
                        <div className="video-play-icon">
                          <i className="fas fa-play-circle"></i>
                        </div>
                      </div>
                      <h5 className="enrollment-title">{video.title}</h5>
                      {video.description && (
                        <p className="contest-description">
                          {video.description}
                        </p>
                      )}
                      <div className="contest-details">
                        <div className="contest-detail-item">
                          <i className="fas fa-eye"></i>
                          <span>{video.views} views</span>
                        </div>
                        <div className="contest-detail-item">
                          <i className="fas fa-clock"></i>
                          <span>{formatDuration(video.duration)}</span>
                        </div>
                      </div>
                      <button className="btn-primary mt-3 contest-action-btn">
                        Watch Now
                      </button>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Videos;
