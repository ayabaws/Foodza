import { useFavorites } from '@/contexts/FavoritesContext';
import { dataService } from '@/services/DataService';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function FavoritesScreen() {
  const router = useRouter();
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

  const renderFavoriteItem = ({ item }: { item: any }) => {
    if (item.deliveryTime) {
      // C'est un Restaurant
      return (
        <TouchableOpacity 
          style={[styles.restaurantCard, { backgroundColor: '#FFFFFF' }]}
          onPress={() => router.push(`/restaurant?id=${item.id || item.restaurantId}`)}
        >
          <Image source={{ uri: item.image }} style={styles.restaurantImage} />
          <TouchableOpacity 
            style={[styles.favoriteButton, { backgroundColor: '#FFFFFF' }]}
            onPress={() => handleRemoveFavorite(item.id, item.name)}
          >
            <Ionicons name="heart" size={20} color="#870a0a" />
          </TouchableOpacity>
          
          <View style={styles.restaurantInfo}>
            <Text style={[styles.restaurantName, { color: '#333333' }]}>{item.name}</Text>
            <View style={styles.restaurantMeta}>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={14} color="#FFA500" />
                <Text style={[styles.ratingText, { color: '#666666' }]}>{item.rating}</Text>
              </View>
              <Text style={[styles.priceRange, { color: '#666666' }]}>{item.deliveryFee}</Text>
            </View>
            {item.cuisine && (
              <Text style={[styles.category, { color: '#888888' }]}>{item.cuisine}</Text>
            )}
            {item.address && (
              <Text style={[styles.address, { color: '#888888' }]}>{item.address}</Text>
            )}
          </View>
        </TouchableOpacity>
      );
    } else {
      // C'est un Dish
      return (
        <TouchableOpacity 
          style={[styles.restaurantCard, { backgroundColor: '#FFFFFF' }]}
          onPress={() => router.push(`/restaurant?id=${item.restaurantId || item.id}`)}
        >
          <Image source={{ uri: item.image }} style={styles.restaurantImage} />
          <TouchableOpacity 
            style={[styles.favoriteButton, { backgroundColor: '#FFFFFF' }]}
            onPress={() => handleRemoveFavorite(item.id, item.name)}
          >
            <Ionicons name="heart" size={20} color="#FF4444" />
          </TouchableOpacity>
          
          <View style={styles.restaurantInfo}>
            <Text style={[styles.restaurantName, { color: '#333333' }]}>{item.name}</Text>
            <View style={styles.restaurantMeta}>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={14} color="#FFA500" />
                <Text style={[styles.ratingText, { color: '#666666' }]}>{item.rating}</Text>
              </View>
              <Text style={[styles.priceRange, { color: '#666666' }]}>{item.priceRange}</Text>
            </View>
            {item.category && (
              <Text style={[styles.category, { color: '#888888' }]}>{item.category}</Text>
            )}
            {item.description && (
              <Text style={[styles.address, { color: '#888888' }]}>{item.description}</Text>
            )}
          </View>
        </TouchableOpacity>
      );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: '#E5E5E5' }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: '#333333' }]}>Mes Favoris</Text>
        <View style={styles.placeholder} />
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={80} color="#888888" />
          <Text style={[styles.emptyTitle, { color: '#333333' }]}>Aucun favori</Text>
          <Text style={[styles.emptyDescription, { color: '#666666' }]}>
            Ajoutez des restaurants à vos favoris pour les retrouver facilement
          </Text>
          <TouchableOpacity 
            style={[styles.exploreButton, { backgroundColor: '#BF5B30' }]}
            onPress={() => router.push('/home')}
          >
            <Text style={[styles.exploreButtonText, { color: '#FFFFFF' }]}>Explorer</Text>
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
                    selectedCategory === category && { backgroundColor: '#BF5B30' },
                    { backgroundColor: selectedCategory !== category ? '#F5F5F5' : '#BF5B30' }
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[
                    styles.categoryChipText,
                    { color: selectedCategory === category ? '#FFFFFF' : '#333333' }
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
            renderItem={renderFavoriteItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.noResultsContainer}>
                <Ionicons name="search-outline" size={50} color="#888888" />
                <Text style={[styles.noResultsText, { color: '#666666' }]}>
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
