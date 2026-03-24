import CategoryCard from '@/components/CategoryCard';
import RestaurantCard from '@/components/SimpleRestaurantCard';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Category, dataService, Restaurant } from '@/services/DataService';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
    Dimensions, FlatList,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AllRestaurantsScreen() {
  const [screenData, setScreenData] = useState(Dimensions.get('window'));
  const { width: screenWidth, height: screenHeight } = screenData;
  const isSmallScreen = screenWidth < 375;
  const isMediumScreen = screenWidth >= 375 && screenWidth < 414;
  const isLargeScreen = screenWidth >= 414;
  const isTablet = screenWidth > 768;

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenData(window);
    });
    return () => subscription?.remove();
  }, []);
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('all');

  // Charger les données depuis le service
  useEffect(() => {
    const allRestaurants = dataService.getRestaurants();
    const allCategories = dataService.getCategories();
    setRestaurants(allRestaurants);
    setCategoryList(allCategories);
  }, []);

  // Filtrer les restaurants
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(restaurant => {
      const matchesCategory = selectedCategory === 'Tous' || restaurant.cuisine === selectedCategory;
      const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [restaurants, selectedCategory, searchQuery]);

  const handleCategoryPress = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  // Trier les restaurants
  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    switch (sortBy) {
      case 'all':
        return 0;
      case 'populaire':
        return b.rating - a.rating;
      case 'prix_croissant':
        const priceA = parseInt(a.deliveryFee?.replace(/[^0-9]/g, '') || '0');
        const priceB = parseInt(b.deliveryFee?.replace(/[^0-9]/g, '') || '0');
        return priceA - priceB;
      case 'prix_decroissant':
        const priceA2 = parseInt(a.deliveryFee?.replace(/[^0-9]/g, '') || '0');
        const priceB2 = parseInt(b.deliveryFee?.replace(/[^0-9]/g, '') || '0');
        return priceB2 - priceA2;
      case 'distance':
        const distA = parseFloat(a.distance?.replace(/[^0-9.]/g, '') || '0');
        const distB = parseFloat(b.distance?.replace(/[^0-9.]/g, '') || '0');
        return distA - distB;
      default:
        return 0;
    }
  });


  const handleRestaurantPress = (restaurant: Restaurant) => {
    router.push({
      pathname: '/restaurant',
      params: {
        restaurantId: restaurant.id
      }
    });
  };

  const handleBackPress = () => {
    router.back();
  };

  const handleSearch = () => {
    // Logique de recherche
  };

  const handleFilter = () => {
    router.push('/screens/filters');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Tous les Restaurants</Text>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search-outline" size={22} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={[
          styles.searchBar, 
          { 
            backgroundColor: '#FFFFFF', 
            borderColor: colors.border.light,
            paddingHorizontal: isSmallScreen ? 12 : 16,
            paddingVertical: isSmallScreen ? 8 : 10,
            gap: isSmallScreen ? 8 : 12,
            minHeight: isSmallScreen ? 44 : 48
          }
        ]}>
          <Ionicons name="search-outline" size={20} color="#666666" />
          <TextInput
            placeholder="Rechercher un restaurant..."
            style={[
              styles.searchInput, 
              { 
                color: '#000000',
                fontSize: isSmallScreen ? 16 : 18,
                fontWeight: '500',
                paddingVertical: 0,
                paddingHorizontal: 0
              }
            ]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#666666"
          />
        </View>
        <TouchableOpacity style={[
          styles.filterButton, 
          { 
            backgroundColor: '#FFFFFF',
            width: isSmallScreen ? 44 : 48,
            height: isSmallScreen ? 44 : 48,
            borderRadius: isSmallScreen ? 22 : 24,
            borderColor: colors.border.light
          }
        ]} onPress={handleFilter}>
          <Ionicons name="options-outline" size={22} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          {categoryList.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              isSelected={selectedCategory === category.name}
              onPress={handleCategoryPress}
              itemCount={filteredRestaurants.filter(restaurant => 
                restaurant.cuisine === category.name
              ).length}
            />
          ))}
        </ScrollView>
      </View>

      {/* Sort Options */}
      <View style={styles.sortSection}>
        <Text style={[styles.sortLabel, { color: colors.text.secondary }]}>Trier par:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            { key: 'all', label: 'Tous' },
            { key: 'populaire', label: 'Plus populaire' },
            { key: 'prix_croissant', label: 'Prix croissant' },
            { key: 'prix_decroissant', label: 'Prix décroissant' },
            { key: 'distance', label: 'Distance' }
          ].map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.sortChip,
                sortBy === option.key && styles.sortChipActive,
                sortBy === option.key && { backgroundColor: colors.primary }
              ]}
              onPress={() => setSortBy(option.key)}
            >
              <Text style={[
                styles.sortText,
                sortBy === option.key && styles.sortTextActive,
                { color: sortBy === option.key ? '#FFFFFF' : colors.text.primary }
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results Count */}
      <View style={styles.resultsSection}>
        <Text style={[styles.resultsText, { color: colors.text.secondary }]}>
          {sortedRestaurants.length} restaurants trouvés
        </Text>
      </View>

      {/* Restaurants List */}
      <FlatList
        data={sortedRestaurants}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.restaurantsList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RestaurantCard
            restaurant={{
              id: item.id,
              name: item.name,
              image: item.image,
              rating: item.rating || 4.5,
              deliveryTime: item.deliveryTime || '25-30 mins',
              distance: item.distance || '5 km',
              discount: item.discount
            }}
            onPress={() => handleRestaurantPress(item)}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
  },
  filterButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoriesContainer: {
    marginTop: 25,
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#E5E5E5',
  },
  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoryChipActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTextActive: {
    fontWeight: '600',
  },
  sortSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  sortLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  sortChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sortChipActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sortText: {
    fontSize: 13,
    fontWeight: '500',
  },
  sortTextActive: {
    fontWeight: '600',
  },
  resultsSection: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  resultsText: {
    fontSize: 14,
  },
  restaurantsList: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
});
