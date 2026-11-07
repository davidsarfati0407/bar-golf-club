import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { colors, radius, shadow, touch, type } from '@/theme/tokens';
import { tap } from './haptics';
import { T } from './T';

type Kind = 'primary' | 'green' | 'neon' | 'secondary' | 'ghost' | 'danger';

type Props = {
  label: string;
  onPress: () => void;
  kind?: Kind;
  size?: 'cta' | 'md' | 'sm';
  icon?: React.ReactNode;
  disabled?: boolean;
  style?: ViewStyle;
  hint?: string;
};

const BG: Record<Kind, string> = {
  primary: colors.pubRed,
  green: colors.scoreGreen,
  neon: colors.neonPink,
  secondary: colors.cream,
  ghost: 'transparent',
  danger: colors.danger,
};
const FG: Record<Kind, string> = {
  primary: colors.cream,
  green: colors.cream,
  neon: colors.ink,
  secondary: colors.ink,
  ghost: colors.ink,
  danger: colors.cream,
};

export function Button({ label, onPress, kind = 'primary', size = 'md', icon, disabled, style, hint }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const press = (to: number) => Animated.spring(scale, { toValue: to, useNativeDriver: true, speed: 40, bounciness: 6 }).start();
  const height = size === 'cta' ? touch.cta : size === 'sm' ? touch.min : 52;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPressIn={() => press(0.96)}
      onPressOut={() => press(1)}
      onPress={() => {
        tap();
        onPress();
      }}
      style={style}
    >
      <Animated.View
        style={[
          styles.base,
          { backgroundColor: BG[kind], minHeight: height, transform: [{ scale }] },
          kind === 'ghost' && styles.ghost,
          kind === 'secondary' && styles.secondary,
          kind === 'neon' && shadow.neon,
          (kind === 'primary' || kind === 'green') && shadow.card,
          disabled && styles.disabled,
        ]}
      >
        {icon ? <View style={styles.icon}>{icon}</View> : null}
        <T v={size === 'cta' ? 'h3' : 'bodyBold'} color={FG[kind]} style={size === 'cta' ? styles.ctaText : undefined}>
          {label}
        </T>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  ghost: { borderWidth: 2, borderColor: colors.line },
  secondary: { borderWidth: 2, borderColor: colors.creamDark },
  disabled: { opacity: 0.45 },
  icon: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  ctaText: { fontSize: 20, lineHeight: 24, fontFamily: type.h1.fontFamily },
});
