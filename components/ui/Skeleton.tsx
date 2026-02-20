import React, { useEffect, useRef } from "react";
import { Animated, StyleProp, ViewStyle } from "react-native";

type SkeletonProps = {
  style?: StyleProp<ViewStyle>;
};

function Skeleton({ style, ...props }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );

    pulseAnimation.start();
    return () => pulseAnimation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          backgroundColor: "#e0e0e0", // couleur accent approximative
          borderRadius: 8, // équivalent de rounded-md
          opacity,
        },
        style,
      ]}
      {...props}
    />
  );
}

export { Skeleton };
