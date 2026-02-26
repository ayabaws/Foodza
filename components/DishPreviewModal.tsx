import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Animated, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import DishDetailModal from './DishDetailModal';

const { height } = Dimensions.get('window');

interface Dish {
  id: string;
  name: string;
  image: any;
  price: number;
  description: string;
}

interface DishPreviewModalProps {
  visible: boolean;
  dish: Dish | null;
  onClose: () => void;
}

export default function DishPreviewModal({ visible, dish, onClose }: DishPreviewModalProps) {
  const { toggleFavorite, isFavorite } = useFavorites();

  // Animation de glissement depuis le bas
  const slideAnim = useRef(new Animated.Value(height)).current;

  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    if (visible && dish) {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, dish]);

  const handleAddToCart = () => {
    setShowDetailModal(true);
  };

  if (!dish) return null;

  return (
    <>
      <Modal
        visible={visible && !showDetailModal}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          {/* Zone cliquable pour fermer en touchant l'arrière-plan */}
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={onClose}
          />

          <Animated.View
            style={[
              styles.sheetContainer,
              { transform: [{ translateY: slideAnim }] }
            ]}
          >
            {/* Bouton Fermer Noir Flottant (Au-dessus de la carte blanche) */}
            <TouchableOpacity
              style={styles.floatingCloseButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Ionicons name="close" size={28} color="#FFFFFF" />
            </TouchableOpacity>

            {/* LA CARTE BLANCHE (Celle de l'image) */}
            <View style={styles.whiteCard}>
              <Image source={dish.image} style={styles.dishImage} />

              <View style={styles.infoSection}>
                <View style={styles.titleRow}>
                  <View style={styles.leftInfo}>
                    <Text style={styles.dishName}>{dish.name}</Text>
                    <Text style={styles.dishPrice}>{dish.price} CFA</Text>
                  </View>

                  <View style={styles.rightAction}>
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={handleAddToCart}
                    >
                      <Ionicons name="add" size={26} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.customLabel}>Personnalisable</Text>
                  </View>
                </View>

                <View style={styles.descriptionArea}>
                  <Text style={styles.descriptionText}>{dish.description}</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>

      <DishDetailModal
        visible={showDetailModal}
        dish={dish}
        onClose={() => setShowDetailModal(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetContainer: {
    width: '100%',
    alignItems: 'center',
  },

  floatingCloseButton: {
    backgroundColor: '#000000a8',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },

  whiteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 35,
    width: '100%',
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  dishImage: {
    width: '100%',
    height: 280,
    resizeMode: 'cover',
  },
  infoSection: {
    padding: 22,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftInfo: {
    flex: 1,
  },
  dishName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  dishPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#333',
  },
  rightAction: {
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#72341D', // Marron de l'image
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  customLabel: {
    fontSize: 9,
    color: '#888',
    fontWeight: '600',
  },
  descriptionArea: {
    marginTop: 15,
  },
  descriptionText: {
    fontSize: 12,
    color: '#666',
    marginTop: 12,
    marginBottom: 30,
    lineHeight: 20,
  },
  extraText: {
    fontSize: 13,
    color: '#666',
    marginTop: 5,
  },
});