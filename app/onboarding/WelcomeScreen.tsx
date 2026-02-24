import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

interface WelcomeScreenProps {
  screenNumber: number;
}

const welcomeData = [
  {
    title: "Savourez chaque instant, sans quitter votre confort.",
    description:
      "Commandez vos plats préférés et faites-les livrer directement chez vous en quelques clics.",
    image: require('@/assets/onboarding/food1.jpeg'),
  },
  {
    title: "Une livraison rapide, suivie en temps réel.",
    description:
      "Suivez votre commande en temps réel et recevez vos plats frais et chauds.",
    image: require('@/assets/onboarding/delivery.png'),
  },
  {
    title: "Votre faim n'attend pas. Nous non plus.",
    description:
      "Livraison express garantie ou votre argent remboursé.",
    image: require('@/assets/onboarding/happy.png'),
  },
];

export default function WelcomeScreen({ screenNumber }: WelcomeScreenProps) {
  const router = useRouter();
  const currentScreen = welcomeData[screenNumber - 1];

  const maliColors = ['#14B53A', '#FCD116', '#CE1126'];

  const handleNext = () => {
    if (screenNumber < 3) {
      router.push(`/onboarding/welcome/${screenNumber + 1}`);
    } else {
      router.push('/onboarding/otp-verification');
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ImageBackground
        source={currentScreen.image}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Progress bar */}
        <View style={styles.progressContainer}>
          {[1, 2, 3].map((item, index) => (
            <View
              key={item}
              style={[
                styles.progressBar,
                item <= screenNumber && {
                  backgroundColor: maliColors[index],
                },
              ]}
            />
          ))}
        </View>

        {/* Gradient Bottom */}
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 1)']}
          style={styles.bottomContent}
        >
          <Text style={styles.title}>{currentScreen.title}</Text>

          <Text style={styles.description}>
            {currentScreen.description}
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={handleNext}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Commencer</Text>
          </TouchableOpacity>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },

  background: {
    flex: 1,
    justifyContent: 'space-between',
  },

  progressContainer: {
    flexDirection: 'row',
    paddingLeft: 30,
    paddingTop: 10,
    gap: 6,
    width: '80%',
  },

  progressBar: {
    flex: 1,
    height: 5,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },

  bottomContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
    lineHeight: 28,
  },

  description: {
    color: '#e5e5e5',
    fontSize: 14,
    marginBottom: 25,
    lineHeight: 20,
  },

  button: {
    backgroundColor: '#8C3E22',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});