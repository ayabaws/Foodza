import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

// Button variants simplifié pour RN
function PaginationButton({
  children,
  isActive,
  onPress,
}: {
  children: React.ReactNode;
  isActive?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        isActive ? styles.buttonActive : styles.buttonInactive,
      ]}
    >
      {children}
    </Pressable>
  );
}

// Container principal
export function Pagination({ children }: { children: React.ReactNode }) {
  return <View style={styles.container}>{children}</View>;
}

// Liste des items
export function PaginationContent({ children }: { children: React.ReactNode }) {
  return <View style={styles.list}>{children}</View>;
}

// Item
export function PaginationItem({ children }: { children: React.ReactNode }) {
  return <View style={styles.item}>{children}</View>;
}

// Link standard
export function PaginationLink({
  children,
  isActive,
  onPress,
}: {
  children: React.ReactNode;
  isActive?: boolean;
  onPress?: () => void;
}) {
  return (
    <PaginationButton isActive={isActive} onPress={onPress}>
      <Text style={styles.linkText}>{children}</Text>
    </PaginationButton>
  );
}

// Previous
export function PaginationPrevious({ onPress }: { onPress?: () => void }) {
  return (
    <PaginationButton onPress={onPress}>
      <ChevronLeft width={16} height={16} />
      <Text style={styles.prevNextText}> Previous</Text>
    </PaginationButton>
  );
}

// Next
export function PaginationNext({ onPress }: { onPress?: () => void }) {
  return (
    <PaginationButton onPress={onPress}>
      <Text style={styles.prevNextText}>Next </Text>
      <ChevronRight width={16} height={16} />
    </PaginationButton>
  );
}

// Ellipsis
export function PaginationEllipsis() {
  return (
    <View style={styles.ellipsis}>
      <MoreHorizontal width={16} height={16} />
    </View>
  );
}

// Styles React Native
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 12,
  },
  list: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  item: {},
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  buttonActive: {
    backgroundColor: "#E0E0E0",
  },
  buttonInactive: {
    backgroundColor: "transparent",
  },
  linkText: {
    fontSize: 14,
  },
  prevNextText: {
    fontSize: 14,
    marginHorizontal: 4,
  },
  ellipsis: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
});