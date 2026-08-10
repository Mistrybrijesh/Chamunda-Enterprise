const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title:    { type: String, required: true },
    category: { type: String, default: 'Residential' },
    location: { type: String },
    year:     { type: String },
    image:    { type: String, required: true },
    images:   { type: [String], default: [] },
    desc:     { type: String },
    isActive: { type: Boolean, default: true },
    order:    { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
