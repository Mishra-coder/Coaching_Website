import { v2 as cloudinary } from 'cloudinary';

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log('Cloudinary Config Check:');
console.log('CLOUD_NAME:', cloudName);
console.log('API_KEY:', apiKey);
console.log('API_SECRET:', apiSecret ? 'Set' : 'Not Set');

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export default cloudinary;
