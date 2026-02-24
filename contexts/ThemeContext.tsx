import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: any;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const lightColors = {
  primary: '#8C3E22',
  secondary: '#4CAF50',
  background: '#FFFFFF',
  background2: '#000000',
  surface: '#F8F9FA',
  text: {
    primary: '#2C1810',
    secondary: '#666666',
    tertiary: '#999999',
    inverse: '#FFFFFF',
    disabled: '#CCCCCC',
  },
  border: {
    light: '#E5E5E5',
    medium: '#D4D4D4',
    dark: '#A3A3A3',
    focus: '#007AFF',
  },
  shadow: {
    light: 'rgba(0, 0, 0, 0.05)',
    medium: 'rgba(0, 0, 0, 0.1)',
    dark: 'rgba(0, 0, 0, 0.15)',
  },
};

const darkColors = {
  primary: '#FFFFFF',
  secondary: '#4CAF50',
  background: '#000000',
  background2: '#FFFFFF',
  surface: '#1A1A1A',
  text: {
    primary: '#FFFFFF',
    secondary: '#CCCCCC',
    tertiary: '#999999',
    inverse: '#2C1810',
    disabled: '#666666',
  },
  border: {
    light: '#333333',
    medium: '#555555',
    dark: '#777777',
    focus: '#4CAF50',
  },
  shadow: {
    light: 'rgba(255, 255, 255, 0.05)',
    medium: 'rgba(255, 255, 255, 0.1)',
    dark: 'rgba(255, 255, 255, 0.15)',
  },
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceScheme = useNativeColorScheme();
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Charger le thème sauvegardé au démarrage
    loadTheme();
  }, []);

  const loadTheme = async () => {
    // Ici tu peux ajouter le chargement depuis AsyncStorage
    const savedTheme = 'light'; // Par défaut
    setTheme(savedTheme);
  };

  const saveTheme = async (newTheme: Theme) => {
    // Ici tu peux ajouter la sauvegarde dans AsyncStorage
    setTheme(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    saveTheme(newTheme);
  };

  const colors = theme === 'light' ? lightColors : darkColors;
  const isDarkMode = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};
