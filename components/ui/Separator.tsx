import React from "react";
import { View } from "react-native";

type SeparatorProps = {
  orientation?: "horizontal" | "vertical";
  color?: string;
  thickness?: number;
  length?: number | string;
  style?: object;
};

export function Separator({
  orientation = "horizontal",
  color = "#ccc",
  thickness = 1,
  length = "100%",
  style,
}: SeparatorProps) {
  return (
    <View
      style={[
        orientation === "horizontal"
          ? { height: thickness, width: length }
          : { width: thickness, height: length },
        { backgroundColor: color },
        style,
      ]}
    />
  );
}