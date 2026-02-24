import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OtpScreen() {
  const router = useRouter();
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Code de vérification</Text>
        <Text style={styles.subtitle}>
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
                  isFocused && styles.otpFocused,
                  isFilled && styles.otpFilled,
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
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueText}>CONTINUE</Text>
        </TouchableOpacity>

        {/* Resend */}
        <Text style={styles.resendText}>
          Vous n’avez pas reçu l’OTP ? <Text style={styles.resendLink}>Renvoyer l’OTP</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },

  backButton: {
    padding: 20,
  },

  content: {
    flex: 1,
    alignItems: 'center',
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
    textAlign: 'center',
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
  },

  resendLink: {
    color: '#8C3E22',
    fontWeight: '600',
  },
});