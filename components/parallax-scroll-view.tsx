import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ParallaxScrollViewProps {
  children: React.ReactNode;
  headerImage?: React.ReactNode;
  headerBackgroundColor?: string;
}

export default function ParallaxScrollView({ 
  children, 
  headerImage, 
  headerBackgroundColor = '#E6F4FE' 
}: ParallaxScrollViewProps) {
  const colorScheme = useColorScheme();

  return (
    <ScrollView style={styles.container}>
      {headerImage && (
        <View style={[styles.header, { backgroundColor: headerBackgroundColor }]}>
          {headerImage}
        </View>
      )}
      <View style={styles.content}>
        {children}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
