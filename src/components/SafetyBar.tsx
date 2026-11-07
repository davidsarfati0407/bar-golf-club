import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors, radius, touch } from '@/theme/tokens';
import { tap } from './haptics';
import { T } from './T';

// Toujours visible pendant la sortie : « Je m'arrête », eau, taxi/VTC, position à un ami.
export function SafetyBar() {
  const items: { key: string; label: string; icon: React.ReactNode; onPress: () => void }[] = [
    { key: 'stop', label: 'Je m’arrête', icon: <StopIcon />, onPress: () => router.push('/stop') },
    { key: 'water', label: 'Eau', icon: <WaterIcon />, onPress: () => router.push({ pathname: '/stop', params: { focus: 'water' } }) },
    { key: 'taxi', label: 'Taxi', icon: <CarIcon />, onPress: () => router.push({ pathname: '/stop', params: { focus: 'taxi' } }) },
    { key: 'pin', label: 'Position', icon: <PinIcon />, onPress: () => router.push({ pathname: '/stop', params: { focus: 'pin' } }) },
  ];
  return (
    <View style={styles.bar} accessibilityRole="toolbar" accessibilityLabel="Barre de sécurité">
      {items.map((it) => (
        <Pressable
          key={it.key}
          accessibilityRole="button"
          accessibilityLabel={it.label}
          onPress={() => { tap(); it.onPress(); }}
          style={({ pressed }) => [styles.item, it.key === 'stop' && styles.stop, pressed && { opacity: 0.8 }]}
        >
          {it.icon}
          <T v="caption" color={it.key === 'stop' ? colors.cream : colors.ink}>{it.label}</T>
        </Pressable>
      ))}
    </View>
  );
}

function StopIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20">
      <Circle cx="10" cy="10" r="9" fill={colors.cream} />
      <Rect x="6.5" y="6.5" width="7" height="7" rx="1.5" fill={colors.pubRed} />
    </Svg>
  );
}
function WaterIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20">
      <Path d="M10 2 C10 2 4 9 4 12.5 A6 6 0 0 0 16 12.5 C16 9 10 2 10 2 Z" fill="#3B8BD6" />
      <Path d="M7 12.5 A3 3 0 0 0 10 15.5" stroke={colors.cream} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </Svg>
  );
}
function CarIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20">
      <Path d="M3 11 L5 6.5 Q5.5 5.5 6.5 5.5 L13.5 5.5 Q14.5 5.5 15 6.5 L17 11 Z" fill={colors.ink} />
      <Rect x="2" y="10.5" width="16" height="5" rx="1.5" fill={colors.honey} />
      <Circle cx="6" cy="15.5" r="2" fill={colors.ink} />
      <Circle cx="14" cy="15.5" r="2" fill={colors.ink} />
    </Svg>
  );
}
function PinIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20">
      <Path d="M10 18 C10 18 4 11.5 4 8 A6 6 0 0 1 16 8 C16 11.5 10 18 10 18 Z" fill={colors.scoreGreen} />
      <Circle cx="10" cy="8" r="2.4" fill={colors.cream} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: colors.paper, borderTopWidth: 1, borderTopColor: colors.line },
  item: { flex: 1, minHeight: touch.min, borderRadius: radius.md, backgroundColor: colors.cream, alignItems: 'center', justifyContent: 'center', gap: 2, borderWidth: 1.5, borderColor: colors.line },
  stop: { backgroundColor: colors.pubRed, borderColor: colors.pubRed, flex: 1.4 },
});
