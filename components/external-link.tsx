import React from 'react';
import { Linking, Pressable, Text, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  style?: any;
}

export function ExternalLink({ href, children, style }: ExternalLinkProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handlePress = async () => {
    try {
      await Linking.openURL(href);
    } catch (error) {
      console.error('Failed to open URL:', error);
    }
  };

  return (
    <Pressable onPress={handlePress}>
      <Text style={[styles.link, { color: colors.tint }, style]}>
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  link: {
    textDecorationLine: 'underline',
  },
});
