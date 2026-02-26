import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const isMediumScreen = screenWidth >= 375 && screenWidth < 414;
const isLargeScreen = screenWidth >= 414;

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    image: any;
  };
  isSelected: boolean;
  onPress: (categoryName: string) => void;
  itemCount?: number;
}

export default function CategoryCard({ 
  category, 
  isSelected, 
  onPress,
  itemCount 
}: CategoryCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(category.name)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {/* Image de la catégorie (sans wrapper coloré ni bordure) */}
        <Image 
          source={category.image} 
          style={styles.categoryImage} 
        />
        
        <Text style={[
          styles.categoryText,
          isSelected && { fontWeight: '700', color: '#000' }
        ]}>
          {category.name}
        </Text>
      </View>

      {/* Indicateur de sélection (la ligne marron en bas) */}
      {isSelected && (
        <View style={[styles.activeIndicator, { backgroundColor: colors.primary || '#8B4513' }]} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: isSmallScreen ? 8 : 10,
    paddingBottom: isSmallScreen ? 6 : 8,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryImage: {
    width: isSmallScreen ? 55 : isMediumScreen ? 65 : 70,
    height: isSmallScreen ? 42 : isMediumScreen ? 50 : 56,
    resizeMode: 'contain',
    marginBottom: isSmallScreen ? 3 : 4,
  },
  categoryText: {
    fontSize: isSmallScreen ? 12 : isMediumScreen ? 13 : 14,
    color: '#000',
    textAlign: 'center',
  },
  itemCount: {
    fontSize: isSmallScreen ? 9 : 10,
    color: '#666',
    textAlign: 'center',
    marginTop: isSmallScreen ? 1 : 2,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: isSmallScreen ? 1.5 : 2,
    borderRadius: isSmallScreen ? 1 : 2,
  },
});