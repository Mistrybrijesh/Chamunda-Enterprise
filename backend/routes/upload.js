const router = require('express').Router();
const { upload, storageMode } = require('../middleware/cloudinaryConfig');
const { protectAdmin }        = require('../middleware/authMiddleware');

// Helper: resolve final public URL for a file
const resolveUrl = (file) => {
  if (storageMode === 'cloudinary') {
    return { url: file.path, public_id: file.filename };
  }
  // Local disk — build an absolute URL the browser can fetch
  const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
  return { url: `${baseUrl}/uploads/${file.filename}`, public_id: file.filename };
};

// POST /api/upload — Upload single image (Admin only)
router.post('/', protectAdmin, (req, res) => {
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
