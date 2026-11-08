import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, motion, radius, touch } from '@/theme/tokens';
import { tap } from './haptics';
import { T } from './T';
import { useReducedMotion } from './useReducedMotion';

// Sur ivoire : primary = vert fairway. Sur vert nuit : primary = ivoire (passer onDark).
type Kind = 'primary' | 'secondary' | 'ghost' | 'danger';
type Props = {
  label: string;
  onPress: () => void;
  kind?: Kind;
  size?: 'cta' | 'md' | 'sm';
  onDark?: boolean;
  icon?: React.ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  hint?: string;
  testID?: string;
};

export function Button({ label, onPress, kind = 'primary', size = 'md', onDark, icon, disabled, style, hint, testID }: Props) {
  const reduced = useReducedMotion();
  const scale = useRef(new Animated.Value(1)).current;
  const press = (to: number) => {
    if (reduced) return;
    Animated.timing(scale, { toValue: to, duration: motion.fast, useNativeDriver: true }).start();
  };
  const height = size === 'cta' ? touch.cta : size === 'sm' ? touch.min - 4 : 52;

  const bg = kind === 'primary' ? (onDark ? colors.ivory : colors.fairway) : kind === 'danger' ? colors.danger : 'transparent';
  const fg = kind === 'primary' ? (onDark ? colors.ink : colors.ivory) : kind === 'danger' ? colors.ivory : onDark ? colors.ivory : colors.ink;
  const border = kind === 'secondary' ? (onDark ? colors.ivory : colors.ink) : kind === 'ghost' ? (onDark ? colors.fairwayLine : colors.line) : 'transparent';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      testID={testID}
      onPressIn={() => press(0.97)}
      onPressOut={() => press(1)}
      onPress={() => { tap(); onPress(); }}
      style={style}
    >
      <Animated.View style={[styles.base, { backgroundColor: bg, borderColor: border, minHeight: height, transform: [{ scale }] }, disabled && styles.disabled]}>
        {icon ? <View style={styles.icon}>{icon}</View> : null}
        <T v={size === 'cta' ? 'h3' : size === 'sm' ? 'smallBold' : 'bodyBold'} color={fg}>{label}</T>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: radius.pill, borderWidth: 1.5, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  disabled: { opacity: 0.4 },
  icon: { width: 22, height: 22, alignItems: 'center', justifyContent: 'center' },
});
