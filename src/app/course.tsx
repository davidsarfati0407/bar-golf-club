import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, useWindowDimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Flag } from '@/components/Flag';
import { success, tap } from '@/components/haptics';
import { Header } from '@/components/Header';
import { Screen } from '@/components/Screen';
import { StatusBox } from '@/components/StatusBox';
import { T } from '@/components/T';
import { MODES } from '@/data/challenges';
import { KIND_LABEL, SEARCHABLE_PLACES, type Place } from '@/data/places';
import { useOuting } from '@/store/outing';
import { colors, radius, space, touch } from '@/theme/tokens';

const MAP_W = 358;
const MAP_H = 240;

export default function Course() {
  const { state, dispatch } = useOuting();
  const o = state.outing;
  const [query, setQuery] = useState('');
  const [replacing, setReplacing] = useState<number | null>(null);
  const { width } = useWindowDimensions();
  const narrow = width < 360;

  const status = o?.status;
  const guest = !!o && state.meId !== o.hostId;
  useEffect(() => {
    if (!o) router.replace('/');
    // L'hôte lance la sortie : les invités suivent automatiquement sur l'écran du trou.
    else if (status === 'live' && guest) router.replace('/hole');
  }, [o, status, guest]);

  const usedIds = o ? o.holes.map((h) => h.place.id).join(',') : '';
  const results = useMemo(() => {
    const used = new Set(usedIds.split(','));
    const q = query.trim().toLowerCase();
    if (!q && replacing === null) return [];
    return SEARCHABLE_PLACES.filter((p) => !used.has(p.id) && (!q || p.name.toLowerCase().includes(q) || p.area.toLowerCase().includes(q))).slice(0, 5);
  }, [query, replacing, usedIds]);

  if (!o) return null;

  const pathD = o.holes.map((h, i) => `${i === 0 ? 'M' : 'L'} ${h.place.x * MAP_W} ${h.place.y * MAP_H}`).join(' ');
  const live = o.status !== 'draft';
  const isHost = state.meId === o.hostId;
  const modeName = MODES.find((m) => m.id === o.gameMode)?.name ?? 'Classique';

  const pick = (place: Place) => {
    if (replacing !== null) dispatch({ type: 'replacePlace', index: replacing, place });
    else dispatch({ type: 'addPlace', place });
    setReplacing(null);
    setQuery('');
    success();
  };

  return (
    <Screen footer={
      <Button label={live ? 'Continuer la sortie' : 'C’est parti'} size="cta" icon={<Flag size={22} onDark />} onPress={() => { if (!live) dispatch({ type: 'start' }); router.push('/hole'); }} />
    }>
      <Header title="Parcours" kicker={`${o.holes.length} trous · ${o.players.length} joueurs · ${modeName}`} onBack={() => (live ? router.replace('/') : router.back())} />

      <View style={styles.map} accessible accessibilityLabel={`Carte du parcours : ${o.holes.map((h, i) => `trou ${i + 1} ${h.place.name}`).join(', ')}`}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${MAP_W} ${MAP_H}`} preserveAspectRatio="none">
          <Path d="M0 50 H358 M0 120 H358 M0 190 H358 M90 0 V240 M180 0 V240 M270 0 V240" stroke={colors.fairwayLight} strokeWidth="10" strokeLinecap="round" />
          <Path d={pathD} stroke={colors.ivory} strokeWidth="2" strokeDasharray="6 7" fill="none" strokeLinecap="round" />
        </Svg>
        {o.holes.map((h, i) => {
          const current = live && i === o.currentHole;
          return (
            <View key={h.id} style={[styles.pin, { left: `${h.place.x * 100}%`, top: `${h.place.y * 100}%` }]} pointerEvents="none">
              <Flag size={current ? 36 : 28} muted={h.done || h.cancelled} onDark />
              <View style={[styles.pinLabel, current && styles.pinCurrent]}>
                <T v="numberCell" color={current ? colors.ink : colors.ivory}>{i + 1}</T>
              </View>
            </View>
          );
        })}
      </View>
      {o.gameMode === 'express' ? <T v="small" color={colors.inkMuted} style={styles.note}>Express : durée indicative d’une heure environ, jamais garantie.</T> : null}

      <View style={styles.list}>
        {o.holes.map((h, i) => (
          <Card key={h.id} style={[styles.hole, narrow && styles.holeNarrow, (h.done || h.cancelled) && styles.holeDone]}>
            <View style={styles.num}><T v="numberSmall" color={colors.ivory}>{i + 1}</T></View>
            <View style={styles.flex}>
              <T v="h3" numberOfLines={2}>{h.place.name}</T>
              <View style={styles.meta}>
                <T v="small" color={colors.inkMuted} numberOfLines={1}>{KIND_LABEL[h.place.kind]} · {h.place.area}</T>
                <View style={[styles.status, h.place.openStatus === 'confirmed' && styles.statusOk]}>
                  <T v="caption" color={h.place.openStatus === 'confirmed' ? colors.ivory : colors.ink}>{h.place.openStatus === 'confirmed' ? 'Ouvert' : 'À vérifier'}</T>
                </View>
              </View>
            </View>
            {h.cancelled ? <T v="caption" color={colors.danger}>Annulé</T> : h.done ? <T v="caption" color={colors.success}>Joué</T> : (
              <View style={[styles.actions, narrow && styles.actionsNarrow]}>
                <Pressable accessibilityRole="button" accessibilityLabel={`Monter ${h.place.name}`} disabled={i === 0} onPress={() => { tap(); dispatch({ type: 'moveHole', from: i, to: i - 1 }); }} style={[styles.iconBtn, i === 0 && styles.off]}><T v="bodyBold">↑</T></Pressable>
                <Pressable accessibilityRole="button" accessibilityLabel={`Descendre ${h.place.name}`} disabled={i === o.holes.length - 1} onPress={() => { tap(); dispatch({ type: 'moveHole', from: i, to: i + 1 }); }} style={[styles.iconBtn, i === o.holes.length - 1 && styles.off]}><T v="bodyBold">↓</T></Pressable>
                <Pressable accessibilityRole="button" accessibilityLabel={`Remplacer ${h.place.name}, fermé ou complet`} accessibilityState={{ selected: replacing === i }} onPress={() => { tap(); setReplacing(replacing === i ? null : i); }} style={[styles.iconBtn, replacing === i && styles.iconOn]}><T v="bodyBold" color={replacing === i ? colors.ivory : colors.ink}>⇄</T></Pressable>
              </View>
            )}
          </Card>
        ))}
      </View>

      <Card style={styles.search}>
        <T v="caption" color={colors.inkMuted}>{replacing !== null ? `Remplacer le trou ${replacing + 1} par` : o.holes.length >= 9 ? 'Parcours complet (9 trous max)' : 'Ajouter un lieu'}</T>
        {o.holes.length < 9 || replacing !== null ? (
          <TextInput value={query} onChangeText={setQuery} placeholder="Rechercher un bar, un café…" placeholderTextColor={colors.inkMuted} accessibilityLabel="Rechercher un lieu" style={styles.input} />
        ) : null}
        {results.length === 0 && query.trim() ? <StatusBox kind="empty" title="Aucun lieu trouvé" text="Essaie un autre nom ou un quartier. Les lieux proches réels arriveront avec une source de données." /> : null}
        {results.map((p) => (
          <Pressable key={p.id} accessibilityRole="button" accessibilityLabel={`Choisir ${p.name}, ${KIND_LABEL[p.kind]}, ${p.area}, ouverture à vérifier`} onPress={() => pick(p)} style={styles.result}>
            <Flag size={24} />
            <View style={styles.flex}>
              <T v="bodyBold">{p.name}</T>
              <T v="small" color={colors.inkMuted}>{KIND_LABEL[p.kind]} · {p.area} · à vérifier</T>
            </View>
            <T v="smallBold" color={colors.fairway}>{replacing !== null ? 'Remplacer' : 'Ajouter'}</T>
          </Pressable>
        ))}
        {replacing !== null ? <Button label="Annuler" kind="ghost" size="sm" onPress={() => setReplacing(null)} /> : null}
        <T v="small" color={colors.inkMuted}>Aucun horaire inventé : si la source ne confirme pas l’ouverture, le lieu reste « à vérifier ».</T>
      </Card>
      {isHost && live ? <Button label="Options de l’hôte" kind="ghost" style={styles.hostBtn} onPress={() => router.push('/host')} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  map: { height: 220, borderRadius: radius.lg, backgroundColor: colors.fairway, overflow: 'hidden', marginBottom: space.md },
  pin: { position: 'absolute', marginLeft: -14, marginTop: -34, alignItems: 'center' },
  pinLabel: { marginTop: -4, minWidth: 20, paddingHorizontal: 5, height: 20, borderRadius: 10, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  pinCurrent: { backgroundColor: colors.gold },
  note: { marginBottom: space.md },
  list: { gap: space.sm },
  hole: { flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.md, flexWrap: 'wrap' },
  holeNarrow: { gap: space.sm },
  actionsNarrow: { width: '100%', justifyContent: 'flex-end' },
  holeDone: { opacity: 0.6 },
  num: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.fairway, alignItems: 'center', justifyContent: 'center' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  status: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: radius.pill, backgroundColor: colors.gold },
  statusOk: { backgroundColor: colors.success },
  actions: { flexDirection: 'row', gap: 2 },
  iconBtn: { width: 40, height: touch.min - 4, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line },
  iconOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  off: { opacity: 0.25 },
  search: { gap: space.sm, marginTop: space.md },
  input: { minHeight: touch.min + 4, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.ink, paddingHorizontal: 14, fontSize: 17, fontFamily: 'Inter_500Medium', color: colors.ink, backgroundColor: colors.white },
  result: { flexDirection: 'row', alignItems: 'center', gap: space.sm, minHeight: touch.min + 8, paddingVertical: 6 },
  hostBtn: { marginTop: space.md },
});
