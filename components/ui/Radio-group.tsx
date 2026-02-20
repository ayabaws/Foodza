import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type RadioGroupProps<T> = {
  value: T;
  onValueChange: (value: T) => void;
  children?: React.ReactNode;
  style?: any;
};

export function RadioGroup<T>({
  value,
  onValueChange,
  children,
  style,
}: RadioGroupProps<T>) {
  return <View style={[styles.group, style]}>{children}</View>;
}

type RadioGroupItemProps<T> = {
  value: T;
  selectedValue: T;
  onSelect: (value: T) => void;
  size?: number;
  style?: any;
};

export function RadioGroupItem<T>({
  value,
  selectedValue,
  onSelect,
  size = 24,
  style,
}: RadioGroupItemProps<T>) {
  const isSelected = value === selectedValue;

  const handlePress = () => {
    onSelect(value);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.item,
        { width: size, height: size, borderRadius: size / 2 },
        style,
      ]}
      activeOpacity={0.7}
    >
      {isSelected && <View style={[styles.indicator, { width: size / 2, height: size / 2, borderRadius: size / 4 }]} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  group: {
    flexDirection: "row",
    gap: 12, // espace entre les radios
  },
  item: {
    borderWidth: 2,
    borderColor: "#3b82f6", // couleur border-input / primary
    backgroundColor: "#fff", // couleur bg-input
    alignItems: "center",
    justifyContent: "center",
  },
  indicator: {
    backgroundColor: "#3b82f6", // couleur du cercle intérieur
  },
});