import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface FilterOption {
  id: string;
  label: string;
  value: boolean;
}

interface PriceRange {
  id: string;
  label: string;
  min: number;
  max: number;
  selected: boolean;
}

export default function FiltersScreen() {
  const router = useRouter();
  
  const [filters, setFilters] = useState({
    freeDelivery: false,
    openNow: true,
    topRated: false,
    promotions: false,
  });

  const [priceRanges] = useState<PriceRange[]>([
    { id: '1', label: 'Moins de 2000 FCFA', min: 0, max: 2000, selected: false },
    { id: '2', label: '2000 - 5000 FCFA', min: 2000, max: 5000, selected: false },
    { id: '3', label: '5000 - 10000 FCFA', min: 5000, max: 10000, selected: false },
    { id: '4', label: 'Plus de 10000 FCFA', min: 10000, max: 999999, selected: false },
  ]);

  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);

  const [cuisines, setCuisines] = useState<FilterOption[]>([
    { id: '1', label: 'Africaine', value: false },
    { id: '2', label: 'Française', value: false },
    { id: '3', label: 'Italienne', value: false },
    { id: '4', label: 'Asiatique', value: false },
    { id: '5', label: 'Fast Food', value: false },
    { id: '6', label: 'Végétarien', value: false },
  ]);

  const [ratings, setRatings] = useState<FilterOption[]>([
    { id: '4', label: '4.0 & plus', value: false },
    { id: '3', label: '3.0 & plus', value: false },
    { id: '2', label: '2.0 & plus', value: false },
  ]);

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleCuisine = (id: string) => {
    setCuisines(prev => prev.map(cuisine => 
      cuisine.id === id ? { ...cuisine, value: !cuisine.value } : cuisine
    ));
  };

  const toggleRating = (id: string) => {
    setRatings(prev => prev.map(rating => 
      rating.id === id ? { ...rating, value: !rating.value } : rating
    ));
  };

  const selectPriceRange = (id: string) => {
    setSelectedPriceRange(id === selectedPriceRange ? null : id);
  };

  const applyFilters = () => {
    const activeFilters = {
      ...filters,
      priceRange: selectedPriceRange,
      cuisines: cuisines.filter(c => c.value).map(c => c.label),
      ratings: ratings.filter(r => r.value).map(r => r.label),
    };
    
    // Navigate back with filters
    router.back();
  };

  const resetFilters = () => {
    setFilters({
      freeDelivery: false,
      openNow: true,
      topRated: false,
      promotions: false,
    });
    setSelectedPriceRange(null);
    setCuisines(prev => prev.map(c => ({ ...c, value: false })));
    setRatings(prev => prev.map(r => ({ ...r, value: false })));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2C1810" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Filtres</Text>
        <TouchableOpacity style={styles.headerButton} onPress={resetFilters}>
          <Text style={styles.resetButton}>Réinitialiser</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Quick Filters */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Filtres rapides</Text>
          <View style={styles.filterGrid}>
            <TouchableOpacity 
              style={[styles.filterChip, filters.freeDelivery && styles.filterChipActive]}
              onPress={() => toggleFilter('freeDelivery')}
            >
              <Ionicons name="bicycle-outline" size={20} color={filters.freeDelivery ? '#FFF' : '#8C3E22'} />
              <Text style={[styles.filterChipText, filters.freeDelivery && styles.filterChipTextActive]}>
                Livraison gratuite
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterChip, filters.openNow && styles.filterChipActive]}
              onPress={() => toggleFilter('openNow')}
            >
              <Ionicons name="time-outline" size={20} color={filters.openNow ? '#FFF' : '#8C3E22'} />
              <Text style={[styles.filterChipText, filters.openNow && styles.filterChipTextActive]}>
                Ouvert maintenant
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterChip, filters.topRated && styles.filterChipActive]}
              onPress={() => toggleFilter('topRated')}
            >
              <Ionicons name="star-outline" size={20} color={filters.topRated ? '#FFF' : '#8C3E22'} />
              <Text style={[styles.filterChipText, filters.topRated && styles.filterChipTextActive]}>
                Top notés
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.filterChip, filters.promotions && styles.filterChipActive]}
              onPress={() => toggleFilter('promotions')}
            >
              <Ionicons name="pricetag-outline" size={20} color={filters.promotions ? '#FFF' : '#8C3E22'} />
              <Text style={[styles.filterChipText, filters.promotions && styles.filterChipTextActive]}>
                Promotions
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Price Range */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fourchette de prix</Text>
          {priceRanges.map((range) => (
            <TouchableOpacity 
              key={range.id}
              style={[styles.priceItem, selectedPriceRange === range.id && styles.priceItemSelected]}
              onPress={() => selectPriceRange(range.id)}
            >
              <View style={styles.radioButton}>
                {selectedPriceRange === range.id && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
              <Text style={[styles.priceText, selectedPriceRange === range.id && styles.priceTextSelected]}>
                {range.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Cuisines */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Types de cuisine</Text>
          <View style={styles.cuisineGrid}>
            {cuisines.map((cuisine) => (
              <TouchableOpacity 
                key={cuisine.id}
                style={[styles.cuisineChip, cuisine.value && styles.cuisineChipActive]}
                onPress={() => toggleCuisine(cuisine.id)}
              >
                <Text style={[styles.cuisineChipText, cuisine.value && styles.cuisineChipTextActive]}>
                  {cuisine.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Rating */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Note minimale</Text>
          {ratings.map((rating) => (
            <TouchableOpacity 
              key={rating.id}
              style={[styles.ratingItem, rating.value && styles.ratingItemSelected]}
              onPress={() => toggleRating(rating.id)}
            >
              <View style={styles.ratingStars}>
                {[...Array(4)].map((_, index) => (
                  <Ionicons 
                    key={index} 
                    name="star" 
                    size={16} 
                    color={index < parseInt(rating.id) ? '#FFA500' : '#E0E0E0'} 
                  />
                ))}
                <Ionicons name="star-half" size={16} color="#FFA500" />
              </View>
              <Text style={[styles.ratingText, rating.value && styles.ratingTextSelected]}>
                {rating.label}
              </Text>
              <View style={styles.radioButton}>
                {rating.value && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Apply Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
          <Text style={styles.applyButtonText}>Appliquer les filtres</Text>
        </TouchableOpacity>
      </View>
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
  resetButton: {
    fontSize: 14,
    color: '#8C3E22',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 15,
  },
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 10,
    width: '48%',
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: '#8C3E22',
  },
  filterChipText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#FFF',
  },
  priceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  priceItemSelected: {
    backgroundColor: '#FFF5F5',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#8C3E22',
  },
  priceText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  priceTextSelected: {
    color: '#8C3E22',
    fontWeight: '600',
  },
  cuisineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cuisineChip: {
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  cuisineChipActive: {
    backgroundColor: '#8C3E22',
  },
  cuisineChipText: {
    fontSize: 14,
    color: '#666',
  },
  cuisineChipTextActive: {
    color: '#FFF',
  },
  ratingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  ratingItemSelected: {
    backgroundColor: '#FFF5F5',
  },
  ratingStars: {
    flexDirection: 'row',
    marginRight: 15,
  },
  ratingText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  ratingTextSelected: {
    color: '#8C3E22',
    fontWeight: '600',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  applyButton: {
    backgroundColor: '#8C3E22',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
