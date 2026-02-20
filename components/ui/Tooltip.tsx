import React, { useState } from "react";
import {
    Pressable,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle
} from "react-native";

type TooltipProps = {
  content: React.ReactNode | string;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  offset?: number;
  tooltipStyle?: ViewStyle;
  textStyle?: TextStyle;
};

export function Tooltip({
  content,
  children,
  side = "top",
  offset = 8,
  tooltipStyle,
  textStyle,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <Pressable
      onPressIn={() => setVisible(true)}
      onPressOut={() => setVisible(false)}
    >
      {children}

      {visible && (
        <View style={[styles.tooltipWrapper]}>
          <View
            style={[
              styles.tooltip,
              sideStyles[side](offset),
              tooltipStyle,
            ]}
          >
            {typeof content === "string" ? (
              <Text style={[styles.tooltipText, textStyle]}>{content}</Text>
            ) : (
              content
            )}
          </View>
        </View>
      )}
    </Pressable>
  );
}

// Styles de base
const styles = StyleSheet.create({
  tooltipWrapper: {
    position: "absolute",
    zIndex: 1000,
    width: "100%",
    alignItems: "center",
  },
  tooltip: {
    backgroundColor: "#3B82F6", // accent
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    maxWidth: 200,
  },
  tooltipText: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
  },
});

// Position selon le côté
const sideStyles: Record<
  "top" | "bottom" | "left" | "right",
  (offset: number) => ViewStyle
> = {
  top: (offset) => ({ bottom: offset, alignSelf: "center" }),
  bottom: (offset) => ({ top: offset, alignSelf: "center" }),
  left: (offset) => ({ right: offset, alignSelf: "flex-start" }),
  right: (offset) => ({ left: offset, alignSelf: "flex-end" }),
};