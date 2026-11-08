import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import { Screen } from '@/components/Screen';
import { T } from '@/components/T';
import { RULES } from '@/data/rules';
import { colors, space } from '@/theme/tokens';

// « Comment ça marche » : accessible en permanence, avec un exemple chiffré.
export default function Rules() {
  return (
    <Screen>
      <Header title="Comment ça marche" kicker="Règles du club" />
      <Card tone="green" style={styles.model}>
        <T v="caption" color={colors.gold}>Un seul modèle de score</T>
        <T v="h2" color={colors.ivory}>{RULES.model}</T>
      </Card>
      {RULES.items.map((r) => (
        <View key={r.title} style={styles.item}>
          <T v="h3">{r.title}</T>
          <T v="body" color={colors.inkSoft}>{r.text}</T>
        </View>
      ))}
      <Card style={styles.example}>
        <T v="caption" color={colors.inkMuted}>Exemple chiffré</T>
        <T v="h3">{RULES.example.title}</T>
        {RULES.example.lines.map((l, i) => (
          <View key={i} style={styles.line}>
            <T v="numberCell" color={colors.inkMuted} style={styles.lineNum}>{i + 1}</T>
            <T v="body" color={colors.inkSoft} style={styles.flex}>{l}</T>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  model: { gap: 4, marginBottom: space.lg },
  item: { gap: 4, paddingVertical: space.md, borderTopWidth: 1, borderTopColor: colors.line },
  example: { gap: space.sm, marginTop: space.lg },
  line: { flexDirection: 'row', gap: space.sm, alignItems: 'flex-start' },
  lineNum: { width: 18, paddingTop: 3 },
});
