import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, Share, StyleSheet, Switch, View } from 'react-native';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Flag } from '@/components/Flag';
import { success, tap } from '@/components/haptics';
import { Header } from '@/components/Header';
import { Mannequin } from '@/components/Mannequin';
import { SafetyBar } from '@/components/SafetyBar';
import { Screen } from '@/components/Screen';
import { T } from '@/components/T';
import { computeStandings, useOuting } from '@/store/outing';
import { colors, radius, space, touch } from '@/theme/tokens';

export default function Scoreboard() {
  const { state, dispatch } = useOuting();
  const o = state.outing;
  const [replay, setReplay] = useState(false);
  const [shared, setShared] = useState(false);

  if (!o) {
    router.replace('/');
    return null;
  }

  const standings = computeStandings(o);
  const finished = o.status === 'finished';
  const leader = standings[0];
  const best = o.holes.filter((h) => h.results.length).sort((a, b) => b.results.length * b.challenge.points - a.results.length * a.challenge.points)[0];

  const shareRecap = async () => {
    const lines = [
      `Bar Golf Club · ${o.consent.places ? o.title : 'Sortie entre amis'}`,
      ...standings.map((s, i) => `${i + 1}. ${o.consent.names ? s.name : `Équipe ${i + 1}`} — ${s.points} pts`),
      best ? `Moment fort : ${best.challenge.title}` : '',
    ].filter(Boolean);
    try {
      await Share.share({ message: lines.join('\n') });
    } catch {
      await Clipboard.setStringAsync(lines.join('\n'));
    }
    success();
    setShared(true);
  };

  const footer = finished ? (
    <View style={styles.footerPlain}>
      <Button label={shared ? 'Récap partagé' : 'Partager le récap (9:16)'} size="cta" kind="neon" onPress={shareRecap} />
      <Button label="Ranger dans les souvenirs" kind="ghost" onPress={() => { dispatch({ type: 'quit' }); router.replace('/'); }} />
    </View>
  ) : (
    <View style={styles.footer}>
      <View style={styles.footerInner}>
        <Button label="Retour au trou" size="cta" kind="primary" onPress={() => router.back()} />
      </View>
      <SafetyBar />
    </View>
  );

  return (
    <Screen footer={footer} bg={colors.scoreGreenDeep}>
      <Header title={finished ? 'Résumé de fin' : 'Feuille de score'} light kicker={o.title} onBack={() => (finished ? router.replace('/') : router.back())} />

      {/* Carte de score verte « PUB GOLF » */}
      <View style={styles.card} accessible accessibilityLabel={`Feuille de score. ${standings.map((s) => `${s.name} ${s.points} points`).join('. ')}`}>
        <View style={styles.cardHead}>
          <T v="h1" color={colors.cream} style={styles.pubgolf}>PUB GOLF</T>
          <Flag size={36} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            <View style={styles.gridRow}>
              <View style={styles.nameCell}><T v="caption" color={colors.honeyLight}>Trou</T></View>
              {o.holes.map((h, i) => (
                <View key={h.id} style={[styles.cell, i === o.currentHole && !finished && styles.cellNow]}>
                  <T v="smallBold" color={colors.cream}>{i + 1}</T>
                </View>
              ))}
              <View style={styles.totalHead}><T v="caption" color={colors.honeyLight}>Total</T></View>
            </View>
            {standings.map((s) => (
              <View key={s.id} style={styles.gridRow}>
                <View style={styles.nameCell}>
                  <View style={[styles.dot, { backgroundColor: s.color }]} />
                  <T v="smallBold" color={colors.cream} numberOfLines={1}>{s.name}</T>
                </View>
                {o.holes.map((h) => {
                  const r = h.results.find((x) => x.scorerId === s.id);
                  return (
                    <View key={h.id} style={styles.cell}>
                      <T v="bodyBold" color={r ? colors.cream : 'rgba(246,238,220,0.35)'}>{r ? r.points : h.done ? '–' : '·'}</T>
                    </View>
                  );
                })}
                <View style={[styles.cell, styles.total]}><T v="h3" color={colors.scoreGreenDeep}>{s.points}</T></View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <T v="caption" color={colors.honeyLight} style={styles.section}>Classement</T>
      <View style={styles.ranking}>
        {standings.map((s, i) => (
          <View key={s.id} style={[styles.rank, i === 0 && styles.rankFirst]}>
            <T v="number" color={i === 0 ? colors.scoreGreenDeep : colors.cream} style={styles.rankNum}>{i + 1}</T>
            <View style={styles.avatars}>
              {s.members.slice(0, 3).map((m) => <Mannequin key={m.id} outfit={m.outfit} size={34} accent={s.color} label="" />)}
            </View>
            <View style={styles.flex}>
              <T v="h3" color={i === 0 ? colors.ink : colors.cream} numberOfLines={1}>{s.name}</T>
              <T v="small" color={i === 0 ? colors.inkMuted : colors.creamDark} numberOfLines={1}>{s.members.map((m) => m.name).join(', ')}</T>
            </View>
            <T v="h1" color={i === 0 ? colors.scoreGreen : colors.cream}>{s.points}</T>
          </View>
        ))}
      </View>

      {finished ? (
        <>
          <T v="caption" color={colors.honeyLight} style={styles.section}>Carte à partager · 9:16</T>
          <View style={styles.storyWrap}>
            <View style={styles.story} accessible accessibilityLabel="Aperçu de la carte à partager">
              <T v="caption" color={colors.neonPink}>Bar Golf Club</T>
              <T v="h2" color={colors.cream} center>{o.consent.places ? o.title : 'Sortie entre amis'}</T>
              <View style={styles.storyPodium}>
                {standings.slice(0, 3).map((s, i) => (
                  <View key={s.id} style={[styles.podium, { height: 70 - i * 14 }]}>
                    <Mannequin outfit={s.members[0]?.outfit ?? 'cap'} size={34} accent={s.color} label="" />
                    <T v="smallBold" color={colors.cream} numberOfLines={1}>{o.consent.names ? s.name : `Équipe ${i + 1}`}</T>
                    <T v="h3" color={colors.honeyLight}>{s.points}</T>
                  </View>
                ))}
              </View>
              {best ? <T v="small" color={colors.creamDark} center>Moment fort : {best.challenge.title}</T> : null}
              <T v="caption" color={colors.creamDark} center>{o.consent.photos && best?.photoUri ? 'Avec photo' : 'Avatars uniquement'}</T>
            </View>
            <View style={styles.consent}>
              <T v="smallBold" color={colors.cream}>Chaque participant valide avant d’apparaître. Par défaut : avatars seuls, sans photo ni lieu exact.</T>
              <Toggle label="Prénoms et noms d’équipe" value={o.consent.names} onChange={(v) => dispatch({ type: 'setConsent', key: 'names', value: v })} />
              <Toggle label="Photos des défis" value={o.consent.photos} onChange={(v) => dispatch({ type: 'setConsent', key: 'photos', value: v })} />
              <Toggle label="Nom de la sortie et lieux" value={o.consent.places} onChange={(v) => dispatch({ type: 'setConsent', key: 'places', value: v })} />
              <T v="small" color={colors.creamDark}>Aucun contenu partagé ne montre de verre ni de consommation.</T>
            </View>
          </View>

          <T v="caption" color={colors.honeyLight} style={styles.section}>Replay court · à la demande</T>
          {replay ? <Replay /> : (
            <Button label="Créer le replay animé" kind="secondary" onPress={() => setReplay(true)} />
          )}
        </>
      ) : null}

      <Pressable accessibilityRole="button" accessibilityLabel="Options de l’hôte : corriger un score, retirer un participant, passer la main" onPress={() => { tap(); router.push('/host'); }} style={styles.hostLink}>
        <T v="bodyBold" color={colors.honeyLight}>Options de l’hôte</T>
      </Pressable>
    </Screen>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={styles.toggle}>
      <T v="small" color={colors.cream} style={styles.flex}>{label}</T>
      <Switch value={value} onValueChange={(v) => { tap(); onChange(v); }} accessibilityLabel={label} trackColor={{ true: colors.neonPink, false: 'rgba(246,238,220,0.3)' }} thumbColor={colors.cream} />
    </View>
  );
}

function Replay() {
  const { state } = useOuting();
  const o = state.outing!;
  const [i, setI] = useState(0);
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, { toValue: 1, duration: 350, useNativeDriver: true }).start();
    const t = setTimeout(() => setI((x) => (x + 1) % o.holes.length), 1800);
    return () => clearTimeout(t);
  }, [i, fade, o.holes.length]);
  const h = o.holes[i];
  const standings = computeStandings({ ...o, holes: o.holes.slice(0, i + 1) });
  return (
    <Card tone="red" style={styles.replay}>
      <Animated.View style={{ opacity: fade, gap: 6 }}>
        <T v="caption" color={colors.honeyLight}>Trou {i + 1} · {h.challenge.title}</T>
        {standings.map((s) => (
          <View key={s.id} style={styles.replayRow}>
            <View style={[styles.dot, { backgroundColor: s.color }]} />
            <T v="bodyBold" color={colors.cream} style={styles.flex}>{s.name}</T>
            <T v="h3" color={colors.cream}>{s.points}</T>
          </View>
        ))}
      </Animated.View>
    </Card>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  footer: { gap: space.sm, marginHorizontal: -space.lg },
  footerInner: { gap: space.sm, paddingHorizontal: space.lg },
  footerPlain: { gap: space.sm },
  card: { backgroundColor: colors.scoreGreen, borderRadius: radius.lg, padding: space.md, borderWidth: 3, borderColor: colors.cream, gap: space.sm },
  cardHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pubgolf: { letterSpacing: 3 },
  gridRow: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: 'rgba(246,238,220,0.25)', minHeight: 40 },
  nameCell: { width: 120, flexDirection: 'row', alignItems: 'center', gap: 6, paddingRight: 6 },
  cell: { width: 36, alignItems: 'center', justifyContent: 'center', minHeight: 40 },
  cellNow: { backgroundColor: 'rgba(255,79,163,0.35)', borderRadius: 8 },
  total: { width: 52, backgroundColor: colors.cream, borderRadius: 8, marginLeft: 6 },
  totalHead: { width: 52, marginLeft: 6, alignItems: 'center', justifyContent: 'center', minHeight: 40 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  section: { marginTop: space.lg, marginBottom: space.sm },
  ranking: { gap: space.sm },
  rank: { flexDirection: 'row', alignItems: 'center', gap: space.sm, minHeight: touch.cta, padding: space.md, borderRadius: radius.lg, backgroundColor: 'rgba(246,238,220,0.08)' },
  rankFirst: { backgroundColor: colors.cream },
  rankNum: { width: 40, fontSize: 32, lineHeight: 36 },
  avatars: { flexDirection: 'row' },
  storyWrap: { gap: space.md },
  story: { alignSelf: 'center', width: 200, aspectRatio: 9 / 16, backgroundColor: colors.pubRedDeep, borderRadius: radius.lg, borderWidth: 3, borderColor: colors.neonPink, padding: space.md, alignItems: 'center', justifyContent: 'space-between' },
  storyPodium: { flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  podium: { width: 52, alignItems: 'center', justifyContent: 'flex-end', gap: 2 },
  consent: { gap: space.sm, backgroundColor: 'rgba(246,238,220,0.08)', borderRadius: radius.lg, padding: space.md },
  toggle: { flexDirection: 'row', alignItems: 'center', gap: space.sm, minHeight: touch.min },
  replay: { gap: 6 },
  replayRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  hostLink: { minHeight: touch.min, alignItems: 'center', justifyContent: 'center', marginTop: space.lg },
});
