import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, FlatList, Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const isMediumScreen = screenWidth >= 375 && screenWidth < 414;
const isLargeScreen = screenWidth >= 414;
const isTablet = screenWidth > 768;

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
  const { colors, isDarkMode } = useTheme();
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

  // Styles dynamiques qui dépendent du thème
  const dynamicStyles = {
    cartItem: {
      flexDirection: 'row' as const,
      backgroundColor: colors.surface,
      borderRadius: 15,
      padding: 15,
      marginBottom: 15,
      shadowColor: colors.shadow.dark,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    quantityButton: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: colors.surface,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
    couponButton: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: colors.surface,
      borderRadius: 10,
      padding: 15,
    },
    couponInput: {
      flex: 1,
      backgroundColor: colors.background,
      borderRadius: 8,
      paddingHorizontal: 15,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: colors.border.medium,
    },
    addressButton: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: colors.surface,
      borderRadius: 10,
      padding: 15,
    },
    paymentButton: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: colors.surface,
      borderRadius: 10,
      padding: 15,
    },
    recommendedItem: {
      flexDirection: 'row' as const,
      backgroundColor: colors.surface,
      borderRadius: 15,
      padding: 15,
      marginBottom: 15,
      shadowColor: colors.shadow.dark,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={[styles.cartItem, dynamicStyles.cartItem]}>
      <Image source={item.image} style={styles.cartItemImage} />
      <View style={styles.cartItemInfo}>
        <Text style={[styles.cartItemName, { color: colors.text.primary }]}>{item.name}</Text>
        <Text style={[styles.cartItemRestaurant, { color: colors.text.secondary }]}>{item.restaurant}</Text>
        {item.size && (
          <Text style={[styles.cartItemSize, { color: colors.text.tertiary }]}>Taille: {item.size}</Text>
        )}
        {item.extras && item.extras.length > 0 && (
          <Text style={[styles.cartItemExtras, { color: colors.text.tertiary }]}>
            Extras: {item.extras.join(', ')}
          </Text>
        )}
        <Text style={[styles.cartItemPrice, { color: colors.secondary }]}>{item.price} CFA</Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity 
          style={[styles.quantityButton, dynamicStyles.quantityButton]}
          onPress={() => updateQuantity(item.id, item.quantity - 1)}
        >
          <Ionicons name="remove" size={18} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.quantityText, { color: colors.text.primary }]}>{item.quantity}</Text>
        <TouchableOpacity 
          style={[styles.quantityButton, dynamicStyles.quantityButton]}
          onPress={() => updateQuantity(item.id, item.quantity + 1)}
        >
          <Ionicons name="add" size={18} color={colors.text.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderRecommendedItem = ({ item }: { item: RecommendedItem }) => (
    <TouchableOpacity style={[styles.recommendedItem, dynamicStyles.recommendedItem]}>
      <Image source={item.image} style={styles.recommendedItemImage} />
      <View style={styles.recommendedItemInfo}>
        <Text style={[styles.recommendedItemName, { color: colors.text.primary }]}>{item.name}</Text>
        <Text style={[styles.recommendedItemRestaurant, { color: colors.text.secondary }]}>{item.restaurant}</Text>
        <View style={styles.recommendedItemRating}>
          <Ionicons name="star" size={14} color="#FFA500" />
          <Text style={[styles.recommendedItemRatingText, { color: colors.text.secondary }]}>{item.rating}</Text>
        </View>
        <Text style={[styles.recommendedItemPrice, { color: colors.secondary }]}>{item.price} CFA</Text>
      </View>
      <TouchableOpacity style={[styles.addRecommendedButton, { backgroundColor: colors.primary }]}>
        <Ionicons name="add" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Panier</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="trash-outline" size={24} color={colors.text.primary} />
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
    paddingHorizontal: isSmallScreen ? 16 : isTablet ? 32 : 20,
    paddingVertical: isSmallScreen ? 12 : 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: isSmallScreen ? 18 : isTablet ? 22 : 20,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  cartSection: {
    paddingHorizontal: isSmallScreen ? 16 : isTablet ? 32 : 20,
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
    width: isSmallScreen ? 70 : 80,
    height: isSmallScreen ? 70 : 80,
    borderRadius: 10,
    marginRight: 15,
  },
  cartItemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  cartItemName: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 4,
  },
  cartItemRestaurant: {
    fontSize: isSmallScreen ? 12 : 14,
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
    fontSize: isSmallScreen ? 14 : 16,
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
    width: isSmallScreen ? 28 : 30,
    height: isSmallScreen ? 28 : 30,
    borderRadius: isSmallScreen ? 14 : 15,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  couponSection: {
    marginHorizontal: isSmallScreen ? 16 : isTablet ? 32 : 20,
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
    fontSize: isSmallScreen ? 14 : 16,
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
    marginHorizontal: isSmallScreen ? 16 : isTablet ? 32 : 20,
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
    width: isSmallScreen ? 35 : 40,
    height: isSmallScreen ? 35 : 40,
    borderRadius: isSmallScreen ? 17.5 : 20,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  addressInfo: {
    flex: 1,
  },
  addressLabel: {
    fontSize: isSmallScreen ? 12 : 14,
    color: '#666',
    marginBottom: 4,
  },
  addressText: {
    fontSize: isSmallScreen ? 14 : 16,
    color: '#2C1810',
    fontWeight: '500',
  },
  paymentSection: {
    marginHorizontal: isSmallScreen ? 16 : isTablet ? 32 : 20,
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
    width: isSmallScreen ? 35 : 40,
    height: isSmallScreen ? 35 : 40,
    borderRadius: isSmallScreen ? 17.5 : 20,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentLabel: {
    fontSize: isSmallScreen ? 12 : 14,
    color: '#666',
    marginBottom: 4,
  },
  paymentText: {
    fontSize: isSmallScreen ? 14 : 16,
    color: '#2C1810',
    fontWeight: '500',
  },
  recommendedSection: {
    marginBottom: 200,
  },
  sectionTitle: {
    fontSize: isSmallScreen ? 18 : isTablet ? 22 : 20,
    fontWeight: 'bold',
    color: '#2C1810',
    marginHorizontal: isSmallScreen ? 16 : isTablet ? 32 : 20,
    marginBottom: 15,
  },
  recommendedList: {
    paddingHorizontal: isSmallScreen ? 16 : isTablet ? 32 : 20,
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
    width: isSmallScreen ? 50 : 60,
    height: isSmallScreen ? 50 : 60,
    borderRadius: 10,
    marginRight: 15,
  },
  recommendedItemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  recommendedItemName: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 4,
  },
  recommendedItemRestaurant: {
    fontSize: isSmallScreen ? 12 : 14,
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
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  addRecommendedButton: {
    width: isSmallScreen ? 35 : 40,
    height: isSmallScreen ? 35 : 40,
    borderRadius: isSmallScreen ? 17.5 : 20,
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
    paddingHorizontal: isSmallScreen ? 16 : isTablet ? 32 : 20,
    paddingVertical: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: isSmallScreen ? 14 : 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: isSmallScreen ? 14 : 16,
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
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  totalValue: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  orderButton: {
    backgroundColor: '#2C1810',
    paddingVertical: isSmallScreen ? 15 : 18,
    borderRadius: 25,
    alignItems: 'center',
  },
  orderButtonText: {
    color: '#FFFFFF',
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: 'bold',
  },
});
