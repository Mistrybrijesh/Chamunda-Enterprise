const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

// ─── Check if Cloudinary is properly configured ───────────────
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || '';
const isCloudinaryConfigured =
  cloudName && cloudName !== 'your_cloud_name' && cloudName.trim() !== '';

let upload;
let storageMode;

if (isCloudinaryConfigured) {
  // ── Cloudinary storage ──────────────────────────────────────
  const cloudinary           = require('cloudinary').v2;
  const { CloudinaryStorage } = require('multer-storage-cloudinary');

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder:           'furniture',
      allowed_formats:  ['jpg', 'jpeg', 'png', 'webp'],
      transformation:   [{ width: 1200, crop: 'limit', quality: 'auto' }],
    },
  });

  upload      = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });
  storageMode = 'cloudinary';
  console.log('🖼️  Image storage: Cloudinary');

} else {
  // ── Local disk storage fallback ─────────────────────────────
  const uploadDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename:    (_req, file, cb) => {
      const ext  = path.extname(file.originalname);
      const name = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
      cb(null, name);
    },
  });

  upload      = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });
  storageMode = 'local';
  console.log('🖼️  Image storage: Local disk (set CLOUDINARY_CLOUD_NAME in .env to use Cloudinary)');
}

module.exports = { upload, storageMode };
