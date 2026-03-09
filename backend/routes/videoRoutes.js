import express from 'express';
import multer from 'multer';
import Video from '../models/Video.js';
import { protect } from '../middleware/auth.js';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase();
    const fileType = file.mimetype.toLowerCase();
    
    const isMP4 = fileName.endsWith('.mp4') || fileType === 'video/mp4';
    const isAVI = fileName.endsWith('.avi') || fileType === 'video/x-msvideo';
    const isMOV = fileName.endsWith('.mov') || fileType === 'video/quicktime';
    const isMKV = fileName.endsWith('.mkv') || fileType === 'video/x-matroska';
    
    if (isMP4 || isAVI || isMOV || isMKV) {
      cb(null, true);
    } else {
      cb(new Error('Only video files allowed'));
    }
  },
});

router.post('/upload', protect, upload.single('video'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const videoFile = req.file;

    if (!videoFile) {
      return res
        .status(400)
        .json({ success: false, message: 'No video file uploaded' });
    }

    const newVideo = await Video.create({
      title,
      description,
      uploadedBy: req.user._id,
      status: 'processing',
    });

    const uploadToCloudinary = cloudinary.uploader.upload_stream(
      {
        resource_type: 'video',
        folder: 'success-mantra/videos',
        public_id: `video_${newVideo._id}`,
        eager: [
          { streaming_profile: 'hd', format: 'm3u8' },
          { width: 640, height: 360, crop: 'limit', format: 'jpg' },
        ],
        eager_async: true,
      },
      async (error, result) => {
        if (error) {
          newVideo.status = 'failed';
          await newVideo.save();
          console.error('Cloudinary upload failed:', error);
          return;
        }

        newVideo.cloudinaryId = result.public_id;
        newVideo.videoUrl = result.secure_url;
        newVideo.hlsUrl = result.eager?.[0]?.secure_url || result.secure_url;
        newVideo.thumbnail = result.eager?.[1]?.secure_url || result.secure_url;
        newVideo.duration = result.duration || 0;
        newVideo.status = 'ready';
        await newVideo.save();

        console.log('Video uploaded to Cloudinary:', newVideo._id);
      }
    );

    streamifier.createReadStream(videoFile.buffer).pipe(uploadToCloudinary);

    res.json({
      success: true,
      message: 'Video uploaded and processing started',
      video: {
        id: newVideo._id,
        title: newVideo.title,
        status: newVideo.status,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const allVideos = await Video.find({ status: 'ready' })
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, videos: allVideos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const videoData = await Video.findById(req.params.id).populate(
      'uploadedBy',
      'name email'
    );

    if (!videoData) {
      return res
        .status(404)
        .json({ success: false, message: 'Video not found' });
    }

    videoData.views += 1;
    await videoData.save();

    res.json({ success: true, video: videoData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const videoToDelete = await Video.findById(req.params.id);

    if (!videoToDelete) {
      return res
        .status(404)
        .json({ success: false, message: 'Video not found' });
    }

    const isOwner = videoToDelete.uploadedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized' });
    }

    if (videoToDelete.cloudinaryId) {
      await cloudinary.uploader.destroy(videoToDelete.cloudinaryId, {
        resource_type: 'video',
      });
    }

    await videoToDelete.deleteOne();

    res.json({ success: true, message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
