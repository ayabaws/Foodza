import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Dimensions, 
  FlatList, 
  NativeSyntheticEvent, 
  NativeScrollEvent 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Données fictives pour le rendu
const HERO_IMAGES = [
  { id: '1', source: require('@/assets/food/food1.jpg') },
  { id: '2', source: require('@/assets/food/food2.jpeg') },
  { id: '3', source: require('@/assets/food/food3.jpeg') },
];

const POPULAR_ITEMS = [
  { 
    id: '1', 
    name: 'Poulet Yassa', 
    price: '2000- 5000 FCFA', 
    rating: '4.3', 
    discount: '70% OFF',
    image: require('@/assets/home/pizza.png') 
  },
  { 
    id: '2', 
    name: 'Croissant', 
    price: '2000- 5000 FCFA', 
    rating: '4.3', 
    discount: '70% OFF',
    image: require('@/assets/home/grill.png') 
  },
];

export default function RestaurantScreen() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        
        {/* --- SECTION HERO (CAROUSEL) --- */}
        <View style={styles.heroContainer}>
          <FlatList
            data={HERO_IMAGES}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
            renderItem={({ item }) => (
              <Image source={item.source} style={styles.heroImage} />
            )}
            keyExtractor={(item) => item.id}
          />

          {/* Header Buttons */}
          <SafeAreaView style={styles.headerNav} edges={['top']}>
            <TouchableOpacity style={styles.blurBtn}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.blurBtn}><Ionicons name="search" size={20} color="white" /></TouchableOpacity>
              <TouchableOpacity style={styles.blurBtn}><Ionicons name="share-outline" size={20} color="white" /></TouchableOpacity>
              <TouchableOpacity style={styles.blurBtn}><Ionicons name="heart-outline" size={20} color="white" /></TouchableOpacity>
            </View>
          </SafeAreaView>

          {/* LA WAVE (COURBE BLANCHE) */}
          <View style={styles.waveWrapper}>
            <Svg height="100" width={SCREEN_WIDTH} viewBox={`0 0 ${SCREEN_WIDTH} 100`}>
              <Path
                d={`M0 100 Q${SCREEN_WIDTH * 0.75} 100 ${SCREEN_WIDTH} 0 L${SCREEN_WIDTH} 100 Z`}
                fill="white"
              />
            </Svg>
          </View>

          {/* Pagination Dots */}
          <View style={styles.paginationRow}>
            {HERO_IMAGES.map((_, i) => (
              <View key={i} style={[styles.dot, i === activeIndex && styles.activeDot]} />
            ))}
          </View>
        </View>

        {/* --- SECTION CONTENU --- */}
        <View style={styles.contentSection}>
          
          {/* Logo Restaurant */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Image 
                source={require('@/assets/home/all.png')} 
                style={styles.logoImg} 
                resizeMode="contain" 
              />
            </View>
          </View>

          {/* Note & Pour toi */}
          <View style={styles.ratingBox}>
            <View style={styles.blackBadge}>
              <Text style={styles.ratingText}>4.3</Text>
              <Ionicons name="star" size={12} color="gold" />
            </View>
            <Text style={styles.subText}>Pour toi</Text>
          </View>

          <Text style={styles.mainTitle}>La Brioche Dorée</Text>

          {/* Info Pills */}
          <View style={styles.pillsRow}>
            <View style={styles.pill}>
              <Ionicons name="location" size={14} color="#555" />
              <Text style={styles.pillText}>Badalabougou, Bamako</Text>
            </View>
            <View style={styles.pill}>
              <MaterialCommunityIcons name="moped" size={16} color="#555" />
              <Text style={styles.pillText}>25 - 30 mins • 5 km</Text>
            </View>
          </View>

          {/* PROMO BOX */}
          <View style={styles.promoContainer}>
            <View style={styles.promoIconCircle}>
               <MaterialCommunityIcons name="brightness-percent" size={24} color="#5D2E17" />
            </View>
            <View>
              <Text style={styles.promoTitle}>-30% sur tout</Text>
              <Text style={styles.promoSubtitle}>Utilisez le code <Text style={{fontWeight: 'bold'}}>FOOD20</Text></Text>
            </View>
          </View>

          {/* Section Populaires */}
          <Text style={styles.sectionHeader}>Les Plus Populaires</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.popularScroll}>
            {POPULAR_ITEMS.map((item) => (
              <View key={item.id} style={styles.foodCard}>
                <View style={styles.imageWrapper}>
                  <Image source={item.image} style={styles.foodImage} />
                  <View style={styles.discountTag}>
                    <MaterialCommunityIcons name="brightness-percent" size={12} color="white" />
                    <Text style={styles.discountText}>{item.discount}</Text>
                  </View>
                  <TouchableOpacity style={styles.favBtn}>
                    <Ionicons name="heart-outline" size={20} color="white" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.cardInfo}>
                  <View style={styles.miniRating}>
                    <Text style={styles.miniRatingText}>{item.rating} ★</Text>
                  </View>
                  <Text style={styles.foodName}>{item.name}</Text>
                  <Text style={styles.foodPrice}>Prix: {item.price}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* BOUTON FLOTTANT MENUS */}
      <TouchableOpacity style={styles.menuFloatingBtn}>
        <MaterialCommunityIcons name="silverware-fork-knife" size={20} color="white" />
        <Text style={styles.menuBtnText}>Menus</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  
  // Hero
  heroContainer: { height: 360, width: '100%' },
  heroImage: { width: SCREEN_WIDTH, height: 360 },
  headerNav: {
    position: 'absolute', top: 0, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  blurBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center', alignItems: 'center',
  },
  headerRight: { flexDirection: 'row', gap: 10 },
  
  // Wave & Pagination
  waveWrapper: { position: 'absolute', bottom: -1, width: '100%' },
  paginationRow: {
    flexDirection: 'row', position: 'absolute',
    bottom: 50, alignSelf: 'center', gap: 6
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.4)' },
  activeDot: { width: 22, backgroundColor: 'white' },

  // Content
  contentSection: { paddingHorizontal: 20, paddingTop: 10 },
  logoContainer: { position: 'absolute', top: -55, left: 20, zIndex: 10 },
  logoCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#111', borderWidth: 4, borderColor: 'white',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8, elevation: 5,
  },
  logoImg: { width: 65, height: 65 },

  ratingBox: { alignItems: 'flex-end', marginTop: 10 },
  blackBadge: {
    backgroundColor: 'black', flexDirection: 'row',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, gap: 5, alignItems: 'center'
  },
  ratingText: { color: 'white', fontWeight: 'bold' },
  subText: { fontSize: 11, color: '#999', marginTop: 2 },

  mainTitle: { fontSize: 26, fontWeight: 'bold', color: '#1A1A1A', marginTop: 8 },
  
  pillsRow: { flexDirection: 'row', gap: 8, marginTop: 15 },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 25, borderWidth: 1, borderColor: '#F2F2F2'
  },
  pillText: { fontSize: 12, color: '#555' },

  // Promo Box
  promoContainer: {
    backgroundColor: '#5D2E17',
    borderRadius: 50,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
  },
  promoIconCircle: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center', marginRight: 15
  },
  promoTitle: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  promoSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },

  // Populaires
  sectionHeader: { fontSize: 20, fontWeight: 'bold', marginTop: 30 },
  popularScroll: { marginTop: 15, marginBottom: 100 },
  foodCard: { width: 240, marginRight: 15, borderRadius: 20, overflow: 'hidden', backgroundColor: 'white' },
  imageWrapper: { width: '100%', height: 150 },
  foodImage: { width: '100%', height: '100%', borderRadius: 20 },
  discountTag: {
    position: 'absolute', top: 10, left: 10,
    backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 6, flexDirection: 'row', alignItems: 'center', gap: 4
  },
  discountText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  favBtn: { position: 'absolute', top: 10, right: 10 },
  
  cardInfo: { paddingVertical: 10 },
  miniRating: {
    backgroundColor: 'black', width: 45, borderRadius: 5,
    paddingVertical: 2, alignItems: 'center', marginBottom: 6
  },
  miniRatingText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  foodName: { fontSize: 16, fontWeight: 'bold' },
  foodPrice: { fontSize: 12, color: '#777', marginTop: 2 },

  // Floating Btn
  menuFloatingBtn: {
    position: 'absolute', bottom: 30, alignSelf: 'center',
    backgroundColor: 'black', flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 25, paddingVertical: 15, borderRadius: 30, gap: 10,
    shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 10, elevation: 8
  },
  menuBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});