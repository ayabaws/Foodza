import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const isMediumScreen = screenWidth >= 375 && screenWidth < 414;
const isLargeScreen = screenWidth >= 414;

interface DishCardProps {
  item: {
    id: string;
    name: string;
    image: string;
    price: string;
    description: string;
    category: string;
    rating: number;
    priceRange: string;
    discount?: string;
    deliveryTime: string;
  };
  onPress: (item: any) => void;
}

export default function DishCard({ item, onPress }: DishCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={() => onPress(item)}
      activeOpacity={0.9}
    >
      {/* Image Container - Toute la largeur */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.dishImage}
          resizeMode="cover"
          onError={(error) => console.log('Image loading error:', error)}
        />

        {/* Badge de réduction (ex: 70% OFF) */}
        {item.discount && (
          <View style={styles.discountBadge}>
            <Ionicons name="timer-outline" size={12} color="#FFF" />
            <Text style={styles.discountText}>{item.discount}</Text>
          </View>
        )}

        {/* Badge de note noir (ex: 4.3 ★) à cheval sur le bord */}
        <View style={styles.ratingNotch}>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{item.rating}</Text>
            <Ionicons name="star" size={10} color="#FFD700" style={{ marginLeft: 3 }} />
          </View>
        </View>
      </View>

      {/* Section Contenu */}
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text.primary }]}>
          {item.name}
        </Text>

        <Text style={[styles.priceRange, { color: colors.text.secondary }]}>
          Prix: {item.priceRange}
        </Text>

        <View style={styles.deliveryRow}>
          <MaterialCommunityIcons name="bicycle" size={18} color="#8B4513" />
          <Text style={styles.deliveryTime}>{item.deliveryTime}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%', // Occupe toute la largeur de la page
    borderRadius: 30,
    marginBottom: 20,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  imageContainer: {
    height: 180,
    width: '100%',
    position: 'relative',
    marginBottom: 18,
  },
  dishImage: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
  },
  discountText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  ratingNotch: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: '#FFF',
    borderTopRightRadius: isSmallScreen ? 10 : 12,
    paddingTop: isSmallScreen ? 5 : 6,
    paddingRight: isSmallScreen ? 6 : 8,
  },
  ratingBadge: {
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: isSmallScreen ? 8 : 12,
    paddingVertical: isSmallScreen ? 3 : 4,
    borderRadius: isSmallScreen ? 6 : 8,
  },
  ratingText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  priceRange: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  deliveryTime: {
    fontSize: 13,
    color: '#8B4513',
    fontWeight: '600',
  },
});