import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { isDarkMode, toggleTheme, colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      {/* Header avec Titre en Gras et centré */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text.primary }]}>Paramètres</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* SECTION GENERALE */}
        <Text style={[styles.sectionLabel, { color: colors.text.tertiary }]}>Generale</Text>
        
        <SettingButton icon={<Feather name="repeat" size={20} color={colors.text.secondary} />} label="Changer de compte" />
        
        <SettingButton 
          icon={<Ionicons name="language-outline" size={20} color={colors.text.secondary} />} 
          label="Langue" 
          rightText="Français" 
        />

        <View style={[styles.settingItem, { backgroundColor: colors.surface }]}>
          <View style={styles.leftSide}>
            <Feather name="moon" size={20} color={colors.text.secondary} style={styles.iconMargin} />
            <Text style={[styles.itemLabel, { color: colors.text.primary }]}>Mode sombre</Text>
          </View>
          <Switch 
            value={isDarkMode} 
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border.medium, true: colors.secondary }}
            thumbColor="#FFF"
            ios_backgroundColor={colors.border.medium}
            style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
          />
        </View>

        {/* SECTION AUTRES */}
        <Text style={[styles.sectionLabel, { color: colors.text.tertiary }]}>Autres</Text>
        <SettingButton icon={<Feather name="lock" size={20} color={colors.text.secondary} />} label="politique de confidentialité" />
        <SettingButton icon={<Feather name="message-circle" size={20} color={colors.text.secondary} />} label="Assistance client" />
        <SettingButton icon={<Feather name="file-text" size={20} color={colors.text.secondary} />} label="Conditions générales" />

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
          onPress={() => console.log('Se déconnecter')}
        />

      </ScrollView>
    </SafeAreaView>
  );
}

// Composant pour les boutons individuels (Un bloc par option)
const SettingButton = ({ icon, label, rightText, onPress, isDangerous = false }: any) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity style={[styles.settingItem, { backgroundColor: colors.surface }]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.leftSide}>
        <View style={styles.iconMargin}>{icon}</View>
        <Text style={[styles.itemLabel, { color: isDangerous ? '#FF3B30' : colors.text.primary }]}>{label}</Text>
      </View>
      <View style={styles.rightSide}>
        {rightText && <Text style={[styles.rightText, { color: colors.text.secondary }]}>{rightText}</Text>}
        <Feather name="chevron-right" size={18} color={isDangerous ? "#FF3B30" : colors.text.tertiary} />
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