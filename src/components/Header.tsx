import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, space, touch } from '@/theme/tokens';
import { tap } from './haptics';
import { T } from './T';

type Props = { title: string; onBack?: () => void; right?: React.ReactNode; light?: boolean; kicker?: string };

export function Header({ title, onBack, right, light, kicker }: Props) {
  const insets = useSafeAreaInsets();
  const fg = light ? colors.cream : colors.ink;
  return (
    <View style={[styles.wrap, { paddingTop: insets.top + space.sm }]}>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Retour"
          onPress={() => { tap(); onBack ? onBack() : router.back(); }}
          style={styles.back}
        >
          <Svg width={26} height={26} viewBox="0 0 24 24"><Path d="M15 5 L8 12 L15 19" stroke={fg} strokeWidth="2.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></Svg>
        </Pressable>
        <View style={styles.titleWrap}>
          {kicker ? <T v="caption" color={light ? colors.honeyLight : colors.inkMuted} center>{kicker}</T> : null}
          <T v="h3" color={fg} center numberOfLines={1} accessibilityRole="header">{title}</T>
        </View>
        <View style={styles.right}>{right}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: space.sm, paddingBottom: space.sm },
  row: { flexDirection: 'row', alignItems: 'center' },
  back: { width: touch.min, height: touch.min, alignItems: 'center', justifyContent: 'center' },
  titleWrap: { flex: 1, alignItems: 'center' },
  right: { width: touch.min, minHeight: touch.min, alignItems: 'center', justifyContent: 'center' },
});
