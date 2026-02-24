import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Image, TextInput, Modal, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

// --- TYPES ---
interface Category {
  id: string;
  name: string;
  image: any;
}

interface PopularItem {
  id: string;
  name: string;
  image: any;
  rating: number;
  priceRange: string;
  discount?: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [activeTab, setActiveTab] = useState('Livraison');

  // --- LOGIQUE MODALE ---
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationAuthorized, setLocationAuthorized] = useState(false);

  useEffect(() => {
    if (!locationAuthorized) setShowLocationModal(true);
  }, [locationAuthorized]);

  const categories: Category[] = [
    { id: '1', name: 'Tous', image: require('@/assets/home/all.png') },
    { id: '2', name: 'Pizza', image: require('@/assets/home/pizza.png') },
    { id: '3', name: 'Boission', image: require('@/assets/home/jus.webp') },
    { id: '4', name: 'Local', image: require('@/assets/home/local.png') },
    { id: '5', name: 'Grill', image: require('@/assets/home/grill.png') },
  ];

  const popularItems: PopularItem[] = [
    { id: '1', name: 'Poulet Yassa', image: require('@/assets/food/food2.jpeg'), rating: 4.3, priceRange: '2000 - 5000 FCFA', discount: '70% OFF' },
    { id: '2', name: 'Croissant', image: require('@/assets/food/food3.jpeg'), rating: 4.3, priceRange: '2000 - 5000 FCFA', discount: '70% OFF' },
    { id: '3', name: 'Baguette', image: require('@/assets/food/food4.jpeg'), rating: 4.3, priceRange: '2000 - 5000 FCFA', discount: '70% OFF' },
    { id: '4', name: 'Pain au chocolat', image: require('@/assets/food/food5.jpg'), rating: 4.3, priceRange: '2000 - 5000 FCFA', discount: '70% OFF' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.locationLabel, { color: colors.text.secondary }]}>Localisation</Text>
            <TouchableOpacity style={[styles.locationSelector, { backgroundColor: colors.surface }]} onPress={() => setShowLocationModal(true)}>
              <Ionicons name="location" size={20} color={colors.primary} />
              <Text style={[styles.locationValue, { color: colors.text.primary }]}>Kalaban-coro</Text>
              <Ionicons name="chevron-down" size={18} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={[styles.profileCircle, { backgroundColor: colors.primary }]} onPress={() => router.push('/screens/profile')}>
            <Text style={styles.profileLetter}>F</Text>
          </TouchableOpacity>
        </View>

        {/* RECHERCHE */}
        <View style={styles.searchSection}>
          <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border.light }]}>
            <Ionicons name="search-outline" size={22} color={colors.primary} />
            <TextInput
              placeholder="Nom du restaurant, plat..."
              placeholderTextColor={colors.text.tertiary}
              style={[styles.searchInput, { color: colors.text.primary }]}
            />
            <Ionicons name="mic-outline" size={22} color={colors.primary} />
          </View>
          <TouchableOpacity 
            style={[styles.filterButton, { backgroundColor: colors.surface, borderColor: colors.border.light }]}
            onPress={() => router.push('/screens/filters')}
          >
            <Ionicons name="options-outline" size={24} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* --- BANNER MISE À JOUR --- */}
        <View style={styles.bannerContainer}>
          <View style={[styles.bannerShape, { backgroundColor: colors.primary }]}>
            <View style={styles.bannerTextContainer}>
              <Text style={[styles.bannerTitle, { color: '#FFFFFF' }]}>Commande En Toute Simplicité</Text>
              <Text style={[styles.bannerSub, { color: '#FFFFFF' }]}>
                Explorez des cuisines authentiques et faites-vous livrer en toute simplicité.
              </Text>
              <TouchableOpacity style={[styles.explorerBtn, { backgroundColor: '#FFFFFF' }]} onPress={() => router.push('/screens/explore')}>
                <Text style={[styles.explorerBtnText, { color: colors.primary }]}>Explorer</Text>
              </TouchableOpacity>
            </View>
            <Image
              source={require('@/assets/images/home_page1.png')}
              style={styles.bannerImageOverlay}
              resizeMode="cover"
            />
          </View>
        </View>

        {/* CATÉGORIES */}
        <View style={styles.catScroll}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.catItem,
                  selectedCategory === category.name && styles.catItemActive
                ]}
                onPress={() => setSelectedCategory(category.name)}
              >
                <View style={styles.catImg}>
                  <Image source={category.image} style={styles.catImg} />
                </View>
                <Text style={[
                  styles.catName,
                  selectedCategory === category.name && styles.catNameActive
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* LES PLUS POPULAIRES */}
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Les Plus Populaires</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.popularScroll} contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}>
          {popularItems.map((item) => (
            <View key={item.id} style={styles.foodCardHorizontal}>
              <TouchableOpacity onPress={() => router.push('/restaurant')} style={styles.imageWrapper}>
                <Image source={item.image} style={styles.foodImg} />
                {item.discount && (
                  <View style={styles.promoBadge}>
                    <Ionicons name="settings-outline" size={12} color="#FFF" />
                    <Text style={styles.promoText}> {item.discount}</Text>
                  </View>
                )}
                <View style={styles.ratingBadge}>
                  <Text style={styles.ratingText}>{item.rating} ★</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/restaurant')}>
                <Text style={[styles.foodName, { color: colors.text.primary }]}>{item.name}</Text>
                <Text style={[styles.foodPrice, { color: colors.text.secondary }]}>Prix: {item.priceRange}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

      </ScrollView>

      {/* BARRE DE NAVIGATION FLOTTANTE */}
      <View style={styles.bottomNavContainer}>
        <View style={[styles.bottomNav, { backgroundColor: colors.background }]}>
          <TouchableOpacity style={styles.navItem} onPress={() => { setActiveTab('Livraison'); router.push('/screens/order-track'); }}>
            <MaterialCommunityIcons name="moped" size={26} color={activeTab === 'Livraison' ? '#BF5B30' : colors.text.primary} />
            <Text style={[styles.navText, { color: activeTab === 'Livraison' ? '#BF5B30' : colors.text.primary }]}>Livraison</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => setActiveTab('Sur place')}>
            <Ionicons name="restaurant-outline" size={24} color={activeTab === 'Sur place' ? '#BF5B30' : colors.text.primary} />
            <Text style={[styles.navText, { color: activeTab === 'Sur place' ? '#BF5B30' : colors.text.primary }]}>Sur place</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.explorerFab, { backgroundColor: colors.primary }]} onPress={() => router.push('/screens/explore')}>
            <Ionicons name="compass-outline" size={22} color="#FFF" />
            <Text style={styles.fabText}>Explorer</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* MODALE LOCALISATION */}
      <Modal transparent visible={showLocationModal} animationType="fade">
        <View style={StyleSheet.absoluteFillObject}>
          <BlurView intensity={20} style={StyleSheet.absoluteFillObject} />
          <View style={styles.darkOverlay} />
          <View style={styles.modalContainer}>
            <View style={styles.iconWrapper}>
              <View style={styles.blobBackground} />
              <Ionicons name="location" size={60} color="#8C3E22" />
            </View>
            <Text style={styles.modalTitle}>Localisation</Text>
            <Text style={styles.modalDescription}>Autoriser les cartes à accéder à votre position ?</Text>
            <TouchableOpacity style={styles.btnPrimary} onPress={() => { setLocationAuthorized(true); setShowLocationModal(false); }}>
              <Text style={styles.btnPrimaryText}>Autoriser</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSecondary} onPress={() => setShowLocationModal(false)}>
              <Text style={styles.btnSecondaryText}>Passer pour l'instant</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { paddingBottom: 130 },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center', marginTop: 10 },
  locationLabel: { fontSize: 13, color: '#666' },
  locationSelector: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F8F8', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  locationValue: { fontSize: 19, fontWeight: 'bold', marginHorizontal: 5 },
  profileCircle: { width: 45, height: 45, borderRadius: 23, backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center' },
  profileLetter: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },

  // Search
  searchSection: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 20, alignItems: 'center' },
  searchBar: { flex: 1, flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 30, paddingHorizontal: 15, height: 55, alignItems: 'center', borderWidth: 1, borderColor: '#EEE' },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15 },
  filterButton: { width: 55, height: 55, borderRadius: 28, borderWidth: 1, borderColor: '#EEE', justifyContent: 'center', alignItems: 'center', marginLeft: 12 },

  // Banner
  bannerContainer: { marginHorizontal: 10, marginTop: 15, height: 200 },
  bannerShape: { flex: 1, backgroundColor: '#8C3E22', borderRadius: 110, borderTopLeftRadius: 30, borderBottomRightRadius: 30, flexDirection: 'row', overflow: 'hidden', position: 'relative' },
  bannerTextContainer: { flex: 1.1, paddingLeft: 25, paddingVertical: 20, justifyContent: 'center', zIndex: 10 },
  bannerTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold', lineHeight: 28, width: '70%' },
  bannerSub: { color: '#fff', fontSize: 10, marginTop: 8, lineHeight: 18, width: '70%' },
  explorerBtn: { backgroundColor: '#8C3E22', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 20, marginTop: 15, marginLeft:30, alignSelf: 'flex-start', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 3 },
  explorerBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  bannerImageOverlay: { position: 'absolute', width: '100%', height: '100%', zIndex: 1 },

  // Categories
  catScroll: { marginTop: 15, paddingLeft: 20 },
  catItem: { alignItems: 'center', marginRight: 25, width: 70 },
  catItemActive: { paddingVertical: 5, borderBottomWidth: 5, borderBottomColor: '#8C3E22', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 },
  catImg: { width: 65, height: 65, borderRadius: 32 },
  catName: { marginTop: 8, fontSize: 14, color: '#666' },
  catNameActive: { color: '#000', fontWeight: 'bold' },
  activeUnderline: { height: 3, backgroundColor: '#8C3E22', width: '60%', marginTop: 4, borderRadius: 2 },

  // Popular
  sectionTitle: { fontSize: 22, fontWeight: 'bold', marginLeft: 20, marginTop: 30 },
  popularScroll: { marginTop: 15 },
  foodCardHorizontal: { width: 150, marginRight: 15 },
  imageWrapper: { position: 'relative' },
  foodImg: { width: '100%', height: 130, borderRadius: 20 },
  promoBadge: { position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(0,0,0,0.6)', flexDirection: 'row', padding: 5, borderRadius: 8, alignItems: 'center' },
  promoText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  ratingBadge: { position: 'absolute', bottom: 10, left: 10, backgroundColor: '#000', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  ratingText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' },
  foodName: { fontWeight: 'bold', marginTop: 10, fontSize: 16 },
  foodPrice: { color: '#777', fontSize: 12, marginTop: 4 },

  // Bottom Nav
  bottomNavContainer: { position: 'absolute', bottom: 25, width: '100%', alignItems: 'center' },
  bottomNav: { backgroundColor: '#000', width: '92%', height: 75, borderRadius: 40, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, justifyContent: 'space-between' },
  navItem: { alignItems: 'center', flex: 1 },
  navText: { fontSize: 11, marginTop: 4, fontWeight: '500' },
  explorerFab: { backgroundColor: '#BF5B30', flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 30, alignItems: 'center' },
  fabText: { color: '#FFF', fontWeight: 'bold', marginLeft: 8 },

  // Modal styles
  darkOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContainer: { position: 'absolute', top: '30%', alignSelf: 'center', width: width * 0.85, backgroundColor: '#FFF', borderRadius: 35, padding: 25, alignItems: 'center' },
  iconWrapper: { width: 100, height: 100, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  blobBackground: { position: 'absolute', width: 80, height: 80, backgroundColor: '#FDF2F0', borderRadius: 40 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  modalDescription: { fontSize: 15, textAlign: 'center', color: '#666', marginBottom: 25 },
  btnPrimary: { backgroundColor: '#000', width: '100%', height: 55, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  btnPrimaryText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  btnSecondary: { width: '100%', height: 55, borderRadius: 30, borderWidth: 1, borderColor: '#EEE', justifyContent: 'center', alignItems: 'center' },
  btnSecondaryText: { color: '#8C3E22', fontWeight: '600' },
});
