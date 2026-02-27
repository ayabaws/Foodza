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

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showTrackingOverlay, setShowTrackingOverlay] = useState(false);

  const handleOrder = () => {
    setShowConfirmModal(true);
  };

  const confirmOrder = () => {
    setShowConfirmModal(false);
    // Vider le panier
    setCartItems([]);
    // Rediriger vers la page de suivi de commande
    router.push('/screens/order-track');
  };

  const cancelOrder = () => {
    setShowConfirmModal(false);
  };

  const closeTrackingOverlay = () => {
    setShowTrackingOverlay(false);
  };

  const recommendedItems = [
    { id: '1', name: 'Poulet Yassa', price: 5000, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=200' },
    { id: '2', name: 'Poulet Yassa', price: 5000, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=200' },
    { id: '3', name: 'Poulet Yassa', price: 5000, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=200' },
  ];

  const addToCart = (item: any) => {
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
  };

  const updateQuantity = (itemId: string, change: number) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + change;
          if (newQuantity <= 0) {
            return null;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      return updatedItems.filter((item): item is typeof prevItems[0] => item !== null);
    });
  };

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
                <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, -1)}><Text style={styles.qtyBtnText}>-</Text></TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, 1)}><Text style={styles.qtyBtnText}>+</Text></TouchableOpacity>
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
                <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
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
          <TouchableOpacity style={styles.orderButtonInside} onPress={handleOrder}>
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

      {/* Modale de confirmation */}
      {showConfirmModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModal}>
            {/* Icône de confirmation */}
            <View style={styles.modalIconContainer}>
              <Ionicons name="cart-outline" size={40} color="#8B4513" />
            </View>
            
            <Text style={styles.modalTitle}>Confirmer la commande</Text>
            <Text style={styles.modalMessage}>Êtes-vous sûr de vouloir passer cette commande ?</Text>
            
            {/* Détails de la commande */}
            <View style={styles.orderSummary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Sous-total</Text>
                <Text style={styles.summaryValue}>9500 CFA</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Livraison</Text>
                <Text style={styles.summaryValue}>Gratuite</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalSummaryLabel}>Total</Text>
                <Text style={styles.totalValue}>9500 CFA</Text>
              </View>
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={cancelOrder}>
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={confirmOrder}>
                <Ionicons name="checkmark" size={18} color="#FFF" style={{ marginRight: 5 }} />
                <Text style={styles.confirmButtonText}>Confirmer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

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
  couponText: { flex: 1, marginLeft: 12, color: '#8E8E93', fontSize: 14 },
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

  // Styles pour la modale de confirmation
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmModal: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 30,
    width: '90%',
    maxWidth: 380,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#8B4513',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2C1810',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  orderSummary: {
    width: '100%',
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 12,
    marginTop: 4,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },
  totalSummaryLabel: {
    fontSize: 16,
    color: '#2C1810',
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 18,
    color: '#8B4513',
    fontWeight: '800',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  confirmButton: {
    backgroundColor: '#8B4513',
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },

  // Styles pour l'overlay de suivi
  trackingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackingCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxWidth: 400,
  },
  trackingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  trackingIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  trackingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  trackingInfo: {
    alignItems: 'center',
    marginBottom: 25,
  },
  trackingMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  trackingTime: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  trackingProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 25,
  },
  progressStep: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStep: {
    backgroundColor: '#4CAF50',
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 5,
  },
  stepNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  closeTrackingButton: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignSelf: 'center',
  },
  closeTrackingText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
});