import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';

export default function ExploreScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('Tous');
  const { colors, isDarkMode } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border.light }]}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Explorer</Text>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.push('/screens/search')}>
          <Ionicons name="search" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
          <Ionicons name="search" size={20} color={colors.text.tertiary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text.primary }]}
            placeholder="Rechercher des restaurants..."
            placeholderTextColor={colors.text.tertiary}
          />
          <TouchableOpacity style={styles.filterButton} onPress={() => router.push('/screens/filters')}>
            <Ionicons name="options" size={20} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity 
            style={[
              styles.filterChip, 
              selectedFilter === 'Tous' && styles.filterChipActive,
              selectedFilter === 'Tous' && { backgroundColor: colors.primary }
            ]} 
            onPress={() => setSelectedFilter('Tous')}
          >
            <Text style={[
              styles.filterChipText, 
              selectedFilter === 'Tous' && styles.filterChipTextActive,
              selectedFilter === 'Tous' && { color: '#FFFFFF' }
            ]}>Tous</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.filterChip, 
              selectedFilter === 'Pizza' && styles.filterChipActive,
              selectedFilter === 'Pizza' && { backgroundColor: colors.primary }
            ]} 
            onPress={() => setSelectedFilter('Pizza')}
          >
            <Text style={[
              styles.filterChipText, 
              selectedFilter === 'Pizza' && styles.filterChipTextActive,
              selectedFilter === 'Pizza' && { color: '#FFFFFF' }
            ]}>Pizza</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.filterChip, 
              selectedFilter === 'Fast-food' && styles.filterChipActive,
              selectedFilter === 'Fast-food' && { backgroundColor: colors.primary }
            ]} 
            onPress={() => setSelectedFilter('Fast-food')}
          >
            <Text style={[
              styles.filterChipText, 
              selectedFilter === 'Fast-food' && styles.filterChipTextActive,
              selectedFilter === 'Fast-food' && { color: '#FFFFFF' }
            ]}>Fast-food</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.filterChip, 
              selectedFilter === 'Dessert' && styles.filterChipActive,
              selectedFilter === 'Dessert' && { backgroundColor: colors.primary }
            ]} 
            onPress={() => setSelectedFilter('Dessert')}
          >
            <Text style={[
              styles.filterChipText, 
              selectedFilter === 'Dessert' && styles.filterChipTextActive,
              selectedFilter === 'Dessert' && { color: '#FFFFFF' }
            ]}>Dessert</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Restaurant List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.restaurantList}>
          {/* Restaurant Card 1 */}
          <TouchableOpacity style={[styles.restaurantCard, { backgroundColor: colors.surface }]} onPress={() => router.push('/restaurant')}>
            <View style={[styles.restaurantImagePlaceholder, { backgroundColor: colors.border.medium }]}>
              <Ionicons name="restaurant" size={40} color={colors.text.primary} />
            </View>
            <View style={styles.restaurantInfo}>
              <Text style={[styles.restaurantName, { color: colors.text.primary }]}>La Brioche Dorée</Text>
              <View style={styles.restaurantMeta}>
                <View style={styles.rating}>
                  <Ionicons name="star" size={14} color="#FFA500" />
                  <Text style={styles.ratingText}>4.7</Text>
                </View>
                <Text style={[styles.cuisineType, { color: colors.text.secondary }]}>Boulangerie</Text>
                <View style={styles.deliveryInfo}>
                  <Ionicons name="bicycle" size={14} color="#4CAF50" />
                  <Text style={[styles.deliveryText, { color: colors.text.secondary }]}>25-30 mins</Text>
                </View>
              </View>
              <Text style={[styles.priceRange, { color: colors.text.primary }]}>2500 - 8000 CFA</Text>
            </View>
            <TouchableOpacity style={styles.favoriteButton} onPress={() => {}}>
              <Ionicons name="heart-outline" size={20} color="#FFA500" />
            </TouchableOpacity>
          </TouchableOpacity>

          {/* Restaurant Card 2 */}
          <TouchableOpacity style={[styles.restaurantCard, { backgroundColor: colors.surface }]} onPress={() => router.push('/restaurant')}>
            <View style={[styles.restaurantImagePlaceholder, { backgroundColor: colors.border.medium }]}>
              <Ionicons name="fast-food" size={40} color={colors.text.primary} />
            </View>
            <View style={styles.restaurantInfo}>
              <Text style={[styles.restaurantName, { color: colors.text.primary }]}>Fast Food King</Text>
              <View style={styles.restaurantMeta}>
                <View style={styles.rating}>
                  <Ionicons name="star" size={14} color="#FFA500" />
                  <Text style={styles.ratingText}>4.6</Text>
                </View>
                <Text style={[styles.cuisineType, { color: colors.text.secondary }]}>Fast Food</Text>
                <View style={styles.deliveryInfo}>
                  <Ionicons name="bicycle" size={14} color="#4CAF50" />
                  <Text style={[styles.deliveryText, { color: colors.text.secondary }]}>20-25 mins</Text>
                </View>
              </View>
              <Text style={[styles.priceRange, { color: colors.text.primary }]}>1500 - 6000 CFA</Text>
            </View>
            <TouchableOpacity style={styles.favoriteButton} onPress={() => {}}>
              <Ionicons name="heart-outline" size={20} color="#FFA500" />
            </TouchableOpacity>
          </TouchableOpacity>

          {/* Restaurant Card 3 */}
          <TouchableOpacity style={[styles.restaurantCard, { backgroundColor: colors.surface }]} onPress={() => router.push('/restaurant')}>
            <View style={[styles.restaurantImagePlaceholder, { backgroundColor: colors.border.medium }]}>
              <Ionicons name="storefront" size={40} color={colors.text.primary} />
            </View>
            <View style={styles.restaurantInfo}>
              <Text style={[styles.restaurantName, { color: colors.text.primary }]}>Restaurant Malien</Text>
              <View style={styles.restaurantMeta}>
                <View style={styles.rating}>
                  <Ionicons name="star" size={14} color="#FFA500" />
                  <Text style={styles.ratingText}>4.3</Text>
                </View>
                <Text style={[styles.cuisineType, { color: colors.text.secondary }]}>Cuisine locale</Text>
                <View style={styles.deliveryInfo}>
                  <Ionicons name="bicycle" size={14} color="#4CAF50" />
                  <Text style={[styles.deliveryText, { color: colors.text.secondary }]}>30-35 mins</Text>
                </View>
              </View>
              <Text style={[styles.priceRange, { color: colors.text.primary }]}>2000 - 5000 CFA</Text>
            </View>
            <TouchableOpacity style={styles.favoriteButton} onPress={() => {}}>
              <Ionicons name="heart-outline" size={20} color="#FFA500" />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterButton: {
    padding: 8,
  },
  filtersContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  filterChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  filterChipActive: {
    backgroundColor: '#4CAF50',
  },
  filterChipText: {
    fontSize: 14,
    color: '#2C1810',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  restaurantList: {
    paddingHorizontal: 20,
  },
  restaurantCard: {
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  restaurantImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  restaurantInfo: {
    flex: 1,
    marginLeft: 15,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 5,
    color: '#FFA500',
  },
  cuisineType: {
    fontSize: 12,
    color: '#666',
    marginRight: 10,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryText: {
    fontSize: 12,
    marginLeft: 5,
    color: '#4CAF50',
  },
  priceRange: {
    fontSize: 16,
    fontWeight: '600',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
