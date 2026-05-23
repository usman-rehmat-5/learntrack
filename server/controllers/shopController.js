const ShopItem = require('../models/ShopItem');
const UserPurchase = require('../models/UserPurchase');
const User = require('../models/User');
const PointsTransaction = require('../models/PointsTransaction');

exports.getShopItems = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.user.subscriptionTier !== 'premium') {
      filter.isPremium = { $ne: true };
    }
    const items = await ShopItem.find(filter).sort({ price: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.purchaseItem = async (req, res) => {
  try {
    const { itemId } = req.body;
    const item = await ShopItem.findById(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (!item.isActive) return res.status(400).json({ message: 'Item not available' });
    if (item.isPremium && req.user.subscriptionTier !== 'premium') {
      return res.status(403).json({
        message: 'Premium subscription required to purchase this item.',
        requiresPremium: true
      });
    }

    const existing = await UserPurchase.findOne({ userId: req.user.id, itemId });
    if (existing) return res.status(400).json({ message: 'Already purchased' });

    const user = await User.findById(req.user.id);
    if (user.points < item.price) return res.status(400).json({ message: 'Not enough points' });

    await User.findByIdAndUpdate(req.user.id, { $inc: { points: -item.price } });

    await PointsTransaction.create({
      userId: req.user.id, amount: item.price, type: 'spent',
      reason: `Purchased: ${item.name}`, reference: itemId.toString(),
      metadata: { itemName: item.name }
    });

    const purchase = await UserPurchase.create({
      userId: req.user.id, itemId, itemName: item.name,
      itemIcon: item.icon, category: item.category, price: item.price
    });

    if (item.stock > 0) {
      await ShopItem.findByIdAndUpdate(itemId, { $inc: { stock: -1 } });
    }

    const updatedUser = await User.findById(req.user.id).select('points');

    res.json({ purchase, points: updatedUser.points });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserPurchases = async (req, res) => {
  try {
    const purchases = await UserPurchase.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: create shop item
exports.createShopItem = async (req, res) => {
  try {
    const item = await ShopItem.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: update shop item
exports.updateShopItem = async (req, res) => {
  try {
    const item = await ShopItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: delete shop item
exports.deleteShopItem = async (req, res) => {
  try {
    await ShopItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Seed default shop items (admin)
exports.seedShopItems = async (req, res) => {
  try {
    const existing = await ShopItem.countDocuments();
    if (existing > 0) return res.json({ message: 'Shop items already exist', count: existing });

    const items = [
      { name: 'Bronze Badge Frame', description: 'A shiny bronze frame for your badges', price: 100, icon: '🥉', category: 'avatar_frame', rarity: 'common' },
      { name: 'Silver Badge Frame', description: 'An elegant silver frame', price: 250, icon: '🥈', category: 'avatar_frame', rarity: 'rare' },
      { name: 'Gold Badge Frame', description: 'A luxurious gold frame', price: 500, icon: '🥇', category: 'avatar_frame', rarity: 'epic' },
      { name: 'Diamond Name Color', description: 'Your name sparkles in diamond blue', price: 150, icon: '💎', category: 'theme', rarity: 'rare' },
      { name: 'Neon Name Color', description: 'Bright neon green name color', price: 200, icon: '✨', category: 'theme', rarity: 'rare' },
      { name: 'Certificate: Gold Border', description: 'Premium gold border on certificates', price: 300, icon: '🏅', category: 'certificate_style', rarity: 'epic' },
      { name: 'Certificate: Dark Mode', description: 'Elegant dark certificate style', price: 250, icon: '🌙', category: 'certificate_style', rarity: 'rare' },
      { name: 'Title: Scholar', description: 'Unlock the "Scholar" title', price: 400, icon: '📜', category: 'title', rarity: 'epic' },
      { name: 'Title: Champion', description: 'Unlock the "Champion" title', price: 600, icon: '🏆', category: 'title', rarity: 'legendary' },
      { name: 'Custom Badge: Star Learner', description: 'A special star learner badge for your profile', price: 200, icon: '⭐', category: 'badge', rarity: 'rare' },
      { name: 'Custom Badge:知识 Explorer', description: 'Knowledge explorer exclusive badge', price: 350, icon: '🌍', category: 'badge', rarity: 'epic' },
    ];

    const premiumItems = [
      { name: 'Legendary Name Color', description: 'Exclusive premium gold name color', price: 500, icon: '✨', category: 'theme', rarity: 'legendary', isPremium: true },
      { name: 'Platinum Badge Frame', description: 'Rare platinum frame for your profile', price: 800, icon: '🏆', category: 'avatar_frame', rarity: 'legendary', isPremium: true },
      { name: 'Certificate: Premium Gold', description: 'Premium gold-plated certificate style', price: 600, icon: '🏅', category: 'certificate_style', rarity: 'legendary', isPremium: true },
      { name: 'Title: Grandmaster', description: 'Unlock the exclusive Grandmaster title', price: 1000, icon: '👑', category: 'title', rarity: 'legendary', isPremium: true },
      { name: 'Custom Badge: Elite', description: 'Exclusive elite learner badge', price: 500, icon: '💎', category: 'badge', rarity: 'legendary', isPremium: true },
    ];

    await ShopItem.insertMany([...items, ...premiumItems]);
    res.status(201).json({ message: 'Shop items seeded', count: items.length + premiumItems.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
