import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle, Path, Polygon, Rect } from 'react-native-svg';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { success, tap } from '@/components/haptics';
import { Header } from '@/components/Header';
import { Screen } from '@/components/Screen';
import { T } from '@/components/T';
import { PRODUCTS, type Product } from '@/data/shop';
import { colors, radius, space, touch } from '@/theme/tokens';

const TONE_BG: Record<Product['tone'], string> = {
  green: colors.scoreGreen,
  red: colors.pubRed,
  honey: colors.honey,
  cream: colors.creamDark,
  pink: colors.neonPink,
};

export default function Shop() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [paid, setPaid] = useState(false);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = PRODUCTS.reduce((sum, p) => sum + (cart[p.id] ?? 0) * p.price, 0);

  const add = (id: string) => {
    tap();
    setPaid(false);
    setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  };
  const remove = (id: string) => {
    tap();
    setCart((c) => {
      const n = (c[id] ?? 0) - 1;
      const next = { ...c };
      if (n <= 0) delete next[id];
      else next[id] = n;
      return next;
    });
  };

  const footer = count > 0 ? (
    <View style={styles.footer}>
      <View style={styles.totalRow}>
        <T v="bodyBold" color={colors.inkSoft}>{count} article{count > 1 ? 's' : ''}</T>
        <T v="h2">{total} €</T>
      </View>
      <Button label={paid ? 'Commande suivie · livraison 3 à 5 jours' : 'Payer avec Apple Pay / Google Pay'} size="cta" kind={paid ? 'green' : 'primary'} onPress={() => { success(); setPaid(true); }} />
    </View>
  ) : null;

  return (
    <Screen footer={footer ?? undefined}>
      <Header title="Boutique" kicker="Objets du club" />
      <T v="small" color={colors.inkMuted} style={styles.intro}>Facultative, hors du parcours. Aucun objet ne donne d’avantage de score. Aucune vente d’alcool.</T>
      <View style={styles.grid}>
        {PRODUCTS.map((p) => {
          const n = cart[p.id] ?? 0;
          return (
            <Card key={p.id} style={styles.product}>
              <View style={[styles.visual, { backgroundColor: TONE_BG[p.tone] }]} accessible accessibilityLabel={p.name}>
                <ProductArt id={p.id} />
              </View>
              <T v="h3" numberOfLines={2}>{p.name}</T>
              <T v="small" color={colors.inkMuted} numberOfLines={2}>{p.tagline}</T>
              <View style={styles.buyRow}>
                <T v="h2">{p.price} €</T>
                {n === 0 ? (
                  <Pressable accessibilityRole="button" accessibilityLabel={`Ajouter ${p.name} au panier`} onPress={() => add(p.id)} style={styles.addBtn}>
                    <T v="h2" color={colors.cream}>+</T>
                  </Pressable>
                ) : (
                  <View style={styles.qty}>
                    <Pressable accessibilityRole="button" accessibilityLabel={`Retirer un ${p.name}`} onPress={() => remove(p.id)} style={styles.qtyBtn}><T v="h3">−</T></Pressable>
                    <T v="bodyBold">{n}</T>
                    <Pressable accessibilityRole="button" accessibilityLabel={`Ajouter un ${p.name}`} onPress={() => add(p.id)} style={styles.qtyBtn}><T v="h3">+</T></Pressable>
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

// Illustrations produit : formes simples, dans l'univers bois / drapeau / losanges.
function ProductArt({ id }: { id: string }) {
  switch (id) {
    case 's1':
      return (
        <Svg width={90} height={70} viewBox="0 0 90 70">
          <Rect x="10" y="8" width="54" height="54" rx="6" fill={colors.cream} />
          <Rect x="18" y="18" width="38" height="4" rx="2" fill={colors.scoreGreen} />
          <Rect x="18" y="28" width="38" height="4" rx="2" fill={colors.scoreGreen} />
          <Rect x="18" y="38" width="26" height="4" rx="2" fill={colors.scoreGreen} />
          <Rect x="68" y="10" width="8" height="50" rx="3" fill={colors.honey} transform="rotate(8 72 35)" />
        </Svg>
      );
    case 's2':
      return (
        <Svg width={90} height={70} viewBox="0 0 90 70">
          {[0, 1, 2].map((i) => (
            <React.Fragment key={i}>
              <Rect x={20 + i * 22} y="12" width="3" height="48" rx="1.5" fill={colors.honey} />
              <Path d={`M${23 + i * 22} 13 L${40 + i * 22} 19 L${23 + i * 22} 25 Z`} fill={colors.cream} />
            </React.Fragment>
          ))}
        </Svg>
      );
    case 's3':
      return (
        <Svg width={90} height={70} viewBox="0 0 90 70">
          <Path d="M15 42 Q45 6 75 42 Z" fill={colors.pubRed} />
          <Rect x="10" y="40" width="70" height="8" rx="4" fill={colors.ink} />
        </Svg>
      );
    case 's4':
      return (
        <Svg width={90} height={70} viewBox="0 0 90 70">
          <Rect x="20" y="22" width="50" height="42" rx="4" fill={colors.paper} />
          <Path d="M32 22 Q45 0 58 22" stroke={colors.ink} strokeWidth="4" fill="none" />
          <Path d="M38 40 L50 44 L38 48 Z" fill={colors.flagRed} />
          <Rect x="36" y="38" width="2" height="16" fill={colors.honey} />
        </Svg>
      );
    case 's5':
      return (
        <Svg width={90} height={70} viewBox="0 0 90 70">
          <Rect x="22" y="12" width="36" height="50" rx="5" fill={colors.cream} transform="rotate(-8 40 37)" />
          <Rect x="34" y="10" width="36" height="50" rx="5" fill={colors.paper} transform="rotate(6 52 35)" />
          <Polygon points="52,22 60,34 52,46 44,34" fill={colors.scoreGreen} />
        </Svg>
      );
    default:
      return (
        <Svg width={90} height={70} viewBox="0 0 90 70">
          <Rect x="33" y="14" width="24" height="50" rx="8" fill={colors.cream} />
          <Rect x="37" y="6" width="16" height="10" rx="3" fill={colors.ink} />
          <Circle cx="45" cy="42" r="6" fill="#3B8BD6" />
        </Svg>
      );
  }
}

const styles = StyleSheet.create({
  intro: { marginBottom: space.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md },
  product: { width: '47.5%', padding: space.md, gap: 6 },
  visual: { height: 96, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  buyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  addBtn: { width: touch.min, height: touch.min, borderRadius: touch.min / 2, backgroundColor: colors.pubRed, alignItems: 'center', justifyContent: 'center' },
  qty: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  qtyBtn: { width: 40, height: touch.min, alignItems: 'center', justifyContent: 'center', borderRadius: radius.sm, backgroundColor: colors.cream },
  footer: { gap: space.sm },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
