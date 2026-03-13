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

    console.log('Starting video upload to Cloudinary...');
    console.log('File size:', videoFile.size, 'bytes');
    console.log('File type:', videoFile.mimetype);

    // Upload to Cloudinary synchronously
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'video',
          folder: 'success-mantra/videos',
          timeout: 120000, // 2 minutes timeout
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('Cloudinary upload success:', result.public_id);
            resolve(result);
          }
        }
      );
      streamifier.createReadStream(videoFile.buffer).pipe(uploadStream);
    });

    const result = await uploadPromise;

    // Create thumbnail URL by changing extension to .jpg
    const videoUrl = result.secure_url;
    const lastDotIndex = videoUrl.lastIndexOf('.');
    let thumbnailUrl = videoUrl;
    if (lastDotIndex > 0) {
      thumbnailUrl = videoUrl.substring(0, lastDotIndex) + '.jpg';
    }

    // Create video with URL immediately available
    const newVideo = await Video.create({
      title,
      description,
      uploadedBy: req.user._id,
      status: 'ready',
      cloudinaryId: result.public_id,
      videoUrl: result.secure_url,
      hlsUrl: result.secure_url,
      thumbnail: thumbnailUrl,
      duration: result.duration || 0,
    });

    console.log('Video saved to database:', newVideo._id);
    console.log('Video URL:', newVideo.videoUrl);

    res.json({
      success: true,
      message: 'Video uploaded successfully',
      video: {
        id: newVideo._id,
        title: newVideo.title,
        status: newVideo.status,
        videoUrl: newVideo.videoUrl,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Upload failed',
      error: error.toString()
    });
  }
});

router.get('/stats', protect, async (req, res) => {
  try {
    const count = await Video.countDocuments();
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/', protect, async (req, res) => {
  try {
    let query = {};
    
    // If user is not admin, only show ready videos
    if (req.user.role !== 'admin') {
      query.status = 'ready';
    }
    
    const allVideos = await Video.find(query)
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
