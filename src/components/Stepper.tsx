import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, touch } from '@/theme/tokens';
import { tap } from './haptics';
import { T } from './T';

type Props = { value: number; min: number; max: number; onChange: (v: number) => void; label: string };

// Gros chiffre, deux grosses cibles. Une main.
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
      <T v="h1" color={colors.cream}>{sign}</T>
    </Pressable>
  );
  return (
    <View style={styles.row} accessibilityRole="adjustable" accessibilityLabel={label} accessibilityValue={{ now: value, min, max }}>
      <Btn sign="−" dis={value <= min} />
      <T v="display" color={colors.ink} style={styles.value}>{value}</T>
      <Btn sign="+" dis={value >= max} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20 },
  btn: { width: touch.cta, height: touch.cta, borderRadius: radius.pill, backgroundColor: colors.pubRed, alignItems: 'center', justifyContent: 'center' },
  dis: { opacity: 0.3 },
  value: { minWidth: 80, textAlign: 'center' },
});
