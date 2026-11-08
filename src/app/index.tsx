import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Flag } from '@/components/Flag';
import { tap } from '@/components/haptics';
import { Mannequin } from '@/components/Mannequin';
import { Neon } from '@/components/Neon';
import { Screen } from '@/components/Screen';
import { StatusBox } from '@/components/StatusBox';
import { T } from '@/components/T';
import { MODES } from '@/data/challenges';
import { ONBOARDING } from '@/data/rules';
import { useOuting } from '@/store/outing';
import { colors, radius, space, touch } from '@/theme/tokens';

export default function Home() {
  const { state, dispatch } = useOuting();
  const insets = useSafeAreaInsets();
  const outing = state.outing;
  const canResume = !!outing && outing.status !== 'finished';
  const finishedPending = !!outing && outing.status === 'finished';

  if (!state.ageConfirmed) return <AgeGate onConfirm={() => dispatch({ type: 'confirmAge' })} />;
  if (!state.onboardingSeen) return <Onboarding onDone={() => dispatch({ type: 'onboardingSeen' })} />;

  const resume = () => {
    if (!outing) return;
    if (outing.status === 'draft') router.push('/course');
    else if (outing.status === 'finished') router.push('/scoreboard');
    else {
      if (outing.status === 'paused') dispatch({ type: 'resume' });
      router.push('/hole');
    }
  };

  return (
    <Screen dark padded={false}>
      <View style={[styles.hero, { paddingTop: insets.top + space.xl }]}>
        <View style={styles.topRow}>
          <T v="caption" color={colors.ivoryDark}>Clubhouse · 18+</T>
          <Pressable accessibilityRole="button" accessibilityLabel="Règles du jeu" onPress={() => { tap(); router.push('/rules'); }} style={styles.rulesLink}>
            <T v="smallBold" color={colors.gold}>Règles</T>
          </Pressable>
        </View>
        <Neon size="display" center>Bar Golf Club</Neon>
        <T v="small" color={colors.ivoryDark} center style={styles.tagline}>Un parcours de bars. Un défi par trou. Les points viennent des défis, jamais des verres.</T>
        <View style={styles.crew} accessible accessibilityLabel="Trois golfeurs en bois">
          <Mannequin outfit="argyle" size={56} accent={colors.teamRed} />
          <Mannequin outfit="putter" size={66} accent={colors.gold} />
          <Mannequin outfit="flag" size={56} accent={colors.teamRed} />
        </View>
      </View>

      <View style={styles.body}>
        {canResume ? (
          <Pressable accessibilityRole="button" accessibilityLabel={`Reprendre ${outing.title}`} onPress={() => { tap(); resume(); }}>
            <Card tone="dark" style={styles.resume}>
              <View style={styles.flex}>
                <T v="caption" color={colors.gold}>{outing.status === 'paused' ? 'En pause' : outing.status === 'draft' ? 'Brouillon' : 'En cours'}</T>
                <T v="h3" color={colors.ivory} numberOfLines={1}>{outing.title}</T>
                <T v="small" color={colors.ivoryDark}>Trou {Math.min(outing.currentHole + 1, outing.holes.length)} sur {outing.holes.length} · {outing.players.length} joueurs</T>
              </View>
              <T v="bodyBold" color={colors.ivory}>Reprendre</T>
            </Card>
          </Pressable>
        ) : null}
        {finishedPending ? (
          <Pressable accessibilityRole="button" accessibilityLabel="Voir le résumé de la dernière sortie" onPress={() => { tap(); router.push('/scoreboard'); }}>
            <Card tone="dark" style={styles.resume}>
              <View style={styles.flex}>
                <T v="caption" color={colors.gold}>Terminée</T>
                <T v="h3" color={colors.ivory} numberOfLines={1}>{outing.title}</T>
              </View>
              <T v="bodyBold" color={colors.ivory}>Résumé</T>
            </Card>
          </Pressable>
        ) : null}

        <Button
          label="Nouvelle sortie"
          size="cta"
          onDark
          icon={<Flag size={22} />}
          hint="Créer un parcours de 3 à 9 bars"
          onPress={() => { dispatch({ type: 'newDraft', hostName: 'Toi' }); router.push('/create'); }}
        />
        <Button label="Rejoindre avec un code" kind="secondary" onDark onPress={() => router.push('/join')} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Lancer une sortie de démonstration"
          onPress={() => { tap(); dispatch({ type: 'demo' }); router.push('/course'); }}
          style={styles.demo}
        >
          <T v="small" color={colors.ivoryDark} center>Essayer avec une démo</T>
        </Pressable>

        <View style={styles.sectionHead}>
          <T v="h2" color={colors.ivory}>Souvenirs</T>
          <Pressable accessibilityRole="button" accessibilityLabel="Ouvrir la boutique" onPress={() => { tap(); router.push('/shop'); }} style={styles.link}>
            <T v="smallBold" color={colors.gold}>Boutique</T>
          </Pressable>
        </View>
        {state.memories.length === 0 ? (
          <StatusBox kind="empty" onDark title="Aucune sortie terminée" text="Les feuilles de score de vos soirées se rangent ici. Sans photo ni lieu exact par défaut." />
        ) : (
          state.memories.map((m) => (
            <Card key={m.id} tone="outline" style={styles.memory}>
              <View style={styles.flex}>
                <T v="h3" color={colors.ivory} numberOfLines={2}>{m.title}</T>
                <T v="small" color={colors.ivoryDark}>{new Date(m.date).toLocaleDateString('fr-FR')} · {m.holes} trous · {MODES.find((x) => x.id === m.gameMode)?.name ?? 'Classique'}</T>
              </View>
              <View style={styles.winner}>
                <T v="caption" color={colors.ivoryDark}>Vainqueur</T>
                <T v="smallBold" color={colors.gold} numberOfLines={1}>{m.winner}</T>
                <T v="numberSmall" color={colors.ivory}>{m.winnerPoints}</T>
              </View>
            </Card>
          ))
        )}
        <T v="small" color={colors.ivoryDark} center style={styles.foot}>Chacun boit ce qu’il veut, avec ou sans alcool. Ça ne change jamais le score.</T>
      </View>
    </Screen>
  );
}

