# Plan en 3 étapes

## Étape 1 · MVP (ce prototype → bêta fermée)

**Objectif** : une soirée complète jouable par un groupe réel, en temps réel, sans compte.

- [x] 5 écrans : accueil, création, parcours, trou en cours, feuille de score / résumé.
- [x] Porte 18+, barre « Je m'arrête », eau, taxi/VTC, position à un ami (opt-in).
- [x] Règles alcool hors du jeu, lieux « à vérifier », remplacement en deux gestes.
- [x] Outils de l'hôte : corriger, annuler, retirer, passer la main, pause, fin.
- [x] Persistance locale, bandeau de synchronisation, démo en 3 appuis.
- [ ] Backend temps réel (Supabase) : rooms par code, actions optimistes, file hors ligne.
- [ ] Page d'arrivée invité (lien / QR → prénom + 18+).
- [ ] Recherche de lieux réelle, statut d'ouverture uniquement si confirmé.
- [ ] Rendu réel de la carte 9:16 (`react-native-view-shot`) et du replay (vidéo courte).
- [ ] Tests reducer + E2E Maestro, builds EAS (TestFlight, Play interne).

## Étape 2 · Extensions sociales (masquées par défaut, activables dans les réglages)

- Suggestions de lieux à proximité (opt-in géolocalisation, jamais d'horaires inventés).
- Défis personnalisés par le groupe, avec filtre qui refuse toute consigne liée à la boisson.
- Album de souvenirs partagé au groupe, suppression individuelle.
- Badges et saisons (uniquement sur défis et participation).
- Thèmes de pubs (brique, néon, bois), mode un seul téléphone, hors-ligne complet.
- Anglais ; accessibilité renforcée : mode daltonisme, texte très grand, sous-titres des replays.

## Étape 3 · Boutique

- Catalogue : carte de score et crayon, mini-drapeaux, casquette plate, tote bag, cartes défis sans alcool, gourde.
- Fiches produit visuelles, panier simple, Apple Pay / Google Pay, suivi de commande.
- Hors du parcours de jeu, jamais nécessaire pour jouer, aucun avantage de score, aucune vente d'alcool.
- Intégration via une plateforme marchande existante (Shopify Storefront ou Stripe), pas de logistique maison.
