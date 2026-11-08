import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, Share, StyleSheet, View } from 'react-native';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { GreenJacket } from '@/components/GreenJacket';
import { success, tap } from '@/components/haptics';
import { Header } from '@/components/Header';
import { Mannequin } from '@/components/Mannequin';
import { Neon } from '@/components/Neon';
import { SafetyBar } from '@/components/SafetyBar';
import { ScoreTable } from '@/components/ScoreTable';
import { Screen } from '@/components/Screen';
import { StatusBox } from '@/components/StatusBox';
import { T } from '@/components/T';
import { Toggle } from '@/components/Toggle';
import { useReducedMotion } from '@/components/useReducedMotion';
import { MODES } from '@/data/challenges';
import { computeStandings, useOuting, type Standing } from '@/store/outing';
import type { Outing } from '@/store/types';
import { colors, motion, radius, space, touch } from '@/theme/tokens';

export default function Scoreboard() {
  const { state, dispatch } = useOuting();
  const o = state.outing;
  const [replay, setReplay] = useState(false);
  const [shared, setShared] = useState<'idle' | 'done' | 'copied' | 'error'>('idle');
  const [hostOpen, setHostOpen] = useState(false);

  useEffect(() => {
    if (!o) router.replace('/');
  }, [o]);
  if (!o) return null;

  const standings = computeStandings(o);
  const finished = o.status === 'finished';
  const leader = standings[0];
  const tied = standings.filter((s) => s.rank === 1);
  const isHost = state.meId === o.hostId;
  const played = o.holes.filter((h) => h.done && !h.cancelled);
  const best = played.filter((h) => h.results.length).sort((a, b) => b.results.length * b.challenge.points - a.results.length * a.challenge.points)[0];
  const modeName = MODES.find((m) => m.id === o.gameMode)?.name ?? 'Classique';

  const recapText = () => [
    `Bar Golf Club · ${o.consent.places ? o.title : 'Sortie entre amis'} · ${modeName}`,
    ...standings.map((s) => `${s.rank}. ${s.name} — ${s.points} pt${s.points > 1 ? 's' : ''}${o.consent.names ? ` (${s.members.map((m) => m.name).join(', ')})` : ''}`),
    best ? `Moment fort : ${best.challenge.title}` : '',
  ].filter(Boolean).join('\n');

  const shareRecap = async () => {
    const text = recapText();
    try {
      const res = await Share.share({ message: text });
      if (res.action === Share.dismissedAction) return;
      setShared('done');
      success();
    } catch {
      try {
        await Clipboard.setStringAsync(text);
        setShared('copied');
        success();
      } catch {
        setShared('error');
      }
    }
  };

  // Ranger : on quitte l'écran d'abord, puis on archive. Plus de page blanche.
  const archive = () => {
    router.replace('/');
    setTimeout(() => dispatch({ type: 'archive' }), 0);
  };

  return (
    <Screen dark footer={finished ? (
      <View style={styles.footer}>
        <Button label={shared === 'done' ? 'Récap partagé' : shared === 'copied' ? 'Récap copié' : 'Partager le récap'} size="cta" onDark onPress={shareRecap} />
        <Button label="Ranger dans les souvenirs" kind="ghost" onDark onPress={archive} />
      </View>
    ) : (
      <View style={styles.footer}>
        <Button label="Retour au trou" size="cta" onDark onPress={() => (router.canGoBack() ? router.back() : router.replace('/hole'))} />
        <SafetyBar onDark />
      </View>
    )}>
      <Header title={finished ? 'Résumé de fin' : 'Feuille de score'} onDark kicker={`${o.title} · ${modeName}`} onBack={() => (finished ? router.replace('/') : router.canGoBack() ? router.back() : router.replace('/hole'))} />

      {finished ? (
        played.length === 0 ? (
          <StatusBox kind="empty" onDark title="Aucun trou joué" text="La sortie s’est terminée avant le premier défi. Rien à classer, rien à partager." />
        ) : (
          <Victory leader={leader} tied={tied} competition={o.gameMode === 'competition'} />
        )
      ) : null}

      {finished && played.length > 0 ? (
        <>
          <T v="caption" color={colors.gold} style={styles.section}>Carte à partager · 9:16</T>
          <ShareCard outing={o} standings={standings} best={best?.challenge.title} />
          <View style={styles.consent}>
            <T v="smallBold" color={colors.ivory}>Avant de partager : chaque participant valide ce qui apparaît. Par défaut, noms d’équipe et avatars seulement.</T>
            <Toggle onDark label="Prénoms des joueurs" value={o.consent.names} onChange={(v) => dispatch({ type: 'setConsent', key: 'names', value: v })} />
            <Toggle onDark label="Photos des défis" hint={o.privacy.photos ? undefined : 'Aucune photo prise : rien à partager.'} value={o.consent.photos} onChange={(v) => dispatch({ type: 'setConsent', key: 'photos', value: v })} />
            <Toggle onDark label="Nom de la sortie et lieux" value={o.consent.places} onChange={(v) => dispatch({ type: 'setConsent', key: 'places', value: v })} />
            <T v="small" color={colors.ivoryDark}>Aucun contenu partagé ne montre de verre ni de consommation.</T>
            {shared === 'error' ? <StatusBox kind="error" onDark title="Partage indisponible" text="Ni partage ni copie possibles ici. Montre l’écran, ça marche aussi." /> : null}
          </View>
        </>
      ) : null}

      <T v="caption" color={colors.gold} style={styles.section}>Feuille de score</T>
      <Card tone="dark">
        <View style={styles.cardHead}>
          <T v="h2" color={colors.ivory}>Bar Golf Club</T>
          <T v="caption" color={colors.ivoryDark}>{o.holes.length} trous</T>
        </View>
        <ScoreTable outing={o} />
      </Card>

      <T v="caption" color={colors.gold} style={styles.section}>Classement</T>
      <View style={styles.ranking}>
        {standings.map((s) => (
          <View key={s.id} style={[styles.rank, s.rank === 1 && styles.rankFirst]}>
            <T v="number" color={s.rank === 1 ? colors.fairway : colors.ivory} style={styles.rankNum}>{s.rank}</T>
            <View style={styles.avatars}>{s.members.slice(0, 3).map((m) => <Mannequin key={m.id} outfit={m.outfit} size={30} accent={s.color} label="" />)}</View>
            <View style={styles.flex}>
              <T v="h3" color={s.rank === 1 ? colors.ink : colors.ivory} numberOfLines={2}>{s.name}{s.left ? ' · parti' : ''}</T>
              <T v="small" color={s.rank === 1 ? colors.inkMuted : colors.ivoryDark} numberOfLines={1}>{s.members.map((m) => m.name).join(', ')} · {s.wins} défi{s.wins > 1 ? 's' : ''}</T>
            </View>
            <T v="number" color={s.rank === 1 ? colors.fairway : colors.ivory}>{s.points}</T>
          </View>
        ))}
      </View>

      {finished && played.length > 0 ? (
        <>
          <T v="caption" color={colors.gold} style={styles.section}>Replay court · à la demande</T>
          {replay ? <Replay outing={o} /> : <Button label="Créer le replay animé" kind="secondary" onDark onPress={() => setReplay(true)} />}
        </>
      ) : null}

      {isHost ? (
        <View style={styles.hostBox}>
          <Pressable accessibilityRole="button" accessibilityState={{ expanded: hostOpen }} accessibilityLabel="Options de l’hôte" onPress={() => { tap(); setHostOpen(!hostOpen); }} style={styles.hostToggle}>
            <T v="smallBold" color={colors.ivoryDark}>Options de l’hôte</T>
            <T v="smallBold" color={colors.gold}>{hostOpen ? 'Replier' : 'Déplier'}</T>
          </Pressable>
          {hostOpen ? (
            <View style={styles.hostActions}>
              <Button label="Corriger un score, retirer, passer la main" kind="secondary" onDark size="sm" onPress={() => router.push('/host')} />
              {!finished ? <Button label="Terminer maintenant" kind="ghost" onDark size="sm" onPress={() => dispatch({ type: 'finish' })} /> : null}
            </View>
          ) : null}
        </View>
      ) : null}
    </Screen>
  );
}

