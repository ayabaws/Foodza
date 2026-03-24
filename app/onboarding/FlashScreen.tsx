import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, Image as RNImage, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const isMediumScreen = screenWidth >= 375 && screenWidth < 414;
const isLargeScreen = screenWidth >= 414;
const isTablet = screenWidth > 768;

export default function FlashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8C3E22" />
      <View style={styles.content}>
        <RNImage
          source={require('@/assets/images/Logo2 1.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8C3E22',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: isSmallScreen ? 20 : isMediumScreen ? 25 : isLargeScreen ? 30 : isTablet ? 40 : 30,
  },
  logo: {
    width: isSmallScreen ? 220 : isMediumScreen ? 240 : isLargeScreen ? 260 : isTablet ? 320 : 260,
    height: isSmallScreen ? 220 : isMediumScreen ? 240 : isLargeScreen ? 260 : isTablet ? 320 : 260,
    tintColor: '#FFFFFF',
  },
});
