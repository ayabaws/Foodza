import AddressManager from '@/components/AddressManager';
import { dataService, UserProfile } from '@/services/DataService';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Dimensions, Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const isMediumScreen = screenWidth >= 375 && screenWidth < 414;
const isLargeScreen = screenWidth >= 414 && screenWidth <= 768;
const isTablet = screenWidth > 768;

export default function ProfileScreen() {
  const router = useRouter();
  const [showAddressManager, setShowAddressManager] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Charger les données utilisateur depuis le service
  useEffect(() => {
    setUserProfile(dataService.getUserProfile());
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Se déconnecter',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Se déconnecter',
          style: 'destructive',
          onPress: () => {
            // Effacer les données utilisateur locales
            dataService.clearUserData();
            // Rediriger vers la page d'accueil/onboarding
            router.replace('/onboarding/welcome/1');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconPadding}>
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: '#333333' }]}>Mon Compte</Text>
        <TouchableOpacity onPress={() => console.log('Modifier le profil')}>
          <Text style={[styles.modifierText, { color: '#BF5B30' }]}>Modifier</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Profile Info avec Logique de Fallback pour l'image */}
        {userProfile && (
          <View style={styles.profileSection}>
            {userProfile.avatarUrl ? (
              <Image source={{ uri: userProfile.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarFallback, { backgroundColor: '#F5F5F5' }]}>
                <Text style={[styles.avatarFallbackText, { color: '#333333' }]}>{userProfile.initials}</Text>
              </View>
            )}
            
            <Text style={[styles.userName, { color: '#333333' }]}>{userProfile.name}</Text>
            <Text style={[styles.userSubText, { color: '#666666' }]}>{userProfile.email}</Text>
            <Text style={[styles.userSubText, { color: '#666666' }]}>{userProfile.phone}</Text>
          </View>
        )}

        {/* SECTION GENERALE */}
        <Text style={[styles.sectionLabel, { color: '#888888' }]}>Generale</Text>
        <ProfileItem icon={<Ionicons name="heart" size={20} color="#666666" />} label="Favoris" onPress={() => router.push('/screens/favorites')} />
        <ProfileItem icon={<Feather name="list" size={20} color="#666666" />} label="Mes Commandes" onPress={() => router.push('/screens/my-orders')} />
        <ProfileItem icon={<Feather name="credit-card" size={20} color="#666666" />} label="Payment" onPress={() => console.log('Payment')} />
        <ProfileItem icon={<Feather name="map-pin" size={20} color="#666666" />} label="Addresses" onPress={() => setShowAddressManager(true)} />
        <ProfileItem 
          icon={<Feather name="settings" size={20} color="#666666" />} 
          label="Paramètres" 
          onPress={() => router.push('/screens/settings')} 
        />
        <ProfileItem 
          icon={<Feather name="log-out" size={20} color="#FF3B30" />} 
          label="Se déconnecter" 
          isDangerous={true}
          onPress={handleLogout} 
        />

      </ScrollView>

      {/* Address Manager Modal */}
      {showAddressManager && (
        <View style={StyleSheet.absoluteFill}>
          <SafeAreaView style={StyleSheet.absoluteFill}>
            <AddressManager onBack={() => setShowAddressManager(false)} />
          </SafeAreaView>
        </View>
      )}
    </SafeAreaView>
  );
}

