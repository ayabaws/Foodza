import { dataService } from '@/services/DataService';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const router = useRouter();

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
      
      {/* Header avec Titre en Gras et centré */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
          <Ionicons name="arrow-back" size={24} color="#333333" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: '#333333' }]}>Paramètres</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* SECTION GENERALE */}
        <Text style={[styles.sectionLabel, { color: '#888888' }]}>Generale</Text>
        
        <SettingButton icon={<Feather name="repeat" size={20} color="#666666" />} label="Changer de compte" />
        
        <SettingButton 
          icon={<Ionicons name="language-outline" size={20} color="#666666" />} 
          label="Langue" 
          rightText="Français" 
        />

        {/* SECTION AUTRES */}
        <Text style={[styles.sectionLabel, { color: '#888888' }]}>Autres</Text>
        <SettingButton icon={<Feather name="lock" size={20} color="#666666" />} label="politique de confidentialité" />
        <SettingButton icon={<Feather name="message-circle" size={20} color="#666666" />} label="Assistance client" />
        <SettingButton icon={<Feather name="file-text" size={20} color="#666666" />} label="Conditions générales" />

        {/* SECTION ACTIONS DANGEREUSES */}
        <Text style={[styles.sectionLabel, { color: '#FF3B30', marginTop: 30 }]}>Actions dangereuses</Text>
        <SettingButton 
          icon={<Feather name="trash-2" size={20} color="#FF3B30" />} 
          label="Supprimer mon compte" 
          isDangerous={true}
          onPress={() => console.log('Supprimer le compte')}
        />
        <SettingButton 
          icon={<Feather name="log-out" size={20} color="#FF3B30" />} 
          label="Se déconnecter" 
          isDangerous={true}
          onPress={handleLogout}
        />

      </ScrollView>
    </SafeAreaView>
  );
}

// Composant pour les boutons individuels (Un bloc par option)
const SettingButton = ({ icon, label, rightText, onPress, isDangerous = false }: any) => {  
  return (
    <TouchableOpacity style={[styles.settingItem, { backgroundColor: '#F5F5F5' }]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.leftSide}>
        <View style={styles.iconMargin}>{icon}</View>
        <Text style={[styles.itemLabel, { color: isDangerous ? '#FF3B30' : '#333333' }]}>{label}</Text>
      </View>
      <View style={styles.rightSide}>
        {rightText && <Text style={[styles.rightText, { color: '#666666' }]}>{rightText}</Text>}
        <Feather name="chevron-right" size={18} color={isDangerous ? "#FF3B30" : "#888888"} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  backIcon: { padding: 5 },
  headerTitle: { 
    fontSize: 17, 
    fontWeight: '700', 
    textAlign: 'center'
  },
  scrollContent: { 
    paddingHorizontal: 16, 
    paddingBottom: 40 
  },
  sectionLabel: {
    fontSize: 12,
    marginBottom: 8,
    marginTop: 20,
    marginLeft: 4,
    fontWeight: '500'
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8, // L'espace entre chaque bouton
  },
  leftSide: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  iconMargin: { 
    marginRight: 12,
    width: 24,
    alignItems: 'center'
  },
  itemLabel: { 
    fontSize: 15, 
    fontWeight: '400' 
  },
  rightSide: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  rightText: { 
    marginRight: 6, 
    fontSize: 15 
  },
});