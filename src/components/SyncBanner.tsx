import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useOuting } from '@/store/outing';
import { colors } from '@/theme/tokens';
import { useOnline } from './useOnline';
import { T } from './T';

// Bandeau d'état réseau : la feuille de score est partagée en direct ; hors ligne, les actions attendent le retour.
export function SyncBanner() {
  const online = useOnline();
  const { state, dispatch } = useOuting();
  useEffect(() => {
    if (online && state.pendingSync > 0) {
      const t = setTimeout(() => dispatch({ type: 'syncFlushed' }), 900);
      return () => clearTimeout(t);
    }
  }, [online, state.pendingSync, dispatch]);
  if (online && state.pendingSync === 0) return null;
  const text = !online
    ? `Hors ligne · ${state.pendingSync} action${state.pendingSync > 1 ? 's' : ''} en attente, synchronisation au retour du réseau`
    : 'Synchronisation de la feuille de score…';
  return (
    <View style={[styles.banner, { backgroundColor: online ? colors.scoreGreen : colors.warning }]} accessibilityLiveRegion="polite" accessibilityRole="alert">
      <T v="smallBold" color={colors.cream} center>{text}</T>
    </View>
  );
}

const styles = StyleSheet.create({ banner: { paddingVertical: 8, paddingHorizontal: 16 } });
