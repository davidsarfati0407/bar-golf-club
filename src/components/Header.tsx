import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, space, touch } from '@/theme/tokens';
import { tap } from './haptics';
import { T } from './T';

type Props = { title: string; onBack?: () => void; right?: React.ReactNode; onDark?: boolean; kicker?: string; noBack?: boolean };

export function Header({ title, onBack, right, onDark, kicker, noBack }: Props) {
  const insets = useSafeAreaInsets();
  const fg = onDark ? colors.ivory : colors.ink;
  return (
    <View style={[styles.wrap, { paddingTop: insets.top + space.sm }]}>
      <View style={styles.row}>
        {noBack ? <View style={styles.back} /> : (
          <Pressable accessibilityRole="button" accessibilityLabel="Retour" onPress={() => { tap(); onBack ? onBack() : (router.canGoBack() ? router.back() : router.replace('/')); }} style={styles.back}>
            <Svg width={24} height={24} viewBox="0 0 24 24"><Path d="M15 5 L8 12 L15 19" stroke={fg} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></Svg>
          </Pressable>
        )}
        <View style={styles.titleWrap}>
          {kicker ? <T v="caption" color={onDark ? colors.gold : colors.inkMuted} center numberOfLines={1}>{kicker}</T> : null}
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
  right: { minWidth: touch.min, minHeight: touch.min, alignItems: 'flex-end', justifyContent: 'center' },
});
