const mongoose = require('mongoose');

const shopItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  icon: { type: String, default: '🎁' },
  category: { type: String, enum: ['badge', 'avatar_frame', 'theme', 'certificate_style', 'title', 'other'], default: 'other' },
  stock: { type: Number, default: -1 },
  isActive: { type: Boolean, default: true },
  rarity: { type: String, enum: ['common', 'rare', 'epic', 'legendary'], default: 'common' },
  isPremium: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('ShopItem', shopItemSchema);
