import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface SettingItem {
  id: string;
  title: string;
  description: string;
  icon: any;
  type: 'toggle' | 'navigation';
  value?: boolean;
  onPress?: () => void;
}

export default function SettingsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [location, setLocation] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoOrder, setAutoOrder] = useState(false);

  const settings: SettingItem[] = [
    {
      id: '1',
      title: 'Notifications',
      description: 'Recevoir des alertes pour vos commandes',
      icon: 'notifications-outline',
      type: 'toggle',
      value: notifications,
      onPress: () => setNotifications(!notifications),
    },
    {
      id: '2',
      title: 'Localisation',
      description: 'Partager votre position pour une livraison rapide',
      icon: 'location-outline',
      type: 'toggle',
      value: location,
      onPress: () => setLocation(!location),
    },
    {
      id: '3',
      title: 'Mode sombre',
      description: 'Utiliser le thème sombre de l\'application',
      icon: 'moon-outline',
      type: 'toggle',
      value: darkMode,
      onPress: () => setDarkMode(!darkMode),
    },
    {
      id: '4',
      title: 'Commande automatique',
      description: 'Recommander des plats basés sur vos préférences',
      icon: 'sparkles-outline',
      type: 'toggle',
      value: autoOrder,
      onPress: () => setAutoOrder(!autoOrder),
    },
    {
      id: '5',
      title: 'Compte',
      description: 'Gérer vos informations personnelles',
      icon: 'person-outline',
      type: 'navigation',
      onPress: () => router.push('/screens/profile'),
    },
    {
      id: '6',
      title: 'Moyens de paiement',
      description: 'Ajouter ou supprimer des cartes de paiement',
      icon: 'card-outline',
      type: 'navigation',
      onPress: () => {},
    },
    {
      id: '7',
      title: 'Adresses de livraison',
      description: 'Gérer vos adresses de livraison',
      icon: 'location-outline',
      type: 'navigation',
      onPress: () => {},
    },
    {
      id: '8',
      title: 'Historique des commandes',
      description: 'Voir toutes vos commandes passées',
      icon: 'time-outline',
      type: 'navigation',
      onPress: () => {},
    },
    {
      id: '9',
      title: 'Préférences alimentaires',
      description: 'Allergies et restrictions alimentaires',
      icon: 'restaurant-outline',
      type: 'navigation',
      onPress: () => {},
    },
    {
      id: '10',
      title: 'Langue',
      description: 'Choisir la langue de l\'application',
      icon: 'language-outline',
      type: 'navigation',
      onPress: () => {},
    },
    {
      id: '11',
      title: 'À propos',
      description: 'Version et informations sur l\'application',
      icon: 'information-circle-outline',
      type: 'navigation',
      onPress: () => {},
    },
    {
      id: '12',
      title: 'Confidentialité',
      description: 'Politique de confidentialité et données',
      icon: 'shield-outline',
      type: 'navigation',
      onPress: () => {},
    },
  ];

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity style={styles.settingItem} onPress={item.onPress}>
      <View style={styles.settingIcon}>
        <Ionicons name={item.icon} size={24} color="#2C1810" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{item.title}</Text>
        <Text style={styles.settingDescription}>{item.description}</Text>
      </View>
      {item.type === 'toggle' ? (
        <Switch
          value={item.value}
          onValueChange={item.onPress}
          trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
          thumbColor={item.value ? '#FFFFFF' : '#FFFFFF'}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="#999" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2C1810" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paramètres</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Settings List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* General Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Général</Text>
          {settings.slice(0, 4).map(renderSettingItem)}
        </View>

        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compte</Text>
          {settings.slice(4, 9).map(renderSettingItem)}
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application</Text>
          {settings.slice(9, 12).map(renderSettingItem)}
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <TouchableOpacity style={styles.dangerItem}>
            <View style={styles.settingIcon}>
              <Ionicons name="log-out-outline" size={24} color="#FF4444" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.dangerTitle}>Déconnexion</Text>
              <Text style={styles.dangerDescription}>Se déconnecter de votre compte</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Foodza App</Text>
          <Text style={styles.versionNumber}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  headerSpacer: {
    width: 40,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  dangerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF4444',
    marginBottom: 4,
  },
  dangerDescription: {
    fontSize: 14,
    color: '#FF6666',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  versionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 5,
  },
  versionNumber: {
    fontSize: 14,
    color: '#666',
  },
});
