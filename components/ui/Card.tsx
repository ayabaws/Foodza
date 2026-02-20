import React from "react";
import { StyleSheet, Text, TextProps, View, ViewProps } from "react-native";

interface CardProps extends ViewProps {}
interface CardTextProps extends TextProps {}

export function Card({ style, ...props }: CardProps) {
  return <View style={[styles.card, style]} {...props} />;
}

export function CardHeader({ style, ...props }: CardProps) {
  return <View style={[styles.cardHeader, style]} {...props} />;
}

export function CardTitle({ style, ...props }: CardTextProps) {
  return <Text style={[styles.cardTitle, style]} {...props} />;
}

export function CardDescription({ style, ...props }: CardTextProps) {
  return <Text style={[styles.cardDescription, style]} {...props} />;
}

export function CardAction({ style, ...props }: CardProps) {
  return <View style={[styles.cardAction, style]} {...props} />;
}

export function CardContent({ style, ...props }: CardProps) {
  return <View style={[styles.cardContent, style]} {...props} />;
}

export function CardFooter({ style, ...props }: CardProps) {
  return <View style={[styles.cardFooter, style]} {...props} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff", // bg-card
    borderColor: "#e2e2e2", // border
    borderWidth: 1,
    borderRadius: 16,
    flexDirection: "column",
    gap: 12, // spacing entre enfants
    paddingVertical: 6,
  },
  cardHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    lineHeight: 22,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666", // text-muted-foreground
  },
  cardAction: {
    alignSelf: "flex-end",
    position: "absolute",
    top: 16,
    right: 16,
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: "flex-start",
  },
});