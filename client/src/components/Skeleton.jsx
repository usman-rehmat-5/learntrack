import { useTheme } from '../context/ThemeContext';

function Skeleton({ className, isDark }) {
  const dark = isDark;
  return (
    <div className={`animate-pulse ${dark !== false ? 'bg-gray-700' : 'bg-gray-200'} rounded-xl ${className}`}></div>
  );
}

export function CardSkeleton() {
  const { isDark } = useTheme();
  return (
    <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-2xl border animate-pulse`}>
      <Skeleton isDark={isDark} className="h-6 w-2/3 mb-3" />
      <Skeleton isDark={isDark} className="h-4 w-1/2 mb-2" />
      <Skeleton isDark={isDark} className="h-4 w-1/3" />
    </div>
  );
}

export function TableSkeleton() {
  const { isDark } = useTheme();
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-4 rounded-xl border flex items-center gap-4`}>
          <Skeleton isDark={isDark} className="w-10 h-10 rounded-full" />
          <div className="flex-1">
            <Skeleton isDark={isDark} className="h-4 w-1/3 mb-2" />
            <Skeleton isDark={isDark} className="h-3 w-1/4" />
          </div>
          <Skeleton isDark={isDark} className="h-8 w-20 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function VideoSkeleton() {
  const { isDark } = useTheme();
  return (
    <div className="animate-pulse">
      <Skeleton isDark={isDark} className="aspect-video rounded-2xl mb-4" />
      <Skeleton isDark={isDark} className="h-6 w-1/2 mb-2" />
      <Skeleton isDark={isDark} className="h-4 w-1/3" />
    </div>
  );
}

export default Skeleton;