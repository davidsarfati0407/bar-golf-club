import React from 'react';
import Svg, { Circle, Ellipse, G, Path, Polygon, Rect } from 'react-native-svg';
import { colors } from '@/theme/tokens';
import type { Outfit } from '@/store/types';

type Props = { outfit?: Outfit; size?: number; accent?: string; label?: string };

// Mannequin en bois low-poly à grosse tête ronde, avec sa tenue de golfeur.
export function Mannequin({ outfit = 'cap', size = 72, accent = colors.flagRed, label }: Props) {
  const wood = colors.honey;
  const woodDark = colors.woodDark;
  const woodLight = colors.honeyLight;
  return (
    <Svg width={size} height={size * 1.25} viewBox="0 0 80 100" accessibilityLabel={label ?? 'Avatar golfeur'}>
      {/* jambes */}
      <Rect x="29" y="64" width="9" height="24" rx="4" fill={woodDark} />
      <Rect x="42" y="64" width="9" height="24" rx="4" fill={wood} />
      <Rect x="26" y="86" width="14" height="7" rx="3" fill={colors.ink} />
      <Rect x="41" y="86" width="14" height="7" rx="3" fill={colors.ink} />
      {/* torse (facettes) */}
      <Polygon points="26,40 54,40 58,66 22,66" fill={wood} />
      <Polygon points="40,40 54,40 58,66 40,66" fill={woodLight} opacity={0.55} />
      {outfit === 'argyle' ? (
        <G>
          <Polygon points="26,40 54,40 58,66 22,66" fill={colors.scoreGreen} />
          <Polygon points="40,42 47,52 40,62 33,52" fill={colors.cream} opacity={0.9} />
          <Polygon points="30,46 34,52 30,58 26,52" fill={accent} opacity={0.9} />
          <Polygon points="50,46 54,52 50,58 46,52" fill={accent} opacity={0.9} />
        </G>
      ) : null}
      {/* bras */}
      <Rect x="14" y="42" width="8" height="24" rx="4" fill={woodDark} transform="rotate(10 18 54)" />
      <Rect x="58" y="42" width="8" height="24" rx="4" fill={wood} transform="rotate(-10 62 54)" />
      {/* cou */}
      <Rect x="36" y="32" width="8" height="9" rx="3" fill={woodDark} />
      {/* grosse tête ronde */}
      <Circle cx="40" cy="20" r="17" fill={wood} />
      <Path d="M40 3 A17 17 0 0 1 57 20 L40 20 Z" fill={woodLight} opacity={0.5} />
      <Circle cx="34" cy="20" r="1.8" fill={colors.ink} />
      <Circle cx="46" cy="20" r="1.8" fill={colors.ink} />
      <Path d="M35 27 Q40 31 45 27" stroke={colors.ink} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* casquette plate */}
      {outfit === 'cap' || outfit === 'argyle' ? (
        <G>
          <Path d="M22 14 Q40 -6 58 14 Z" fill={accent} />
          <Rect x="20" y="12" width="44" height="5" rx="2.5" fill={colors.ink} />
        </G>
      ) : null}
      {/* putter */}
      {outfit === 'putter' ? (
        <G>
          <Rect x="66" y="38" width="3" height="52" rx="1.5" fill={colors.ink} />
          <Rect x="60" y="88" width="14" height="5" rx="2" fill={colors.inkSoft} />
          <Ellipse cx="67.5" cy="38" rx="4" ry="3" fill={accent} />
        </G>
      ) : null}
      {/* mini-drapeau */}
      {outfit === 'flag' ? (
        <G>
          <Rect x="10" y="30" width="3" height="40" rx="1.5" fill={woodDark} />
          <Path d="M13 31 L28 36 L13 41 Z" fill={accent} />
        </G>
      ) : null}
    </Svg>
  );
}
