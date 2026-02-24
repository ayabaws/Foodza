import React from 'react';
import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 400}}>
      <Stack.Screen name="flash" />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="welcome/[screenNumber]" />
      <Stack.Screen name="otp-verification" />
      <Stack.Screen name="otp" />
      <Stack.Screen name="location" />
    </Stack>
  );
}
