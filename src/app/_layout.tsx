import { Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black, useFonts } from '@expo-google-fonts/nunito';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { Platform, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PhoneFrame } from '@/components/Screen';
import { SyncBanner } from '@/components/SyncBanner';
import { OutingProvider } from '@/store/outing';
import { colors } from '@/theme/tokens';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [loaded] = useFonts({ Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync().catch(() => {});
  }, [loaded]);

  if (!loaded) return <View style={{ flex: 1, backgroundColor: colors.pubRed }} />;

  return (
    <SafeAreaProvider>
      <OutingProvider>
        <PhoneFrame>
          <StatusBar style="light" />
          <SyncBanner />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.cream },
              animation: Platform.OS === 'web' ? 'fade' : 'default',
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="create" />
            <Stack.Screen name="course" />
            <Stack.Screen name="hole" />
            <Stack.Screen name="scoreboard" />
            <Stack.Screen name="shop" />
            <Stack.Screen name="stop" options={{ presentation: 'modal' }} />
            <Stack.Screen name="host" options={{ presentation: 'modal' }} />
          </Stack>
        </PhoneFrame>
      </OutingProvider>
    </SafeAreaProvider>
  );
}
