import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, View } from 'react-native';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { Flag } from '@/components/Flag';
import { success, tap } from '@/components/haptics';
import { Header } from '@/components/Header';
import { Mannequin } from '@/components/Mannequin';
import { SafetyBar } from '@/components/SafetyBar';
import { Screen } from '@/components/Screen';
import { T } from '@/components/T';
import { KIND_LABEL, SCORE_WORD } from '@/data/challenges';
import { scorersOf, useOuting } from '@/store/outing';
import { colors, radius, space, touch } from '@/theme/tokens';

export default function HoleScreen() {
  const { state, dispatch } = useOuting();
  const o = state.outing;
  const pop = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (o?.status === 'finished') router.replace('/scoreboard');
  }, [o?.status]);

  if (!o || o.status === 'finished') return null;

  const hole = o.holes[o.currentHole];
  const scorers = scorersOf(o);
  const doneIds = new Set(hole.results.map((r) => r.scorerId));
  const last = o.currentHole === o.holes.length - 1;

  const mark = (id: string) => {
    if (doneIds.has(id)) return;
    dispatch({ type: 'score', scorerId: id, points: hole.challenge.points });
    success();
    Animated.sequence([
      Animated.spring(pop, { toValue: 1.12, useNativeDriver: true, speed: 50 }),
      Animated.spring(pop, { toValue: 1, useNativeDriver: true, speed: 30 }),
    ]).start();
  };

  const takePhoto = async () => {
    if (!o.privacy.photos) {
      dispatch({ type: 'setPrivacy', key: 'photos', value: true });
      return;
    }
    try {
      const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.6, allowsEditing: true });
      if (!res.canceled && res.assets[0]) dispatch({ type: 'setPhoto', uri: res.assets[0].uri });
    } catch {
      // Le choix de photo est facultatif : une erreur n'empêche jamais de jouer.
    }
  };

  const footer = (
    <View style={styles.footer}>
      <View style={styles.footerInner}>
        <View style={styles.row}>
          <Button label="Feuille de score" kind="secondary" style={styles.flex} onPress={() => router.push('/scoreboard')} />
          <Button label="Pause" kind="ghost" onPress={() => { dispatch({ type: 'pause' }); router.replace('/'); }} />
        </View>
        <Button
          label={last ? 'Terminer la sortie' : 'Trou suivant'}
          size="cta"
          kind="green"
          hint="Le groupe passe au trou suivant quand il le décide"
          onPress={() => {
            dispatch({ type: 'holeDone' });
            dispatch({ type: 'nextHole' });
            if (last) router.replace('/scoreboard');
          }}
        />
      </View>
      <SafetyBar />
    </View>
  );

  return (
    <Screen footer={footer} padded={false}>
      <View style={styles.top}>
        <Header
          title={hole.place.name}
          kicker={`Trou ${o.currentHole + 1} sur ${o.holes.length}`}
          light
          onBack={() => router.replace('/course')}
          right={
            <Pressable accessibilityRole="button" accessibilityLabel="Options de l’hôte" onPress={() => { tap(); router.push('/host'); }} style={styles.hostBtn}>
              <T v="caption" color={colors.cream}>Hôte</T>
            </Pressable>
          }
        />
        <View style={styles.progress} accessible accessibilityLabel={`Progression : ${o.holes.filter((h) => h.done).length} trous joués sur ${o.holes.length}`}>
          {o.holes.map((h, i) => (
            <View key={h.id} style={[styles.seg, h.done && styles.segDone, i === o.currentHole && styles.segNow]} />
          ))}
        </View>
      </View>

      <View style={styles.body}>
        <Card style={styles.challenge}>
          <View style={styles.flagRow}>
            <Flag size={56} />
            <View style={styles.kind}>
              <Chip label={KIND_LABEL[hole.challenge.kind]} tone="red" active />
            </View>
            <Animated.View style={[styles.points, { transform: [{ scale: pop }] }]} accessible accessibilityLabel={`${hole.challenge.points} points, ${SCORE_WORD[hole.challenge.points]}`}>
              <T v="number" color={colors.cream}>{hole.challenge.points}</T>
              <T v="caption" color={colors.honeyLight}>{SCORE_WORD[hole.challenge.points]}</T>
            </Animated.View>
          </View>
          <T v="h1" accessibilityRole="header">{hole.challenge.title}</T>
          <T v="body" color={colors.inkSoft}>{hole.challenge.brief}</T>
        </Card>

        <T v="caption" color={colors.inkMuted} style={styles.label}>Qui a réussi ? Appuyer sur « Fait »</T>
        <View style={styles.scorers}>
          {scorers.map((s) => {
            const done = doneIds.has(s.id);
            return (
              <Pressable
                key={s.id}
                accessibilityRole="button"
                accessibilityLabel={`${s.name}${done ? ', défi fait' : ''}`}
                accessibilityState={{ checked: done }}
                onPress={() => mark(s.id)}
                style={[styles.scorer, done && { backgroundColor: s.color, borderColor: s.color }]}
              >
                <View style={styles.avatars}>
                  {s.members.slice(0, 3).map((m) => <Mannequin key={m.id} outfit={m.outfit} size={30} accent={s.color} label="" />)}
                </View>
                <T v="bodyBold" color={done ? colors.cream : colors.ink} numberOfLines={1} style={styles.flex}>{s.name}</T>
                <View style={[styles.fait, done && styles.faitOn]}>
                  <T v="smallBold" color={done ? s.color : colors.cream}>{done ? `+${hole.challenge.points}` : 'Fait'}</T>
                </View>
              </Pressable>
            );
          })}
        </View>
        {hole.results.length > 0 ? <Button label="Annuler le dernier point" kind="ghost" size="sm" onPress={() => dispatch({ type: 'undoScore' })} /> : null}

        <Card style={styles.photo}>
          <View style={styles.flex}>
            <T v="h3">Photo du défi</T>
            <T v="small" color={colors.inkMuted}>{o.privacy.photos ? 'Facultative, visible du groupe seulement. Supprimable à tout moment.' : 'Désactivée par défaut. Un appui pour autoriser, un autre pour choisir.'}</T>
          </View>
          {hole.photoUri ? (
            <Pressable accessibilityRole="button" accessibilityLabel="Supprimer la photo" onPress={() => dispatch({ type: 'setPhoto', uri: undefined })}>
              <Image source={{ uri: hole.photoUri }} style={styles.thumb} accessibilityIgnoresInvertColors />
            </Pressable>
          ) : (
            <Button label={o.privacy.photos ? 'Choisir' : 'Autoriser'} kind="secondary" size="sm" onPress={takePhoto} />
          )}
        </Card>

        <T v="small" color={colors.inkMuted} center style={styles.note}>Pause, toilettes, verre fini ou pas : rien ne change le score. On avance quand le groupe le décide.</T>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row', gap: space.sm },
  footer: { gap: space.sm, marginHorizontal: -space.lg },
  footerInner: { gap: space.sm, paddingHorizontal: space.lg },
  top: { backgroundColor: colors.pubRed, paddingBottom: space.md, borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl },
  hostBtn: { minWidth: touch.min, minHeight: touch.min, alignItems: 'center', justifyContent: 'center', borderRadius: radius.pill, borderWidth: 1.5, borderColor: colors.honeyLight },
  progress: { flexDirection: 'row', gap: 4, paddingHorizontal: space.lg },
  seg: { flex: 1, height: 6, borderRadius: 3, backgroundColor: 'rgba(246,238,220,0.25)' },
  segDone: { backgroundColor: colors.honeyLight },
  segNow: { backgroundColor: colors.neonPink },
  body: { padding: space.lg, gap: space.md },
  challenge: { gap: space.md },
  flagRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  kind: { flex: 1, alignItems: 'flex-start' },
  points: { backgroundColor: colors.scoreGreen, borderRadius: radius.lg, paddingHorizontal: 14, paddingVertical: 6, alignItems: 'center', minWidth: 76 },
  label: { marginTop: space.xs },
  scorers: { gap: space.sm },
  scorer: { flexDirection: 'row', alignItems: 'center', gap: space.sm, minHeight: touch.cta, paddingHorizontal: space.md, borderRadius: radius.lg, backgroundColor: colors.paper, borderWidth: 2, borderColor: colors.line },
  avatars: { flexDirection: 'row', marginLeft: -4 },
  fait: { minWidth: 64, minHeight: 36, borderRadius: radius.pill, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12 },
  faitOn: { backgroundColor: colors.cream },
  photo: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  thumb: { width: 64, height: 64, borderRadius: radius.md },
  note: { paddingHorizontal: space.md },
});
