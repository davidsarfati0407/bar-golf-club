# Parcours utilisateur et liste d'écrans

## Parcours principal (hôte)

```
Ouverture ──► Porte 18+ ──► Accueil
                               │
                ┌──────────────┼───────────────────┐
                ▼              ▼                   ▼
         Nouvelle sortie   Démo en 3 appuis     Reprendre / Souvenirs / Boutique
                │              │
                ▼              │
      2. Création ─────────────┤   trous (3-9), équipes/individuel, lien + QR, avatars et tenues
                │              │
                ▼              ▼
      3. Parcours ──────────────   carte à drapeaux, ordre, remplacement, recherche de lieu
                │  « C'est parti »
                ▼
      4. Trou en cours  ◄──────┐   défi, « Fait » par équipe, photo facultative, points
                │  « Trou suivant »  (boucle 3 à 9 fois)
                ├──────────────┘
                ▼
      5. Feuille de score / Résumé de fin
                │  consentement → carte 9:16 → partage (Stories, TikTok)
                │  replay animé à la demande
                ▼
         Souvenirs (accueil)
```

À tout moment pendant la sortie : **barre de sécurité** (Je m'arrête · Eau · Taxi · Position) et **Hôte** (corriger, retirer, passer la main, pause, fin).

## Parcours invité

Lien ou QR → page d'arrivée (prénom + confirmation 18+) → même feuille de score en direct → « Fait » sur les défis de son équipe → consentement individuel avant d'apparaître dans le récap. Compte facultatif pour garder l'historique.

## Démo en 3 appuis

1. Accueil : « Démo en 3 appuis » (sortie pré-remplie : 6 trous, 6 joueurs, 3 équipes).
2. Parcours : « C'est parti ».
3. Trou 1 : « Fait » sur une équipe. La feuille se remplit.

En vrai usage, le choix des lieux et des participants n'est jamais court-circuité : « Nouvelle sortie » passe par l'écran de création complet.

## Liste des écrans

| # | Écran | Route | Action principale | Contenu |
| --- | --- | --- | --- | --- |
| 0 | Porte 18+ | `/` (avant confirmation) | « J'ai 18 ans ou plus » | Avertissement, principe du jeu, aucune marque d'alcool |
| 1 | Accueil | `/` | « Nouvelle sortie » | Enseigne néon, trio de mannequins, démo, reprendre, souvenirs, lien boutique |
| 2 | Création | `/create` | « Voir le parcours » | Stepper de trous, équipes / individuel, QR + code + lien, joueurs et tenues, ajout par prénom |
| 3 | Parcours | `/course` | « C'est parti » | Carte verte stylisée avec un drapeau par trou, liste ordonnable (↑ ↓), remplacement ⇄, recherche de lieu, statut « À vérifier » |
| 4 | Trou en cours | `/hole` | « Trou suivant » | En-tête brique rouge, progression, carte défi (type, titre, consigne, points Par/Birdie/Eagle), liste « Fait », photo facultative, annuler, pause, barre de sécurité |
| 5 | Feuille de score | `/scoreboard` | « Retour au trou » / « Partager le récap » | Carte verte PUB GOLF (grille trous × équipes), classement, en fin : carte 9:16, consentements, replay |
| 6 | Boutique | `/shop` | « Payer avec Apple Pay / Google Pay » | 6 produits illustrés, panier simple, suivi de commande |
| 7 | Je m'arrête | `/stop` (modale) | « Je m'arrête ici » | Quitter sans perdre, eau, Uber / Bolt / G7, position à un ami de confiance (opt-in) |
| 8 | Hôte | `/host` (modale) | — | Corriger un score par trou, retirer / passer la main, pause, terminer, quitter |

## États et erreurs

- **Réseau** : bandeau en haut de l'app (`SyncBanner`) : « Hors ligne · n actions en attente, synchronisation au retour du réseau » puis « Synchronisation… ». Les actions restent possibles hors ligne.
- **Lieu fermé ou complet** : ⇄ sur le trou puis choix d'un lieu : deux gestes, score conservé.
- **Photo refusée ou erreur** : rien ne bloque, le défi se valide sans photo.
- **Partage indisponible** (web sans `navigator.share`) : copie dans le presse-papiers avec confirmation.
- **Participant qui quitte** : ses points restent sur la feuille, le classement ne bouge pas.
