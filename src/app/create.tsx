import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, Share, StyleSheet, TextInput, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { success, tap } from '@/components/haptics';
import { Header } from '@/components/Header';
import { Mannequin } from '@/components/Mannequin';
import { Screen } from '@/components/Screen';
import { StatusBox } from '@/components/StatusBox';
import { Stepper } from '@/components/Stepper';
import { T } from '@/components/T';
import { Toggle } from '@/components/Toggle';
import { MODES } from '@/data/challenges';
import { teamColorOf, useOuting } from '@/store/outing';
import type { Outfit } from '@/store/types';
import { roomSyncAvailable } from '@/sync/localRoom';
import { colors, radius, space, touch } from '@/theme/tokens';

const OUTFITS: { id: Outfit; label: string }[] = [
  { id: 'cap', label: 'Casquette' },
  { id: 'argyle', label: 'Losanges' },
  { id: 'putter', label: 'Putter' },
  { id: 'flag', label: 'Drapeau' },
];

export default function Create() {
  const { state, dispatch } = useOuting();
  const o = state.outing;
  const [name, setName] = useState('');
  const [outfit, setOutfit] = useState<Outfit>('argyle');
  const [copied, setCopied] = useState(false);
  const [showModes, setShowModes] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  useEffect(() => {
    if (!o) router.replace('/');
  }, [o]);
  if (!o) return null;

  const link = `https://bar-golf-club.vercel.app/join?code=${o.joinCode}`;
  const copy = async () => {
    try {
      await Clipboard.setStringAsync(link);
      success();
      setCopied(true);
    } catch {
      setShareError('Copie impossible sur cet appareil. Dicte le code à voix haute, il suffit.');
    }
  };
  const share = async () => {
    setShareError(null);
    try {
      await Share.share({ message: `Rejoins ma sortie Bar Golf Club avec le code ${o.joinCode} : ${link}`, url: link });
    } catch {
      await copy();
    }
  };
  const addPlayer = () => {
    if (!name.trim()) return;
    dispatch({ type: 'addPlayer', name, outfit });
    setName('');
    success();
  };
  const me = o.players.find((p) => p.id === state.meId);

  return (
    <Screen footer={<Button label="Voir le parcours" size="cta" hint={`${o.holes.length} trous, ${o.players.length} joueurs`} onPress={() => router.push('/course')} />}>
      <Header title="Nouvelle sortie" kicker="Étape 1 sur 2" />

      <Card style={styles.block}>
        <T v="caption" color={colors.inkMuted}>Nombre de trous</T>
        <Stepper value={o.holes.length} min={3} max={9} label="nombre de trous" onChange={(v) => dispatch({ type: 'setHoleCount', count: v })} />
        <T v="small" color={colors.inkMuted} center>Bars, cafés ou restaurants. Une pause est un trou comme un autre.</T>
      </Card>

      <Card style={styles.block}>
        <T v="caption" color={colors.inkMuted}>Format</T>
        <View style={styles.row}>
          <Chip label="Équipes" active={o.mode === 'teams'} onPress={() => dispatch({ type: 'setMode', mode: 'teams' })} />
          <Chip label="Individuel" active={o.mode === 'solo'} onPress={() => dispatch({ type: 'setMode', mode: 'solo' })} />
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel={showModes ? 'Masquer les modes de jeu' : 'Choisir un mode de jeu'} accessibilityState={{ expanded: showModes }} onPress={() => { tap(); setShowModes(!showModes); }} style={styles.modeToggle}>
          <T v="smallBold" color={colors.fairway}>Mode : {MODES.find((m) => m.id === o.gameMode)?.name}</T>
          <T v="smallBold" color={colors.inkMuted}>{showModes ? 'Masquer' : 'Changer'}</T>
        </Pressable>
        {showModes ? (
          <View style={styles.modes}>
            {MODES.map((m) => (
              <Pressable key={m.id} accessibilityRole="radio" accessibilityState={{ checked: o.gameMode === m.id }} accessibilityLabel={`${m.name}, ${m.detail}`} onPress={() => { tap(); dispatch({ type: 'setGameMode', gameMode: m.id }); }} style={[styles.mode, o.gameMode === m.id && styles.modeOn]}>
                <View style={styles.flex}>
                  <T v="bodyBold" color={o.gameMode === m.id ? colors.ivory : colors.ink}>{m.name} <T v="small" color={o.gameMode === m.id ? colors.gold : colors.inkMuted}>· {m.tagline}</T></T>
                  <T v="small" color={o.gameMode === m.id ? colors.ivoryDark : colors.inkMuted}>{m.detail}</T>
                </View>
              </Pressable>
            ))}
            <T v="small" color={colors.inkMuted}>Le mode change les défis et l’habillage, jamais les règles de sécurité ni le format.</T>
          </View>
        ) : null}
      </Card>

      <Card tone="green" style={styles.block}>
        <T v="caption" color={colors.gold}>Inviter par lien ou QR</T>
        <View style={styles.inviteRow}>
          <View style={styles.qr} accessible accessibilityLabel={`QR code d’invitation, code ${o.joinCode}`}>
            <QRCode value={link} size={92} backgroundColor={colors.ivory} color={colors.fairway} />
          </View>
          <View style={styles.flex}>
            <T v="number" color={colors.ivory} style={styles.code}>{o.joinCode}</T>
            <T v="small" color={colors.ivoryDark}>On rejoint avec un prénom, sans compte. Aucune importation de contacts, aucune relance.</T>
          </View>
        </View>
        <View style={styles.row}>
          <Button label="Partager le lien" kind="primary" onDark size="sm" style={styles.flex} onPress={share} />
          <Button label={copied ? 'Copié' : 'Copier'} kind="secondary" onDark size="sm" onPress={copy} />
        </View>
        {shareError ? <T v="small" color={colors.gold}>{shareError}</T> : null}
        <T v="small" color={colors.ivoryDark}>{roomSyncAvailable ? 'Sur cet appareil : le code fonctionne entre deux fenêtres du même navigateur. Entre téléphones, le serveur du club arrive.' : 'Entre téléphones, le serveur du club arrive. Pour l’instant, la feuille vit sur cet appareil.'}</T>
      </Card>

      <Card style={styles.block}>
        <T v="caption" color={colors.inkMuted}>Joueurs ({o.players.length})</T>
        {o.players.length === 0 ? <StatusBox kind="empty" title="Personne pour l’instant" /> : null}
        <View style={styles.players}>
          {o.players.map((p) => {
            const team = o.teams.find((t) => t.id === p.teamId);
            return (
              <Pressable
                key={p.id}
                accessibilityRole="button"
                accessibilityLabel={`${p.name}${p.isHost ? ', hôte' : ''}${team ? `, ${team.name}` : ''}. Changer la tenue`}
                onPress={() => { tap(); const idx = OUTFITS.findIndex((x) => x.id === p.outfit); dispatch({ type: 'setOutfit', id: p.id, outfit: OUTFITS[(idx + 1) % OUTFITS.length].id }); }}
                style={styles.player}
              >
                <Mannequin outfit={p.outfit} size={46} accent={teamColorOf(o, p)} label={`Avatar de ${p.name}`} />
                <T v="smallBold" numberOfLines={1}>{p.name}</T>
                {team ? <T v="caption" color={colors.inkMuted} numberOfLines={1}>{team.name.replace('Les ', '')}</T> : null}
                {p.isHost ? <T v="caption" color={colors.gold}>Hôte</T> : null}
              </Pressable>
            );
          })}
        </View>
        <T v="small" color={colors.inkMuted}>Appuyer sur un avatar change sa tenue. Retirer un joueur se fait dans les options de l’hôte.</T>
      </Card>

      <Card style={styles.block}>
        <T v="caption" color={colors.inkMuted}>Ajouter quelqu’un ici</T>
        <TextInput value={name} onChangeText={setName} placeholder="Prénom" placeholderTextColor={colors.inkMuted} accessibilityLabel="Prénom du joueur" style={styles.input} returnKeyType="done" onSubmitEditing={addPlayer} />
        <View style={styles.outfits}>
          {OUTFITS.map((of) => (
            <Pressable key={of.id} accessibilityRole="radio" accessibilityState={{ checked: outfit === of.id }} accessibilityLabel={`Tenue ${of.label}`} onPress={() => { tap(); setOutfit(of.id); }} style={[styles.outfit, outfit === of.id && styles.outfitOn]}>
              <Mannequin outfit={of.id} size={36} accent={colors.gold} />
              <T v="caption" color={outfit === of.id ? colors.ivory : colors.inkSoft}>{of.label}</T>
            </Pressable>
          ))}
        </View>
        <Button label="Ajouter" size="sm" disabled={!name.trim()} onPress={addPlayer} />
      </Card>

      {me ? (
        <Card style={styles.block}>
          <Toggle label="Bobine photo commune" hint="Opt-in par participant. Tes photos de défis ne rejoignent l’album du groupe que si tu l’actives." value={me.reelOptIn} onChange={(v) => dispatch({ type: 'setReelOptIn', id: me.id, value: v })} />
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  block: { gap: space.md, marginBottom: space.md },
  row: { flexDirection: 'row', gap: space.sm, flexWrap: 'wrap' },
  modeToggle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: touch.min, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: space.sm },
  modes: { gap: space.sm },
  mode: { flexDirection: 'row', alignItems: 'center', padding: space.md, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.line, minHeight: touch.min },
  modeOn: { backgroundColor: colors.fairway, borderColor: colors.fairway },
  inviteRow: { flexDirection: 'row', gap: space.lg, alignItems: 'center' },
  qr: { padding: 8, backgroundColor: colors.ivory, borderRadius: radius.md },
  code: { letterSpacing: 4 },
  players: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  player: { width: 80, minHeight: touch.min, alignItems: 'center', gap: 2, padding: 6, borderRadius: radius.md, borderWidth: 1, borderColor: colors.line },
  input: { minHeight: touch.min + 4, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.ink, paddingHorizontal: 14, fontSize: 18, fontFamily: 'Inter_600SemiBold', color: colors.ink, backgroundColor: colors.white },
  outfits: { flexDirection: 'row', gap: space.sm },
  outfit: { flex: 1, minHeight: touch.min, alignItems: 'center', gap: 2, paddingVertical: 6, borderRadius: radius.md, borderWidth: 1.5, borderColor: colors.line },
  outfitOn: { backgroundColor: colors.ink, borderColor: colors.ink },
});
