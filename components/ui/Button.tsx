import React from 'react';
import {
    GestureResponderEvent,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { colors } = useTheme();
  
  const variantStyles = getVariantStyles(variant, colors);
  const sizeStyles = getSizeStyles(size);
  const textVariantStyles = getTextVariantStyles(variant, colors);

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

const getVariantStyles = (variant: ButtonVariant, colors: any): ViewStyle => {
  switch (variant) {
    case 'default':
      return { backgroundColor: colors.primary };
    case 'destructive':
      return { backgroundColor: '#FF4444' };
    case 'outline':
      return { 
        borderWidth: 1, 
        borderColor: colors.primary, 
        backgroundColor: 'transparent' 
      };
    case 'secondary':
      return { backgroundColor: colors.surface };
    case 'ghost':
      return { backgroundColor: 'transparent' };
    case 'link':
      return { backgroundColor: 'transparent' };
    default:
      return { backgroundColor: colors.primary };
  }
};

const getTextVariantStyles = (variant: ButtonVariant, colors: any): TextStyle => {
  switch (variant) {
    case 'default':
      return { color: colors.text.inverse };
    case 'destructive':
      return { color: colors.text.inverse };
    case 'outline':
      return { color: colors.primary };
    case 'secondary':
      return { color: colors.text.primary };
    case 'ghost':
      return { color: colors.text.primary };
    case 'link':
      return { color: colors.primary, textDecorationLine: 'underline' };
    default:
      return { color: colors.text.inverse };
  }
};

const getSizeStyles = (size: ButtonSize): ViewStyle => {
  switch (size) {
    case 'default':
      return { 
        paddingVertical: 12, 
        paddingHorizontal: 24, 
        borderRadius: 8 
      };
    case 'sm':
      return { 
        paddingVertical: 8, 
        paddingHorizontal: 16, 
        borderRadius: 6 
      };
    case 'lg':
      return { 
        paddingVertical: 16, 
        paddingHorizontal: 32, 
        borderRadius: 12 
      };
    case 'icon':
      return { 
        width: 36, 
        height: 36, 
        justifyContent: 'center', 
        alignItems: 'center', 
        borderRadius: 18 
      };
    default:
      return { 
        paddingVertical: 12, 
        paddingHorizontal: 24, 
        borderRadius: 8 
      };
  }
};

const styles = StyleSheet.create({
  base: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});