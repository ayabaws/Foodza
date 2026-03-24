import OrderTrackingModal from '@/components/OrderTrackingModal';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { LocationProvider } from '@/contexts/LocationContext';
import { OrderProvider } from '@/contexts/OrderContext';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

function RootLayoutNav() {
  const { isDarkMode } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? '#000' : '#FFF' }}>
      <Stack screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 400,
      }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/flash" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/index" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/welcome" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/welcome/[screenNumber]" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/otp-verification" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/otp" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/LocationPermissionScreen" options={{ headerShown: false }} />
        <Stack.Screen name="restaurant" options={{ headerShown: false }} />
        <Stack.Screen name="order" options={{ headerShown: false }} />
        <Stack.Screen name="cart" options={{ headerShown: false }} />
        <Stack.Screen name="screens/assistant" options={{ headerShown: false }} />
        <Stack.Screen name="screens/settings" options={{ headerShown: false }} />
        <Stack.Screen name="screens/profile" options={{ headerShown: false }} />
        <Stack.Screen name="screens/review" options={{ headerShown: false }} />
        <Stack.Screen name="screens/favorites" options={{ headerShown: false }} />
        <Stack.Screen name="screens/search" options={{ headerShown: false }} />
        <Stack.Screen name="screens/filters" options={{ headerShown: false }} />
        <Stack.Screen name="screens/explore" options={{ headerShown: false }} />
        <Stack.Screen name="screens/order-details" options={{ headerShown: false }} />
        <Stack.Screen name="screens/order-track" options={{ headerShown: false }} />
        <Stack.Screen name="screens/all-restaurants" options={{ headerShown: false }} />
        <Stack.Screen name="screens/order-success" options={{ headerShown: false }} />
        <Stack.Screen name="screens/dine-in-not-available" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <OrderTrackingModal />
    </SafeAreaView>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <LocationProvider>
          <OrderProvider>
            <RootLayoutNav />
          </OrderProvider>
        </LocationProvider>
      </FavoritesProvider>
    </ThemeProvider>
  );
}
