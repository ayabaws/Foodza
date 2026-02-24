import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#2C1810" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Explorer</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="search" size={24} color="#2C1810" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher des restaurants..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options" size={20} color="#2C1810" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filterChip}>
            <Text style={styles.filterChipText}>Tous</Text>
          </View>
          <View style={[styles.filterChip, styles.filterChipActive]}>
            <Text style={[styles.filterChipText, styles.filterChipTextActive]}>Pizza</Text>
          </View>
          <View style={styles.filterChip}>
            <Text style={styles.filterChipText}>Fast-food</Text>
          </View>
          <View style={styles.filterChip}>
            <Text style={styles.filterChipText}>Dessert</Text>
          </View>
        </ScrollView>
      </View>

      {/* Restaurant List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.restaurantList}>
          {/* Restaurant Card 1 */}
          <TouchableOpacity style={styles.restaurantCard}>
            <View style={styles.restaurantImagePlaceholder}>
              <Ionicons name="restaurant" size={40} color="#FFFFFF" />
            </View>
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName}>La Brioche Dorée</Text>
              <View style={styles.restaurantMeta}>
                <View style={styles.rating}>
                  <Ionicons name="star" size={14} color="#FFA500" />
                  <Text style={styles.ratingText}>4.7</Text>
                </View>
                <Text style={styles.cuisineType}>Boulangerie</Text>
                <View style={styles.deliveryInfo}>
                  <Ionicons name="bicycle" size={14} color="#4CAF50" />
                  <Text style={styles.deliveryText}>25-30 mins</Text>
                </View>
              </View>
              <Text style={styles.priceRange}>2500 - 8000 CFA</Text>
            </View>
            <TouchableOpacity style={styles.favoriteButton}>
              <Ionicons name="heart-outline" size={20} color="#FFA500" />
            </TouchableOpacity>
          </TouchableOpacity>

          {/* Restaurant Card 2 */}
          <TouchableOpacity style={styles.restaurantCard}>
            <View style={styles.restaurantImagePlaceholder}>
              <Ionicons name="fast-food" size={40} color="#FFFFFF" />
            </View>
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName}>Fast Food King</Text>
              <View style={styles.restaurantMeta}>
                <View style={styles.rating}>
                  <Ionicons name="star" size={14} color="#FFA500" />
                  <Text style={styles.ratingText}>4.6</Text>
                </View>
                <Text style={styles.cuisineType}>Fast Food</Text>
                <View style={styles.deliveryInfo}>
                  <Ionicons name="bicycle" size={14} color="#4CAF50" />
                  <Text style={styles.deliveryText}>20-25 mins</Text>
                </View>
              </View>
              <Text style={styles.priceRange}>1500 - 6000 CFA</Text>
            </View>
            <TouchableOpacity style={styles.favoriteButton}>
              <Ionicons name="heart-outline" size={20} color="#FFA500" />
            </TouchableOpacity>
          </TouchableOpacity>

          {/* Restaurant Card 3 */}
          <TouchableOpacity style={styles.restaurantCard}>
            <View style={styles.restaurantImagePlaceholder}>
              <Ionicons name="storefront" size={40} color="#FFFFFF" />
            </View>
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName}>Restaurant Malien</Text>
              <View style={styles.restaurantMeta}>
                <View style={styles.rating}>
                  <Ionicons name="star" size={14} color="#FFA500" />
                  <Text style={styles.ratingText}>4.3</Text>
                </View>
                <Text style={styles.cuisineType}>Cuisine locale</Text>
                <View style={styles.deliveryInfo}>
                  <Ionicons name="bicycle" size={14} color="#4CAF50" />
                  <Text style={styles.deliveryText}>30-35 mins</Text>
                </View>
              </View>
              <Text style={styles.priceRange}>2000 - 5000 CFA</Text>
            </View>
            <TouchableOpacity style={styles.favoriteButton}>
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    padding: 8,
  },
  filtersContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  filterChip: {
    backgroundColor: '#F8F8F8',
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
    backgroundColor: '#FFFFFF',
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
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#2C1810',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 5,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  cuisineType: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 4,
  },
  priceRange: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
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
