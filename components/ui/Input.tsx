import * as React from "react";
import {
    StyleSheet,
    TextInput,
    TextInputProps,
} from "react-native";

type InputProps = TextInputProps & {
  invalid?: boolean;
};

export function Input({ style, invalid, ...props }: InputProps) {
  return (
    <TextInput
      style={[styles.input, invalid && styles.invalid, style]}
      placeholderTextColor="#9ca3af"
      {...props}
    />
  );
}


const styles = StyleSheet.create({
  input: {
    height: 40,
    width: "100%",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#ffffff",
  },
  invalid: {
    borderColor: "#ef4444",
  },
});


