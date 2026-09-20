import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeConfig } from '../types';

interface ThemeContextType {
  theme: ThemeConfig;
  updateTheme: (newTheme: Partial<ThemeConfig>) => void;
}

const defaultTheme: ThemeConfig = {
  primaryColor: '#10b981',
  secondaryColor: '#0d9488',
  companyName: 'AgendaFlow',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    const stored = localStorage.getItem('agendaflow_theme');
    return stored ? JSON.parse(stored) : defaultTheme;
  });

  useEffect(() => {
    localStorage.setItem('agendaflow_theme', JSON.stringify(theme));
    
    // Apply theme colors to CSS variables
    document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor);
  }, [theme]);

  const updateTheme = (newTheme: Partial<ThemeConfig>) => {
    setTheme(prev => ({ ...prev, ...newTheme }));
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
