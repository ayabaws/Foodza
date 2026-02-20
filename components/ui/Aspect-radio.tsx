import React from 'react';
import { View, ViewProps } from 'react-native';

interface AspectRatioProps extends ViewProps {
  ratio?: number; // largeur / hauteur
  children: React.ReactNode;
}

export function AspectRatio({ ratio = 1, children, style, ...props }: AspectRatioProps) {
  return (
    <View
      style={[{ aspectRatio: ratio }, style]}
      {...props}
    >
      {children}
    </View>
  );
}