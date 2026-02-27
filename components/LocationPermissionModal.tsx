import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { useLocation } from '@/contexts/LocationContext';

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

  const getCurrentLocation = () => {
    // Simuler la récupération de la localisation actuelle
    // En production, utiliser navigator.geolocation ou expo-location
    const mockLocation = {
      latitude: 12.6395,
      longitude: -8.0065,
    };

    setCurrentLocation({
      id: 'current',
      label: 'Position actuelle',
      street: 'Votre position actuelle',
      coordinates: mockLocation,
      isDefault: true,
    });

    onLocationSet();
    onClose();
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
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Configurer votre localisation</Text>
          <View style={{ width: 24 }} />
        </View>

        {!showMap ? (
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Ionicons name="location-outline" size={60} color="#8B4513" />
            </View>

            <Text style={styles.title}>Où souhaitez-vous être livré ?</Text>
            <Text style={styles.subtitle}>Choisissez comment vous voulez définir votre adresse de livraison</Text>

            {/* Options */}
            <TouchableOpacity 
              style={[styles.option, selectedOption === 'current' && styles.selectedOption]}
              onPress={() => setSelectedOption('current')}
            >
              <View style={styles.optionIcon}>
                <Ionicons name="navigate" size={24} color="#8B4513" />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Utiliser ma position actuelle</Text>
                <Text style={styles.optionSubtitle}>Localisation automatique via GPS</Text>
              </View>
              <View style={[styles.radio, selectedOption === 'current' && styles.radioSelected]} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.option, selectedOption === 'map' && styles.selectedOption]}
              onPress={() => setSelectedOption('map')}
            >
              <View style={styles.optionIcon}>
                <Ionicons name="map-outline" size={24} color="#8B4513" />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Choisir sur la carte</Text>
                <Text style={styles.optionSubtitle}>Sélectionner manuellement votre adresse</Text>
              </View>
              <View style={[styles.radio, selectedOption === 'map' && styles.radioSelected]} />
            </TouchableOpacity>

            {/* Actions */}
            <TouchableOpacity 
              style={[styles.confirmButton, !selectedOption && styles.disabledButton]}
              onPress={() => {
                if (selectedOption === 'current') {
                  requestLocationPermission();
                } else if (selectedOption === 'map') {
                  setShowMap(true);
                }
              }}
              disabled={!selectedOption}
            >
              <Text style={styles.confirmButtonText}>Continuer</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.skipButton} onPress={onClose}>
              <Text style={styles.skipButtonText}>Plus tard</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: 12.6395,
                longitude: -8.0065,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              onPress={(e) => handleMapSelection(e.nativeEvent.coordinate)}
            >
              {tempCoordinates && (
                <Marker coordinate={tempCoordinates}>
                  <View style={styles.mapMarker}>
                    <Ionicons name="location" size={30} color="#8B4513" />
                  </View>
                </Marker>
              )}
            </MapView>

            <View style={styles.mapActions}>
              <TouchableOpacity style={styles.mapCancelButton} onPress={() => setShowMap(false)}>
                <Text style={styles.mapCancelText}>Retour</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.mapConfirmButton, !tempCoordinates && styles.disabledButton]}
                onPress={confirmMapSelection}
                disabled={!tempCoordinates}
              >
                <Text style={styles.mapConfirmText}>Confirmer cette position</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  iconContainer: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: '#8B4513',
    backgroundColor: '#FFF8F0',
  },
  optionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#DDD',
  },
  radioSelected: {
    backgroundColor: '#8B4513',
    borderColor: '#8B4513',
  },
  confirmButton: {
    backgroundColor: '#8B4513',
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 30,
  },
  disabledButton: {
    backgroundColor: '#CCC',
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 15,
  },
  skipButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  mapMarker: {
    backgroundColor: '#FFF',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#8B4513',
  },
  mapActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  mapCancelButton: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#F0F0F0',
  },
  mapCancelText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  mapConfirmButton: {
    backgroundColor: '#8B4513',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  mapConfirmText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
