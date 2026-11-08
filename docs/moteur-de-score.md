# Moteur de score

**Un seul modèle, partout : points de défis. Le plus grand total gagne.**

Le vocabulaire golf (par, birdie, eagle, coups) est retiré du score. Il reste dans l'univers (trous, drapeaux, veste verte), jamais dans les chiffres.

## Règles

| Situation | Règle | Code |
| --- | --- | --- |
| Marquer | Chaque équipe (ou joueur) qui réussit le défi du trou marque les points du trou : 1, 2 ou 3. Plusieurs équipes peuvent marquer sur le même trou. | `score` (un résultat par équipe et par trou, pas de doublon) |
| Victoire | Le plus grand total à la fin du parcours. En Compétition, veste verte. | `computeStandings` |
| Égalité | À total égal, le plus grand nombre de défis réussis passe devant. Sinon ex aequo, même rang, place partagée (affiché « Ex aequo » sur l'écran de fin). | `rank` calculé sur (points, défis) |
| Abandon | Le joueur passe en statut « parti ». Ses points restent, son équipe reste classée, marquée « · parti » si tous ses membres sont partis. Aucune pénalité. | `leave`, `rejoin` |
| Arrivée tardive | Le joueur rejoint avec `joinedAtHole = trou courant`. Les trous précédents valent 0 pour lui, sans pénalité pour personne. | `addPlayer`, `joinByCode` |
| Trou annulé | L'hôte annule : résultats retirés pour tous, le trou ne compte pas (cellule ✕). L'hôte peut rétablir. | `cancelHole`, `restoreHole` |
| Correction | L'hôte peut fixer 0 à 3 points à une équipe sur n'importe quel trou. | `correctScore` |
| Pause, toilettes, verre fini ou non | Aucun effet. | aucune action ne lit la consommation |

## Exemple chiffré (affiché dans « Comment ça marche »)

Trou 3, défi « Refrain à deux », vaut 2 points.

| Équipe | Avant | Résultat | Après |
| --- | --- | --- | --- |
| Les Casquettes | 3 | réussi, +2 | 5 |
| Les Losanges | 1 | réussi, +2 | 3 |
| Les Putters | 4 | renoncent, 0, aucune pénalité | 4 |

## Modes

| Mode | Défis | Trous | Habillage | Règles de score et de sécurité |
| --- | --- | --- | --- | --- |
| Classique (défaut) | 12 défis du club | 3 à 9 | standard | identiques |
| Compétition | 9 défis plus exigeants (1 à 3 pts) | 3 à 9 | podium, veste verte | identiques |
| Soft | 8 défis calmes | 3 à 9 | standard | identiques |
| Express | défis Classique | 3 | mention « durée indicative, jamais garantie » | identiques |

Les formats Équipes / Individuel existent dans tous les modes.
