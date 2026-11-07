# Brief d'origine

Source : prompt-bar-golf-club-2b7e2592.txt

Conçois une application mobile (iOS et Android) pour accompagner une soirée entre amis adultes de bar en bar, sur le thème du "golf de bar". Nom provisoire : "Bar Golf Club". Portrait, une main, très simple et très visuelle.

CIBLE ET TON
Adultes de 18 à 30 ans, qui vivent sur TikTok, Instagram et Snapchat. Le ton est contemporain, drôle et direct, jamais enfantin, jamais moralisateur. La qualité visuelle et les micro-interactions se comparent à celles des apps sociales actuelles. L'esprit : une soirée de bars entre amis, avec humour, compétition et défis. L'alcool fait partie du contexte de la soirée, mais l'appli ne le mesure, ne le chronomètre et ne le récompense jamais.

PRINCIPE
Le groupe choisit un parcours de 3 à 9 bars (cafés ou restaurants possibles pour une pause). Chaque lieu est un "trou" avec un drapeau rouge. Le groupe est réparti en équipes ou joue en individuel. À chaque trou, on réalise un défi qui rapporte des points, et la feuille de score se remplit. Le score vient uniquement des défis : photo, quiz, adresse, duo, trouver un objet, tenue de golfeur, gages drôles qui ne touchent jamais à la boisson. Chacun boit ce qu'il veut, avec ou sans alcool, et personne n'a besoin de boire pour jouer. Ce que chacun consomme ne change jamais ni son score, ni l'avancée du groupe.

RÈGLES DE CONCEPTION (obligatoires)
- Aucun score, temps, pénalité ou classement lié à la quantité, à la vitesse ou au type de boisson.
- Aucune condition pour avancer au lieu suivant liée aux verres (pas de "tous les verres vides"). Le groupe passe au trou suivant quand il le décide ou quand les défis sont faits.
- Aucune pénalité pour une pause, y compris toilettes. Rien ne pousse à "finir" un verre.
- Personne n'est désigné pour surveiller les verres des autres.
- Les boissons sans alcool sont présentées à égalité. Le texte ne valorise pas l'ivresse.
- Réservé aux 18 ans et plus : avertissement 18+ et confirmation de l'âge à l'ouverture. Aucune publicité, promotion, partenariat ni marque d'alcool dans l'appli, aucun contenu qui valorise l'ivresse. Les boissons sans alcool sont présentées à égalité. Bouton "Je m'arrête" toujours visible, rappel d'eau, bouton taxi/VTC, partage de position avec un ami de confiance.

DIRECTION VISUELLE
Reprendre l'univers de la vidéo : mannequins en bois low-poly aux grosses têtes rondes, façades en briques, néons, drapeau rouge, carte de score verte "PUB GOLF", tenues de golfeur (casquette plate, pull losange, putter, mini-drapeau). Palette : rouge pub profond, bois miel, vert scorecard, crème, un accent néon rose. Typographie arrondie, grasse, gros chiffres, peu de texte, une action principale par écran. Micro-animations douces, retours haptiques. Finition au niveau des meilleures apps grand public. Éviter tout rendu "généré par IA" : pas de cartes identiques empilées, pas de dégradés génériques, pas d'emojis en décor.

MVP (à concevoir en premier, 5 écrans)
1. Accueil : "Nouvelle sortie", reprendre, souvenirs.
2. Création : nombre de trous, équipes ou individuel, invitation par lien ou QR, avatar et tenue.
3. Parcours : carte avec les lieux et un drapeau par trou, ordre modifiable, ajout d'un lieu par recherche.
4. Trou en cours : le défi, bouton "Fait", photo, points.
5. Feuille de score partagée, classement des équipes, résumé de fin avec carte à partager.
Objectif de prototypage : créer une sortie de démo en 3 appuis. En vrai usage, le choix des lieux et des participants prend le temps qu'il faut et n'est jamais court-circuité.

PARTAGE SOCIAL (dans le MVP, avec consentement)
- Invitation par lien ou QR, partageable vers Instagram, Snapchat, WhatsApp, iMessage. Aucune importation automatique de contacts, aucune relance automatique.
- Récap visuel de fin de sortie (carte verticale 9:16, classement, moment fort) prêt pour Stories et TikTok. Chaque participant valide avant que son prénom, son avatar ou sa photo y apparaisse ; par défaut, avatars uniquement, sans photo ni lieu exact.
- Replay court de la sortie (diaporama animé de la feuille de score) à partager, créé seulement à la demande.
- Aucun contenu partagé ne montre de verre ni de consommation, ni de lieu précis sans accord.

FONDATIONS DU MVP (pas des options masquées)
- Accessibilité de base : français natif, contrastes AA, textes qui suivent la taille système, VoiceOver/TalkBack sur tous les écrans, cibles tactiles de 44 px minimum.
- Utilisable sans compte imposé : on rejoint par lien ou QR avec un simple prénom (âge de 18 ans confirmé). Le compte est facultatif, pour garder l'historique.
- Synchronisation claire : le groupe voit la même feuille de score en direct ; si le réseau tombe, un bandeau explique l'état et les actions se synchronisent au retour.
- Hôte : un organisateur peut corriger un score, annuler une action, retirer un participant ou passer la main à un autre. Tout participant peut quitter ou rejoindre en cours de sortie sans casser le classement.
- Mise en pause : le groupe peut mettre la sortie en pause, la quitter ou la reprendre plus tard.
- Erreurs : messages simples et actions claires (réessayer, continuer hors-ligne, annuler).
- Lieux : bars, jamais d'horaires inventés ; si l'ouverture n'est pas confirmée par la source, l'afficher comme "à vérifier". Un lieu fermé ou complet se remplace en deux gestes sans perdre le score.
- Confidentialité : photos et géolocalisation facultatives, désactivées par défaut, partage limité au groupe, suppression possible.

EXTENSIONS (hors MVP, masquées par défaut, activables dans les réglages)
Suggestions de lieux à proximité, défis personnalisés, album de souvenirs, badges et saisons, thèmes de pubs, mode un seul téléphone, mode hors-ligne complet, anglais, accessibilité renforcée (mode daltonisme, texte très grand, sous-titrage).

BOUTIQUE (facultative, hors du parcours, jamais nécessaire pour jouer)
Objets physiques liés au jeu : carte de score et crayon, mini-drapeaux, casquette plate, tote bag, cartes défis sans alcool, gourde. Fiches produit visuelles, panier simple, Apple Pay / Google Pay, suivi de commande. Aucune vente d'alcool, aucun avantage de score.

LIVRABLES
Parcours utilisateur, liste d'écrans, design system (couleurs, typo, composants), maquettes haute fidélité des écrans 1, 3, 4, 5 et de la boutique, architecture technique simple, plan en 3 étapes (MVP, extensions sociales, boutique).
