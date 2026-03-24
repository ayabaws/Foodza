import { useLocation } from '@/contexts/LocationContext';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Image, Linking, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function LocationPermissionModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [screenData, setScreenData] = useState(Dimensions.get('window'));
  const { width, height } = screenData;
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 414;
  const isLargeScreen = width >= 414 && width <= 768;
  const isTablet = width > 768;
  const { setCurrentLocation } = useLocation();

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenData(window);
    });
    return () => subscription?.remove();
  }, []);

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

      // Stocker la position dans le contexte
      const addressData = {
        id: Date.now().toString(),
        label: 'Position actuelle',
        street: `Lat: ${location.coords.latitude.toFixed(6)}, Lng: ${location.coords.longitude.toFixed(6)}`,
        coordinates: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        },
        isDefault: true
      };
      
      console.log('Données de localisation à stocker:', addressData);
      setCurrentLocation(addressData);
      console.log('Localisation stockée dans le contexte');

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

  const styles = StyleSheet.create({
    darkOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.55)',
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      width: isSmallScreen ? width * 0.90 : isMediumScreen ? width * 0.88 : isLargeScreen ? width * 0.85 : isTablet ? width * 0.70 : width * 0.85,
      backgroundColor: 'white',
      borderRadius: isSmallScreen ? 25 : isMediumScreen ? 28 : isLargeScreen ? 30 : isTablet ? 35 : 30,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 10,
    },
    headerContainer: {
      height: isSmallScreen ? 180 : isMediumScreen ? 200 : isLargeScreen ? 220 : isTablet ? 250 : 220,
      width: '100%',
      overflow: 'hidden',
      position: 'relative',
    },
    headerImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    imageGradient: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 150,
      backgroundColor: 'transparent',
    },
    wave: {
      position: 'absolute',
      bottom: -6,
      left: 0,
    },
    iconWrapper: {
      marginTop: isSmallScreen ? -30 : isMediumScreen ? -35 : isLargeScreen ? -40 : isTablet ? -45 : -40,
      marginBottom: isSmallScreen ? 15 : isMediumScreen ? 18 : 20,
      alignItems: 'center',
    },
    iconBackground: {
      width: isSmallScreen ? 70 : isMediumScreen ? 75 : isLargeScreen ? 80 : isTablet ? 90 : 80,
      height: isSmallScreen ? 70 : isMediumScreen ? 75 : isLargeScreen ? 80 : isTablet ? 90 : 80,
      borderRadius: isSmallScreen ? 35 : isMediumScreen ? 37 : isLargeScreen ? 40 : isTablet ? 45 : 40,
      backgroundColor: '#FFF',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    modalTitle: {
      fontSize: isSmallScreen ? 20 : isMediumScreen ? 21 : isLargeScreen ? 22 : isTablet ?26 : 22,
      fontWeight: 'bold',
      marginBottom: isSmallScreen ? 12 : 15,
      textAlign: 'center',
      color: '#000',
    },
    modalDescription: {
      fontSize: isSmallScreen ? 13 : isMediumScreen ? 14 : isLargeScreen ? 15 : isTablet ? 17 : 15,
      textAlign: 'center',
      color: '#636E72',
      marginBottom: isSmallScreen ? 25 : 30,
      lineHeight: isSmallScreen ? 20 : 22,
      paddingHorizontal: isSmallScreen ? 10 : isMediumScreen ? 15 : 20,
    },
    btnPrimary: {
      backgroundColor: '#000',
      width: '100%',
      height: isSmallScreen ? 50 : isMediumScreen ? 52 : isLargeScreen ? 54 : isTablet ? 60 : 54,
      borderRadius: isSmallScreen ? 25 : isMediumScreen ?26 : isLargeScreen ? 27 : isTablet ? 30 : 27,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: isSmallScreen ? 12 : 15,
      marginHorizontal: isSmallScreen ? 20 : isMediumScreen ? 25 : isLargeScreen ? 30 : isTablet ? 40 : 30,
    },
    btnDisabled: {
      backgroundColor: '#ccc',
    },
    btnPrimaryText: {
      color: '#fff',
      fontSize: isSmallScreen ? 16 : isMediumScreen ? 17 : isLargeScreen ? 18 : isTablet ? 20 : 18,
      fontWeight: '600',
    },
    btnSecondary: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: '#000',
      width: '100%',
      height: isSmallScreen ? 50 : isMediumScreen ? 52 : isLargeScreen ? 54 : isTablet ? 60 : 54,
      borderRadius: isSmallScreen ? 25 : isMediumScreen ?26 : isLargeScreen ? 27 : isTablet ? 30 : 27,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: isSmallScreen ? 20 : isMediumScreen ? 25 : isLargeScreen ? 30 : isTablet ? 40 : 30,
    },
    btnSecondaryText: {
      color: '#000',
      fontSize: isSmallScreen ? 16 : isMediumScreen ? 17 : isLargeScreen ? 18 : isTablet ? 20 : 18,
      fontWeight: '600',
    },
  });

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <BlurView intensity={25} style={StyleSheet.absoluteFillObject} />
        <View style={styles.darkOverlay} />

        <View style={styles.modalContainer}>
          {/* Header avec image */}
          <View style={styles.headerContainer}>
            <Image
              source={require('@/assets/onboarding/food-header.jpg')}
              style={styles.headerImage}
            />
            <View style={styles.imageGradient} />
            
            {/* WAVE SVG */}
            <Svg
              width={width * 0.85}
              height={120}
              viewBox="0 0 1440 320"
              preserveAspectRatio="none"
              style={styles.wave}
            >
              <Path
                fill="#fff"
                d="
      M0,170
      C120,215 260,245 380,235
      C540,220 680,165 860,155
      C1040,145 1180,170 1320,185
      C1380,195 1410,205 1440,210
      L1440,320 L0,320 Z
    "
              />
            </Svg>
          </View>

          {/* Icon location au centre */}
          <View style={styles.iconWrapper}>
            <View style={styles.iconBackground}>
              <Ionicons name="location" size={isSmallScreen ? 35 : isMediumScreen ? 40 : isLargeScreen ? 45 : isTablet ? 50 : 45} color="#8C3E22" />
            </View>
          </View>

          <Text style={styles.modalTitle}>Activer votre localisation</Text>
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