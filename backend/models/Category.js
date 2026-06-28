const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name:  { type: String, required: true, trim: true, unique: true },
    slug:  { type: String, required: true, unique: true, lowercase: true },
    image: { type: String }, // Cloudinary URL
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 }, // for display ordering
  },
  { timestamps: true }
);

categorySchema.pre('validate', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
