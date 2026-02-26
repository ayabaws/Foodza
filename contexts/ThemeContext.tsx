import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme as useNativeColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  colors: any;
  systemTheme: Theme;
  followSystemTheme: boolean;
  setFollowSystemTheme: (follow: boolean) => void;
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
  const [theme, setThemeState] = useState<Theme>('light');
  const [followSystemTheme, setFollowSystemThemeState] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const systemTheme = deviceScheme || 'light';

  useEffect(() => {
    loadThemeSettings();
  }, []);

  useEffect(() => {
    if (followSystemTheme && systemTheme) {
      setThemeState(systemTheme);
    }
  }, [systemTheme, followSystemTheme]);

  const loadThemeSettings = async () => {
    try {
      // Check if AsyncStorage is available
      if (!AsyncStorage) {
        console.log('AsyncStorage not available, using defaults');
        setFollowSystemThemeState(true);
        if (systemTheme) {
          setThemeState(systemTheme);
        }
        return;
      }

      const savedTheme = await AsyncStorage.getItem('theme') as Theme;
      const savedFollowSystem = await AsyncStorage.getItem('followSystemTheme');
      
      if (savedFollowSystem !== null) {
        setFollowSystemThemeState(savedFollowSystem === 'true');
      }
      
      if (savedTheme) {
        setThemeState(savedTheme);
      } else if (followSystemTheme && systemTheme) {
        setThemeState(systemTheme);
      }
    } catch (error) {
      console.log('Error loading theme settings, using defaults:', error);
      // Utiliser les valeurs par défaut en cas d'erreur
      setFollowSystemThemeState(true);
      if (systemTheme) {
        setThemeState(systemTheme);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const saveThemeSettings = async (newTheme: Theme, followSystem: boolean) => {
    try {
      // Check if AsyncStorage is available
      if (!AsyncStorage) {
        console.log('AsyncStorage not available, skipping save');
        return;
      }
      
      await AsyncStorage.setItem('theme', newTheme);
      await AsyncStorage.setItem('followSystemTheme', followSystem.toString());
    } catch (error) {
      console.log('Error saving theme settings, but continuing:', error);
      // Continuer même si la sauvegarde échoue
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    setFollowSystemThemeState(false);
    saveThemeSettings(newTheme, false);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(newTheme);
    setFollowSystemThemeState(false);
    saveThemeSettings(newTheme, false);
  };

  const setFollowSystemTheme = (follow: boolean) => {
    setFollowSystemThemeState(follow);
    if (follow && systemTheme) {
      setThemeState(systemTheme);
      saveThemeSettings(systemTheme, true);
    } else {
      saveThemeSettings(theme, false);
    }
  };

  const colors = theme === 'light' ? lightColors : darkColors;
  const isDarkMode = theme === 'dark';

  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      isDarkMode, 
      toggleTheme, 
      setTheme,
      colors, 
      systemTheme,
      followSystemTheme,
      setFollowSystemTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
