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
      'concurrent_courses',
      'premium_badges',
      'advanced_analytics',
      'downloads',
      'priority_support',
      'premium_courses',
      'exclusive_shop_items'
    ]
  },
  {
    id: 'premium-yearly',
    name: 'Premium Yearly',
    price: 3999,
    currency: 'INR',
    durationDays: 365,
    features: [
      'concurrent_courses',
      'premium_badges',
      'advanced_analytics',
      'downloads',
      'priority_support',
      'premium_courses',
      'exclusive_shop_items'
    ],
    popular: true
  }
];

exports.getPlans = (req, res) => {
  res.json(PREMIUM_PLANS);
};

exports.getMySubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      'subscriptionTier subscriptionStartDate subscriptionEndDate premiumFeatures'
    );

    const isActive = user.subscriptionTier === 'premium' &&
      user.subscriptionEndDate &&
      new Date(user.subscriptionEndDate) > new Date();

    res.json({
      tier: user.subscriptionTier,
      isActive: !!isActive,
      startDate: user.subscriptionStartDate,
      endDate: user.subscriptionEndDate,
      features: user.premiumFeatures || [],
      daysRemaining: isActive
        ? Math.ceil((new Date(user.subscriptionEndDate) - new Date()) / (1000 * 60 * 60 * 24))
        : 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.upgradeToPremium = async (req, res) => {
  try {
    const { planId } = req.body;

    const plan = PREMIUM_PLANS.find(p => p.id === planId);
    if (!plan) return res.status(400).json({ message: 'Invalid plan' });

    const user = await User.findById(req.user.id);

    const now = new Date();
    let startDate = now;

    if (user.subscriptionTier === 'premium' && user.subscriptionEndDate && user.subscriptionEndDate > now) {
      startDate = user.subscriptionEndDate;
    }

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + plan.durationDays);

    user.subscriptionTier = 'premium';
    user.subscriptionStartDate = user.subscriptionTier === 'premium' && user.subscriptionStartDate
      ? user.subscriptionStartDate
      : now;
    user.subscriptionEndDate = endDate;
    user.premiumFeatures = [...new Set([...(user.premiumFeatures || []), ...plan.features])];
    await user.save();

    await checkPremiumMemberBadge(req.user.id);

    res.json({
      message: `Upgraded to ${plan.name}!`,
      tier: user.subscriptionTier,
      startDate: user.subscriptionStartDate,
      endDate: user.subscriptionEndDate,
      features: user.premiumFeatures
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.subscriptionTier = 'free';
    user.premiumFeatures = [];
    await user.save();

    res.json({ message: 'Subscription cancelled. You will continue until the end of the billing period.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPremiumUsers = async (req, res) => {
  try {
    const users = await User.find({ subscriptionTier: 'premium' })
      .select('name email subscriptionStartDate subscriptionEndDate premiumFeatures')
      .sort({ subscriptionEndDate: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.setUserPremium = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { tier, durationDays } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const allFeatures = [
      'concurrent_courses', 'premium_badges', 'advanced_analytics',
      'downloads', 'priority_support', 'premium_courses', 'exclusive_shop_items'
    ];

    if (tier === 'premium') {
      const now = new Date();
      const endDate = new Date(now);
      endDate.setDate(endDate.getDate() + (durationDays || 30));

      user.subscriptionTier = 'premium';
      user.subscriptionStartDate = now;
      user.subscriptionEndDate = endDate;
      user.premiumFeatures = allFeatures;
    } else {
      user.subscriptionTier = 'free';
      user.subscriptionStartDate = null;
      user.subscriptionEndDate = null;
      user.premiumFeatures = [];
    }

    await user.save();

    if (tier === 'premium') {
      await checkPremiumMemberBadge(userId);
    }

    res.json({
      message: `User ${tier === 'premium' ? 'upgraded to premium' : 'downgraded to free'}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscriptionTier: user.subscriptionTier,
        subscriptionEndDate: user.subscriptionEndDate
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
