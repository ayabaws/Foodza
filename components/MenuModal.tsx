import React, { useState } from 'react';

import {
    Dimensions,
    Image, Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { StatusBar } from 'expo-status-bar';



const { width: SCREEN_WIDTH } = Dimensions.get('window');



// Les couleurs constantes pour garder une cohérence

const THEME_COLOR = '#5D2E17'; // Ton marron dégradé

const BG_COLOR = '#F8F9FB';



const CATEGORIES = [

  { id: '1', name: 'Tous' },

  { id: '2', name: 'Pizza' },

  { id: '3', name: 'Boisson' },

  { id: '4', name: 'Local' },

  { id: '5', name: 'Grill' },

];



const FOOD_ITEMS = [

  // --- PIZZAS ---

  { id: '1', name: 'Pizza Royale', price: '5.500 FCFA', cat: 'Pizza', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500' },

  { id: '6', name: 'Pizza 4 Saisons', price: '6.000 FCFA', cat: 'Pizza', img: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?w=500' },

  { id: '7', name: 'Pizza Margherita', price: '4.500 FCFA', cat: 'Pizza', img: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?w=500' },

  { id: '8', name: 'Pizza Pepperoni', price: '5.500 FCFA', cat: 'Pizza', img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500' },

  // --- GRILL ---

  { id: '2', name: 'Poulet Braisé', price: '4.000 FCFA', cat: 'Grill', img: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=500' },

  { id: '10', name: 'Mix Grill XXL', price: '12.000 FCFA', cat: 'Grill', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500' },

  // --- LOCAL ---

  { id: '11', name: 'Thieboudienne', price: '4.500 FCFA', cat: 'Local', img: 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=500' },

  { id: '13', name: 'Yassa au Poulet', price: '4.000 FCFA', cat: 'Local', img: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=500' },

  // --- BOISSONS ---

  { id: '5', name: 'Jus de Bissap', price: '1.000 FCFA', cat: 'Boisson', img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500' },

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



  // Filtrage combiné (Recherche + Catégorie)

  const filteredData = FOOD_ITEMS.filter(item => {

    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = selectedCategory === 'Tous' || item.cat === selectedCategory;

    return matchesSearch && matchesCat;

  });



  return (

    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>

      <SafeAreaView style={styles.container}>

        <StatusBar style="dark" />

        

        {/* Header avec bouton fermer circulaire */}

        <View style={styles.header}>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>

            <Ionicons name="close" size={24} color="#000" />

          </TouchableOpacity>

          <Text style={styles.headerTitle}>La Carte</Text>

          <View style={{ width: 40 }} /> 

        </View>



        {/* Barre de recherche moderne */}

        <View style={styles.searchSection}>

          <View style={styles.searchBar}>

            <Ionicons name="search-outline" size={20} color="#8E8E93" />

            <TextInput

              style={styles.searchInput}

              placeholder="Rechercher un plat..."

              placeholderTextColor="#8E8E93"

              value={searchQuery}

              onChangeText={setSearchQuery}

            />

          </View>

        </View>



        {/* Filtres par catégories (Pills) */}

        <View style={styles.categoriesWrapper}>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesList}>

            {CATEGORIES.map(cat => (

              <TouchableOpacity 

                key={cat.id} 

                onPress={() => onCategoryChange(cat.name)}

                style={[

                  styles.catItem, 

                  selectedCategory === cat.name && styles.catItemActive

                ]}

              >

                <Text style={[

                  styles.catText, 

                  selectedCategory === cat.name && styles.catTextActive

                ]}>{cat.name}</Text>

              </TouchableOpacity>

            ))}

          </ScrollView>

        </View>



        {/* Liste des plats */}

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>

          <Text style={styles.resultsLabel}>

            {selectedCategory} <Text style={styles.resultsCount}>({filteredData.length})</Text>

          </Text>



          {filteredData.length > 0 ? (

            filteredData.map(item => (

              <View key={item.id} style={styles.foodCard}>

                <Image source={{ uri: item.img }} style={styles.foodImage} />

                

                <View style={styles.foodDetails}>

                  <View>

                    <Text style={styles.foodName}>{item.name}</Text>

                    <Text style={styles.foodDesc} numberOfLines={1}>Fait maison avec des produits frais</Text>

                  </View>

                  

                  <View style={styles.foodFooter}>

                    <Text style={styles.foodPrice}>{item.price}</Text>

                    <TouchableOpacity 

                      style={styles.addBtn}

                      onPress={() => onAddToCart(item)}

                      activeOpacity={0.7}

                    >

                      <Ionicons name="add" size={22} color="#FFF" />

                    </TouchableOpacity>

                  </View>

                </View>

              </View>

            ))

          ) : (

            <View style={styles.emptyState}>

              <Ionicons name="fast-food-outline" size={60} color="#C7C7CC" />

              <Text style={styles.emptyText}>Aucun plat ne correspond à votre recherche.</Text>

            </View>

          )}

        </ScrollView>

      </SafeAreaView>

    </Modal>

  );

}



const styles = StyleSheet.create({

  container: { flex: 1, backgroundColor: BG_COLOR },

  header: {

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    paddingHorizontal: 20,

    paddingVertical: 15,

    backgroundColor: '#FFF',

  },

  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1C1C1E' },

  closeBtn: {

    width: 40,

    height: 40,

    borderRadius: 20,

    backgroundColor: '#FFFFFF',

    justifyContent: 'center',

    alignItems: 'center'

  },

  searchSection: { padding: 16, backgroundColor: '#FFF' },

  searchBar: {

    flexDirection: 'row',

    alignItems: 'center',

    backgroundColor: '#FFFFFF',

    borderRadius: 15,

    paddingHorizontal: 15,

    height: 50,

    borderWidth: 1,

    borderColor: '#E0E0E0',

  },

  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: '#000' },

  categoriesWrapper: { backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F2F2F7' },

  categoriesList: { paddingHorizontal: 16, paddingBottom: 15 },

  catItem: {

    paddingHorizontal: 20,

    paddingVertical: 8,

    borderRadius: 20,

    backgroundColor: '#FFFFFF',

    marginRight: 10,

    borderWidth: 1,

    borderColor: '#E0E0E0',

  },

  catItemActive: { backgroundColor: '#8C3E22' },

  catText: { fontSize: 14, fontWeight: '600', color: '#8E8E93' },

  catTextActive: { color: '#FFF' },

  listContent: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40 },

  resultsLabel: { fontSize: 22, fontWeight: '800', marginBottom: 20 },

  resultsCount: { fontWeight: '400', color: '#8E8E93', fontSize: 18 },

  foodCard: {

    flexDirection: 'row',

    backgroundColor: '#FFF',

    borderRadius: 20,

    padding: 12,

    marginBottom: 16,

    ...Platform.select({

      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },

      android: { elevation: 3 }

    })

  },

  foodImage: { 
    width: 100, 
    height: 100, 
    borderTopLeftRadius: 50, 
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 40, 
    borderBottomRightRadius: 40
  },

  foodDetails: { flex: 1, marginLeft: 15, justifyContent: 'space-between', paddingVertical: 2 },

  foodName: { fontSize: 16, fontWeight: '700', color: '#1C1C1E' },

  foodDesc: { fontSize: 12, color: '#8E8E93' },

  foodFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  foodPrice: { fontSize: 16, fontWeight: '800', color: '#8C3E22' },

  addBtn: {

    backgroundColor: '#8C3E22',

    width: 34,

    height: 34,

    borderRadius: 17,

    justifyContent: 'center',

    alignItems: 'center',

  },

  emptyState: { alignItems: 'center', marginTop: 50 },

  emptyText: { color: '#8E8E93', marginTop: 10, textAlign: 'center', paddingHorizontal: 40 }

});