import * as Clipboard from 'expo-clipboard';
import { router, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import { Linking, Share, StyleSheet, View } from 'react-native';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { success, tap } from '@/components/haptics';
import { Header } from '@/components/Header';
import { Screen } from '@/components/Screen';
import { StatusBox } from '@/components/StatusBox';
import { T } from '@/components/T';
import { Toggle } from '@/components/Toggle';
import { useOuting } from '@/store/outing';
import { colors, space } from '@/theme/tokens';

// « Je m'arrête » : toujours accessible, sans jugement, en une main.
export default function Stop() {
  const { focus } = useLocalSearchParams<{ focus?: string }>();
  const { state, dispatch } = useOuting();
  const o = state.outing;
  const me = o?.players.find((p) => p.id === state.meId);
  const [sent, setSent] = useState<'idle' | 'done' | 'copied' | 'error'>('idle');
  const [water, setWater] = useState(false);
  const [rideError, setRideError] = useState<string | null>(null);

  const openRide = async (app: 'uber' | 'bolt' | 'g7') => {
    tap();
    setRideError(null);
    const schemes = { uber: 'uber://', bolt: 'bolt://', g7: 'g7taxi://' };
    const webs = { uber: 'https://m.uber.com', bolt: 'https://bolt.eu', g7: 'https://www.g7.fr' };
    try {
      if (await Linking.canOpenURL(schemes[app])) return await Linking.openURL(schemes[app]);
      await WebBrowser.openBrowserAsync(webs[app]);
    } catch {
      try {
        await Linking.openURL(webs[app]);
      } catch {
        setRideError('Ouverture impossible. Cherche « taxi » ou « VTC » dans ton navigateur, ou demande au bar.');
      }
    }
  };

  const sharePosition = async () => {
    const text = 'Je suis en soirée Bar Golf Club. Voici où je suis : (ouvre ta position dans Plans ou Maps et colle le lien ici).';
    try {
      const res = await Share.share({ message: text });
      if (res.action === Share.dismissedAction) return;
      setSent('done');
      success();
    } catch {
      try {
        await Clipboard.setStringAsync(text);
        setSent('copied');
      } catch {
        setSent('error');
      }
    }
  };

  const leave = () => {
    if (me) dispatch({ type: 'leave', id: me.id });
    if (o && me?.isHost) dispatch({ type: 'pause' });
    router.dismissAll();
    router.replace('/');
  };

  return (
    <Screen>
      <Header title="Je m’arrête" kicker="Tout va bien" />
      <T v="body" color={colors.inkSoft} style={styles.intro}>Arrêter, faire une pause ou rentrer n’enlève aucun point. Le groupe continue sans que ça change le classement, et tu peux revenir quand tu veux.</T>

      <Card tone="green" style={[styles.block, focus === 'stop' && styles.focus]}>
        <T v="h2" color={colors.ivory}>Je quitte la soirée</T>
        <T v="small" color={colors.ivoryDark}>Ta place et tes points restent sur la feuille. Personne n’est averti autrement que par ton absence.</T>
        <Button label="Je m’arrête ici" onDark onPress={leave} />
      </Card>

      <Card style={[styles.block, focus === 'water' && styles.focus]}>
        <T v="h2">Un verre d’eau</T>
        <T v="small" color={colors.inkMuted}>Entre deux trous, de l’eau pour tout le monde. L’eau et les boissons sans alcool comptent exactement comme les autres : pour rien.</T>
        <Button label={water ? 'Rappel affiché pour le groupe' : 'Proposer une pause eau au groupe'} kind="secondary" size="sm" disabled={!o} onPress={() => { dispatch({ type: 'waterReminder' }); setWater(true); success(); }} />
        {!o ? <T v="small" color={colors.inkMuted}>Aucune sortie en cours : le rappel s’affiche sur l’écran du trou pendant une sortie.</T> : null}
      </Card>

      <Card style={[styles.block, focus === 'taxi' && styles.focus]}>
        <T v="h2">Rentrer</T>
        <T v="small" color={colors.inkMuted}>Taxi ou VTC : ouvre l’appli si elle est installée, sinon son site.</T>
        <View style={styles.row}>
          <Button label="Uber" kind="secondary" size="sm" style={styles.flex} onPress={() => openRide('uber')} />
          <Button label="Bolt" kind="secondary" size="sm" style={styles.flex} onPress={() => openRide('bolt')} />
          <Button label="G7" kind="secondary" size="sm" style={styles.flex} onPress={() => openRide('g7')} />
        </View>
        {rideError ? <StatusBox kind="error" title="Ouverture impossible" text={rideError} /> : null}
      </Card>

      <Card style={[styles.block, focus === 'pin' && styles.focus]}>
        <T v="h2">Position à un ami de confiance</T>
        <T v="small" color={colors.inkMuted}>Désactivé par défaut. Un partage ponctuel, vers une personne que tu choisis, jamais vers le groupe entier. L’appli ne lit pas ta position : tu la colles toi-même.</T>
        {o ? <Toggle label="Autoriser le partage de position" value={o.privacy.location} onChange={(v) => dispatch({ type: 'setPrivacy', key: 'location', value: v })} /> : null}
        <Button label={sent === 'done' ? 'Message envoyé' : sent === 'copied' ? 'Message copié' : 'Envoyer ma position'} size="sm" disabled={!!o && !o.privacy.location} onPress={sharePosition} />
        {sent === 'error' ? <StatusBox kind="error" title="Partage indisponible" text="Envoie un message classique à ton ami avec ta position." /> : null}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  intro: { marginBottom: space.md },
  block: { gap: space.sm, marginBottom: space.md },
  focus: { borderWidth: 2, borderColor: colors.gold },
  row: { flexDirection: 'row', gap: space.sm },
});
