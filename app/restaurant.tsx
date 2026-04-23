import DishPreviewModal from '@/components/DishPreviewModal';

import MenuModal from '@/components/MenuModal';

import PopularDishCard from '@/components/PopularDishCard';

import { useTheme } from '@/contexts/ThemeContext';

import { dataService, Dish, Restaurant } from '@/services/DataService';

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { LinearGradient } from 'expo-linear-gradient';

import { useLocalSearchParams, useRouter } from 'expo-router';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import {
  Animated,

  Dimensions,

  FlatList,

  Image,

  ScrollView,

  StatusBar,

  StyleSheet,

  Text,

  TouchableOpacity,

  View
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import Svg, { Path } from 'react-native-svg';



const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const isSmallScreen = SCREEN_WIDTH < 375;

const isMediumScreen = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;

const isLargeScreen = SCREEN_WIDTH >= 414;

const isTablet = SCREEN_WIDTH > 768;



// --- DATA ---

const HERO_IMAGES = [

  { id: '1', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800' }, // Pizza Royale

  { id: '2', url: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?w=800' }, // Burger Gourmet

  { id: '3', url: 'https://images.unsplash.com/photo-1550966842-28a1a2f4b45e?w=800' }, // Ambiance Table

  { id: '4', url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800' }, // Petit Déjeuner / Café

  { id: '5', url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800' }, // Dessert Fraises

  { id: '6', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800' }, // Grillades BBQ

  { id: '7', url: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?w=800' }, // Fast Food varié

  { id: '8', url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800' }, // Plat cuisiné healthy

  { id: '9', url: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800' }, // Donuts / Sucré

  { id: '10', url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800' }, // Salade fraîche

];



const FOOD_ITEMS = [

  // --- PIZZAS ---

  {

    id: '1',

    name: 'Pizza Margherita',

    price: '4500 CFA',

    desc: 'La classique : sauce tomate San Marzano, mozzarella di bufala et basilic frais.',

    cat: 'Pizza',

    img: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=500'

  },

  {

    id: '2',

    name: 'Pizza Pepperoni',

    price: '5500 CFA',

    desc: 'Double dose de pepperoni grillé sur un lit de fromage fondant.',

    cat: 'Pizza',

    img: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=500'

  },



  // --- LOCAL (AFRICAIN) ---

  {

    id: '3',

    name: 'Poulet Yassa',

    price: '4000 CFA',

    desc: 'Poulet mariné au citron et oignons caramélisés, servi avec son riz parfumé.',

    cat: 'Local',

    img: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80&w=500'

  },

  {

    id: '4',

    name: 'Thieboudienne Rouge',

    price: '4500 CFA',

    desc: 'Le plat national : riz rouge au poisson, légumes du marché et saveurs authentiques.',

    cat: 'Local',

    img: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?q=80&w=500'

  },

  {

    id: '5',

    name: 'Attiéké Poisson',

    price: '3500 CFA',

    desc: 'Semoule de manioc fondante accompagnée d\'un poisson braisé et piment frais.',

    cat: 'Local',

    img: 'https://images.unsplash.com/photo-1628106230204-ba367c30e764?q=80&w=500'

  },



  // --- GRILL ---

  {

    id: '6',

    name: 'Burger Gourmet XXL',

    price: '3500 CFA',

    desc: 'Double steak de bœuf, cheddar fondant, bacon croustillant et sauce maison.',

    cat: 'Grill',

    img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500'

  },

];



interface CartItem {

  id: string;

  name: string;

  price: string;

  desc: string;

  cat: string;

  img: string;

  quantity: number;

}



export default function RestaurantScreen() {

  const router = useRouter();

  const { colors, isDarkMode } = useTheme();

  const params = useLocalSearchParams();

  

  const [selectedCat, setSelectedCat] = useState('Tous');

  const [cartVisible, setCartVisible] = useState(false);

  const [activeSlide, setActiveSlide] = useState(0);

  const [menuVisible, setMenuVisible] = useState(false);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [showDishModal, setShowDishModal] = useState(false);

  const [selectedDish, setSelectedDish] = useState<any>(null);

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  const [dishes, setDishes] = useState<Dish[]>([]);

  const [categories, setCategories] = useState<string[]>([]);



  const menuAnim = useRef(new Animated.Value(30)).current;

  const flatListRef = useRef<FlatList>(null);



  // Charger les données du restaurant et des plats

  useEffect(() => {

    // Récupérer les données du restaurant depuis les params

    if (params.restaurantData) {

      try {

        const restaurantData = JSON.parse(params.restaurantData as string);

        setRestaurant(restaurantData);

      } catch (error) {

        console.error('Erreur parsing restaurant data:', error);

      }

    } else if (params.restaurantId) {

      // Alternative: récupérer depuis le service par ID

      const restaurantData = dataService.getRestaurantById(params.restaurantId as string);

      setRestaurant(restaurantData || null);

    }

  }, [params]);



  // Mémoriser les données du service pour éviter les re-renders infinis

  const dishesData = useMemo(() => dataService.getDishes(), []);

  const categoriesData = useMemo(() => dataService.getAllUniqueCategories(), []);



  // Charger les plats et catégories depuis le service

  useEffect(() => {

    setDishes(dishesData);

    setCategories(['Tous', ...categoriesData]);

  }, [dishesData, categoriesData]);



  // --- AUTO-PLAY CAROUSEL (5 secondes) ---

  useEffect(() => {

    const interval = setInterval(() => {

      let nextIndex = activeSlide + 1;

      if (nextIndex >= HERO_IMAGES.length) nextIndex = 0;



      flatListRef.current?.scrollToIndex({

        index: nextIndex,

        animated: true,

      });

      setActiveSlide(nextIndex);

    }, 5000);



    return () => clearInterval(interval);

  }, [activeSlide]);



  const handleAddToCart = (item: typeof FOOD_ITEMS[0]) => {

    // Ajouter l'article au panier

    setCartItems(prevItems => {

      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);

      if (existingItem) {

        return prevItems.map(cartItem =>

          cartItem.id === item.id

            ? { ...cartItem, quantity: cartItem.quantity + 1 }

            : cartItem

        );

      } else {

        return [...prevItems, { ...item, quantity: 1 }];

      }

    });



    setCartVisible(true);

    Animated.spring(menuAnim, { toValue: 110, useNativeDriver: false }).start();



  };



  const handleMenuToggle = () => {

    setMenuVisible(!menuVisible);

    Animated.spring(menuAnim, {

      toValue: menuVisible ? 30 : 110,

      useNativeDriver: false

    }).start();

  };



  const handleDishPress = (item: typeof FOOD_ITEMS[0]) => {

    const dish = {

      id: item.id,

      name: item.name,

      image: { uri: item.img },

      price: parseInt(item.price),

      description: item.desc

    };

    setSelectedDish(dish);

    setShowDishModal(true);

  };



  const filteredData = selectedCat === 'Tous'

    ? FOOD_ITEMS

    : FOOD_ITEMS.filter(item => item.cat === selectedCat);



  const handleBackPress = () => {

    router.back();

  };



  const handleSearchPress = () => {

    router.push('/screens/search');

  };



  const handleSharePress = () => {

    // Logique de partage - pour l'instant juste un console.log

    console.log('Partager le restaurant');

  };



  const handleFavoritePress = () => {

    // Logique de favoris - pour l'instant juste un console.log

    console.log('Ajouter aux favoris');

  };



  // Styles dynamiques qui dépendent du thème

  const dynamicStyles = {

    filterSection: { marginTop: 30, borderBottomWidth: 1, borderBottomColor: colors.border.light, paddingBottom: 5 },

    catActive: { color: colors.text.primary, fontWeight: 'bold' },

    catIndicator: { height: 3, width: '100%', backgroundColor: colors.primary, marginTop: 10, borderRadius: 2 },

    recommendCard: { 

      flexDirection: 'row' as const, 

      backgroundColor: colors.surface, 

      borderRadius: 30, 

      padding: 10, 

      marginBottom: 15, 

      elevation: 3, 

      shadowColor: colors.shadow.dark, 

      shadowOffset: { width: 0, height: 2 }, 

      shadowOpacity: 0.1, 

      shadowRadius: 10 

    },

    addButton: { 

      backgroundColor: colors.primary, 

      width: 40, 

      height: 40, 

      borderRadius: 20, 

      justifyContent: 'center' as const, 

      alignItems: 'center' as const 

    },

  };



  return (

    <View style={[styles.container, { backgroundColor: colors.background }]}>

      <StatusBar barStyle={isDarkMode ? 'light-content' : 'light-content'} />



      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>



        {/* --- HEADER CAROUSEL --- */}

        <View style={styles.heroSection}>

          <FlatList

            ref={flatListRef}

            data={HERO_IMAGES}

            horizontal

            pagingEnabled

            showsHorizontalScrollIndicator={false}

            onMomentumScrollEnd={(e) => {

              const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);

              setActiveSlide(index);

            }}

            keyExtractor={(item) => item.id}

            renderItem={({ item }) => (

              <Image source={{ uri: item.url }} style={styles.heroImg} />

            )}

          />



          <SafeAreaView style={styles.navIcons} edges={['top']}>

            <TouchableOpacity style={styles.blurBtn} onPress={handleBackPress}>

              <Ionicons name="arrow-back" size={24} color="white" />

            </TouchableOpacity>

            <View style={styles.navRight}>

              <TouchableOpacity style={styles.blurBtn} onPress={handleSearchPress}>

                <Ionicons name="search" size={20} color="white" />

              </TouchableOpacity>

              <TouchableOpacity style={styles.blurBtn} onPress={handleSharePress}>

                <Ionicons name="share-outline" size={20} color="white" />

              </TouchableOpacity>

              <TouchableOpacity style={styles.blurBtn} onPress={handleFavoritePress}>

                <Ionicons name="heart-outline" size={20} color="white" />

              </TouchableOpacity>

            </View>

          </SafeAreaView>



          {/* Pagination dots dynamiques (Design pilule comme sur l'image) */}

          <View style={styles.pagination}>

            {HERO_IMAGES.map((_, i) => (

              <View key={i} style={[styles.dot, i === activeSlide && styles.dotActive]} />

            ))}

          </View>



          {/* --- WAVE SVG --- */}

          <View style={styles.waveOverlay}>



            <Svg height="300" width={SCREEN_WIDTH} viewBox={`0 0 ${SCREEN_WIDTH} 120`} preserveAspectRatio="none">

              <Path

                d={`M0,120 L${SCREEN_WIDTH},120 L${SCREEN_WIDTH},60 C${SCREEN_WIDTH * 0.7},110 ${SCREEN_WIDTH * 0.2},0 0,60 Z`}

                fill="white"

              />

            </Svg>

          </View>



          {/* LOGO positionné avec précision */}

          <View style={styles.logoBadge}>

            <View style={styles.logoRow}>

              <Text style={styles.logoVert}>cafe</Text>

              <View><Text style={styles.logoMain}>NO</Text><Text style={[styles.logoMain, { marginTop: -18 }]}>IR</Text></View>

            </View>

          </View>

        </View>



        {/* --- CONTENU --- */}

        <View style={styles.mainContent}>

          <View style={styles.ratingBox}>

            <View style={styles.blackTag}>

              <Text style={styles.rText}>4.3</Text>

              <Ionicons name="star" size={10} color="gold" />

            </View>

            <Text style={styles.pourToi}>Pour toi</Text>

          </View>



          <Text style={[styles.title, { color: colors.text.primary }]}>

            {restaurant?.name || 'Restaurant'}

          </Text>



          <View style={[styles.pills, { marginLeft: -20 }]}>

            <View style={[styles.pill, { backgroundColor: 'white', borderColor: colors.border.light, justifyContent: 'flex-start' as const, alignItems: 'center' as const, paddingLeft: 8, marginLeft: 20, paddingRight: 1, width: isSmallScreen ? 160 : isMediumScreen ? 170 : isTablet ? 190 : 180, height: isSmallScreen ? 25 : isMediumScreen ? 28 : isTablet ? 32 : 30 }]}>

              <Ionicons name="location" size={isSmallScreen ? 10 : 11} color={colors.text.secondary} />

              <Text style={[styles.pText, { color: colors.text.secondary, textAlign: 'left', flex: 1 }]}>

                {restaurant?.address || 'Adresse non disponible'}

              </Text>

            </View>

            <View style={[styles.pill, { backgroundColor: 'white', borderColor: colors.border.light, justifyContent: 'flex-start' as const, alignItems: 'center' as const, paddingLeft: 10, marginLeft: 4, paddingRight: 10, width: isSmallScreen ? 120 : isMediumScreen ? 130 : isTablet ? 150 : 140, height: isSmallScreen ? 25 : isMediumScreen ? 28 : isTablet ? 32 : 30 }]}>

              <Ionicons name="bicycle" size={isSmallScreen ? 12 : 13} color={colors.text.secondary} />

              <Text style={[styles.pText, { color: colors.text.secondary, textAlign: 'left', flex: 1 }]}>

                {restaurant?.deliveryTime || '25-30 mins'} • {restaurant?.distance || '5 km'}

              </Text>

            </View>

          </View>



          {/* BANDEAU PROMO */}

          <View style={[styles.promo, { alignSelf: 'center' }]}>

            <LinearGradient

              colors={['#000000', '#823B20']}

              start={{ x: 0, y: 0 }}

              end={{ x: 1, y: 0.5 }}

              style={styles.promo}

            >

              <View style={styles.promoCircle}>

                <MaterialCommunityIcons name="brightness-percent" size={38} color="#5D2E17" />

              </View>

              <View>

                <Text style={styles.promoT}>-30% sur tout</Text>

                <Text style={styles.promoC}>Utilisez le code <Text style={{ fontWeight: '900' }}>FOOD20</Text></Text>

              </View>

            </LinearGradient>

          </View>



          <Text style={styles.secTitle}>Les Plus Populaires</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 15 }}>

            {FOOD_ITEMS.filter(item => item.cat === 'Pizza' || item.cat === 'Grill').slice(0, 4).map((item) => (

              <PopularDishCard

                key={item.id}

                item={{

                  id: item.id,

                  name: item.name,

                  image: item.img,

                  rating: 4.5,

                  priceRange: item.price,

                  discount: '70% OFF'

                }}

                onPress={() => handleDishPress(item)}

              />

            ))}

          </ScrollView>



          {/* LISTE RECOMMENDER (IMAGE 7EB814) */}

          <Text style={styles.secTitle}>Recommender</Text>

          <View style={styles.recommenderList}>

            {filteredData.map(item => (

              <TouchableOpacity key={item.id} style={[styles.recommendCard, dynamicStyles.recommendCard]} activeOpacity={0.9} onPress={() => handleDishPress(item)}>

                <Image source={{ uri: item.img }} style={styles.recommendImg} />

                <View style={styles.recommendInfo}>

                  <View style={styles.recommendHeader}>

                    <Text style={[styles.recommendName, { color: colors.text.primary }]} numberOfLines={1}>{item.name}</Text>

                    <TouchableOpacity onPress={() => console.log(`Ajouter ${item.name} aux favoris`)}>

                      <Ionicons name="heart-outline" size={20} color={colors.text.secondary} />

                    </TouchableOpacity>

                  </View>

                  <Text style={[styles.recommendDesc, { color: colors.text.tertiary }]} numberOfLines={2}>{item.desc}</Text>

                  <View style={styles.recommendFooter}>

                    <Text style={styles.recommendPrice}>{item.price}</Text>

                    <TouchableOpacity style={[styles.addButton, dynamicStyles.addButton]} onPress={() => handleAddToCart(item)}>

                      <Ionicons name="add" size={isSmallScreen ? 18 : 20} color="white" />

                    </TouchableOpacity>

                  </View>

                </View>

              </TouchableOpacity>

            ))}

          </View>

        </View>

        <View style={{ height: 150 }} />

      </ScrollView>



      {/* BOUTON MENUS DYNAMIQUE */}

      <Animated.View style={[styles.menuFloating, { bottom: menuAnim }]}>

        <TouchableOpacity style={styles.menuInner} onPress={handleMenuToggle}>

          <MaterialCommunityIcons name="silverware-fork-knife" size={18} color="white" />

          <Text style={styles.menuText}>Menus</Text>

        </TouchableOpacity>

      </Animated.View>



      {/* OVERLAY MENU COMPLET */}

      <MenuModal

        visible={menuVisible}

        onClose={handleMenuToggle}

        onAddToCart={handleAddToCart}

        selectedCategory={selectedCat}

        onCategoryChange={setSelectedCat}

      />



      {/* Modal de détail du plat */}

      <DishPreviewModal

        visible={showDishModal}

        dish={selectedDish}

        onClose={() => {

          setShowDishModal(false);

          setSelectedDish(null);

        }}

      />



      {/* PANIER (DANS LE BLOC NOIR EN BAS) */}

      {cartVisible && cartItems.length > 0 && (

        <View style={styles.cartBarContainer}>

          <TouchableOpacity style={styles.cartBarInner}>

            <View style={styles.cartLeft}>

              <Image source={{ uri: cartItems[0].img }} style={styles.cartThumb} />

              <View>

                <Text style={styles.cartStatus}>

                  {cartItems.length} article{cartItems.length > 1 ? 's' : ''} ajouté{cartItems.length > 1 ? 's' : ''}

                </Text>

              </View>

            </View>

            <View style={styles.cartRight}>

              <TouchableOpacity onPress={() => router.push('/cart')}>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 }}>

                  <Text style={[styles.cartLink, { marginLeft: 8 }]}>voir le panier</Text>

                  <Ionicons name="chevron-forward" size={16} color="#fff" />

                </View>

              </TouchableOpacity>

            </View>

          </TouchableOpacity>

        </View>

      )}

    </View>

  );

}



const styles = StyleSheet.create({

  container: { flex: 1, backgroundColor: 'white', paddingTop: -40 },

  heroSection: { 

    height: isSmallScreen ? 320 : isTablet ? 450 : 380 

  },

  heroImg: { 

    width: SCREEN_WIDTH, 

    height: isSmallScreen ? 320 : isTablet ? 450 : 380 

  },

  navIcons: { 

    position: 'absolute', 

    top: -20, 

    width: '100%', 

    flexDirection: 'row', 

    justifyContent: 'space-between', 

    paddingHorizontal: isSmallScreen ? 15 : isTablet ? 25 : 20, 

    zIndex: 10 

  },

  navRight: { flexDirection: 'row' as const, gap: 10 },

  blurBtn: { 

    width: isSmallScreen ? 35 : isTablet ? 50 : 40, 

    height: isSmallScreen ? 35 : isTablet ? 50 : 40, 

    borderRadius: isSmallScreen ? 17.5 : isTablet ? 25 : 20, 

    justifyContent: 'center' as const, 

    alignItems: 'center' as const 

  },

  pagination: { position: 'absolute', bottom: 105, alignSelf: 'center', flexDirection: 'row', gap: 6, zIndex: 10 },

  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.4)' },

  dotActive: { width: 25, backgroundColor: 'white' },



  // Wave précise qui remonte sur la droite

  waveOverlay: { position: 'absolute', bottom: -110, width: '100%' },



  // Logo Badge - Positionné exactement comme sur image_8cc7d7.png

  logoBadge: { position: 'absolute', bottom: 10, left: 25, width: 115, height: 115, borderRadius: 60, backgroundColor: '#1A1A1A', borderWidth: 4, borderColor: 'white', justifyContent: 'center' as const, alignItems: 'center' as const, elevation: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.3, shadowRadius: 6 },

  logoRow: { flexDirection: 'row' as const, alignItems: 'center' as const },

  logoVert: { color: 'white', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', transform: [{ rotate: '-90deg' }], marginRight: -6 },

  logoMain: { color: 'white', fontSize: 36, fontWeight: '900', letterSpacing: -2 },



  mainContent: { 

    paddingHorizontal: isSmallScreen ? 15 : isTablet ? 30 : 20, 

    marginTop: -10 

  },

  ratingBox: { alignItems: 'flex-end' as const, marginTop: 10 },

  blackTag: { backgroundColor: 'black', flexDirection: 'row' as const, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, alignItems: 'center' as const, gap: 4 },

  rText: { color: 'white', fontWeight: 'bold', fontSize: 13 },

  pourToi: { fontSize: 11, color: '#888', marginTop: 4 },

  title: { 

    fontSize: isSmallScreen ? 16 : isMediumScreen ? 20 : isTablet ? 26 : 22, 

    fontWeight: '900', 

    marginTop: -40 

  },

  pills: { 

    flexDirection: 'row' as const, 

    gap: isSmallScreen ? 9 : 13, 

    marginTop: 30

  },

  pill: { 

    flexDirection: 'row' as const, 

    alignItems: 'center' as const, 

    gap: 5, 

    padding: isSmallScreen ? 2 : isMediumScreen ? 3 : isTablet ? 5 : 4, 

    borderRadius: 25, 

    borderWidth: 1 

  },

  pText: {

    fontSize: isSmallScreen ? 6 : isMediumScreen ? 10 : isTablet ? 11 : 11,

    color: '#666'

  },

  promo: { 

    borderRadius: 25, 

    marginLeft: isSmallScreen ? -5 : isMediumScreen ? -8 : isTablet ? -10 : -9,

    marginRight: isSmallScreen ? 5 : isMediumScreen ? 3 : isTablet ? 2 : 4,

    marginTop: isSmallScreen ? 8 : isMediumScreen ? 10 : isTablet ? 12 : 10, 

    padding: isSmallScreen ? 12 : isMediumScreen ? 18 : isTablet ? 25 : 20, 

    width: isSmallScreen ? SCREEN_WIDTH - 40 : isMediumScreen ? SCREEN_WIDTH - 30 : isTablet ? SCREEN_WIDTH - 20 : SCREEN_WIDTH - 25, 

    flexDirection: 'row', 

    gap: isSmallScreen ? 10 : isMediumScreen ? 15 : isTablet ? 25 : 18 

  },

  promoCircle: { 

    width: isSmallScreen ? 40 : isMediumScreen ? 45 : isTablet ? 55 : 50, 

    height: isSmallScreen ? 40 : isMediumScreen ? 45 : isTablet ? 55 : 50, 

    justifyContent: 'center', 

    alignItems: 'center',

    position: 'relative'

  },

  promoT: { 

    color: 'white', 

    fontSize: isSmallScreen ? 10 : isMediumScreen ? 12 : isTablet ? 14 : 13, 

    fontWeight: 'bold' 

  },

  promoC: { 

    color: 'rgba(255,255,255,0.8)', 

    fontSize: isSmallScreen ? 7 : isMediumScreen ? 9 : isTablet ? 11 : 10 

  },



  secTitle: { 

    fontSize: isSmallScreen ? 12 : isMediumScreen ? 15 : isTablet ? 18 : 16, 

    fontWeight: 'bold' 

  },



  filterSection: { marginTop: 30, borderBottomWidth: 1, paddingBottom: 5 },

  catBtn: { alignItems: 'center', marginRight: 30, minWidth: 65 },

  catIcon: { width: 55, height: 55 },

  catName: { fontSize: 13, marginTop: 5 },

  catActive: { fontWeight: 'bold' },

  catIndicator: { height: 3, width: '100%', marginTop: 10, borderRadius: 2 },



  recommenderList: { marginTop: 20 },

  recommendCard: { 

    flexDirection: 'row' as const, 

    borderRadius: 30, 

    padding: isSmallScreen ? 8 : 10, 

    marginBottom: 15, 

    elevation: 3, 

    shadowOffset: { width: 0, height: 2 }, 

    shadowOpacity: 0.1, 

    shadowRadius: 10 

  },

  recommendImg: {

    width: isSmallScreen ? 110 : 130, 

    height: isSmallScreen ? 110 : 130,

    borderTopLeftRadius: 50, 

    borderTopRightRadius: 30,

    borderBottomLeftRadius: 40, 

    borderBottomRightRadius: 40

  },

  recommendInfo: { flex: 1, marginLeft: 15, justifyContent: 'space-between', paddingVertical: 5 },

  recommendHeader: { flexDirection: 'row' as const, justifyContent: 'space-between', alignItems: 'center' as const },

  recommendName: { 

    fontSize: isSmallScreen ? 10 : isMediumScreen ? 12 : isTablet ? 14 : 13, 

    fontWeight: 'bold', 

    flex: 1 

  },

  recommendDesc: { 

    fontSize: isSmallScreen ? 7 : isMediumScreen ? 8 : isTablet ? 10 : 9, 

    marginTop: 4, 

    width: '80%' 

  },

  recommendFooter: { flexDirection: 'row' as const, justifyContent: 'space-between', alignItems: 'center' as const, marginTop: 8 },

  recommendPrice: { 

    fontSize: isSmallScreen ? 9 : isMediumScreen ? 10 : isTablet ? 12 : 11, 

    fontWeight: 'bold' 

  },

  addButton: { 

    width: isSmallScreen ? 28 : 32, 

    height: isSmallScreen ? 28 : 32, 

    borderRadius: isSmallScreen ? 14 : 16, 

    justifyContent: 'center' as const, 

    alignItems: 'center' as const 

  },

  menuFloating: { position: 'absolute', alignSelf: 'center', zIndex: 10 },

  menuInner: { 

    backgroundColor: 'black', 

    flexDirection: 'row' as const, 

    paddingHorizontal: isSmallScreen ? 20 : 28, 

    paddingVertical: isSmallScreen ? 12 : 15, 

    borderRadius: 35, 

    gap: 10, 

    alignItems: 'center' as const, 

    elevation: 10 

  },

  menuText: { 

    color: 'white', 

    fontWeight: 'bold',

    fontSize: isSmallScreen ? 10 : 12 

  },



  // Style Panier avec le fond noir arrondi (Image 8cc7d7)

  cartBarContainer: { position: 'absolute', bottom: 0, width: '100%', height: 100, backgroundColor: 'black', borderTopLeftRadius: 40, borderTopRightRadius: 40, paddingHorizontal: 20, paddingTop: 15 },

  cartBarInner: { backgroundColor: '#5D2E17', height: 65, borderRadius: 40, flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'space-between', paddingHorizontal: 12 },

  cartLeft: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8 },

  cartThumb: { width: 45, height: 40, borderRadius: 23, borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)' },

  cartStatus: { color: 'white', fontSize: 11, fontWeight: '500', marginTop: 5 },

  cartLink: { color: '#fff', fontWeight: 'bold', fontSize: isSmallScreen ? 7 : 9 },

  cartRight: { flexDirection: 'row' as const, alignItems: 'flex-start' as const, gap: 5, paddingRight: 11 }

});