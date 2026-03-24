import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, Dimensions, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 375;
const isMediumScreen = width >= 375 && width < 414;
const isLargeScreen = width >= 414 && width <= 768;
const isTablet = width > 768;

export default function OtpScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleContinue = () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      Alert.alert('Erreur', 'Veuillez entrer un code de 6 chiffres');
      return;
    }
    router.push('/home');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Header */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text.primary }]}>Code de vérification</Text>
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
          Le code de vérification a été envoyé par SMS à votre numéro.
        </Text>

        {/* OTP */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => {
            const isFocused = focusedIndex === index;
            const isFilled = !!digit;

            return (
              <TextInput
                key={index}
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={[
                  styles.otpInput,
                  { 
                    borderColor: colors.border.light,
                    color: colors.text.primary 
                  },
                  isFocused && [styles.otpFocused, { borderColor: colors.primary }],
                  isFilled && [styles.otpFilled],
                ]}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={({ nativeEvent: { key } }) => handleKeyPress(key, index)}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
                textAlignVertical="center"
                secureTextEntry={false}
                editable={true}
                selectTextOnFocus={false}
                contextMenuHidden={true}
                scrollEnabled={false}
                showSoftInputOnFocus={true}
              />
            );
          })}
        </View>

        {/* Button */}
        <TouchableOpacity style={[styles.continueButton, { backgroundColor: colors.background2 }]} onPress={handleContinue}>
          <Text style={[styles.continueText, { color: '#FFFFFF' }]}>CONTINUE</Text>
        </TouchableOpacity>

        {/* Resend */}
        <Text style={[styles.resendText, { color: colors.text.secondary }]}>
          Vous n'avez pas reçu l'OTP ? <Text style={[styles.resendLink, { color: colors.primary }]}>Renvoyer l'OTP</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  backButton: {
    padding: isSmallScreen ? 16 : isMediumScreen ? 18 : 20,
  },

  content: {
    flex: 1,
    paddingHorizontal: isSmallScreen ? 16 : isMediumScreen ? 20 : isLargeScreen ? 22 : isTablet ? 28 : 24,
    paddingTop: isSmallScreen ? 16 : isMediumScreen ? 18 : 20,
  },

  title: {
    fontSize: isSmallScreen ? 20 : isMediumScreen ? 21 : isLargeScreen ? 22 : isTablet ? 26 : 22,
    fontWeight: '700',
    marginBottom: isSmallScreen ? 6 : 8,
  },

  subtitle: {
    fontSize: isSmallScreen ? 12 : isMediumScreen ? 13 : isLargeScreen ? 14 : isTablet ? 16 : 14,
    color: '#888',
    marginBottom: isSmallScreen ? 30 : isMediumScreen ? 35 : isLargeScreen ? 40 : isTablet ? 50 : 40,
  },

  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 0,
    marginBottom: isSmallScreen ? 30 : isMediumScreen ? 35 : isLargeScreen ? 40 : isTablet ? 50 : 40,
  },

  otpInput: {
    width: isSmallScreen ? 40 : isMediumScreen ? 44 : isLargeScreen ? 48 : isTablet ? 56 : 48,
    height: isSmallScreen ? 50 : isMediumScreen ? 54 : isLargeScreen ? 58 : isTablet ? 66 : 58,
    borderRadius: isSmallScreen ? 12 : isMediumScreen ? 14 : isLargeScreen ? 15 : isTablet ? 18 : 15,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    fontSize: isSmallScreen ? 20 : isMediumScreen ? 21 : isLargeScreen ? 22 : isTablet ? 24 : 22,
    fontWeight: '600',
    color: '#000',
    backgroundColor: '#FFF',
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingTop: isSmallScreen ? 8 : isMediumScreen ? 9 : isLargeScreen ? 10 : isTablet ? 12 : 10,
    paddingBottom: isSmallScreen ? 8 : isMediumScreen ? 9 : isLargeScreen ? 10 : isTablet ? 12 : 10,
    paddingHorizontal: 0,
    includeFontPadding: false,
    lineHeight: isSmallScreen ? 34 : isMediumScreen ? 36 : isLargeScreen ? 38 : isTablet ? 42 : 38,
  },

  otpFocused: {
    borderColor: '#8C3E22', 
  },

  otpFilled: {
    borderColor: '#8C3E22',
  },

  continueButton: {
    backgroundColor: '#000',
    width: '100%',
    height: isSmallScreen ? 48 : isMediumScreen ? 52 : isLargeScreen ? 54 : isTablet ? 60 : 56,
    borderRadius: isSmallScreen ? 24 : isMediumScreen ? 26 : isLargeScreen ? 27 : isTablet ? 30 : 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: isSmallScreen ? 20 : isMediumScreen ? 22 : isLargeScreen ? 24 : isTablet ? 30 : 24,
  },

  continueText: {
    color: '#FFF',
    fontWeight: '700',
    letterSpacing: 1,
    fontSize: isSmallScreen ? 14 : isMediumScreen ? 15 : isLargeScreen ? 16 : isTablet ? 18 : 16,
  },

  resendText: {
    color: '#999',
    fontSize: isSmallScreen ? 11 : isMediumScreen ? 12 : isLargeScreen ? 13 : isTablet ? 15 : 13,
    textAlign: 'center',
  },

  resendLink: {
    color: '#8C3E22',
    fontWeight: '600',
  },
});