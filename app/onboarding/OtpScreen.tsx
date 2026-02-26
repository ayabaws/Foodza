import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/contexts/ThemeContext';

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
    padding: 20,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 40,
  },

  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 40,
  },

  otpInput: {
    width: 48,
    height: 48,
    borderRadius: 15,        
    borderWidth: 2,
    borderColor: '#E5E5E5',
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    backgroundColor: '#FFF',
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
    height: 56,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },

  continueText: {
    color: '#FFF',
    fontWeight: '700',
    letterSpacing: 1,
  },

  resendText: {
    color: '#999',
    fontSize: 13,
    textAlign: 'center',
  },

  resendLink: {
    color: '#8C3E22',
    fontWeight: '600',
  },
});