const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    title:    { type: String },
    subtitle: { type: String },
    image:    { type: String, required: true }, // Cloudinary URL
    link:     { type: String },  // where to go on click
    buttonText: { type: String, default: 'Shop Now' },
    isActive: { type: Boolean, default: true },
    order:    { type: Number, default: 0 }, // slider order
  },
  { timestamps: true }
);

module.exports = mongoose.model('Banner', bannerSchema);
