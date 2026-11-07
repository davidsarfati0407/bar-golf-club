import React from 'react';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { colors } from '@/theme/tokens';

// Drapeau rouge de trou, mât bois miel.
export function Flag({ size = 40, muted = false }: { size?: number; muted?: boolean }) {
  const red = muted ? colors.creamDark : colors.flagRed;
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" accessibilityLabel="Drapeau de trou">
      <Rect x="9" y="4" width="3" height="34" rx="1.5" fill={colors.honey} />
      <Path d="M12 5 L31 11 L12 18 Z" fill={red} />
      <Path d="M12 5 L22 8.2 L12 11.5 Z" fill={muted ? colors.creamDark : '#F0574D'} />
      <Circle cx="10.5" cy="37" r="3" fill={colors.woodDark} />
    </Svg>
  );
}
