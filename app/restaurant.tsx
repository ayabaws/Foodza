import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface Restaurant {
  id: string;
  name: string;
  image: any;
  rating: number;
  deliveryTime: string;
  distance: string;
  location: string;
  discount?: string;
  discountCode?: string;
}

interface MenuItem {
  id: string;
  name: string;
  image: any;
  price: number;
  rating?: number;
  description?: string;
}

export default function RestaurantScreen() {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('Moyenne');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [showCustomization, setShowCustomization] = useState(false);

  const restaurant: Restaurant = {
    id: '1',
    name: 'La Brioche Dorée',
    image: require('@/assets/food/food2.jpeg'),
    rating: 4.7,
    deliveryTime: '25 - 30 mins',
    distance: '5 km',
    location: 'Badalabougou, Bamako',
    discount: '-30% sur tout',
    discountCode: 'FOOD20',
  };

  const popularItems: MenuItem[] = [
    {
      id: '1',
      name: 'Pizza Margherita',
      image: require('@/assets/food/food2.jpeg'),
      price: 4500,
      rating: 4.8,
      description: 'Sauce tomate, mozzarella fraîche, basilic',
    },
    {
      id: '2',
      name: 'Pizza Pepperoni',
      image: require('@/assets/food/food2.jpeg'),
      price: 5500,
      rating: 4.6,
      description: 'Sauce tomate, mozzarella, pepperoni épicé',
    },
    {
      id: '3',
      name: 'Croissant au beurre',
      image: require('@/assets/food/food2.jpeg'),
      price: 800,
      rating: 4.5,
      description: 'Beurre français, feuilletage croustillant',
    },
  ];

  const sizes = [
    { name: 'Petits', price: 2500 },
    { name: 'Moyenne', price: 4500 },
    { name: 'Grande', price: 6000 },
  ];

  const extras = [
    { name: 'Fromage', price: 250 },
    { name: 'Mayonnaise', price: 50 },
    { name: 'Sauce pimentée', price: 100 },
    { name: 'Olives', price: 150 },
  ];

  const toggleExtra = (extraName: string) => {
    setSelectedExtras(prev => 
      prev.includes(extraName) 
        ? prev.filter(item => item !== extraName)
        : [...prev, extraName]
    );
  };

  const calculateTotalPrice = () => {
    const basePrice = sizes.find(size => size.name === selectedSize)?.price || 4500;
    const extrasPrice = selectedExtras.reduce((total, extraName) => {
      const extra = extras.find(extra => extra.name === extraName);
      return total + (extra?.price || 0);
    }, 0);
    return (basePrice + extrasPrice) * quantity;
  };

  const renderPopularItem = (item: MenuItem) => (
    <TouchableOpacity 
      style={styles.popularItem}
      onPress={() => setShowCustomization(true)}
    >
      <View style={styles.popularItemImagePlaceholder}>
        <Ionicons name="restaurant" size={30} color="#FFFFFF" />
      </View>
      <View style={styles.popularItemInfo}>
        <Text style={styles.popularItemName}>{item.name}</Text>
        {item.rating && (
          <View style={styles.popularItemRating}>
            <Ionicons name="star" size={14} color="#FFA500" />
            <Text style={styles.popularItemRatingText}>{item.rating}</Text>
          </View>
        )}
        <Text style={styles.popularItemPrice}>{item.price} CFA</Text>
      </View>
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
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="search" size={24} color="#2C1810" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="share-outline" size={24} color="#2C1810" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="heart-outline" size={24} color="#2C1810" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image source={restaurant.image} style={styles.heroImage} />
        </View>

        {/* Restaurant Info Card */}
        <View style={styles.restaurantInfoCard}>
          <View style={styles.restaurantHeader}>
            <View style={styles.restaurantLogo}>
              <Text style={styles.restaurantLogoText}>NOIR</Text>
            </View>
            <View style={styles.restaurantDetails}>
              <Text style={styles.restaurantName}>{restaurant.name}</Text>
              <View style={styles.restaurantLocation}>
                <Ionicons name="location" size={16} color="#666" />
                <Text style={styles.restaurantLocationText}>{restaurant.location}</Text>
              </View>
              <View style={styles.restaurantMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="time" size={16} color="#4CAF50" />
                  <Text style={styles.metaText}>{restaurant.deliveryTime}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="bicycle" size={16} color="#4CAF50" />
                  <Text style={styles.metaText}>{restaurant.distance}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="star" size={16} color="#FFA500" />
                  <Text style={styles.metaText}>{restaurant.rating}</Text>
                </View>
              </View>
            </View>
          </View>
          
          {restaurant.discount && (
            <View style={styles.discountBanner}>
              <Text style={styles.discountText}>{restaurant.discount}</Text>
              <Text style={styles.discountCode}>Utiliser le code {restaurant.discountCode}</Text>
            </View>
          )}
        </View>

        {/* Popular Items */}
        <View style={styles.popularContainer}>
          <Text style={styles.sectionTitle}>Les Plus Populaires</Text>
          <View style={styles.popularList}>
            {popularItems.map(renderPopularItem)}
          </View>
        </View>
      </ScrollView>

      {/* Customization Modal */}
      {showCustomization && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowCustomization(false)}
              >
                <Ionicons name="close" size={24} color="#2C1810" />
              </TouchableOpacity>
            </View>

            {/* Item Details */}
            <View style={styles.itemDetails}>
              <View style={styles.itemImagePlaceholder}>
                <Ionicons name="pizza" size={40} color="#FFFFFF" />
              </View>
              <Text style={styles.itemName}>Pizza Margherita</Text>
              <Text style={styles.itemPrice}>{calculateTotalPrice()} CFA</Text>
              <Text style={styles.itemDescription}>
                Sauce tomate, mozzarella fraîche, basilic
              </Text>
            </View>

            {/* Size Selection */}
            <View style={styles.sizeSection}>
              <Text style={styles.sectionTitle}>Choisir la taille</Text>
              <View style={styles.sizeOptions}>
                {sizes.map((size) => (
                  <TouchableOpacity
                    key={size.name}
                    style={[
                      styles.sizeOption,
                      selectedSize === size.name && styles.sizeOptionSelected
                    ]}
                    onPress={() => setSelectedSize(size.name)}
                  >
                    <Text style={[
                      styles.sizeOptionText,
                      selectedSize === size.name && styles.sizeOptionTextSelected
                    ]}>
                      {size.name} ({size.price} CFA)
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Extras */}
            <View style={styles.extrasSection}>
              <Text style={styles.sectionTitle}>Options supplémentaires</Text>
              {extras.map((extra) => (
                <TouchableOpacity
                  key={extra.name}
                  style={styles.extraOption}
                  onPress={() => toggleExtra(extra.name)}
                >
                  <View style={[
                    styles.checkbox,
                    selectedExtras.includes(extra.name) && styles.checkboxSelected
                  ]}>
                    {selectedExtras.includes(extra.name) && (
                      <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                    )}
                  </View>
                  <Text style={styles.extraOptionText}>{extra.name}</Text>
                  <Text style={styles.extraPrice}>+{extra.price} CFA</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Special Instructions */}
            <View style={styles.instructionsSection}>
              <Text style={styles.sectionTitle}>Instructions special</Text>
              <TextInput
                style={styles.instructionsInput}
                placeholder="Ex: Pas de piment"
                value={specialInstructions}
                onChangeText={setSpecialInstructions}
                multiline
              />
            </View>

            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
              <View style={styles.quantitySelector}>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Ionicons name="remove" size={20} color="#2C1810" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantity}</Text>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => setQuantity(quantity + 1)}
                >
                  <Ionicons name="add" size={20} color="#2C1810" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>
                  Ajouter un article {calculateTotalPrice()} CFA
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
  },
  headerButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
  },
  heroContainer: {
    height: 250,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  restaurantInfoCard: {
    margin: 20,
    backgroundColor: '#FFFFFF',
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
  restaurantHeader: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  restaurantLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2C1810',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  restaurantLogoText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  restaurantDetails: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 5,
  },
  restaurantLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  restaurantLocationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  restaurantMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  discountBanner: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 12,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  discountCode: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  popularContainer: {
    marginBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  popularList: {
    paddingHorizontal: 20,
  },
  popularItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  popularItemImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#2C1810',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  popularItemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  popularItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 5,
  },
  popularItemRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  popularItemRatingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  popularItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    paddingBottom: 10,
  },
  closeButton: {
    padding: 5,
  },
  itemDetails: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  itemImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 15,
    backgroundColor: '#2C1810',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  sizeSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sizeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sizeOption: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  sizeOptionSelected: {
    backgroundColor: '#2C1810',
  },
  sizeOptionText: {
    fontSize: 14,
    color: '#2C1810',
    textAlign: 'center',
  },
  sizeOptionTextSelected: {
    color: '#FFFFFF',
  },
  extrasSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  extraOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  checkboxSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  extraOptionText: {
    flex: 1,
    fontSize: 16,
    color: '#2C1810',
  },
  extraPrice: {
    fontSize: 14,
    color: '#666',
  },
  instructionsSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  instructionsInput: {
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: '#2C1810',
    minHeight: 60,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
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
    marginHorizontal: 15,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#2C1810',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
