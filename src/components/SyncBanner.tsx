import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useOuting } from '@/store/outing';
import { roomSyncAvailable } from '@/sync/localRoom';
import { colors } from '@/theme/tokens';
import { useOnline } from './useOnline';
import { T } from './T';

// Bandeau d'état : hors ligne, synchronisation, ou partage limité à cet appareil.
export function SyncBanner() {
  const online = useOnline();
  const { state, dispatch } = useOuting();
  useEffect(() => {
    if (online && state.pendingSync > 0) {
      const t = setTimeout(() => dispatch({ type: 'syncFlushed' }), 700);
      return () => clearTimeout(t);
    }
  }, [online, state.pendingSync, dispatch]);
  if (online && state.pendingSync === 0) return null;
  const text = !online
    ? `Hors ligne · ${state.pendingSync} action${state.pendingSync > 1 ? 's' : ''} gardée${state.pendingSync > 1 ? 's' : ''} sur cet appareil, rien n’est perdu`
    : roomSyncAvailable ? 'Feuille de score mise à jour' : 'Enregistré sur cet appareil';
  return (
    <View style={[styles.banner, { backgroundColor: online ? colors.fairwayLight : colors.warning }]} accessibilityLiveRegion="polite" accessibilityRole="alert">
      <T v="smallBold" color={colors.ivory} center>{text}</T>
    </View>
  );
}

const styles = StyleSheet.create({ banner: { paddingVertical: 6, paddingHorizontal: 16 } });
