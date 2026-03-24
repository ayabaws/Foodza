import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 380;
const isMediumScreen = width >= 380 && width < 768;

interface DishCardProps {
  item: {
    id: string;
    name: string;
    image: any;
    price: number;
    description?: string;
    category?: string;
    rating?: number;
    deliveryTime?: string;
  };
  onPress: () => void;
}

export default function DishCard({ item, onPress }: DishCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.dishCard, { backgroundColor: colors.surface }]} 
      onPress={onPress}
    >
      <View style={styles.cardContent}>
        {/* Image du plat */}
        <View style={styles.imageContainer}>
          <Image source={item.image} style={styles.dishImage} />
          {item.rating && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={isSmallScreen ? 10 : 12} color="#FFA500" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          )}
        </View>
        
        {/* Contenu du plat */}
        <View style={styles.dishContent}>
          <View style={styles.dishHeader}>
            <View style={styles.dishTitleContainer}>
              <Text style={[styles.dishName, { color: colors.text.primary }]}>
                {item.name}
              </Text>
              {item.category && (
                <Text style={[styles.dishCategory, { color: colors.text.secondary }]}>
                  {item.category}
                </Text>
              )}
            </View>
            
            <TouchableOpacity style={styles.favoriteButton}>
              <Ionicons 
                name="heart-outline" 
                size={isSmallScreen ? 18 : 20} 
                color={colors.text.secondary} 
              />
            </TouchableOpacity>
          </View>
          
          {item.description && (
            <Text 
              style={[styles.dishDescription, { color: colors.text.secondary }]} 
              numberOfLines={2}
            >
              {item.description}
            </Text>
          )}
          
          <View style={styles.dishFooter}>
            <View style={styles.priceContainer}>
              <Text style={[styles.dishPrice, { color: colors.text.primary }]}>
                {item.price.toLocaleString()} FCFA
              </Text>
              {item.deliveryTime && (
                <View style={styles.deliveryContainer}>
                  <Ionicons 
                    name="time-outline" 
                    size={isSmallScreen ? 10 : 12} 
                    colors="#10B981" 
                  />
                  <Text style={styles.deliveryTime}>{item.deliveryTime}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  dishCard: {
    borderRadius: 16,
    marginBottom: isSmallScreen ? 12 : 15,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flexDirection: 'row',
    padding: isSmallScreen ? 12 : 14,
  },
  imageContainer: {
    width: isSmallScreen ? 80 : 90,
    height: isSmallScreen ? 80 : 90,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: isSmallScreen ? 12 : 14,
    position: 'relative',
  },
  dishImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  ratingContainer: {
    position: 'absolute',
    top: isSmallScreen ? 4 : 6,
    left: isSmallScreen ? 4 : 6,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: isSmallScreen ? 4 : 6,
    paddingVertical: 2,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: isSmallScreen ? 9 : 10,
    fontWeight: '600',
    marginLeft: 2,
    color: '#666',
  },
  dishContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  dishHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: isSmallScreen ? 6 : 8,
  },
  dishTitleContainer: {
    flex: 1,
  },
  dishName: {
    fontSize: isSmallScreen ? 12 : isMediumScreen ? 14 : 16,
    fontWeight: '700',
    marginBottom: 2,
    flexShrink: 1,
  },
  dishCategory: {
    fontSize: isSmallScreen ? 10 : isMediumScreen ? 11 : 12,
    marginBottom: 4,
    flexShrink: 1,
  },
  favoriteButton: {
    padding: isSmallScreen ? 4 : 6,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  dishDescription: {
    fontSize: isSmallScreen ? 10 : isMediumScreen ? 11 : 12,
    lineHeight: isSmallScreen ? 14 : isMediumScreen ? 16 : 18,
    marginBottom: isSmallScreen ? 6 : 8,
    flexShrink: 1,
  },
  dishFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  priceContainer: {
    flex: 1,
  },
  dishPrice: {
    fontSize: isSmallScreen ? 12 : isMediumScreen ? 14 : 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  deliveryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: isSmallScreen ? 6 : 8,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 2,
    alignSelf: 'flex-start',
  },
  deliveryTime: {
    fontSize: isSmallScreen ? 8 : isMediumScreen ? 9 : 10,
    color: '#10B981',
    fontWeight: '500',
  },
});
