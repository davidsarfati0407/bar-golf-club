import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { colors, radius, touch } from '@/theme/tokens';
import { tap } from './haptics';
import { T } from './T';

type Props = { label: string; active?: boolean; onPress?: () => void; onDark?: boolean };

export function Chip({ label, active, onPress, onDark }: Props) {
  const bg = active ? (onDark ? colors.ivory : colors.ink) : 'transparent';
  const fg = active ? (onDark ? colors.ink : colors.ivory) : onDark ? colors.ivory : colors.ink;
  const border = active ? bg : onDark ? colors.fairwayLine : colors.line;
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityState={{ selected: !!active }}
      onPress={onPress ? () => { tap(); onPress(); } : undefined}
      style={[styles.chip, { backgroundColor: bg, borderColor: border }]}
    >
      <T v="smallBold" color={fg}>{label}</T>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: { minHeight: touch.min - 8, paddingHorizontal: 14, borderRadius: radius.pill, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
});
