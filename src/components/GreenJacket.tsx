import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors } from '@/theme/tokens';

// Veste verte du vainqueur, version Bar Golf Club : traits fins, boutons or.
export function GreenJacket({ size = 120 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" accessibilityLabel="Veste verte du vainqueur">
      <Path d="M30 30 L48 22 L60 34 L72 22 L90 30 L100 70 L86 74 L86 104 L34 104 L34 74 L20 70 Z" fill={colors.fairwayLight} stroke={colors.ivory} strokeWidth="2" strokeLinejoin="round" />
      <Path d="M48 22 L60 34 L52 60 L46 40 Z" fill={colors.fairway} stroke={colors.ivory} strokeWidth="1.5" strokeLinejoin="round" />
      <Path d="M72 22 L60 34 L68 60 L74 40 Z" fill={colors.fairway} stroke={colors.ivory} strokeWidth="1.5" strokeLinejoin="round" />
      <Rect x="58" y="60" width="4" height="44" fill={colors.ivory} opacity={0.5} />
      <Circle cx="60" cy="72" r="2.6" fill={colors.gold} />
      <Circle cx="60" cy="84" r="2.6" fill={colors.gold} />
      <Circle cx="60" cy="96" r="2.6" fill={colors.gold} />
      <Rect x="70" y="66" width="10" height="4" rx="1" fill={colors.gold} />
    </Svg>
  );
}
