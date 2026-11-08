# Design system « clubhouse de nuit »

Source de vérité : `src/theme/tokens.ts`. Golf chic + néon festif, épuré. Le mur de briques a disparu : le néon vit sur fond vert nuit.

## Couleurs

| Token | Hex | Usage |
| --- | --- | --- |
| `fairway` | `#0E3B2E` | Fond des écrans de fête (accueil, résumé), en-têtes, CTA sur ivoire |
| `fairwayDeep` | `#092A21` | Fond derrière le cadre téléphone, carte 9:16 |
| `fairwayLight` | `#15503E` | Surfaces sur vert nuit (cartes, table) |
| `fairwayLine` | `rgba(247,242,231,0.16)` | Traits fins sur vert |
| `ivory` | `#F7F2E7` | Fond des écrans de travail, texte sur vert |
| `ivoryDark` / `ivoryDeep` | `#EBE3D2` / `#DED3BC` | Cellules, bordures, textes secondaires sur vert |
| `ink` | `#1A2420` | Texte principal, boutons noirs |
| `inkSoft` / `inkMuted` | `#3E4A45` / `#5F6B66` | Texte secondaire |
| `gold` | `#E8C36A` | **L'unique accent néon.** Logo, victoire, carte à partager, trou courant, libellés de section sur vert |
| `flag` | `#D63A2F` | Couleur fonctionnelle des drapeaux, jamais décorative |
| `teamRed` / `teamBlue` / `teamRose` / `teamGold` | `#D63A2F` / `#4C8FD1` / `#E06C9F` / `#E8C36A` | Couleurs d'équipe, lisibles sur ivoire et sur vert |
| `success` / `warning` / `danger` / `water` | `#2F8F5B` / `#C98A2B` / `#B8382E` / `#3F7FBF` | États et barre de sécurité |

**Pourquoi l'or champagne plutôt que le rose corail** : il prolonge l'univers du club (veste verte, trophées, laiton du clubhouse), il contraste mieux sur le vert nuit (≈ 9:1 contre ≈ 5:1 pour le rose) et il ne se confond pas avec le rouge des drapeaux ni avec la couleur d'équipe rose. Le rose reste une couleur d'équipe.

Contrastes AA vérifiés : ivoire sur fairway ≈ 11:1, encre sur ivoire ≈ 14:1, or sur fairway ≈ 9:1, encre sur or ≈ 10:1, ivoire sur danger ≈ 5.5:1, encre sur blanc ≈ 16:1.

## Typographie

| Rôle | Police | Styles |
| --- | --- | --- |
| Titres | Playfair Display 700 / 900 | `display` 44, `h1` 30, `h2` 23 |
| Interface | Inter 400 / 500 / 600 / 700 | `h3` 17, `body` 16, `small` 14, `caption` 11 capitales espacées |
| Scores | Inter 700, **chiffres tabulaires** (`fontVariant: tabular-nums`) | `number` 36, `numberSmall` 20, `numberCell` 13 |

Les textes suivent la taille système, plafonnés à 1,3× sur `display`, `number`, `h1` pour préserver les grilles.

## Composants

| Composant | Rôle |
| --- | --- |
| `Button` | `primary` (fairway, ou ivoire avec `onDark`), `secondary` (contour), `ghost` (trait fin), `danger`. Appui : 150 ms, scale 0,97, désactivé sous prefers-reduced-motion |
| `Neon` | Titre or avec halo, effet « qui s'allume » 900 ms une seule fois. Réservé au logo, à la victoire et à la carte 9:16. Statique sous prefers-reduced-motion |
| `Card` | `paper` (blanc bordé), `green`, `dark` (surface sur vert), `outline` |
| `ScoreTable` | Feuille sans défilement horizontal : nom + total, puis cellules de trous repliables |
| `GreenJacket` | Veste verte du vainqueur (Compétition) |
| `Mannequin` | Avatars bois affinés : traits 1,4 px, palette bois unifiée, tenues `cap`, `argyle`, `putter`, `flag` |
| `Flag` | Drapeau fin, mât ivoire ou encre selon le fond |
| `StatusBox` | États chargement / vide / erreur, avec action |
| `Toggle` | Interrupteur étiqueté, variante sur fond sombre |
| `SafetyBar` | Je m'arrête · Eau · Taxi · Position, aplats mats |
| `SyncBanner` | État réseau honnête |
| `Header`, `Screen`, `PhoneFrame`, `Chip`, `Stepper`, `T` | Structure |

## Motion

- Transitions d'écran : 200 ms (fondu sur le web).
- Appui : 150 ms. Pop du badge de points : 2 × 150 ms.
- Néon : 900 ms, uniquement victoire, logo d'accueil, carte de fin.
- `useReducedMotion` : `prefers-reduced-motion` sur le web, « Réduire les animations » sur iOS/Android. Toutes les animations tombent à l'état final.

## Densité

Une action principale par écran, boutons de 52 à 56 px, cibles de 48 px, gouttières de 16 px, mobile d'abord à partir de 320 px (grille boutique en une colonne sous 360 px, actions du parcours sur leur propre ligne).
