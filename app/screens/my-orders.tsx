import OrderService from '@/services/OrderService';
import { Order, OrderItem } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;

export default function MyOrdersScreen() {
  // ... rest of the code remains the same ...
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const userOrders = await OrderService.getUserOrders('current_user');
      setOrders(userOrders);
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'en-cours': return '#FF9500';
      case 'livrée': return '#34C759';
      case 'annulée': return '#FF3B30';
      default: return '#666';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'en-cours': return 'En cours';
      case 'livrée': return 'Livrée';
      case 'annulée': return 'Annulée';
      default: return status;
    }
  };

  const handleOrderPress = (order: Order) => {
    if (order.status === 'en-cours') {
      // Rediriger vers la page de suivi si la commande est en cours
      router.push('/screens/order-track');
    } else {
      // Afficher les détails de la commande livrée
      console.log('Détails de la commande:', order);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconPadding}>
            <Ionicons name="arrow-back" size={24} color="#333333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mes Commandes</Text>
          <View style={styles.iconPadding} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconPadding}>
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes Commandes</Text>
        <View style={styles.iconPadding} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {orders.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={60} color="#CCC" />
            <Text style={styles.emptyTitle}>Aucune commande</Text>
            <Text style={styles.emptySubtitle}>Vous n'avez pas encore passé de commande</Text>
            <TouchableOpacity 
              style={styles.orderButton}
              onPress={() => router.push('/home')}
            >
              <Text style={styles.orderButtonText}>Commander maintenant</Text>
            </TouchableOpacity>
          </View>
        ) : (
          orders.map((order) => (
            <TouchableOpacity 
              key={order.id} 
              style={styles.orderCard}
              onPress={() => handleOrderPress(order)}
              activeOpacity={0.8}
            >
              {/* Header de la commande */}
              <View style={styles.orderHeader}>
                <View style={styles.restaurantInfo}>
                  <Image source={{ uri: order.restaurantImage }} style={styles.restaurantImage} />
                  <View style={styles.restaurantDetails}>
                    <Text style={styles.restaurantName}>{order.restaurantName}</Text>
                    <Text style={styles.orderDate}>{order.date} • {order.time}</Text>
                  </View>
                </View>
                <View style={styles.statusContainer}>
                  <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                    {getStatusText(order.status)}
                  </Text>
                </View>
              </View>

              {/* Articles de la commande */}
              <View style={styles.itemsContainer}>
                {order.items.slice(0, 2).map((item: OrderItem) => (
                  <View key={item.id} style={styles.itemRow}>
                    <Text style={styles.itemQuantity}>{item.quantity}x</Text>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>{OrderService.formatAmount(item.price)}</Text>
                  </View>
                ))}
                {order.items.length > 2 && (
                  <Text style={styles.moreItemsText}>+{order.items.length - 2} autres articles</Text>
                )}
              </View>

              {/* Footer de la commande */}
              <View style={styles.orderFooter}>
                <Text style={styles.orderId}>Commande {order.id}</Text>
                <View style={styles.totalContainer}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalAmount}>{order.totalAmount}</Text>
                </View>
              </View>

              {/* Temps estimé pour les commandes en cours */}
              {order.status === 'en-cours' && order.estimatedTime && (
                <View style={styles.estimatedTimeContainer}>
                  <Ionicons name="time-outline" size={16} color="#FF9500" />
                  <Text style={styles.estimatedTimeText}>Livraison estimée: {order.estimatedTime}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        )}
        
      </ScrollView>
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
    paddingVertical: 12,
    marginTop: 0,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#333333' },
  iconPadding: { padding: 5 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 30 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  
  // Empty state
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  orderButton: {
    backgroundColor: '#8B4513',
    paddingHorizontal: isSmallScreen ? 20 : 30,
    paddingVertical: isSmallScreen ? 12 : 15,
    borderRadius: isSmallScreen ? 20 : 25,
  },
  orderButtonText: {
    color: '#FFF',
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: '600',
  },

  // Order cards
  orderCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  restaurantInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  restaurantImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 12,
  },
  restaurantDetails: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: '#666',
  },
  statusContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  
  // Items
  itemsContainer: {
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemQuantity: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8B4513',
    width: 25,
  },
  itemName: {
    fontSize: 13,
    color: '#444',
    flex: 1,
  },
  itemPrice: {
    fontSize: 13,
    color: '#666',
  },
  moreItemsText: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 4,
  },
  
  // Footer
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  orderId: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  totalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  
  // Estimated time
  estimatedTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#FFF5F0',
  },
  estimatedTimeText: {
    fontSize: 12,
    color: '#FF9500',
    marginLeft: 6,
    fontWeight: '500',
  },
});
