import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors } from '@/theme/tokens';

// Drapeau de trou : traits fins, rouge fonctionnel, mât ivoire ou encre selon le fond.
export function Flag({ size = 32, muted = false, onDark = false }: { size?: number; muted?: boolean; onDark?: boolean }) {
  const red = muted ? (onDark ? colors.fairwayLine : colors.ivoryDeep) : colors.flag;
  const pole = onDark ? colors.ivory : colors.ink;
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" accessibilityLabel="Drapeau de trou">
      <Rect x="9" y="3" width="2" height="26" rx="1" fill={pole} />
      <Path d="M11 4 L25 8.5 L11 13 Z" fill={red} />
      <Circle cx="10" cy="29" r="2" fill={pole} />
    </Svg>
  );
}
