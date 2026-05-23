import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaShoppingCart, FaCalendarCheck, FaFire, FaLock, FaStar, FaMedal, FaCrown } from 'react-icons/fa';
import { MdStore, MdEmojiEvents } from 'react-icons/md';
import PremiumBadge from '../components/PremiumBadge';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const TABS = [
  { key: 'badges', label: 'Badges', icon: <MdEmojiEvents className="text-xl" /> },
  { key: 'shop', label: 'Shop', icon: <MdStore className="text-xl" /> },
  { key: 'challenges', label: 'Challenges', icon: <FaCalendarCheck className="text-xl" /> },
];

function Gamification() {
  const { token, user, api } = useAuth();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('badges');

  const bgPrimary = isDark ? 'bg-gray-900' : 'bg-gray-100';
  const cardBg = isDark ? 'bg-gray-800' : 'bg-white';
  const textPrimary = isDark ? 'text-white' : 'text-gray-900';
  const textSecondary = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';
  const inputBg = isDark ? 'bg-gray-700' : 'bg-gray-100';

  return (
    <div className={`min-h-screen ${bgPrimary} ${textPrimary} transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Gamification</h2>
          <p className={textSecondary}>Earn badges, collect points, complete challenges, and unlock rewards!</p>
        </div>

        <PointsDisplay api={api} cardBg={cardBg} textPrimary={textPrimary} textSecondary={textSecondary} borderColor={borderColor} isDark={isDark} />

        {/* Tabs */}
        <div className={`flex gap-2 mb-8 p-1.5 ${cardBg} rounded-2xl border ${borderColor} inline-flex`}>
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white shadow-lg'
                  : `${textSecondary} hover:${textPrimary}`
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'badges' && <BadgesTab api={api} cardBg={cardBg} textPrimary={textPrimary} textSecondary={textSecondary} borderColor={borderColor} isDark={isDark} user={user} />}
        {activeTab === 'shop' && <ShopTab api={api} cardBg={cardBg} textPrimary={textPrimary} textSecondary={textSecondary} borderColor={borderColor} inputBg={inputBg} isDark={isDark} user={user} />}
        {activeTab === 'challenges' && <ChallengesTab api={api} cardBg={cardBg} textPrimary={textPrimary} textSecondary={textSecondary} borderColor={borderColor} isDark={isDark} />}
      </div>
    </div>
  );
}

function PointsDisplay({ api, cardBg, textPrimary, textSecondary, borderColor, isDark }) {
  const [points, setPoints] = useState({ points: 0, totalPointsEarned: 0 });

  useEffect(() => {
    api.get('/points/me').then(r => setPoints(r.data)).catch(() => {});
  }, []);

  return (
    <div className={`${cardBg} p-5 rounded-2xl border ${borderColor} mb-6`}>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--accent-50)' }}>
            <FaStar className="text-2xl" style={{ color: 'var(--accent-500)' }} />
          </div>
          <div>
            <p className={`text-2xl font-bold ${textPrimary}`}>{points.points}</p>
            <p className={`text-xs ${textSecondary}`}>Available Points</p>
          </div>
        </div>
        <div className="w-px h-10" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
        <div>
          <p className={`text-lg font-semibold ${textPrimary}`}>{points.totalPointsEarned}</p>
          <p className={`text-xs ${textSecondary}`}>Total Earned</p>
        </div>
      </div>
    </div>
  );
}

function BadgesTab({ api, cardBg, textPrimary, textSecondary, borderColor, isDark, user }) {
  const [userBadges, setUserBadges] = useState([]);
  const [definitions, setDefinitions] = useState([]);

  const PREMIUM_BADGE_TYPES = ['premium_member', 'premium_learner', 'early_adopter'];

  useEffect(() => {
    Promise.all([
      api.get('/badges/mine').then(r => r.data).catch(() => []),
      api.get('/badges/definitions').then(r => r.data).catch(() => [])
    ]).then(([badges, defs]) => {
      setUserBadges(badges);
      setDefinitions(defs);
    });
  }, []);

  const earnedTypes = new Set(userBadges.map(b => b.type));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-bold`}>Your Badges ({userBadges.length})</h3>
        {user?.subscriptionTier !== 'premium' && (
          <a href="/subscription" className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-full font-semibold text-white transition"
            style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
            <FaCrown className="text-[10px]" /> Unlock Premium Badges
          </a>
        )}
      </div>

      {userBadges.length === 0 && definitions.length === 0 ? (
        <div className={`text-center py-12 ${cardBg} rounded-2xl border ${borderColor}`}>
          <FaMedal className="text-5xl mx-auto mb-3 text-gray-500" />
          <p className={textSecondary}>No badges yet. Start learning to earn badges!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {definitions.map(def => {
            const isPremiumBadge = PREMIUM_BADGE_TYPES.includes(def.type);
            const earned = userBadges.find(b => b.type === def.type);
            const isLockedPremium = isPremiumBadge && user?.subscriptionTier !== 'premium';
            return (
              <div key={def.type} className={`${cardBg} p-4 rounded-2xl border ${earned ? 'border-blue-500' : borderColor} text-center transition hover:shadow-lg ${!earned && !isLockedPremium ? 'opacity-60' : ''} ${isLockedPremium ? 'opacity-40' : ''}`}>
                <div className="relative inline-block">
                  <span className={`text-4xl block mb-2 ${earned ? '' : 'grayscale'}`}>{def.icon}</span>
                  {isPremiumBadge && (
                    <span className="absolute -top-1 -right-1 text-xs"><FaCrown className="text-yellow-500" /></span>
                  )}
                </div>
                <p className={`text-sm font-semibold ${textPrimary}`}>{def.name}</p>
                <p className={`text-xs ${textSecondary} mt-1`}>{def.desc}</p>
                {isLockedPremium ? (
                  <a href="/subscription" className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
                    Premium
                  </a>
                ) : earned && (
                  <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: 'var(--accent-500)' }}>
                    Earned!
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ShopTab({ api, cardBg, textPrimary, textSecondary, borderColor, inputBg, isDark, user }) {
  const [items, setItems] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [points, setPoints] = useState(0);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [itemsRes, purchasesRes, pointsRes] = await Promise.all([
      api.get('/shop/items').then(r => r.data).catch(() => []),
      api.get('/shop/purchases').then(r => r.data).catch(() => []),
      api.get('/points/me').then(r => r.data).catch(() => ({ points: 0 }))
    ]);
    setItems(itemsRes);
    setPurchases(purchasesRes);
    setPoints(pointsRes.points);
  };

  const purchasedIds = new Set(purchases.map(p => p.itemId));

  const handlePurchase = async (itemId) => {
    try {
      const res = await api.post('/shop/purchase', { itemId });
      setPoints(res.data.points);
      setPurchases(prev => [...prev, res.data.purchase]);
      setMsg('Purchased successfully!');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Purchase failed');
      setTimeout(() => setMsg(''), 3000);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-bold`}>Points Shop</h3>
        <span className={`text-sm ${textSecondary}`}>{points} points available</span>
      </div>

      {msg && (
        <div className={`p-3 rounded-xl mb-4 text-sm font-semibold ${
          msg.includes('success') ? 'text-white' : 'text-white'
        }`} style={{ backgroundColor: msg.includes('success') ? '#22C55E' : '#EF4444' }}>{msg}</div>
      )}

      {items.length === 0 ? (
        <div className={`text-center py-12 ${cardBg} rounded-2xl border ${borderColor}`}>
          <FaShoppingCart className="text-5xl mx-auto mb-3 text-gray-500" />
          <p className={textSecondary}>No items in the shop yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => {
            const owned = purchasedIds.has(item._id);
            const canAfford = points >= item.price;
            const isPremiumItem = item.isPremium;
            return (
              <div key={item._id} className={`${cardBg} p-5 rounded-2xl border ${isPremiumItem ? 'border-yellow-500' : borderColor} flex flex-col`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="relative">
                    <span className="text-4xl">{item.icon}</span>
                    {isPremiumItem && (
                      <span className="absolute -top-1 -right-1"><FaCrown className="text-yellow-500 text-xs" /></span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {isPremiumItem && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold text-white"
                        style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
                        Premium
                      </span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold text-gray-300`}
                      style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                      {item.rarity}
                    </span>
                  </div>
                </div>
                <h4 className={`font-bold ${textPrimary}`}>{item.name}</h4>
                <p className={`text-sm ${textSecondary} flex-1`}>{item.description}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="font-bold flex items-center gap-1" style={{ color: 'var(--accent-500)' }}>
                    <FaStar className="text-sm" /> {item.price}
                  </span>
                  {owned ? (
                    <span className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: 'var(--accent-500)' }}>Owned</span>
                  ) : (
                    <button
                      onClick={() => handlePurchase(item._id)}
                      disabled={!canAfford}
                      className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition ${
                        canAfford
                          ? 'text-white'
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                      style={canAfford ? { backgroundColor: 'var(--accent-500)' } : {}}
                      onMouseEnter={e => { if (canAfford) e.target.style.backgroundColor = 'var(--accent-600)'; }}
                      onMouseLeave={e => { if (canAfford) e.target.style.backgroundColor = 'var(--accent-500)'; }}
                    >
                      {canAfford ? 'Buy' : 'Need more'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ChallengesTab({ api, cardBg, textPrimary, textSecondary, borderColor, isDark }) {
  const [challengeData, setChallengeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const res = await api.get('/challenges/today');
      setChallengeData(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (challengeId) => {
    try {
      const res = await api.post('/challenges/claim', { challengeId });
      setChallengeData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          challenges: prev.challenges.map(c => c.id === challengeId ? { ...c, metadata: { ...c.metadata, claimed: true } } : c),
          totalPointsEarned: prev.totalPointsEarned + res.data.challenge.points
        };
      });
      setMsg(`Claimed ${res.data.challenge.points} points!`);
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Claim failed');
      setTimeout(() => setMsg(''), 3000);
    }
  };

  if (loading) {
    return <div className={`text-center py-10 ${textSecondary}`}>Loading challenges...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-bold`}>Today's Challenges</h3>
        {challengeData && (
          <span className={`text-sm ${textSecondary}`}>
            {challengeData.challenges.filter(c => c.completed).length} / {challengeData.challenges.length} completed
          </span>
        )}
      </div>

      {msg && (
        <div className={`p-3 rounded-xl mb-4 text-sm font-semibold text-white`}
          style={{ backgroundColor: msg.includes('Claimed') ? '#22C55E' : '#EF4444' }}>{msg}</div>
      )}

      {!challengeData || challengeData.challenges.length === 0 ? (
        <div className={`text-center py-12 ${cardBg} rounded-2xl border ${borderColor}`}>
          <FaCalendarCheck className="text-5xl mx-auto mb-3 text-gray-500" />
          <p className={textSecondary}>No challenges for today. Check back tomorrow!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {challengeData.challenges.map(ch => {
            const claimed = ch.metadata?.claimed;
            const pct = ch.target > 0 ? Math.round((ch.progress / ch.target) * 100) : 0;
            return (
              <div key={ch.id} className={`${cardBg} p-5 rounded-2xl border ${ch.completed ? 'border-blue-500' : borderColor}`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                    ch.completed ? '' : isDark ? 'bg-gray-700' : 'bg-gray-100'
                  }`} style={ch.completed ? { backgroundColor: 'var(--accent-50)' } : {}}>
                    {ch.completed ? '✅' : ch.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-bold ${textPrimary}`}>{ch.title}</h4>
                      <span className="font-semibold text-sm flex items-center gap-1" style={{ color: 'var(--accent-500)' }}>
                        <FaStar className="text-xs" /> +{ch.points} pts
                      </span>
                    </div>
                    <p className={`text-sm ${textSecondary} mt-0.5`}>{ch.description}</p>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className={textSecondary}>Progress</span>
                        <span className={textSecondary}>{ch.progress} / {ch.target}</span>
                      </div>
                      <div className={`w-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                        <div className="h-2 rounded-full transition-all bg-blue-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0">
                    {claimed ? (
                      <span className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: 'var(--accent-500)' }}>Claimed</span>
                    ) : ch.completed ? (
                      <button onClick={() => handleClaim(ch.id)} className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition"
                        style={{ backgroundColor: 'var(--accent-500)' }}
                        onMouseEnter={e => e.target.style.backgroundColor = 'var(--accent-600)'}
                        onMouseLeave={e => e.target.style.backgroundColor = 'var(--accent-500)'}>
                        Claim
                      </button>
                    ) : (
                      <span className="px-4 py-2 bg-gray-600 text-gray-400 rounded-lg text-sm font-semibold cursor-not-allowed">
                        <FaLock className="inline mr-1" /> Locked
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {challengeData.allCompleted && challengeData.challenges.every(c => c.metadata?.claimed) && (
            <div className="p-4 rounded-2xl text-center" style={{ backgroundColor: isDark ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.1)' }}>
              <FaFire className="text-3xl mx-auto mb-2" style={{ color: 'var(--accent-400)' }} />
              <p className="font-bold" style={{ color: 'var(--accent-400)' }}>All challenges completed today! Come back tomorrow for more.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Gamification;
