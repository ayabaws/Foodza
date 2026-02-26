import Svg, { Path, Defs, LinearGradient, Stop, ClipPath, Image as SvgImage } from 'react-native-svg';
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Animated, FlatList, Alert, Dimensions, StatusBar, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import DishPreviewModal from '@/components/DishPreviewModal';
import PopularDishCard from '@/components/PopularDishCard';
import CategoryCard from '@/components/CategoryCard';
import RestaurantCard from '@/components/SimpleRestaurantCard';
import { BlurView } from 'expo-blur';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const isMediumScreen = screenWidth >= 375 && screenWidth < 414;
const isLargeScreen = screenWidth >= 414;

interface Category {
  id: string;
  name: string;
  image: any;
}

interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: string;
  cuisine: string;
  distance: string;
  address: string;
  discount?: string;
}

interface PopularItem {
  id: string;
  name: string;
  image: string;
  rating: number;
  priceRange: string;
  discount?: string;
  category?: string;
  description?: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const { favorites } = useFavorites();

  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [activeTab, setActiveTab] = useState('Livraison');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationAuthorized, setLocationAuthorized] = useState(false);
  const [showDishModal, setShowDishModal] = useState(false);
  const [selectedDish, setSelectedDish] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryScrollPosition, setCategoryScrollPosition] = useState(0);
  const categoryScrollViewRef = useRef<ScrollView>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);

  // Calculer la position de la ligne orange selon la catégorie et le scroll
  const getOrangeLinePosition = () => {
    const categoryIndex = categories.findIndex(cat => cat.name === selectedCategory);
    const itemWidth = 85; // Largeur de chaque catégorie
    const gap = 6; // Espacement entre catégories
    const padding = 30; // Padding gauche

    // Position de base de la catégorie
    const categoryPosition = padding + (categoryIndex * (itemWidth + gap));

    // Position relative au scroll
    const relativePosition = categoryPosition - categoryScrollPosition;

    return relativePosition;
  };

  // Handler pour le scroll
  const handleCategoryScroll = (event: any) => {
    setCategoryScrollPosition(event.nativeEvent.contentOffset.x);
  };

  // Faire défiler vers la catégorie sélectionnée
  const scrollToCategory = (categoryName: string) => {
    const categoryIndex = categories.findIndex(cat => cat.name === categoryName);
    if (categoryIndex !== -1 && categoryScrollViewRef.current) {
      const itemWidth = 85;
      const gap = 6;
      const padding = 30;
      const scrollToX = categoryIndex * (itemWidth + gap);

      categoryScrollViewRef.current.scrollTo({
        x: Math.max(0, scrollToX - 100), // Offset pour centrer
        animated: true
      });
    }
  };

  const categories: Category[] = [
    { id: '1', name: 'Tous', image: require('@/assets/home/all.png') },
    { id: '2', name: 'Pizza', image: require('@/assets/home/pizza.png') },
    { id: '3', name: 'Boisson', image: require('@/assets/home/jus.webp') },
    { id: '4', name: 'Local', image: require('@/assets/home/local.png') },
    { id: '5', name: 'Grill', image: require('@/assets/home/grill.png') },
  ];

  const restaurants: Restaurant[] = [
    {
      id: '1',
      name: 'Pizza Palace',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
      rating: 4.5,
      deliveryTime: '25-30 min',
      deliveryFee: '500 FCFA',
      cuisine: 'Pizza',
      distance: '1.2 km',
      address: 'Avenue Cheick Zayed, Bamako',
      discount: '20% OFF'
    },
    {
      id: '2',
      name: 'Le Grillard',
      image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400',
      rating: 4.3,
      deliveryTime: '30-35 min',
      deliveryFee: '700 FCFA',
      cuisine: 'Grill',
      distance: '2.1 km',
      address: 'Route de Koulikoro, Bamako'
    },
    {
      id: '3',
      name: 'Burger House',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
      rating: 4.2,
      deliveryTime: '20-25 min',
      deliveryFee: '400 FCFA',
      cuisine: 'Fast Food',
      distance: '0.8 km',
      address: 'Quartier du Fleuve, Bamako',
      discount: '15% OFF'
    },
    {
      id: '4',
      name: 'La Pâtisserie',
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400',
      rating: 4.7,
      deliveryTime: '15-20 min',
      deliveryFee: '300 FCFA',
      cuisine: 'Viennoiseries',
      distance: '0.5 km',
      address: 'ACI 2000, Bamako'
    },
    {
      id: '5',
      name: 'Restaurant Local',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
      rating: 4.4,
      deliveryTime: '35-40 min',
      deliveryFee: '800 FCFA',
      cuisine: 'Plats traditionnels',
      distance: '3.2 km',
      address: 'Lafiabougou, Bamako'
    }
  ];

  const popularItems: PopularItem[] = [
    {
      id: '1',
      name: 'Poulet Yassa',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
      rating: 4.3,
      priceRange: '2000 - 5000 FCFA',
      discount: '70% OFF',
      category: 'Plats traditionnels',
      description: 'Poulet mariné aux oignons et citron, servi avec riz'
    },
    {
      id: '2',
      name: 'Croissant',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
      rating: 4.3,
      priceRange: '2000 - 5000 FCFA',
      discount: '70% OFF',
      category: 'Viennoiseries',
      description: 'Croissant beurré croustillant et doré'
    },
    {
      id: '3',
      name: 'Baguette',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
      rating: 4.3,
      priceRange: '2000 - 5000 FCFA',
      discount: '70% OFF',
      category: 'Boulangerie',
      description: 'Baguette française fraîchement cuite'
    },
  ];


  // Filtrer les plats selon la catégorie sélectionnée
  const filteredPopularItems = selectedCategory === 'Tous'
    ? popularItems
    : popularItems.filter((item: PopularItem) => item.category === selectedCategory);

  useEffect(() => {
    if (!locationAuthorized) setShowLocationModal(true);
  }, [locationAuthorized]);

  // Handlers pour la navigation
  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push('/screens/search');
    }
  };

  const handleFilter = () => {
    router.push('/screens/filters');
  };

  const handleExplore = () => {
    router.push('/screens/explore');
  };

  const handleProfile = () => {
    router.push('/screens/profile');
  };

  const handleCategoryPress = (categoryName: string) => {
    setSelectedCategory(categoryName);
    scrollToCategory(categoryName);
    console.log('Catégorie sélectionnée:', categoryName);
  };

  const handleRestaurantPress = (restaurant: Restaurant) => {
    router.push('/restaurant');
  };

  const handlePopularItemPress = (item: PopularItem) => {
    // Convertir PopularItem en Dish pour le modal
    const dish = {
      id: item.id,
      name: item.name,
      image: item.image,
      price: parseInt(item.priceRange.split(' - ')[1].replace(' FCFA', '').replace(' CFA', '')),
      description: item.description || 'Plat délicieux préparé avec des ingrédients frais',
      category: item.category || 'Plat principal',
      rating: item.rating,
      priceRange: item.priceRange
    };
    setSelectedDish(dish);
    setShowDishModal(true);
  };

  const handleLocationPress = () => {
    setShowLocationModal(true);
  };

  const handleLocationAllow = () => {
    setLocationAuthorized(true);
    setShowLocationModal(false);
  };

  const handleLocationSkip = () => {
    setShowLocationModal(false);
  };

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'Sur place') {
      router.push('/screens/explore');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>

        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.locationLabel}>Localisation</Text>
            <TouchableOpacity style={styles.locationSelector} onPress={handleLocationPress}>
              <Ionicons name="location" size={18} color="#BF5B30" />
              <Text style={styles.locationValue}>Kalaban-coro</Text>
              <Ionicons name="chevron-down" size={16} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.cartButton} onPress={() => router.push('/cart')}>
              <Ionicons name="cart-outline" size={20} color="#FFFFFF" />
              {cartItems.length > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartItems.length}</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileCircle} onPress={handleProfile}>
              <Text style={styles.profileLetter}>F</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SEARCH */}
        <View style={styles.searchSection}>
          <TouchableOpacity style={styles.searchBar} onPress={handleSearch}>
            <Ionicons name="search-outline" size={22} color="#BF5B30" />
            <TextInput
              placeholder="Nom du restaurant, plat..."
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
            <Ionicons name="mic-outline" size={22} color="#BF5B30" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterButton} onPress={handleFilter}>
            <Ionicons name="options-outline" size={22} color="#000" />
          </TouchableOpacity>
        </View>

        {/* BANNER AMÉLIORÉ */}
        <View style={styles.bannerContainer}>
          <Svg height="240" width={screenWidth - 40} viewBox={`0 0 ${screenWidth - 40} 240`}>
            <Defs>
              <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0" stopColor="#170600" stopOpacity="0.8" />
                <Stop offset="0.5" stopColor="#401B0C" stopOpacity="0.6" />
                <Stop offset="1" stopColor="#823B20" stopOpacity="0.4" />
              </LinearGradient>

              <LinearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0" stopColor="#FFFFFF" stopOpacity="1" />
                <Stop offset="100%" stopColor="#F5F5F5" stopOpacity="0.9" />
              </LinearGradient>

              <ClipPath id="clip">
                <Path
                  d={`M0,20 
                     C0,20 50,0 120,20 
                     C190,40 ${screenWidth - 40},0 ${screenWidth - 40},30 
                     L${screenWidth - 40},240 
                     L0,240 
                     Z`}
                  fill="black"
                />
              </ClipPath>
            </Defs>

            <SvgImage
              href={require('@/assets/images/home_page1.png')}
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#clip)"
            />

            <Path
              d={`M0,20 
                  C0,20 50,0 120,20 
                  C190,40 ${screenWidth - 40},0 ${screenWidth - 40},30 
                  L${screenWidth - 40},240 
                  L0,240 
                  Z`}
              fill="url(#grad)"
              clipPath="url(#clip)"
            />
          </Svg>

          <View style={[StyleSheet.absoluteFill, styles.bannerContent]}>
            <Text style={styles.bannerTitle}>Commande En Toute Simplicité</Text>
            <Text style={styles.bannerSub}>
              Explorez des cuisines authentiques et faites-vous livrer en un clic
            </Text>
            <TouchableOpacity style={styles.explorerBtn} onPress={handleExplore}>
              <Ionicons name="compass-outline" size={18} color="#FFF" />
              <Text style={styles.explorerBtnText}>Explorer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CATEGORIES AMÉLIORÉES */}
        <View style={styles.categoriesContainer}>
          <ScrollView
            ref={categoryScrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesRow}
          >
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                isSelected={selectedCategory === category.name}
                onPress={handleCategoryPress}
                itemCount={
                  selectedCategory === category.name
                    ? filteredPopularItems.length
                    : filteredPopularItems.filter((item: PopularItem) => item.category === category.name).length
                }
              />
            ))}
          </ScrollView>
        </View>

        {/* POPULAR - DESIGN PREMIUM */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Les Plus Populaires</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.popularContainer}>
          {filteredPopularItems.map((item, index) => (
            <PopularDishCard
              key={item.id}
              item={item}
              onPress={handlePopularItemPress}
              isFeatured={index === 0}
              index={index}
            />
          ))}
        </ScrollView>

        {/* RESTAURANTS - DESIGN SIMPLE */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Top Restaurants</Text>
          </View>
          <TouchableOpacity style={styles.seeAllButton} onPress={() => router.push('/screens/explore')}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>Voir tout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.restaurantsContainer}>
          {restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onPress={handleRestaurantPress}
            />
          ))}
        </View>

        {/* SECTION EXPLORER */}
        <View style={styles.explorerSection}>
          <View style={styles.explorerHeader}>
            <View style={styles.explorerLine} />
            <Text style={[styles.explorerTitle, { color: colors.text.primary }]}>Explorer</Text>
            <View style={styles.explorerLine} />
          </View>

          <View style={styles.explorerCardsContainer}>
            <TouchableOpacity style={[styles.explorerCard, { backgroundColor: colors.surface }]}>
              <View style={styles.explorerCardIcon}>
                <Image source={require('@/assets/home/promo_icon.png')} style={styles.explorerCardImage} />
              </View>
              <Text style={[styles.explorerCardTitle, { color: colors.text.primary }]}>Offres</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.explorerCard, { backgroundColor: colors.surface }]}>
              <View style={styles.explorerCardIcon}>
                <Image source={require('@/assets/home/every_day_icon.png')} style={styles.explorerCardImage} />
              </View>
              <Text style={[styles.explorerCardTitle, { color: colors.text.primary }]}>Tous les jours</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>

      {/* BOTTOM NAV */}
      <View style={styles.bottomNavContainer}>
        <View style={styles.bottomNav}>

          <TouchableOpacity style={styles.navItem} onPress={() => handleTabPress('Livraison')}>
            <MaterialCommunityIcons name="moped" size={24} color="#FFF" />
            <Text style={styles.navText}>Livraison</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => handleTabPress('Sur place')}>
            <Ionicons name="restaurant-outline" size={22} color="#FFF" />
            <Text style={styles.navText}>Sur place</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.explorerFab} onPress={handleExplore}>
            <Ionicons name="compass-outline" size={20} color="#FFF" />
            <Text style={styles.fabText}>Explorer</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de détail du plat */}
      <DishPreviewModal
        visible={showDishModal}
        dish={selectedDish}
        onClose={() => {
          setShowDishModal(false);
          setSelectedDish(null);
        }}
      />

      {/* Modal de localisation */}
      <Modal transparent visible={showLocationModal} animationType="fade">
        <View style={StyleSheet.absoluteFillObject}>
          <BlurView intensity={20} style={StyleSheet.absoluteFillObject} />
          <View style={styles.modalContainer}>
            <Ionicons name="location" size={50} color="#BF5B30" />
            <Text style={styles.modalTitle}>Localisation</Text>
            <Text style={styles.modalDescription}>
              Autoriser les cartes à accéder à votre position ?
            </Text>

            <TouchableOpacity
              style={styles.btnPrimary}
              onPress={handleLocationAllow}
            >
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Autoriser</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLocationSkip}>
              <Text style={{ marginTop: 10, color: '#BF5B30' }}>
                Passer pour l'instant
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: isSmallScreen ? 16 : 20,
    marginTop: isSmallScreen ? 8 : 10,
    alignItems: 'center'
  },

  locationLabel: { fontSize: 12, color: '#888', left: 23 },

  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  locationValue: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 5,
  },

  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center'
  },

  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  favoritesButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#BF5B30',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },

  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#BF5B30',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },

  favoritesBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoritesBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },

  profileLetter: { color: '#FFF', fontWeight: 'bold' },

  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: isSmallScreen ? 16 : 20,
    marginTop: isSmallScreen ? 16 : 20,
    alignItems: 'center'
  },

  searchBar: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F3F3F3',
    borderRadius: 40,
    paddingHorizontal: 20,
    height: 55,
    alignItems: 'center',
  },

  searchInput: { flex: 1, marginLeft: 10 },

  filterButton: {
    width: isSmallScreen ? 50 : 55,
    height: isSmallScreen ? 50 : 55,
    borderRadius: 30,
    backgroundColor: '#F3F3F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: isSmallScreen ? 8 : 12,
  },

  bannerContainer: {
    marginHorizontal: isSmallScreen ? 16 : 20,
    marginTop: isSmallScreen ? 8 : 10,
    height: isSmallScreen ? 200 : 220,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },

  bannerContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },

  bannerTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '600',
    width: '75%',
    top: 15,
    lineHeight: 25,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  bannerSub: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    marginTop: 22,
    width: '80%',
    lineHeight: 15,
  },

  bannerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    backdropFilter: 'blur(10px)',
  },

  statItem: {
    alignItems: 'center',
    flex: 1,
  },

  statNumber: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  statLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },

  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 12,
  },

  explorerBtn: {
    marginTop: 15,
    backgroundColor: '#BF5B30',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 25,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },

  explorerBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

  categoriesContainer: {
    marginTop: 25,
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#E5E5E5',
  },

  categoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },

  categoriesTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  categoriesTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C1810',
  },

  categoriesBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },

  categoriesBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  categoriesSeeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  categoriesCount: {
    fontSize: 14,
    fontWeight: '500',
  },

  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
  },

  categoryItem: {
    alignItems: 'center',
    position: 'relative',
    marginRight: 8,
  },

  categoryItemActive: {
    transform: 'scale(1.05)',
  },

  categoryImageWrapper: {
    marginBottom: 8,
    position: 'relative',
  },

  categoryImageBg: {
    width: 70,
    height: 70,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },

  categoryImageActive: {
    shadowColor: '#BF5B30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },

  categoryImage: {
    width: 50,
    height: 50,
    borderRadius: 12,
  },

  categoryImageRound: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },

  categoryText: {
    textAlign: 'center',
    color: '#2C1810',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },

  categoryTextActive: {
    fontWeight: '700',
  },

  categoryWithIndicator: {
    alignItems: 'center',
    marginRight: 0,
  },

  categoryBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },

  categoryIndicatorDot: {
    width: 60,
    height: 3,
    backgroundColor: '#8C3E22',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 4,
    alignSelf: 'flex-start',
  },

  categorySeparatorLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#D9D9D9',
    marginTop: 8,
    alignSelf: 'stretch',
  },

  popularTitle: {
    color: 'black',
    fontSize: 20,
    fontFamily: 'Inter',
    fontWeight: '600',
    marginLeft: 20,
    marginTop: 30,
    marginBottom: 10,
  },

  popularContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 16,
    paddingLeft: 20,
    paddingRight: 20,
  },

  popularCard: {
    width: 200,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
  },

  popularCardContent: {
    width: '100%',
    height: 220,
    position: 'relative',
  },

  popularImage: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  ratingContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  ratingText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },

  discountBadge: {
    position: 'absolute',
    top: 12,
    right: 0,
    backgroundColor: '#FF4444',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },

  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },

  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  popularItemName: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 8,
    flexShrink: 1,
  },

  popularItemPrice: {
    fontSize: 13,
    fontWeight: '400',
    marginTop: 4,
  },

  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  mopedIconContainer: {
    width: 17,
    height: 16,
    position: 'relative',
    overflow: 'hidden',
    marginRight: 8,
  },

  mopedIconPart1: {
    width: 8.49,
    height: 8.65,
    position: 'absolute',
    left: 7.10,
    top: 1.99,
    backgroundColor: '#823B20',
  },

  mopedIconPart2: {
    width: 4.96,
    height: 4.67,
    position: 'absolute',
    left: 11.33,
    top: 8.65,
    backgroundColor: '#823B20',
  },

  mopedIconPart3: {
    width: 4.25,
    height: 1.33,
    position: 'absolute',
    left: 2.12,
    top: 4.65,
    backgroundColor: '#823B20',
  },

  mopedIconPart4: {
    width: 7.08,
    height: 6.67,
    position: 'absolute',
    left: 0.71,
    top: 6.65,
    backgroundColor: '#823B20',
  },

  deliveryTime: {
    color: '#823B20',
    fontSize: 10,
    fontFamily: 'Inter',
    fontWeight: '600',
  },

  bottomNavContainer: {
    position: 'absolute',
    bottom: 25,
    width: '100%',
    alignItems: 'center',
  },

  bottomNav: {
    backgroundColor: '#000',
    width: '92%',
    height: 75,
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },

  navItem: { alignItems: 'center', flex: 1 },

  navText: { color: '#FFF', fontSize: 11, marginTop: 4 },

  explorerFab: {
    backgroundColor: '#BF5B30',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
  },

  fabText: { color: '#FFF', fontWeight: 'bold', marginLeft: 8 },

  modalContainer: {
    position: 'absolute',
    top: '35%',
    alignSelf: 'center',
    width: screenWidth * 0.85,
    backgroundColor: '#FFF',
    borderRadius: 30,
    padding: 25,
    alignItems: 'center',
  },

  modalTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 10 },

  modalDescription: { textAlign: 'center', marginVertical: 15, color: '#666' },

  btnPrimary: {
    backgroundColor: '#000',
    width: '100%',
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Nouveaux styles pour les cartes améliorées
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
  },

  imageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },

  dishBadges: {
    position: 'absolute',
    top: 8,
    left: 8,
    gap: 6,
  },

  dishHeader: {
    marginBottom: 8,
  },

  dishTitleContainer: {
    flex: 1,
  },

  dishFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },

  priceContainer: {
    flex: 1,
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

  favoriteButtonPopular: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardContent: {
    padding: 12,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    minHeight: 80,
  },

  dishName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    flexShrink: 1,
  },

  dishCategory: {
    fontSize: 12,
    marginBottom: 8,
    flexShrink: 1,
  },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  dishPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    flexShrink: 0,
  },

  cardDeliveryTime: {
    fontSize: 12,
    marginLeft: 4,
  },

  // Styles pour la grille de tous les plats
  allDishesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },

  dishCard: {
    width: '48%',
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    minHeight: 240,
  },

  dishCardImage: {
    width: '100%',
    height: 130,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  dishCardContent: {
    padding: 12,
    flex: 1,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },

  dishCardName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
    flexShrink: 1,
  },

  dishCardCategory: {
    fontSize: 11,
    marginBottom: 8,
    flexShrink: 1,
  },

  dishCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },

  dishCardRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 165, 0, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },

  dishCardRatingText: {
    fontSize: 11,
    marginLeft: 2,
    fontWeight: '600',
  },

  dishCardPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    flexShrink: 0,
  },

  seeMoreButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 8,
  },

  seeMoreText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },

  // Styles pour les restaurants - design simple
  simpleRestaurantCard: {
    width: 280,
    marginRight: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  restaurantLogoContainer: {
    position: 'relative',
  },

  restaurantLogo: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },

  simpleDiscountBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },

  simpleDiscountText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '700',
  },

  simpleRestaurantInfo: {
    flex: 1,
  },

  simpleRestaurantName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },

  simpleRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },

  simpleRatingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },

  simpleCuisineText: {
    fontSize: 12,
  },

  simpleLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },

  simpleAddressText: {
    fontSize: 11,
    flex: 1,
  },

  simpleDeliveryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  simpleDeliveryTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(191, 91, 48, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },

  simpleTimeText: {
    fontSize: 11,
    fontWeight: '600',
  },

  simpleDistanceText: {
    fontSize: 11,
    fontWeight: '500',
  },

  // Styles pour les plats populaires - design premium
  popularCardFeatured: {
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 2,
    borderColor: '#FFD700',
  },

  popularImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  // Styles pour la section restaurants
  restaurantsContainer: {
    flexDirection: 'column',
    paddingHorizontal: 20,
    gap: 16,
  },

  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  sectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },

  sectionBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  featuredBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  featuredBadgeText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '700',
  },

  restaurantCardFeatured: {
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 2,
    borderColor: '#FFD700',
  },

  restaurantImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  restaurantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  restaurantStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },

  statusText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '600',
  },

  popularityBar: {
    marginTop: 8,
  },

  popularityLabel: {
    fontSize: 10,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },

  popularityTrack: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },

  popularityFill: {
    height: '100%',
    backgroundColor: '#BF5B30',
    borderRadius: 2,
  },

  restaurantCard: {
    width: 200,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 8,
  },

  restaurantImageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },

  restaurantImage: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  restaurantDiscountBadge: {
    position: 'absolute',
    top: 12,
    right: 0,
    backgroundColor: '#FF4444',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },

  restaurantRatingContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  restaurantRatingText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },

  restaurantCardContent: {
    padding: 12,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    minHeight: 100,
  },

  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    flexShrink: 1,
  },

  restaurantCuisine: {
    fontSize: 12,
    marginBottom: 8,
    flexShrink: 1,
  },

  restaurantInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  restaurantDeliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },

  restaurantDeliveryTime: {
    fontSize: 12,
    fontWeight: '600',
  },

  restaurantDeliveryFee: {
    fontSize: 11,
    fontWeight: '500',
  },

  restaurantDistance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  restaurantDistanceText: {
    fontSize: 11,
  },

  // Styles pour la section Explorer
  explorerSection: {
    marginTop: 30,
    marginBottom: 20,
    paddingHorizontal: 20,
  },

  explorerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  explorerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 10,
  },

  explorerTitle: {
    fontSize: 14,
    fontWeight: '400',
    paddingHorizontal: 10,
    color: '#cccccc7a',
  },

  explorerCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },

  explorerCard: {
    backgroundColor: '#fff',
    flex: 1,
    height: 180,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  explorerCardIcon: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  explorerCardImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },

  explorerCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});