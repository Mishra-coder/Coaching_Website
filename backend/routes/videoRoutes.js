import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Video from '../models/Video.js';
import { protect } from '../middleware/auth.js';
import { convertToHLS, generateThumbnail, getVideoDuration } from '../utils/videoProcessor.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/videos/original';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 500 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /mp4|avi|mov|mkv|quicktime/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname || mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only video files allowed'));
        }
    }
});

router.post('/upload', protect, upload.single('video'), async (req, res) => {
    try {
        const { title, description } = req.body;
        const videoFile = req.file;

        if (!videoFile) {
            return res.status(400).json({ success: false, message: 'No video file uploaded' });
        }

        const video = await Video.create({
            title,
            description,
            originalFile: videoFile.path,
            uploadedBy: req.user._id,
            status: 'processing'
        });

        const outputFolder = `uploads/videos/hls/${video._id}`;
        const thumbnailPath = path.join(outputFolder, 'thumbnail.jpg');

        convertToHLS(videoFile.path, outputFolder, video._id)
            .then(async (hlsPath) => {
                const duration = await getVideoDuration(videoFile.path);
                await generateThumbnail(videoFile.path, thumbnailPath);

                video.hlsPath = hlsPath;
                video.duration = duration;
                video.thumbnail = thumbnailPath;
                video.status = 'ready';
                await video.save();
            })
            .catch(async (err) => {
                video.status = 'failed';
                await video.save();
                console.error('Processing failed:', err);
            });

        res.json({
            success: true,
            message: 'Video uploaded and processing started',
            video: {
                id: video._id,
                title: video.title,
                status: video.status
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const videos = await Video.find({ status: 'ready' })
            .populate('uploadedBy', 'name email')
            .sort({ createdAt: -1 });

        res.json({ success: true, videos });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const video = await Video.findById(req.params.id)
            .populate('uploadedBy', 'name email');

        if (!video) {
            return res.status(404).json({ success: false, message: 'Video not found' });
        }

        video.views += 1;
        await video.save();

        res.json({ success: true, video });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.delete('/:id', protect, async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);

        if (!video) {
            return res.status(404).json({ success: false, message: 'Video not found' });
        }

        if (video.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        if (fs.existsSync(video.originalFile)) {
            fs.unlinkSync(video.originalFile);
        }

        const hlsFolder = path.dirname(video.hlsPath);
        if (fs.existsSync(hlsFolder)) {
            fs.rmSync(hlsFolder, { recursive: true });
        }

        await video.deleteOne();

        res.json({ success: true, message: 'Video deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
