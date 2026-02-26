import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

export default function OrderDetailsScreen() {
  const { colors, isDarkMode } = useTheme();
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border.light }]}>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Détails de la commande</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="share-outline" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Order Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusIndicator}>
              <View style={[styles.statusDot, styles.statusDotActive]} />
              <View style={styles.statusDot} />
              <View style={styles.statusDot} />
            </View>
            <Text style={styles.statusText}>En préparation</Text>
          </View>
          
          <Text style={styles.orderNumber}>Commande #CMD-2024-001234</Text>
          <Text style={styles.orderTime}>Placée à 14:30</Text>
        </View>

        {/* Delivery Guy Info */}
        <View style={styles.deliveryCard}>
          <Text style={styles.sectionTitle}>Livreur</Text>
          <View style={styles.deliveryInfo}>
            <View style={styles.driverImagePlaceholder}>
              <Ionicons name="person" size={30} color="#FFFFFF" />
            </View>
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>Mamadou Diallo</Text>
              <View style={styles.driverRating}>
                <Ionicons name="star" size={14} color="#FFA500" />
                <Text style={styles.driverRatingText}>4.8</Text>
                <Text style={styles.deliveryCount}>(234 livraisons)</Text>
              </View>
              <View style={styles.vehicleInfo}>
                <Ionicons name="bicycle" size={14} color="#666" />
                <Text style={styles.vehicleText}>Vélo - Matricule: 1234-AB</Text>
              </View>
            </View>
            <View style={styles.driverActions}>
              <TouchableOpacity style={styles.driverAction}>
                <Ionicons name="call" size={20} color="#4CAF50" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.driverAction}>
                <Ionicons name="chatbubble" size={20} color="#4CAF50" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.estimatedTime}>
            <Ionicons name="time" size={20} color="#4CAF50" />
            <Text style={styles.estimatedTimeText}>Estimé: 15-20 minutes</Text>
          </View>
        </View>

        {/* Delivery Address */}
        <View style={styles.addressCard}>
          <Text style={styles.sectionTitle}>Adresse de livraison</Text>
          <View style={styles.addressInfo}>
            <View style={styles.addressIcon}>
              <Ionicons name="location" size={20} color="#4CAF50" />
            </View>
            <View style={styles.addressDetails}>
              <Text style={styles.addressPrimary}>Kalaban-coro, Bamako</Text>
              <Text style={styles.addressSecondary}>À côté du marché, porte 12</Text>
              <Text style={styles.addressContact}>+223 76 123 456</Text>
            </View>
          </View>
        </View>

        {/* Payment Info */}
        <View style={styles.paymentCard}>
          <Text style={styles.sectionTitle}>Paiement</Text>
          <View style={styles.paymentInfo}>
            <View style={styles.paymentMethod}>
              <View style={styles.paymentIcon}>
                <Ionicons name="card" size={20} color="#4CAF50" />
              </View>
              <View style={styles.paymentDetails}>
                <Text style={styles.paymentMethodText}>Carte bancaire</Text>
                <Text style={styles.paymentCardNumber}>**** **** **** 1234</Text>
              </View>
            </View>
            <View style={styles.paymentStatus}>
              <Text style={styles.paymentStatusText}>Payé</Text>
              <Text style={styles.paymentAmount}>6600 CFA</Text>
            </View>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.itemsCard}>
          <Text style={styles.sectionTitle}>Articles à livrer</Text>
          
          <View style={styles.item}>
            <View style={styles.itemImagePlaceholder}>
              <Ionicons name="pizza" size={30} color="#FFFFFF" />
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>Pizza Margherita</Text>
              <Text style={styles.itemDescription}>Taille: Moyenne</Text>
              <Text style={styles.itemExtras}>Extras: Fromage</Text>
              <Text style={styles.itemRestaurant}>La Brioche Dorée</Text>
            </View>
            <View style={styles.itemPricing}>
              <Text style={styles.itemQuantity}>x1</Text>
              <Text style={styles.itemPrice}>4500 CFA</Text>
            </View>
          </View>

          <View style={styles.item}>
            <View style={styles.itemImagePlaceholder}>
              <Ionicons name="cafe" size={30} color="#FFFFFF" />
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>Croissant au beurre</Text>
              <Text style={styles.itemRestaurant}>Boulangerie Paris</Text>
            </View>
            <View style={styles.itemPricing}>
              <Text style={styles.itemQuantity}>x2</Text>
              <Text style={styles.itemPrice}>1600 CFA</Text>
            </View>
          </View>

          <View style={styles.itemsTotal}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Sous-total</Text>
              <Text style={styles.totalValue}>6100 CFA</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Frais de livraison</Text>
              <Text style={styles.totalValue}>500 CFA</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>6600 CFA</Text>
            </View>
          </View>
        </View>

        {/* Restaurant Info */}
        <View style={styles.restaurantCard}>
          <Text style={styles.sectionTitle}>Restaurant</Text>
          <View style={styles.restaurantInfo}>
            <View style={styles.restaurantLogo}>
              <Text style={styles.restaurantLogoText}>NOIR</Text>
            </View>
            <View style={styles.restaurantDetails}>
              <Text style={styles.restaurantName}>La Brioche Dorée</Text>
              <Text style={styles.restaurantAddress}>Badalabougou, Bamako</Text>
              <View style={styles.restaurantContact}>
                <Ionicons name="call" size={14} color="#4CAF50" />
                <Text style={styles.restaurantPhone}>+223 20 123 456</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="headset" size={20} color="#2C1810" />
            <Text style={styles.actionButtonText}>Support client</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="document-text" size={20} color="#2C1810" />
            <Text style={styles.actionButtonText}>Facture</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E0E0E0',
    marginRight: 8,
  },
  statusDotActive: {
    backgroundColor: '#4CAF50',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  orderNumber: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  orderTime: {
    fontSize: 12,
    color: '#999',
  },
  deliveryCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    marginTop: 0,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 15,
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  driverImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2C1810',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 4,
  },
  driverRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  driverRatingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  deliveryCount: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  driverActions: {
    flexDirection: 'row',
  },
  driverAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  estimatedTime: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    borderRadius: 10,
    padding: 12,
  },
  estimatedTimeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginLeft: 8,
  },
  addressCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    marginTop: 0,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addressInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  addressDetails: {
    flex: 1,
  },
  addressPrimary: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 4,
  },
  addressSecondary: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  addressContact: {
    fontSize: 14,
    color: '#4CAF50',
  },
  paymentCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    marginTop: 0,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  paymentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  paymentDetails: {
    flex: 1,
  },
  paymentMethodText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 4,
  },
  paymentCardNumber: {
    fontSize: 14,
    color: '#666',
  },
  paymentStatus: {
    alignItems: 'flex-end',
  },
  paymentStatusText: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 4,
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  itemsCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    marginTop: 0,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  item: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#2C1810',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  itemExtras: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  itemRestaurant: {
    fontSize: 14,
    color: '#666',
  },
  itemPricing: {
    alignItems: 'flex-end',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  itemsTotal: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  restaurantCard: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    marginTop: 0,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2C1810',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  restaurantLogoText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  restaurantDetails: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 4,
  },
  restaurantAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  restaurantContact: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restaurantPhone: {
    fontSize: 14,
    color: '#4CAF50',
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    margin: 20,
    gap: 15,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F8F8',
    paddingVertical: 15,
    borderRadius: 10,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#2C1810',
    fontWeight: '500',
    marginLeft: 8,
  },
});
