import { useTheme } from './ThemeContext';

export function useThemeClasses() {
  const { isDark } = useTheme();

  return {
    bgPrimary: isDark ? 'bg-gray-900' : 'bg-gray-100',
    bgSecondary: isDark ? 'bg-gray-800' : 'bg-white',
    bgTertiary: isDark ? 'bg-gray-700' : 'bg-gray-200',
    textPrimary: isDark ? 'text-white' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-400' : 'text-gray-600',
    borderColor: isDark ? 'border-gray-700' : 'border-gray-200',
    cardBg: isDark ? 'bg-gray-800' : 'bg-white',
    inputBg: isDark ? 'bg-gray-800' : 'bg-white',
    inputFieldBg: isDark ? 'bg-gray-700' : 'bg-gray-100',
    progressBg: isDark ? 'bg-gray-700' : 'bg-gray-200',
    sectionBg: isDark ? 'bg-gray-700' : 'bg-gray-100',
    tabActive: isDark ? 'bg-blue-600' : 'bg-blue-500',
    tabInactive: isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-200',
    secondaryBtn: isDark ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400',
    dotInactive: isDark ? 'bg-gray-700' : 'bg-gray-300',
    optionDefault: isDark ? 'bg-gray-700 border-gray-600 hover:border-blue-500 text-gray-200' : 'bg-gray-100 border-gray-300 hover:border-blue-500 text-gray-700',
    reviewOptionBg: isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600',
    replyBg: isDark ? 'bg-gray-900' : 'bg-gray-100',
    innerCardBg: isDark ? 'bg-gray-800' : 'bg-white',
    badgeBg: isDark ? 'bg-gray-600' : 'bg-gray-200',
    placeholderColor: isDark ? 'placeholder-gray-400' : 'placeholder-gray-500',
  };
}
