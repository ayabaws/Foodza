import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 380;
const isMediumScreen = width >= 380 && width < 768;

interface DishPreviewModalProps {
  visible: boolean;
  dish: any;
  onClose: () => void;
  onAddToCart?: (customizedDish: any) => void;
}

export default function DishPreviewModal({ visible, dish, onClose, onAddToCart }: DishPreviewModalProps) {
  const { colors } = useTheme();
  const [selectedSize, setSelectedSize] = useState('Moyenne');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [quantity, setQuantity] = useState(1);

  const sizes = ['Petite', 'Moyenne', 'Grande'];
  const extras = ['Fromage supplémentaire', 'Ingrédients supplémentaires', 'Sauce spéciale', 'Sans oignons'];
  
  const calculatePrice = () => {
    let basePrice = dish.price;
    if (selectedSize === 'Petite') basePrice *= 0.8;
    if (selectedSize === 'Grande') basePrice *= 1.3;
    basePrice += selectedExtras.length * 500;
    return basePrice * quantity;
  };

  const toggleExtra = (extra: string) => {
    setSelectedExtras(prev => 
      prev.includes(extra) 
        ? prev.filter(e => e !== extra)
        : [...prev, extra]
    );
  };

  const handleAddToCart = () => {
    const customizedDish = {
      ...dish,
      size: selectedSize,
      extras: selectedExtras,
      instructions: specialInstructions,
      quantity,
      totalPrice: calculatePrice()
    };
    onAddToCart?.(customizedDish);
    onClose();
  };

  if (!visible || !dish) return null;

  return (
    <SafeAreaView style={styles.modalContainer}>
      <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: colors.text.primary }]}>Personnaliser votre plat</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
          {/* Image du plat */}
          <View style={styles.imageContainer}>
            <Image source={dish.image} style={styles.dishImage} />
          </View>

          {/* Nom du plat */}
          <Text style={[styles.dishName, { color: colors.text.primary }]}>{dish.name}</Text>
          <Text style={[styles.dishDescription, { color: colors.text.secondary }]}>
            {dish.description || 'Plat délicieux préparé avec des ingrédients frais'}
          </Text>

          {/* Taille */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Taille</Text>
            <View style={styles.sizeContainer}>
              {sizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeOption,
                    selectedSize === size && styles.selectedSize,
                    { backgroundColor: selectedSize === size ? '#BF5B30' : colors.surface }
                  ]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text style={[
                    styles.sizeText,
                    selectedSize === size && styles.selectedSizeText,
                    { color: selectedSize === size ? '#FFFFFF' : colors.text.primary }
                  ]}>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Options supplémentaires */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Options supplémentaires</Text>
            {extras.map((extra) => (
              <TouchableOpacity
                key={extra}
                style={[
                  styles.extraOption,
                  { backgroundColor: colors.surface }
                ]}
                onPress={() => toggleExtra(extra)}
              >
                <View style={[
                  styles.checkbox,
                  selectedExtras.includes(extra) && styles.checkedCheckbox,
                  { backgroundColor: selectedExtras.includes(extra) ? '#BF5B30' : colors.surface }
                ]}>
                  {selectedExtras.includes(extra) && (
                    <Ionicons name="checkmark" size={isSmallScreen ? 12 : 14} color="#FFFFFF" />
                  )}
                </View>
                <Text style={[styles.extraText, { color: colors.text.primary }]}>{extra}</Text>
                <Text style={[styles.extraPrice, { color: colors.text.secondary }]}>+500 FCFA</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Instructions spéciales */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Instructions spéciales</Text>
            <View style={[styles.instructionsInput, { backgroundColor: colors.surface }]}>
              <Text style={[styles.instructionsPlaceholder, { color: colors.text.tertiary }]}>
                {specialInstructions || 'Ajoutez vos instructions ici...'}
              </Text>
            </View>
          </View>

          {/* Quantité */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>Quantité</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity 
                style={[styles.quantityButton, { backgroundColor: colors.surface }]}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Ionicons name="remove" size={20} color={colors.text.primary} />
              </TouchableOpacity>
              <Text style={[styles.quantityText, { color: colors.text.primary }]}>{quantity}</Text>
              <TouchableOpacity 
                style={[styles.quantityButton, { backgroundColor: colors.surface }]}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Ionicons name="add" size={20} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Footer avec prix et bouton */}
        <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
          <View style={styles.priceContainer}>
            <Text style={[styles.totalLabel, { color: colors.text.secondary }]}>Total</Text>
            <Text style={[styles.totalPrice, { color: colors.text.primary }]}>
              {calculatePrice().toLocaleString()} FCFA
            </Text>
          </View>
          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
            <View style={styles.addToCartTextContainer}>
              <Text style={styles.addToCartText}>Ajouter un article</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flex: 1,
    marginTop: 60,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  closeButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginVertical: 20,
  },
  dishImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  dishName: {
    fontSize: isSmallScreen ? 20 : 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dishDescription: {
    fontSize: isSmallScreen ? 14 : 16,
    lineHeight: isSmallScreen ? 20 : 24,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  sizeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  sizeOption: {
    flex: 1,
    paddingVertical: isSmallScreen ? 10 : 12,
    paddingHorizontal: isSmallScreen ? 12 : 16,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: isSmallScreen ? 44 : 48,
  },
  selectedSize: {
    backgroundColor: '#BF5B30',
  },
  sizeText: {
    fontSize: isSmallScreen ? 12 : 14,
    fontWeight: '500',
  },
  selectedSizeText: {
    color: '#FFFFFF',
  },
  extraOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: isSmallScreen ? 10 : 12,
    paddingHorizontal: isSmallScreen ? 12 : 16,
    borderRadius: 12,
    marginBottom: 8,
    minHeight: isSmallScreen ? 44 : 48,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ddd',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedCheckbox: {
    backgroundColor: '#BF5B30',
    borderColor: '#BF5B30',
  },
  extraText: {
    flex: 1,
    fontSize: isSmallScreen ? 14 : 16,
  },
  extraPrice: {
    fontSize: isSmallScreen ? 10 : 11,
    fontWeight: '500',
  },
  instructionsInput: {
    padding: 16,
    borderRadius: 12,
    minHeight: 80,
  },
  instructionsPlaceholder: {
    fontSize: isSmallScreen ? 14 : 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  quantityButton: {
    width: isSmallScreen ? 36 : 40,
    height: isSmallScreen ? 36 : 40,
    borderRadius: isSmallScreen ? 18 : 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: isSmallScreen ? 14 : 15,
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'center',
  },
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: isSmallScreen ? 16 : 20,
    paddingVertical: isSmallScreen ? 12 : 16,
    borderTopWidth: 1,
  },
  priceContainer: {
    alignItems: 'flex-start',
    marginRight: isSmallScreen ? 12 : 20,
    flex: 0,
  },
  totalLabel: {
    fontSize: isSmallScreen ? 12 : 14,
    marginBottom: 4,
  },
  totalPrice: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: 'bold',
    textAlign: 'left',
    alignSelf: 'flex-start',
  },
  addToCartButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: isSmallScreen ? 10 : 12,
    borderRadius: 25,
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: isSmallScreen ? 140 : 160,
    height: isSmallScreen ? 40 : 44,
  },
  addToCartTextContainer: {
    paddingLeft: isSmallScreen ? 90 : 100,
    justifyContent: 'center',
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: isSmallScreen ? 12 : 14,
    fontWeight: '600',
    textAlign: 'left',
    lineHeight: isSmallScreen ? 14 : 16,
    marginLeft: isSmallScreen ? -60 : -70,
  },
});
