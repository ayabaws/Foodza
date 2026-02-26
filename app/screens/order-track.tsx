import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function OrderTrackScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border.light }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Order Track</Text>
        <TouchableOpacity onPress={() => router.push('/screens/assistant')}>
          <Ionicons name="call" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Map Placeholder avec Wave */}
      <View style={styles.mapWrapper}>
        <View style={[styles.mapPlaceholder, { backgroundColor: colors.border.light }]}>
          <Ionicons name="map-outline" size={60} color={colors.text.tertiary} />
          <Text style={[styles.mapPlaceholderText, { color: colors.text.primary }]}>Carte de suivi</Text>
          <Text style={[styles.mapPlaceholderSubtext, { color: colors.text.secondary }]}>Votre commande est en route</Text>
        </View>

        {/* Wave SVG */}
        <Svg
          height={100}
          width={width}
          viewBox={`0 0 ${width} 100`}
          style={styles.wave}
        >
          <Path
            d={`M0 0 Q ${width / 2} 120 ${width} 0 L ${width} 100 L 0 100 Z`}
            fill={colors.surface}
          />
        </Svg>
      </View>

      {/* Delivery Card */}
      <View style={[styles.deliveryCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.deliveryStatus, { color: colors.text.primary }]}>Your order is already on the way!</Text>
        <View style={styles.deliveryInfo}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Ionicons name="person" size={24} color="#fff" />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={[styles.driverName, { color: colors.text.primary }]}>Bambang Suryana</Text>
            <Text style={[styles.driverId, { color: colors.text.secondary }]}>AB 1234 CDE</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.border.light }]}>
              <Ionicons name="call" size={20} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.border.light }]}>
              <Ionicons name="chatbubble" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={[styles.orderReceiveButton, { backgroundColor: colors.primary }]}>
          <Text style={styles.orderReceiveText}>Order Receive</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },

  mapWrapper: { height: height * 0.45, position: 'relative' },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    borderRadius: 12,
  },
  mapPlaceholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  mapPlaceholderSubtext: {
    fontSize: 16,
    marginTop: 10,
  },
  wave: { position: 'absolute', bottom: 0 },

  deliveryCard: {
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    marginTop: -30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  deliveryStatus: { fontSize: 16, marginBottom: 15, fontWeight: 'bold' },
  deliveryInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  driverName: { fontSize: 16, fontWeight: 'bold' },
  driverId: { fontSize: 14 },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  orderReceiveButton: {
    marginTop: 20,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  orderReceiveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});