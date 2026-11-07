import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { Flag } from '@/components/Flag';
import { success, tap } from '@/components/haptics';
import { Header } from '@/components/Header';
import { Screen } from '@/components/Screen';
import { T } from '@/components/T';
import { KIND_LABEL, SEARCHABLE_PLACES, type Place } from '@/data/places';
import { useOuting } from '@/store/outing';
import { colors, radius, space, touch } from '@/theme/tokens';

const MAP_W = 370;
const MAP_H = 300;

export default function Course() {
  const { state, dispatch } = useOuting();
  const o = state.outing;
  const [query, setQuery] = useState('');
  const [replacing, setReplacing] = useState<number | null>(null);

  if (!o) {
    router.replace('/');
    return null;
  }

  const used = new Set(o.holes.map((h) => h.place.id));
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q && replacing === null) return [];
    return SEARCHABLE_PLACES.filter((p) => !used.has(p.id) && (!q || p.name.toLowerCase().includes(q) || p.area.toLowerCase().includes(q))).slice(0, 5);
  }, [query, replacing, o.holes]);

  const pathD = o.holes
    .map((h, i) => `${i === 0 ? 'M' : 'L'} ${h.place.x * MAP_W} ${h.place.y * MAP_H}`)
    .join(' ');

  const pick = (place: Place) => {
    if (replacing !== null) dispatch({ type: 'replacePlace', index: replacing, place });
    else dispatch({ type: 'addPlace', place });
    setReplacing(null);
    setQuery('');
    success();
  };

  const live = o.status !== 'draft';
  const footer = (
    <Button
      label={live ? 'Continuer la sortie' : 'C’est parti'}
      size="cta"
      kind="primary"
      icon={<Flag size={24} />}
      onPress={() => {
        if (!live) dispatch({ type: 'start' });
        router.push('/hole');
      }}
    />
  );

  return (
    <Screen footer={footer}>
      <Header title="Parcours" kicker={`${o.holes.length} trous · ${o.players.length} joueurs`} onBack={() => (live ? router.replace('/') : router.back())} />

      <View style={styles.map} accessible accessibilityLabel={`Carte du parcours : ${o.holes.map((h, i) => `trou ${i + 1} ${h.place.name}`).join(', ')}`}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${MAP_W} ${MAP_H}`} preserveAspectRatio="none">
          <Path d="M0 60 H370 M0 150 H370 M0 240 H370 M90 0 V300 M190 0 V300 M290 0 V300" stroke={colors.scoreGreenDeep} strokeWidth="14" strokeLinecap="round" opacity={0.6} />
          <Path d={pathD} stroke={colors.cream} strokeWidth="3" strokeDasharray="8 8" fill="none" strokeLinecap="round" />
        </Svg>
        {o.holes.map((h, i) => {
          const current = live && i === o.currentHole;
          return (
            <View key={h.id} style={[styles.pin, { left: `${h.place.x * 100}%`, top: `${h.place.y * 100}%` }]} pointerEvents="none">
              <Flag size={current ? 44 : 34} muted={h.done} />
              <View style={[styles.pinLabel, current && styles.pinCurrent]}>
                <T v="caption" color={current ? colors.ink : colors.cream}>{i + 1}</T>
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.list}>
        {o.holes.map((h, i) => (
          <Card key={h.id} style={[styles.hole, h.done && styles.holeDone]}>
            <View style={styles.num}>
              <T v="h2" color={colors.cream}>{i + 1}</T>
            </View>
            <View style={styles.flex}>
              <T v="h3" numberOfLines={1}>{h.place.name}</T>
              <View style={styles.meta}>
                <T v="small" color={colors.inkMuted}>{KIND_LABEL[h.place.kind]} · {h.place.area}</T>
                <View style={[styles.status, h.place.openStatus === 'confirmed' && styles.statusOk]}>
                  <T v="caption" color={h.place.openStatus === 'confirmed' ? colors.cream : colors.ink}>{h.place.openStatus === 'confirmed' ? 'Ouvert' : 'À vérifier'}</T>
                </View>
              </View>
            </View>
            {!h.done ? (
              <View style={styles.actions}>
                <Pressable accessibilityRole="button" accessibilityLabel={`Monter ${h.place.name}`} disabled={i === 0} onPress={() => { tap(); dispatch({ type: 'moveHole', from: i, to: i - 1 }); }} style={[styles.iconBtn, i === 0 && styles.off]}>
                  <T v="h3">↑</T>
                </Pressable>
                <Pressable accessibilityRole="button" accessibilityLabel={`Descendre ${h.place.name}`} disabled={i === o.holes.length - 1} onPress={() => { tap(); dispatch({ type: 'moveHole', from: i, to: i + 1 }); }} style={[styles.iconBtn, i === o.holes.length - 1 && styles.off]}>
                  <T v="h3">↓</T>
                </Pressable>
                <Pressable accessibilityRole="button" accessibilityLabel={`Remplacer ${h.place.name}, fermé ou complet`} onPress={() => { tap(); setReplacing(replacing === i ? null : i); }} style={[styles.iconBtn, replacing === i && styles.iconOn]}>
                  <T v="h3" color={replacing === i ? colors.cream : colors.ink}>⇄</T>
                </Pressable>
              </View>
            ) : (
              <T v="caption" color={colors.scoreGreen}>Joué</T>
            )}
          </Card>
        ))}
      </View>

      <Card style={styles.search}>
        <T v="caption" color={colors.inkMuted}>{replacing !== null ? `Remplacer le trou ${replacing + 1} par` : o.holes.length >= 9 ? 'Parcours complet (9 trous max)' : 'Ajouter un lieu'}</T>
        {o.holes.length < 9 || replacing !== null ? (
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Rechercher un bar, un café…"
            placeholderTextColor={colors.inkMuted}
            accessibilityLabel="Rechercher un lieu"
            style={styles.input}
          />
        ) : null}
        {results.map((p) => (
          <Pressable key={p.id} accessibilityRole="button" accessibilityLabel={`Choisir ${p.name}, ${KIND_LABEL[p.kind]}, ${p.area}, ouverture à vérifier`} onPress={() => pick(p)} style={styles.result}>
            <Flag size={26} />
            <View style={styles.flex}>
              <T v="bodyBold">{p.name}</T>
              <T v="small" color={colors.inkMuted}>{KIND_LABEL[p.kind]} · {p.area} · à vérifier</T>
            </View>
            <Chip label={replacing !== null ? 'Remplacer' : 'Ajouter'} tone="green" active />
          </Pressable>
        ))}
        {replacing !== null ? <Button label="Annuler" kind="ghost" size="sm" onPress={() => setReplacing(null)} /> : null}
        <T v="small" color={colors.inkMuted}>Aucun horaire inventé : si la source ne confirme pas l’ouverture, le lieu reste « à vérifier ».</T>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  map: { height: 260, borderRadius: radius.lg, backgroundColor: colors.scoreGreen, overflow: 'hidden', marginBottom: space.md },
  pin: { position: 'absolute', marginLeft: -17, marginTop: -40, alignItems: 'center' },
  pinLabel: { marginTop: -6, minWidth: 22, paddingHorizontal: 6, height: 22, borderRadius: 11, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  pinCurrent: { backgroundColor: colors.neonPink },
  list: { gap: space.sm },
  hole: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md },
  holeDone: { opacity: 0.6 },
  num: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.pubRed, alignItems: 'center', justifyContent: 'center' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  status: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill, backgroundColor: colors.honeyLight },
  statusOk: { backgroundColor: colors.scoreGreen },
  actions: { flexDirection: 'row', gap: 4 },
  iconBtn: { width: touch.min - 4, height: touch.min - 4, borderRadius: radius.sm, backgroundColor: colors.cream, alignItems: 'center', justifyContent: 'center' },
  iconOn: { backgroundColor: colors.ink },
  off: { opacity: 0.25 },
  search: { gap: space.sm, marginTop: space.md },
  input: { minHeight: touch.min + 4, borderRadius: radius.md, borderWidth: 2, borderColor: colors.creamDark, paddingHorizontal: 14, fontSize: 17, fontFamily: 'Nunito_700Bold', color: colors.ink, backgroundColor: colors.cream },
  result: { flexDirection: 'row', alignItems: 'center', gap: space.sm, minHeight: touch.min + 8, paddingVertical: 6 },
});
