import { SplashScreen as ExpoSplashScreen, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import CustomSplashScreen from './splashscreen';

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [splashAnimationComplete, setSplashAnimationComplete] = useState(false);

  useEffect(() => {
    // Hide native splash screen when custom splash is ready
    if (appReady) {
      ExpoSplashScreen.hideAsync();
    }
  }, [appReady]);

  if (!splashAnimationComplete) {
    return (
      <CustomSplashScreen 
        onAnimationComplete={() => {
          setSplashAnimationComplete(true);
          // Set app ready after a small delay to ensure smooth transition
          setTimeout(() => setAppReady(true), 500);
        }}
      />
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(tabs)/planner" />
    </Stack>
  );
}