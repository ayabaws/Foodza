import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Dimensions,
    ImageBackground,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

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
  const scrollViewRef = useRef<ScrollView>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const { width, height } = Dimensions.get('window');
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 414;
  const isLargeScreen = width >= 414 && width <= 768;
  const isTablet = width > 768;

  const maliColors = ['#14B53A', '#FCD116', '#CE1126'];

  const handleNext = () => {
    if (screenNumber < 3) {
      router.push(`/onboarding/welcome/${screenNumber + 1}`);
    } else {
      router.push('/onboarding/otp-verification');
    }
  };

  const handleScroll = (event: any) => {
    if (isScrolling) return;
    
    const { x } = event.nativeEvent.contentOffset;
    const screenWidth = Dimensions.get('window').width;
    
    // Détection de swipe avec seuil plus sensible
    if (x < -screenWidth * 0.3 && screenNumber < 3) {
      setIsScrolling(true);
      setTimeout(() => {
        router.push(`/onboarding/welcome/${screenNumber + 1}`);
      }, 100);
    } else if (x > screenWidth * 0.3 && screenNumber > 1) {
      setIsScrolling(true);
      setTimeout(() => {
        router.push(`/onboarding/welcome/${screenNumber - 1}`);
      }, 100);
    }
  };

  const handleScrollEnd = () => {
    // Revenir au centre après scroll
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }
    setIsScrolling(false);
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.root}
      horizontal
      pagingEnabled={false}
      showsHorizontalScrollIndicator={false}
      onScroll={handleScroll}
      onScrollEndDrag={handleScrollEnd}
      scrollEventThrottle={16}
    >
      <View style={{ width: Dimensions.get('window').width }}>
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

        <ImageBackground
          source={welcomeData[screenNumber - 1].image}
          style={[styles.background, { width: '100%', height: '100%' }]}
          resizeMode="cover"
        >
          {/* Progress bar - positionné en absolu en haut */}
          <View style={[
            styles.progressContainer,
            { 
              position: 'absolute',
              top: 50, // Position pour la barre de statut
              left: isSmallScreen ? 20 : isMediumScreen ? 25 : isLargeScreen ? 28 : isTablet ? 40 : 30,
              gap: isSmallScreen ? 4 : 6,
              width: isSmallScreen ? '70%' : isMediumScreen ? '75%' : '80%',
            }
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

          {/* Gradient Bottom - positionné en absolu en bas */}
          <LinearGradient
            colors={['transparent', 'rgba(0, 0, 0, 1)']}
            style={[
              styles.bottomContent,
              { 
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                paddingHorizontal: isSmallScreen ? 12 : isMediumScreen ? 16 : isLargeScreen ? 18 : isTablet ? 25 : 20,
                paddingBottom: isSmallScreen ? 20 : isMediumScreen ? 25 : isLargeScreen ? 28 : isTablet ? 40 : 30,
                paddingTop: isSmallScreen ? 15 : isMediumScreen ? 18 : isLargeScreen ? 20 : isTablet ? 25 : 20
              }
            ]}
          >
            <Text style={[
              styles.title,
              { 
                fontSize: isSmallScreen ? 20 : isMediumScreen ? 24 : isLargeScreen ? 26 : isTablet ? 32 : 28,
                lineHeight: isSmallScreen ? 24 : isMediumScreen ? 28 : isLargeScreen ? 30 : isTablet ? 38 : 32,
                width: isSmallScreen ? '90%' : isMediumScreen ? '85%' : '80%'
              }
            ]}>
              {welcomeData[screenNumber - 1].title}
            </Text>

            <Text style={[
              styles.description,
              { 
                fontSize: isSmallScreen ? 10 : isMediumScreen ? 11 : isLargeScreen ? 12 : isTablet ? 14 : 13,
                lineHeight: isSmallScreen ? 14 : isMediumScreen ? 16 : isLargeScreen ? 18 : isTablet ? 22 : 18,
                width: isSmallScreen ? '90%' : isMediumScreen ? '85%' : '80%'
              }
            ]}>
              {welcomeData[screenNumber - 1].description}
            </Text>

            {/* Afficher le bouton "Continuer" sur les 2 premiers écrans */}
            {screenNumber < 3 && (
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.continueButton,
                  { 
                    paddingVertical: isSmallScreen ? 10 : isMediumScreen ? 12 : isLargeScreen ? 13 : isTablet ? 16 : 14,
                    maxWidth: isTablet ? 300 : '100%',
                    alignSelf: isTablet ? 'center' : 'stretch'
                  }
                ]}
                onPress={handleNext}
                activeOpacity={0.85}
              >
                <Text style={[
                  styles.buttonText,
                  styles.continueButtonText,
                  { fontSize: isSmallScreen ? 12 : isMediumScreen ? 14 : isLargeScreen ? 15 : isTablet ? 18 : 16 }
                ]}>
                  Continuer
                </Text>
              </TouchableOpacity>
            )}

            {/* Afficher le bouton "Commencer" uniquement sur le 3ème écran */}
            {screenNumber === 3 && (
              <TouchableOpacity
                style={[
                  styles.button,
                  { 
                    paddingVertical: isSmallScreen ? 10 : isMediumScreen ? 12 : isLargeScreen ? 13 : isTablet ? 16 : 14,
                    maxWidth: isTablet ? 300 : '100%',
                    alignSelf: isTablet ? 'center' : 'stretch'
                  }
                ]}
                onPress={handleNext}
                activeOpacity={0.85}
              >
                <Text style={[
                  styles.buttonText,
                  { fontSize: isSmallScreen ? 12 : isMediumScreen ? 14 : isLargeScreen ? 15 : isTablet ? 18 : 16 }
                ]}>
                  Commencer
                </Text>
              </TouchableOpacity>
            )}
          </LinearGradient>
        </ImageBackground>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },

  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  progressContainer: {
    flexDirection: 'row',
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
    marginTop: 5,
  
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
  },

  continueButton: {
    backgroundColor: '#fff',
    shadowColor: '#000',
  },

  continueButtonText: {
    color: '#8C3E22',
    fontWeight: '600',
  },
});