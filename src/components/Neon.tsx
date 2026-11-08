import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { colors, motion, type } from '@/theme/tokens';
import { useReducedMotion } from './useReducedMotion';

type Props = { children: string; size?: 'display' | 'h1' | 'h2'; style?: StyleProp<ViewStyle>; textStyle?: StyleProp<TextStyle>; center?: boolean };

// Néon or champagne : effet « qui s'allume » une seule fois, désactivé avec prefers-reduced-motion.
export function Neon({ children, size = 'display', style, textStyle, center }: Props) {
  const reduced = useReducedMotion();
  const glow = useRef(new Animated.Value(reduced ? 1 : 0)).current;
  useEffect(() => {
    if (reduced) {
      glow.setValue(1);
      return;
    }
    Animated.sequence([
      Animated.timing(glow, { toValue: 0.35, duration: 120, useNativeDriver: true }),
      Animated.timing(glow, { toValue: 0.1, duration: 80, useNativeDriver: true }),
      Animated.timing(glow, { toValue: 0.7, duration: 140, useNativeDriver: true }),
      Animated.timing(glow, { toValue: 0.4, duration: 90, useNativeDriver: true }),
      Animated.timing(glow, { toValue: 1, duration: motion.neon - 430, useNativeDriver: true }),
    ]).start();
  }, [glow, reduced]);
  return (
    <Animated.View style={[styles.wrap, { opacity: glow }, style]}>
      <Animated.Text
        accessibilityRole="header"
        maxFontSizeMultiplier={1.3}
        style={[type[size], styles.text, center && styles.center, textStyle]}
      >
        {children}
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignSelf: 'center' },
  text: { color: colors.gold, textShadowColor: colors.goldGlow, textShadowRadius: 18, textShadowOffset: { width: 0, height: 0 } },
  center: { textAlign: 'center' },
});
