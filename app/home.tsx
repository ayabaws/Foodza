import CategoryCard from '@/components/CategoryCard';
import DishPreviewModal from '@/components/DishPreviewModal';
import LocationPermissionModal from '@/components/LocationPermissionModal';
import PopularDishCard from '@/components/PopularDishCard';
import RestaurantCard from '@/components/SimpleRestaurantCard';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useLocation } from '@/contexts/LocationContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Category, dataService, PopularItem, Restaurant } from '@/services/DataService';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { ClipPath, Defs, LinearGradient, Path, Stop, Image as SvgImage } from 'react-native-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 380;
const isMediumScreen = screenWidth >= 380 && screenWidth < 768;
const isLargeScreen = screenWidth >= 768 && screenWidth < 1024;
const isTablet = screenWidth >= 1024;

export default function HomeScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const { favorites } = useFavorites();
  const { currentLocation } = useLocation();

  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [activeTab, setActiveTab] = useState('Livraison');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showDishModal, setShowDishModal] = useState(false);
  const [selectedDish, setSelectedDish] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryScrollPosition, setCategoryScrollPosition] = useState(0);
  const categoryScrollViewRef = useRef<ScrollView>(null);

  // Charger les données depuis le service
  const [categories, setCategories] = useState<Category[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [popularItems, setPopularItems] = useState<PopularItem[]>([]);

  useEffect(() => {
    setCategories(dataService.getCategories());
    setRestaurants(dataService.getRestaurants());
    setPopularItems(dataService.getPopularItems());
  }, []);

  // Vérifier si la localisation est configurée
  useEffect(() => {
    if (!currentLocation) {
      setShowLocationModal(true);
    }
  }, [currentLocation]);

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

  // Filtrer les plats selon la catégorie sélectionnée
  const filteredPopularItems = selectedCategory === 'Tous'
    ? popularItems
    : popularItems.filter((item: PopularItem) => item.category === selectedCategory);

  useEffect(() => {
    if (!currentLocation) setShowLocationModal(true);
  }, [currentLocation]);

  // Handlers pour la navigation
  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push('/screens/search');
    }
  };

  const handleFilter = () => {
    router.push('/screens/filters');
  };

  const handleVoiceSearch = () => {
    // TODO: Implémenter la recherche vocale
    console.log('Recherche vocale activée');
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
    router.push({
      pathname: '/restaurant',
      params: {
        restaurantId: restaurant.id
      }
    });
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
    setShowLocationModal(false);
  };

  const handleLocationSkip = () => {
    setShowLocationModal(false);
  };

  const formatLocationDisplay = (location: any) => {
    if (!location) return 'Pas d\'adresse';
    
    // Si c'est une adresse avec plusieurs parties, afficher seulement la partie principale
    if (location.street && location.street.includes(',')) {
      return location.street.split(',')[0].trim();
    }
    
    return location.street || 'Pas d\'adresse';
  };

  const handleTabPress = (tab: string) => {
    if (tab === 'Livraison') {
      setActiveTab('Livraison');
      // On reste sur le home
    } else if (tab === 'Sur place') {
      setActiveTab('Sur place');
      // Navigation vers la page non disponible
      router.push('/screens/dine-in-not-available');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>

        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.locationLabel}>Localisation</Text>
            <TouchableOpacity style={styles.locationSelector} onPress={handleLocationPress}>
              <Ionicons name="location" size={18} color="#BF5B30" />
              <Text style={styles.locationValue}>
                {formatLocationDisplay(currentLocation)}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.profileCircle} onPress={handleProfile}>
              <Text style={styles.profileLetter}>F</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SEARCH */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#BF5B30" />
            <TextInput
              placeholder="Nom du restaurant, plat..."
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.voiceButton} onPress={handleVoiceSearch}>
              <Ionicons name="mic-outline" size={18} color="#BF5B30" />
            </TouchableOpacity>
          </View>

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
              Explorez  des cuisines authentiques et faites-vous livrer en toute simplicité.
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
          <TouchableOpacity style={styles.seeAllButton} onPress={() => router.push('/screens/all-restaurants')}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>Voir plus</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.restaurantsContainer}>
          {restaurants.slice(0, 1).map((restaurant) => (
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
            <MaterialCommunityIcons 
              name="moped" 
              size={isSmallScreen ? 20 : 22} 
              color={activeTab === 'Livraison' ? '#8C3E22' : '#FFF'} 
            />
            <Text style={[styles.navText, { color: activeTab === 'Livraison' ? '#8C3E22' : '#FFF' }]}>
              Livraison
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => handleTabPress('Sur place')}>
            <Ionicons 
              name="restaurant-outline" 
              size={isSmallScreen ? 18 : 20} 
              color={activeTab === 'Sur place' ? '#8C3E22' : '#FFF'} 
            />
            <Text style={[styles.navText, { color: activeTab === 'Sur place' ? '#8C3E22' : '#FFF' }]}>
              Sur place
            </Text>
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
      <LocationPermissionModal
        visible={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onLocationSet={() => setShowLocationModal(false)}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: isSmallScreen ? 16 : isMediumScreen ? 18 : isLargeScreen ? 20 : isTablet ? 32 : 20,
    marginTop: 8, // Espace pour la barre de statut
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

  profileLetter: { color: '#FFF', fontWeight: 'bold' },

  searchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginTop: 20,
    alignItems: 'center'
  },

  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 40,
    borderWidth: 1,
    borderColor:'#ccc',
    paddingHorizontal: 12,
    height: 40
  },

  searchInput: { 
    flex: 1, 
    marginLeft: 6,
    fontSize: isSmallScreen ? 10 : isMediumScreen ? 11 : isLargeScreen ? 12 : isTablet ? 14 : 12,
    color: '#333',
    paddingVertical: 0,
    paddingHorizontal: 0,
    height: 40,
    lineHeight: isSmallScreen ? 14 : isMediumScreen ? 15 : isLargeScreen ? 16 : isTablet ? 18 : 16
  },

  voiceButton: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },

  filterButton: {
    width: isSmallScreen ? 44 : 48,
    height: isSmallScreen ? 44 : 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor:'#ccc',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: isSmallScreen ? 8 : 10,
  },

  bannerContainer: {
    marginHorizontal: isSmallScreen ? 16 : isMediumScreen ? 18 : isLargeScreen ? 20 : isTablet ? 32 : 20,
    marginTop: isSmallScreen ? 8 : isMediumScreen ? 10 : isLargeScreen ? 12 : isTablet ? 15 : 10,
    height: isSmallScreen ? 200 : isMediumScreen ? 210 : isLargeScreen ? 220 : isTablet ? 250 : 220,
    borderRadius: 25,
    overflow: 'hidden',
  },

  bannerContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },

  bannerTitle: {
    color: '#FFF',
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: '600',
    width: '75%',
    top: isSmallScreen ? 12 : 13,
    lineHeight: isSmallScreen ? 22 : 24,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  bannerSub: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: isSmallScreen ? 9 : 10,
    marginTop: isSmallScreen ? 18 : 20,
    width: '80%',
    lineHeight: isSmallScreen ? 13 : 14,
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
    marginTop: 5,
    backgroundColor: '#BF5B30',
    paddingVertical: isSmallScreen ? 10 : 11,
    paddingHorizontal: isSmallScreen ? 20 : 24,
    borderRadius: 25,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  explorerBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: isSmallScreen ? 9 : 11,
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
    bottom: 0,
    width: '100%',
    alignItems: 'center',
  },

  bottomNav: {
    backgroundColor: '#000',
    width: '96%',
    height: 75,
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },

  navItem: { alignItems: 'center', flex: 1 },

  navText: { color: '#FFF', fontSize: isSmallScreen ? 8 : 10, marginTop: 4 },

  explorerFab: {
    backgroundColor: '#BF5B30',
    flexDirection: 'row',
    paddingHorizontal: isSmallScreen ? 16 : 20,
    paddingVertical: isSmallScreen ? 10 : 12,
    borderRadius: 30,
    alignItems: 'center',
  },

  fabText: { color: '#FFF', fontWeight: 'bold', marginLeft: isSmallScreen ? 6 : 8, fontSize: isSmallScreen ? 10 : 12 },

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
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },

  explorerCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});