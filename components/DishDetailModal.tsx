import React, { useEffect, useRef, useState } from 'react';

import { Animated, Dimensions, Image, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';

import { useFavorites } from '@/contexts/FavoritesContext';


const { width: screenWidth } = Dimensions.get('window');
const isSmallScreen = screenWidth < 380;

interface Size {

  name: string;

  price: number;

}

interface Extra {

  name: string;

  price: number;

}

interface Dish {

  id: string;

  name: string;

  image: any;

  price: number;

  description: string;

}

interface DishDetailModalProps {

  visible: boolean;

  dish: Dish | null;

  onClose: () => void;

}

export default function DishDetailModal({ visible, dish, onClose }: DishDetailModalProps) {

  const { toggleFavorite, isFavorite } = useFavorites();

  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;

  const [selectedSize, setSelectedSize] = useState<Size>({ name: 'Moyenne', price: 4500 });

  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([]);

  const [quantity, setQuantity] = useState(1);

  const [specialInstructions, setSpecialInstructions] = useState('');

  const sizes: Size[] = [

    { name: 'Petite', price: 2500 },

    { name: 'Moyenne', price: 4500 },

    { name: 'Grande', price: 6000 }

  ];

  const extras: Extra[] = [

    { name: 'Fromage', price: 250 },

    { name: 'Mayonnaise', price: 100 },

  ];

  useEffect(() => {

    if (visible && dish) {

      Animated.timing(slideAnim, {

        toValue: 0,

        duration: 350,

        useNativeDriver: true,

      }).start();

    } else {

      slideAnim.setValue(Dimensions.get('window').height);

    }

  }, [visible, dish]);

  const calculateTotal = () => {

    if (!dish) return 0;

    const extrasPrice = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);

    return (selectedSize.price + extrasPrice) * quantity;

  };

  const toggleExtra = (extra: Extra) => {

    setSelectedExtras(prev =>

      prev.some(e => e.name === extra.name)

        ? prev.filter(e => e.name !== extra.name)

        : [...prev, extra]

    );

  };

  if (!dish) return null;

  return (

    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>

      <View style={styles.modalOverlay}>

        <TouchableOpacity style={styles.floatingCloseButton} onPress={onClose}>

          <Ionicons name="close" size={28} color="#FFF" />

        </TouchableOpacity>

        <Animated.View style={[styles.modalContent, { transform: [{ translateY: slideAnim }] }]}>

          <SafeAreaView style={styles.whiteCardContainer} edges={['bottom', 'left', 'right']}>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

              <View style={styles.headerInfo}>

                <View style={styles.headerTopRow}>

                  <Image source={dish.image} style={styles.dishImageCircle} />

                  <View style={styles.dishTextContainer}>

                    <Text style={styles.dishName}>{dish.name}</Text>

                    <Text style={styles.dishPriceMain}>{dish.price} CFA</Text>

                    <Text style={styles.dishDescriptionText}>{dish.description}</Text>

                  </View>

                  <View style={styles.headerActions}>

                    <TouchableOpacity onPress={() => toggleFavorite(dish)}>

                      <Ionicons

                        name={isFavorite(dish.id) ? "heart" : "heart-outline"}

                        size={24}

                        color={isFavorite(dish.id) ? "#FF4444" : "#333"}

                      />

                    </TouchableOpacity>

                    <TouchableOpacity style={{ marginLeft: 15 }}>

                      <Ionicons name="share-social-outline" size={24} color="#333" />

                    </TouchableOpacity>

                  </View>

                </View>

              </View>

              <View style={styles.section}>

                <Text style={styles.sectionTitle}>Choisir la taille</Text>

                <View style={styles.sizeOptionsContainer}>

                  {sizes.map((size) => (

                    <TouchableOpacity

                      key={size.name}

                      style={[styles.sizeCard, selectedSize.name === size.name && styles.sizeCardSelected]}

                      onPress={() => setSelectedSize(size)}

                    >

                      <Text style={[styles.sizeCardLabel, selectedSize.name === size.name && styles.sizeCardLabelSelected]}>{size.name}</Text>

                      <Text style={[styles.sizeCardPrice, selectedSize.name === size.name && styles.sizeCardPriceSelected]}>{size.price} CFA</Text>

                    </TouchableOpacity>

                  ))}

                </View>

              </View>

              <View style={styles.optionsWrapper}>

                <Text style={styles.sectionTitle}>Options supplémentaires :</Text>

                {extras.map((extra) => (

                  <TouchableOpacity key={extra.name} style={styles.extraRow} onPress={() => toggleExtra(extra)}>

                    <Text style={styles.extraLabel}>{extra.name}</Text>

                    <View style={styles.extraRightSide}>

                      <Text style={styles.extraPriceText}>+ {extra.price} CFA</Text>

                      <View style={[styles.customCheckbox, selectedExtras.some(e => e.name === extra.name) && styles.customCheckboxSelected]}>

                        {selectedExtras.some(e => e.name === extra.name) && <Ionicons name="checkmark" size={14} color="#FFF" />}

                      </View>

                    </View>

                  </TouchableOpacity>

                ))}

                <Text style={[styles.sectionTitle, { marginTop: 15 }]}>Instructions special</Text>

                <TextInput

                  style={styles.instructionsBox}

                  placeholder="Ex: Pas de piment"

                  multiline

                  value={specialInstructions}

                  onChangeText={setSpecialInstructions}

                />

              </View>

            </ScrollView>

          </SafeAreaView>

          <View style={styles.blackFooterArea}>

            <View style={styles.qtyContainer}>

              <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))}>

                <Text style={styles.qtyBtn}>-</Text>

              </TouchableOpacity>

              <Text style={styles.qtyVal}>{quantity}</Text>

              <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>

                <Text style={styles.qtyBtn}>+</Text>

              </TouchableOpacity>

            </View>

            <TouchableOpacity style={styles.addMainButton} onPress={onClose}>

              <Text style={styles.addBtnLabel}>Ajouter un article</Text>

              <Text style={styles.addBtnPrice}>{calculateTotal()} CFA</Text>

            </TouchableOpacity>

          </View>

        </Animated.View>

      </View>

    </Modal>

  );

}

