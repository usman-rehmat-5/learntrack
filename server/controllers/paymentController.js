const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const User = require('../models/User');
const { checkPremiumMemberBadge } = require('./badgeController');

const PREMIUM_PLANS = [
  {
    id: 'premium-monthly',
    name: 'Premium Monthly',
    price: 499,
    currency: 'INR',
    durationDays: 30,
    features: [
      'concurrent_courses', 'premium_badges', 'advanced_analytics',
      'downloads', 'priority_support', 'premium_courses', 'exclusive_shop_items'
    ]
  },
  {
    id: 'premium-yearly',
    name: 'Premium Yearly',
    price: 3999,
    currency: 'INR',
    durationDays: 365,
    features: [
      'concurrent_courses', 'premium_badges', 'advanced_analytics',
      'downloads', 'priority_support', 'premium_courses', 'exclusive_shop_items'
    ],
    popular: true
  }
];

let razorpayInstance = null;
function getRazorpay() {
  if (!razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay keys not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env');
    }
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  }
  return razorpayInstance;
}

exports.createOrder = async (req, res) => {
  try {
    const { planId } = req.body;
    const plan = PREMIUM_PLANS.find(p => p.id === planId);
    if (!plan) return res.status(400).json({ message: 'Invalid plan' });

    const options = {
      amount: plan.price * 100,
      currency: plan.currency,
      receipt: `premium_${req.user.id}_${Date.now()}`,
      notes: {
        userId: req.user.id.toString(),
        planId: plan.id,
        planName: plan.name
      }
    };

    const order = await getRazorpay().orders.create(options);

    const payment = await Payment.create({
      userId: req.user.id,
      planId: plan.id,
      planName: plan.name,
      amount: plan.price,
      currency: plan.currency,
      status: 'created',
      razorpayOrderId: order.id,
      durationDays: plan.durationDays
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      paymentId: payment._id,
      plan: {
        id: plan.id,
        name: plan.name,
        price: plan.price,
        durationDays: plan.durationDays,
        features: plan.features
      }
    });
  } catch (error) {
    console.error('Razorpay order error:', error);
    res.status(500).json({ message: 'Failed to create payment order' });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, paymentId } = req.body;

    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      await Payment.findByIdAndUpdate(paymentId, { status: 'failed' });
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: 'Payment record not found' });

    payment.status = 'paid';
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;

    const now = new Date();
    const user = await User.findById(req.user.id);

    let startDate = now;
    if (user.subscriptionTier === 'premium' && user.subscriptionEndDate && user.subscriptionEndDate > now) {
      startDate = user.subscriptionEndDate;
    }

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + payment.durationDays);

    payment.subscriptionStartDate = startDate;
    payment.subscriptionEndDate = endDate;

    const plan = PREMIUM_PLANS.find(p => p.id === payment.planId);
    const features = plan ? plan.features : [];

    user.subscriptionTier = 'premium';
    user.subscriptionStartDate = user.subscriptionTier === 'premium' && user.subscriptionStartDate
      ? user.subscriptionStartDate
      : now;
    user.subscriptionEndDate = endDate;
    user.premiumFeatures = [...new Set([...(user.premiumFeatures || []), ...features])];

    await user.save();
    await payment.save();
    await checkPremiumMemberBadge(req.user.id);

    res.json({
      message: `Payment successful! Upgraded to ${payment.planName}!`,
      tier: user.subscriptionTier,
      startDate: user.subscriptionStartDate,
      endDate: user.subscriptionEndDate,
      features: user.premiumFeatures,
      paymentId: payment._id
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: 'Payment verification failed' });
  }
};

exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
