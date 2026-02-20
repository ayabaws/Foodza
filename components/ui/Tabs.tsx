import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type TabsProps = {
  children: React.ReactNode;
  className?: any;
};

export function Tabs({ children, className }: TabsProps) {
  return <View style={[styles.tabsContainer, className]}>{children}</View>;
}

type TabsListProps = {
  children: React.ReactNode;
  className?: any;
};

export function TabsList({ children, className }: TabsListProps) {
  return <View style={[styles.tabsList, className]}>{children}</View>;
}

type TabsTriggerProps = {
  title: string;
  isActive?: boolean;
  onPress?: () => void;
  className?: any;
};

export function TabsTrigger({ title, isActive, onPress, className }: TabsTriggerProps) {
  return (
    <TouchableOpacity
      style={[
        styles.tabTrigger,
        isActive && styles.tabTriggerActive,
        className,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{title}</Text>
    </TouchableOpacity>
  );
}

type TabsContentProps = {
  children: React.ReactNode;
  isActive?: boolean;
  className?: any;
};

export function TabsContent({ children, isActive, className }: TabsContentProps) {
  if (!isActive) return null; // Ne rend que l'onglet actif
  return <View style={[styles.tabsContent, className]}>{children}</View>;
}

// Styles de base
const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: "column",
    gap: 8, // équivalent de `gap-2`
  },
  tabsList: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6", // bg-muted
    borderRadius: 12, // rounded-xl
    padding: 3,
    alignSelf: "flex-start",
  },
  tabTrigger: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
  },
  tabTriggerActive: {
    backgroundColor: "#E5E7EB", // bg-card
  },
  tabText: {
    fontSize: 14,
    color: "#6B7280", // text-muted-foreground
  },
  tabTextActive: {
    color: "#111827", // text-foreground
    fontWeight: "600",
  },
  tabsContent: {
    flex: 1,
    marginTop: 8,
  },
});