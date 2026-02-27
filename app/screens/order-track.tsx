import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const BRAND_BROWN = '#6D3119';

export default function OrderTrackScreen() {
  const router = useRouter();

  // --- VARIABLES À CONNECTER AU BACKEND ---
  const orderData = {
    statusMessage: "Le livreur est en route vers ACI 2000",
    estimatedTime: "12 mins",
    distanceRemaining: "300m",
    totalAmount: "9500 CFA",
    deliveryAddress: "Villa 45, Rue 14 ACI 2000",
    restaurantName: "Restaurant Le Loft",
    coords: {
      restaurant: { latitude: 12.6338, longitude: -8.0003 },
      delivery: { latitude: 12.6395, longitude: -8.0065 },
      destination: { latitude: 12.6285, longitude: -8.0210 },
    }
  };

  const customMapStyle = [
    { "elementType": "geometry", "stylers": [{ "color": "#fdfcf8" }] },
    { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
    { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }] },
    { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#c9c9c9" }] }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* --- HEADER NOIR --- */}
      <View style={styles.darkHeader}>
        <SafeAreaView edges={['top']}>
          <View style={styles.navBar}>
            <TouchableOpacity style={styles.whiteCircleBtn} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={22} color="black" />
            </TouchableOpacity>
            <Text style={styles.navTitle}>Suivi de commande</Text>
            <TouchableOpacity style={styles.whiteCircleBtn}>
              <MaterialCommunityIcons name="target" size={22} color="black" />
            </TouchableOpacity>
          </View>

          <View style={styles.statusBox}>
            <Text style={styles.statusText}>{orderData.statusMessage}</Text>
            <TouchableOpacity style={styles.timeBadge}>
              <Text style={styles.timeText}>Arrive dans {orderData.estimatedTime}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      {/* --- SECTION CARTE --- */}
      <View style={styles.mapWrapper}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFillObject}
          customMapStyle={customMapStyle}
          initialRegion={{
            latitude: orderData.coords.delivery.latitude,
            longitude: orderData.coords.delivery.longitude,
            latitudeDelta: 0.025,
            longitudeDelta: 0.025,
          }}
        >
          <Polyline
            coordinates={[orderData.coords.delivery, orderData.coords.destination]}
            strokeColor={BRAND_BROWN}
            strokeWidth={4}
          />

          {/* DÉPART : Restaurant */}
          <Marker coordinate={orderData.coords.restaurant} title={orderData.restaurantName}>
            <View style={styles.markerCircleWhite}>
              <Ionicons name="restaurant" size={14} color={BRAND_BROWN} />
            </View>
          </Marker>

          {/* LIVREUR */}
          <Marker coordinate={orderData.coords.delivery} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={styles.deliveryMarker}>
              <MaterialCommunityIcons name="motorbike" size={22} color="white" />
            </View>
          </Marker>

          {/* DESTINATION */}
          <Marker coordinate={orderData.coords.destination} title="Votre domicile">
            <View style={styles.destinationMarkerContainer}>
              <View style={styles.etaBubble}>
                <Text style={styles.etaText}>{orderData.distanceRemaining}</Text>
              </View>
              <View style={styles.markerDestinationBrown}>
                <Ionicons name="location" size={16} color="white" />
              </View>
            </View>
          </Marker>
        </MapView>

        {/* --- CARTE DE PAIEMENT --- */}
        <View style={styles.bottomSheet}>
          <Text style={styles.addressSubtext}>Destination : {orderData.deliveryAddress}</Text>
          <TouchableOpacity style={styles.mainPayButton} activeOpacity={0.8}>
            <Text style={styles.mainPayButtonText}>Confirmer la réception ({orderData.totalAmount})</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  darkHeader: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingBottom: 35,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  whiteCircleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: { color: '#FFF', fontSize: 16, fontWeight: '500' },
  statusBox: { alignItems: 'center', marginTop: 25 },
  statusText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 20,
    paddingHorizontal: 10
  },
  timeBadge: {
    backgroundColor: BRAND_BROWN,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  timeText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  mapWrapper: { flex: 1, backgroundColor: '#FFF' },
  deliveryMarker: {
    backgroundColor: BRAND_BROWN,
    padding: 7,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFF',
    elevation: 6,
  },
  markerCircleWhite: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: '#DDD', elevation: 3,
  },
  markerDestinationBrown: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: BRAND_BROWN, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#FFF', elevation: 5,
  },
  destinationMarkerContainer: { alignItems: 'center' },
  etaBubble: {
    backgroundColor: '#FFF',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    elevation: 3,
  },
  etaText: { fontSize: 11, fontWeight: 'bold', color: '#000' },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 25,
    paddingTop: 25,
    paddingBottom: Platform.OS === 'ios' ? 40 : 25,
    alignItems: 'center',
    elevation: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
  },
  addressSubtext: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 15,
  },
  mainPayButton: {
    backgroundColor: '#000',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  mainPayButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});