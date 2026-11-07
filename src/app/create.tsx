import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Share, StyleSheet, TextInput, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { success, tap } from '@/components/haptics';
import { Header } from '@/components/Header';
import { Mannequin } from '@/components/Mannequin';
import { Screen } from '@/components/Screen';
import { Stepper } from '@/components/Stepper';
import { T } from '@/components/T';
import { useOuting } from '@/store/outing';
import type { Outfit } from '@/store/types';
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

  if (!o) {
    router.replace('/');
    return null;
  }

  const link = `https://bargolf.club/j/${o.joinCode}`;
  const share = async () => {
    try {
      await Share.share({ message: `Rejoins ma sortie Bar Golf Club : ${link}`, url: link });
    } catch {
      await Clipboard.setStringAsync(link);
      setCopied(true);
    }
  };

  const footer = (
    <Button label="Voir le parcours" size="cta" kind="green" hint={`${o.holes.length} trous, ${o.players.length} joueurs`} onPress={() => router.push('/course')} />
  );

  return (
    <Screen footer={footer}>
      <Header title="Nouvelle sortie" kicker="Étape 1 sur 2" />

      <Card style={styles.block}>
        <T v="caption" color={colors.inkMuted}>Nombre de trous</T>
        <Stepper value={o.holes.length} min={3} max={9} label="nombre de trous" onChange={(v) => dispatch({ type: 'setHoleCount', count: v })} />
        <T v="small" color={colors.inkMuted} center>Bars, cafés ou restaurants. Une pause est un trou comme un autre.</T>
      </Card>

      <Card style={styles.block}>
        <T v="caption" color={colors.inkMuted}>Format</T>
        <View style={styles.row}>
          <Chip label="Équipes" tone="green" active={o.mode === 'teams'} onPress={() => dispatch({ type: 'setMode', mode: 'teams' })} />
          <Chip label="Individuel" tone="green" active={o.mode === 'solo'} onPress={() => dispatch({ type: 'setMode', mode: 'solo' })} />
        </View>
      </Card>

      <Card tone="green" style={styles.block}>
        <T v="caption" color={colors.honeyLight}>Inviter par lien ou QR</T>
        <View style={styles.inviteRow}>
          <View style={styles.qr} accessible accessibilityLabel={`QR code d’invitation, code ${o.joinCode}`}>
            <QRCode value={link} size={96} backgroundColor={colors.paper} color={colors.scoreGreenDeep} />
          </View>
          <View style={styles.flex}>
            <T v="h1" color={colors.cream}>{o.joinCode}</T>
            <T v="small" color={colors.creamDark}>On rejoint avec un prénom, sans compte. Aucune importation de contacts, aucune relance.</T>
          </View>
        </View>
        <View style={styles.row}>
          <Button label={copied ? 'Lien copié' : 'Partager le lien'} kind="secondary" size="sm" style={styles.flex} onPress={share} />
          <Button label="Copier" kind="ghost" size="sm" onPress={async () => { await Clipboard.setStringAsync(link); success(); setCopied(true); }} />
        </View>
        <T v="caption" color={colors.creamDark} center>Instagram · Snapchat · WhatsApp · iMessage</T>
      </Card>

      <Card style={styles.block}>
        <T v="caption" color={colors.inkMuted}>Joueurs ({o.players.length})</T>
        <View style={styles.players}>
          {o.players.map((p) => {
            const team = o.teams.find((t) => t.id === p.teamId);
            return (
              <Pressable
                key={p.id}
                accessibilityRole="button"
                accessibilityLabel={`${p.name}${p.isHost ? ', hôte' : ''}${team ? `, ${team.name}` : ''}. Changer la tenue`}
                onPress={() => {
                  tap();
                  const idx = OUTFITS.findIndex((x) => x.id === p.outfit);
                  dispatch({ type: 'setOutfit', id: p.id, outfit: OUTFITS[(idx + 1) % OUTFITS.length].id });
                }}
                onLongPress={() => (p.isHost ? undefined : dispatch({ type: 'removePlayer', id: p.id }))}
                style={styles.player}
              >
                <Mannequin outfit={p.outfit} size={52} accent={team?.color ?? colors.flagRed} label={`Avatar de ${p.name}`} />
                <T v="smallBold" numberOfLines={1}>{p.name}</T>
                {team ? <View style={[styles.dot, { backgroundColor: team.color }]} /> : null}
                {p.isHost ? <T v="caption" color={colors.inkMuted}>Hôte</T> : null}
              </Pressable>
            );
          })}
        </View>
        <T v="small" color={colors.inkMuted}>Appuyer sur un avatar change sa tenue. Appui long pour retirer.</T>
      </Card>

      <Card style={styles.block}>
        <T v="caption" color={colors.inkMuted}>Ajouter quelqu’un ici</T>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Prénom"
          placeholderTextColor={colors.inkMuted}
          accessibilityLabel="Prénom du joueur"
          style={styles.input}
          returnKeyType="done"
          onSubmitEditing={() => { if (name.trim()) { dispatch({ type: 'addPlayer', name, outfit }); setName(''); success(); } }}
        />
        <View style={styles.outfits}>
          {OUTFITS.map((of) => (
            <Pressable
              key={of.id}
              accessibilityRole="radio"
              accessibilityState={{ checked: outfit === of.id }}
              accessibilityLabel={`Tenue ${of.label}`}
              onPress={() => { tap(); setOutfit(of.id); }}
              style={[styles.outfit, outfit === of.id && styles.outfitOn]}
            >
              <Mannequin outfit={of.id} size={40} accent={colors.neonPink} />
              <T v="caption" color={outfit === of.id ? colors.cream : colors.inkSoft}>{of.label}</T>
            </Pressable>
          ))}
        </View>
        <Button label="Ajouter" kind="primary" size="sm" disabled={!name.trim()} onPress={() => { dispatch({ type: 'addPlayer', name, outfit }); setName(''); success(); }} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  block: { gap: space.md, marginBottom: space.md },
  row: { flexDirection: 'row', gap: space.sm, flexWrap: 'wrap' },
  inviteRow: { flexDirection: 'row', gap: space.lg, alignItems: 'center' },
  qr: { padding: 8, backgroundColor: colors.paper, borderRadius: radius.md },
  players: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  player: { width: 84, minHeight: touch.min, alignItems: 'center', gap: 2, padding: 6, borderRadius: radius.md, backgroundColor: colors.cream },
  dot: { width: 10, height: 10, borderRadius: 5 },
  input: { minHeight: touch.min + 4, borderRadius: radius.md, borderWidth: 2, borderColor: colors.creamDark, paddingHorizontal: 14, fontSize: 18, fontFamily: 'Nunito_700Bold', color: colors.ink, backgroundColor: colors.cream },
  outfits: { flexDirection: 'row', gap: space.sm },
  outfit: { flex: 1, minHeight: touch.min, alignItems: 'center', gap: 2, paddingVertical: 6, borderRadius: radius.md, backgroundColor: colors.cream, borderWidth: 2, borderColor: colors.line },
  outfitOn: { backgroundColor: colors.ink, borderColor: colors.ink },
});
