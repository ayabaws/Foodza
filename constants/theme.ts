import { ColorScheme } from './colors';
import { Spacing, BorderRadius, Shadow } from './spacing';
import { Typography } from './typography';

export const Theme = {
  colors: ColorScheme,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadow: Shadow,
  typography: Typography,
};

// Legacy compatibility
export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: '#007AFF',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#007AFF',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151515',
    tint: '#fff',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
  },
};
