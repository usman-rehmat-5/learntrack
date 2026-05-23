const express = require('express');
const router = express.Router();
const {
  getShopItems, purchaseItem, getUserPurchases,
  createShopItem, updateShopItem, deleteShopItem, seedShopItems
} = require('../controllers/shopController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/items', protect, getShopItems);
router.post('/purchase', protect, purchaseItem);
router.get('/purchases', protect, getUserPurchases);

// Admin
router.post('/items', protect, adminOnly, createShopItem);
router.put('/items/:id', protect, adminOnly, updateShopItem);
router.delete('/items/:id', protect, adminOnly, deleteShopItem);
router.post('/seed', protect, adminOnly, seedShopItems);

module.exports = router;
