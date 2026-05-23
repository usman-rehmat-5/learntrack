const mongoose = require('mongoose');

const userPurchaseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopItem', required: true },
  itemName: { type: String, required: true },
  itemIcon: { type: String, default: '🎁' },
  category: { type: String, default: 'other' },
  price: { type: Number, required: true }
}, { timestamps: true });

userPurchaseSchema.index({ userId: 1, itemId: 1 }, { unique: true });

module.exports = mongoose.model('UserPurchase', userPurchaseSchema);
