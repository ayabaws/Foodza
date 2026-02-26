import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  StatusBar,
  TouchableOpacity,
  Dimensions,
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
      "Foodza vous connecte aux meilleurs restaurants de votre ville pour vous offrir des plats frais et authentiques. En quelques clics, votre repas est déjà en route.",
    image: require('@/assets/onboarding/food1.jpeg'),
  },
  {
    title: "Une livraison rapide, suivie en temps réel.",
    description:
      "Nos livreurs prennent votre commande en charge avec soin. Suivez votre repas sur la carte et sachez exactement quand il arrive.",
    image: require('@/assets/onboarding/delivery.png'),
  },
  {
    title: "Votre faim n'attend pas. Nous non plus.",
    description:
      "Déjeuner, dîner ou envie soudaine, Foodza transforme chaque commande en un moment simple, rapide et délicieux.",
    image: require('@/assets/onboarding/happy.png'),
  },
];

export default function WelcomeScreen({ screenNumber }: WelcomeScreenProps) {
  const router = useRouter();
  const currentScreen = welcomeData[screenNumber - 1];

  const { width, height } = Dimensions.get('window');
  const isSmallScreen = width < 375;
  const isTablet = width > 768;

  const maliColors = ['#14B53A', '#FCD116', '#CE1126'];

  const handleNext = () => {
    if (screenNumber < 3) {
      router.push(`/onboarding/welcome/${screenNumber + 1}`);
    } else {
      router.push('/onboarding/otp-verification');
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ImageBackground
        source={currentScreen.image}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Progress bar */}
        <View style={[
          styles.progressContainer,
          { paddingTop: isSmallScreen ? 50 : 70 }
        ]}>
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
          style={[
            styles.bottomContent,
            { paddingHorizontal: isSmallScreen ? 15 : 20 }
          ]}
        >
          <Text style={[
            styles.title,
            { 
              fontSize: isSmallScreen ? 24 : isTablet ? 34 : 28,
              lineHeight: isSmallScreen ? 28 : isTablet ? 36 : 32
            }
          ]}>
            {currentScreen.title}
          </Text>

          <Text style={[
            styles.description,
            { 
              fontSize: isSmallScreen ? 11 : isTablet ? 15 : 13,
              lineHeight: isSmallScreen ? 16 : isTablet ? 20 : 18
            }
          ]}>
            {currentScreen.description}
          </Text>

          <TouchableOpacity
            style={[
              styles.button,
              { 
                paddingVertical: isSmallScreen ? 12 : 14,
                maxWidth: isTablet ? 300 : '100%',
                alignSelf: isTablet ? 'center' : 'stretch'
              }
            ]}
            onPress={handleNext}
            activeOpacity={0.85}
          >
            <Text style={[
              styles.buttonText,
              { fontSize: isSmallScreen ? 14 : 16 }
            ]}>
              Commencer
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </ImageBackground>
    </View>
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
    paddingTop: 70,
    gap: 6,
    width: '80%',
    alignSelf: 'flex-start',
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
    paddingTop: 20,
  },

  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '500',
    marginBottom: 15,
    lineHeight: 28,
    width: '80%',
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
    marginTop: 10,
    shadowColor: '#fff',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});