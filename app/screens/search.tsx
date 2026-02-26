import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';

export default function SearchScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Recherche</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="mic-outline" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
          <Ionicons name="search" size={20} color={colors.text.tertiary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text.primary }]}
            placeholder="Rechercher un restaurant, plat..."
            placeholderTextColor={colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.text.tertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search History */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Recherches récentes</Text>
          <TouchableOpacity onPress={() => setSearchHistory([])}>
            <Text style={[styles.clearButton, { color: colors.primary }]}>Effacer</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {searchHistory.map((item, index) => (
            <TouchableOpacity 
              key={item}
              style={[styles.historyChip, { backgroundColor: colors.surface }]}
              onPress={() => setSearchQuery(item)}
            >
              <Ionicons name="time-outline" size={16} color={colors.text.secondary} />
              <Text style={[styles.historyText, { color: colors.text.primary }]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Popular Searches */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Recherches populaires</Text>
        </View>
        <View style={styles.popularList}>
          {popularSearches.map((item, index) => (
            <TouchableOpacity 
              key={index}
              style={[styles.popularItem, { borderBottomColor: colors.border.light }]}
              onPress={() => setSearchQuery(item)}
            >
              <Ionicons name="trending-up-outline" size={20} color={colors.primary} />
              <Text style={[styles.popularText, { color: colors.text.primary }]}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Catégories</Text>
        </View>
        <View style={styles.categoryGrid}>
          <TouchableOpacity style={styles.categoryItem} onPress={() => router.push('/screens/explore')}>
            <View style={[styles.categoryIcon, { backgroundColor: colors.surface }]}>
              <Ionicons name="pizza-outline" size={24} color={colors.primary} />
            </View>
            <Text style={[styles.categoryName, { color: colors.text.primary }]}>Pizza</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryItem} onPress={() => router.push('/screens/explore')}>
            <View style={[styles.categoryIcon, { backgroundColor: colors.surface }]}>
              <Ionicons name="fast-food-outline" size={24} color={colors.primary} />
            </View>
            <Text style={[styles.categoryName, { color: colors.text.primary }]}>Fast Food</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryItem} onPress={() => router.push('/screens/explore')}>
            <View style={[styles.categoryIcon, { backgroundColor: colors.surface }]}>
              <Ionicons name="restaurant-outline" size={24} color={colors.primary} />
            </View>
            <Text style={[styles.categoryName, { color: colors.text.primary }]}>Local</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryItem} onPress={() => router.push('/screens/explore')}>
            <View style={[styles.categoryIcon, { backgroundColor: colors.surface }]}>
              <Ionicons name="ice-cream-outline" size={24} color={colors.primary} />
            </View>
            <Text style={[styles.categoryName, { color: colors.text.primary }]}>Dessert</Text>
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
  popularList: {
    flexDirection: 'column',
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
