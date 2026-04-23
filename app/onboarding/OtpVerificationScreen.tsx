import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375;
const isMediumScreen = width >= 375 && width < 414;
const isLargeScreen = width >= 414 && width <= 768;
const isTablet = width > 768;

export default function OtpVerificationScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const validatePhoneNumber = (number: string) => {
    // Validation pour numéro malien (commence par 7, 6, ou 5 et contient 8 chiffres)
    const phoneRegex = /^[56789]\d{7}$/;
    return phoneRegex.test(number);
  };

  const handleSendOtp = () => {
    // Réinitialiser l'erreur
    setPhoneError('');
    
    // Validation du numéro de téléphone
    if (!phoneNumber.trim()) {
      setPhoneError('Veuillez entrer un numéro de téléphone');
      return;
    }
    
    if (!validatePhoneNumber(phoneNumber.trim())) {
      setPhoneError('Format invalide. Le numéro doit commencer par 7, 6 ou 5 et contenir 8 chiffres');
      return;
    }
    
    // Si tout est valide, naviguer vers la page OTP
    router.push('/onboarding/otp');
  };

  const handlePhoneChange = (text: string) => {
    setPhoneNumber(text);
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (phoneError) {
      setPhoneError('');
    }
  };

  return (
    <View style={[styles.mainContainer, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} translucent backgroundColor="transparent" />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={true}>

        {/* HEADER IMAGE */}
        <View style={styles.headerImageContainer}>
          <Image
            source={require('@/assets/onboarding/food-header.jpg')}
            style={styles.headerImage}
          />
          {/* DARK GRADIENT OVER IMAGE */}
          <LinearGradient
            colors={['transparent', 'rgba(0, 0, 0, 1)']}
            style={styles.imageGradient}
          />

          {/* WAVE SVG */}
          <Svg
            width={width}
            height={180}
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            style={styles.wave}
          >
            <Path
              fill="#fff"
              d="
      M0,170
      C120,215 260,245 380,235
      C540,220 680,165 860,155
      C1040,145 1180,170 1320,185
      C1380,195 1410,205 1440,210
      L1440,320 L0,320 Z
    "
            />
          </Svg>
        </View>

        {/* FORM CARD */}
        <View style={[styles.formContainer, { backgroundColor: '#fff' }]}>
          <Text style={[styles.title, { color: '#000' }]}>Vérification OTP</Text>
          <Text style={[styles.subtitle, { color: '#777' }]}>Entrez votre e-mail ou numéro.</Text>

          <View style={styles.inputRow}>
            <View style={[styles.countryPicker, { backgroundColor: '#fff', borderColor: '#E6E6E6' }]}>
              <Text style={[styles.countryText, { color: '#000' }]}>+223</Text>
            </View>

            <View style={[styles.phoneInputBox, { backgroundColor: '#fff', borderColor: phoneError ? '#FF3B30' : '#E6E6E6' }]}>
              <TextInput
                style={[styles.input, { color: '#000' }]}
                placeholder="Numéro de téléphone"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={handlePhoneChange}
                maxLength={8}
              />
            </View>
          </View>

          {phoneError ? (
            <Text style={[styles.errorText, { color: '#FF3B30' }]}>
              {phoneError}
            </Text>
          ) : null}

          <TouchableOpacity style={[styles.buttonMain, { backgroundColor: colors.background2 }]} onPress={handleSendOtp}>
            <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>ENVOIE OTP</Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={[styles.line, { backgroundColor: '#EFEFEF' }]} />
            <Text style={[styles.ouText, { color: '#999' }]}>ou</Text>
            <View style={[styles.line, { backgroundColor: '#EFEFEF' }]} />
          </View>

          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.iconCircle}>
              <Image source={require('@/assets/onboarding/google-icon.png')} style={styles.socialIcon} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconCircle}>
              <Image source={require('@/assets/onboarding/email-icon.png')} style={styles.socialIcon2} />
            </TouchableOpacity>
          </View>

          <View style={styles.footerContainer}>
            <Text style={[styles.footerText, { color: '#999' }]}>
              En continuant, vous acceptez nos :{"\n"}
              <Text style={[styles.footerLink, { color: '#000' }]}>Conditions générales</Text> et{" "}
              <Text style={[styles.footerLink, { color: '#000' }]}>Politique de confidentialité</Text>
            </Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },

  headerImageContainer: {
    height: height * 0.6, // 60% de la hauteur de l'écran
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,  
  },

  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    position: 'absolute',
    top: 0,
    left: 0,
  },

  wave: {
    position: 'absolute',
    bottom: -6,
    left: 0,
  },

  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: isSmallScreen ? 16 : isMediumScreen ? 20 : isLargeScreen ? 22 : isTablet ? 28 : 24,
    paddingBottom: isSmallScreen ? 30 : isMediumScreen ? 35 : isLargeScreen ? 38 : isTablet ? 45 : 40,
    marginTop: isSmallScreen ? -20 : isMediumScreen ? -18 : -16,
  },

  title: {
    fontSize: isSmallScreen ? 18 : isMediumScreen ? 20 : isLargeScreen ? 22 : isTablet ? 26 : 22,
    fontWeight: '800',
    color: '#000',
  },

  subtitle: {
    fontSize: isSmallScreen ? 12 : isMediumScreen ? 13 : isLargeScreen ? 14 : isTablet ? 16 : 14,
    color: '#777',
    marginTop: 6,
    marginBottom: isSmallScreen ? 20 : isMediumScreen ? 22 : isLargeScreen ? 25 : isTablet ? 28 : 25,
  },

  inputRow: {
    flexDirection: 'row',
    gap: isSmallScreen ? 8 : 10,
    marginBottom: isSmallScreen ? 18 : isMediumScreen ? 20 : 22,
  },

  countryPicker: {
    width: '20%',
    height: isSmallScreen ? 48 : isMediumScreen ? 52 : isLargeScreen ? 54 : isTablet ? 60 : 56,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: isSmallScreen ? 12 : isMediumScreen ? 14 : isLargeScreen ? 15 : isTablet ? 18 : 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  countryText: {
    fontWeight: '700',
    fontSize: isSmallScreen ? 14 : isMediumScreen ? 15 : isLargeScreen ? 16 : isTablet ? 18 : 16,
  },

  phoneInputBox: {
    flex: 1,
    height: isSmallScreen ? 48 : isMediumScreen ? 52 : isLargeScreen ? 54 : isTablet ? 60 : 56,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: isSmallScreen ? 12 : isMediumScreen ? 14 : isLargeScreen ? 15 : isTablet ? 18 : 16,
    justifyContent: 'center',
    paddingHorizontal: isSmallScreen ? 8 : isMediumScreen ? 10 : 12,
    backgroundColor: '#fff',
    minWidth: 120,
  },

  input: {
    fontSize: isSmallScreen ? 14 : isMediumScreen ? 15 : isLargeScreen ? 16 : isTablet ? 18 : 16,
    textAlign: 'left',
  },

  errorText: {
    fontSize: isSmallScreen ? 10 : isMediumScreen ? 11 : isLargeScreen ? 12 : isTablet ? 13 : 12,
    marginTop: -10,
    marginBottom: 10,
    textAlign: 'center',
    width: '100%',
  },

  buttonMain: {
    backgroundColor: '#000',
    height: isSmallScreen ? 48 : isMediumScreen ? 52 : isLargeScreen ? 54 : isTablet ? 60 : 56,
    borderRadius: isSmallScreen ? 24 : isMediumScreen ? 26 : isLargeScreen ? 27 : isTablet ? 30 : 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: isSmallScreen ? 6 : 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 5,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '800',
    letterSpacing: 1,
    fontSize: isSmallScreen ? 14 : isMediumScreen ? 15 : isLargeScreen ? 16 : isTablet ? 18 : 16,
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: isSmallScreen ? 20 : isMediumScreen ? 22 : isLargeScreen ? 25 : isTablet ? 28 : 25,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#EFEFEF',
  },

  ouText: {
    marginHorizontal: isSmallScreen ? 8 : 10,
    color: '#999',
  },

  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: isSmallScreen ? 16 : isMediumScreen ? 18 : isLargeScreen ? 20 : isTablet ? 24 : 20,
  },

  iconCircle: {
    width: isSmallScreen ? 48 : isMediumScreen ? 52 : isLargeScreen ? 54 : isTablet ? 60 : 56,
    height: isSmallScreen ? 48 : isMediumScreen ? 52 : isLargeScreen ? 54 : isTablet ? 60 : 56,
    borderRadius: isSmallScreen ? 24 : isMediumScreen ? 26 : isLargeScreen ? 27 : isTablet ? 30 : 28,
    borderWidth: 1,
    borderColor: '#EEE',
    justifyContent: 'center',
    alignItems: 'center',
  },

  socialIcon: {
    width: isSmallScreen ? 28 : isMediumScreen ? 32 : isLargeScreen ? 34 : isTablet ? 40 : 35,
    height: isSmallScreen ? 28 : isMediumScreen ? 32 : isLargeScreen ? 34 : isTablet ? 40 : 35,
  },

  socialIcon2: {
    width: isSmallScreen ? 45 : isMediumScreen ? 50 : isLargeScreen ? 52 : isTablet ? 60 : 55,
    height: isSmallScreen ? 45 : isMediumScreen ? 50 : isLargeScreen ? 52 : isTablet ? 60 : 55,
  },

  footerContainer: {
    marginTop: isSmallScreen ? 24 : isMediumScreen ? 28 : isLargeScreen ? 32 : isTablet ? 40 : 30,
  },

  footerText: {
    textAlign: 'center',
    fontSize: isSmallScreen ? 9 : isMediumScreen ? 10 : isLargeScreen ? 11 : isTablet ? 12 : 10,
    color: '#999',
    lineHeight: isSmallScreen ? 14 : isMediumScreen ? 15 : isLargeScreen ? 16 : isTablet ? 18 : 16,
  },

  footerLink: {
    textDecorationLine: 'underline',
  },
});