import React from 'react';
import { Text, type TextProps, type TextStyle } from 'react-native';
import { colors, type } from '@/theme/tokens';

type Variant = keyof typeof type;

type Props = TextProps & { v?: Variant; color?: string; center?: boolean; style?: TextStyle | TextStyle[] };

// Texte du design system. Suit la taille système (allowFontScaling par défaut), plafonné pour les très gros titres.
export function T({ v = 'body', color = colors.ink, center, style, ...rest }: Props) {
  const maxScale = v === 'display' || v === 'number' || v === 'h1' ? 1.3 : 2;
  return <Text maxFontSizeMultiplier={maxScale} {...rest} style={[type[v], { color }, center && { textAlign: 'center' }, style]} />;
}
