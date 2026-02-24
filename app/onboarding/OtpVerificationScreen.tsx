import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, StatusBar, TouchableOpacity, TextInput, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function OtpVerificationScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>

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
        <View style={styles.formContainer}>
          <Text style={styles.title}>Vérification OTP</Text>
          <Text style={styles.subtitle}>Entrez votre e-mail ou numéro.</Text>

          <View style={styles.inputRow}>
            <View style={styles.countryPicker}>
              <Text style={styles.countryText}>+223</Text>
            </View>

            <View style={styles.phoneInputBox}>
              <TextInput
                style={styles.input}
                placeholder="Numero de telephone"
                placeholderTextColor="#C4C4C4"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.buttonMain} onPress={() => router.push('/onboarding/otp')}>
            <Text style={styles.buttonText}>ENVOIE OTP</Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.line} />
            <Text style={styles.ouText}>ou</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.iconCircle}>
              <Image source={require('@/assets/onboarding/google-icon.png')} style={styles.socialIcon} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconCircle}>
              <Image source={require('@/assets/onboarding/email-icon.png')} style={styles.socialIcon} />
            </TouchableOpacity>
          </View>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              En continuant, vous acceptez nos :{"\n"}
              <Text style={styles.footerLink}>Conditions d'utilisation</Text>{" "}
              <Text style={styles.footerLink}>Politique de confidentialité</Text>{"\n"}
              <Text style={styles.footerLink}>Politique de contenu</Text>
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
    backgroundColor: '#121212',
  },

  headerImageContainer: {
    height: 360,
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
  },

  wave: {
    position: 'absolute',
    bottom: -6,
    left: 0,
  },

  formContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#000',
  },

  subtitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 6,
    marginBottom: 25,
  },

  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
  },

  countryPicker: {
    width: '25%',
    height: 56,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  countryText: {
    fontWeight: '700',
    fontSize: 16,
  },

  phoneInputBox: {
    flex: 1,
    height: 56,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 16,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  input: {
    fontSize: 15,
  },

  buttonMain: {
    backgroundColor: '#000',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
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
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#EFEFEF',
  },

  ouText: {
    marginHorizontal: 10,
    color: '#999',
  },

  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },

  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#EEE',
    justifyContent: 'center',
    alignItems: 'center',
  },

  socialIcon: {
    width: 22,
    height: 22,
  },

  footerContainer: {
    marginTop: 30,
  },

  footerText: {
    textAlign: 'center',
    fontSize: 10,
    color: '#999',
    lineHeight: 16,
  },

  footerLink: {
    textDecorationLine: 'underline',
  },
});