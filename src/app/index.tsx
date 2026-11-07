import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrickWall } from '@/components/BrickWall';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Flag } from '@/components/Flag';
import { tap } from '@/components/haptics';
import { Mannequin } from '@/components/Mannequin';
import { Screen } from '@/components/Screen';
import { T } from '@/components/T';
import { useOuting } from '@/store/outing';
import { colors, radius, space } from '@/theme/tokens';

export default function Home() {
  const { state, dispatch } = useOuting();
  const insets = useSafeAreaInsets();
  const outing = state.outing;
  const canResume = outing && outing.status !== 'finished';

  if (state.hydrated && !state.ageConfirmed) return <AgeGate onConfirm={() => dispatch({ type: 'confirmAge' })} />;

  const resume = () => {
    if (!outing) return;
    if (outing.status === 'draft') router.push('/course');
    else if (outing.status === 'paused') {
      dispatch({ type: 'resume' });
      router.push('/hole');
    } else router.push('/hole');
  };

  return (
    <Screen bg={colors.cream} padded={false}>
      <View style={[styles.hero, { paddingTop: insets.top + space.xl }]}>
        <BrickWall />
        <View style={styles.neonSign} accessibilityRole="header">
          <T v="caption" color={colors.neonPink} center style={styles.neonKicker}>Club privé · 18+</T>
          <T v="display" color={colors.cream} center>Bar Golf</T>
          <T v="h1" color={colors.honeyLight} center style={styles.club}>Club</T>
        </View>
        <View style={styles.crew} accessible accessibilityLabel="Trois golfeurs en bois devant une façade en briques">
          <Mannequin outfit="argyle" size={64} accent={colors.flagRed} />
          <Mannequin outfit="putter" size={76} accent={colors.neonPink} />
          <Mannequin outfit="flag" size={64} accent={colors.flagRed} />
        </View>
      </View>

      <View style={styles.body}>
        <Button
          label="Nouvelle sortie"
          size="cta"
          kind="primary"
          icon={<Flag size={24} />}
          hint="Créer un parcours de 3 à 9 bars"
          onPress={() => {
            dispatch({ type: 'newDraft', hostName: 'Toi' });
            router.push('/create');
          }}
        />
        <Button
          label="Démo en 3 appuis"
          kind="neon"
          hint="Lance une sortie de démonstration pré-remplie"
          onPress={() => {
            dispatch({ type: 'demo' });
            router.push('/course');
          }}
        />

        {canResume ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Reprendre ${outing.title}`}
            onPress={() => { tap(); resume(); }}
          >
            <Card tone="green" style={styles.resume}>
              <View style={styles.flex}>
                <T v="caption" color={colors.honeyLight}>{outing.status === 'paused' ? 'En pause' : outing.status === 'draft' ? 'Brouillon' : 'En cours'}</T>
                <T v="h3" color={colors.cream} numberOfLines={1}>{outing.title}</T>
                <T v="small" color={colors.creamDark}>Trou {Math.min(outing.currentHole + 1, outing.holes.length)} sur {outing.holes.length} · {outing.players.length} joueurs</T>
              </View>
              <T v="h2" color={colors.cream}>Reprendre</T>
            </Card>
          </Pressable>
        ) : null}

        <View style={styles.sectionHead}>
          <T v="h2">Souvenirs</T>
          <Pressable accessibilityRole="button" accessibilityLabel="Ouvrir la boutique" onPress={() => { tap(); router.push('/shop'); }} style={styles.link}>
            <T v="bodyBold" color={colors.pubRed}>Boutique</T>
          </Pressable>
        </View>
        {state.memories.length === 0 ? (
          <Card style={styles.empty}>
            <Flag size={44} muted />
            <T v="bodyBold" color={colors.inkSoft} center>Aucune sortie terminée pour l’instant.</T>
            <T v="small" color={colors.inkMuted} center>Les feuilles de score de vos soirées se rangent ici, sans photo ni lieu exact par défaut.</T>
          </Card>
        ) : (
          state.memories.map((m, i) => (
            <Card key={m.id} style={[styles.memory, i % 2 === 1 && styles.memoryAlt]}>
              <View style={styles.flex}>
                <T v="h3" numberOfLines={1}>{m.title}</T>
                <T v="small" color={colors.inkMuted}>{new Date(m.date).toLocaleDateString('fr-FR')} · {m.holes} trous</T>
              </View>
              <View style={styles.winner}>
                <T v="caption" color={colors.inkMuted}>Vainqueur</T>
                <T v="bodyBold" color={colors.scoreGreen}>{m.winner}</T>
              </View>
            </Card>
          ))
        )}
        <T v="small" color={colors.inkMuted} center style={styles.foot}>
          Les points viennent des défis, jamais des verres. Chacun boit ce qu’il veut, avec ou sans alcool.
        </T>
      </View>
    </Screen>
  );
}

function AgeGate({ onConfirm }: { onConfirm: () => void }) {
  const insets = useSafeAreaInsets();
  const glow = useRef(new Animated.Value(0.6)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(glow, { toValue: 1, duration: 1400, useNativeDriver: true }),
      Animated.timing(glow, { toValue: 0.6, duration: 1400, useNativeDriver: true }),
    ])).start();
  }, [glow]);
  return (
    <View style={[styles.gate, { paddingTop: insets.top + space.xxl, paddingBottom: insets.bottom + space.lg }]}>
      <BrickWall />
      <View style={styles.gateBody}>
        <Animated.View style={[styles.badge, { opacity: glow }]} accessible accessibilityLabel="Réservé aux 18 ans et plus">
          <T v="display" color={colors.neonPink}>18+</T>
        </Animated.View>
        <T v="h1" color={colors.cream} center>Soirée entre adultes</T>
        <T v="body" color={colors.creamDark} center>
          Bar Golf Club est réservé aux personnes majeures. L’appli ne mesure, ne chronomètre et ne récompense jamais ce que vous buvez. Les points viennent uniquement des défis.
        </T>
        <T v="small" color={colors.honeyLight} center>Aucune publicité, aucune marque d’alcool, aucun contenu qui valorise l’ivresse.</T>
      </View>
      <View style={styles.gateActions}>
        <Button label="J’ai 18 ans ou plus" size="cta" kind="neon" onPress={onConfirm} />
        <T v="small" color={colors.creamDark} center>Si vous n’avez pas 18 ans, fermez l’application.</T>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  hero: { backgroundColor: colors.pubRed, paddingBottom: 0, overflow: 'hidden', borderBottomLeftRadius: radius.xl, borderBottomRightRadius: radius.xl },
  neonSign: { alignSelf: 'center', paddingHorizontal: 28, paddingVertical: 14, borderRadius: radius.lg, borderWidth: 3, borderColor: colors.neonPink, backgroundColor: 'rgba(85,18,29,0.75)', shadowColor: colors.neonPink, shadowOpacity: 0.8, shadowRadius: 22, shadowOffset: { width: 0, height: 0 } },
  neonKicker: { marginBottom: 2 },
  club: { marginTop: -6 },
  crew: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', gap: 8, marginTop: space.lg, marginBottom: -6 },
  body: { padding: space.lg, gap: space.md },
  resume: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: space.md },
  link: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 8 },
  empty: { alignItems: 'center', gap: space.sm, backgroundColor: colors.paper },
  memory: { flexDirection: 'row', alignItems: 'center', gap: space.md, borderLeftWidth: 6, borderLeftColor: colors.scoreGreen },
  memoryAlt: { borderLeftColor: colors.flagRed },
  winner: { alignItems: 'flex-end' },
  foot: { marginTop: space.lg, paddingHorizontal: space.md },
  gate: { flex: 1, backgroundColor: colors.pubRedDeep, padding: space.xl, justifyContent: 'space-between' },
  gateBody: { alignItems: 'center', gap: space.lg, marginTop: space.xxl },
  badge: { width: 160, height: 160, borderRadius: 80, borderWidth: 4, borderColor: colors.neonPink, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(85,18,29,0.8)', shadowColor: colors.neonPink, shadowOpacity: 0.9, shadowRadius: 30, shadowOffset: { width: 0, height: 0 } },
  gateActions: { gap: space.md },
});
