const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const { sendWelcomeEmail, sendVerificationEmail, sendResetPasswordEmail } = require('../utils/emailService');
const ActivityLog = require('../models/ActivityLog');

const signToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, tokenVersion: user.tokenVersion },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  emailVerified: user.emailVerified,
  twoFactorEnabled: user.twoFactorEnabled,
  subscriptionTier: user.subscriptionTier || 'free',
  premiumFeatures: user.premiumFeatures || [],
  subscriptionEndDate: user.subscriptionEndDate
});

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const userCount = await User.countDocuments();
    const role = userCount === 0 ? 'superadmin' : 'user';

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    try {
      await sendWelcomeEmail(user.email, user.name);
      await sendVerificationEmail(user.email, user.name, verificationToken);
    } catch (emailError) {
      console.error('Email send error:', emailError);
      console.log(`\n=== Verification URL (email failed) ===`);
      console.log(`http://localhost:5173/verify-email?token=${verificationToken}`);
      console.log(`========================================\n`);
    }

    const token = signToken(user);

    await ActivityLog.create({
      userId: user._id,
      action: 'register',
      metadata: { email: user.email }
    });

    res.status(201).json({
      token,
      user: formatUser(user)
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account disabled' });
    }

    if (user.twoFactorEnabled) {
      return res.json({ require2fa: true, tempToken: user._id.toString() });
    }

    user.lastLogin = new Date();
    await user.save();

    await ActivityLog.create({
      userId: user._id,
      action: 'login',
      metadata: { email: user.email }
    });

    const token = signToken(user);

    res.json({ token, user: formatUser(user) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify 2FA login step
exports.verify2FALogin = async (req, res) => {
  try {
    const { tempToken, twoFactorCode } = req.body;

    const user = await User.findById(tempToken);
    if (!user) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    if (!user.twoFactorEnabled || !user.twoFactorSecret) {
      return res.status(400).json({ message: '2FA not enabled' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: twoFactorCode,
      window: 1
    });

    if (!verified) {
      return res.status(400).json({ message: 'Invalid 2FA code' });
    }

    user.lastLogin = new Date();
    await user.save();

    await ActivityLog.create({
      userId: user._id,
      action: 'login',
      metadata: { email: user.email, twoFactor: true }
    });

    const token = signToken(user);
    res.json({ token, user: formatUser(user) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user: formatUser(user) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update avatar
exports.updateAvatar = async (req, res) => {
  try {
    const avatarPath = `/uploads/avatars/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: avatarPath },
      { new: true }
    ).select('-password');
    res.json({ user: formatUser(user) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: 'If that email exists, a reset link has been sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    try {
      await sendResetPasswordEmail(user.email, user.name, resetToken);
    } catch (emailError) {
      console.error('Reset email error:', emailError);
    }

    res.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    user.tokenVersion += 1;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify Email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Resend Verification Email
exports.resendVerification = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.emailVerified) return res.json({ message: 'Email already verified' });

    const verificationToken = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    try {
      await sendVerificationEmail(user.email, user.name, verificationToken);
    } catch (emailError) {
      console.error('Verification email error:', emailError);
    }

    res.json({ message: 'Verification email sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Setup 2FA - generate secret
exports.setup2FA = async (req, res) => {
  try {
    const secret = speakeasy.generateSecret({
      name: `LearnTrack (${req.user.email})`
    });

    const qrCode = await QRCode.toDataURL(secret.otpauth_url);

    res.json({
      secret: secret.base32,
      qrCode,
      otpauthUrl: secret.otpauth_url
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify & enable 2FA
exports.enable2FA = async (req, res) => {
  try {
    const { secret, twoFactorCode } = req.body;

    const verified = speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: twoFactorCode,
      window: 1
    });

    if (!verified) {
      return res.status(400).json({ message: 'Invalid 2FA code. Please try again.' });
    }

    const user = await User.findById(req.user.id);
    user.twoFactorSecret = secret;
    user.twoFactorEnabled = true;
    await user.save();

    res.json({ message: '2FA enabled successfully', user: formatUser(user) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Disable 2FA
exports.disable2FA = async (req, res) => {
  try {
    const { password, twoFactorCode } = req.body;
    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Password is incorrect' });

    if (user.twoFactorEnabled && user.twoFactorSecret) {
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: twoFactorCode,
        window: 1
      });
      if (!verified) return res.status(400).json({ message: 'Invalid 2FA code' });
    }

    user.twoFactorSecret = null;
    user.twoFactorEnabled = false;
    await user.save();

    res.json({ message: '2FA disabled successfully', user: formatUser(user) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Logout all devices
exports.logoutAllDevices = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.tokenVersion += 1;
    await user.save();

    res.json({ message: 'Logged out of all devices successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current user (refresh)
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ user: formatUser(user) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
