const router = require('express').Router();
const Customer = require('../models/Customer');
const { protectAdmin, protectCustomer } = require('../middleware/authMiddleware');

// GET /api/customers — Admin only
router.get('/', protectAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const filter = search ? { name: { $regex: search, $options: 'i' } } : {};
    const skip = (Number(page) - 1) * Number(limit);
    const [customers, total] = await Promise.all([
      Customer.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Customer.countDocuments(filter),
    ]);
    res.json({ success: true, customers, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/customers/me — Customer: own profile
router.get('/me', protectCustomer, async (req, res) => {
  res.json({ success: true, customer: req.customer });
});

// PUT /api/customers/me — Customer: update own profile
router.put('/me', protectCustomer, async (req, res) => {
  try {
    const { name, phone, addresses } = req.body;
    const customer = await Customer.findByIdAndUpdate(
      req.customer._id, { name, phone, addresses }, { new: true }
    );
    res.json({ success: true, customer });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET /api/customers/:id — Admin only
router.get('/:id', protectAdmin, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
    res.json({ success: true, customer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
