import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ThemedViewProps {
  children: React.ReactNode;
  style?: any;
  lightBackgroundColor?: string;
  darkBackgroundColor?: string;
}

export function ThemedView({ 
  children, 
  style, 
  lightBackgroundColor, 
  darkBackgroundColor 
}: ThemedViewProps) {
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === 'dark' 
    ? darkBackgroundColor || '#000' 
    : lightBackgroundColor || '#fff';

  return (
    <View style={[{ backgroundColor }, style]}>
      {children}
    </View>
  );
}
