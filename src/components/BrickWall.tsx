import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, Pattern, Rect } from 'react-native-svg';

// Façade en briques, discrète, pour les en-têtes. Pas de dégradé générique.
export function BrickWall({ color = '#8F2A36', mortar = '#6E1A26', opacity = 1 }: { color?: string; mortar?: string; opacity?: number }) {
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity }]}>
      <Svg width="100%" height="100%">
        <Defs>
          <Pattern id="brick" patternUnits="userSpaceOnUse" width="56" height="28">
            <Rect width="56" height="28" fill={mortar} />
            <Rect x="1" y="1" width="26" height="12" rx="1.5" fill={color} />
            <Rect x="29" y="1" width="26" height="12" rx="1.5" fill={color} />
            <Rect x="-13" y="15" width="26" height="12" rx="1.5" fill={color} />
            <Rect x="15" y="15" width="26" height="12" rx="1.5" fill={color} />
            <Rect x="43" y="15" width="26" height="12" rx="1.5" fill={color} />
          </Pattern>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#brick)" />
      </Svg>
    </View>
  );
}
