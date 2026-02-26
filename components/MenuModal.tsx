import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, FlatList, Modal, TextInput, SafeAreaView, Dimensions
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CATEGORIES = [
  { id: '1', name: 'Tous', image: require('@/assets/home/all.png') },
  { id: '2', name: 'Pizza', image: require('@/assets/home/pizza.png') },
  { id: '3', name: 'Boisson', image: require('@/assets/home/jus.webp') },
  { id: '4', name: 'Local', image: require('@/assets/home/local.png') },
  { id: '5', name: 'Grill', image: require('@/assets/home/grill.png') },
];

const FOOD_ITEMS = [
  // --- PIZZAS ---
  { id: '1', name: 'Pizza Royale', price: '5.500 FCFA', cat: 'Pizza', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500' },
  { id: '6', name: 'Pizza 4 Saisons', price: '6.000 FCFA', cat: 'Pizza', img: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?w=500' },
  { id: '7', name: 'Pizza Margherita', price: '4.500 FCFA', cat: 'Pizza', img: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?w=500' },
  { id: '8', name: 'Pizza Pepperoni', price: '5.500 FCFA', cat: 'Pizza', img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500' },

  // --- GRILL / BURGER ---
  { id: '2', name: 'Poulet Braisé', price: '4.000 FCFA', cat: 'Grill', img: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=500' },
  { id: '3', name: 'Burger Maison', price: '3.500 FCFA', cat: 'Grill', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500' },
  { id: '9', name: 'Côtelettes d\'Agneau', price: '7.500 FCFA', cat: 'Grill', img: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=500' },
  { id: '10', name: 'Mix Grill XXL', price: '12.000 FCFA', cat: 'Grill', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500' },

  // --- LOCAL / TRADITIONNEL ---
  { id: '4', name: 'Salade César', price: '3.000 FCFA', cat: 'Local', img: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500' },
  { id: '11', name: 'Thieboudienne', price: '4.500 FCFA', cat: 'Local', img: 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=500' },
  { id: '12', name: 'Alloco & Poisson', price: '3.500 FCFA', cat: 'Local', img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7bb7445?w=500' },
  { id: '13', name: 'Yassa au Poulet', price: '4.000 FCFA', cat: 'Local', img: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=500' },

  // --- BOISSONS ---
  { id: '5', name: 'Jus de Bissap', price: '1.000 FCFA', cat: 'Boisson', img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500' },
  { id: '14', name: 'Jus de Gingembre', price: '1.000 FCFA', cat: 'Boisson', img: 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=500' },
  { id: '15', name: 'Limonade Fraîche', price: '1.500 FCFA', cat: 'Boisson', img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500' },
  { id: '16', name: 'Café Glacé', price: '2.000 FCFA', cat: 'Boisson', img: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500' },

  // --- TOUS / DESSERTS ---
  { id: '17', name: 'Fondant au Chocolat', price: '2.500 FCFA', cat: 'Tous', img: 'https://images.unsplash.com/photo-1624353335561-3039d6b1d31a?w=500' },
  { id: '18', name: 'Assiette de Fruits', price: '2.000 FCFA', cat: 'Tous', img: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=500' },
  { id: '19', name: 'Tiramisu Maison', price: '3.000 FCFA', cat: 'Tous', img: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500' },
  { id: '20', name: 'Mille-feuille', price: '2.500 FCFA', cat: 'Tous', img: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500' },
];

interface MenuModalProps {
  visible: boolean;
  onClose: () => void;
  onAddToCart: (item: any) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function MenuModal({ 
  visible, 
  onClose, 
  onAddToCart, 
  selectedCategory, 
  onCategoryChange 
}: MenuModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMenuData = FOOD_ITEMS.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.menuContainer}>
        <StatusBar style="dark" backgroundColor="white" />
        
        {/* Header du menu */}
        <View style={styles.menuHeader}>
          <TouchableOpacity style={styles.menuBackBtn} onPress={onClose}>
            <Ionicons name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.menuTitle}>Menu Complet</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Barre de recherche dans le menu */}
        <View style={styles.menuSearchContainer}>
          <View style={styles.menuSearchBar}>
            <Ionicons name="search" size={20} color="#999" />
            <TextInput
              style={styles.menuSearchInput}
              placeholder="Rechercher un plat..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Catégories dans le menu */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.menuCategoriesContainer}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity key={cat.id} onPress={() => onCategoryChange(cat.name)} style={styles.menuCatBtn}>
              <Image source={cat.image} style={styles.menuCatIcon} resizeMode="contain" />
              <Text style={[styles.menuCatName, selectedCategory === cat.name && styles.menuCatActive]}>{cat.name}</Text>
              {selectedCategory === cat.name && <View style={styles.menuCatIndicator} />}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Liste des plats du menu */}
        <ScrollView style={styles.menuListContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.menuSectionTitle}>
            {searchQuery ? `Résultats pour "${searchQuery}"` : `${selectedCategory === 'Tous' ? 'Tous les plats' : selectedCategory}`}
          </Text>
          
          {filteredMenuData.length > 0 ? (
            filteredMenuData.map(item => (
              <TouchableOpacity key={item.id} onPress={() => onAddToCart(item)} style={styles.menuItemRow}>
                <Image source={{ uri: item.img }} style={styles.menuItemImage} />
                <View style={styles.menuItemInfo}>
                  <Text style={styles.menuItemName}>{item.name}</Text>
                  <Text style={styles.menuItemCategory}>{item.cat}</Text>
                  <Text style={styles.menuItemPrice}>{item.price}</Text>
                </View>
                <View style={styles.menuAddIcon}>
                  <Ionicons name="add" size={20} color="white" />
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.menuNoResults}>
              <Ionicons name="search-outline" size={50} color="#999" />
              <Text style={styles.menuNoResultsText}>Aucun plat trouvé</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // Menu Modal Styles
  menuContainer: { flex: 1, backgroundColor: 'white' },
  menuHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  menuBackBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  menuTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  
  menuSearchContainer: { paddingHorizontal: 20, paddingVertical: 15 },
  menuSearchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F8F8', borderRadius: 25, paddingHorizontal: 15, paddingVertical: 12 },
  menuSearchInput: { flex: 1, fontSize: 16, marginLeft: 10, color: '#333' },
  
  menuCategoriesContainer: { paddingHorizontal: 20, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  menuCatBtn: { alignItems: 'center', marginRight: 30, minWidth: 65 },
  menuCatIcon: { width: 55, height: 55 },
  menuCatName: { fontSize: 13, color: '#999', marginTop: 5 },
  menuCatActive: { color: 'black', fontWeight: 'bold' },
  menuCatIndicator: { height: 3, width: '100%', backgroundColor: '#5D2E17', marginTop: 10, borderRadius: 2 },
  
  menuListContainer: { flex: 1, paddingHorizontal: 20, paddingTop: 10 },
  menuSectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  menuItemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 15, backgroundColor: 'white', padding: 10, borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  menuItemImage: { width: 80, height: 80, borderRadius: 18 },
  menuItemInfo: { flex: 1 },
  menuItemName: { fontSize: 17, fontWeight: 'bold', color: '#333' },
  menuItemCategory: { fontSize: 13, color: '#999', marginTop: 2 },
  menuItemPrice: { fontSize: 15, color: '#5D2E17', fontWeight: 'bold', marginTop: 5 },
  menuAddIcon: { backgroundColor: 'black', padding: 8, borderRadius: 12 },
  
  menuNoResults: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 50 },
  menuNoResultsText: { fontSize: 16, color: '#999', marginTop: 10 }
});
