import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { tap } from '@/components/haptics';
import { Header } from '@/components/Header';
import { Mannequin } from '@/components/Mannequin';
import { Screen } from '@/components/Screen';
import { StatusBox } from '@/components/StatusBox';
import { T } from '@/components/T';
import { scorersOf, teamColorOf, useOuting } from '@/store/outing';
import { colors, radius, space, touch } from '@/theme/tokens';

// Outils de l'hôte : corriger un score, annuler un trou, retirer un participant, passer la main, pause / fin.
export default function Host() {
  const { state, dispatch } = useOuting();
  const o = state.outing;
  const [holeIdx, setHoleIdx] = useState(o?.currentHole ?? 0);
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  useEffect(() => {
    if (!o) router.replace('/');
  }, [o]);
  if (!o) return null;

  const isHost = state.meId === o.hostId;
  if (!isHost) {
    return (
      <Screen>
        <Header title="Hôte" />
        <StatusBox kind="empty" title="Réservé à l’hôte" text={`${o.players.find((p) => p.id === o.hostId)?.name ?? 'L’hôte'} organise cette sortie. Demande-lui de te passer la main si besoin.`} />
      </Screen>
    );
  }

  const hole = o.holes[Math.min(holeIdx, o.holes.length - 1)];
  const scorers = scorersOf(o);
  const host = o.players.find((p) => p.id === o.hostId);

  return (
    <Screen>
      <Header title="Hôte" kicker={host ? `Organisateur : ${host.name}` : undefined} />

      <Card style={styles.block}>
        <T v="h3">Corriger un score</T>
        <View style={styles.chips}>
          {o.holes.map((h, i) => <Chip key={h.id} label={`${i + 1}`} active={i === holeIdx} onPress={() => setHoleIdx(i)} />)}
        </View>
        <T v="small" color={colors.inkMuted}>{hole.place.name} · {hole.challenge.title} · vaut {hole.challenge.points} pt{hole.challenge.points > 1 ? 's' : ''}{hole.cancelled ? ' · annulé' : ''}</T>
        {hole.cancelled ? (
          <Button label="Rétablir ce trou" kind="secondary" size="sm" onPress={() => dispatch({ type: 'restoreHole', index: holeIdx })} />
        ) : (
          <>
            {scorers.map((s) => {
              const pts = hole.results.find((x) => x.scorerId === s.id)?.points ?? 0;
              return (
                <View key={s.id} style={styles.row}>
                  <View style={[styles.dot, { backgroundColor: s.color }]} />
                  <T v="bodyBold" style={styles.flex} numberOfLines={2}>{s.name}</T>
                  <Pressable accessibilityRole="button" accessibilityLabel={`Retirer un point à ${s.name}`} disabled={pts <= 0} onPress={() => { tap(); dispatch({ type: 'correctScore', holeIndex: holeIdx, scorerId: s.id, points: pts - 1 }); }} style={[styles.pm, pts <= 0 && styles.off]}><T v="bodyBold">−</T></Pressable>
                  <T v="numberSmall" style={styles.pts}>{pts}</T>
                  <Pressable accessibilityRole="button" accessibilityLabel={`Ajouter un point à ${s.name}`} disabled={pts >= 3} onPress={() => { tap(); dispatch({ type: 'correctScore', holeIndex: holeIdx, scorerId: s.id, points: pts + 1 }); }} style={[styles.pm, pts >= 3 && styles.off]}><T v="bodyBold">+</T></Pressable>
                </View>
              );
            })}
            <Button label="Annuler ce trou (lieu fermé, défi impossible)" kind="ghost" size="sm" onPress={() => dispatch({ type: 'cancelHole', index: holeIdx })} />
          </>
        )}
      </Card>

      <Card style={styles.block}>
        <T v="h3">Participants</T>
        <T v="small" color={colors.inkMuted}>Quitter ou rejoindre en cours de sortie ne casse jamais le classement. Un joueur déconnecté peut être retiré : ses points restent.</T>
        {o.players.map((p) => (
          <View key={p.id} style={styles.participant}>
            <View style={styles.row}>
              <Mannequin outfit={p.outfit} size={28} accent={teamColorOf(o, p)} label="" />
              <T v="bodyBold" style={styles.flex} numberOfLines={2}>{p.name}{p.isHost ? ' · hôte' : ''}{p.status === 'left' ? ' · parti' : ''}</T>
            </View>
            {!p.isHost ? (
              <View style={styles.row}>
                <Button label="Passer la main" kind="ghost" size="sm" style={styles.flex} onPress={() => dispatch({ type: 'makeHost', id: p.id })} />
                <Button label="Retirer" kind="ghost" size="sm" style={styles.flex} onPress={() => dispatch({ type: 'removePlayer', id: p.id })} />
              </View>
            ) : null}
          </View>
        ))}
      </Card>

      <Card style={styles.block}>
        <T v="h3">Sortie</T>
        <View style={styles.actions}>
          {o.status === 'paused' ? (
            <Button label="Reprendre" onPress={() => { dispatch({ type: 'resume' }); router.back(); }} />
          ) : o.status === 'live' ? (
            <Button label="Mettre en pause" kind="secondary" onPress={() => { dispatch({ type: 'pause' }); router.dismissAll(); router.replace('/'); }} />
          ) : null}
          {o.status !== 'finished' && o.status !== 'draft' ? (
            <Button label="Terminer maintenant" onPress={() => { router.dismissAll(); router.replace('/scoreboard'); setTimeout(() => dispatch({ type: 'finish' }), 0); }} />
          ) : null}
          {!confirmDiscard ? (
            <Button label="Quitter sans garder" kind="ghost" onPress={() => setConfirmDiscard(true)} />
          ) : (
            <StatusBox kind="error" title="Supprimer cette sortie ?" text="La feuille de score et les photos de cet appareil seront effacées. Les autres participants gardent leur copie." action={{ label: 'Oui, supprimer', onPress: () => { router.dismissAll(); router.replace('/'); setTimeout(() => dispatch({ type: 'discard' }), 0); } }} />
          )}
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  block: { gap: space.sm, marginBottom: space.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: touch.min, flexWrap: 'wrap' },
  dot: { width: 8, height: 8, borderRadius: 4 },
  participant: { gap: 4, paddingVertical: 4, borderTopWidth: 1, borderTopColor: colors.line },
  pm: { width: touch.min - 4, height: touch.min - 4, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
  pts: { minWidth: 28, textAlign: 'center' },
  off: { opacity: 0.25 },
  actions: { gap: space.sm },
});
