import React, { useState } from "react";
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native";

type ToggleProps = {
  value?: boolean; // état contrôlé
  defaultValue?: boolean; // état initial
  onValueChange?: (value: boolean) => void; // callback au toggle
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
  children?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
};

export function Toggle({
  value,
  defaultValue = false,
  onValueChange,
  variant = "default",
  size = "default",
  children,
  style,
  textStyle,
  disabled = false,
}: ToggleProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isOn = value !== undefined ? value : internalValue;

  const handlePress = () => {
    if (disabled) return;
    const newValue = !isOn;
    setInternalValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[
        styles.base,
        variant === "outline" && styles.outline,
        sizeStyles[size],
        isOn && styles.on,
        style,
        disabled && styles.disabled,
      ]}
      disabled={disabled}
    >
      <Text style={[styles.text, isOn && styles.textOn, textStyle]}>{children}</Text>
    </TouchableOpacity>
  );
}

// Styles de base
const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "transparent",
    paddingHorizontal: 8,
    height: 36,
    minWidth: 36,
  },
  outline: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  on: {
    backgroundColor: "#3B82F6", // accent color
  },
  text: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "500",
  },
  textOn: {
    color: "#FFFFFF",
  },
  disabled: {
    opacity: 0.5,
  },
});

const sizeStyles: Record<string, ViewStyle> = {
  default: { height: 36, minWidth: 36, paddingHorizontal: 8 },
  sm: { height: 32, minWidth: 32, paddingHorizontal: 6 },
  lg: { height: 40, minWidth: 40, paddingHorizontal: 10 },
};