import React from "react";
import { StyleSheet, Text, TextProps, View, ViewProps } from "react-native";
import { useTheme } from '@/contexts/ThemeContext';

interface CardProps extends ViewProps {
  variant?: 'default' | 'elevated' | 'outlined';
}
interface CardTextProps extends TextProps {}

export function Card({ style, variant = 'default', ...props }: CardProps) {
  const { colors } = useTheme();
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return [{ 
          backgroundColor: colors.surface,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3
        }];
      case 'outlined':
        return [{ 
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border.medium
        }];
      default:
        return [{ 
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border.light
        }];
    }
  };

  return <View style={[styles.card, getVariantStyles(), style]} {...props} />;
}

export function CardHeader({ style, ...props }: CardProps) {
  return <View style={[styles.cardHeader, style]} {...props} />;
}

export function CardTitle({ style, ...props }: CardTextProps) {
  const { colors } = useTheme();
  
  return <Text style={[styles.cardTitle, { color: colors.text.primary }, style]} {...props} />;
}

export function CardDescription({ style, ...props }: CardTextProps) {
  const { colors } = useTheme();
  
  return <Text style={[styles.cardDescription, { color: colors.text.secondary }, style]} {...props} />;
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
    borderRadius: 12,
    flexDirection: "column",
    paddingVertical: 8,
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
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
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