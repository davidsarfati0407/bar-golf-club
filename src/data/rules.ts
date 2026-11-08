// Moteur de score : un seul modèle, appliqué partout.
// Points de défis : le plus grand total gagne.

export const RULES = {
  model: 'Points de défis : le plus grand total gagne.',
  items: [
    { title: 'Un trou, un défi', text: 'Chaque lieu vaut un défi, noté 1, 2 ou 3 points selon sa difficulté. Chaque équipe (ou joueur) qui réussit le défi marque les points du trou. Plusieurs équipes peuvent marquer sur le même trou.' },
    { title: 'Victoire', text: 'À la fin du parcours, le plus grand total de points gagne. En Compétition, le vainqueur reçoit la veste verte.' },
    { title: 'Égalité', text: 'À total égal, l’équipe qui a réussi le plus de défis passe devant. Si c’est encore égal, les équipes sont ex aequo et partagent la place.' },
    { title: 'Arrivée en cours de route', text: 'On rejoint à tout moment avec un prénom. Les trous déjà joués comptent 0 pour le nouvel arrivant, sans pénalité pour personne.' },
    { title: 'Départ ou pause', text: 'Quitter la soirée, faire une pause ou aller aux toilettes n’enlève aucun point. Les points marqués restent sur la feuille. On peut revenir à tout moment.' },
    { title: 'Trou annulé', text: 'Si un lieu est fermé ou que le défi est impossible, l’hôte annule le trou : ses points sont retirés pour tout le monde et le trou ne compte pas. L’hôte peut aussi le rétablir.' },
    { title: 'Jamais les verres', text: 'Rien de ce que vous buvez ne compte : ni la quantité, ni la vitesse, ni le type. L’eau et les boissons sans alcool sont exactement à égalité avec le reste.' },
  ],
  example: {
    title: 'Exemple : le trou 3 vaut 2 points',
    lines: [
      'Défi « Refrain à deux » : chanter un refrain en duo.',
      'Les Casquettes réussissent : +2 points.',
      'Les Losanges réussissent aussi : +2 points.',
      'Les Putters renoncent : 0 point, aucune pénalité.',
      'Avant ce trou : Casquettes 3, Losanges 1, Putters 4.',
      'Après ce trou : Casquettes 5, Losanges 3, Putters 4.',
    ],
  },
};

export const ONBOARDING = [
  { title: 'Un parcours de bars', text: 'Le groupe choisit 3 à 9 lieux. Chaque lieu est un trou, avec son drapeau.' },
  { title: 'Un défi par trou', text: 'Photo, quiz, adresse, duo… Réussir le défi rapporte les points du trou. Rien d’autre ne compte.' },
  { title: 'Chacun boit ce qu’il veut', text: 'Avec ou sans alcool, ça ne change jamais le score. « Je m’arrête », eau et taxi restent toujours à portée de pouce.' },
];

export const JOIN_PRINCIPLES = [
  'Les points viennent uniquement des défis, jamais des verres.',
  'Tu rejoins avec un prénom, sans compte. Tu peux partir quand tu veux, tes points restent.',
  'Rien n’est partagé (photo, position, prénom) sans ton accord.',
];
