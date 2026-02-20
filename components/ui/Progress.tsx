import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

type ProgressProps = {
  value?: number; // 0 à 100
  height?: number;
  backgroundColor?: string;
  indicatorColor?: string;
  style?: any;
};

export function Progress({
  value = 0,
  height = 8,
  backgroundColor = "#cbd5e1", // équivalent bg-primary/20
  indicatorColor = "#3b82f6",   // équivalent bg-primary
  style,
}: ProgressProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const widthInterpolated = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View
      style={[
        {
          backgroundColor,
          height,
          borderRadius: height / 2,
          overflow: "hidden",
          width: "100%",
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          {
            backgroundColor: indicatorColor,
            height: "100%",
            width: widthInterpolated,
          },
        ]}
      />
    </View>
  );
}