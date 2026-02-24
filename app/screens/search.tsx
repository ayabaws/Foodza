import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([
    'Pizza',
    'Burger',
    'Thieboudienne',
    'Yassa',
    'Mafé'
  ]);

  const popularSearches = [
    'Restaurant africain',
    'Fast food',
    'Cuisine française',
    'Desserts',
    'Boissons'
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2C1810" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recherche</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="mic-outline" size={24} color="#2C1810" />
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un restaurant, plat..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search History */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recherches récentes</Text>
          <TouchableOpacity onPress={() => setSearchHistory([])}>
            <Text style={styles.clearButton}>Effacer</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {searchHistory.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.historyChip}
              onPress={() => setSearchQuery(item)}
            >
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.historyText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Popular Searches */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recherches populaires</Text>
        {popularSearches.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.popularItem}
            onPress={() => setSearchQuery(item)}
          >
            <Ionicons name="trending-up-outline" size={20} color="#8C3E22" />
            <Text style={styles.popularText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Catégories</Text>
        <View style={styles.categoryGrid}>
          <TouchableOpacity style={styles.categoryItem} onPress={() => router.push('/screens/explore')}>
            <View style={[styles.categoryIcon, { backgroundColor: '#FFE5E5' }]}>
              <Ionicons name="pizza-outline" size={24} color="#FF4444" />
            </View>
            <Text style={styles.categoryName}>Pizza</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryItem} onPress={() => router.push('/screens/explore')}>
            <View style={[styles.categoryIcon, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="fast-food-outline" size={24} color="#FF9800" />
            </View>
            <Text style={styles.categoryName}>Fast Food</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryItem} onPress={() => router.push('/screens/explore')}>
            <View style={[styles.categoryIcon, { backgroundColor: '#E8F5E8' }]}>
              <Ionicons name="restaurant-outline" size={24} color="#4CAF50" />
            </View>
            <Text style={styles.categoryName}>Local</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryItem} onPress={() => router.push('/screens/explore')}>
            <View style={[styles.categoryIcon, { backgroundColor: '#F3E5F5' }]}>
              <Ionicons name="ice-cream-outline" size={24} color="#9C27B0" />
            </View>
            <Text style={styles.categoryName}>Dessert</Text>
          </TouchableOpacity>
        </View>
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
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
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
    marginLeft: 10,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  clearButton: {
    fontSize: 14,
    color: '#8C3E22',
  },
  historyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  historyText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  popularItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  popularText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});
