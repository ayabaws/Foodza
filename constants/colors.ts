export const Colors = {
  // Primary brand colors
  primary: {
    50: '#E6F4FE',
    100: '#BAE0FD',
    200: '#7CC8FC',
    300: '#3EACFB',
    400: '#0993F5',
    500: '#007AFF',
    600: '#0066D6',
    700: '#0053B8',
    800: '#00439B',
    900: '#003680',
  },
  
  // Secondary colors
  secondary: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#4CAF50',
    600: '#38A169',
    700: '#2F855A',
    800: '#276749',
    900: '#22543D',
  },
  
  // Neutral colors
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  
  // Semantic colors
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Foodza specific colors
  brand: {
    primary: '#2C1810',
    secondary: '#4CAF50',
    accent: '#FF6B35',
    background: '#FFFFFF',
    surface: '#F8F9FA',
  },
  
  // Text colors
  text: {
    primary: '#2C1810',
    secondary: '#666666',
    tertiary: '#999999',
    inverse: '#FFFFFF',
    disabled: '#CCCCCC',
  },
  
  // Background colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F8F9FA',
    tertiary: '#F5F5F5',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  // Border colors
  border: {
    light: '#E5E5E5',
    medium: '#D4D4D4',
    dark: '#A3A3A3',
    focus: '#007AFF',
  },
  
  // Shadow colors
  shadow: {
    light: 'rgba(0, 0, 0, 0.05)',
    medium: 'rgba(0, 0, 0, 0.1)',
    dark: 'rgba(0, 0, 0, 0.15)',
  },
};

export const ColorScheme = {
  light: {
    ...Colors.brand,
    text: Colors.text,
    background: Colors.background,
    border: Colors.border,
    shadow: Colors.shadow,
    primary: Colors.primary[500],
    secondary: Colors.secondary[500],
  },
  dark: {
    primary: '#FFFFFF',
    secondary: '#4CAF50',
    background: '#151515',
    surface: '#1A1A1A',
    text: {
      primary: '#ECEDEE',
      secondary: '#9BA1A6',
      tertiary: '#687076',
      inverse: '#2C1810',
      disabled: '#525252',
    },
    border: {
      light: '#404040',
      medium: '#525252',
      dark: '#737373',
      focus: '#007AFF',
    },
    shadow: {
      light: 'rgba(255, 255, 255, 0.05)',
      medium: 'rgba(255, 255, 255, 0.1)',
      dark: 'rgba(255, 255, 255, 0.15)',
    },
  },
};
