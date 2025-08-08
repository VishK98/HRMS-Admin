import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { applyTheme, getThemeByRole, getCurrentTheme, ThemeType } from '@/lib/theme';

interface ThemeContextType {
  currentTheme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [currentTheme, setCurrentTheme] = React.useState<ThemeType>('superAdmin');

  useEffect(() => {
    // Determine theme based on user role
    const theme = user ? getThemeByRole(user.role) : getCurrentTheme();
    setCurrentTheme(theme);
    applyTheme(theme);
  }, [user]);

  const setTheme = (theme: ThemeType) => {
    setCurrentTheme(theme);
    applyTheme(theme);
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
