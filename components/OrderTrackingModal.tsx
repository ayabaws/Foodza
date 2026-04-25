import { useOrder } from '@/contexts/OrderContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function OrderTrackingModal() {
  const router = useRouter();
  const pathname = usePathname();
  const { isOrderActive, orderData } = useOrder();

  // États combinés pour éviter les problèmes de hooks
  const [state, setState] = React.useState({
    hasRecentOrder: false,
    displayOrderData: {
      restaurantName: 'Restaurant',
      estimatedTime: '30-40 mins',
      items: [] as Array<{ id: string; name: string; image: string }>
    }
  });

  // Effet unique pour gérer toutes les mises à jour
  React.useEffect(() => {
    const updateState = async () => {
      try {
        // Vérifier les commandes récentes
        const orders = await AsyncStorage.getItem('foodza_orders');
        console.log('Orders from storage:', orders);
        
        let hasRecent = false;
        let orderData = state.displayOrderData;
        
        if (orders) {
          const parsedOrders = JSON.parse(orders);
          console.log('Parsed orders count:', parsedOrders.length);
          hasRecent = parsedOrders.length > 0;
          
          // Charger la dernière commande si pas de commande active
          if (!orderData && parsedOrders.length > 0) {
            const lastOrder = parsedOrders[parsedOrders.length - 1];
            orderData = {
              restaurantName: lastOrder.restaurantName,
              estimatedTime: lastOrder.estimatedTime || '30-40 mins',
              items: lastOrder.items || []
            };
          }
        } else {
        }

        // Utiliser la commande active si disponible
        if (orderData) {
          orderData = orderData;
        }

        setState({
          hasRecentOrder: hasRecent,
          displayOrderData: orderData
        });
        
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    updateState();
  }, [pathname, isOrderActive, orderData]);

  // Afficher le modal si on est sur la page d'accueil ET (commande active uniquement)
  const shouldShowModal = (pathname === '/' || pathname === '/home') && isOrderActive;

  if (!shouldShowModal) {
    return null;
  }

  const handleTrackOrder = () => {
    router.push('/screens/order-track');
  };

  return (
    <View style={styles.container}>
      <View style={styles.modalContent}>
        {/* Images de plats prédéfinies */}
        <View style={styles.imagesContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200' }}
            style={styles.itemImage}
          />
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1571091716759-7b04365d6d1b?w=200' }}
            style={[styles.itemImage, { marginLeft: -18 }]} // Effet de chevauchement
          />
        </View>

        {/* Informations de la commande */}
        <View style={styles.orderInfo}>
          <Text style={styles.restaurantName} numberOfLines={1}>
            {state.displayOrderData.restaurantName}
          </Text>
          <Text style={styles.estimatedTime}>
            {state.displayOrderData.estimatedTime}
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
    bottom: 120,
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
    paddingHorizontal: 6,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackButtonText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '600',
  },
});