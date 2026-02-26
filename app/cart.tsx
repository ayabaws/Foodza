import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, StatusBar, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function CartScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();

  const [cartItems, setCartItems] = useState([
    { id: '1', name: 'Pizza Margherita', price: 4500, quantity: 1, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=200' },
    { id: '2', name: 'Pizza Margherita', price: 4500, quantity: 1, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=200' },
  ]);

  const recommendedItems = [
    { id: '1', name: 'Poulet Yassa', price: 5000, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=200' },
    { id: '2', name: 'Poulet Yassa', price: 5000, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=200' },
    { id: '3', name: 'Poulet Yassa', price: 5000, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=200' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.restaurantName}>La brioche dorée</Text>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>40-45 mins pour arriver</Text>
            <Ionicons name="chevron-down" size={14} color="#666" />
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="share-social-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>

        <View style={styles.section}>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.cartCard}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPriceText}>{item.price} CFA</Text>
              </View>
              <View style={styles.quantityControl}>
                <TouchableOpacity style={styles.qtyBtn}><Text style={styles.qtyBtnText}>-</Text></TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <TouchableOpacity style={styles.qtyBtn}><Text style={styles.qtyBtnText}>+</Text></TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Completer votre repas avec</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendationScroll}>
          {recommendedItems.map((item) => (
            <View key={item.id} style={styles.recomCard}>
              <View style={styles.recomImageContainer}>
                <Image source={{ uri: item.image }} style={styles.recomImage} />
                <TouchableOpacity style={styles.addButton}>
                  <Ionicons name="add" size={20} color="#8B4513" />
                </TouchableOpacity>
              </View>
              <Text style={styles.recomName}>{item.name}</Text>
              <Text style={styles.recomPrice}>Prix: {item.price} FCFA</Text>
            </View>
          ))}
        </ScrollView>

        {/* Coupon */}
        <TouchableOpacity style={styles.couponContainer}>
          <MaterialCommunityIcons name="ticket-outline" size={24} color="#C7C7CC" />
          <Text style={styles.couponText}>Ajouter un coupons</Text>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.addressContainer}>
          <Ionicons name="location-outline" size={22} color="#555" />
          <View style={styles.addressInfo}>
            <Text style={styles.addressLabel}>Livrer à</Text>
            <Text style={styles.addressValue}>Maison - Kalaban-coro</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>

      </ScrollView>

      <View style={styles.blackFooter}>
        <View style={styles.paymentMethod}>
          <View style={styles.paymentLabelContainer}>
            <Text style={styles.paymentLabelText}>Payment</Text>
            <Ionicons name="caret-up" size={12} color="#FFF" />
          </View>
          <Text style={styles.paymentValueText}>Orange Money</Text>
        </View>

        <LinearGradient
          colors={['#8B4513', '#5D2E17']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.orderButton}
        >
          <TouchableOpacity style={styles.orderButtonInside} onPress={() => { }}>
            <View>
              <Text style={styles.totalAmount}>9500 CFA</Text>
              <Text style={styles.totalLabel}>Total</Text>
            </View>
            <View style={styles.commanderContainer}>
              <Text style={styles.commanderText}>Commander</Text>
              <Ionicons name="chevron-forward" size={18} color="#FFF" />
            </View>
          </TouchableOpacity>
        </LinearGradient>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  restaurantName: { fontSize: 14, color: '#666', left: -75 },
  timeContainer: { flexDirection: 'row', alignItems: 'center', gap: 4, left: -40 },
  timeText: { fontSize: 14, fontWeight: '600', color: '#000' },
  backButton: { padding: 5 },
  section: { paddingHorizontal: 20, marginTop: 10 },
  cartCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 25,
    padding: 8,
    marginBottom: 15,
  },
  itemImage: {
    width: 100, height: 100,
    borderTopLeftRadius: 50, borderTopRightRadius: 10,
    borderBottomLeftRadius: 30, borderBottomRightRadius: 50
  },
  itemInfo: { flex: 1, marginLeft: 15 },
  itemName: { fontSize: 13, fontWeight: '600', color: '#000' },
  itemPriceText: { fontSize: 12, fontWeight: '700', marginTop: 20 },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B4513',
    borderRadius: 20,
    paddingVertical: 1,
    marginRight: 5,
  },
  qtyBtn: { width: 28, height: 28, justifyContent: 'center', alignItems: 'center' },
  qtyBtnText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  qtyText: { color: '#FFF', paddingHorizontal: 10, fontSize: 14, fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: '600', paddingHorizontal: 20, marginTop: 20, marginBottom: 15 },
  recommendationScroll: { paddingLeft: 20 },
  recomCard: { width: 140, marginRight: 15 },
  recomImageContainer: { position: 'relative' },
  recomImage: { width: 140, height: 140, borderRadius: 15 },
  addButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#FFF',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  recomName: { fontSize: 13, fontWeight: '600', marginTop: 8 },
  recomPrice: { fontSize: 11, color: '#8E8E93', marginTop: 2 },
  couponContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 15,
    marginTop: 25,
  },
  couponText: { flex: 1, marginLeft: 12, color: '#8E8E93', fontSize: 15 },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 30,
    paddingBottom: 20,
  },
  addressInfo: { flex: 1, marginLeft: 15 },
  addressLabel: { fontSize: 12, color: '#8E8E93' },
  addressValue: { fontSize: 14, fontWeight: '400', marginTop: 2 },

  // LE FOOTER NOIR INCURVÉ
  blackFooter: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#000',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 25,
    paddingTop: 25,
    paddingBottom: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  paymentMethod: { flex: 1 },
  paymentLabelContainer: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  paymentLabelText: { color: '#8E8E93', fontSize: 11 },
  paymentValueText: { color: '#FFF', fontSize: 12, fontWeight: '500', marginTop: 2 },
  orderButton: {
    width: '65%',
    borderRadius: 30,
    overflow: 'hidden',
  },
  orderButtonInside: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  totalAmount: { color: '#FFF', fontSize: 14, fontWeight: '400' },
  totalLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },
  commanderContainer: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  commanderText: { color: '#FFF', fontSize: 11, fontWeight: '400' },
});