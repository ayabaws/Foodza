import React from 'react';

import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { useTheme } from '@/contexts/ThemeContext';



const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const isSmallScreen = screenWidth < 375;

const isMediumScreen = screenWidth >= 375 && screenWidth < 414;

const isLargeScreen = screenWidth >= 414;



interface PopularDishCardProps {

  item: {

    id: string;

    name: string;

    image: string;

    rating: number;

    priceRange: string;

    discount?: string;

  };

  onPress: (item: any) => void;

  isFeatured?: boolean;

  index?: number;

}



export default function PopularDishCard({ item, onPress, isFeatured, index }: PopularDishCardProps) {

  const { colors } = useTheme();



  return (

    <TouchableOpacity 

      style={[styles.card, { backgroundColor: colors.surface }]} 

      onPress={() => onPress(item)}

      activeOpacity={0.9}

    >

      {/* Image Wrapper avec coins arrondis en haut */}

      <View style={styles.imageWrapper}>

        <Image source={{ uri: item.image }} style={styles.dishImage} />

        

        {/* Badge de réduction (Haut Gauche) */}

        {item.discount && (

          <View style={styles.discountBadge}>

            <Ionicons name="stopwatch-outline" size={12} color="#FFF" />

            <Text style={styles.discountText}>{item.discount} OFF</Text>

          </View>

        )}



        {/* Le "Notch" blanc pour le Rating (Bas Gauche) */}

        <View style={styles.ratingNotch}>

          <View style={styles.ratingBadge}>

            <Text style={styles.ratingText}>{item.rating}</Text>

            <Ionicons name="star" size={10} color="#FFD700" style={{ marginLeft: 3 }} />

          </View>

        </View>

      </View>



      {/* Section Contenu */}

      <View style={styles.content}>

        <Text style={[styles.dishName, { color: colors.text?.primary || '#000' }]} numberOfLines={1}>

          {item.name}

        </Text>

        

        <Text style={[styles.price, { color: colors.text?.secondary || '#666' }]}>

          Prix: {item.priceRange}

        </Text>



        <View style={styles.deliveryRow}>

          <MaterialCommunityIcons name="moped" size={16} color="#A0522D" />

          <Text style={styles.deliveryText}>25 - 30 mins</Text>

        </View>

      </View>

    </TouchableOpacity>

  );

}



const styles = StyleSheet.create({

  card: {

    width: isSmallScreen ? 200 : isMediumScreen ? 250 : 300,

    borderRadius: isSmallScreen ? 16 : 20,

    marginRight: isSmallScreen ? 12 : 16,

    backgroundColor: '#FFF',

    shadowColor: '#000',

    shadowOffset: { width: 0, height: 2 },

    shadowOpacity: 0.05,

    shadowRadius: 8,

    elevation: 2,

    marginBottom: isSmallScreen ? 8 : 10,

    overflow: 'hidden',

  },

  imageWrapper: {

    width: '100%',

    height: isSmallScreen ? 100 : isMediumScreen ? 115 : 130,

    position: 'relative',

  },

  dishImage: {

    width: '100%',

    height: '100%',

    borderTopLeftRadius: isSmallScreen ? 16 : 20,

    borderTopRightRadius: isSmallScreen ? 16 : 20,

  },

  discountBadge: {

    position: 'absolute',

    top: isSmallScreen ? 10 : 15,

    left: isSmallScreen ? 6 : -4,

    backgroundColor: 'rgba(0,0,0,0.65)',

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: isSmallScreen ? 6 : 8,

    paddingVertical: isSmallScreen ? 3 : 4,

    borderRadius: isSmallScreen ? 5 : 6,

  },

  discountText: {

    color: '#FFF',

    fontSize: isSmallScreen ? 9 : 10,

    fontWeight: '700',

    marginLeft: 3,

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

    fontSize: isSmallScreen ? 9 : 10,

    fontWeight: '600',

  },

  content: {

    padding: isSmallScreen ? 10 : 12,

  },

  dishName: {

    fontSize: isSmallScreen ? 13 : 15,

    fontWeight: '600',

    marginBottom: 2,

  },

  price: {

    fontSize: isSmallScreen ? 11 : 12,

    marginBottom: isSmallScreen ? 6 : 8,

    color: '#777',

  },

  deliveryRow: {

    flexDirection: 'row',

    alignItems: 'center',

  },

  deliveryText: {

    fontSize: isSmallScreen ? 11 : 12,

    color: '#A0522D',

    marginLeft: 5,

    fontWeight: '500',

  },

});