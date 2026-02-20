// CheckboxNative.tsx
import { Check } from 'lucide-react-native';
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

type CheckboxProps = {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
};

export const Checkbox = ({ checked = false, onChange, label, disabled }: CheckboxProps) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.checkboxBase,
        checked && styles.checkboxChecked,
        pressed && styles.checkboxPressed,
        disabled && styles.checkboxDisabled,
      ]}
      onPress={() => !disabled && onChange?.(!checked)}
      disabled={disabled}
    >
      {checked && <Check size={16} color="white" />}
      {label && <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  checkboxBase: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#A64B2A",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    flexDirection: "row",
  },
  checkboxChecked: {
    backgroundColor: "#A64B2A",
    borderColor: "#A64B2A",
  },
  checkboxPressed: {
    opacity: 0.8,
  },
  checkboxDisabled: {
    opacity: 0.5,
    borderColor: "#999",
  },
  label: {
    fontSize: 16,
    color: '#000',
    marginLeft: 8,
  },
  labelDisabled: {
    color: '#999',
  },
});