import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VideoPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);

  useEffect(() => {
    loadVideo();
  }, [id]);

  const loadVideo = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/videos/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setVideo(response.data.video);
    } catch (error) {
      console.error('Error loading video:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const getVideoUrl = (path) => {
    return `${import.meta.env.VITE_API_URL.replace('/api', '')}/${path}`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="container video-not-found">
        <h2>Video not found</h2>
        <button
          onClick={() => navigate('/videos')}
          className="btn-primary mt-3"
        >
          Back to Videos
        </button>
      </div>
    );
  }

  return (
    <div className="container video-player-page">
      <button
        onClick={() => navigate('/videos')}
        className="btn-secondary back-button"
      >
        <i className="fas fa-arrow-left"></i> Back to Videos
      </button>

      <div className="video-player-container">
        <div className="video-player-wrapper">
          {video.hlsPath ? (
            <video ref={videoRef} controls>
              <source
                src={getVideoUrl(video.hlsPath)}
                type="application/x-mpegURL"
              />
              Your browser does not support video playback.
            </video>
          ) : (
            <div className="video-processing">
              <i className="fas fa-video"></i>
              <p>Video is being processed...</p>
            </div>
          )}
        </div>

        <div className="video-info">
          <h1 className="video-info-title">{video.title}</h1>

          <div className="video-info-stats">
            <span>
              <i className="fas fa-eye"></i> {video.views} views
            </span>
            <span>
              <i className="fas fa-clock"></i> {formatDuration(video.duration)}
            </span>
          </div>

          {video.description && (
            <div>
              <h3 className="video-description-title">Description</h3>
              <p className="video-info-description">{video.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
