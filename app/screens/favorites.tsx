import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Image, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { dataService, Restaurant } from '@/services/DataService';


export default function FavoritesScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const { favorites, removeFromFavorites, isFavorite } = useFavorites();
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [categories, setCategories] = useState<string[]>([]);

  // Charger les catégories depuis le service
  useEffect(() => {
    const uniqueCategories = dataService.getAllUniqueCategories();
    setCategories(['Tous', ...uniqueCategories]);
  }, []);

  const filteredFavorites = selectedCategory === 'Tous' 
    ? favorites 
    : favorites.filter(item => item.category === selectedCategory);

  const handleRemoveFavorite = (restaurantId: string, restaurantName: string) => {
    Alert.alert(
      'Retirer des favoris',
      `Êtes-vous sûr de vouloir retirer "${restaurantName}" de vos favoris ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Retirer', 
          style: 'destructive',
          onPress: () => removeFromFavorites(restaurantId)
        },
      ]
    );
  };

  const renderRestaurantItem = ({ item }: { item: Restaurant }) => (
    <TouchableOpacity 
      style={[styles.restaurantCard, { backgroundColor: colors.surface }]}
      onPress={() => router.push(`/restaurant?id=${item.id}`)}
    >
      <Image source={item.image} style={styles.restaurantImage} />
      <TouchableOpacity 
        style={[styles.favoriteButton, { backgroundColor: colors.background }]}
        onPress={() => handleRemoveFavorite(item.id, item.name)}
      >
        <Ionicons name="heart" size={20} color="#FF4444" />
      </TouchableOpacity>
      
      <View style={styles.restaurantInfo}>
        <Text style={[styles.restaurantName, { color: colors.text.primary }]}>{item.name}</Text>
        <View style={styles.restaurantMeta}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFA500" />
            <Text style={[styles.ratingText, { color: colors.text.secondary }]}>{item.rating}</Text>
          </View>
          <Text style={[styles.priceRange, { color: colors.text.secondary }]}>{item.priceRange}</Text>
        </View>
        {item.category && (
          <Text style={[styles.category, { color: colors.text.tertiary }]}>{item.category}</Text>
        )}
        {item.address && (
          <Text style={[styles.address, { color: colors.text.tertiary }]}>{item.address}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border.light }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Mes Favoris</Text>
        <View style={styles.placeholder} />
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={80} color={colors.text.tertiary} />
          <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>Aucun favori</Text>
          <Text style={[styles.emptyDescription, { color: colors.text.secondary }]}>
            Ajoutez des restaurants à vos favoris pour les retrouver facilement
          </Text>
          <TouchableOpacity 
            style={[styles.exploreButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/home')}
          >
            <Text style={[styles.exploreButtonText, { color: colors.text.inverse }]}>Explorer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Categories */}
          <View style={styles.categoriesContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    selectedCategory === category && { backgroundColor: colors.primary },
                    { backgroundColor: selectedCategory !== category ? colors.surface : colors.primary }
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[
                    styles.categoryChipText,
                    { color: selectedCategory === category ? colors.text.inverse : colors.text.primary }
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Favorites List */}
          <FlatList
            data={filteredFavorites}
            renderItem={renderRestaurantItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.noResultsContainer}>
                <Ionicons name="search-outline" size={50} color={colors.text.tertiary} />
                <Text style={[styles.noResultsText, { color: colors.text.secondary }]}>
                  Aucun restaurant trouvé dans cette catégorie
                </Text>
              </View>
            }
          />
        </>
      )}
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  exploreButton: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  restaurantCard: {
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  restaurantImage: {
    width: '100%',
    height: 150,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  restaurantInfo: {
    padding: 15,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 4,
  },
  priceRange: {
    fontSize: 14,
  },
  category: {
    fontSize: 12,
    marginBottom: 4,
  },
  address: {
    fontSize: 12,
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
});
