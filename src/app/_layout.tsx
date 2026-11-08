import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { PlayfairDisplay_700Bold, PlayfairDisplay_900Black } from '@expo-google-fonts/playfair-display';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PhoneFrame } from '@/components/Screen';
import { SyncBanner } from '@/components/SyncBanner';
import { OutingProvider, useOuting } from '@/store/outing';
import { colors, motion } from '@/theme/tokens';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [loaded, error] = useFonts({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, PlayfairDisplay_700Bold, PlayfairDisplay_900Black });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync().catch(() => {});
  }, [loaded, error]);

  if (!loaded && !error) return <Loading />;

  return (
    <SafeAreaProvider>
      <OutingProvider>
        <PhoneFrame>
          <StatusBar style="light" />
          <Hydrated>
            <SyncBanner />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.ivory },
                animation: Platform.OS === 'web' ? 'fade' : 'default',
                animationDuration: motion.base,
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="create" />
              <Stack.Screen name="course" />
              <Stack.Screen name="hole" />
              <Stack.Screen name="scoreboard" />
              <Stack.Screen name="shop" />
              <Stack.Screen name="join" />
              <Stack.Screen name="rules" options={{ presentation: 'modal' }} />
              <Stack.Screen name="stop" options={{ presentation: 'modal' }} />
              <Stack.Screen name="host" options={{ presentation: 'modal' }} />
            </Stack>
          </Hydrated>
        </PhoneFrame>
      </OutingProvider>
    </SafeAreaProvider>
  );
}

// État de chargement global : tant que la sortie enregistrée n'est pas relue, rien ne clignote.
function Hydrated({ children }: { children: React.ReactNode }) {
  const { state } = useOuting();
  if (!state.hydrated) return <Loading />;
  return <>{children}</>;
}

function Loading() {
  return (
    <View style={styles.loading} accessibilityLabel="Chargement" accessibilityRole="progressbar">
      <ActivityIndicator color={colors.gold} />
    </View>
  );
}

const styles = StyleSheet.create({ loading: { flex: 1, backgroundColor: colors.fairway, alignItems: 'center', justifyContent: 'center' } });
