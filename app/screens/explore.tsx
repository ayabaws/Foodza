import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, StatusBar, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import DishPreviewModal from '@/components/DishPreviewModal';
import DishCard from '@/components/DishCard';

interface Dish {
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
}

export default function ExploreScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('populaire');
  const [showDishModal, setShowDishModal] = useState(false);
  const [selectedDish, setSelectedDish] = useState<any>(null);

  // Base de données des plats
  const allDishes: Dish[] = [
    {
      id: '1',
      name: 'Poulet Yassa',
      image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80&w=800',
      price: '4500 CFA',
      description: 'Poulet mariné au citron, oignons caramélisés et riz parfumé',
      category: 'Local',
      rating: 4.9,
      priceRange: '2000 - 5000 FCFA',
      deliveryTime: '25-30 min',
      discount: '70% OFF'
    },
    {
      id: '2',
      name: 'Pizza Margherita',
      image: 'https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?q=80&w=800',
      price: '5000 CFA',
      description: 'Sauce tomate, mozzarella fraîche, basilic et huile d\'olive',
      category: 'Pizza',
      rating: 4.5,
      priceRange: '4000 - 7000 FCFA',
      deliveryTime: '20-25 min',
      discount: '30% OFF'
    },
    {
      id: '3',
      name: 'Burger Gourmet',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800',
      price: '3500 CFA',
      description: 'Bœuf grillé, cheddar affiné, oignons rouges et frites maison',
      category: 'Grill',
      rating: 4.7,
      priceRange: '2500 - 5000 FCFA',
      deliveryTime: '15-20 min'
    },
    {
      id: '4',
      name: 'Thieboudienne Rouge',
      image: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?q=80&w=800',
      price: '4500 CFA',
      description: 'Riz rouge sénégalais au poisson, carotte, manioc et chou',
      category: 'Local',
      rating: 4.8,
      priceRange: '3000 - 6000 FCFA',
      deliveryTime: '30-40 min',
      discount: '15% OFF'
    },
    {
      id: '5',
      name: 'Croissant Chocolat',
      image: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?q=80&w=800',
      price: '1200 CFA',
      description: 'Viennoiserie pur beurre, feuilletée et chocolat fondant',
      category: 'Viennoiserie',
      rating: 4.3,
      priceRange: '800 - 2000 FCFA',
      deliveryTime: '10-15 min'
    },
    {
      id: '6',
      name: 'Sushi Plateau',
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800',
      price: '8500 CFA',
      description: 'Assortiment de 12 sushis et makis saumon et thon',
      category: 'Japonais',
      rating: 4.6,
      priceRange: '5000 - 12000 FCFA',
      deliveryTime: '30-45 min'
    },
    {
      id: '7',
      name: 'Tacos Boeuf',
      image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=800',
      price: '3200 CFA',
      description: 'Tortilla de blé, émincé de boeuf, sauce fromagère et frites',
      category: 'Mexicain',
      rating: 4.4,
      priceRange: '2500 - 4500 FCFA',
      deliveryTime: '20-25 min'
    },
    {
      id: '8',
      name: 'Jus de Bissap',
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800',
      price: '1000 CFA',
      description: 'Infusion de fleurs d\'hibiscus à la menthe fraîche',
      category: 'Boisson',
      rating: 4.9,
      priceRange: '500 - 1500 FCFA',
      deliveryTime: '5-10 min'
    }
  ];

  // Extraire les catégories uniques
  const categories = useMemo(() => {
    const cats = ['Tous', ...new Set(allDishes.map(dish => dish.category))];
    return cats;
  }, []);

  // Fonction pour obtenir la couleur de catégorie
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Pizza': '#FF6B35',
      'Plats traditionnels': '#4CAF50',
      'Viennoiseries': '#FFA500',
      'Boulangerie': '#8D6E63',
      'Fast Food': '#F44336',
      'Salades': '#8BC34A',
      'Desserts': '#E91E63',
      'Plats asiatiques': '#FF9800',
      'Boissons': '#2196F3',
    };
    return colors[category] || '#757575';
  };

  // Filtrer et trier les plats
  const filteredAndSortedDishes = useMemo(() => {
    let filtered = allDishes.filter(dish => {
      const matchesCategory = selectedCategory === 'Tous' || dish.category === selectedCategory;
      const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'populaire':
          return b.rating - a.rating;
        case 'rating':
          return b.rating - a.rating;
        case 'prix':
          return parseInt(a.price) - parseInt(b.price);
        case 'temps':
          return parseInt(a.deliveryTime.split('-')[0]) - parseInt(b.deliveryTime.split('-')[0]);
        default:
          return 0;
      }
    });

    return filtered;
  }, [selectedCategory, searchQuery, sortBy]);

  // Styles dynamiques qui dépendent du thème
  const dynamicStyles = {
    categoryChip: {
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 10,
      backgroundColor: colors.surface,
      elevation: 1,
      shadowColor: colors.shadow.dark,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    sortChip: {
      paddingVertical: 6,
      borderRadius: 15,
      marginRight: 10,
      backgroundColor: colors.surface,
    },
    dishCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      marginBottom: 15,
      overflow: 'hidden' as const,
      shadowColor: colors.shadow.dark,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    discountBadge: {
      backgroundColor: '#FF4444',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      shadowColor: colors.shadow.dark,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    popularBadge: {
      backgroundColor: '#FF6B35',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      shadowColor: colors.shadow.dark,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    favoriteButton: {
      position: 'absolute' as const,
      top: 10,
      right: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      width: 35,
      height: 35,
      borderRadius: 17.5,
      shadowColor: colors.shadow.dark,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
  };

  const handleDishPress = (dish: Dish) => {
    setSelectedDish(dish);
    setShowDishModal(true);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border.light }]}>
          <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Explorer</Text>
          <TouchableOpacity style={styles.headerButton} onPress={() => router.push('/screens/favorites')}>
            <Ionicons name="heart" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
            <Ionicons name="search" size={20} color={colors.text.tertiary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text.primary }]}
              placeholder="Rechercher des plats..."
              placeholderTextColor={colors.text.tertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.filterButton} onPress={() => router.push('/screens/filters')}>
              <Ionicons name="options" size={20} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.categoryChip, dynamicStyles.categoryChip, selectedCategory === category && { backgroundColor: colors.primary }]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[styles.categoryChipText, { color: selectedCategory === category ? '#FFFFFF' : colors.text.primary }]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Sort Options */}
        <View style={styles.sortContainer}>
          <Text style={[styles.sortLabel, { color: colors.text.secondary }]}>Trier par:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['populaire', 'prix', 'note', 'livraison'].map((sort) => (
              <TouchableOpacity
                key={sort}
                style={[styles.sortChip, dynamicStyles.sortChip, sortBy === sort && { backgroundColor: colors.primary }]}
                onPress={() => setSortBy(sort)}
              >
                <Text style={[styles.sortChipText, { color: sortBy === sort ? '#FFFFFF' : colors.text.primary }]}>
                  {sort === 'populaire' ? 'Populaire' : sort === 'prix' ? 'Prix' : sort === 'note' ? 'Note' : 'Livraison'}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Results Count */}
        <View style={styles.resultsContainer}>
          <Text style={[styles.resultsText, { color: colors.text.secondary }]}>
            {filteredAndSortedDishes.length} plat{filteredAndSortedDishes.length > 1 ? 's' : ''} trouvé{filteredAndSortedDishes.length > 1 ? 's' : ''}
          </Text>
        </View>

        {/* Dishes List */}
        <View style={{ paddingHorizontal: 20, marginTop: 15 }}>
          {filteredAndSortedDishes.map((item) => (
            <DishCard
              key={item.id}
              item={item}
              onPress={() => handleDishPress(item)}
            />
          ))}
        </View>

        {filteredAndSortedDishes.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={60} color={colors.text.tertiary} />
            <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>Aucun plat trouvé</Text>
            <Text style={[styles.emptyDescription, { color: colors.text.secondary }]}>
              Essayez de modifier votre recherche ou vos filtres
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Modal de détail du plat */}
      <DishPreviewModal
        visible={showDishModal}
        dish={selectedDish}
        onClose={() => {
          setShowDishModal(false);
          setSelectedDish(null);
        }}
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
    paddingTop: 10
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
  categoriesContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  categoriesContent: {
    paddingRight: 20,
  },
  categoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  categoriesCount: {
    fontSize: 14,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#E0E0E0',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryChipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryChipText: {
    fontSize: 14,
    color: '#2C1810',
    fontWeight: '500',
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 4,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sortLabel: {
    fontSize: 14,
    marginRight: 10,
  },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 10,
    backgroundColor: '#E0E0E0',
  },
  sortChipText: {
    fontSize: 13,
    color: '#2C1810',
  },
  resultsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  resultsText: {
    fontSize: 14,
  },
  dishesList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  dishCard: {
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  dishImageContainer: {
    position: 'relative',
    height: 150,
  },
  dishImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  dishBadges: {
    position: 'absolute',
    top: 8,
    left: 8,
    gap: 6,
  },
  dishContent: {
    padding: 16,
  },
  dishHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  dishTitleContainer: {
    flex: 1,
  },
  dishName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  dishMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  categoryText: {
    fontSize: 12,
  },
  caloriesBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  caloriesText: {
    fontSize: 12,
    fontWeight: '600',
  },
  caloriesUnit: {
    fontSize: 10,
    marginLeft: 2,
  },
  dishDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    color: '#666',
  },
  dishFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flex: 1,
  },
  dishPrice: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  priceRange: {
    fontSize: 12,
  },
  deliveryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  deliveryTime: {
    fontSize: 12,
    fontWeight: '500',
  },
  discountBadge: {
    backgroundColor: '#FF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  popularBadge: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  popularText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 4,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyDescription: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});
