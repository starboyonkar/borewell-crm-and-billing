
import React, { createContext, useContext, useEffect, useState } from 'react';

type CustomTheme = 'classic-blue' | 'emerald-fresh' | 'sunset-gold' | 'midnight-pro' | 'slate-violet';

type CustomThemeContextType = {
  currentTheme: CustomTheme;
  setTheme: (theme: CustomTheme) => void;
};

const CustomThemeContext = createContext<CustomThemeContextType | undefined>(undefined);

const themeStyles = {
  'classic-blue': {
    '--theme-primary': '#0D47A1',
    '--theme-primary-rgb': '13, 71, 161',
    '--theme-secondary': '#1976D2',
    '--theme-secondary-rgb': '25, 118, 210',
    '--theme-accent': '#42A5F5',
    '--theme-accent-rgb': '66, 165, 245',
    '--theme-background': '#F5F7FA',
    '--theme-background-rgb': '245, 247, 250',
    '--theme-text': '#212121',
    '--theme-text-rgb': '33, 33, 33',
    '--theme-surface': '#FFFFFF',
    '--theme-surface-rgb': '255, 255, 255',
    '--theme-border': '#E3F2FD',
    '--theme-muted': '#F0F4F8'
  },
  'emerald-fresh': {
    '--theme-primary': '#2E7D32',
    '--theme-primary-rgb': '46, 125, 50',
    '--theme-secondary': '#66BB6A',
    '--theme-secondary-rgb': '102, 187, 106',
    '--theme-accent': '#A5D6A7',
    '--theme-accent-rgb': '165, 214, 167',
    '--theme-background': '#F9F9F9',
    '--theme-background-rgb': '249, 249, 249',
    '--theme-text': '#333333',
    '--theme-text-rgb': '51, 51, 51',
    '--theme-surface': '#FFFFFF',
    '--theme-surface-rgb': '255, 255, 255',
    '--theme-border': '#E8F5E8',
    '--theme-muted': '#F1F8E9'
  },
  'sunset-gold': {
    '--theme-primary': '#B26500',
    '--theme-primary-rgb': '178, 101, 0',
    '--theme-secondary': '#FF9800',
    '--theme-secondary-rgb': '255, 152, 0',
    '--theme-accent': '#FFB74D',
    '--theme-accent-rgb': '255, 183, 77',
    '--theme-background': '#FFFFFF',
    '--theme-background-rgb': '255, 255, 255',
    '--theme-text': '#212121',
    '--theme-text-rgb': '33, 33, 33',
    '--theme-surface': '#FAFAFA',
    '--theme-surface-rgb': '250, 250, 250',
    '--theme-border': '#FFF3E0',
    '--theme-muted': '#FFF8F1'
  },
  'midnight-pro': {
    '--theme-primary': '#121212',
    '--theme-primary-rgb': '18, 18, 18',
    '--theme-secondary': '#1E88E5',
    '--theme-secondary-rgb': '30, 136, 229',
    '--theme-accent': '#64B5F6',
    '--theme-accent-rgb': '100, 181, 246',
    '--theme-background': '#1A1A1A',
    '--theme-background-rgb': '26, 26, 26',
    '--theme-text': '#E0E0E0',
    '--theme-text-rgb': '224, 224, 224',
    '--theme-surface': '#262626',
    '--theme-surface-rgb': '38, 38, 38',
    '--theme-border': '#333333',
    '--theme-muted': '#2A2A2A'
  },
  'slate-violet': {
    '--theme-primary': '#6A1B9A',
    '--theme-primary-rgb': '106, 27, 154',
    '--theme-secondary': '#AB47BC',
    '--theme-secondary-rgb': '171, 71, 188',
    '--theme-accent': '#CE93D8',
    '--theme-accent-rgb': '206, 147, 216',
    '--theme-background': '#F3F3F3',
    '--theme-background-rgb': '243, 243, 243',
    '--theme-text': '#2C2C2C',
    '--theme-text-rgb': '44, 44, 44',
    '--theme-surface': '#FFFFFF',
    '--theme-surface-rgb': '255, 255, 255',
    '--theme-border': '#F3E5F5',
    '--theme-muted': '#F8F5FF'
  }
};

export function CustomThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<CustomTheme>(() => {
    const saved = localStorage.getItem('custom-theme');
    return (saved as CustomTheme) || 'classic-blue';
  });

  const setTheme = (theme: CustomTheme) => {
    setCurrentTheme(theme);
    localStorage.setItem('custom-theme', theme);
  };

  useEffect(() => {
    const root = document.documentElement;
    const styles = themeStyles[currentTheme];
    
    // Apply theme variables
    Object.entries(styles).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Add theme class to body for additional styling
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${currentTheme}`);
  }, [currentTheme]);

  return (
    <CustomThemeContext.Provider value={{ currentTheme, setTheme }}>
      {children}
    </CustomThemeContext.Provider>
  );
}

export function useCustomTheme() {
  const context = useContext(CustomThemeContext);
  if (!context) {
    throw new Error('useCustomTheme must be used within a CustomThemeProvider');
  }
  return context;
}
