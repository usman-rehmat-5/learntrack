const PushSubscription = require('../models/PushSubscription');
let webpush = null;
let vapidReady = false;

function initWebpush() {
  if (webpush !== null) return;
  try {
    webpush = require('web-push');
    const publicKey = process.env.VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    if (publicKey && privateKey) {
      webpush.setVapidDetails('mailto:admin@learntrack.app', publicKey, privateKey);
      vapidReady = true;
    } else {
      console.log('Push notifications: VAPID keys not configured');
    }
  } catch (e) {
    console.log('Push notifications: web-push not available');
  }
}

exports.subscribe = async (req, res) => {
  try {
    const { endpoint, keys } = req.body;
    if (!endpoint || !keys) return res.status(400).json({ message: 'Invalid subscription' });

    const existing = await PushSubscription.findOne({ endpoint });
    if (existing) {
      existing.userId = req.user.id;
      existing.keys = keys;
      await existing.save();
      return res.json({ message: 'Subscription updated' });
    }

    await PushSubscription.create({
      userId: req.user.id,
      endpoint,
      keys,
      userAgent: req.headers['user-agent'] || ''
    });

    res.status(201).json({ message: 'Subscribed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.unsubscribe = async (req, res) => {
  try {
    const { endpoint } = req.body;
    await PushSubscription.deleteOne({ endpoint });
    res.json({ message: 'Unsubscribed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.sendNotification = async (req, res) => {
  try {
    initWebpush();
    if (!vapidReady || !webpush) {
      return res.status(400).json({ message: 'Push notifications not configured. Set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY in .env' });
    }

    const { userId, title, body, icon, url } = req.body;
    const query = userId ? { userId } : {};
    const subscriptions = await PushSubscription.find(query);

    if (subscriptions.length === 0) {
      return res.json({ sent: 0, message: 'No subscriptions found' });
    }

    const payload = JSON.stringify({
      title: title || 'LearnTrack',
      body: body || '',
      icon: icon || '/icons/icon-192.svg',
      data: { url: url || '/dashboard' }
    });

    const results = await Promise.allSettled(
      subscriptions.map(sub =>
        webpush.sendNotification(sub.toObject(), payload).catch(async (err) => {
          if (err.statusCode === 410 || err.statusCode === 404) {
            await PushSubscription.deleteOne({ endpoint: sub.endpoint });
          }
        })
      )
    );

    res.json({ sent: results.filter(r => r.status === 'fulfilled').length });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMySubscriptions = async (req, res) => {
  try {
    const subs = await PushSubscription.find({ userId: req.user.id });
    res.json(subs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
