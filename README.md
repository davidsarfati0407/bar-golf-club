# Bar Golf Club

Application mobile (iOS et Android) pour accompagner une soirée entre amis adultes de bar en bar, sur le thème du « golf de bar ». Portrait, une main, très visuelle. Réservée aux 18 ans et plus.

**Principe** : le groupe choisit un parcours de 3 à 9 lieux (bars, cafés, restaurants). Chaque lieu est un « trou » avec un drapeau rouge. À chaque trou, un défi rapporte des points et la feuille de score verte « PUB GOLF » se remplit. Le score vient **uniquement des défis**. Ce que chacun consomme ne change jamais ni son score, ni l'avancée du groupe.

## v2 « clubhouse de nuit » (branche `feat/clubhouse-v2`)

Refonte visuelle (vert fairway, ivoire, or champagne, Playfair Display + Inter), moteur de score unique (points de défis), modes de jeu, notice et règles, rejoindre par code, états d'erreur, boutique honnête. Audit du brief et verdicts : [docs/audit.md](docs/audit.md). Captures à 320, 390 et desktop : `docs/captures/`.

## Démo web

L'app est exportée en web (Expo) et déployée sur Vercel comme maquette interactive : sur un écran large elle s'affiche dans un cadre téléphone, sur mobile en plein écran.

- Démo en 3 appuis : **Accueil → « Démo en 3 appuis » → « C'est parti »**.
- Le chemin complet (lieux, participants) prend le temps qu'il faut : **« Nouvelle sortie »**.

## Lancer en local

```bash
npm install
npx expo start          # iOS / Android via Expo Go ou dev build, et web
npm run build:web       # export statique dans dist/
npm run typecheck
```

## Stack

| Couche | Choix |
| --- | --- |
| App | Expo SDK 58, React Native 0.88, TypeScript strict |
| Navigation | expo-router (stack natif, modales pour « Je m'arrête » et « Hôte ») |
| État | React context + reducer, persistance AsyncStorage |
| Dessin | react-native-svg (mannequins, drapeaux, briques, QR) |
| Retours | expo-haptics, Animated (transform / opacity uniquement) |
| Web | export statique Metro, déployé sur Vercel (`vercel.json`) |

## Livrables

| Livrable | Où |
| --- | --- |
| Parcours utilisateur et liste d'écrans | [docs/parcours-et-ecrans.md](docs/parcours-et-ecrans.md) |
| Design system (couleurs, typo, composants) | [docs/design-system.md](docs/design-system.md) et `src/theme/tokens.ts` |
| Maquettes haute fidélité (écrans 1, 3, 4, 5, boutique) | l'app elle-même : `src/app/*.tsx`, déployée sur Vercel |
| Architecture technique | [docs/architecture.md](docs/architecture.md) |
| Plan en 3 étapes | [docs/plan.md](docs/plan.md) |
| Règles de conception (alcool, 18+, confidentialité) | [docs/regles.md](docs/regles.md) |
| Moteur de score, égalité, abandon, trou annulé, modes | [docs/moteur-de-score.md](docs/moteur-de-score.md) |
| Audit du test externe, ce qui existe vraiment | [docs/audit.md](docs/audit.md) |

## Structure

```
src/
  app/            écrans expo-router
    _layout.tsx   fonts, providers, cadre téléphone (web), bandeau de synchro
    index.tsx     1. Accueil + porte 18+ + notice en 3 écrans
    join.tsx      Rejoindre par code (3 étapes)
    rules.tsx     Comment ça marche (règles + exemple chiffré)
    create.tsx    2. Création (trous, format, invitation lien/QR, avatars)
    course.tsx    3. Parcours (carte, ordre, remplacement, recherche)
    hole.tsx      4. Trou en cours (défi, Fait, photo, points, barre de sécurité)
    scoreboard.tsx 5. Feuille de score, classement, récap 9:16, replay
    shop.tsx      Boutique
    stop.tsx      « Je m'arrête » (pause, eau, taxi/VTC, position)
    host.tsx      Outils de l'hôte
  components/     design system (Button, T, Card, Chip, Stepper, Flag, Mannequin…)
  data/           défis par mode, règles, lieux, produits
  sync/           salle partagée locale (deux clients du même navigateur)
  store/          état de la sortie, classement, persistance
  theme/          tokens
docs/             livrables
```
