import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

interface LocationPermissionModalProps {
  isVisible: boolean;
  onAuthorize: () => void;
  onSkip: () => void;
}

const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({
  isVisible,
  onAuthorize,
  onSkip,
}) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isVisible}
      onRequestClose={onSkip} // Android back button
    >
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <View style={styles.iconContainer}>
            {/* Icône de localisation stylisée avec fond abstrait */}
            <View style={styles.locationPinBackground}>
              <Ionicons name="location-sharp" size={40} color="white" style={styles.locationPin} />
            </View>
          </View>

          <Text style={styles.title}>Localisation</Text>
          <Text style={styles.message}>
            Autoriser les cartes à accéder à votre position pendant que vous utilisez
            l'application?
          </Text>

          <TouchableOpacity style={styles.authorizeButton} onPress={onAuthorize}>
            <Text style={styles.authorizeButtonText}>Autoriser</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
            <Text style={styles.skipButtonText}>Passer pour l'instant</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  alertBox: {
    width: width * 0.85,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  locationPinBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50', // Vert clair comme dans l'image
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  locationPin: {
    // Style additionnel pour l'icône si nécessaire
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 25,
  },
  authorizeButton: {
    backgroundColor: '#000000',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  authorizeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 2, // Double bordure comme dans l'image
    borderColor: '#D3D3D3', // Gris comme dans l'image
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#666666', // Gris comme dans l'image
    fontSize: 14,
    fontWeight: '500',
  },
});

export default LocationPermissionModal;
