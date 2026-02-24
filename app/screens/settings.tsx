import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { isDarkMode, toggleTheme, colors } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [location, setLocation] = useState(true);
  const [autoOrder, setAutoOrder] = useState(false);

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
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Paramètres</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* General Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text.primary, borderBottomColor: colors.border.light }]}>General</Text>
          
          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border.light }]}>
            <View style={[styles.menuIcon, { backgroundColor: colors.border.medium }]}>
              <Ionicons name="notifications-outline" size={24} color={colors.text.primary} />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuText, { color: colors.text.primary }]}>Notifications</Text>
              <Text style={[styles.menuDescription, { color: colors.text.secondary }]}>Receive alerts about your orders</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#333333', true: '#4CAF50' }}
              thumbColor={notifications ? '#FFFFFF' : '#FFFFFF'}
            />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: colors.border.light }]}>
            <View style={[styles.menuIcon, { backgroundColor: colors.border.medium }]}>
              <Ionicons name="mail-outline" size={24} color={colors.text.primary} />
            </View>
            <View style={styles.menuContent}>
              <Text style={[styles.menuText, { color: colors.text.primary }]}>Email</Text>
              <Text style={[styles.menuDescription, { color: colors.text.secondary }]}>Receive offers by email</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#333333', true: '#4CAF50' }}
              thumbColor={notifications ? '#FFFFFF' : '#FFFFFF'}
            />
          </TouchableOpacity>
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="location-outline" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuText}>Location</Text>
              <Text style={styles.menuDescription}>Share your location for fast delivery</Text>
            </View>
            <Switch
              value={location}
              onValueChange={setLocation}
              trackColor={{ false: '#333333', true: '#4CAF50' }}
              thumbColor={location ? '#FFFFFF' : '#FFFFFF'}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="finger-print-outline" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuText}>Biometric</Text>
              <Text style={styles.menuDescription}>Use your fingerprint</Text>
            </View>
            <Switch
              value={false}
              onValueChange={() => {}}
              trackColor={{ false: '#333333', true: '#4CAF50' }}
              thumbColor="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        {/* App Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="moon-outline" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuText}>Dark Mode</Text>
              <Text style={styles.menuDescription}>Use dark theme for the app</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: '#333333', true: '#4CAF50' }}
              thumbColor={isDarkMode ? '#FFFFFF' : '#FFFFFF'}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="language-outline" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuText}>Language</Text>
              <Text style={styles.menuDescription}>French</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="sync-outline" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuText}>Auto Order</Text>
              <Text style={styles.menuDescription}>Recommend orders based on your preferences</Text>
            </View>
            <Switch
              value={autoOrder}
              onValueChange={setAutoOrder}
              trackColor={{ false: '#333333', true: '#4CAF50' }}
              thumbColor={autoOrder ? '#FFFFFF' : '#FFFFFF'}
            />
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="help-circle-outline" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuText}>Help</Text>
              <Text style={styles.menuDescription}>Help center and FAQ</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="chatbubble-outline" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuText}>Contact Us</Text>
              <Text style={styles.menuDescription}>Send message to support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="document-text-outline" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuText}>Terms of Service</Text>
              <Text style={styles.menuDescription}>Read our terms of use</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIcon}>
              <Ionicons name="shield-outline" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuText}>Privacy Policy</Text>
              <Text style={styles.menuDescription}>How we protect your data</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666666" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.surface }]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#FF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* App Version */}
        <View style={styles.versionSection}>
          <Text style={[styles.versionText, { color: colors.text.secondary }]}>Foodza v1.0.0</Text>
        </View>
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
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#1A1A1A',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 12,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuContent: {
    flex: 1,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  menuDescription: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A1A',
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
  versionSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#666666',
  },
});
