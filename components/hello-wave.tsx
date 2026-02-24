import React from 'react';
import { Text, Animated } from 'react-native';
import { useEffect, useRef } from 'react';

export function HelloWave() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <Text style={styles.waveText}>👋</Text>
    </Animated.View>
  );
}

const styles = {
  waveText: {
    fontSize: 80,
    textAlign: 'center' as const,
  },
};
