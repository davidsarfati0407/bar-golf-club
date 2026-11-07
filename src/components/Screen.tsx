import React from 'react';
import { Platform, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, space } from '@/theme/tokens';

type Props = {
  children: React.ReactNode;
  bg?: string;
  scroll?: boolean;
  footer?: React.ReactNode;
  padded?: boolean;
};

// Conteneur d'écran : fond, zones sûres, contenu défilant et pied fixe dans la zone du pouce.
export function Screen({ children, bg = colors.cream, scroll = true, footer, padded = true }: Props) {
  const insets = useSafeAreaInsets();
  const pad = padded ? space.lg : 0;
  const body = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={{ paddingHorizontal: pad, paddingBottom: footer ? space.lg : insets.bottom + space.xl }}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, { paddingHorizontal: pad }]}>{children}</View>
  );
  return (
    <View style={[styles.flex, { backgroundColor: bg }]}>
      {body}
      {footer ? <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, space.md) }]}>{footer}</View> : null}
    </View>
  );
}

// Sur un écran large (web), on présente l'app dans un cadre téléphone centré pour servir de maquette.
export function PhoneFrame({ children }: { children: React.ReactNode }) {
  const { width, height } = useWindowDimensions();
  const wide = Platform.OS === 'web' && width > 560;
  if (!wide) return <>{children}</>;
  const h = Math.min(874, height - 40);
  return (
    <View style={styles.backdrop}>
      <View style={[styles.frame, { height: h }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  footer: { paddingHorizontal: space.lg, paddingTop: space.md, gap: space.sm },
  backdrop: { flex: 1, backgroundColor: '#120B0D', alignItems: 'center', justifyContent: 'center' },
  frame: {
    width: 402,
    borderRadius: 44,
    overflow: 'hidden',
    borderWidth: 10,
    borderColor: '#2A1D20',
    backgroundColor: colors.cream,
  },
});
