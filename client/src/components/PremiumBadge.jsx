import { FaCrown } from 'react-icons/fa';

function PremiumBadge({ size = 'sm', showLabel = true }) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  return (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-full ${sizeClasses[size]} text-white`}
      style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}>
      <FaCrown className={size === 'sm' ? 'text-[10px]' : 'text-xs'} />
      {showLabel && 'Premium'}
    </span>
  );
}

function PremiumLocked({ size = 'md' }) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  return (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-full ${sizeClasses[size]} bg-gray-600 text-gray-400`}>
      <FaCrown className="text-xs" />
      Premium
    </span>
  );
}

export { PremiumBadge, PremiumLocked };
export default PremiumBadge;
