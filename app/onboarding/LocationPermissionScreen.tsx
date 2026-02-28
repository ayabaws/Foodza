import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Location from 'expo-location';

const { width } = Dimensions.get('window');

export default function LocationPermissionModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [isLoading, setIsLoading] = useState(false);

  const requestLocationPermission = async () => {
    setIsLoading(true);
    
    try {
      // Demander la permission d'accéder à la localisation
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission requise',
          'Veuillez autoriser l\'accès à votre position pour utiliser cette fonctionnalité.',
          [
            { text: 'Annuler', style: 'cancel' },
            { 
              text: 'Paramètres', 
              onPress: () => Linking.openSettings() 
            }
          ]
        );
        setIsLoading(false);
        return;
      }

      // Récupérer la position actuelle
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      console.log('Position actuelle:', {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy
      });

      // Stocker la position (vous pouvez utiliser AsyncStorage pour la persister)
      // await AsyncStorage.setItem('userLocation', JSON.stringify({
      //   latitude: location.coords.latitude,
      //   longitude: location.coords.longitude,
      //   accuracy: location.coords.accuracy
      // }));

      Alert.alert(
        'Succès',
        'Votre position a été récupérée avec succès!',
        [{ text: 'OK', onPress: onClose }]
      );

    } catch (error) {
      console.error('Erreur de localisation:', error);
      Alert.alert(
        'Erreur',
        'Impossible de récupérer votre position. Veuillez vérifier que le GPS est activé.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <BlurView intensity={25} style={StyleSheet.absoluteFillObject} />
        <View style={styles.darkOverlay} />

        <View style={styles.modalContainer}>
          <View style={styles.iconWrapper}>
            <View style={styles.blobBackground} />
            <Ionicons name="location" size={60} color="#8C3E22" />
          </View>

          <Text style={styles.modalTitle}>Localisation</Text>
          <Text style={styles.modalDescription}>
            Autoriser les cartes à accéder à votre position pendant que vous utilisez l'application ?
          </Text>

          <TouchableOpacity style={[styles.btnPrimary, isLoading && styles.btnDisabled]} onPress={requestLocationPermission} disabled={isLoading}>
            <Text style={styles.btnPrimaryText}>
              {isLoading ? 'Récupération...' : 'Autoriser'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnSecondary} onPress={onClose}>
            <Text style={styles.btnSecondaryText}>Passer pour l'instant</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.85,
    backgroundColor: 'white',
    borderRadius: 35,
    padding: 25,
    alignItems: 'center',
  },
  iconWrapper: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  blobBackground: {
    position: 'absolute',
    width: 100,
    height: 80,
    backgroundColor: '#E8F6F0',
    borderRadius: 40,
    transform: [{ rotate: '15deg' }],
  },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  modalDescription: { fontSize: 15, textAlign: 'center', color: '#636E72', marginBottom: 30, lineHeight: 22 },
  btnPrimary: { backgroundColor: '#000', width: '100%', height: 58, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  btnDisabled: { backgroundColor: '#ccc' },
  btnPrimaryText: { color: 'white', fontSize: 17, fontWeight: 'bold' },
  btnSecondary: { width: '100%', height: 58, borderRadius: 30, borderWidth: 1, borderColor: '#D7CCC8', justifyContent: 'center', alignItems: 'center' },
  btnSecondaryText: { color: '#8C3E22', fontSize: 16, fontWeight: '600' },
});