import React from 'react';
import { StyleSheet, View } from 'react-native';
import { computeStandings } from '@/store/outing';
import type { Outing } from '@/store/types';
import { colors, radius, space } from '@/theme/tokens';
import { T } from './T';

// Feuille de score sans défilement horizontal : une ligne par équipe (nom + total),
// puis la grille des trous qui se replie sur plusieurs lignes si besoin.
export function ScoreTable({ outing: o, onDark = true, highlightCurrent = true }: { outing: Outing; onDark?: boolean; highlightCurrent?: boolean }) {
  const standings = computeStandings(o);
  const fg = onDark ? colors.ivory : colors.ink;
  const muted = onDark ? colors.ivoryDark : colors.inkMuted;
  const cellBg = onDark ? 'rgba(247,242,231,0.08)' : colors.ivoryDark;
  return (
    <View style={styles.table} accessible accessibilityLabel={`Feuille de score. ${standings.map((s) => `${s.name}, ${s.points} points, ${s.rank}${s.rank === 1 ? 'er' : 'e'}`).join('. ')}`}>
      <View style={styles.head}>
        <T v="caption" color={muted} style={styles.headLabel}>Trou</T>
        <View style={styles.cells}>
          {o.holes.map((h, i) => (
            <View key={h.id} style={[styles.cell, styles.cellHead, highlightCurrent && i === o.currentHole && o.status !== 'finished' && styles.cellNow]}>
              <T v="numberCell" color={h.cancelled ? muted : fg}>{i + 1}</T>
            </View>
          ))}
        </View>
      </View>
      {standings.map((s) => (
        <View key={s.id} style={[styles.row, { borderTopColor: onDark ? colors.fairwayLine : colors.line }]}>
          <View style={styles.nameRow}>
            <View style={[styles.dot, { backgroundColor: s.color }]} />
            <T v="smallBold" color={fg} numberOfLines={2} style={styles.name}>{s.name}{s.left ? ' · parti' : ''}</T>
            <T v="caption" color={muted}>Total</T>
            <T v="numberSmall" color={fg} style={styles.total}>{s.points}</T>
          </View>
          <View style={styles.cells}>
            {o.holes.map((h) => {
              const r = h.results.find((x) => x.scorerId === s.id);
              const label = h.cancelled ? '✕' : r ? String(r.points) : h.done ? '–' : '·';
              return (
                <View key={h.id} style={[styles.cell, { backgroundColor: r ? s.color : cellBg }]}>
                  <T v="numberCell" color={r ? colors.white : muted}>{label}</T>
                </View>
              );
            })}
          </View>
        </View>
      ))}
      <T v="caption" color={muted} style={styles.legend}>· à jouer   – pas de points   ✕ annulé</T>
    </View>
  );
}

const CELL = 26;

const styles = StyleSheet.create({
  table: { gap: 0 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingBottom: 6 },
  headLabel: { width: 36 },
  row: { gap: 6, borderTopWidth: 1, paddingVertical: 8 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { flex: 1 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  cells: { flexDirection: 'row', flexWrap: 'wrap', gap: 3, flexShrink: 1 },
  cell: { width: CELL, height: CELL, borderRadius: radius.sm - 2, alignItems: 'center', justifyContent: 'center' },
  cellHead: { backgroundColor: 'transparent' },
  cellNow: { borderWidth: 1.5, borderColor: colors.gold },
  total: { minWidth: 28, textAlign: 'right' },
  legend: { marginTop: space.sm },
});
