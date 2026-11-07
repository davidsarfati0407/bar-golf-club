# Règles de conception appliquées

Ces règles sont obligatoires et vérifiables dans le code.

## Alcool : hors du jeu

| Règle | Mise en œuvre |
| --- | --- |
| Aucun score, temps, pénalité ou classement lié à la boisson | `src/store/outing.tsx` : la seule action qui ajoute des points est `score`, déclenchée par un défi (`src/data/challenges.ts`). Aucun champ, type ni défi ne mentionne quantité, vitesse ou type de boisson. |
| Aucune condition pour avancer liée aux verres | `nextHole` est toujours disponible (`src/app/hole.tsx`). Le groupe avance quand il le décide. |
| Aucune pénalité pour une pause (toilettes incluses) | `pause` / `resume` ne touchent pas aux scores. Texte sur l'écran du trou : « Pause, toilettes, verre fini ou pas : rien ne change le score. » |
| Personne ne surveille les verres | Aucun rôle, aucun écran, aucun défi de ce type. |
| Sans alcool à égalité, pas de valorisation de l'ivresse | Textes relus : « Chacun boit ce qu'il veut, avec ou sans alcool » (accueil), « L'eau et les boissons sans alcool comptent exactement comme les autres : pour rien » (Je m'arrête). |
| 18+ avec confirmation à l'ouverture | `AgeGate` dans `src/app/index.tsx`, état `ageConfirmed` persistant. |
| Aucune publicité, promo, partenariat ni marque d'alcool | Aucun contenu de ce type. Boutique : objets du jeu uniquement (`src/data/shop.ts`). |
| « Je m'arrête » toujours visible, eau, taxi/VTC, position à un ami | `SafetyBar` (`src/components/SafetyBar.tsx`) en pied de l'écran du trou et de la feuille de score, menant à `src/app/stop.tsx`. |

## Confidentialité et consentement

- Photos et géolocalisation **désactivées par défaut** (`privacy.photos`, `privacy.location`), activables en un appui, supprimables.
- Récap partagé : **avatars seuls, sans photo ni lieu exact par défaut** (`consent.names`, `consent.photos`, `consent.places` à `false`). Chaque bascule est explicite dans `src/app/scoreboard.tsx`.
- Aucun contenu partagé ne montre de verre ni de consommation : les cartes partagées ne contiennent que classement, avatars et titre de défi.
- Aucune importation de contacts, aucune relance automatique : invitation par lien ou QR uniquement.
- Compte facultatif : on rejoint avec un prénom.

## Lieux

- Aucun horaire inventé : `openStatus: 'unverified'` par défaut, affiché « À vérifier ». `'confirmed'` réservé à une source réelle.
- Un lieu fermé ou complet se remplace en deux gestes (bouton ⇄ puis choix) sans perdre le score (`replacePlace` ne touche pas aux `results`).

## Accessibilité de base

- Français natif, contrastes AA (crème sur rouge pub, crème sur vert scorecard, encre sur crème).
- Textes qui suivent la taille système (`allowFontScaling`, plafonné à 1,3 pour les très gros chiffres).
- Labels VoiceOver / TalkBack sur tous les contrôles (`accessibilityLabel`, `accessibilityRole`, `accessibilityState`).
- Cibles tactiles de 48 px minimum (`touch.min`), CTA à 60 px dans la zone du pouce.
- Aucune action réservée à un geste : la réorganisation du parcours a des boutons ↑ ↓, l'appui long pour retirer un joueur est doublé dans l'écran Hôte.
