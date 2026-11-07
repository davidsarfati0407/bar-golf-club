# Architecture technique (simple)

## Vue d'ensemble

```
┌──────────────────────────────┐        ┌─────────────────────────────┐
│  App Expo (iOS / Android /   │  WS /  │  Backend temps réel          │
│  web)                        │◄──────►│  (Supabase Realtime ou       │
│  expo-router · RN · SVG      │  HTTPS │   Convex)                    │
│  store local + file d'attente│        │  sorties, trous, résultats,  │
│  AsyncStorage                │        │  participants, consentements │
└──────────────┬───────────────┘        └──────────────┬──────────────┘
               │                                       │
               │ Share sheet natif                     │ Stockage photos chiffré,
               │ (lien, QR, récap 9:16)                │ purge à la suppression
               ▼                                       ▼
   Instagram · Snapchat · WhatsApp · iMessage     Objet storage (Supabase Storage / S3)
```

## Client (ce dépôt)

- **Expo SDK 58 / React Native 0.88 / TypeScript strict**, `expo-router` pour la navigation (stack natif, modales).
- **État** : `src/store/outing.tsx`, un reducer unique sur l'objet `Outing`. Toutes les règles métier y sont (points uniquement via `score`, `nextHole` sans condition, `replacePlace` sans perte de score). Persistance AsyncStorage pour reprendre une sortie.
- **Synchronisation** (prototype) : compteur `pendingSync` + `SyncBanner`. En production :
  - abonnement temps réel à la sortie (une « room » par `joinCode`) ;
  - actions optimistes écrites localement puis envoyées ; en cas d'échec réseau, file d'attente rejouée au retour (`@react-native-community/netinfo`) ;
  - résolution des conflits côté serveur par horodatage de l'action (`HoleResult.at`) ; l'hôte peut corriger.
- **Lieux** : pour le prototype, jeu de données local avec `openStatus: 'unverified'`. En production : recherche via une API de lieux (Google Places ou Foursquare) ; l'ouverture n'est affichée « Ouvert » que si la source renvoie explicitement l'état, sinon « À vérifier ». Jamais d'horaire déduit.
- **Carte** : carte stylisée verte (SVG) pour la lisibilité et l'identité visuelle ; en production, bascule possible vers `react-native-maps` sur mobile avec le même composant de drapeau.
- **Photos** : `expo-image-picker`, opt-in, stockage local puis envoi chiffré au groupe uniquement, suppression propagée.
- **Partage** : `Share` natif. Carte 9:16 rendue côté client (`react-native-view-shot` en production) uniquement à partir des éléments consentis.
- **Haptique et animations** : `expo-haptics`, `Animated` natif (transform / opacity).
- **Accessibilité** : labels sur tous les contrôles, `maxFontSizeMultiplier`, cibles 48 px.

## Backend (étape MVP)

| Besoin | Choix recommandé | Pourquoi |
| --- | --- | --- |
| Base + temps réel + auth facultative | Supabase (Postgres, Realtime, Auth anonyme → compte optionnel) | Rejoindre sans compte via session anonyme, upgrade vers un compte pour l'historique |
| Fichiers | Supabase Storage, bucket privé par sortie | Purge simple, accès limité au groupe |
| Liens d'invitation | Deep links `bargolfclub://j/CODE` + universal links `https://bargolf.club/j/CODE` | Fonctionnent depuis Stories, WhatsApp, iMessage |
| Taxi / VTC | Schémas d'URL `uber://`, `bolt://`, `g7taxi://`, repli web | Aucune intégration commerciale |

## Modèle de données

```
outings(id, title, created_at, status, mode, host_id, join_code, consent_defaults)
participants(id, outing_id, name, outfit, team_id, is_host, age_confirmed_at, consent_names, consent_photos, consent_places)
teams(id, outing_id, name, color)
holes(id, outing_id, position, place_ref, place_name, place_kind, open_status, challenge_id, done)
results(id, hole_id, scorer_id, points, at, by_participant)
photos(id, hole_id, owner_id, storage_path, deleted_at)
```

Aucune table, colonne ni événement ne décrit la consommation.

## Web / Vercel

`npx expo export -p web` produit `dist/` (sortie « single », SPA). `vercel.json` sert `dist/`, réécrit toutes les routes vers `index.html` et met en cache immuable `_expo/static`. Sur écran large, `PhoneFrame` encadre l'app dans un téléphone pour servir de maquette.

## Qualité

- `npm run typecheck` (TypeScript strict) et `npm run lint`.
- Tests à ajouter en MVP : reducer (`outing.tsx`) en unitaire, parcours « démo en 3 appuis » en E2E (Maestro).