const styles = StyleSheet.create({

  modalOverlay: {

    flex: 1,

    backgroundColor: 'rgba(0, 0, 0, 0.6)',

    justifyContent: 'flex-end',

  },

  floatingCloseButton: {

    alignSelf: 'center',

    marginBottom: 20,

    backgroundColor: '#000000a8',

    borderRadius: 30,

    padding: 10,

  },

  modalContent: {

    backgroundColor: '#fff',

    borderTopLeftRadius: 40,

    borderTopRightRadius: 40,

    height: '85%',

    overflow: 'hidden',

  },

  whiteCardContainer: {

    flex: 1,

    backgroundColor: '#F8F9FA', // LA COUCHE BLANCHE

    borderTopLeftRadius: 40,

    borderTopRightRadius: 40,

    borderBottomLeftRadius: 40, // Arrondi bas gauche

    borderBottomRightRadius: 40, // Arrondi bas droit

    overflow: 'hidden',

  },

  scrollContent: {

    paddingBottom: 30,

  },

  headerInfo: {

    backgroundColor: '#FFF',

    padding: 20,

    borderBottomLeftRadius: 30,

    borderBottomRightRadius: 30,

  },

  headerTopRow: {

    flexDirection: 'row',

    alignItems: 'center',

  },

  dishImageCircle: {

    width: 60,

    height: 60,

    borderRadius: 30,

  },

  dishTextContainer: {

    flex: 1,

    marginLeft: 15,

  },

  dishName: {

    fontSize: isSmallScreen ? 16 : 18,

    fontWeight: '700',

    color: '#1A1A1A',

  },

  dishPriceMain: {

    fontSize: isSmallScreen ? 11 : 13,

    fontWeight: '700',

    color: '#333',

    marginTop: 3,

  },

  dishDescriptionText: {

    fontSize: isSmallScreen ? 10 : 12,

    color: '#666',

    marginTop: 6,

    lineHeight: isSmallScreen ? 18 : 20,

  },

  headerActions: {

    top: -35,

    flexDirection: 'row',

  },

  section: {

    padding: 25,

  },

  sectionTitle: {

    fontSize: isSmallScreen ? 12 : 14,

    fontWeight: '600',

    color: '#1A1A1A',

    marginBottom: 15,

  },

  sizeOptionsContainer: {

    flexDirection: 'row',

    justifyContent: 'space-between',

  },

  sizeCard: {

    width: '31%',

    backgroundColor: '#FFF',

    paddingVertical: 18,

    borderRadius: 20,

    alignItems: 'center',

    borderWidth: 1,

    borderColor: '#EEE',

  },

  sizeCardSelected: {

    borderColor: '#8c3e22',

  },

  sizeCardLabel: {

    fontSize: isSmallScreen ? 9 : 11,

    color: '#888',

    fontWeight: '600',

  },

  sizeCardLabelSelected: {

    color: '#333',

  },

  sizeCardPrice: {

    fontSize: isSmallScreen ? 11 : 13,

    fontWeight: '600',

    color: '#333',

    marginTop: 8,

  },

  sizeCardPriceSelected: {

    color: '#000',

  },

  optionsWrapper: {

    backgroundColor: '#FFF',

    marginHorizontal: 20,

    padding: 20,

    borderRadius: 30,

  },

  extraRow: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    paddingVertical: 12,

  },

  extraLabel: {

    fontSize: isSmallScreen ? 13 : 15,

    color: '#444',

  },

  extraRightSide: {

    flexDirection: 'row',

    alignItems: 'center',

  },

  extraPriceText: {

    fontSize: isSmallScreen ? 12 : 14,

    color: '#666',

    marginRight: 10,

  },

  customCheckbox: {

    width: 22,

    height: 22,

    borderRadius: 6,

    borderWidth: 2,

    borderColor: '#DDD',

    justifyContent: 'center',

    alignItems: 'center',

  },

  customCheckboxSelected: {

    backgroundColor: '#8c3e22',

    borderColor: '#8c3e22',

  },

  instructionsBox: {

    backgroundColor: '#F9F9F9',

    borderRadius: 15,

    padding: isSmallScreen ? 12 : 15,

    height: isSmallScreen ? 80 : 90,

    textAlignVertical: 'top',

    borderWidth: 1,

    borderColor: '#EEE',

    marginTop: 5,

    fontSize: isSmallScreen ? 12 : 14,

  },

  blackFooterArea: {

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: isSmallScreen ? 15 : 25,

    paddingVertical: 20,

    borderTopLeftRadius: 50,

    borderTopRightRadius: 50,

    paddingBottom: Platform.OS === 'ios' ? 40 : 25,

    backgroundColor: '#000',

  },

  qtyContainer: {

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

    width: '30%',

    borderWidth: 1,

    borderColor: '#8c3e22',

    borderRadius: 25,

    paddingVertical: 10,

    paddingHorizontal: 15,

  },

  qtyBtn: {

    color: '#8c3e22',

    fontSize: isSmallScreen ? 18 : 22,

    fontWeight: 'bold',

  },

  qtyVal: {

    color: '#FFF',

    fontSize: isSmallScreen ? 13 : 15,

    fontWeight: '600',

  },

  addMainButton: {

    backgroundColor: '#8c3e22',

    flex: 1,

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    marginLeft: 15,

    paddingVertical: 16,

    paddingHorizontal: 20,

    borderRadius: 25,

  },

  addBtnLabel: {

    color: '#FFF',

    fontSize: isSmallScreen ? 9 : 11,

    fontWeight: '600',

  },

  addBtnPrice: {

    paddingLeft: 10,

    color: '#FFF',

    fontSize: isSmallScreen ? 11 : 13,

    fontWeight: '600',

  },

});