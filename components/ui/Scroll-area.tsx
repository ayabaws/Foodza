import React from "react";
import { ScrollView, StyleSheet, View, ViewProps } from "react-native";

type ScrollAreaProps = {
  children: React.ReactNode;
  horizontal?: boolean;
  style?: any;
  contentContainerStyle?: any;
};

export function ScrollArea({
  children,
  horizontal = false,
  style,
  contentContainerStyle,
}: ScrollAreaProps) {
  return (
    <View style={[styles.container, style]}>
      <ScrollView
        horizontal={horizontal}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={!horizontal}
        showsHorizontalScrollIndicator={horizontal}
        style={styles.scrollView}
      >
        {children}
      </ScrollView>
    </View>
  );
}

type ScrollBarProps = ViewProps & {
  orientation?: "vertical" | "horizontal";
};

export function ScrollBar({ orientation = "vertical", style, ...props }: ScrollBarProps) {
  return (
    <View
      {...props}
      style={[
        orientation === "vertical" ? styles.verticalBar : styles.horizontalBar,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
    position: "relative",
  },
  scrollView: {
    flex: 1,
  },
  verticalBar: {
    width: 4,
    backgroundColor: "#c0c0c0",
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    borderRadius: 2,
  },
  horizontalBar: {
    height: 4,
    backgroundColor: "#c0c0c0",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 2,
  },
});