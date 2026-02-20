import React, { createContext, useContext } from "react";
import { StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native";

// Si tu veux garder les types variant/size
type ToggleVariants = {
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
};

const ToggleGroupContext = createContext<ToggleVariants>({
  size: "default",
  variant: "default",
});

type ToggleGroupProps = {
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
  children: React.ReactNode;
  style?: ViewStyle;
};

export function ToggleGroup({ variant = "default", size = "default", children, style }: ToggleGroupProps) {
  return (
    <ToggleGroupContext.Provider value={{ variant, size }}>
      <View style={[styles.group, variant === "outline" && styles.groupOutline, style]}>
        {children}
      </View>
    </ToggleGroupContext.Provider>
  );
}

type ToggleGroupItemProps = {
  children: React.ReactNode;
  value?: string;
  onPress?: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export function ToggleGroupItem({ children, onPress, style, textStyle }: ToggleGroupItemProps) {
  const context = useContext(ToggleGroupContext);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.item,
        context.variant === "outline" && styles.itemOutline,
        style,
      ]}
    >
      <Text style={[styles.itemText, textStyle]}>{children}</Text>
    </TouchableOpacity>
  );
}

// Styles de base (tu peux ajuster selon ton design)
const styles = StyleSheet.create({
  group: {
    flexDirection: "row",
    borderRadius: 8,
    overflow: "hidden",
  },
  groupOutline: {
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  item: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#E5E7EB", // bg par défaut
    alignItems: "center",
    justifyContent: "center",
  },
  itemOutline: {
    borderWidth: 1,
    borderColor: "#D1D5DB", // couleur outline
  },
  itemText: {
    color: "#111827",
    fontSize: 16,
  },
});