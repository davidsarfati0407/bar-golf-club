# Design system

Source de vérité : `src/theme/tokens.ts`. Univers repris de la vidéo : mannequins en bois low-poly aux grosses têtes rondes, façades en briques, néons, drapeau rouge, carte de score verte « PUB GOLF », tenues de golfeur.

## Couleurs

| Token | Hex | Usage |
| --- | --- | --- |
| `pubRed` | `#7A1E2B` | En-têtes brique, CTA principal, enseigne |
| `pubRedDeep` | `#55121D` | Porte 18+, carte 9:16 |
| `flagRed` | `#E0352B` | Drapeaux, équipe 1 |
| `honey` | `#C8893A` | Bois des mannequins, mâts, cartes bois |
| `honeyLight` | `#E2B373` | Textes secondaires sur fond sombre |
| `woodDark` | `#8A5A24` | Ombres bois |
| `scoreGreen` | `#1F6B45` | Carte de score, carte du parcours, CTA « avancer » |
| `scoreGreenDeep` | `#134A30` | Fond de la feuille de score |
| `cream` | `#F6EEDC` | Fond d'écran, texte sur fonds sombres |
| `paper` | `#FBF6EA` | Cartes |
| `neonPink` | `#FF4FA3` | Accent néon : démo, trou en cours, 18+, consentements |
| `ink` | `#1A1410` | Texte principal |

Contrastes vérifiés AA : crème sur rouge pub (≈ 8:1), crème sur vert scorecard (≈ 6:1), encre sur crème (≈ 14:1), encre sur néon rose (≈ 6:1).

## Typographie

Nunito (arrondie, grasse), via `@expo-google-fonts/nunito`.

| Style | Poids | Taille / interligne | Usage |
| --- | --- | --- | --- |
| `display` | Black 900 | 56 / 60 | Enseigne, stepper, 18+ |
| `number` | Black 900 | 44 / 48 | Points du défi, rangs |
| `h1` | Black 900 | 32 / 36 | Titre du défi, code d'invitation, totaux |
| `h2` | ExtraBold 800 | 24 / 28 | Sections, prix |
| `h3` | ExtraBold 800 | 18 / 22 | Titres de cartes, boutons CTA |
| `body` / `bodyBold` | SemiBold 600 / Bold 700 | 16 / 22 | Texte courant |
| `small` / `smallBold` | 600 / 700 | 14 / 18 | Métadonnées |
| `caption` | Bold 700, capitales, +0,6 | 12 / 16 | Étiquettes |

Peu de texte, gros chiffres, une action principale par écran. Les textes suivent la taille système (plafond 1,3× sur `display`, `number`, `h1`).

## Espacements, rayons, cibles

- Espacements : 4 · 8 · 12 · 16 · 24 · 32 · 48.
- Rayons : 10 · 16 · 22 · 30 · pilule.
- Cibles tactiles : 48 px minimum, CTA 60 px, toujours en pied d'écran (zone du pouce).
- Ombres : `card` (douce, encre) et `neon` (rose, sans décalage).

## Composants (`src/components`)

| Composant | Rôle |
| --- | --- |
| `T` | Texte typé par variante, couleur, centrage, plafond de mise à l'échelle |
| `Button` | Variantes `primary` (rouge), `green`, `neon`, `secondary`, `ghost`, `danger`; tailles `cta` / `md` / `sm`; animation d'appui (spring sur `transform`), haptique |
| `Card` | Carte papier / verte / rouge / bois |
| `Chip` | Filtre ou étiquette sélectionnable |
| `Stepper` | Gros chiffre + deux cibles 60 px |
| `Flag` | Drapeau rouge SVG, variante `muted` pour un trou joué |
| `Mannequin` | Avatar bois low-poly SVG, tenues `cap`, `argyle`, `putter`, `flag`, couleur d'accent d'équipe |
| `BrickWall` | Motif brique SVG pour les en-têtes |
| `Header` | Retour 48 px, titre, kicker, slot droit |
| `Screen` / `PhoneFrame` | Fond, zones sûres, pied fixe ; cadre téléphone sur écran large (web) |
| `SafetyBar` | Je m'arrête · Eau · Taxi · Position |
| `SyncBanner` | État réseau et synchronisation |

## Micro-interactions

- Appui : spring 0,96 → 1 sur les boutons.
- « Fait » : pop du badge de points (1 → 1,12 → 1) + haptique succès.
- Porte 18+ : pulsation lente du badge néon.
- Replay : fondu par trou, 1,8 s.
- Uniquement `transform` et `opacity`, `useNativeDriver: true`.

## À éviter (et évité)

Cartes identiques empilées (chaque carte a un rôle, une couleur ou une bordure propre), dégradés génériques (aplats + motif brique), emojis en décor (icônes SVG dessinées), texte long.