function AgeGate({ onConfirm }: { onConfirm: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.gate, { paddingTop: insets.top + space.xxl, paddingBottom: insets.bottom + space.lg }]}>
      <View style={styles.gateBody}>
        <View style={styles.badge} accessible accessibilityLabel="Réservé aux 18 ans et plus">
          <T v="display" color={colors.gold}>18+</T>
        </View>
        <T v="h1" color={colors.ivory} center accessibilityRole="header">Soirée entre adultes</T>
        <T v="body" color={colors.ivoryDark} center>Bar Golf Club est réservé aux personnes majeures. L’appli ne mesure, ne chronomètre et ne récompense jamais ce que vous buvez. Les points viennent uniquement des défis.</T>
        <T v="small" color={colors.ivoryDark} center>Aucune publicité, aucune marque d’alcool, aucun contenu qui valorise l’ivresse.</T>
      </View>
      <View style={styles.gateActions}>
        <Button label="J’ai 18 ans ou plus" size="cta" onDark onPress={onConfirm} />
        <T v="small" color={colors.ivoryDark} center>Si vous n’avez pas 18 ans, fermez l’application.</T>
      </View>
    </View>
  );
}

// Notice en 3 écrans au premier lancement.
function Onboarding({ onDone }: { onDone: () => void }) {
  const insets = useSafeAreaInsets();
  const [i, setI] = useState(0);
  const step = ONBOARDING[i];
  const last = i === ONBOARDING.length - 1;
  return (
    <View style={[styles.gate, { paddingTop: insets.top + space.xxl, paddingBottom: insets.bottom + space.lg }]}>
      <View style={styles.gateBody}>
        <View style={styles.dots} accessibilityLabel={`Étape ${i + 1} sur ${ONBOARDING.length}`}>
          {ONBOARDING.map((_, k) => <View key={k} style={[styles.dotStep, k === i && styles.dotOn]} />)}
        </View>
        <View style={styles.onbIcon}>
          {i === 0 ? <Flag size={64} onDark /> : i === 1 ? <T v="display" color={colors.gold}>+2</T> : <Mannequin outfit="cap" size={64} accent={colors.gold} />}
        </View>
        <T v="h1" color={colors.ivory} center accessibilityRole="header">{step.title}</T>
        <T v="body" color={colors.ivoryDark} center>{step.text}</T>
      </View>
      <View style={styles.gateActions}>
        <Button label={last ? 'Entrer au clubhouse' : 'Suivant'} size="cta" onDark onPress={() => (last ? onDone() : setI(i + 1))} />
        {!last ? <Button label="Passer" kind="ghost" onDark onPress={onDone} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  hero: { paddingHorizontal: space.lg, paddingBottom: space.lg, alignItems: 'center', gap: space.md },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'stretch' },
  rulesLink: { minHeight: touch.min, justifyContent: 'center', paddingHorizontal: 8 },
  tagline: { maxWidth: 300 },
  crew: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', gap: 10, marginTop: space.sm },
  body: { padding: space.lg, gap: space.md },
  resume: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  demo: { minHeight: touch.min, justifyContent: 'center' },
  sectionHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: space.md },
  link: { minHeight: touch.min, justifyContent: 'center', paddingHorizontal: 8 },
  memory: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  winner: { alignItems: 'flex-end', maxWidth: 130 },
  foot: { marginTop: space.lg, paddingHorizontal: space.md },
  gate: { flex: 1, backgroundColor: colors.fairway, padding: space.xl, justifyContent: 'space-between' },
  gateBody: { alignItems: 'center', gap: space.lg, marginTop: space.xl },
  badge: { width: 140, height: 140, borderRadius: 70, borderWidth: 2, borderColor: colors.gold, alignItems: 'center', justifyContent: 'center' },
  gateActions: { gap: space.sm },
  dots: { flexDirection: 'row', gap: 8 },
  dotStep: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.fairwayLine },
  dotOn: { backgroundColor: colors.gold, width: 24 },
  onbIcon: { height: 96, alignItems: 'center', justifyContent: 'center' },
});
