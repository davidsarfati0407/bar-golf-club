# Audit du brief du 8 novembre 2026 : ce qui existe vraiment

Chaque affirmation du brief a été confrontée au code. Verdicts : **confirmé**, **partiel**, **absent → corrigé**, **absent → option à soumettre**.

## Stack et architecture (résumé)

Expo SDK 58 + expo-router, TypeScript strict. Un reducer unique (`src/store/outing.tsx`) persisté dans AsyncStorage (localStorage sur le web). Export web statique « single » servi par Vercel. Données locales (défis, lieux, produits). Aucun backend.

## Affirmations « observées, non vérifiées »

| Affirmation | Avant (v1) | Maintenant (v2) |
| --- | --- | --- |
| Invitation par code court et QR, rejoindre avec un prénom sans compte | **Absent.** Le code et le QR étaient affichés, mais aucune route `join` n'existait et rien ne reliait deux clients. Le lien pointait vers un domaine fictif. | **Partiel, honnête.** Route `/join` en 3 étapes (code → principe en 3 points → prénom, 18 ans confirmés). Synchronisation réelle entre deux clients **du même navigateur** via `localStorage` + événement `storage` (`src/sync/localRoom.ts`). Vérifié automatiquement avec deux fenêtres : l'invité apparaît chez l'hôte, suit le lancement, marque un point vu par l'hôte, et un code faux affiche une erreur. **Entre deux téléphones : absent.** Il faut un backend temps réel (option à soumettre : Supabase Realtime, gratuit jusqu'à un certain volume, ou Convex). L'interface le dit explicitement. |
| Interrupteurs de confidentialité de la carte de fin | **Confirmé** (prénoms, photos, lieux, tous à `false` par défaut). | Conservé. Les noms d'équipe apparaissent toujours (ce ne sont pas des données personnelles), les prénoms seulement avec consentement. |
| Photos de défis désactivées par défaut | **Confirmé** (`privacy.photos = false`, un appui pour autoriser). | Conservé, avec message d'erreur si la galerie échoue. |
| Barre de sécurité : Uber/Bolt/G7, position, rappel eau | **Partiel.** Liens réels (schéma d'appli puis site). Position : partage d'un texte, l'appli ne lit pas la géolocalisation. Rappel eau : bouton sans effet. | Liens conservés avec état d'erreur. Position : inchangé et expliqué (« tu la colles toi-même »). Rappel eau : diffuse un bandeau « Pause eau proposée » sur l'écran du trou de tous les clients synchronisés, pendant 10 minutes. |
| Options hôte : corriger un score, retirer, passer la main | **Confirmé.** | Conservé, plus **annuler / rétablir un trou**, retirer un joueur déconnecté, et confirmation avant « Quitter sans garder ». Réservé à l'hôte (`meId === hostId`). Testé automatiquement (+1 point via l'hôte). |
| Boutique, panier, checkout | **Faux achat.** Un bouton « Payer » affichait « Commande suivie ». | **Honnête.** État « Commande bientôt disponible », rien n'est enregistré ni débité, bouton « Me prévenir ». |
| Persistance des sorties | **Confirmé** (AsyncStorage, reprise après fermeture). | Conservé, clé `bgc.state.v2`. Relecture de la salle partagée à l'ouverture. |
| Hors-ligne | **Partiel.** Bandeau et compteur d'actions ; rien n'est envoyé nulle part, donc rien à perdre. | Bandeau reformulé pour dire la vérité : « gardée sur cet appareil, rien n'est perdu ». Le vrai hors-ligne avec file d'attente arrive avec le backend. |
| Gestion d'erreurs | **Minimal.** try/catch sur partage et photo. | `StatusBox` (chargement, vide, erreur) sur chaque écran : hydratation, code introuvable, partage indisponible, photo impossible, taxi impossible, aucun lieu trouvé, aucune sortie jouée, boutique. |

## Bugs du test en ligne

| # | Bug | Cause | Correction |
| --- | --- | --- | --- |
| 1 | Page blanche après « Ranger dans les souvenirs » | Le reducer vidait la sortie avant la navigation ; l'écran de résumé re-rendait avec `outing = null` et un composant enfant lisait `state.outing!`. Erreur React #300 reproduite en headless. | Navigation d'abord, archivage au tick suivant ; plus aucun `!` ; garde par `useEffect` (jamais de navigation pendant le rendu). Testé : retour à l'accueil avec le souvenir affiché, à 320, 390 et desktop. |
| 2 | Tableau qui déborde, TOTAL tronqué | `ScrollView` horizontal avec cellules fixes. | `ScoreTable` : une ligne nom + total, puis les cellules de trous qui se replient. Aucun défilement horizontal, lisible à 320 px avec 9 trous. |
| 3 | Noms d'équipe tronqués ou remplacés par « Équipe 1 » | Cellule de 52 px en capitales espacées ; consentement « prénoms » appliqué aux noms d'équipe. | Noms d'équipe toujours affichés sur deux lignes ; le consentement ne porte que sur les prénoms. |
| 4 | « PUB GOLF » | Reliquat de la vidéo d'inspiration. | « Bar Golf Club » partout. |
| 5 | Pastille de défi illisible | Catégorie, chiffre et « BIRDIE » mélangés. | Trois zones : « Catégorie · Tenue », titre serif, puis « Ce trou vaut [2] points pour chaque équipe qui réussit ». Vocabulaire golf (par, birdie, eagle) supprimé du score. |

## Invariants vérifiés dans le code

- Aucune action du reducer n'ajoute de points hors `score` (défi) et `correctScore` (hôte).
- `nextHole` n'a aucune condition. `pause`, `leave`, `rejoin` ne touchent pas aux résultats.
- Aucun défi (Classique, Compétition, Soft) ne mentionne boire, verre, quantité ou vitesse ; le putt se joue avec un sous-bock et la « pile de sous-bocks » ne touche pas à la vaisselle.
- Verrou 18+ (`ageConfirmed`) persistant, rappel sur l'écran d'invitation.
- Aucune marque d'alcool, aucune publicité. Boutique : objets du jeu uniquement.
- Géolocalisation : jamais lue par l'appli. Partage de position = texte envoyé par l'utilisateur, opt-in.

## Options payantes ou externes à soumettre (rien n'est intégré d'office)

1. **Backend temps réel** pour la synchro entre téléphones et le vrai hors-ligne : Supabase (Postgres + Realtime + Storage) ou Convex. Gratuit pour une bêta, payant à l'échelle.
2. **Lieux réels à proximité avec temps de marche** : Google Places ou Foursquare (payants au volume) ou OpenStreetMap/Overpass (gratuit, données inégales). Dans tous les cas, « À vérifier » tant que la source ne confirme pas l'ouverture.
3. **Rendu image de la carte 9:16** : `react-native-view-shot` (gratuit) côté client.
4. **Paiement boutique** : Stripe ou Shopify Storefront.
