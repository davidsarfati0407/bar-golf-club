import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, View } from 'react-native';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Flag } from '@/components/Flag';
import { success, tap } from '@/components/haptics';
import { Header } from '@/components/Header';
import { Mannequin } from '@/components/Mannequin';
import { SafetyBar } from '@/components/SafetyBar';
import { Screen } from '@/components/Screen';
import { StatusBox } from '@/components/StatusBox';
import { T } from '@/components/T';
import { useReducedMotion } from '@/components/useReducedMotion';
import { KIND_LABEL, pointsLabel } from '@/data/challenges';
import { computeStandings, scorersOf, useOuting } from '@/store/outing';
import { colors, motion, radius, space, touch } from '@/theme/tokens';

export default function HoleScreen() {
  const { state, dispatch } = useOuting();
  const o = state.outing;
  const reduced = useReducedMotion();
  const pop = useRef(new Animated.Value(1)).current;
  const [photoError, setPhotoError] = useState<string | null>(null);

  useEffect(() => {
    if (!o) router.replace('/');
    else if (o.status === 'finished') router.replace('/scoreboard');
    else if (o.status === 'draft') router.replace('/course');
  }, [o]);

  if (!o || o.status !== 'live' && o.status !== 'paused') return null;

  const hole = o.holes[o.currentHole];
  const scorers = scorersOf(o);
  const standings = computeStandings(o);
  const doneIds = new Set(hole.results.map((r) => r.scorerId));
  const last = o.currentHole === o.holes.length - 1;
  const isHost = state.meId === o.hostId;
  const waterRecent = !!o.waterReminderAt && Date.now() - o.waterReminderAt < 10 * 60 * 1000;

  const mark = (id: string) => {
    if (doneIds.has(id) || hole.cancelled) return;
    dispatch({ type: 'score', scorerId: id, points: hole.challenge.points });
    success();
    if (reduced) return;
    Animated.sequence([
      Animated.timing(pop, { toValue: 1.08, duration: motion.fast, useNativeDriver: true }),
      Animated.timing(pop, { toValue: 1, duration: motion.fast, useNativeDriver: true }),
    ]).start();
  };

  const takePhoto = async () => {
    setPhotoError(null);
    if (!o.privacy.photos) {
      dispatch({ type: 'setPrivacy', key: 'photos', value: true });
      return;
    }
    try {
      const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.6, allowsEditing: true });
      if (!res.canceled && res.assets[0]) dispatch({ type: 'setPhoto', uri: res.assets[0].uri });
    } catch {
      setPhotoError('Photo impossible pour le moment. Le défi se valide sans photo.');
    }
  };

  const next = () => {
    dispatch({ type: 'holeDone' });
    dispatch({ type: 'nextHole' });
    if (last) router.replace('/scoreboard');
  };

  return (
    <Screen footer={
      <View style={styles.footer}>
        <Button label={last ? 'Terminer la sortie' : 'Trou suivant'} size="cta" hint="Le groupe passe au trou suivant quand il le décide" onPress={next} />
        <SafetyBar />
      </View>
    } padded={false}>
      <View style={styles.top}>
        <Header
          title={hole.place.name}
          kicker={`Trou ${o.currentHole + 1} sur ${o.holes.length}`}
          onDark
          onBack={() => router.replace('/course')}
          right={
            <Pressable accessibilityRole="button" accessibilityLabel="Feuille de score et classement" onPress={() => { tap(); router.push('/scoreboard'); }} style={styles.scoreBtn}>
              <T v="caption" color={colors.gold}>Scores</T>
            </Pressable>
          }
        />
        <View style={styles.progress} accessible accessibilityLabel={`Progression : ${o.holes.filter((h) => h.done).length} trous joués sur ${o.holes.length}`}>
          {o.holes.map((h, i) => <View key={h.id} style={[styles.seg, h.done && styles.segDone, i === o.currentHole && styles.segNow]} />)}
        </View>
      </View>

      <View style={styles.body}>
        {o.status === 'paused' ? <StatusBox kind="empty" title="Sortie en pause" text="Rien ne presse. Reprenez quand le groupe est prêt." action={{ label: 'Reprendre', onPress: () => dispatch({ type: 'resume' }) }} /> : null}
        {waterRecent ? <View style={styles.water}><T v="smallBold" color={colors.water}>Pause eau proposée pour tout le monde. Ça ne change rien au score.</T></View> : null}

        {hole.cancelled ? (
          <StatusBox kind="error" title="Trou annulé par l’hôte" text="Ses points sont retirés pour tout le monde et il ne compte pas. L’hôte peut le rétablir." action={isHost ? { label: 'Rétablir', onPress: () => dispatch({ type: 'restoreHole', index: o.currentHole }) } : undefined} />
        ) : (
          <Card style={styles.challenge}>
            <View style={styles.challengeHead}>
              <View style={styles.flex}>
                <T v="caption" color={colors.inkMuted}>Catégorie · {KIND_LABEL[hole.challenge.kind]}</T>
                <T v="h1" accessibilityRole="header">{hole.challenge.title}</T>
              </View>
              <Flag size={34} />
            </View>
            <T v="body" color={colors.inkSoft}>{hole.challenge.brief}</T>
            <View style={styles.worth}>
              <T v="caption" color={colors.inkMuted}>Ce trou vaut</T>
              <Animated.View style={[styles.points, { transform: [{ scale: pop }] }]} accessible accessibilityLabel={pointsLabel(hole.challenge.points)}>
                <T v="number" color={colors.ivory}>{hole.challenge.points}</T>
                <T v="caption" color={colors.gold}>{hole.challenge.points > 1 ? 'points' : 'point'}</T>
              </Animated.View>
              <T v="small" color={colors.inkMuted} style={styles.flex}>pour chaque équipe qui réussit le défi.</T>
            </View>
          </Card>
        )}

        <T v="caption" color={colors.inkMuted}>Qui a réussi ?</T>
        <View style={styles.scorers}>
          {scorers.map((s) => {
            const done = doneIds.has(s.id);
            return (
              <Pressable
                key={s.id}
                accessibilityRole="button"
                accessibilityLabel={`${s.name}${s.left ? ', parti' : ''}${done ? ', défi fait' : ''}`}
                accessibilityState={{ checked: done, disabled: hole.cancelled }}
                disabled={hole.cancelled}
                onPress={() => mark(s.id)}
                style={[styles.scorer, done && { backgroundColor: s.color, borderColor: s.color }, s.left && styles.left]}
              >
                <View style={styles.avatars}>{s.members.slice(0, 3).map((m) => <Mannequin key={m.id} outfit={m.outfit} size={26} accent={s.color} label="" />)}</View>
                <T v="bodyBold" color={done ? colors.white : colors.ink} numberOfLines={1} style={styles.flex}>{s.name}{s.left ? ' · parti' : ''}</T>
                <View style={[styles.fait, done && styles.faitOn]}>
                  <T v="smallBold" color={done ? s.color : colors.ivory}>{done ? `+${hole.challenge.points}` : 'Fait'}</T>
                </View>
              </Pressable>
            );
          })}
        </View>
        {hole.results.length > 0 ? <Button label="Annuler le dernier point" kind="ghost" size="sm" onPress={() => dispatch({ type: 'undoScore' })} /> : null}

        <Pressable accessibilityRole="button" accessibilityLabel="Ouvrir la feuille de score" onPress={() => { tap(); router.push('/scoreboard'); }}>
          <Card tone="green" style={styles.live}>
            <T v="caption" color={colors.gold}>Classement en direct</T>
            {standings.slice(0, 3).map((s) => (
              <View key={s.id} style={styles.liveRow}>
                <T v="numberCell" color={colors.ivoryDark} style={styles.liveRank}>{s.rank}</T>
                <View style={[styles.dot, { backgroundColor: s.color }]} />
                <T v="smallBold" color={colors.ivory} numberOfLines={1} style={styles.flex}>{s.name}</T>
                <T v="numberSmall" color={colors.ivory}>{s.points}</T>
              </View>
            ))}
            <T v="smallBold" color={colors.gold}>Feuille complète</T>
          </Card>
        </Pressable>

        <Card style={styles.photo}>
          <View style={styles.flex}>
            <T v="h3">Photo du défi</T>
            <T v="small" color={colors.inkMuted}>{o.privacy.photos ? 'Facultative, visible du groupe seulement. Supprimable à tout moment.' : 'Désactivée par défaut. Un appui pour autoriser, un autre pour choisir.'}</T>
            {photoError ? <T v="small" color={colors.danger}>{photoError}</T> : null}
          </View>
          {hole.photoUri ? (
            <Pressable accessibilityRole="button" accessibilityLabel="Supprimer la photo" onPress={() => dispatch({ type: 'setPhoto', uri: undefined })}>
              <Image source={{ uri: hole.photoUri }} style={styles.thumb} accessibilityIgnoresInvertColors />
            </Pressable>
          ) : (
            <Button label={o.privacy.photos ? 'Choisir' : 'Autoriser'} kind="secondary" size="sm" onPress={takePhoto} />
          )}
        </Card>

        <View style={styles.row}>
          <Button label="Pause" kind="ghost" size="sm" style={styles.flex} onPress={() => { dispatch({ type: 'pause' }); router.replace('/'); }} />
          {isHost ? <Button label="Options de l’hôte" kind="ghost" size="sm" style={styles.flex} onPress={() => router.push('/host')} /> : null}
          <Button label="Règles" kind="ghost" size="sm" onPress={() => router.push('/rules')} />
        </View>
        <T v="small" color={colors.inkMuted} center style={styles.note}>Pause, toilettes, verre fini ou pas : rien ne change le score.</T>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row', gap: space.sm },
  footer: { gap: space.sm },
  top: { backgroundColor: colors.fairway, paddingBottom: space.md },
  scoreBtn: { minWidth: touch.min, minHeight: touch.min, alignItems: 'center', justifyContent: 'center', borderRadius: radius.pill, borderWidth: 1, borderColor: colors.gold, paddingHorizontal: 10 },
  progress: { flexDirection: 'row', gap: 4, paddingHorizontal: space.lg },
  seg: { flex: 1, height: 4, borderRadius: 2, backgroundColor: colors.fairwayLine },
  segDone: { backgroundColor: colors.ivoryDark },
  segNow: { backgroundColor: colors.gold },
  body: { padding: space.lg, gap: space.md },
  water: { padding: space.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.water },
  challenge: { gap: space.md },
  challengeHead: { flexDirection: 'row', alignItems: 'flex-start', gap: space.sm },
  worth: { flexDirection: 'row', alignItems: 'center', gap: space.md, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: space.md },
  points: { backgroundColor: colors.fairway, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 6, alignItems: 'center', minWidth: 72 },
  scorers: { gap: space.sm },
  scorer: { flexDirection: 'row', alignItems: 'center', gap: space.sm, minHeight: touch.cta, paddingHorizontal: space.md, borderRadius: radius.lg, backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.line },
  left: { opacity: 0.6 },
  avatars: { flexDirection: 'row', marginLeft: -4 },
  fait: { minWidth: 60, minHeight: 36, borderRadius: radius.pill, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  faitOn: { backgroundColor: colors.white },
  live: { gap: 6 },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  liveRank: { width: 14 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  photo: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  thumb: { width: 64, height: 64, borderRadius: radius.md },
  note: { paddingHorizontal: space.md },
});
