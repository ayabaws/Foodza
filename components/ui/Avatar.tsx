import React from 'react';
import { View, Image, Text, StyleSheet, ViewProps, ImageProps } from 'react-native';

interface AvatarProps extends ViewProps {}
interface AvatarImageProps extends ImageProps {}
interface AvatarFallbackProps extends ViewProps {
  children?: React.ReactNode;
}

export function Avatar({ style, children, ...props }: AvatarProps) {
  return (
    <View style={[styles.avatar, style]} {...props}>
      {children}
    </View>
  );
}

export function AvatarImage({ style, ...props }: AvatarImageProps) {
  return <Image style={[styles.avatarImage, style]} {...props} />;
}

export function AvatarFallback({ style, children, ...props }: AvatarFallbackProps) {
  return (
    <View style={[styles.avatarFallback, style]} {...props}>
      {children ? children : <Text style={styles.fallbackText}>?</Text>}
    </View>
  );
}

const SIZE = 40;

const styles = StyleSheet.create({
  avatar: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});