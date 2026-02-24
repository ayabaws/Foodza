import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Image, Switch, Alert, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { isDarkMode, toggleTheme, colors } = useTheme();

  const handleEditProfile = () => {
    Alert.alert(
      'Modifier le profil',
      'Fonctionnalité de modification du profil',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Modifier', onPress: () => {
          console.log('Modification du profil');
        }}
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Déconnexion', 
          style: 'destructive',
          onPress: () => {
            router.replace('/onboarding/FlashScreen');
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border.light }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Profile</Text>
        <TouchableOpacity style={styles.settingsButton} onPress={handleEditProfile}>
          <Ionicons name="create-outline" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <View style={[styles.profileImage, { backgroundColor: colors.primary }]}>
              <Text style={styles.profileInitial}>F</Text>
            </View>
          </View>
          <Text style={[styles.profileName, { color: colors.text.primary }]}>Fanta Coulibaly</Text>
          <Text style={[styles.profileEmail, { color: colors.text.secondary }]}>fanta2013@gmail.com</Text>
          <Text style={[styles.profilePhone, { color: colors.text.secondary }]}>+223 9004 91 59</Text>
        </View>

        {/* General Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary, borderBottomColor: colors.border.light }]}>Generale</Text>
          
          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border.light }]}>
            <View style={[styles.menuIcon, { backgroundColor: colors.border.medium }]}>
              <Ionicons name="list-outline" size={24} color={colors.text.primary} />
            </View>
            <Text style={[styles.menuText, { color: colors.text.primary }]}>Mes Commandes</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border.light }]}>
            <View style={[styles.menuIcon, { backgroundColor: colors.border.medium }]}>
              <Ionicons name="card-outline" size={24} color={colors.text.primary} />
            </View>
            <Text style={[styles.menuText, { color: colors.text.primary }]}>Payment</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border.light }]}>
            <View style={[styles.menuIcon, { backgroundColor: colors.border.medium }]}>
              <Ionicons name="location-outline" size={24} color={colors.text.primary} />
            </View>
            <Text style={[styles.menuText, { color: colors.text.primary }]}>Addresses</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border.light }]} onPress={() => router.push('/screens/settings')}>
            <View style={[styles.menuIcon, { backgroundColor: colors.border.medium }]}>
              <Ionicons name="settings-outline" size={24} color={colors.text.primary} />
            </View>
            <Text style={[styles.menuText, { color: colors.text.primary }]}>Paramètres</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text.tertiary} />
          </TouchableOpacity>
        </View>

        {/* Theme Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary, borderBottomColor: colors.border.light }]}>Theme</Text>
          
          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border.light }]}>
            <View style={[styles.menuIcon, { backgroundColor: colors.border.medium }]}>
              <Ionicons name="moon-outline" size={24} color={colors.text.primary} />
            </View>
            <Text style={[styles.menuText, { color: colors.text.primary }]}>Mode sombre</Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border.medium, true: colors.secondary }}
              thumbColor={colors.text.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.surface }]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#FF4444" />
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  profileImageContainer: {
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  profileEmail: {
    fontSize: 16,
    marginBottom: 5,
  },
  profilePhone: {
    fontSize: 16,
  },
  section: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 12,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginVertical: 20,
    paddingVertical: 15,
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF4444',
    marginLeft: 10,
    fontWeight: '600',
  },
});
