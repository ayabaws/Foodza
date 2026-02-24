import React from 'react';
import { Animated, ViewProps } from 'react-native';
import { useFadeIn, useScale } from '@/hooks/useAnimations';
import { Card } from './Card';

interface AnimatedCardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  animationType?: 'fadeIn' | 'scale' | 'slideUp' | 'bounce';
  duration?: number;
  delay?: number;
}

export function AnimatedCard({
  children,
  variant = 'default',
  animationType = 'fadeIn',
  duration = 300,
  delay = 0,
  style,
  ...props
}: AnimatedCardProps) {
  const fadeAnim = useFadeIn(duration, delay);
  const scaleAnim = useScale(duration, delay);
  
  const getAnimatedStyle = () => {
    switch (animationType) {
      case 'fadeIn':
        return { opacity: fadeAnim };
      case 'scale':
        return { transform: [{ scale: scaleAnim }] };
      case 'slideUp':
        return { opacity: fadeAnim };
      case 'bounce':
        return { transform: [{ scale: scaleAnim }] };
      default:
        return { opacity: fadeAnim };
    }
  };

  return (
    <Animated.View style={[getAnimatedStyle(), style]} {...props}>
      <Card variant={variant}>
        {children}
      </Card>
    </Animated.View>
  );
}
