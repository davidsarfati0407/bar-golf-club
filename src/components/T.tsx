import React from 'react';
import { Text, type StyleProp, type TextProps, type TextStyle } from 'react-native';
import { colors, type } from '@/theme/tokens';

type Variant = keyof typeof type;
type Props = TextProps & { v?: Variant; color?: string; center?: boolean; style?: StyleProp<TextStyle> };

// Texte du design system : suit la taille système, plafonné sur les grands titres et chiffres.
export function T({ v = 'body', color = colors.ink, center, style, ...rest }: Props) {
  const maxScale = v === 'display' || v === 'number' || v === 'h1' ? 1.3 : v === 'numberCell' ? 1.2 : 2;
  return <Text maxFontSizeMultiplier={maxScale} {...rest} style={[type[v], { color }, center && { textAlign: 'center' }, style]} />;
}
