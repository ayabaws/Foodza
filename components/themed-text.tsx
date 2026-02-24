import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ThemedTextProps {
  children: React.ReactNode;
  style?: any;
  lightColor?: string;
  darkColor?: string;
}

export function ThemedText({ 
  children, 
  style, 
  lightColor, 
  darkColor 
}: ThemedTextProps) {
  const colorScheme = useColorScheme();
  const color = colorScheme === 'dark' ? darkColor || '#fff' : lightColor || '#000';

  return (
    <Text style={[{ color }, style]}>
      {children}
    </Text>
  );
}
