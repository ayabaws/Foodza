import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useOrder } from '@/contexts/OrderContext';
import { Ionicons } from '@expo/vector-icons';

export default function OrderTrackingModal() {
  const router = useRouter();
  const pathname = usePathname();
  const { isOrderActive, orderData } = useOrder();

  if (!isOrderActive || !orderData || pathname.includes('/order-track') || pathname.includes('/order-success')) {
    return null;
  }

  const handleTrackOrder = () => {
    router.push('/screens/order-track');
  };

  return (
    <View style={styles.container}>
      <View style={styles.modalContent}>
        {/* Images des articles empilées */}
        <View style={styles.imagesContainer}>
          {orderData.items.slice(0, 2).map((item, index) => (
            <Image
              key={item.id}
              source={{ uri: item.image }}
              style={[
                styles.itemImage,
                index > 0 && { marginLeft: -18 } // Effet de chevauchement comme sur l'image
              ]}
            />
          ))}
        </View>

        {/* Informations de la commande */}
        <View style={styles.orderInfo}>
          <Text style={styles.restaurantName} numberOfLines={1}>
            {orderData.restaurantName}
          </Text>
          <Text style={styles.estimatedTime}>
            {orderData.estimatedTime}
          </Text>
        </View>

        {/* Bouton de suivi Marron */}
        <TouchableOpacity style={styles.trackButton} onPress={handleTrackOrder}>
          <Text style={styles.trackButtonText}>Suivre la commande</Text>
          <Ionicons name="chevron-forward" size={16} color="#FFF" style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 105,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: 'transparent',
  },
  modalContent: {
    backgroundColor: '#FFF',
    width: '100%',
    borderRadius: 40,
    paddingVertical: 12,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },

  imagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },

  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#FFF',
    backgroundColor: '#F5F5F5',
  },
  orderInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  restaurantName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1A1A1A',
    marginBottom: 0,
    left:-8
  },
  estimatedTime: {
    fontSize: 10,
    fontWeight: '700',
    color: '#000',
    marginTop: -2,
    left:-8
  },
  trackButton: {
    backgroundColor: '#7B3F1D', // Marron exact de l'image
    paddingHorizontal: 9,
    paddingVertical: 12,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackButtonText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
});