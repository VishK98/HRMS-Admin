export interface ThemeColors {
  primary: string;
  secondary: string;
  primaryHover: string;
  secondaryHover: string;
  primaryLight: string;
  secondaryLight: string;
  primaryBg: string;
  secondaryBg: string;
  gradient: string;
  gradientHover: string;
  border: string;
  shadow: string;
  shadowLg: string;
}

export const themes = {
  superAdmin: {
    primary: '#003c30',
    secondary: '#60e59d',
    primaryHover: '#002a25',
    secondaryHover: '#4dd88a',
    primaryLight: '#004d3d',
    secondaryLight: '#7aeea8',
    primaryBg: '#f0f9f6',
    secondaryBg: '#f8fdfa',
    gradient: 'linear-gradient(135deg, #003c30 0%, #60e59d 100%)',
    gradientHover: 'linear-gradient(135deg, #002a25 0%, #4dd88a 100%)',
    border: '#e0f2e9',
    shadow: '0 4px 6px -1px rgba(0, 60, 48, 0.1), 0 2px 4px -1px rgba(0, 60, 48, 0.06)',
    shadowLg: '0 10px 15px -3px rgba(0, 60, 48, 0.1), 0 4px 6px -2px rgba(0, 60, 48, 0.05)'
  },
  company: {
    primary: '#521138',
    secondary: '#843C6D',
    primaryHover: '#3d0d2a',
    secondaryHover: '#6a2f57',
    primaryLight: '#6a1b4a',
    secondaryLight: '#9a4a7d',
    primaryBg: '#fdf8fc',
    secondaryBg: '#faf5f9',
    gradient: 'linear-gradient(135deg, #521138 0%, #843C6D 100%)',
    gradientHover: 'linear-gradient(135deg, #3d0d2a 0%, #6a2f57 100%)',
    border: '#f0e6ed',
    shadow: '0 4px 6px -1px rgba(82, 17, 56, 0.1), 0 2px 4px -1px rgba(82, 17, 56, 0.06)',
    shadowLg: '0 10px 15px -3px rgba(82, 17, 56, 0.1), 0 4px 6px -2px rgba(82, 17, 56, 0.05)'
  }
} as const;

export type ThemeType = keyof typeof themes;

// CSS Variables for dynamic theming
export const getThemeCSSVariables = (theme: ThemeType) => {
  const colors = themes[theme];
  return {
    '--theme-primary': colors.primary,
    '--theme-secondary': colors.secondary,
    '--theme-primary-hover': colors.primaryHover,
    '--theme-secondary-hover': colors.secondaryHover,
    '--theme-primary-light': colors.primaryLight,
    '--theme-secondary-light': colors.secondaryLight,
    '--theme-primary-bg': colors.primaryBg,
    '--theme-secondary-bg': colors.secondaryBg,
    '--theme-gradient': colors.gradient,
    '--theme-gradient-hover': colors.gradientHover,
    '--theme-border': colors.border,
    '--theme-shadow': colors.shadow,
    '--theme-shadow-lg': colors.shadowLg,
  };
};

// Apply theme to document
export const applyTheme = (theme: ThemeType) => {
  const root = document.documentElement;
  const variables = getThemeCSSVariables(theme);
  
  Object.entries(variables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  
  // Store theme preference
  localStorage.setItem('hrms-theme', theme);
};

// Get current theme
export const getCurrentTheme = (): ThemeType => {
  const stored = localStorage.getItem('hrms-theme');
  return (stored as ThemeType) || 'superAdmin';
};

// Determine theme based on user role
export const getThemeByRole = (role?: string): ThemeType => {
  if (role === 'super_admin') {
    return 'superAdmin';
  }
  return 'company';
};
