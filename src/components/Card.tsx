import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius, shadow, space } from '@/theme/tokens';

type Tone = 'paper' | 'green' | 'outline' | 'dark';

// Surfaces mates : papier ivoire bordé, vert fairway, ou contour fin sur fond vert nuit.
export function Card({ children, style, tone = 'paper' }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; tone?: Tone }) {
  return <View style={[styles.base, styles[tone], style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: { borderRadius: radius.lg, padding: space.lg, borderWidth: 1 },
  paper: { backgroundColor: colors.white, borderColor: colors.line, ...shadow.card },
  green: { backgroundColor: colors.fairway, borderColor: colors.fairway },
  outline: { backgroundColor: 'transparent', borderColor: colors.fairwayLine },
  dark: { backgroundColor: colors.fairwayLight, borderColor: colors.fairwayLine },
});
