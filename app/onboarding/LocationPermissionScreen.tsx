import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

export default function LocationPermissionModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
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

          <TouchableOpacity style={styles.btnPrimary} onPress={onClose}>
            <Text style={styles.btnPrimaryText}>Autoriser</Text>
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
  btnPrimaryText: { color: 'white', fontSize: 17, fontWeight: 'bold' },
  btnSecondary: { width: '100%', height: 58, borderRadius: 30, borderWidth: 1, borderColor: '#D7CCC8', justifyContent: 'center', alignItems: 'center' },
  btnSecondaryText: { color: '#8C3E22', fontSize: 16, fontWeight: '600' },
});