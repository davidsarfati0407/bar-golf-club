import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, touch } from '@/theme/tokens';
import { tap } from './haptics';
import { T } from './T';

type Props = { value: number; min: number; max: number; onChange: (v: number) => void; label: string };

export function Stepper({ value, min, max, onChange, label }: Props) {
  const Btn = ({ sign, dis }: { sign: '−' | '+'; dis: boolean }) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={sign === '+' ? `Augmenter ${label}` : `Diminuer ${label}`}
      accessibilityState={{ disabled: dis }}
      disabled={dis}
      onPress={() => { tap(); onChange(value + (sign === '+' ? 1 : -1)); }}
      style={[styles.btn, dis && styles.dis]}
    >
      <T v="h2" color={colors.ivory} style={styles.sign}>{sign}</T>
    </Pressable>
  );
  return (
    <View style={styles.row} accessibilityRole="adjustable" accessibilityLabel={label} accessibilityValue={{ now: value, min, max }}>
      <Btn sign="−" dis={value <= min} />
      <T v="number" style={styles.value}>{value}</T>
      <Btn sign="+" dis={value >= max} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20 },
  btn: { width: touch.cta, height: touch.cta, borderRadius: radius.pill, backgroundColor: colors.fairway, alignItems: 'center', justifyContent: 'center' },
  sign: { fontFamily: 'Inter_500Medium', fontSize: 28, lineHeight: 32 },
  dis: { opacity: 0.3 },
  value: { minWidth: 64, textAlign: 'center' },
});
