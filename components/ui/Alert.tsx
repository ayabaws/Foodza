import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

type AlertVariant = 'default' | 'destructive';

interface AlertProps {
  variant?: AlertVariant;
  children: React.ReactNode;
  style?: ViewStyle;
}

interface AlertTitleProps {
  children: React.ReactNode;
  style?: TextStyle;
}

interface AlertDescriptionProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export function Alert({ variant = 'default', children, style }: AlertProps) {
  const backgroundColor =
    variant === 'destructive' ? '#ffe5e5' : '#f9fafb';
  const textColor =
    variant === 'destructive' ? '#b91c1c' : '#111827';

  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      {React.Children.map(children, (child) => {
        // on transmet la couleur du texte aux enfants AlertTitle / AlertDescription
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { textColor });
        }
        return child;
      })}
    </View>
  );
}

export function AlertTitle({ children, style, textColor }: AlertTitleProps & { textColor?: string }) {
  return (
    <Text style={[styles.title, { color: textColor || '#111827' }, style]}>
      {children}
    </Text>
  );
}

export function AlertDescription({ children, style, textColor }: AlertDescriptionProps & { textColor?: string }) {
  return (
    <Text style={[styles.description, { color: textColor || '#6b7280' }, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
});