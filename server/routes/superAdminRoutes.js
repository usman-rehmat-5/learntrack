const express = require('express');
const router = express.Router();
const {
  getAllUsers, changeRole, toggleUserStatus,
  deleteUser, getStats, updateUser,
  batchToggle, getActivityLogs, getUserDetail,
  getSystemHealth, getPremiumUsers, setUserPremium,
  getPremiumContent, toggleCoursePremium, toggleLecturePremium
} = require('../controllers/superAdminController');
const { protect, superAdminOnly } = require('../middleware/authMiddleware');

router.use(protect, superAdminOnly);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.put('/users/:id/role', changeRole);
router.put('/users/:id/toggle', toggleUserStatus);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/users/batch', batchToggle);
router.get('/activity', getActivityLogs);
router.get('/users/:id/detail', getUserDetail);
router.get('/health', getSystemHealth);

// Premium management
router.get('/premium/users', getPremiumUsers);
router.put('/premium/users/:userId', setUserPremium);
router.get('/premium/content', getPremiumContent);
router.put('/premium/courses/:id/toggle', toggleCoursePremium);
router.put('/premium/lectures/:id/toggle', toggleLecturePremium);

module.exports = router;
