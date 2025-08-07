import { useTheme as useThemeContext } from '@/components/ThemeProvider';
import { themes, ThemeType } from '@/lib/theme';

export const useTheme = () => {
  const { currentTheme, setTheme } = useThemeContext();
  const themeColors = themes[currentTheme];

  return {
    currentTheme,
    setTheme,
    colors: themeColors,
    isSuperAdmin: currentTheme === 'superAdmin',
    isCompany: currentTheme === 'company',
    
    // Utility functions
    getPrimaryColor: () => themeColors.primary,
    getSecondaryColor: () => themeColors.secondary,
    getGradient: () => themeColors.gradient,
    getGradientHover: () => themeColors.gradientHover,
    
    // CSS class helpers
    getButtonClasses: (variant: 'primary' | 'secondary' | 'outline' = 'primary') => {
      const baseClasses = 'transition-all duration-200 font-medium';
      
      switch (variant) {
        case 'primary':
          return `${baseClasses} theme-primary theme-primary-hover`;
        case 'secondary':
          return `${baseClasses} theme-secondary theme-secondary-hover`;
        case 'outline':
          return `${baseClasses} border-2 border-current theme-secondary-hover`;
        default:
          return baseClasses;
      }
    },
    
    getCardClasses: () => 'theme-bg-primary theme-border theme-shadow',
    getInputClasses: () => 'theme-border focus:ring-2 focus:ring-opacity-50 focus:ring-current',
    getDropdownClasses: () => 'theme-bg-secondary theme-border theme-shadow-lg',
    getTabClasses: (active: boolean) => 
      active ? 'theme-primary text-white' : 'hover:theme-bg-secondary',
  };
};
