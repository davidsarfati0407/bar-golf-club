import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { colors, radius, touch } from '@/theme/tokens';
import { tap } from './haptics';
import { T } from './T';

type Props = { label: string; active?: boolean; onPress?: () => void; tone?: 'red' | 'green' | 'ink' };

export function Chip({ label, active, onPress, tone = 'ink' }: Props) {
  const bg = active ? (tone === 'red' ? colors.pubRed : tone === 'green' ? colors.scoreGreen : colors.ink) : colors.paper;
  const fg = active ? colors.cream : colors.ink;
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityState={{ selected: !!active }}
      onPress={onPress ? () => { tap(); onPress(); } : undefined}
      style={[styles.chip, { backgroundColor: bg, borderColor: active ? bg : colors.line }]}
    >
      <T v="smallBold" color={fg}>{label}</T>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: { minHeight: touch.min - 8, paddingHorizontal: 14, borderRadius: radius.pill, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
});