// Victoire d'abord : vainqueur, veste verte en Compétition, néon qui s'allume une fois.
function Victory({ leader, tied, competition }: { leader: Standing; tied: Standing[]; competition: boolean }) {
  const exaequo = tied.length > 1;
  return (
    <View style={styles.victory} accessible accessibilityLabel={exaequo ? `Ex aequo : ${tied.map((t) => t.name).join(' et ')}, ${leader.points} points` : `${leader.name} gagne avec ${leader.points} points`}>
      {competition ? <GreenJacket size={110} /> : <View style={styles.avatarsBig}>{leader.members.slice(0, 3).map((m) => <Mannequin key={m.id} outfit={m.outfit} size={56} accent={leader.color} label="" />)}</View>}
      <T v="caption" color={colors.ivoryDark} center>{exaequo ? 'Ex aequo' : competition ? 'Veste verte' : 'Vainqueur'}</T>
      <Neon size="h1" center>{exaequo ? tied.map((t) => t.name).join(' & ') : leader.name}</Neon>
      <T v="number" color={colors.ivory} center>{leader.points} <T v="h3" color={colors.ivoryDark}>pt{leader.points > 1 ? 's' : ''}</T></T>
    </View>
  );
}

// Carte 9:16 : noms d'équipe toujours, prénoms et lieux seulement avec consentement.
function ShareCard({ outing: o, standings, best }: { outing: Outing; standings: Standing[]; best?: string }) {
  return (
    <View style={styles.story} accessible accessibilityLabel="Aperçu de la carte à partager">
      <Neon size="h2" center textStyle={styles.storyTitle}>Bar Golf Club</Neon>
      <T v="smallBold" color={colors.ivory} center numberOfLines={2}>{o.consent.places ? o.title : 'Sortie entre amis'}</T>
      <View style={styles.storyPodium}>
        {standings.slice(0, 3).map((s, i) => (
          <View key={s.id} style={[styles.podium, { paddingBottom: [16, 6, 0][i] }]}>
            <Mannequin outfit={s.members[0]?.outfit ?? 'cap'} size={30} accent={s.color} label="" />
            <T v="smallBold" color={colors.ivory} center numberOfLines={2} style={styles.podiumName}>{s.name}</T>
            {o.consent.names ? <T v="small" color={colors.ivoryDark} center numberOfLines={2} style={styles.podiumName}>{s.members.map((m) => m.name).join(', ')}</T> : null}
            <T v="numberSmall" color={colors.gold}>{s.points}</T>
          </View>
        ))}
      </View>
      {best ? <T v="small" color={colors.ivoryDark} center numberOfLines={2}>Moment fort : {best}</T> : null}
      <T v="caption" color={colors.ivoryDark} center>{o.consent.photos && o.holes.some((h) => h.photoUri) ? 'Avec photos' : 'Avatars uniquement'}</T>
    </View>
  );
}

