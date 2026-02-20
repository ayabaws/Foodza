import React from 'react';
import { Text, TextStyle, View, ViewStyle } from 'react-native';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const variantStyles: Record<BadgeVariant, { container: ViewStyle; text: TextStyle }> = {
  default: {
    container: {
      backgroundColor: '#A64B2A',
      borderColor: 'transparent',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
    },
    text: {
      color: '#FFF',
      fontSize: 12,
      fontWeight: '500',
    },
  },
  secondary: {
    container: {
      backgroundColor: '#E0E0E0',
      borderColor: 'transparent',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
    },
    text: {
      color: '#333',
      fontSize: 12,
      fontWeight: '500',
    },
  },
  destructive: {
    container: {
      backgroundColor: '#FF4D4F',
      borderColor: 'transparent',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
    },
    text: {
      color: '#FFF',
      fontSize: 12,
      fontWeight: '500',
    },
  },
  outline: {
    container: {
      backgroundColor: 'transparent',
      borderColor: '#333',
      borderWidth: 1,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
    },
    text: {
      color: '#333',
      fontSize: 12,
      fontWeight: '500',
    },
  },
};

export function Badge({
  variant = 'default',
  children,
  style,
  textStyle,
}: BadgeProps) {
  const styles = variantStyles[variant];

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.text, textStyle]}>{children}</Text>
    </View>
  );
}