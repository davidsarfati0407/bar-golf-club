import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors, radius, touch } from '@/theme/tokens';
import { tap } from './haptics';
import { T } from './T';

// Toujours visible pendant la sortie : Je m'arrête · Eau · Taxi · Position. Aplats mats, aucun clignotement.
export function SafetyBar({ onDark }: { onDark?: boolean }) {
  const fg = onDark ? colors.ivory : colors.ink;
  const items = [
    { key: 'stop', label: 'Je m’arrête', icon: <StopIcon />, focus: 'stop' },
    { key: 'water', label: 'Eau', icon: <WaterIcon />, focus: 'water' },
    { key: 'taxi', label: 'Taxi', icon: <CarIcon fg={fg} />, focus: 'taxi' },
    { key: 'pin', label: 'Position', icon: <PinIcon />, focus: 'pin' },
  ];
  return (
    <View style={styles.bar} accessibilityRole="toolbar" accessibilityLabel="Barre de sécurité">
      {items.map((it) => (
        <Pressable
          key={it.key}
          accessibilityRole="button"
          accessibilityLabel={it.label}
          onPress={() => { tap(); router.push({ pathname: '/stop', params: { focus: it.focus } }); }}
          style={({ pressed }) => [styles.item, { borderColor: onDark ? colors.fairwayLine : colors.line }, it.key === 'stop' && styles.stop, pressed && styles.pressed]}
        >
          {it.icon}
          <T v="caption" color={it.key === 'stop' ? colors.ivory : fg} numberOfLines={1}>{it.label}</T>
        </Pressable>
      ))}
    </View>
  );
}

function StopIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 20 20"><Circle cx="10" cy="10" r="8.5" stroke={colors.ivory} strokeWidth="1.5" fill="none" /><Rect x="6.5" y="6.5" width="7" height="7" rx="1.5" fill={colors.ivory} /></Svg>
  );
}
function WaterIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 20 20"><Path d="M10 2.5 C10 2.5 4.5 9 4.5 12.5 A5.5 5.5 0 0 0 15.5 12.5 C15.5 9 10 2.5 10 2.5 Z" fill={colors.water} /></Svg>
  );
}
function CarIcon({ fg }: { fg: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 20 20"><Path d="M3 11 L5 6.5 Q5.5 5.5 6.5 5.5 L13.5 5.5 Q14.5 5.5 15 6.5 L17 11 Z" fill={fg} /><Rect x="2" y="10.5" width="16" height="5" rx="1.5" fill={colors.gold} /><Circle cx="6" cy="15.5" r="1.8" fill={fg} /><Circle cx="14" cy="15.5" r="1.8" fill={fg} /></Svg>
  );
}
function PinIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 20 20"><Path d="M10 18 C10 18 4 11.5 4 8 A6 6 0 0 1 16 8 C16 11.5 10 18 10 18 Z" fill={colors.success} /><Circle cx="10" cy="8" r="2.2" fill={colors.ivory} /></Svg>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', gap: 6 },
  item: { flex: 1, minHeight: touch.min, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', gap: 2, borderWidth: 1, paddingHorizontal: 2 },
  stop: { backgroundColor: colors.danger, borderColor: colors.danger, flex: 1.5 },
  pressed: { opacity: 0.75 },
});
