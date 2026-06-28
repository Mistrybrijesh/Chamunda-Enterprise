const router = require('express').Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Customer = require('../models/Customer');

const signToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// ── Admin Login ──────────────────────────────────────────────
// POST /api/auth/admin/login
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }
    const admin = await Admin.findOne({ email, isActive: true });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = signToken(admin._id, admin.role);
    res.json({ success: true, token, admin });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Admin Register (one-time setup / superadmin only) ────────
// POST /api/auth/admin/register
router.post('/admin/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Admin already exists' });
    }
    const admin = await Admin.create({ name, email, password, role });
    const token = signToken(admin._id, admin.role);
    res.status(201).json({ success: true, token, admin });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Customer Register ────────────────────────────────────────
// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const existing = await Customer.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    const customer = await Customer.create({ name, email, password, phone });
    const token = signToken(customer._id, 'customer');
    res.status(201).json({ success: true, token, customer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Customer Login ────────────────────────────────────────────
// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }
    const customer = await Customer.findOne({ email, isActive: true });
    if (!customer || !(await customer.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = signToken(customer._id, 'customer');
    res.json({ success: true, token, customer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
