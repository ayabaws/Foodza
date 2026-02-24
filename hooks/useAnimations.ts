import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

// Fade in animation hook
export const useFadeIn = (duration = 300, delay = 0) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration,
        useNativeDriver: true,
        easing: Easing.ease,
      }).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [fadeAnim, duration, delay]);

  return fadeAnim;
};

// Slide up animation hook
export const useSlideUp = (duration = 300, delay = 0, fromValue = 50) => {
  const slideAnim = useRef(new Animated.Value(fromValue)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [slideAnim, duration, delay, fromValue]);

  return slideAnim;
};

// Scale animation hook
export const useScale = (duration = 200, delay = 0, fromValue = 0.8) => {
  const scaleAnim = useRef(new Animated.Value(fromValue)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [scaleAnim, duration, delay, fromValue]);

  return scaleAnim;
};

// Pulse animation hook
export const usePulse = (duration = 1000, delay = 0) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      const pulse = Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: duration / 2,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ]);

      Animated.loop(pulse).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [pulseAnim, duration, delay]);

  return pulseAnim;
};

// Shake animation hook
export const useShake = (trigger: boolean, duration = 500) => {
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (trigger) {
      const shake = Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: duration / 8,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          duration: duration / 4,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.quad),
        }),
        Animated.timing(shakeAnim, {
          toValue: 10,
          duration: duration / 4,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.quad),
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: duration / 8,
          useNativeDriver: true,
          easing: Easing.out(Easing.quad),
        }),
      ]);

      shake.start();
    }
  }, [trigger, shakeAnim, duration]);

  return shakeAnim;
};

// Rotate animation hook
export const useRotate = (duration = 2000, delay = 0) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
          easing: Easing.linear,
        })
      ).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [rotateAnim, duration, delay]);

  return rotateAnim;
};

// Bounce animation hook
export const useBounce = (duration = 600, delay = 0) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.spring(bounceAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 200,
        friction: 2,
      }).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [bounceAnim, duration, delay]);

  return bounceAnim;
};

// Stagger animation hook for lists
export const useStaggerAnimation = (itemCount: number, staggerDelay = 100) => {
  const animations = useRef(
    Array.from({ length: itemCount }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const staggeredAnimations = animations.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        delay: index * staggerDelay,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      })
    );

    Animated.parallel(staggeredAnimations).start();
  }, [animations, itemCount, staggerDelay]);

  return animations;
};

// Loading animation hook
export const useLoadingAnimation = (duration = 1500) => {
  const loadingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loading = Animated.loop(
      Animated.sequence([
        Animated.timing(loadingAnim, {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(loadingAnim, {
          toValue: 0,
          duration: duration / 2,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    );

    loading.start();

    return () => loading.stop();
  }, [loadingAnim, duration]);

  return loadingAnim;
};

// Progress animation hook
export const useProgressAnimation = (targetValue: number, duration = 500) => {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: targetValue,
      duration,
      useNativeDriver: false,
      easing: Easing.out(Easing.quad),
    }).start();
  }, [progressAnim, targetValue, duration]);

  return progressAnim;
};

// Flip animation hook
export const useFlip = (trigger: boolean, duration = 600) => {
  const flipAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(flipAnim, {
      toValue: trigger ? 1 : 0,
      duration,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
    }).start();
  }, [trigger, flipAnim, duration]);

  return flipAnim;
};

// Helper function to interpolate rotation
export const getRotateTransform = (animatedValue: Animated.Value) => {
  return animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
};

// Helper function to interpolate flip
export const getFlipTransform = (animatedValue: Animated.Value) => {
  return animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '90deg', '0deg'],
  });
};

// Helper function to interpolate slide
export const getSlideTransform = (animatedValue: Animated.Value, direction: 'up' | 'down' | 'left' | 'right' = 'up') => {
  const transforms = {
    up: [{ translateY: animatedValue }],
    down: [{ translateY: Animated.multiply(animatedValue, -1) }],
    left: [{ translateX: animatedValue }],
    right: [{ translateX: Animated.multiply(animatedValue, -1) }],
  };

  return transforms[direction];
};