function Replay({ outing: o }: { outing: Outing }) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!reduced) {
      fade.setValue(0);
      Animated.timing(fade, { toValue: 1, duration: motion.slow, useNativeDriver: true }).start();
    }
    const t = setTimeout(() => setI((x) => (x + 1) % o.holes.length), 1800);
    return () => clearTimeout(t);
  }, [i, fade, o.holes.length, reduced]);
  const h = o.holes[i];
  const standings = computeStandings({ ...o, holes: o.holes.slice(0, i + 1) });
  return (
    <Card tone="dark" style={styles.replay}>
      <Animated.View style={{ opacity: fade, gap: 6 }}>
        <T v="caption" color={colors.gold}>Trou {i + 1} · {h.cancelled ? 'annulé' : h.challenge.title}</T>
        {standings.map((s) => (
          <View key={s.id} style={styles.replayRow}>
            <View style={[styles.dot, { backgroundColor: s.color }]} />
            <T v="bodyBold" color={colors.ivory} style={styles.flex}>{s.name}</T>
            <T v="numberSmall" color={colors.ivory}>{s.points}</T>
          </View>
        ))}
      </Animated.View>
    </Card>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  footer: { gap: space.sm },
  section: { marginTop: space.xl, marginBottom: space.sm },
  victory: { alignItems: 'center', gap: space.sm, paddingVertical: space.lg },
  avatarsBig: { flexDirection: 'row', gap: 4 },
  cardHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: space.sm },
  ranking: { gap: space.sm },
  rank: { flexDirection: 'row', alignItems: 'center', gap: space.sm, minHeight: touch.cta, padding: space.md, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.fairwayLine },
  rankFirst: { backgroundColor: colors.ivory, borderColor: colors.ivory },
  rankNum: { width: 28, fontSize: 26, lineHeight: 30 },
  avatars: { flexDirection: 'row' },
  story: { alignSelf: 'center', width: 216, aspectRatio: 9 / 16, backgroundColor: colors.fairwayDeep, borderRadius: radius.lg, borderWidth: 1.5, borderColor: colors.gold, padding: space.md, alignItems: 'center', justifyContent: 'space-between' },
  storyTitle: { fontSize: 20, lineHeight: 24 },
  storyPodium: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 2 },
  podium: { width: 62, alignItems: 'center', gap: 2 },
  podiumName: { fontSize: 10, lineHeight: 12 },
  consent: { gap: space.sm, borderWidth: 1, borderColor: colors.fairwayLine, borderRadius: radius.lg, padding: space.md, marginTop: space.md },
  replay: { gap: 6 },
  replayRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  hostBox: { marginTop: space.xl, borderTopWidth: 1, borderTopColor: colors.fairwayLine, paddingTop: space.sm },
  hostToggle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: touch.min },
  hostActions: { gap: space.sm, paddingBottom: space.sm },
});
