import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius, shadow, space } from '@/theme/tokens';

export function Card({ children, style, tone = 'paper' }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; tone?: 'paper' | 'green' | 'red' | 'wood' }) {
  const bg = tone === 'green' ? colors.scoreGreen : tone === 'red' ? colors.pubRed : tone === 'wood' ? colors.honey : colors.paper;
  return <View style={[styles.card, { backgroundColor: bg }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, padding: space.lg, ...shadow.card },
});
