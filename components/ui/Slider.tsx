import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    PanResponder,
    StyleSheet,
    View,
    ViewStyle,
} from "react-native";

type SliderProps = {
  value?: number | number[];
  defaultValue?: number | number[];
  min?: number;
  max?: number;
  onValueChange?: (value: number | number[]) => void;
  style?: ViewStyle;
  thumbStyle?: ViewStyle;
  trackStyle?: ViewStyle;
  rangeStyle?: ViewStyle;
};

function Slider({
  value,
  defaultValue,
  min = 0,
  max = 100,
  onValueChange,
  style,
  thumbStyle,
  trackStyle,
  rangeStyle,
}: SliderProps) {
  // Support multi-thumb
  const initialValues = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
    ? defaultValue
    : [min];

  const [values, setValues] = useState<number[]>(initialValues);
  const panValues = useRef(values.map((v) => new Animated.Value(v))).current;

  useEffect(() => {
    if (value !== undefined) {
      const newValues = Array.isArray(value) ? value : [value];
      setValues(newValues);
      newValues.forEach((v, i) => panValues[i].setValue(v));
    }
  }, [value]);

  const panResponder = panValues.map((pan, i) =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newVal =
          Math.min(Math.max(values[i] + (gestureState.dx / 300) * (max - min), min), max); // 300px track width approx
        pan.setValue(newVal);
        const newValues = [...values];
        newValues[i] = newVal;
        setValues(newValues);
        onValueChange?.(newValues.length === 1 ? newValues[0] : newValues);
      },
      onPanResponderRelease: () => {},
    })
  );

  const trackWidth = 300; // track width in pixels (adjustable)

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.track, { width: trackWidth }, trackStyle]} />
      {values.map((val, i) => {
        const left = panValues[i].interpolate({
          inputRange: [min, max],
          outputRange: [0, trackWidth - 20], // subtract thumb width
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            key={i}
            {...panResponder[i].panHandlers}
            style={[
              styles.thumb,
              { transform: [{ translateX: left }] },
              thumbStyle,
            ]}
          />
        );
      })}
      {/* Range bar */}
      {values.length > 1 && (
        <Animated.View
          style={[
            styles.range,
            rangeStyle,
            {
              left: panValues[0].interpolate({
                inputRange: [min, max],
                outputRange: [0, trackWidth - 20],
                extrapolate: "clamp",
              }),
              width: Animated.subtract(
                panValues[1].interpolate({
                  inputRange: [min, max],
                  outputRange: [0, trackWidth - 20],
                  extrapolate: "clamp",
                }),
                panValues[0].interpolate({
                  inputRange: [min, max],
                  outputRange: [0, trackWidth - 20],
                  extrapolate: "clamp",
                })
              ),
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: "center",
  },
  track: {
    height: 4,
    backgroundColor: "#ccc",
    borderRadius: 2,
    position: "absolute",
    left: 0,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#007AFF",
    position: "absolute",
    top: 10,
  },
  range: {
    position: "absolute",
    height: 4,
    backgroundColor: "#007AFF",
    top: 18,
  },
});

export { Slider };
