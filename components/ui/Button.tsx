import React from 'react';
import {
    GestureResponderEvent,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Theme } from '@/constants/theme';
import { Colors } from '@/constants/colors';

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  loading?: boolean;
}

export function Button({
  children,
  onPress,
  variant = 'default',
  size = 'default',
  disabled = false,
  style,
  textStyle,
  loading = false,
}: ButtonProps) {
  const colorScheme = useColorScheme();
  const theme = Theme.colors[colorScheme as keyof typeof Theme.colors];
  
  const variantStyles = getVariantStyles(variant, theme);
  const sizeStyles = getSizeStyles(size);
  const textVariantStyles = getTextVariantStyles(variant, theme);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.base, variantStyles, sizeStyles, disabled && styles.disabled, style]}
    >
      {loading ? (
        <Text style={[styles.text, textVariantStyles, textStyle]}>...</Text>
      ) : typeof children === 'string' ? (
        <Text style={[styles.text, textVariantStyles, textStyle]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

const getVariantStyles = (variant: ButtonVariant, theme: any): ViewStyle => {
  switch (variant) {
    case 'default':
      return { backgroundColor: theme.brand.primary };
    case 'destructive':
      return { backgroundColor: Colors.error };
    case 'outline':
      return { 
        borderWidth: 1, 
        borderColor: theme.brand.primary, 
        backgroundColor: 'transparent' 
      };
    case 'secondary':
      return { backgroundColor: theme.background.secondary };
    case 'ghost':
      return { backgroundColor: 'transparent' };
    case 'link':
      return { backgroundColor: 'transparent' };
    default:
      return { backgroundColor: theme.brand.primary };
  }
};

const getTextVariantStyles = (variant: ButtonVariant, theme: any): TextStyle => {
  switch (variant) {
    case 'default':
      return { color: theme.text.inverse };
    case 'destructive':
      return { color: theme.text.inverse };
    case 'outline':
      return { color: theme.brand.primary };
    case 'secondary':
      return { color: theme.text.primary };
    case 'ghost':
      return { color: theme.text.primary };
    case 'link':
      return { color: theme.brand.primary, textDecorationLine: 'underline' };
    default:
      return { color: theme.text.inverse };
  }
};

const getSizeStyles = (size: ButtonSize): ViewStyle => {
  switch (size) {
    case 'default':
      return { 
        paddingVertical: Theme.spacing.button.padding.md.vertical, 
        paddingHorizontal: Theme.spacing.button.padding.md.horizontal, 
        borderRadius: Theme.spacing.button.borderRadius.md 
      };
    case 'sm':
      return { 
        paddingVertical: Theme.spacing.button.padding.sm.vertical, 
        paddingHorizontal: Theme.spacing.button.padding.sm.horizontal, 
        borderRadius: Theme.spacing.button.borderRadius.sm 
      };
    case 'lg':
      return { 
        paddingVertical: Theme.spacing.button.padding.lg.vertical, 
        paddingHorizontal: Theme.spacing.button.padding.lg.horizontal, 
        borderRadius: Theme.spacing.button.borderRadius.lg 
      };
    case 'icon':
      return { 
        width: 36, 
        height: 36, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderRadius: Theme.spacing.button.borderRadius.sm 
      };
    default:
      return { 
        paddingVertical: Theme.spacing.button.padding.md.vertical, 
        paddingHorizontal: Theme.spacing.button.padding.md.horizontal, 
        borderRadius: Theme.spacing.button.borderRadius.md 
      };
  }
};

const styles = StyleSheet.create({
  base: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    ...Theme.shadow.sm,
  },
  text: {
    ...Theme.typography.styles.button,
  },
  disabled: {
    opacity: 0.5,
  },
});