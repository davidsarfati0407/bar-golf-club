import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { tap } from '@/components/haptics';
import { Header } from '@/components/Header';
import { Mannequin } from '@/components/Mannequin';
import { Screen } from '@/components/Screen';
import { T } from '@/components/T';
import { scorersOf, useOuting } from '@/store/outing';
import { colors, radius, space, touch } from '@/theme/tokens';

// Outils de l'hôte : corriger un score, annuler, retirer un participant, passer la main, pause / fin.
export default function Host() {
  const { state, dispatch } = useOuting();
  const o = state.outing;
  const [holeIdx, setHoleIdx] = useState(o?.currentHole ?? 0);

  if (!o) {
    router.replace('/');
    return null;
  }

  const hole = o.holes[holeIdx];
  const scorers = scorersOf(o);
  const host = o.players.find((p) => p.id === o.hostId);

  return (
    <Screen bg={colors.paper}>
      <Header title="Hôte" kicker={host ? `Organisateur : ${host.name}` : undefined} />

      <Card style={styles.block}>
        <T v="h3">Corriger un score</T>
        <View style={styles.chips}>
          {o.holes.map((h, i) => <Chip key={h.id} label={`Trou ${i + 1}`} tone="green" active={i === holeIdx} onPress={() => setHoleIdx(i)} />)}
        </View>
        <T v="small" color={colors.inkMuted}>{hole.place.name} · {hole.challenge.title} · {hole.challenge.points} pts</T>
        {scorers.map((s) => {
          const r = hole.results.find((x) => x.scorerId === s.id);
          const pts = r?.points ?? 0;
          return (
            <View key={s.id} style={styles.row}>
              <View style={[styles.dot, { backgroundColor: s.color }]} />
              <T v="bodyBold" style={styles.flex} numberOfLines={1}>{s.name}</T>
              <Pressable accessibilityRole="button" accessibilityLabel={`Retirer un point à ${s.name}`} disabled={pts <= 0} onPress={() => { tap(); dispatch({ type: 'correctScore', holeIndex: holeIdx, scorerId: s.id, points: pts - 1 }); }} style={[styles.pm, pts <= 0 && styles.off]}><T v="h3">−</T></Pressable>
              <T v="h2" style={styles.pts}>{pts}</T>
              <Pressable accessibilityRole="button" accessibilityLabel={`Ajouter un point à ${s.name}`} disabled={pts >= 3} onPress={() => { tap(); dispatch({ type: 'correctScore', holeIndex: holeIdx, scorerId: s.id, points: pts + 1 }); }} style={[styles.pm, pts >= 3 && styles.off]}><T v="h3">+</T></Pressable>
            </View>
          );
        })}
      </Card>

      <Card style={styles.block}>
        <T v="h3">Participants</T>
        <T v="small" color={colors.inkMuted}>Quitter ou rejoindre en cours de sortie ne casse jamais le classement.</T>
        {o.players.map((p) => (
          <View key={p.id} style={styles.row}>
            <Mannequin outfit={p.outfit} size={30} accent={o.teams.find((t) => t.id === p.teamId)?.color ?? colors.flagRed} label="" />
            <T v="bodyBold" style={styles.flex} numberOfLines={1}>{p.name}{p.isHost ? ' · hôte' : ''}</T>
            {!p.isHost ? (
              <>
                <Button label="Passer la main" kind="ghost" size="sm" onPress={() => dispatch({ type: 'makeHost', id: p.id })} />
                <Button label="Retirer" kind="ghost" size="sm" onPress={() => dispatch({ type: 'removePlayer', id: p.id })} />
              </>
            ) : null}
          </View>
        ))}
      </Card>

      <Card style={styles.block}>
        <T v="h3">Sortie</T>
        <View style={styles.actions}>
          {o.status === 'paused' ? (
            <Button label="Reprendre" kind="green" onPress={() => { dispatch({ type: 'resume' }); router.back(); }} />
          ) : (
            <Button label="Mettre en pause" kind="secondary" onPress={() => { dispatch({ type: 'pause' }); router.dismissAll(); router.replace('/'); }} />
          )}
          <Button label="Terminer maintenant" kind="primary" onPress={() => { dispatch({ type: 'finish' }); router.dismissAll(); router.replace('/scoreboard'); }} />
          <Button label="Quitter sans garder" kind="danger" onPress={() => { dispatch({ type: 'quit' }); router.dismissAll(); router.replace('/'); }} />
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  block: { gap: space.sm, marginBottom: space.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: touch.min },
  dot: { width: 10, height: 10, borderRadius: 5 },
  pm: { width: touch.min - 4, height: touch.min - 4, borderRadius: radius.sm, backgroundColor: colors.cream, alignItems: 'center', justifyContent: 'center' },
  pts: { minWidth: 32, textAlign: 'center' },
  off: { opacity: 0.25 },
  actions: { gap: space.sm },
});
