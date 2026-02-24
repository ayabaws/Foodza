import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface IconSymbolProps {
  name: string;
  size?: number;
  color?: string;
}

export function IconSymbol({ name, size = 24, color }: IconSymbolProps) {
  // Map SF Symbol names to Ionicons names
  const getIconName = (symbolName: string) => {
    const iconMap: Record<string, string> = {
      'house.fill': 'home',
      'paperplane.fill': 'paper-plane',
    };
    return iconMap[symbolName] || symbolName;
  };

  return (
    <Ionicons 
      name={getIconName(name) as any}
      size={size} 
      color={color}
    />
  );
}
