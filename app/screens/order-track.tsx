import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function OrderTrackScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#2C1810" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Suivi de commande</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="call" size={24} color="#2C1810" />
        </TouchableOpacity>
      </View>

      {/* Map Container */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={60} color="#4CAF50" />
          <Text style={styles.mapPlaceholderText}>Carte de suivi</Text>
          <Text style={styles.mapPlaceholderSubtext}>Votre commande est en route</Text>
        </View>

        {/* Map Overlay Info */}
        <View style={styles.mapOverlay}>
          <View style={styles.estimatedTime}>
            <Ionicons name="time" size={20} color="#4CAF50" />
            <Text style={styles.estimatedTimeText}>15-20 min</Text>
          </View>
        </View>
      </View>

      {/* Delivery Info Card */}
      <View style={styles.deliveryInfoCard}>
        <View style={styles.deliveryHeader}>
          <View style={styles.deliveryStatus}>
            <View style={styles.statusIndicator} />
            <Text style={styles.statusText}>Votre commande est en route</Text>
          </View>
          <Text style={styles.orderNumber}>CMD-2024-001234</Text>
        </View>

        <View style={styles.driverInfo}>
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

        <View style={styles.deliveryAddress}>
          <Ionicons name="location" size={16} color="#666" />
          <Text style={styles.deliveryAddressText}>Kalaban-coro, Bamako</Text>
        </View>

        <View style={styles.deliveryTime}>
          <Ionicons name="time" size={16} color="#666" />
          <Text style={styles.deliveryTimeText}>Estimé: 15-20 minutes</Text>
        </View>
      </View>

      {/* Order Summary */}
      <View style={styles.orderSummary}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryTitle}>Détails de la commande</Text>
          <TouchableOpacity style={styles.summaryButton}>
            <Text style={styles.summaryButtonText}>Voir tout</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.summaryItems}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryItemName}>Pizza Margherita</Text>
            <Text style={styles.summaryItemQuantity}>x1</Text>
            <Text style={styles.summaryItemPrice}>4500 CFA</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryItemName}>Croissant au beurre</Text>
            <Text style={styles.summaryItemQuantity}>x2</Text>
            <Text style={styles.summaryItemPrice}>1600 CFA</Text>
          </View>
        </View>

        <View style={styles.summaryTotal}>
          <Text style={styles.summaryTotalLabel}>Total payé</Text>
          <Text style={styles.summaryTotalValue}>6600 CFA</Text>
        </View>
      </View>
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
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  mapPlaceholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C1810',
    marginTop: 20,
  },
  mapPlaceholderSubtext: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  mapOverlay: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
  },
  estimatedTime: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  estimatedTimeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginLeft: 8,
  },
  deliveryInfoCard: {
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
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  deliveryStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  orderNumber: {
    fontSize: 14,
    color: '#666',
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  driverImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
  deliveryAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  deliveryAddressText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  deliveryTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryTimeText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  orderSummary: {
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
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  summaryButton: {
    padding: 5,
  },
  summaryButtonText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  summaryItems: {
    marginBottom: 15,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryItemName: {
    flex: 1,
    fontSize: 14,
    color: '#2C1810',
  },
  summaryItemQuantity: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 10,
  },
  summaryItemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  summaryTotalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});
