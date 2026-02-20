import React from 'react';
import {
    GestureResponderEvent,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';

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
}

export function Button({
  children,
  onPress,
  variant = 'default',
  size = 'default',
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const variantStyles = VARIANT_STYLES[variant] || VARIANT_STYLES.default;
  const sizeStyles = SIZE_STYLES[size] || SIZE_STYLES.default;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.base, variantStyles, sizeStyles, disabled && styles.disabled, style]}
    >
      {typeof children === 'string' ? (
        <Text style={[styles.text, TEXT_VARIANT_STYLES[variant], textStyle]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

// Couleurs et styles par variant
const VARIANT_STYLES: Record<ButtonVariant, ViewStyle> = {
  default: { backgroundColor: '#A64B2A' },
  destructive: { backgroundColor: '#dc2626' },
  outline: { borderWidth: 1, borderColor: '#A64B2A', backgroundColor: 'transparent' },
  secondary: { backgroundColor: '#f3f4f6' },
  ghost: { backgroundColor: 'transparent' },
  link: { backgroundColor: 'transparent' },
};

const TEXT_VARIANT_STYLES: Record<ButtonVariant, TextStyle> = {
  default: { color: '#fff' },
  destructive: { color: '#fff' },
  outline: { color: '#A64B2A' },
  secondary: { color: '#000' },
  ghost: { color: '#000' },
  link: { color: '#A64B2A', textDecorationLine: 'underline' },
};

// Tailles du bouton
const SIZE_STYLES: Record<ButtonSize, ViewStyle> = {
  default: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  sm: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  lg: { paddingVertical: 14, paddingHorizontal: 20, borderRadius: 10 },
  icon: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
};

const styles = StyleSheet.create({
  base: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
  disabled: {
    opacity: 0.5,
  },
});