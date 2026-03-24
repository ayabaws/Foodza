import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 380;
const isMediumScreen = width >= 380 && width < 768;
const isLargeScreen = width >= 768;

export default function DineInNotAvailableScreen() {
  const router = useRouter();

  const handleGoToDelivery = () => {
    // Retour au home avec le tab livraison actif
    router.push('/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.content}>
        {/* Icône de restaurant non disponible */}
        <View style={styles.iconContainer}>
          <Ionicons name="restaurant-outline" size={isSmallScreen ? 45 : isMediumScreen ? 55 : 65} color="#8C3E22" />
        </View>
        
        {/* Titre principal */}
        <Text style={styles.title}>Service sur place</Text>
        <Text style={styles.subtitle}>Bientôt disponible</Text>
        
        {/* Message explicatif */}
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>
            Notre service sur place sera bientôt disponible dans votre région.
          </Text>
          <Text style={styles.messageText}>
            En attendant, profitez de notre service de livraison rapide et fiable.
          </Text>
        </View>
        
        {/* Bouton pour aller à la livraison */}
        <TouchableOpacity style={styles.deliveryButton} onPress={handleGoToDelivery}>
          <Ionicons name="bicycle-outline" size={isSmallScreen ? 18 : 20} color="#FFFFFF" />
          <Text style={styles.deliveryButtonText}>Voir la livraison</Text>
        </TouchableOpacity>
        
        {/* Informations supplémentaires */}
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Ionicons name="checkmark-circle-outline" size={isSmallScreen ? 14 : 16} color="#10B981" />
            <Text style={styles.infoText}>Livraison rapide</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="checkmark-circle-outline" size={isSmallScreen ? 14 : 16} color="#10B981" />
            <Text style={styles.infoText}>Paiement sécurisé</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="checkmark-circle-outline" size={isSmallScreen ? 14 : 16} color="#10B981" />
            <Text style={styles.infoText}>Suivi en temps réel</Text>
          </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: isSmallScreen ? 24 : 32,
    paddingVertical: 40,
  },
  iconContainer: {
    marginBottom: isSmallScreen ? 30 : 40,
    opacity: 0.8,
  },
  title: {
    fontSize: isSmallScreen ? 22 : isMediumScreen ? 26 : 30,
    fontWeight: 'bold',
    color: '#2C1810',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: isSmallScreen ? 16 : isMediumScreen ? 18 : 20,
    fontWeight: '600',
    color: '#8C3E22',
    textAlign: 'center',
    marginBottom: isSmallScreen ? 25 : 35,
  },
  messageContainer: {
    marginBottom: isSmallScreen ? 40 : 50,
    alignItems: 'center',
  },
  messageText: {
    fontSize: isSmallScreen ? 13 : isMediumScreen ? 14 : 15,
    color: '#666666',
    textAlign: 'center',
    lineHeight: isSmallScreen ? 20 : isMediumScreen ? 22 : 24,
    marginBottom: 8,
  },
  deliveryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8C3E22',
    paddingHorizontal: isSmallScreen ? 20 : isMediumScreen ? 24 : 28,
    paddingVertical: isSmallScreen ? 12 : isMediumScreen ? 14 : 16,
    borderRadius: 25,
    marginBottom: isSmallScreen ? 25 : 35,
    gap: isSmallScreen ? 6 : 8,
  },
  deliveryButtonText: {
    color: '#FFFFFF',
    fontSize: isSmallScreen ? 13 : isMediumScreen ? 14 : 15,
    fontWeight: '600',
  },
  infoContainer: {
    alignItems: 'center',
    gap: isSmallScreen ? 10 : 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isSmallScreen ? 6 : 8,
  },
  infoText: {
    fontSize: isSmallScreen ? 12 : isMediumScreen ? 13 : 14,
    color: '#666666',
  },
});
