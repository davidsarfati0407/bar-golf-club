import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { colors, radius, space } from '@/theme/tokens';
import { Button } from './Button';
import { T } from './T';

type Props = { kind: 'loading' | 'empty' | 'error'; title: string; text?: string; action?: { label: string; onPress: () => void }; onDark?: boolean };

// États de chargement, vide et d'erreur : même composant sur tous les écrans.
export function StatusBox({ kind, title, text, action, onDark }: Props) {
  const fg = onDark ? colors.ivory : colors.ink;
  const muted = onDark ? colors.ivoryDark : colors.inkMuted;
  return (
    <View style={[styles.box, { borderColor: kind === 'error' ? colors.danger : onDark ? colors.fairwayLine : colors.line }]} accessibilityRole={kind === 'error' ? 'alert' : undefined} accessibilityLiveRegion="polite">
      {kind === 'loading' ? <ActivityIndicator color={onDark ? colors.gold : colors.fairway} /> : null}
      <T v="h3" color={kind === 'error' ? colors.danger : fg} center>{title}</T>
      {text ? <T v="small" color={muted} center>{text}</T> : null}
      {action ? <Button label={action.label} kind="secondary" size="sm" onDark={onDark} onPress={action.onPress} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { borderWidth: 1, borderRadius: radius.lg, padding: space.lg, gap: space.sm, alignItems: 'center' },
});
