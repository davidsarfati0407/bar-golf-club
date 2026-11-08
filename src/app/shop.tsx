import React, { useState } from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, Path, Polygon, Rect } from 'react-native-svg';
import { Card } from '@/components/Card';
import { tap } from '@/components/haptics';
import { Header } from '@/components/Header';
import { Screen } from '@/components/Screen';
import { StatusBox } from '@/components/StatusBox';
import { T } from '@/components/T';
import { PRODUCTS, type Product } from '@/data/shop';
import { colors, radius, space, touch } from '@/theme/tokens';

const TONE_BG: Record<Product['tone'], string> = { green: colors.fairway, red: colors.fairwayLight, honey: colors.ivoryDark, cream: colors.ivoryDark, pink: colors.fairwayLight };

// Boutique : état honnête. Aucun paiement n'est actif, aucune commande n'est enregistrée.
export default function Shop() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [notified, setNotified] = useState(false);
  const { width } = useWindowDimensions();
  const narrow = width < 360;
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = PRODUCTS.reduce((sum, p) => sum + (cart[p.id] ?? 0) * p.price, 0);

  const add = (id: string) => { tap(); setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 })); };
  const remove = (id: string) => { tap(); setCart((c) => { const n = (c[id] ?? 0) - 1; const next = { ...c }; if (n <= 0) delete next[id]; else next[id] = n; return next; }); };

  return (
    <Screen footer={count > 0 ? (
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <T v="bodyBold" color={colors.inkSoft}>{count} article{count > 1 ? 's' : ''}</T>
          <T v="numberSmall">{total} €</T>
        </View>
        <StatusBox kind="empty" title="Commande bientôt disponible" text="Le paiement (Apple Pay / Google Pay) n’est pas encore activé. Rien n’est enregistré ni débité." action={{ label: notified ? 'On te préviendra' : 'Me prévenir à l’ouverture', onPress: () => setNotified(true) }} />
      </View>
    ) : undefined}>
      <Header title="Boutique" kicker="Objets du club" />
      <T v="small" color={colors.inkMuted} style={styles.intro}>Facultative, hors du parcours. Aucun objet ne donne d’avantage de score. Aucune vente d’alcool.</T>
      <View style={styles.grid}>
        {PRODUCTS.map((p) => {
          const n = cart[p.id] ?? 0;
          return (
            <Card key={p.id} style={[styles.product, narrow && styles.productWide]}>
              <View style={[styles.visual, { backgroundColor: TONE_BG[p.tone] }]} accessible accessibilityLabel={p.name}><ProductArt id={p.id} /></View>
              <T v="h3" numberOfLines={2}>{p.name}</T>
              <T v="small" color={colors.inkMuted} numberOfLines={2}>{p.tagline}</T>
              <View style={styles.buyRow}>
                <T v="numberSmall">{p.price} €</T>
                {n === 0 ? (
                  <Pressable accessibilityRole="button" accessibilityLabel={`Ajouter ${p.name} au panier`} onPress={() => add(p.id)} style={styles.addBtn}><T v="h3" color={colors.ivory}>+</T></Pressable>
                ) : (
                  <View style={styles.qty}>
                    <Pressable accessibilityRole="button" accessibilityLabel={`Retirer un ${p.name}`} onPress={() => remove(p.id)} style={styles.qtyBtn}><T v="bodyBold">−</T></Pressable>
                    <T v="numberCell">{n}</T>
                    <Pressable accessibilityRole="button" accessibilityLabel={`Ajouter un ${p.name}`} onPress={() => add(p.id)} style={styles.qtyBtn}><T v="bodyBold">+</T></Pressable>
                  </View>
                )}
              </View>
            </Card>
          );
        })}
      </View>
    </Screen>
  );
}

function ProductArt({ id }: { id: string }) {
  const ink = colors.ivory;
  switch (id) {
    case 's1':
      return (<Svg width={90} height={64} viewBox="0 0 90 70"><Rect x="12" y="8" width="52" height="54" rx="4" fill={colors.ivory} /><Rect x="20" y="18" width="36" height="3" rx="1.5" fill={colors.fairway} /><Rect x="20" y="28" width="36" height="3" rx="1.5" fill={colors.fairway} /><Rect x="20" y="38" width="24" height="3" rx="1.5" fill={colors.fairway} /><Rect x="68" y="10" width="7" height="50" rx="3" fill={colors.gold} transform="rotate(8 71 35)" /></Svg>);
    case 's2':
      return (<Svg width={90} height={64} viewBox="0 0 90 70">{[0, 1, 2].map((i) => (<React.Fragment key={i}><Rect x={20 + i * 22} y="12" width="2" height="48" rx="1" fill={ink} /><Path d={`M${22 + i * 22} 13 L${38 + i * 22} 19 L${22 + i * 22} 25 Z`} fill={colors.flag} /></React.Fragment>))}</Svg>);
    case 's3':
      return (<Svg width={90} height={64} viewBox="0 0 90 70"><Path d="M15 42 Q45 6 75 42 Z" fill={colors.fairway} /><Rect x="10" y="40" width="70" height="7" rx="3.5" fill={colors.ink} /></Svg>);
    case 's4':
      return (<Svg width={90} height={64} viewBox="0 0 90 70"><Rect x="20" y="22" width="50" height="42" rx="4" fill={colors.ivory} /><Path d="M32 22 Q45 0 58 22" stroke={colors.ink} strokeWidth="3" fill="none" /><Path d="M38 40 L50 44 L38 48 Z" fill={colors.flag} /><Rect x="36" y="38" width="2" height="16" fill={colors.ink} /></Svg>);
    case 's5':
      return (<Svg width={90} height={64} viewBox="0 0 90 70"><Rect x="22" y="12" width="36" height="50" rx="5" fill={colors.ivory} transform="rotate(-8 40 37)" /><Rect x="34" y="10" width="36" height="50" rx="5" fill={colors.ivory} transform="rotate(6 52 35)" /><Polygon points="52,22 60,34 52,46 44,34" fill={colors.fairway} /></Svg>);
    default:
      return (<Svg width={90} height={64} viewBox="0 0 90 70"><Rect x="33" y="14" width="24" height="50" rx="8" fill={colors.ivory} /><Rect x="37" y="6" width="16" height="10" rx="3" fill={colors.ink} /><Circle cx="45" cy="42" r="6" fill={colors.water} /></Svg>);
  }
}

const styles = StyleSheet.create({
  intro: { marginBottom: space.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md },
  product: { width: '47.5%', flexGrow: 1, padding: space.md, gap: 6 },
  productWide: { width: '100%' },
  visual: { height: 88, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  buyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  addBtn: { width: touch.min, height: touch.min, borderRadius: touch.min / 2, backgroundColor: colors.fairway, alignItems: 'center', justifyContent: 'center' },
  qty: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  qtyBtn: { width: 40, height: touch.min, alignItems: 'center', justifyContent: 'center', borderRadius: radius.sm, borderWidth: 1, borderColor: colors.line },
  footer: { gap: space.sm },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
