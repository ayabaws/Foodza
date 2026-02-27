import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  TextInput,
  Modal,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { useLocation } from '@/contexts/LocationContext';

interface Address {
  id: string;
  label: string;
  street: string;
  coordinates?: { latitude: number; longitude: number };
  isDefault?: boolean;
}

interface AddressManagerProps {
  onBack?: () => void;
}

export default function AddressManager({ onBack }: AddressManagerProps) {
  const { 
    currentLocation, 
    savedAddresses, 
    setCurrentLocation, 
    addSavedAddress, 
    updateSavedAddress, 
    deleteSavedAddress, 
    setDefaultAddress 
  } = useLocation();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showMapSelector, setShowMapSelector] = useState(false);
  const [formData, setFormData] = useState({
    label: '',
    street: '',
  });
  const [tempCoordinates, setTempCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [reverseGeocodedAddress, setReverseGeocodedAddress] = useState<string>('');
  const [isGeocoding, setIsGeocoding] = useState<boolean>(false);

  const openAddModal = () => {
    console.log('Opening add modal'); // Debug
    setFormData({ label: '', street: '' });
    setTempCoordinates(null);
    setReverseGeocodedAddress('');
    setIsGeocoding(false);
    setEditingAddress(null);
    setShowAddModal(true);
  };

  const openEditModal = (address: Address) => {
    setFormData({ label: address.label, street: address.street });
    setTempCoordinates(address.coordinates || null);
    setEditingAddress(address);
    setShowAddModal(true);
  };

  const handleSave = () => {
    if (!formData.label.trim() || !formData.street.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    const addressData: Address = {
      id: editingAddress?.id || Date.now().toString(),
      label: formData.label,
      street: formData.street,
      coordinates: tempCoordinates || editingAddress?.coordinates,
      isDefault: editingAddress?.isDefault || false,
    };

    if (editingAddress) {
      updateSavedAddress(addressData);
    } else {
      addSavedAddress(addressData);
      // Si c'est la première adresse, la définir comme adresse actuelle
      if (savedAddresses.length === 0) {
        setCurrentLocation(addressData);
      }
    }

    setShowAddModal(false);
    setTempCoordinates(null);
    setReverseGeocodedAddress('');
    setFormData({ label: '', street: '' });
  };

  const handleCancelAdd = () => {
    setShowAddModal(false);
    setTempCoordinates(null);
    setReverseGeocodedAddress('');
    setFormData({ label: '', street: '' });
  };

  const handleDelete = (addressId: string) => {
    Alert.alert(
      'Supprimer l\'adresse',
      'Êtes-vous sûr de vouloir supprimer cette adresse ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => deleteSavedAddress(addressId),
        },
      ]
    );
  };

  const handleSetDefault = (addressId: string) => {
    setDefaultAddress(addressId);
    const address = savedAddresses.find(addr => addr.id === addressId);
    if (address) {
      setCurrentLocation(address);
    }
  };

  const handleSelectAddress = (address: Address) => {
    setCurrentLocation(address);
    // Fermer le modal si on est dans le contexte du profile
    if (onBack) {
      onBack();
    }
  };

  const handleMapSelection = (coordinate: { latitude: number; longitude: number }) => {
    console.log('Map selection:', coordinate); // Debug
    setTempCoordinates(coordinate);
    setIsGeocoding(true);
    // Géocodage inversé pour obtenir l'adresse
    reverseGeocode(coordinate);
  };

  const reverseGeocode = async (coordinate: { latitude: number; longitude: number }) => {
    try {
      // Utiliser l'API de géocodage inversé d'OpenStreetMap (Nominatim)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coordinate.latitude}&lon=${coordinate.longitude}&addressdetails=1&accept-language=fr`,
        {
          headers: {
            'User-Agent': 'FoodzaApp/1.0'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }
      
      const data = await response.json();
      
      if (data && data.display_name) {
        // Construire une adresse complète formatée
        const address = data.display_name;
        setReverseGeocodedAddress(address);
        console.log('Reverse geocoded address:', address);
      } else {
        // Fallback vers des adresses simulées si l'API ne répond pas
        const mockAddresses = [
          { lat: 12.6395, lng: -8.0065, address: "ACI 2000, Rue 14, Bamako, Mali" },
          { lat: 12.6338, lng: -8.0003, address: "Kalaban Coro, Route de Koulikoro, Bamako, Mali" },
          { lat: 12.6456, lng: -8.0123, address: "Hippodrome, Avenue Cheick Zaman, Bamako, Mali" },
          { lat: 12.6234, lng: -8.0234, address: "Lafiabougou, Marché, Bamako, Mali" },
          { lat: 12.6567, lng: -8.0098, address: "Badalabougou, Quartier Administratif, Bamako, Mali" },
        ];

        let closestAddress = "Adresse inconnue";
        let minDistance = Infinity;

        mockAddresses.forEach(mock => {
          const distance = Math.sqrt(
            Math.pow(coordinate.latitude - mock.lat, 2) + 
            Math.pow(coordinate.longitude - mock.lng, 2)
          );
          if (distance < minDistance) {
            minDistance = distance;
            closestAddress = mock.address;
          }
        });

        setReverseGeocodedAddress(closestAddress);
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      // Fallback en cas d'erreur réseau
      setReverseGeocodedAddress('Adresse non disponible - Veuillez entrer manuellement');
    } finally {
      setIsGeocoding(false);
    }
  };

  const openMapSelector = () => {
    console.log('Opening map selector'); // Debug
    // Fermer le modal d'ajout avant d'ouvrir la carte
    setShowAddModal(false);
    setTimeout(() => {
      setShowMapSelector(true);
    }, 100); // Petite attente pour assurer la fermeture du premier modal
  };

  const confirmMapSelection = () => {
    console.log('Confirm map selection:', tempCoordinates); // Debug
    if (tempCoordinates && !isGeocoding) {
      // Mettre à jour le formulaire avec l'adresse géocodée
      setFormData(prev => ({ ...prev, street: reverseGeocodedAddress }));
      // Revenir au formulaire d'ajout
      setShowMapSelector(false);
      setTimeout(() => {
        setShowAddModal(true);
      }, 100);
    }
  };

  const handleCancelMap = () => {
    setShowMapSelector(false);
    setTimeout(() => {
      setShowAddModal(true);
    }, 100);
  };

  const renderAddress = ({ item }: { item: Address }) => (
    <TouchableOpacity 
      style={styles.addressCard}
      onPress={() => handleSelectAddress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.addressContent}>
        <View style={styles.addressHeader}>
          <Text style={styles.addressLabel}>{item.label}</Text>
          {item.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Défaut</Text>
            </View>
          )}
        </View>
        <Text style={styles.addressStreet}>{item.street}</Text>
        {item.coordinates && (
          <Text style={styles.coordinatesText}>
            📍 {item.coordinates.latitude.toFixed(4)}, {item.coordinates.longitude.toFixed(4)}
          </Text>
        )}
      </View>
      
      <View style={styles.addressActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleSetDefault(item.id)}
        >
          <Ionicons name="checkmark-circle" size={20} color={item.isDefault ? "#8B4513" : "#CCC"} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => openEditModal(item)}
        >
          <Ionicons name="create-outline" size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleDelete(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#E74C3C" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      {/* Header */}
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        )}
        <Text style={[styles.headerTitle, onBack && styles.headerTitleWithBack]}>Mes adresses</Text>
        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Ionicons name="add" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Current Location */}
      {currentLocation && (
        <View style={styles.currentLocationCard}>
          <View style={styles.currentLocationHeader}>
            <Ionicons name="location" size={20} color="#8B4513" />
            <Text style={styles.currentLocationTitle}>Adresse actuelle</Text>
          </View>
          <Text style={styles.currentLocationStreet}>{currentLocation.street}</Text>
        </View>
      )}

      {/* Saved Addresses */}
      <FlatList
        data={savedAddresses}
        renderItem={renderAddress}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="location-outline" size={60} color="#CCC" />
            <Text style={styles.emptyText}>Aucune adresse enregistrée</Text>
            <Text style={styles.emptySubtext}>Ajoutez vos adresses pour une livraison rapide</Text>
            <TouchableOpacity style={styles.emptyAddButton} onPress={openAddModal}>
              <Ionicons name="add" size={20} color="#FFF" />
              <Text style={styles.emptyAddButtonText}>Ajouter une adresse</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Add/Edit Modal */}
      <Modal visible={showAddModal} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleCancelAdd}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingAddress ? 'Modifier l\'adresse' : 'Ajouter une adresse'}
            </Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.inputLabel}>Nom de l'adresse</Text>
            <TextInput
              style={styles.input}
              value={formData.label}
              onChangeText={(text) => setFormData({ ...formData, label: text })}
              placeholder="Ex: Maison, Bureau..."
            />

            <Text style={styles.inputLabel}>Adresse complète</Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: tempCoordinates ? '#F0F8F0' : '#F5F5F5' }]}
              value={formData.street}
              onChangeText={(text) => setFormData({ ...formData, street: text })}
              placeholder={isGeocoding ? "Récupération de l'adresse..." : tempCoordinates ? "Adresse obtenue de la carte..." : "Rue, quartier, ville..."}
              multiline
              editable={!tempCoordinates && !isGeocoding} // Désactiver si coordonnées sont définies ou géocodage en cours
            />
            {isGeocoding && (
              <Text style={styles.geocodingNote}>
                ⏳ Récupération de l'adresse en cours...
              </Text>
            )}
            {tempCoordinates && !isGeocoding && (
              <Text style={styles.geocodedNote}>
                Adresse obtenue automatiquement de votre sélection sur la carte
              </Text>
            )}

            <TouchableOpacity 
              style={styles.mapSelectorButton}
              onPress={openMapSelector}
            >
              <Ionicons name="map-outline" size={20} color="#8B4513" />
              <Text style={styles.mapSelectorText}>
                {tempCoordinates ? 'Position sélectionnée' : 'Choisir sur la carte'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>
                {editingAddress ? 'Mettre à jour' : 'Ajouter'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Map Selector Modal */}
      <Modal visible={showMapSelector} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.mapModalContainer}>
          <View style={styles.mapModalHeader}>
            <TouchableOpacity onPress={handleCancelMap}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.mapModalTitle}>Sélectionner la position</Text>
            <View style={{ width: 24 }} />
          </View>

          <MapView
            style={styles.map}
            initialRegion={{
              latitude: tempCoordinates?.latitude || 12.6395,
              longitude: tempCoordinates?.longitude || -8.0065,
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

          <View style={styles.mapModalActions}>
            <TouchableOpacity 
              style={styles.mapCancelButton}
              onPress={handleCancelMap}
            >
              <Text style={styles.mapCancelText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.mapConfirmButton, (!tempCoordinates || isGeocoding) && styles.disabledButton]}
              onPress={confirmMapSelection}
              disabled={!tempCoordinates || isGeocoding}
            >
              <Text style={styles.mapConfirmButtonText}>
                {isGeocoding ? 'Récupération en cours...' : 'Confirmer cette position'}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  headerTitleWithBack: {
    marginLeft: 10,
  },
  backButton: {
    padding: 5,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B4513',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentLocationCard: {
    margin: 15,
    padding: 15,
    backgroundColor: '#FFF8F0',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#8B4513',
  },
  currentLocationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  currentLocationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B4513',
    marginLeft: 8,
  },
  currentLocationStreet: {
    fontSize: 16,
    color: '#000',
  },
  list: {
    padding: 15,
  },
  addressCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
  },
  addressContent: {
    flex: 1,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  defaultBadge: {
    backgroundColor: '#8B4513',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 10,
  },
  defaultText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  addressStreet: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  coordinatesText: {
    fontSize: 12,
    color: '#999',
  },
  addressActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
  emptyAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B4513',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 15,
  },
  emptyAddButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingTop: Platform.OS === 'ios' ? 50 : 20, // Extra padding for iPhone notch
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  mapSelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
  },
  mapSelectorText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: '#8B4513',
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 30,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  mapModalContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  mapModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingTop: Platform.OS === 'ios' ? 50 : 20, // Extra padding for iPhone notch
  },
  mapModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
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
  mapModalActions: {
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
    backgroundColor: '#F0F0F0',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
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
  mapConfirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#CCC',
  },
  geocodedNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 5,
    marginBottom: 10,
  },
  geocodingNote: {
    fontSize: 12,
    color: '#8B4513',
    fontStyle: 'italic',
    marginTop: 5,
    marginBottom: 10,
  },
});
