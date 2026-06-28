const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, min: 0 }, // original price (for discount display)
    images: [{ type: String }], // Cloudinary URLs
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    description: { type: String },
    stock: { type: Number, default: 0, min: 0 },
    dimensions: {
      length: { type: Number },
      width:  { type: Number },
      height: { type: Number },
      unit: { type: String, default: 'cm' },
    },
    material: { type: String },
    colors: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    ratings: {
      average: { type: Number, default: 0 },
      count:   { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// Auto-generate slug from name if not provided
productSchema.pre('validate', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
