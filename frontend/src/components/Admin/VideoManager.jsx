import { useState, useEffect } from 'react';
import axios from 'axios';
import Toast from '../Toast';
import ConfirmDialog from '../ConfirmDialog';

const VideoManager = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    videoId: null,
  });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoFile: null,
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/videos`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setVideos(response.data.videos || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, videoFile: file });
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!formData.videoFile) {
      setToast({ message: 'Please select a video file', type: 'error' });
      return;
    }

    const data = new FormData();
    data.append('video', formData.videoFile);
    data.append('title', formData.title);
    data.append('description', formData.description);

    try {
      setUploading(true);
      const token = localStorage.getItem('token');

      await axios.post(`${import.meta.env.VITE_API_URL}/videos/upload`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percent);
        },
      });

      setToast({
        message: 'Video uploaded successfully! Processing started.',
        type: 'success',
      });
      setFormData({ title: '', description: '', videoFile: null });
      setUploadProgress(0);
      fetchVideos();
    } catch (error) {
      setToast({
        message: error.response?.data?.message || 'Upload failed',
        type: 'error',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (videoId) => {
    setConfirmDialog({ isOpen: true, videoId });
  };

  const confirmDelete = async () => {
    const videoId = confirmDialog.videoId;
    setConfirmDialog({ isOpen: false, videoId: null });

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL}/videos/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setToast({ message: 'Video deleted successfully', type: 'success' });
      fetchVideos();
    } catch (error) {
      setToast({
        message: error.response?.data?.message || 'Delete failed',
        type: 'error',
      });
    }
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

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Video"
        message="Are you sure you want to delete this video? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, videoId: null })}
      />

      <h2 className="admin-header-title">Video Management</h2>

      <div className="admin-manager-layout">
        <div className="manager-section">
          <h3 className="section-title">Upload New Video</h3>
          <form onSubmit={handleUpload} className="upload-form">
            <div className="form-group">
              <label className="form-label">Video Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="form-input"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Video File (MP4, AVI, MOV, MKV)
              </label>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="form-input"
                required
              />
              {formData.videoFile && (
                <p className="file-info">
                  Selected: {formData.videoFile.name} (
                  {(formData.videoFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            {uploading && (
              <div className="upload-progress">
                <div className="upload-progress-bar">
                  <div
                    className="upload-progress-fill"
                    style={{ width: `${uploadProgress}%` }}
                  >
                    {uploadProgress}%
                  </div>
                </div>
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Video'}
            </button>
          </form>
        </div>

        <div className="manager-section">
          <h3 className="section-title">All Videos ({videos.length})</h3>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          ) : videos.length === 0 ? (
            <p className="no-videos-text">No videos uploaded yet</p>
          ) : (
            <div className="video-grid">
              {videos.map((video) => (
                <div key={video._id} className="video-card">
                  <div className="video-thumbnail">
                    {video.thumbnail ? (
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="thumbnail-img"
                      />
                    ) : (
                      <div className="video-placeholder">
                        <i className="fas fa-video"></i>
                      </div>
                    )}
                    <span className={`status-badge ${video.status}`}>
                      {video.status}
                    </span>
                  </div>
                  <div className="video-card-body">
                    <h4 className="video-card-title">{video.title}</h4>
                    <p className="video-card-description">
                      {video.description || 'No description'}
                    </p>
                    <div className="video-card-meta">
                      <div>Views: {video.views}</div>
                      <div>
                        Duration: {Math.floor(video.duration / 60)}:
                        {String(Math.floor(video.duration % 60)).padStart(
                          2,
                          '0'
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(video._id)}
                      className="btn-secondary btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoManager;
