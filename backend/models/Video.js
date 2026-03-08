import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  cloudinaryId: {
    type: String,
    default: '',
  },
  videoUrl: {
    type: String,
    default: '',
  },
  hlsUrl: {
    type: String,
    default: '',
  },
  thumbnail: {
    type: String,
    default: '',
  },
  duration: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['processing', 'ready', 'failed'],
    default: 'processing',
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Video = mongoose.model('Video', videoSchema);
export default Video;
