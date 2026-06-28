const router = require('express').Router();
const Banner = require('../models/Banner');
const { protectAdmin } = require('../middleware/authMiddleware');

// GET /api/banners — Public (active banners only)
router.get('/', async (req, res) => {
  try {
    const all = req.query.all === 'true'; // admin can fetch all
    const filter = all ? {} : { isActive: true };
    const banners = await Banner.find(filter).sort({ order: 1 });
    res.json({ success: true, banners });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/banners — Admin only
router.post('/', protectAdmin, async (req, res) => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json({ success: true, banner });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/banners/:id — Admin only
router.put('/:id', protectAdmin, async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!banner) return res.status(404).json({ success: false, message: 'Banner not found' });
    res.json({ success: true, banner });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/banners/:id — Admin only
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Banner deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
