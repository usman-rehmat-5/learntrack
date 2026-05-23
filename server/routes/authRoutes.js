const express = require('express');
const router = express.Router();
const {
  register, login, verify2FALogin, updateProfile, changePassword, updateAvatar,
  forgotPassword, resetPassword, verifyEmail, resendVerification,
  setup2FA, enable2FA, disable2FA, logoutAllDevices, getMe
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer setup for avatars
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars/');
  },
  filename: (req, file, cb) => {
    cb(null, `avatar-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    if (ext) cb(null, true);
    else cb(new Error('Only image files allowed'));
  },
  limits: { fileSize: 2 * 1024 * 1024 }
});

// Auth
router.post('/register', register);
router.post('/login', login);
router.post('/verify-2fa-login', verify2FALogin);

// Password reset
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Email verification
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', protect, resendVerification);

// 2FA
router.get('/setup-2fa', protect, setup2FA);
router.post('/enable-2fa', protect, enable2FA);
router.post('/disable-2fa', protect, disable2FA);

// Session
router.post('/logout-all', protect, logoutAllDevices);
router.get('/me', protect, getMe);

// Profile
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.post('/avatar', protect, upload.single('avatar'), updateAvatar);

module.exports = router;
