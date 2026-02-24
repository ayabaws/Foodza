import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity, StatusBar, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface CartItem {
  id: string;
  name: string;
  image: any;
  price: number;
  quantity: number;
  size?: string;
  extras?: string[];
  restaurant: string;
}

interface RecommendedItem {
  id: string;
  name: string;
  image: any;
  price: number;
  rating: number;
  restaurant: string;
}

export default function OrderScreen() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Pizza Margherita',
      image: require('@/assets/food/food2.jpeg'),
      price: 4500,
      quantity: 1,
      size: 'Moyenne',
      extras: ['Fromage'],
      restaurant: 'La Brioche Dorée',
    },
    {
      id: '2',
      name: 'Croissant au beurre',
      image: require('@/assets/food/food2.jpeg'),
      price: 800,
      quantity: 2,
      restaurant: 'Boulangerie Paris',
    },
  ]);

  const [couponCode, setCouponCode] = useState('');
  const [showCouponInput, setShowCouponInput] = useState(false);

  const recommendedItems: RecommendedItem[] = [
    {
      id: '1',
      name: 'Salade César',
      image: require('@/assets/food/food2.jpeg'),
      price: 2500,
      rating: 4.5,
      restaurant: 'La Brioche Dorée',
    },
    {
      id: '2',
      name: 'Jus d\'orange',
      image: require('@/assets/food/food2.jpeg'),
      price: 1200,
      rating: 4.3,
      restaurant: 'Boulangerie Paris',
    },
    {
      id: '3',
      name: 'Frites',
      image: require('@/assets/food/food2.jpeg'),
      price: 1500,
      rating: 4.6,
      restaurant: 'Fast Food King',
    },
  ];

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== itemId));
    } else {
      setCartItems(cartItems.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateDeliveryFee = () => {
    return 500; // Fixed delivery fee
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateDeliveryFee();
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={item.image} style={styles.cartItemImage} />
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemName}>{item.name}</Text>
        <Text style={styles.cartItemRestaurant}>{item.restaurant}</Text>
        {item.size && (
          <Text style={styles.cartItemSize}>Taille: {item.size}</Text>
        )}
        {item.extras && item.extras.length > 0 && (
          <Text style={styles.cartItemExtras}>
            Extras: {item.extras.join(', ')}
          </Text>
        )}
        <Text style={styles.cartItemPrice}>{item.price} CFA</Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, item.quantity - 1)}
        >
          <Ionicons name="remove" size={18} color="#2C1810" />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity 
          style={styles.quantityButton}
          onPress={() => updateQuantity(item.id, item.quantity + 1)}
        >
          <Ionicons name="add" size={18} color="#2C1810" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRecommendedItem = ({ item }: { item: RecommendedItem }) => (
    <TouchableOpacity style={styles.recommendedItem}>
      <Image source={item.image} style={styles.recommendedItemImage} />
      <View style={styles.recommendedItemInfo}>
        <Text style={styles.recommendedItemName}>{item.name}</Text>
        <Text style={styles.recommendedItemRestaurant}>{item.restaurant}</Text>
        <View style={styles.recommendedItemRating}>
          <Ionicons name="star" size={14} color="#FFA500" />
          <Text style={styles.recommendedItemRatingText}>{item.rating}</Text>
        </View>
        <Text style={styles.recommendedItemPrice}>{item.price} CFA</Text>
      </View>
      <TouchableOpacity style={styles.addRecommendedButton}>
        <Ionicons name="add" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#2C1810" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Panier</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="trash-outline" size={24} color="#2C1810" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cart Items */}
        <View style={styles.cartSection}>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Coupon Section */}
        <View style={styles.couponSection}>
          <TouchableOpacity 
            style={styles.couponButton}
            onPress={() => setShowCouponInput(!showCouponInput)}
          >
            <Ionicons name="ticket" size={20} color="#4CAF50" />
            <Text style={styles.couponButtonText}>Ajouter un coupon</Text>
            <Ionicons 
              name={showCouponInput ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#2C1810" 
            />
          </TouchableOpacity>
          
          {showCouponInput && (
            <View style={styles.couponInputContainer}>
              <TextInput
                style={styles.couponInput}
                placeholder="Code du coupon"
                value={couponCode}
                onChangeText={setCouponCode}
                placeholderTextColor="#999"
              />
              <TouchableOpacity style={styles.applyCouponButton}>
                <Text style={styles.applyCouponButtonText}>Appliquer</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Delivery Address */}
        <View style={styles.addressSection}>
          <TouchableOpacity style={styles.addressButton}>
            <View style={styles.addressIcon}>
              <Ionicons name="location" size={20} color="#4CAF50" />
            </View>
            <View style={styles.addressInfo}>
              <Text style={styles.addressLabel}>Adresse de livraison</Text>
              <Text style={styles.addressText}>Kalaban-coro, Bamako</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Payment Method */}
        <View style={styles.paymentSection}>
          <TouchableOpacity style={styles.paymentButton}>
            <View style={styles.paymentIcon}>
              <Ionicons name="card" size={20} color="#4CAF50" />
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentLabel}>Moyen de paiement</Text>
              <Text style={styles.paymentText}>Carte bancaire</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Recommended Items */}
        <View style={styles.recommendedSection}>
          <Text style={styles.sectionTitle}>Completer votre repas avec</Text>
          <FlatList
            data={recommendedItems}
            renderItem={renderRecommendedItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.recommendedList}
          />
        </View>
      </ScrollView>

      {/* Bottom Order Summary */}
      <View style={styles.bottomSummary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Sous-total</Text>
          <Text style={styles.summaryValue}>{calculateSubtotal()} CFA</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Frais de livraison</Text>
          <Text style={styles.summaryValue}>{calculateDeliveryFee()} CFA</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{calculateTotal()} CFA</Text>
        </View>
        <TouchableOpacity style={styles.orderButton}>
          <Text style={styles.orderButtonText}>Commander</Text>
        </TouchableOpacity>
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
  cartSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cartItemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  cartItemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 4,
  },
  cartItemRestaurant: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  cartItemSize: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  cartItemExtras: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 100,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  couponSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  couponButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 15,
  },
  couponButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#2C1810',
    marginLeft: 10,
  },
  couponInputContainer: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  couponInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  applyCouponButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  applyCouponButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  addressSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  addressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 15,
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
  addressInfo: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 16,
    color: '#2C1810',
    fontWeight: '500',
  },
  paymentSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  paymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 15,
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
  paymentInfo: {
    flex: 1,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  paymentText: {
    fontSize: 16,
    color: '#2C1810',
    fontWeight: '500',
  },
  recommendedSection: {
    marginBottom: 200,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  recommendedList: {
    paddingHorizontal: 20,
  },
  recommendedItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recommendedItemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  recommendedItemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  recommendedItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 4,
  },
  recommendedItemRestaurant: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  recommendedItemRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  recommendedItemRatingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  recommendedItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  addRecommendedButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  bottomSummary: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    color: '#2C1810',
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  orderButton: {
    backgroundColor: '#2C1810',
    paddingVertical: 18,
    borderRadius: 25,
    alignItems: 'center',
  },
  orderButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
