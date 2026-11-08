import React from 'react';
import Svg, { Circle, G, Path, Polygon, Rect } from 'react-native-svg';
import { colors } from '@/theme/tokens';
import type { Outfit } from '@/store/types';

type Props = { outfit?: Outfit; size?: number; accent?: string; label?: string };

// Mannequin bois low-poly, grosse tête ronde, traits fins, palette unifiée (bois chaud désaturé).
const WOOD = '#C9A27A';
const WOOD_DARK = '#A8835C';
const WOOD_LIGHT = '#DDBE9A';

export function Mannequin({ outfit = 'cap', size = 64, accent = colors.flag, label }: Props) {
  const stroke = colors.ink;
  return (
    <Svg width={size} height={size * 1.25} viewBox="0 0 80 100" accessibilityLabel={label ?? 'Avatar golfeur'}>
      <Rect x="30" y="63" width="8" height="24" rx="4" fill={WOOD_DARK} />
      <Rect x="42" y="63" width="8" height="24" rx="4" fill={WOOD} />
      <Rect x="27" y="86" width="13" height="6" rx="3" fill={stroke} />
      <Rect x="41" y="86" width="13" height="6" rx="3" fill={stroke} />
      <Polygon points="27,40 53,40 56,65 24,65" fill={outfit === 'argyle' ? colors.fairway : WOOD} />
      {outfit === 'argyle' ? (
        <G>
          <Polygon points="40,43 46,52 40,61 34,52" fill={colors.ivory} />
          <Polygon points="31,47 34,52 31,57 28,52" fill={accent} />
          <Polygon points="49,47 52,52 49,57 46,52" fill={accent} />
        </G>
      ) : (
        <Polygon points="40,40 53,40 56,65 40,65" fill={WOOD_LIGHT} opacity={0.5} />
      )}
      <Rect x="16" y="42" width="7" height="23" rx="3.5" fill={WOOD_DARK} transform="rotate(10 19.5 53)" />
      <Rect x="57" y="42" width="7" height="23" rx="3.5" fill={WOOD} transform="rotate(-10 60.5 53)" />
      <Rect x="36.5" y="33" width="7" height="8" rx="3" fill={WOOD_DARK} />
      <Circle cx="40" cy="20" r="16" fill={WOOD} />
      <Path d="M40 4 A16 16 0 0 1 56 20 L40 20 Z" fill={WOOD_LIGHT} opacity={0.45} />
      <Circle cx="34.5" cy="20" r="1.5" fill={stroke} />
      <Circle cx="45.5" cy="20" r="1.5" fill={stroke} />
      <Path d="M35.5 26.5 Q40 29.5 44.5 26.5" stroke={stroke} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      {outfit === 'cap' || outfit === 'argyle' ? (
        <G>
          <Path d="M24 14 Q40 -2 56 14 Z" fill={accent} />
          <Rect x="22" y="12.5" width="40" height="4" rx="2" fill={stroke} />
        </G>
      ) : null}
      {outfit === 'putter' ? (
        <G>
          <Rect x="65" y="40" width="2.5" height="50" rx="1.25" fill={stroke} />
          <Rect x="60" y="88" width="13" height="4" rx="2" fill={stroke} />
          <Circle cx="66.25" cy="40" r="3" fill={accent} />
        </G>
      ) : null}
      {outfit === 'flag' ? (
        <G>
          <Rect x="11" y="32" width="2.5" height="38" rx="1.25" fill={stroke} />
          <Path d="M13.5 33 L26 37.5 L13.5 42 Z" fill={accent} />
        </G>
      ) : null}
    </Svg>
  );
}
