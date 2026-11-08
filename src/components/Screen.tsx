import React from 'react';
import { Platform, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, space } from '@/theme/tokens';

type Props = { children: React.ReactNode; dark?: boolean; scroll?: boolean; footer?: React.ReactNode; padded?: boolean; footerDark?: boolean };

// Conteneur d'écran : fond ivoire (clubhouse) ou vert nuit, zones sûres, pied fixe dans la zone du pouce.
export function Screen({ children, dark, scroll = true, footer, padded = true, footerDark }: Props) {
  const insets = useSafeAreaInsets();
  const pad = padded ? space.lg : 0;
  const bg = dark ? colors.fairway : colors.ivory;
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
      {footer ? (
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, space.md), backgroundColor: footerDark ?? dark ? colors.fairway : colors.ivory, borderTopColor: dark ? colors.fairwayLine : colors.line }]}>
          {footer}
        </View>
      ) : null}
    </View>
  );
}

// Sur écran large (web), cadre téléphone centré : sert de maquette interactive.
export function PhoneFrame({ children }: { children: React.ReactNode }) {
  const { width, height } = useWindowDimensions();
  const wide = Platform.OS === 'web' && width > 560;
  if (!wide) return <>{children}</>;
  return (
    <View style={styles.backdrop}>
      <View style={[styles.frame, { height: Math.min(844, height - 40) }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  footer: { paddingHorizontal: space.lg, paddingTop: space.md, gap: space.sm, borderTopWidth: 1 },
  backdrop: { flex: 1, backgroundColor: colors.fairwayDeep, alignItems: 'center', justifyContent: 'center' },
  frame: { width: 390, borderRadius: 40, overflow: 'hidden', borderWidth: 8, borderColor: '#111A17', backgroundColor: colors.ivory },
});
