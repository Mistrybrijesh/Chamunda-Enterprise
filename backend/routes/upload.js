const router = require('express').Router();
const { upload, storageMode } = require('../middleware/cloudinaryConfig');
const { protectAdmin }        = require('../middleware/authMiddleware');

// Helper: resolve final public URL for a file
const resolveUrl = (file) => {
  if (storageMode === 'cloudinary') {
    return { url: file.path, public_id: file.filename };
  }
  // Local disk — build an absolute URL the browser can fetch
  const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
  const baseUrl =
    process.env.BACKEND_URL ||
    (isProduction
      ? 'https://chamunda-enterprise-gamma.vercel.app'
      : `http://localhost:${process.env.PORT || 5000}`);
  return { url: `${baseUrl}/uploads/${file.filename}`, public_id: file.filename };
};

const ensureUploadStorage = (res) => {
  if (
    storageMode === 'local' &&
    (process.env.VERCEL === '1' || process.env.NODE_ENV === 'production')
  ) {
    res.status(503).json({
      success: false,
      message: 'Image storage is not configured. Set Cloudinary environment variables.',
    });
    return false;
  }
  return true;
};

// POST /api/upload — Upload single image (Admin only)
router.post('/', protectAdmin, (req, res) => {
  if (!ensureUploadStorage(res)) return;
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Single upload error:', err.message);
      return res.status(400).json({ success: false, message: err.message || 'Upload failed' });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    const { url, public_id } = resolveUrl(req.file);
    res.json({ success: true, url, public_id });
  });
});

// POST /api/upload/multiple — Upload multiple images (Admin only)
router.post('/multiple', protectAdmin, (req, res) => {
  if (!ensureUploadStorage(res)) return;
  upload.array('images', 20)(req, res, (err) => {
    if (err) {
      console.error('Multiple upload error:', err.message);
      return res.status(400).json({ success: false, message: err.message || 'Upload failed' });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }
    const images = req.files.map(resolveUrl);
    res.json({ success: true, images });
  });
});

module.exports = router;
