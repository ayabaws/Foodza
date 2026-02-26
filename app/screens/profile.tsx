import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { isDarkMode, toggleTheme, colors } = useTheme();

  const userProfile = {
    name: "Fanta Diakité",
    email: "fanta2013@gmail.com",
    phone: "+223 90 04 91 59",
    avatarUrl: null, 
    initials: "FD"
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconPadding}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Mon Compte</Text>
        <TouchableOpacity onPress={() => console.log('Modifier le profil')}>
          <Text style={[styles.modifierText, { color: colors.primary }]}>Modifier</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Profile Info avec Logique de Fallback pour l'image */}
        <View style={styles.profileSection}>
          {userProfile.avatarUrl ? (
            <Image source={{ uri: userProfile.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarFallback, { backgroundColor: colors.surface }]}>
              <Text style={[styles.avatarFallbackText, { color: colors.text.primary }]}>{userProfile.initials}</Text>
            </View>
          )}
          
          <Text style={[styles.userName, { color: colors.text.primary }]}>{userProfile.name}</Text>
          <Text style={[styles.userSubText, { color: colors.text.secondary }]}>{userProfile.email}</Text>
          <Text style={[styles.userSubText, { color: colors.text.secondary }]}>{userProfile.phone}</Text>
        </View>

        {/* SECTION GENERALE */}
        <Text style={[styles.sectionLabel, { color: colors.text.tertiary }]}>Generale</Text>
        <ProfileItem icon={<Feather name="list" size={20} color={colors.text.secondary} />} label="Mes Commandes" onPress={() => console.log('Mes commandes')} />
        <ProfileItem icon={<Feather name="credit-card" size={20} color={colors.text.secondary} />} label="Payment" onPress={() => console.log('Payment')} />
        <ProfileItem icon={<Feather name="map-pin" size={20} color={colors.text.secondary} />} label="Addresses" onPress={() => console.log('Addresses')} />
        <ProfileItem 
          icon={<Feather name="settings" size={20} color={colors.text.secondary} />} 
          label="Paramètres" 
          onPress={() => router.push('/screens/settings')} 
        />
        <ProfileItem 
          icon={<Feather name="log-out" size={20} color="#FF3B30" />} 
          label="Se déconnecter" 
          isDangerous={true}
          onPress={() => console.log('Se déconnecter')} 
        />

        {/* SECTION THEME */}
        <Text style={[styles.sectionLabel, { color: colors.text.tertiary }]}>Theme</Text>
        <View style={[styles.menuItem, { backgroundColor: colors.surface }]}>
          <View style={styles.leftSide}>
            <Feather name="moon" size={20} color={colors.text.secondary} style={styles.iconMargin} />
            <Text style={[styles.itemLabel, { color: colors.text.primary }]}>Mode sombre</Text>
          </View>
          <Switch 
            value={isDarkMode} 
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border.medium, true: colors.secondary }}
            thumbColor="#FFF"
            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const ProfileItem = ({ icon, label, onPress, isDangerous = false }: any) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity style={[styles.menuItem, { backgroundColor: colors.surface }]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.leftSide}>
        <View style={styles.iconMargin}>{icon}</View>
        <Text style={[styles.itemLabel, { color: isDangerous ? '#FF3B30' : colors.text.primary }]}>{label}</Text>
      </View>
      <Feather name="chevron-right" size={18} color={isDangerous ? "#FF3B30" : colors.text.tertiary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerTitle: { fontSize: 17, fontWeight: '700' },
  modifierText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },
  iconPadding: { padding: 5 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 30 },
  profileSection: { alignItems: 'center', marginTop: 20, marginBottom: 30 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  // Style pour le cercle avec initiales
  avatarFallback: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarFallbackText: {
    fontSize: 32,
    fontWeight: '700',
  },
  userName: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  userSubText: { fontSize: 14, marginBottom: 2 },
  sectionLabel: { fontSize: 12, marginBottom: 10, marginTop: 15, fontWeight: '500' },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  leftSide: { flexDirection: 'row', alignItems: 'center' },
  iconMargin: { marginRight: 12, width: 24, alignItems: 'center' },
  itemLabel: { fontSize: 15, fontWeight: '400' },
  modifierButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
});