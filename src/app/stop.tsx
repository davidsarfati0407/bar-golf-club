import * as Clipboard from 'expo-clipboard';
import { router, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import { Linking, Share, StyleSheet, Switch, View } from 'react-native';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { success, tap } from '@/components/haptics';
import { Header } from '@/components/Header';
import { Screen } from '@/components/Screen';
import { T } from '@/components/T';
import { useOuting } from '@/store/outing';
import { colors, space } from '@/theme/tokens';

// « Je m'arrête » : toujours accessible, sans jugement, en une main.
export default function Stop() {
  const { focus } = useLocalSearchParams<{ focus?: string }>();
  const { state, dispatch } = useOuting();
  const o = state.outing;
  const [sent, setSent] = useState(false);

  const openRide = async (app: 'uber' | 'bolt' | 'g7') => {
    tap();
    const schemes = { uber: 'uber://', bolt: 'bolt://', g7: 'g7taxi://' };
    const webs = { uber: 'https://m.uber.com', bolt: 'https://bolt.eu', g7: 'https://www.g7.fr' };
    try {
      if (await Linking.canOpenURL(schemes[app])) return Linking.openURL(schemes[app]);
    } catch {
      // on bascule sur le site
    }
    return WebBrowser.openBrowserAsync(webs[app]).catch(() => Linking.openURL(webs[app]));
  };

  const sharePosition = async () => {
    const text = 'Je suis en soirée Bar Golf Club. Voici ma position (lien de partage à ouvrir dans Plans ou Maps).';
    try {
      await Share.share({ message: text });
    } catch {
      await Clipboard.setStringAsync(text);
    }
    success();
    setSent(true);
  };

  return (
    <Screen bg={colors.paper}>
      <Header title="Je m’arrête" kicker="Tout va bien" onBack={() => router.back()} />
      <T v="body" color={colors.inkSoft} style={styles.intro}>
        Arrêter, faire une pause ou rentrer n’enlève aucun point. Le groupe continue sans que ça change le classement, et tu peux revenir quand tu veux.
      </T>

      <Card tone="red" style={[styles.block, focus === 'stop' && styles.focus]}>
        <T v="h2" color={colors.cream}>Je quitte la soirée</T>
        <T v="small" color={colors.creamDark}>Ta place et tes points restent sur la feuille. Personne n’est averti autrement que par ton absence.</T>
        <Button label="Je m’arrête ici" kind="secondary" onPress={() => { dispatch({ type: 'pause' }); router.dismissAll(); router.replace('/'); }} />
      </Card>

      <Card style={[styles.block, focus === 'water' && styles.focus]}>
        <T v="h2">Un verre d’eau</T>
        <T v="small" color={colors.inkMuted}>Entre deux trous, de l’eau pour tout le monde. L’eau et les boissons sans alcool comptent exactement comme les autres : pour rien.</T>
        <Button label="Rappel pour le groupe" kind="green" size="sm" onPress={() => { success(); }} />
      </Card>

      <Card style={[styles.block, focus === 'taxi' && styles.focus]}>
        <T v="h2">Rentrer</T>
        <T v="small" color={colors.inkMuted}>Taxi ou VTC, ouverture directe de l’appli installée.</T>
        <View style={styles.row}>
          <Button label="Uber" kind="secondary" size="sm" style={styles.flex} onPress={() => openRide('uber')} />
          <Button label="Bolt" kind="secondary" size="sm" style={styles.flex} onPress={() => openRide('bolt')} />
          <Button label="G7" kind="secondary" size="sm" style={styles.flex} onPress={() => openRide('g7')} />
        </View>
      </Card>

      <Card style={[styles.block, focus === 'pin' && styles.focus]}>
        <T v="h2">Position à un ami de confiance</T>
        <T v="small" color={colors.inkMuted}>Désactivé par défaut. Un partage ponctuel, vers une personne que tu choisis, jamais vers le groupe entier.</T>
        {o ? (
          <View style={styles.toggle}>
            <T v="bodyBold" style={styles.flex}>Autoriser la géolocalisation</T>
            <Switch value={o.privacy.location} onValueChange={(v) => { tap(); dispatch({ type: 'setPrivacy', key: 'location', value: v }); }} accessibilityLabel="Autoriser la géolocalisation" trackColor={{ true: colors.scoreGreen }} />
          </View>
        ) : null}
        <Button label={sent ? 'Position envoyée' : 'Envoyer ma position'} kind="primary" size="sm" disabled={!!o && !o.privacy.location} onPress={sharePosition} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  intro: { marginBottom: space.md },
  block: { gap: space.sm, marginBottom: space.md },
  focus: { borderWidth: 3, borderColor: colors.neonPink },
  row: { flexDirection: 'row', gap: space.sm },
  toggle: { flexDirection: 'row', alignItems: 'center', gap: space.sm, minHeight: 48 },
});
