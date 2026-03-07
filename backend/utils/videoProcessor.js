import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';

export function convertToHLS(inputPath, outputFolder, videoId) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder, { recursive: true });
    }

    const outputPath = path.join(outputFolder, 'playlist.m3u8');

    ffmpeg(inputPath)
      .outputOptions([
        '-profile:v baseline',
        '-level 3.0',
        '-start_number 0',
        '-hls_time 10',
        '-hls_list_size 0',
        '-f hls',
      ])
      .output(outputPath)
      .on('end', () => {
        console.log(`Video ${videoId} converted successfully`);
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error(`Error converting video ${videoId}:`, err);
        reject(err);
      })
      .run();
  });
}

export function generateThumbnail(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .screenshots({
        timestamps: ['00:00:02'],
        filename: 'thumbnail.jpg',
        folder: path.dirname(outputPath),
        size: '640x360',
      })
      .on('end', () => {
        resolve(outputPath);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

export function getVideoDuration(inputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        resolve(metadata.format.duration);
      }
    });
  });
}
