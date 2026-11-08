import React from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { colors, touch } from '@/theme/tokens';
import { tap } from './haptics';
import { T } from './T';

type Props = { label: string; hint?: string; value: boolean; onChange: (v: boolean) => void; onDark?: boolean };

export function Toggle({ label, hint, value, onChange, onDark }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.flex}>
        <T v="bodyBold" color={onDark ? colors.ivory : colors.ink}>{label}</T>
        {hint ? <T v="small" color={onDark ? colors.ivoryDark : colors.inkMuted}>{hint}</T> : null}
      </View>
      <Switch
        value={value}
        onValueChange={(v) => { tap(); onChange(v); }}
        accessibilityLabel={label}
        trackColor={{ true: colors.success, false: onDark ? 'rgba(247,242,231,0.3)' : colors.ivoryDeep }}
        thumbColor={colors.white}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: touch.min },
});
