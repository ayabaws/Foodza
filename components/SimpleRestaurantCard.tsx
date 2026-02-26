import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const isMediumScreen = screenWidth >= 375 && screenWidth < 414;
const isLargeScreen = screenWidth >= 414;

interface RestaurantCardProps {
  restaurant: {
    id: string;
    name: string;
    image: string;
    rating: number;
    deliveryTime: string;
    distance: string;
    discount?: string;
    dishes?: Array<{
      name: string;
      price: number;
      image: string;
      slices?: string;
    }>;
  };
  onPress: (restaurant: any) => void;
}

export default function RestaurantCard({ restaurant, onPress }: RestaurantCardProps) {
  const { colors } = useTheme();
  const [currentDishIndex, setCurrentDishIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const dishes = restaurant.dishes || [
    { name: 'Pizza Margherita', price: 5000, image: restaurant.image, slices: '8 tranches' },
    { name: 'Pizza Royale', price: 6500, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500', slices: '8 tranches' },
  ];

  const currentDish = dishes[currentDishIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0.3,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setCurrentDishIndex((prev) => (prev + 1) % dishes.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      });
    }, 8000); // 8 secondes par image

    return () => clearInterval(interval);
  }, [dishes.length]);

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.surface }]} 
      onPress={() => onPress(restaurant)}
      activeOpacity={0.95}
    >
      <View style={styles.imageContainer}>
        <Animated.Image 
          source={{ uri: currentDish.image }} 
          style={[styles.restaurantImage, { opacity: fadeAnim }]}
        />
        
        {/* Overlay Infos Plat (Haut Gauche) */}
        <View style={styles.dishOverlay}>
          <Text style={styles.dishNameText}>{currentDish.name}</Text>
          <Text style={styles.dishPriceText}>
            ({currentDish.slices}) <Text style={{fontWeight: 'bold'}}>{currentDish.price} FCFA</Text>
          </Text>
        </View>

        {/* Boutons Actions (Haut Droite) */}
        <View style={styles.topActions}>
          <TouchableOpacity style={styles.circleButton}>
            <Ionicons name="heart-outline" size={20} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.circleButton}>
            <Ionicons name="eye-off-outline" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Badge Livraison (Le "Notch" en bas à gauche) */}
        <View style={styles.deliveryNotch}>
          <MaterialCommunityIcons name="moped" size={20} color="#666" />
          <Text style={styles.deliveryText}>{restaurant.deliveryTime} • {restaurant.distance}</Text>
        </View>

        {/* Pagination (Points en bas à droite) */}
        <View style={styles.pagination}>
          {dishes.map((_, i) => (
            <View 
              key={i} 
              style={[
                styles.dot, 
                i === currentDishIndex ? styles.activeDot : { width: 6, backgroundColor: 'rgba(255,255,255,0.6)' }
              ]} 
            />
          ))}
        </View>
      </View>

      {/* Footer Info */}
      <View style={styles.footer}>
        <View style={styles.footerMain}>
          <Text style={[styles.brandName, { color: colors.text?.primary || '#000' }]}>{restaurant.name}</Text>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingValue}>{restaurant.rating}</Text>
            <Ionicons name="star-sharp" size={14} color="#FFF" />
          </View>
        </View>

        <View style={styles.footerBottom}>
          <View style={styles.promoContainer}>
            <MaterialCommunityIcons name="brightness-percent" size={16} color="#8B4513" />
            <Text style={styles.promoText}>{restaurant.discount || '30% de réduction'}</Text>
          </View>
          <Text style={styles.forYouText}>Pour toi</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: isSmallScreen ? screenWidth - 40 : isMediumScreen ? 352 : 364,
    borderRadius: isSmallScreen ? 16 : 20,
    marginRight: isSmallScreen ? 12 : 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: isSmallScreen ? 8 : 10,
  },
  imageContainer: {
    height: isSmallScreen ? 160 : isMediumScreen ? 175 : 190,
    width: '100%',
    position: 'relative',
    backgroundColor: '#F0F0F0',
  },
  restaurantImage: {
    width: '100%',
    height: '100%',
  },
  dishOverlay: {
    position: 'absolute',
    top: isSmallScreen ? 10 : 12,
    left: isSmallScreen ? 10 : 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: isSmallScreen ? 6 : 8,
    borderRadius: isSmallScreen ? 8 : 10,
    maxWidth: '60%',
  },
  dishNameText: {
    color: '#FFF',
    fontSize: isSmallScreen ? 11 : 12,
    fontWeight: '500',
  },
  dishPriceText: {
    color: '#FFF',
    fontSize: isSmallScreen ? 9 : 10,
  },
  topActions: {
    position: 'absolute',
    top: isSmallScreen ? 10 : 12,
    right: isSmallScreen ? 10 : 12,
    flexDirection: 'row',
  },
  circleButton: {
    width: isSmallScreen ? 32 : 36,
    height: isSmallScreen ? 32 : 36,
    borderRadius: isSmallScreen ? 16 : 18,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: isSmallScreen ? 6 : 8,
  },
  deliveryNotch: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: '#FFF',
    borderTopRightRadius: isSmallScreen ? 4 : 5,
    paddingHorizontal: isSmallScreen ? 16 : 20,
    paddingVertical: isSmallScreen ? 6 : 8,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  deliveryText: {
    marginLeft: 6,
    fontSize: isSmallScreen ? 10 : 11,
    color: '#666',
    fontWeight: '500',
  },
  pagination: {
    position: 'absolute',
    bottom: isSmallScreen ? 10 : 12,
    right: isSmallScreen ? 10 : 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    height: isSmallScreen ? 5 : 6,
    borderRadius: isSmallScreen ? 2.5 : 3,
    marginHorizontal: isSmallScreen ? 1.5 : 2,
  },
  activeDot: {
    width: isSmallScreen ? 16 : 20,
    backgroundColor: '#FFF',
  },
  footer: {
    padding: isSmallScreen ? 12 : 15,
    backgroundColor: '#FFF',
  },
  footerMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: isSmallScreen ? 6 : 8,
  },
  brandName: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: '700',
  },
  ratingBadge: {
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: isSmallScreen ? 6 : 8,
    paddingVertical: isSmallScreen ? 3 : 4,
    borderRadius: isSmallScreen ? 6 : 8,
  },
  ratingValue: {
    color: '#FFF',
    fontWeight: '500',
    marginRight: 4,
    fontSize: isSmallScreen ? 10 : 12,
  },
  footerBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoText: {
    marginLeft: 5,
    color: '#444',
    fontSize: isSmallScreen ? 10 : 11,
    fontWeight: '500',
  },
  forYouText: {
    color: '#999',
    fontSize: isSmallScreen ? 10 : 12,
  },
});