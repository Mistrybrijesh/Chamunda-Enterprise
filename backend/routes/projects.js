const router = require('express').Router();
const Project = require('../models/Project');
const { protectAdmin } = require('../middleware/authMiddleware');

// GET /api/projects — Public
router.get('/', async (req, res) => {
  try {
    const all = req.query.all === 'true';
    const filter = all ? {} : { isActive: true };
    const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/projects — Admin only
router.post('/', protectAdmin, async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json({ success: true, project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/projects/:id — Admin only
router.put('/:id', protectAdmin, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PATCH /api/projects/:id/images — Update gallery images (Admin only)
router.patch('/:id/images', protectAdmin, async (req, res) => {
  try {
    const { images } = req.body; // array of image URLs
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { images: Array.isArray(images) ? images : [] },
      { new: true }
    );
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, project });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/projects/:id — Admin only
router.delete('/:id', protectAdmin, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