const ProfileItem = ({ icon, label, onPress, isDangerous = false }: any) => {
  return (
    <TouchableOpacity style={[styles.menuItem, { backgroundColor: '#F5F5F5' }]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.leftSide}>
        <View style={styles.iconMargin}>{icon}</View>
        <Text style={[styles.itemLabel, { color: isDangerous ? '#FF3B30' : '#333333' }]}>{label}</Text>
      </View>
      <Feather name="chevron-right" size={18} color={isDangerous ? "#FF3B30" : "#888888"} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: isSmallScreen ? 16 : isMediumScreen ? 18 : isLargeScreen ? 20 : isTablet ? 32 : 20,
    paddingVertical: isSmallScreen ? 12 : isMediumScreen ? 14 : isLargeScreen ? 16 : isTablet ? 20 : 14,
    marginTop: 0,
  },
  headerTitle: { 
    fontSize: isSmallScreen ? 14 : isMediumScreen ? 15 : isLargeScreen ? 16 : isTablet ? 20 : 16, 
    fontWeight: '700' 
  },
  modifierText: { 
    color: '#FFFFFF', 
    fontWeight: '600', 
    fontSize: isSmallScreen ? 11 : isMediumScreen ? 12 : isLargeScreen ? 13 : isTablet ? 15 : 13 
  },
  iconPadding: { padding: 5 },
  scrollContent: { 
    paddingHorizontal: isSmallScreen ? 16 : isMediumScreen ? 18 : isLargeScreen ? 20 : isTablet ? 32 : 20, 
    paddingBottom: 30 
  },
  profileSection: { 
    alignItems: 'center', 
    marginTop: isSmallScreen ? 8 : isMediumScreen ? 10 : isLargeScreen ? 12 : isTablet ? 15 : 10, 
    marginBottom: isSmallScreen ? 20 : isMediumScreen ? 25 : isLargeScreen ? 30 : isTablet ? 35 : 25 
  },
  avatar: { 
    width: isSmallScreen ? 80 : isMediumScreen ? 90 : isLargeScreen ? 100 : isTablet ? 120 : 100, 
    height: isSmallScreen ? 80 : isMediumScreen ? 90 : isLargeScreen ? 100 : isTablet ? 120 : 100, 
    borderRadius: isSmallScreen ? 40 : isMediumScreen ? 45 : isLargeScreen ? 50 : isTablet ? 60 : 50, 
    marginBottom: isSmallScreen ? 12 : isMediumScreen ? 14 : isLargeScreen ? 15 : isTablet ? 18 : 15 
  },
  // Style pour le cercle avec initiales
  avatarFallback: {
    width: isSmallScreen ? 80 : isMediumScreen ? 90 : isLargeScreen ? 100 : isTablet ? 120 : 100,
    height: isSmallScreen ? 80 : isMediumScreen ? 90 : isLargeScreen ? 100 : isTablet ? 120 : 100,
    borderRadius: isSmallScreen ? 40 : isMediumScreen ? 45 : isLargeScreen ? 50 : isTablet ? 60 : 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: isSmallScreen ? 12 : isMediumScreen ? 14 : isLargeScreen ? 15 : isTablet ? 18 : 15,
  },
  avatarFallbackText: {
    fontSize: isSmallScreen ? 26 : isMediumScreen ? 29 : isLargeScreen ? 32 : isTablet ? 38 : 32,
    fontWeight: '700',
  },
  userName: { 
    fontSize: isSmallScreen ? 16 : isMediumScreen ? 18 : isLargeScreen ? 20 : isTablet ? 24 : 20, 
    fontWeight: '700', 
    marginBottom: 4 
  },
  userSubText: { 
    fontSize: isSmallScreen ? 10 : isMediumScreen ? 11 : isLargeScreen ? 12 : isTablet ? 14 : 12, 
    marginBottom: 2 
  },
  sectionLabel: { 
    fontSize: isSmallScreen ? 9 : isMediumScreen ? 10 : isLargeScreen ? 11 : isTablet ? 13 : 11, 
    marginBottom: isSmallScreen ? 8 : 10, 
    marginTop: isSmallScreen ? 12 : 15, 
    fontWeight: '500' 
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: isSmallScreen ? 12 : isMediumScreen ? 14 : isLargeScreen ? 16 : isTablet ? 18 : 14,
    paddingHorizontal: isSmallScreen ? 14 : isMediumScreen ? 16 : isLargeScreen ? 18 : isTablet ? 20 : 16,
    borderRadius: isSmallScreen ? 10 : isMediumScreen ? 11 : isLargeScreen ? 12 : isTablet ? 14 : 12,
    marginBottom: isSmallScreen ? 8 : 10,
  },
  leftSide: { flexDirection: 'row', alignItems: 'center' },
  iconMargin: { 
    marginRight: isSmallScreen ? 10 : 12, 
    width: isSmallScreen ? 22 : 24, 
    alignItems: 'center' 
  },
  itemLabel: { 
    fontSize: isSmallScreen ? 12 : isMediumScreen ? 13 : isLargeScreen ? 14 : isTablet ? 16 : 14, 
    fontWeight: '400' 
  },
  modifierButton: {
    paddingHorizontal: isSmallScreen ? 10 : 12,
    paddingVertical: isSmallScreen ? 5 : 6,
    borderRadius: isSmallScreen ? 6 : 8,
  },
});