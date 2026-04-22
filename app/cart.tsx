import { useOrder } from '@/contexts/OrderContext';

import { useTheme } from '@/contexts/ThemeContext';

import OrderService from '@/services/OrderService';

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { LinearGradient } from 'expo-linear-gradient';

import { useRouter } from 'expo-router';

import React, { useEffect, useState } from 'react';

import { Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';



export default function CartScreen() {

  const [screenData, setScreenData] = useState(Dimensions.get('window'));

  const { width, height } = screenData;

  const isSmallScreen = width < 375;

  const isMediumScreen = width >= 375 && width < 414;

  const isLargeScreen = width >= 414;

  const isTablet = width > 768;



  useEffect(() => {

    const subscription = Dimensions.addEventListener('change', ({ window }) => {

      setScreenData(window);

    });

    return () => subscription?.remove();

  }, []);



  const router = useRouter();

  const { colors, isDarkMode } = useTheme();

  const { startOrder } = useOrder();



  const [cartItems, setCartItems] = useState([

    { id: '1', name: 'Pizza Margherita', price: 4500, quantity: 1, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=200' },

    { id: '2', name: 'Pizza Margherita', price: 4500, quantity: 1, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=200' },

  ]);



  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [showTrackingOverlay, setShowTrackingOverlay] = useState(false);



  const handleOrder = () => {

    setShowConfirmModal(true);

  };



  const confirmOrder = async () => {

    setShowConfirmModal(false);

    

    try {

      // Calculer le total

      const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      

      // Préparer les données de la commande

      const orderData = {

        restaurantName: 'La brioche dorée',

        restaurantImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',

        status: 'en-cours' as const,

        total: total,

        totalAmount: total,

        items: cartItems.map(item => ({

          id: item.id,

          menuItemId: item.id,

          name: item.name,

          price: item.price,

          quantity: item.quantity,

          extras: []

        })),

        estimatedTime: '39 mins',

        deliveryAddress: {

          id: 'default',

          street: 'Kalaban-coro',

          city: 'Bamako',

          postalCode: '1234',

          country: 'Mali',

          isDefault: true

        },

        paymentMethod: {

          id: 'orange_money',

          type: 'mobile_money' as const,

          isDefault: true,

          details: {

            mobileProvider: 'Orange',

            mobileNumber: '+223XXXXXXXXX'

          }

        }

      };



      // Sauvegarder la commande dans l'historique

      const savedOrder = await OrderService.saveOrder(orderData);

      console.log('Commande sauvegardée avec ID:', savedOrder.id);



      // Démarrer la commande avec les données du panier

      startOrder({

        restaurantName: 'La brioche dorée',

        estimatedTime: '39 mins',

        items: cartItems.map(item => ({

          id: item.id,

          name: item.name,

          image: item.image

        }))

      });

      

      // Vider le panier

      setCartItems([]);

      // Rediriger vers la page de suivi de commande

      router.push('/screens/order-track');

    } catch (error) {

      console.error('Erreur lors de la sauvegarde de la commande:', error);

      // En cas d'erreur, quand même continuer avec le flux normal

      startOrder({

        restaurantName: 'La brioche dorée',

        estimatedTime: '39 mins',

        items: cartItems.map(item => ({

          id: item.id,

          name: item.name,

          image: item.image

        }))

      });

      setCartItems([]);

      router.push('/screens/order-track');

    }

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

  // Styles dynamiques pour les petits écrans
  const dynamicStyles = {
    restaurantName: { fontSize: isSmallScreen ? 12 : 14, color: '#666', left: -10 },
    timeText: { fontSize: isSmallScreen ? 12 : 14, fontWeight: '600' as const, color: '#000' },
    itemName: { fontSize: isSmallScreen ? 11 : 13, fontWeight: '600' as const, color: '#000' },
    itemPriceText: { fontSize: isSmallScreen ? 10 : 12, fontWeight: '700' as const, marginTop: 20 },
    qtyBtnText: { color: '#FFF', fontSize: isSmallScreen ? 12 : 14, fontWeight: '600' as const },
    qtyText: { color: '#FFF', paddingHorizontal: 10, fontSize: isSmallScreen ? 12 : 14, fontWeight: '600' as const },
    sectionTitle: { fontSize: isSmallScreen ? 14 : 16, fontWeight: '600' as const, paddingHorizontal: 20, marginTop: 20, marginBottom: 15 },
    recomName: { fontSize: isSmallScreen ? 11 : 13, fontWeight: '600' as const, marginTop: 8 },
    recomPrice: { fontSize: isSmallScreen ? 9 : 11, color: '#8E8E93', marginTop: 2 },
    couponText: { flex: 1, marginLeft: 12, color: '#8E8E93', fontSize: isSmallScreen ? 12 : 14 },
    addressLabel: { fontSize: isSmallScreen ? 10 : 12, color: '#8E8E93' },
    addressValue: { fontSize: isSmallScreen ? 12 : 14, fontWeight: '400' as const, marginTop: 2 },
    paymentLabelText: { color: '#8E8E93', fontSize: isSmallScreen ? 9 : 11 },
    paymentValueText: { color: '#FFF', fontSize: isSmallScreen ? 10 : 12, fontWeight: '500' as const, marginTop: 2 },
    totalAmount: { color: '#FFF', fontSize: isSmallScreen ? 12 : 14, fontWeight: '400' as const },
    totalLabel: { color: 'rgba(255,255,255,0.7)', fontSize: isSmallScreen ? 9 : 11 },
    commanderText: { color: '#FFF', fontSize: isSmallScreen ? 9 : 11, fontWeight: '400' as const },
  };


  return (

    <SafeAreaView style={styles.container}>

      <StatusBar barStyle="dark-content" />



      <View style={styles.header}>

        <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { padding: 15, zIndex: 10, position: 'absolute', left: 10, top: 0 }]}>

          <Ionicons name="arrow-back" size={24} color="#000" />

        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>

          <Text style={dynamicStyles.restaurantName}>La brioche dorée</Text>

          <View style={styles.timeContainer}>

            <Text style={dynamicStyles.timeText}>40-45 mins pour arriver</Text>

            <Ionicons name="chevron-down" size={14} color="#666" />

          </View>

        </View>

        <TouchableOpacity>

          <Ionicons name="share-social-outline" size={24} color="#000" />

        </TouchableOpacity>

      </View>



      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>



        <View style={styles.recommenderList}>

          {cartItems.map((item) => (

            <View key={item.id} style={styles.recommendCard}>

              <Image source={{ uri: item.image }} style={styles.recommendImg} />

              <View style={styles.recommendInfo}>

                <View style={styles.recommendHeader}>

                  <Text style={styles.recommendName}>{item.name}</Text>

                </View>

                <Text style={styles.recommendDesc}>Article ajouté au panier</Text>

                <View style={styles.recommendFooter}>

                  <View style={styles.priceInfo}>

                    <Text style={styles.recommendPrice}>{item.price} CFA</Text>

                    <Text style={styles.quantityText}>Quantité: {item.quantity}</Text>

                  </View>

                  <View style={styles.quantityControlNew}>

                    <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(item.id, -1)}>

                      <Ionicons name="remove" size={14} color="white" />

                    </TouchableOpacity>

                    
                    <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(item.id, 1)}>

                      <Ionicons name="add" size={14} color="white" />

                    </TouchableOpacity>

                  </View>

                </View>

              </View>

            </View>

          ))}

        </View>



        <Text style={dynamicStyles.sectionTitle}>Completer votre repas avec</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendationScroll}>

          {recommendedItems.map((item) => (

            <View key={item.id} style={styles.recomCard}>

              <View style={styles.recomImageContainer}>

                <Image source={{ uri: item.image }} style={styles.recomImage} />

                <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>

                  <Ionicons name="add" size={20} color="#8B4513" />

                </TouchableOpacity>

              </View>

              <Text style={dynamicStyles.recomName}>{item.name}</Text>

              <Text style={dynamicStyles.recomPrice}>Prix: {item.price} FCFA</Text>

            </View>

          ))}

        </ScrollView>



        {/* Coupon */}

        <TouchableOpacity style={styles.couponContainer}>

          <MaterialCommunityIcons name="ticket-outline" size={24} color="#C7C7CC" />

          <Text style={dynamicStyles.couponText}>Ajouter un coupons</Text>

          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />

        </TouchableOpacity>



        <TouchableOpacity style={styles.addressContainer}>

          <Ionicons name="location-outline" size={22} color="#555" />

          <View style={styles.addressInfo}>

            <Text style={dynamicStyles.addressLabel}>Livrer à</Text>

            <Text style={dynamicStyles.addressValue}>Maison - Kalaban-coro</Text>

          </View>

          <TouchableOpacity style={styles.addressArrow}>

            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />

          </TouchableOpacity>

        </TouchableOpacity>



      </ScrollView>



      <View style={[styles.footerContainer, {

        borderTopLeftRadius: isSmallScreen ? 20 : 40,

        borderTopRightRadius: isSmallScreen ? 20 : 40,

        paddingHorizontal: isSmallScreen ? 15 : 25,

        paddingTop: isSmallScreen ? 15 : 25,

        paddingBottom: isSmallScreen ? 20 : 35,

        flexDirection: 'row',

        alignItems: 'center',

        justifyContent: 'space-between',

      }]}>



        <View style={styles.paymentMethod}>

          <View style={styles.paymentLabelContainer}>

            <Text style={dynamicStyles.paymentLabelText}>Payment</Text>

            <Ionicons name="caret-up" size={12} color="#FFF" />

          </View>

          <Text style={dynamicStyles.paymentValueText}>Orange Money</Text>

        </View>



        <LinearGradient

          colors={['#8B4513', '#5D2E17']}

          start={{ x: 0, y: 0 }}

          end={{ x: 1, y: 0 }}

          style={[styles.orderButton, {

            width: isSmallScreen ? '70%' : '65%',

            borderRadius: isSmallScreen ? 20 : 30,

          }]}

        >

          <TouchableOpacity style={styles.orderButtonInside} onPress={handleOrder}>

            <View>

              <Text style={dynamicStyles.totalAmount}>9500 CFA</Text>

              <Text style={dynamicStyles.totalLabel}>Total</Text>

            </View>

            <View style={[styles.commanderContainer, { gap: isSmallScreen ? 3 : 5 }]}>

              <Text style={dynamicStyles.commanderText}>Commander</Text>

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

  restaurantName: { fontSize: 14, color: '#666', left: -10 },

  timeContainer: { flexDirection: 'row', alignItems: 'center', gap: 4, left: 0 },

  timeText: { fontSize: 14, fontWeight: '600', color: '#000' },

  backButton: { padding: 5 },

  section: { paddingHorizontal: 20, marginTop: 10 },

  cartCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 25,
    marginBottom: 15,
    padding: 8,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40
  },

  itemImage: { width: 60, height: 60, borderRadius: 15 },

  itemInfo: { flex: 1, marginLeft: 15 },

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

  addressArrow: { padding: 10 },



  // LE FOOTER RESPONSIVE

  footerContainer: {

    position: 'absolute',

    bottom: 0,

    width: '100%',

    backgroundColor: '#000',

    borderTopLeftRadius: 40,

    borderTopRightRadius: 40,

    paddingHorizontal: 25,

    paddingTop: 25,

    paddingBottom: 35,

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

    width: '98%',

    maxWidth: 450,

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

    paddingVertical: 18,

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

// Styles pour le design recommender

recommenderList: { marginTop: 20 },

recommendCard: { 
  flexDirection: 'row', 
  borderRadius: 30, 
  padding: 10, 
  marginBottom: 15, 
  elevation: 3, 
  shadowOffset: { width: 0, height: 2 }, 
  shadowOpacity: 0.1, 
  shadowRadius: 10,
  backgroundColor: '#F9F9F9',
  marginHorizontal: 20
},

recommendImg: {
  width: 110, 
  height: 110,
  borderTopLeftRadius: 50, 
  borderTopRightRadius: 30,
  borderBottomLeftRadius: 40, 
  borderBottomRightRadius: 40
},

recommendInfo: { flex: 1, marginLeft: 15, justifyContent: 'space-between', paddingVertical: 5 },

recommendHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

recommendName: { 
  fontSize: 13, 
  fontWeight: 'bold', 
  flex: 1 
},

recommendDesc: { 
  fontSize: 9, 
  marginTop: 4, 
  width: '80%',
  color: '#666'
},

recommendFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },

recommendPrice: { 
  fontSize: 11, 
  fontWeight: 'bold' 
},

priceInfo: {
  flexDirection: 'column',
  gap: 2
},

  quantityText: {
    fontSize: 10,
    color: '#666'
  },

  quantityControlNew: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },

  quantityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#8B4513',
    justifyContent: 'center',
    alignItems: 'center',
  },

  quantityTextNew: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    minWidth: 20,
    textAlign: 'center'
  },

});