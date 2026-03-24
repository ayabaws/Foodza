import { useLocation } from '@/contexts/LocationContext';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Modal,
    PermissionsAndroid,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375;
const isMediumScreen = width >= 375 && width < 414;
const isLargeScreen = width >= 414 && width <= 768;
const isTablet = width > 768;

interface LocationPermissionModalProps {
  visible: boolean;
  onClose: () => void;
  onLocationSet: () => void;
}

export default function LocationPermissionModal({ visible, onClose, onLocationSet }: LocationPermissionModalProps) {
  const { setCurrentLocation } = useLocation();
  const [selectedOption, setSelectedOption] = useState<'current' | 'map' | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [tempCoordinates, setTempCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Permission de localisation',
            message: 'Foodza a besoin de votre permission pour accéder à votre localisation',
            buttonNeutral: 'Demander plus tard',
            buttonNegative: 'Refuser',
            buttonPositive: 'Accepter',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          Alert.alert('Permission refusée', 'Vous ne pourrez pas utiliser la localisation automatique');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      // iOS location permission handling would go here
      getCurrentLocation();
    }
  };

  const getCurrentLocation = async () => {
  try {
    // Importer expo-location dynamiquement
    const Location = require('expo-location');
    
    // Demander les permissions
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission requise', 'La permission de localisation est nécessaire pour détecter votre position');
      return;
    }

    // Obtenir la position actuelle avec haute précision
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
      maximumAge: 10000, // 10 secondes maximum
    });

    const { latitude, longitude } = location.coords;
    console.log('Position GPS utilisateur:', latitude, longitude);

    // Géocodage inversé pour obtenir l'adresse réelle
    try {
      // Essayer d'abord avec OpenStreetMap
      let response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=fr&zoom=16&addressdetails=1`
      );
      
      let locationText = '';
      let data = null;
      
      if (response.ok) {
        data = await response.json();
        console.log('Données adresse OSM:', data);
      }
      
      // Logique améliorée pour extraire l'adresse
      if (data && data.address) {
        const address = data.address;
        
        // Priorité absolue aux quartiers/villes connus au Mali
        const quartier = address.suburb || address.neighbourhood || address.city_district || address.quarter || address.hamlet;
        const ville = address.city || address.town || address.village || address.county || address.state;
        const pays = address.country;
        
        // Si on trouve un quartier et une ville, c'est parfait
        if (quartier && ville) {
          locationText = `${quartier}, ${ville}`;
        } 
        // Si seulement une ville, on l'utilise
        else if (ville) {
          locationText = ville;
        } 
        // Si seulement un quartier, on l'utilise
        else if (quartier) {
          locationText = quartier;
        } 
        // Si on a un nom d'affichage, on l'utilise en nettoyant
        else if (data.display_name) {
          const parts = data.display_name.split(',').slice(0, 3); // Prendre les 3 premières parties
          locationText = parts.join(', ').trim();
        } 
        // Dernier recours : coordonnées GPS claires
        else {
          console.warn('Aucune adresse trouvée, utilisation des coordonnées GPS');
          locationText = `Position GPS (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
        }
      } else {
        console.warn('OSM API a échoué ou pas de données adresse');
        // Si l'API échoue, essayer de déterminer si on est dans une zone connue
        // Coordonnées approximatives de Bamako : 12.6392, -8.0029
        const distanceBamako = Math.sqrt(
          Math.pow(latitude - 12.6392, 2) + Math.pow(longitude - (-8.0029), 2)
        );
        
        if (distanceBamako < 0.5) { // Si très proche de Bamako
          locationText = 'Bamako, Mali';
        } else {
          locationText = `Position GPS (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
        }
      }

      console.log('Localisation finale:', locationText);
      setCurrentLocation({
        id: 'current',
        label: 'Position actuelle',
        street: locationText,
        coordinates: { latitude, longitude },
        isDefault: true,
      });

      Alert.alert(
        'Succès',
        'Votre position a été récupérée avec succès!',
        [{ text: 'OK', onPress: () => { onLocationSet(); onClose(); } }]
      );
    } catch (error) {
      console.warn('Erreur géocodage complète:', error);
      // Si le géocodage échoue complètement
      setCurrentLocation({
        id: 'current',
        label: 'Position actuelle',
        street: `Position GPS (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
        coordinates: { latitude, longitude },
        isDefault: true,
      });

      Alert.alert(
        'Succès',
        'Votre position a été récupérée avec succès!',
        [{ text: 'OK', onPress: () => { onLocationSet(); onClose(); } }]
      );
    }
  } catch (error) {
    console.warn('Erreur GPS complète:', error);
    Alert.alert('Erreur', 'Impossible de détecter votre position. Vérifiez que votre GPS est activé.');
    
    // En cas d'erreur complète, informer l'utilisateur
    setCurrentLocation({
      id: 'current',
      label: 'Position actuelle',
      street: 'Localisation indisponible',
      coordinates: { latitude: 0, longitude: 0 },
      isDefault: true,
    });
    onLocationSet();
    onClose();
  }
};

  const handleMapSelection = (coordinate: { latitude: number; longitude: number }) => {
    setTempCoordinates(coordinate);
  };

  const confirmMapSelection = () => {
    if (tempCoordinates) {
      setCurrentLocation({
        id: 'selected',
        label: 'Adresse sélectionnée',
        street: 'Adresse choisie sur la carte',
        coordinates: tempCoordinates,
        isDefault: true,
      });

      onLocationSet();
      onClose();
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <BlurView intensity={25} style={StyleSheet.absoluteFillObject} />
        <View style={styles.darkOverlay} />

        <View style={styles.modalContainer}>
          {/* Icon location en haut */}
          <View style={styles.iconWrapper}>
            <View style={styles.iconBackground}>
              <Ionicons name="location" size={isSmallScreen ? 35 : isMediumScreen ? 40 : isLargeScreen ? 45 : isTablet ? 50 : 45} color="#8C3E22" />
            </View>
          </View>

          <Text style={styles.modalTitle}>Localisation</Text>
          <Text style={styles.modalDescription}>
            Autoriser les cartes à accéder à votre position pendant que vous utilisez l'application ?
          </Text>

          <TouchableOpacity style={[styles.btnPrimary]} onPress={getCurrentLocation}>
            <Text style={styles.btnPrimaryText}>Autoriser</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnSecondary} onPress={() => {
          setCurrentLocation({
            id: 'no-address',
            label: 'Pas d\'adresse',
            street: 'Pas d\'adresse',
            coordinates: { latitude: 0, longitude: 0 },
            isDefault: true,
          });
          onClose();
        }}>
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
    width: isSmallScreen ? width * 0.90 : isMediumScreen ? width * 0.88 : isLargeScreen ? width * 0.85 : isTablet ? width * 0.70 : width * 0.85,
    backgroundColor: 'white',
    borderRadius: isSmallScreen ? 25 : isMediumScreen ? 28 : isLargeScreen ? 30 : isTablet ? 35 : 30,
    padding: isSmallScreen ? 25 : isMediumScreen ? 28 : isLargeScreen ? 30 : isTablet ? 35 : 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  iconWrapper: {
    marginBottom: isSmallScreen ? 20 : 25,
  },
  iconBackground: {
    width: isSmallScreen ? 80 : isMediumScreen ? 85 : isLargeScreen ? 90 : isTablet ? 100 : 90,
    height: isSmallScreen ? 80 : isMediumScreen ? 85 : isLargeScreen ? 90 : isTablet ? 100 : 90,
    borderRadius: isSmallScreen ? 40 : isMediumScreen ? 42 : isLargeScreen ? 45 : isTablet ? 50 : 45,
    backgroundColor: '#FFF8F0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  modalTitle: {
    fontSize: isSmallScreen ? 20 : isMediumScreen ? 21 : isLargeScreen ? 22 : isTablet ? 26 : 22,
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
    borderRadius: isSmallScreen ? 25 : isMediumScreen ? 26 : isLargeScreen ? 27 : isTablet ? 30 : 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: isSmallScreen ? 12 : 15,
  },
  btnPrimaryText: {
    color: 'white',
    fontSize: isSmallScreen ? 15 : isMediumScreen ? 16 : isLargeScreen ? 17 : isTablet ? 19 : 17,
    fontWeight: 'bold',
  },
  btnSecondary: {
    width: '100%',
    height: isSmallScreen ? 50 : isMediumScreen ? 52 : isLargeScreen ? 54 : isTablet ? 60 : 54,
    borderRadius: isSmallScreen ? 25 : isMediumScreen ? 26 : isLargeScreen ? 27 : isTablet ? 30 : 27,
    borderWidth: 1,
    borderColor: '#D7CCC8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSecondaryText: {
    color: '#8C3E22',
    fontSize: isSmallScreen ? 14 : isMediumScreen ? 15 : isLargeScreen ? 16 : isTablet ? 18 : 16,
    fontWeight: '600',
  },
  manualInputContainer: {
    width: '100%',
    marginTop: 15,
    marginBottom: 15,
  },
  manualInput: {
    width: '100%',
    height: isSmallScreen ? 45 : isMediumScreen ? 48 : isLargeScreen ? 50 : isTablet ? 55 : 50,
    borderWidth: 1,
    borderColor: '#D7CCC8',
    borderRadius: isSmallScreen ? 20 : isMediumScreen ? 22 : isLargeScreen ? 25 : isTablet ? 28 : 25,
    paddingHorizontal: isSmallScreen ? 15 : 20,
    marginBottom: 10,
    fontSize: isSmallScreen ? 14 : isMediumScreen ? 15 : isLargeScreen ? 16 : isTablet ? 18 : 16,
    backgroundColor: '#FFF8F0',
  },
  btnConfirm: {
    backgroundColor: '#8C3E22',
    width: '100%',
    height: isSmallScreen ? 45 : isMediumScreen ? 48 : isLargeScreen ? 50 : isTablet ? 55 : 50,
    borderRadius: isSmallScreen ? 22 : isMediumScreen ? 24 : isLargeScreen ? 25 : isTablet ? 27 : 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnConfirmDisabled: {
    backgroundColor: '#CCC',
  },
  btnConfirmText: {
    color: 'white',
    fontSize: isSmallScreen ? 14 : isMediumScreen ? 15 : isLargeScreen ? 16 : isTablet ? 18 : 16,
    fontWeight: 'bold',
  },
  btnSkip: {
    width: '100%',
    height: isSmallScreen ? 40 : isMediumScreen ? 42 : isLargeScreen ? 44 : isTablet ? 50 : 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  btnSkipText: {
    color: '#999',
    fontSize: isSmallScreen ? 12 : isMediumScreen ? 13 : isLargeScreen ? 14 : isTablet ? 16 : 14,
    fontWeight: '500',
  },
});
