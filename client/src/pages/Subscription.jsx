import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaCrown, FaCheck, FaStar, FaInfinity, FaDownload, FaShieldAlt, FaChartBar, FaGem, FaSpinner } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const FEATURE_ICONS = {
  concurrent_courses: <FaInfinity />,
  premium_badges: <FaGem />,
  advanced_analytics: <FaChartBar />,
  downloads: <FaDownload />,
  priority_support: <FaShieldAlt />,
  premium_courses: <FaStar />,
  exclusive_shop_items: <FaGem />
};

const FEATURE_LABELS = {
  concurrent_courses: 'Multiple Courses at Once',
  premium_badges: 'Exclusive Premium Badges',
  advanced_analytics: 'Advanced Learning Analytics',
  downloads: 'Download Lectures',
  priority_support: 'Priority Support',
  premium_courses: 'Access Premium Courses',
  exclusive_shop_items: 'Exclusive Shop Items'
};

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function Subscription() {
  const { token, user, updateUser, api } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [mySub, setMySub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [processing, setProcessing] = useState('');

  const bgPrimary = isDark ? 'bg-gray-900' : 'bg-gray-100';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  useEffect(() => {
    fetchData();
    loadRazorpayScript();
  }, []);

  const fetchData = async () => {
    try {
      const [plansRes, subRes] = await Promise.all([
        api.get('/subscription/plans'),
        api.get('/subscription/my')
      ]);
      setPlans(plansRes.data);
      setMySub(subRes.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (planId) => {
    try {
      setProcessing(planId);

      const ready = await loadRazorpayScript();
      if (!ready) {
        setMsg('Failed to load payment gateway. Please try again.');
        setProcessing('');
        return;
      }

      const orderRes = await api.post('/payment/create-order', { planId });
      const { orderId, amount, currency, keyId, plan } = orderRes.data;

      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: 'LearnTrack',
        description: plan.name,
        order_id: orderId,
        handler: async function (response) {
          try {
            const verifyRes = await api.post('/payment/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              paymentId: orderRes.data.paymentId
            });

            setMySub(prev => ({
              ...prev,
              tier: 'premium',
              isActive: true,
              features: verifyRes.data.features,
              endDate: verifyRes.data.endDate,
              startDate: verifyRes.data.startDate,
              daysRemaining: plan.durationDays
            }));

            if (user) {
              updateUser({ ...user, subscriptionTier: 'premium', premiumFeatures: verifyRes.data.features });
            }

            setMsg('Payment successful! Welcome to Premium! 🎉');
            setTimeout(() => setMsg(''), 5000);
          } catch (err) {
            setMsg('Payment verified but upgrade failed. Contact support.');
            setTimeout(() => setMsg(''), 5000);
          }
          setProcessing('');
        },
        modal: {
          ondismiss: function () {
            setProcessing('');
            setMsg('Payment cancelled.');
            setTimeout(() => setMsg(''), 3000);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || ''
        },
        theme: {
          color: '#F59E0B'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setMsg('Payment failed: ' + (response.error?.description || 'Please try again.'));
        setProcessing('');
      });
      rzp.open();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to initiate payment');
      setProcessing('');
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const handleCancel = async () => {
    try {
      await api.post('/subscription/cancel');
      setMySub(prev => ({ ...prev, tier: 'free', isActive: false, features: [] }));
      if (user) {
        updateUser({ ...user, subscriptionTier: 'free', premiumFeatures: [] });
      }
      setMsg('Subscription cancelled');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg('Cancel failed');
      setTimeout(() => setMsg(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${bgPrimary} ${textPrimary} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={textSecondary}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgPrimary} ${textPrimary} transition-colors duration-300`}>
      <div className="max-w-5xl mx-auto px-6 py-10">
        {msg && (
          <div className={`p-4 rounded-2xl mb-6 text-sm font-semibold text-white text-center`}
            style={{ backgroundColor: msg.includes('Welcome') ? '#22C55E' : '#EF4444' }}>
            {msg}
            <button onClick={() => setMsg('')} className="ml-3"><MdClose className="inline" /></button>
          </div>
        )}

        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
              <FaCrown className="text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-2">Upgrade to Premium</h2>
          <p className={textSecondary}>Unlock exclusive features and accelerate your learning journey</p>
        </div>

        {mySub?.isActive && (
          <div className={`${cardBg} border border-yellow-500 p-6 rounded-2xl mb-8 text-center`}>
            <FaCrown className="text-yellow-500 text-4xl mx-auto mb-2" />
            <h3 className="text-xl font-bold">You're a Premium Member!</h3>
            <p className={textSecondary}>{mySub.daysRemaining} days remaining</p>
            <button onClick={handleCancel}
              className="mt-3 px-4 py-2 text-sm rounded-xl font-semibold bg-red-500 text-white hover:bg-red-600 transition">
              Cancel Subscription
            </button>
          </div>
        )}

        {!mySub?.isActive && (
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {plans.map(plan => (
              <div key={plan.id}
                className={`${cardBg} rounded-2xl border ${plan.popular ? 'border-yellow-500' : borderColor} p-6 relative transition hover:shadow-lg`}>
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
                    Most Popular
                  </span>
                )}
                <div className="text-center mb-6 mt-2">
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-4xl font-bold mt-2" style={{ color: '#F59E0B' }}>
                    ₹{plan.price}
                  </p>
                  <p className={`text-sm ${textSecondary}`}>{plan.durationDays} days</p>
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-center gap-3 text-sm">
                      <span className="text-yellow-500">{FEATURE_ICONS[f] || <FaCheck />}</span>
                      <span>{FEATURE_LABELS[f] || f}</span>
                    </div>
                  ))}
                </div>

                <button onClick={() => handlePayment(plan.id)}
                  disabled={processing === plan.id}
                  className="w-full py-3 rounded-xl font-bold text-white transition flex items-center justify-center gap-2 disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
                  {processing === plan.id ? <><FaSpinner className="animate-spin" /> Processing...</> : 'Upgrade Now — ₹' + plan.price}
                </button>
              </div>
            ))}
          </div>
        )}

        <div className={`${cardBg} rounded-2xl border ${borderColor} p-6`}>
          <h3 className="text-lg font-bold mb-4">Premium Features</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(FEATURE_LABELS).map(([key, label]) => (
              <div key={key} className={`flex items-start gap-3 p-3 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <span className="text-yellow-500 mt-0.5">{FEATURE_ICONS[key] || <FaCheck />}</span>
                <div>
                  <p className="font-semibold text-sm">{label}</p>
                  <p className={`text-xs ${textSecondary}`}>
                    {key === 'concurrent_courses' && 'Learn multiple courses simultaneously'}
                    {key === 'premium_badges' && 'Unlock exclusive premium badges'}
                    {key === 'advanced_analytics' && 'In-depth learning insights and reports'}
                    {key === 'downloads' && 'Download lectures for offline viewing'}
                    {key === 'priority_support' && 'Get priority assistance from our team'}
                    {key === 'premium_courses' && 'Access to premium-only courses'}
                    {key === 'exclusive_shop_items' && 'Rare and legendary items in points shop'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Subscription;
