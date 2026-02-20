import * as React from "react";
import {
    StyleSheet,
    Text,
    TextProps,
} from "react-native";

type LabelProps = TextProps & {
  disabled?: boolean;
};

export function Label({ style, disabled, ...props }: LabelProps) {
  return (
    <Text
      style={[
        styles.label,
        disabled && styles.disabled,
        style,
      ]}
      {...props}
    />
  );
}


const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 4,
  },
  disabled: {
    opacity: 0.5,
  },
});