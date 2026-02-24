import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Image, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Theme } from '@/constants/theme';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { User, UserStats } from '@/types';
import { formatDate, getInitials } from '@/utils';

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = Theme.colors[colorScheme as keyof typeof Theme.colors];
  
  // Mock user data - would come from API/context
  const [user] = useState<User>({
    id: '1',
    name: 'Foodza User',
    email: 'user@foodza.com',
    phone: '+223 76 123 456',
    addresses: [],
    paymentMethods: [],
    preferences: {
      dietaryRestrictions: [],
      favoriteCuisines: ['Africaine', 'Française'],
      notifications: {
        push: true,
        email: true,
        sms: false,
        orderUpdates: true,
        promotions: true,
        newsletter: false,
      },
      language: 'fr',
      currency: 'XOF',
    },
    stats: {
      totalOrders: 156,
      totalSpent: 125000,
      favoriteRestaurants: ['1', '2', '3'],
      reviewsCount: 23,
      averageRating: 4.2,
      memberSince: new Date('2023-01-15'),
      loyaltyPoints: 1250,
    },
  });

  const [notifications, setNotifications] = useState(user.preferences.notifications.push);
  const [loading, setLoading] = useState(false);

  const handleEditProfile = () => {
    router.push('/screens/edit-profile');
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
            // Handle logout logic
            router.replace('/onboarding/flash');
          }
        },
      ]
    );
  };

  const toggleNotifications = () => {
    setNotifications(!notifications);
    // Update user preferences
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background.primary }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light' : 'dark'} backgroundColor={theme.background.primary} />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border.light }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.text.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text.primary }]}>Profile</Text>
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={() => router.push('/screens/settings')}
        >
          <Ionicons name="settings-outline" size={24} color={theme.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Profile Section */}
        <View style={[styles.profileSection, { backgroundColor: theme.background.primary }]}>
          <View style={styles.profileImageContainer}>
            <View style={[styles.profileImage, { backgroundColor: theme.brand.primary }]}>
              <Text style={styles.profileInitial}>{getInitials(user.name)}</Text>
            </View>
            <TouchableOpacity style={[styles.editProfileButton, { backgroundColor: theme.brand.secondary }]}>
              <Ionicons name="camera" size={16} color={theme.text.inverse} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.profileName, { color: theme.text.primary }]}>{user.name}</Text>
          <Text style={[styles.profileEmail, { color: theme.text.secondary }]}>{user.email}</Text>
          <Text style={[styles.profilePhone, { color: theme.text.secondary }]}>{user.phone}</Text>
          <TouchableOpacity 
            style={[styles.editInfoButton, { backgroundColor: theme.background.secondary }]} 
            onPress={handleEditProfile}
          >
            <Text style={[styles.editInfoButtonText, { color: theme.text.primary }]}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Section */}
        <Card variant="elevated" style={styles.statsSection}>
          <CardContent>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.text.primary }]}>{user.stats.totalOrders}</Text>
                <Text style={[styles.statLabel, { color: theme.text.secondary }]}>Commandes</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.text.primary }]}>{user.stats.favoriteRestaurants.length}</Text>
                <Text style={[styles.statLabel, { color: theme.text.secondary }]}>Favoris</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.text.primary }]}>{user.stats.reviewsCount}</Text>
                <Text style={[styles.statLabel, { color: theme.text.secondary }]}>Avis</Text>
              </View>
            </View>
            <View style={styles.pointsRow}>
              <Ionicons name="star" size={20} color={Theme.colors.warning} />
              <Text style={[styles.pointsText, { color: theme.text.secondary }]}>
                {user.stats.loyaltyPoints} points fidélité
              </Text>
            </View>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <Card variant="default" style={styles.menuSection}>
          <CardContent>
            <TouchableOpacity 
              style={[styles.menuItem, { borderBottomColor: theme.border.light }]}
              onPress={() => router.push('/order')}
            >
              <View style={[styles.menuIcon, { backgroundColor: theme.background.secondary }]}>
                <Ionicons name="cart-outline" size={24} color={theme.text.primary} />
              </View>
              <Text style={[styles.menuTitle, { color: theme.text.primary }]}>Mes Commandes</Text>
              <View style={styles.menuBadge}>
                <Text style={styles.menuBadgeText}>2</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.text.tertiary} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.border.light }]}>
              <View style={[styles.menuIcon, { backgroundColor: theme.background.secondary }]}>
                <Ionicons name="heart-outline" size={24} color={theme.text.primary} />
              </View>
              <Text style={[styles.menuTitle, { color: theme.text.primary }]}>Favoris</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.text.tertiary} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.border.light }]}>
              <View style={[styles.menuIcon, { backgroundColor: theme.background.secondary }]}>
                <Ionicons name="location-outline" size={24} color={theme.text.primary} />
              </View>
              <Text style={[styles.menuTitle, { color: theme.text.primary }]}>Adresses de Livraison</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.text.tertiary} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.border.light }]}>
              <View style={[styles.menuIcon, { backgroundColor: theme.background.secondary }]}>
                <Ionicons name="card-outline" size={24} color={theme.text.primary} />
              </View>
              <Text style={[styles.menuTitle, { color: theme.text.primary }]}>Moyens de Paiement</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.text.tertiary} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.border.light }]}>
              <View style={[styles.menuIcon, { backgroundColor: theme.background.secondary }]}>
                <Ionicons name="notifications-outline" size={24} color={theme.text.primary} />
              </View>
              <Text style={[styles.menuTitle, { color: theme.text.primary }]}>Notifications</Text>
              <Switch
                value={notifications}
                onValueChange={toggleNotifications}
                trackColor={{ false: theme.border.medium, true: theme.brand.secondary }}
                thumbColor={theme.text.inverse}
              />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuItem, { borderBottomColor: theme.border.light }]}
              onPress={() => router.push('/screens/assistant')}
            >
              <View style={[styles.menuIcon, { backgroundColor: theme.background.secondary }]}>
                <Ionicons name="chatbubble-outline" size={24} color={theme.text.primary} />
              </View>
              <Text style={[styles.menuTitle, { color: theme.text.primary }]}>Assistant</Text>
              <View style={styles.menuBadge}>
                <Text style={styles.menuBadgeText}>NEW</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.text.tertiary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuItem, { borderBottomColor: theme.border.light }]}
              onPress={() => router.push('/screens/settings')}
            >
              <View style={[styles.menuIcon, { backgroundColor: theme.background.secondary }]}>
                <Ionicons name="settings-outline" size={24} color={theme.text.primary} />
              </View>
              <Text style={[styles.menuTitle, { color: theme.text.primary }]}>Paramètres</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.text.tertiary} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.border.light }]}>
              <View style={[styles.menuIcon, { backgroundColor: theme.background.secondary }]}>
                <Ionicons name="help-circle-outline" size={24} color={theme.text.primary} />
              </View>
              <Text style={[styles.menuTitle, { color: theme.text.primary }]}>Aide & Support</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.text.tertiary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={[styles.menuIcon, { backgroundColor: theme.background.secondary }]}>
                <Ionicons name="document-text-outline" size={24} color={theme.text.primary} />
              </View>
              <Text style={[styles.menuTitle, { color: theme.text.primary }]}>Conditions Générales</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.text.tertiary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={[styles.menuIcon, { backgroundColor: theme.background.secondary }]}>
                <Ionicons name="shield-outline" size={24} color={theme.text.primary} />
              </View>
              <Text style={[styles.menuTitle, { color: theme.text.primary }]}>Politique de Confidentialité</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.text.tertiary} />
            </TouchableOpacity>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button
          variant="ghost"
          onPress={handleLogout}
          style={styles.logoutButton}
          loading={loading}
        >
          <Ionicons name="log-out-outline" size={24} color={Theme.colors.error} />
          <Text style={[styles.logoutText, { color: Theme.colors.error }]}>Déconnexion</Text>
        </Button>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: theme.text.tertiary }]}>Foodza App v1.0.0</Text>
          <Text style={[styles.memberSinceText, { color: theme.text.tertiary }]}>
            Membre depuis {formatDate(user.stats.memberSince, 'short')}
          </Text>
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
    paddingHorizontal: Theme.spacing.screen.horizontal,
    paddingVertical: Theme.spacing.screen.vertical,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: Theme.spacing.sm,
  },
  headerTitle: {
    ...Theme.typography.styles.h4,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: Theme.spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    padding: Theme.spacing.xxl,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: Theme.spacing.lg,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: 'bold',
  },
  editProfileButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileName: {
    ...Theme.typography.styles.h3,
    marginBottom: Theme.spacing.sm,
  },
  profileEmail: {
    ...Theme.typography.styles.body2,
    marginBottom: Theme.spacing.xs,
  },
  profilePhone: {
    ...Theme.typography.styles.body2,
    marginBottom: Theme.spacing.md,
  },
  editInfoButton: {
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.xl,
  },
  editInfoButtonText: {
    ...Theme.typography.styles.buttonSmall,
    fontWeight: '600',
  },
  statsSection: {
    marginHorizontal: Theme.spacing.screen.horizontal,
    marginBottom: Theme.spacing.section.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Theme.spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E5E5',
  },
  statNumber: {
    ...Theme.typography.styles.h4,
    marginBottom: Theme.spacing.xs,
  },
  statLabel: {
    ...Theme.typography.styles.caption,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  pointsText: {
    ...Theme.typography.styles.body2,
    marginLeft: Theme.spacing.sm,
  },
  menuSection: {
    marginHorizontal: Theme.spacing.screen.horizontal,
    marginBottom: Theme.spacing.section.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.lg,
    borderBottomWidth: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  menuTitle: {
    ...Theme.typography.styles.body1,
    flex: 1,
    fontWeight: '500',
  },
  menuBadge: {
    backgroundColor: '#FF4444',
    borderRadius: Theme.borderRadius.md,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.sm,
  },
  menuBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  logoutButton: {
    marginHorizontal: Theme.spacing.screen.horizontal,
    marginBottom: Theme.spacing.section.sm,
  },
  logoutText: {
    ...Theme.typography.styles.button,
    fontWeight: 'bold',
    marginLeft: Theme.spacing.sm,
  },
  versionContainer: {
    alignItems: 'center',
    paddingBottom: Theme.spacing.xxl,
  },
  versionText: {
    ...Theme.typography.styles.caption,
  },
  memberSinceText: {
    ...Theme.typography.styles.caption,
    marginTop: Theme.spacing.xs,
  },
});
