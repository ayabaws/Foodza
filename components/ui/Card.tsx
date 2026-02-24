import React from "react";
import { StyleSheet, Text, TextProps, View, ViewProps } from "react-native";
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Theme } from '@/constants/theme';

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'outlined';
}
interface CardTextProps extends TextProps {}

export function Card({ style, variant = 'default', ...props }: CardProps) {
  const colorScheme = useColorScheme();
  const theme = Theme.colors[colorScheme as keyof typeof Theme.colors];
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return [Theme.shadow.md, { backgroundColor: theme.background.primary }];
      case 'outlined':
        return [{ 
          backgroundColor: theme.background.primary,
          borderWidth: 1,
          borderColor: theme.border.medium
        }];
      default:
        return [{ 
          backgroundColor: theme.background.primary,
          borderWidth: 1,
          borderColor: theme.border.light
        }];
    }
  };

  return <View style={[styles.card, getVariantStyles(), style]} {...props} />;
}

export function CardHeader({ style, ...props }: CardProps) {
  return <View style={[styles.cardHeader, style]} {...props} />;
}

export function CardTitle({ style, ...props }: CardTextProps) {
  const colorScheme = useColorScheme();
  const theme = Theme.colors[colorScheme as keyof typeof Theme.colors];
  
  return <Text style={[styles.cardTitle, { color: theme.text.primary }, style]} {...props} />;
}

export function CardDescription({ style, ...props }: CardTextProps) {
  const colorScheme = useColorScheme();
  const theme = Theme.colors[colorScheme as keyof typeof Theme.colors];
  
  return <Text style={[styles.cardDescription, { color: theme.text.secondary }, style]} {...props} />;
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
    borderRadius: Theme.borderRadius.lg,
    flexDirection: "column",
    gap: Theme.spacing.component.md,
    paddingVertical: Theme.spacing.xs,
  },
  cardHeader: {
    paddingHorizontal: Theme.spacing.card.padding,
    paddingTop: Theme.spacing.card.padding,
    gap: Theme.spacing.xs,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardTitle: {
    ...Theme.typography.styles.h4,
  },
  cardDescription: {
    ...Theme.typography.styles.body2,
  },
  cardAction: {
    alignSelf: "flex-end",
    position: "absolute",
    top: Theme.spacing.card.padding,
    right: Theme.spacing.card.padding,
  },
  cardContent: {
    paddingHorizontal: Theme.spacing.card.padding,
    paddingBottom: Theme.spacing.card.padding,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Theme.spacing.card.padding,
    paddingVertical: Theme.spacing.card.padding,
    justifyContent: "flex-start",
  },
});