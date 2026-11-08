import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { success, tap } from '@/components/haptics';
import { Header } from '@/components/Header';
import { Mannequin } from '@/components/Mannequin';
import { Screen } from '@/components/Screen';
import { StatusBox } from '@/components/StatusBox';
import { T } from '@/components/T';
import { JOIN_PRINCIPLES } from '@/data/rules';
import { joinByCode, useOuting } from '@/store/outing';
import type { Outfit } from '@/store/types';
import { roomSyncAvailable } from '@/sync/localRoom';
import { colors, radius, space, touch } from '@/theme/tokens';

const OUTFITS: { id: Outfit; label: string }[] = [
  { id: 'cap', label: 'Casquette' },
  { id: 'argyle', label: 'Losanges' },
  { id: 'putter', label: 'Putter' },
  { id: 'flag', label: 'Drapeau' },
];

// Rejoindre : code → le principe en 3 points → prénom (18 ans confirmés) → la même feuille de score.
export default function Join() {
  const { code: codeParam } = useLocalSearchParams<{ code?: string }>();
  const { state, dispatch } = useOuting();
  const [code, setCode] = useState((codeParam ?? '').toUpperCase());
  const [step, setStep] = useState<'code' | 'principles' | 'name'>(codeParam ? 'principles' : 'code');
  const [name, setName] = useState('');
  const [outfit, setOutfit] = useState<Outfit>('argyle');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!state.ageConfirmed) router.replace('/');
  }, [state.ageConfirmed]);

  const submit = () => {
    setBusy(true);
    setError(null);
    const res = joinByCode(code, name, outfit);
    setBusy(false);
    if (!res.ok) {
      setError(res.reason);
      return;
    }
    dispatch({ type: 'joinRoom', outing: res.outing, meId: res.meId });
    success();
    router.replace(res.outing.status === 'draft' ? '/course' : '/hole');
  };

  return (
    <Screen footer={
      step === 'code' ? <Button label="Continuer" size="cta" disabled={code.trim().length < 4} onPress={() => { setError(null); setStep('principles'); }} />
      : step === 'principles' ? <Button label="C’est clair" size="cta" onPress={() => setStep('name')} />
      : <Button label={busy ? 'Connexion…' : 'Rejoindre la sortie'} size="cta" disabled={busy || !name.trim()} onPress={submit} />
    }>
      <Header title="Rejoindre" kicker={step === 'code' ? 'Étape 1 sur 3' : step === 'principles' ? 'Étape 2 sur 3' : 'Étape 3 sur 3'} />

      {step === 'code' ? (
        <View style={styles.block}>
          <T v="h1" accessibilityRole="header">Le code de l’hôte</T>
          <T v="body" color={colors.inkSoft}>Quatre caractères, affichés sous le QR sur l’écran de l’hôte.</T>
          <TextInput
            value={code}
            onChangeText={(v) => setCode(v.toUpperCase().slice(0, 4))}
            placeholder="ABCD"
            placeholderTextColor={colors.inkMuted}
            autoCapitalize="characters"
            autoCorrect={false}
            accessibilityLabel="Code de la sortie"
            style={styles.codeInput}
            maxLength={4}
          />
          {!roomSyncAvailable ? (
            <StatusBox kind="empty" title="Sur cet appareil, rejoindre passe par le lien de l’hôte" text="La synchronisation entre téléphones arrive avec le serveur du club. Pour l’instant, le code fonctionne entre deux fenêtres du même navigateur." />
          ) : null}
          {error ? <StatusBox kind="error" title="Impossible de rejoindre" text={error} action={{ label: 'Réessayer', onPress: () => setError(null) }} /> : null}
        </View>
      ) : null}

      {step === 'principles' ? (
        <View style={styles.block}>
          <T v="h1" accessibilityRole="header">Le principe en 3 points</T>
          {JOIN_PRINCIPLES.map((p, i) => (
            <Card key={i} style={styles.principle}>
              <T v="number" color={colors.fairway} style={styles.pnum}>{i + 1}</T>
              <T v="body" style={styles.flex}>{p}</T>
            </Card>
          ))}
          <T v="small" color={colors.inkMuted}>Réservé aux 18 ans et plus. En continuant, tu confirmes être majeur.</T>
        </View>
      ) : null}

      {step === 'name' ? (
        <View style={styles.block}>
          <T v="h1" accessibilityRole="header">Ton prénom</T>
          <T v="body" color={colors.inkSoft}>Sans compte. Il n’apparaît sur la carte de fin que si tu l’acceptes.</T>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Prénom"
            placeholderTextColor={colors.inkMuted}
            accessibilityLabel="Ton prénom"
            style={styles.input}
            returnKeyType="done"
            onSubmitEditing={submit}
          />
          <T v="caption" color={colors.inkMuted}>Ta tenue</T>
          <View style={styles.outfits}>
            {OUTFITS.map((of) => (
              <Pressable key={of.id} accessibilityRole="radio" accessibilityState={{ checked: outfit === of.id }} accessibilityLabel={`Tenue ${of.label}`} onPress={() => { tap(); setOutfit(of.id); }} style={[styles.outfit, outfit === of.id && styles.outfitOn]}>
                <Mannequin outfit={of.id} size={38} accent={colors.gold} />
                <T v="caption" color={outfit === of.id ? colors.ivory : colors.inkSoft}>{of.label}</T>
              </Pressable>
            ))}
          </View>
          {error ? <StatusBox kind="error" title="Impossible de rejoindre" text={error} action={{ label: 'Changer le code', onPress: () => { setError(null); setStep('code'); } }} /> : null}
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  block: { gap: space.md },
  codeInput: { minHeight: 72, borderRadius: radius.lg, borderWidth: 1.5, borderColor: colors.ink, paddingHorizontal: 14, fontSize: 36, letterSpacing: 10, textAlign: 'center', fontFamily: 'Inter_700Bold', color: colors.ink, backgroundColor: colors.white },
  input: { minHeight: touch.min + 4, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.ink, paddingHorizontal: 14, fontSize: 18, fontFamily: 'Inter_600SemiBold', color: colors.ink, backgroundColor: colors.white },
  principle: { flexDirection: 'row', gap: space.md, alignItems: 'center' },
  pnum: { width: 36 },
  outfits: { flexDirection: 'row', gap: space.sm },
  outfit: { flex: 1, minHeight: touch.min, alignItems: 'center', gap: 2, paddingVertical: 6, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.line, backgroundColor: colors.white },
  outfitOn: { backgroundColor: colors.ink, borderColor: colors.ink },
});
