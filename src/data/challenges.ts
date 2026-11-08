// Défis : la seule source de points. Aucun ne touche à la boisson.
export type ChallengeKind = 'photo' | 'quiz' | 'adresse' | 'duo' | 'objet' | 'tenue' | 'gage';
export type GameMode = 'classique' | 'competition' | 'soft' | 'express';

export type Challenge = {
  id: string;
  kind: ChallengeKind;
  title: string;
  brief: string;
  points: 1 | 2 | 3;
  wantsPhoto?: boolean;
};

export const KIND_LABEL: Record<ChallengeKind, string> = {
  photo: 'Photo',
  quiz: 'Quiz',
  adresse: 'Adresse',
  duo: 'Duo',
  objet: 'Objet',
  tenue: 'Tenue',
  gage: 'Gage',
};

export const MODES: { id: GameMode; name: string; tagline: string; detail: string }[] = [
  { id: 'classique', name: 'Classique', tagline: 'Le mode par défaut', detail: 'Les défis du club, en équipes ou en individuel. 3 à 9 trous.' },
  { id: 'competition', name: 'Compétition', tagline: 'Défis plus exigeants', detail: 'Mêmes règles de score, podium et veste verte pour le vainqueur.' },
  { id: 'soft', name: 'Soft', tagline: 'Défis calmes', detail: 'Observation, conversation, photo posée. Rien ne presse.' },
  { id: 'express', name: 'Express', tagline: '3 trous', detail: 'Durée indicative d’une heure environ, jamais garantie.' },
];

export const CLASSIQUE: Challenge[] = [
  { id: 'c1', kind: 'photo', title: 'Le swing parfait', brief: 'Toute l’équipe fige un swing de golf au ralenti devant la façade. Photo ou rien.', points: 2, wantsPhoto: true },
  { id: 'c2', kind: 'quiz', title: 'Quiz express', brief: 'Trois questions culture pop posées par l’équipe adverse. Deux bonnes réponses minimum.', points: 2 },
  { id: 'c3', kind: 'adresse', title: 'Le putt du sous-bock', brief: 'Faire glisser un sous-bock sur la table pour qu’il s’arrête à moins d’un doigt du bord. Trois essais.', points: 3 },
  { id: 'c4', kind: 'duo', title: 'Refrain à deux', brief: 'Deux membres chantent un refrain en duo. Les autres tables doivent reconnaître la chanson.', points: 2 },
  { id: 'c5', kind: 'objet', title: 'Chasse au vert', brief: 'Trouver dans le lieu un objet vert qui n’est pas à vous. Le montrer, puis le reposer gentiment.', points: 1 },
  { id: 'c6', kind: 'tenue', title: 'Dress code golfeur', brief: 'La tenue la plus golf de la table gagne : casquette plate, losanges, chaussettes hautes. Vote à main levée.', points: 2 },
  { id: 'c7', kind: 'gage', title: 'Commentateur officiel', brief: 'Commenter en chuchotant, façon tournoi de golf, l’entrée du prochain inconnu dans le bar.', points: 1 },
  { id: 'c8', kind: 'photo', title: 'Trophée improvisé', brief: 'Fabriquer un trophée avec ce qu’il y a sur la table (pas de verre) et poser avec, très sérieux.', points: 2, wantsPhoto: true },
  { id: 'c9', kind: 'adresse', title: 'Tour de pièce', brief: 'Faire tenir une pièce en équilibre sur sa tranche pendant cinq secondes. Chaque membre essaie.', points: 3 },
  { id: 'c10', kind: 'gage', title: 'Caddie d’honneur', brief: 'Porter le sac de quelqu’un d’une autre équipe jusqu’au prochain trou, avec classe.', points: 1 },
  { id: 'c11', kind: 'quiz', title: 'Devine le lieu', brief: 'Décrire le prochain bar sans dire son nom ni sa rue. L’équipe doit le deviner en trois indices.', points: 2 },
  { id: 'c12', kind: 'duo', title: 'Miroir', brief: 'Deux membres se font face et reproduisent les gestes de l’autre pendant trente secondes sans rire.', points: 2 },
];

export const COMPETITION: Challenge[] = [
  { id: 'k1', kind: 'adresse', title: 'Trois putts sur trois', brief: 'Trois sous-bocks glissés d’affilée, les trois s’arrêtent à moins de deux doigts du bord. Un raté et c’est zéro.', points: 3 },
  { id: 'k2', kind: 'quiz', title: 'Quiz en cinq', brief: 'Cinq questions de l’équipe adverse, thème libre. Quatre bonnes réponses minimum, pas de téléphone.', points: 3 },
  { id: 'k3', kind: 'photo', title: 'Podium humain', brief: 'Reproduire un podium à trois niveaux avec les membres de l’équipe. Tenir cinq secondes pour la photo.', points: 2, wantsPhoto: true },
  { id: 'k4', kind: 'duo', title: 'Duo sans paroles', brief: 'Faire deviner le titre d’un film à son équipe uniquement par mime, en moins de quarante secondes.', points: 2 },
  { id: 'k5', kind: 'objet', title: 'Les trois verts', brief: 'Trouver trois objets verts différents dans le lieu, sans toucher à la vaisselle. Les montrer, les reposer.', points: 2 },
  { id: 'k6', kind: 'tenue', title: 'Transformation', brief: 'Composer en deux minutes la tenue la plus golf possible avec ce que l’équipe porte déjà. Vote des adversaires.', points: 2 },
  { id: 'k7', kind: 'gage', title: 'Discours du vainqueur', brief: 'Improviser trente secondes de discours de remise de veste verte, sans rire, devant la table.', points: 1 },
  { id: 'k8', kind: 'adresse', title: 'Tour de pièce, version pro', brief: 'Une pièce en équilibre sur sa tranche, dix secondes, du premier coup. Un seul essai par membre.', points: 3 },
  { id: 'k9', kind: 'quiz', title: 'Le parcours à l’envers', brief: 'Réciter dans l’ordre inverse tous les lieux déjà joués, avec le nom du défi de chacun.', points: 2 },
];

export const SOFT: Challenge[] = [
  { id: 's1', kind: 'photo', title: 'La photo posée', brief: 'Une photo de groupe très calme, comme un portrait de club du siècle dernier. Personne ne sourit.', points: 2, wantsPhoto: true },
  { id: 's2', kind: 'duo', title: 'Compliment croisé', brief: 'Chaque membre fait un compliment sincère à quelqu’un d’une autre équipe. Précis, pas générique.', points: 1 },
  { id: 's3', kind: 'objet', title: 'Détail caché', brief: 'Trouver un détail de la décoration que personne n’a remarqué. Le décrire sans le montrer, l’équipe adverse doit le repérer.', points: 2 },
  { id: 's4', kind: 'quiz', title: 'La question de la soirée', brief: 'Poser une question ouverte à toute la table. La meilleure réponse, votée, rapporte le point à son auteur.', points: 1 },
  { id: 's5', kind: 'tenue', title: 'Échange d’accessoire', brief: 'Deux équipes échangent un accessoire (casquette, écharpe, lunettes) jusqu’au prochain trou.', points: 1 },
  { id: 's6', kind: 'gage', title: 'Carte postale', brief: 'Écrire en trois phrases la carte postale de ce lieu, la lire à voix basse à la table.', points: 2 },
  { id: 's7', kind: 'adresse', title: 'Pile de sous-bocks', brief: 'Empiler le plus de sous-bocks possible en trente secondes, sans qu’elle tombe. Six ou plus : réussi.', points: 2 },
  { id: 's8', kind: 'photo', title: 'Reflet', brief: 'Photographier l’équipe dans un reflet (vitre, miroir, cuillère). Photo ou rien.', points: 2, wantsPhoto: true },
];

export function challengesForMode(mode: GameMode): Challenge[] {
  if (mode === 'competition') return COMPETITION;
  if (mode === 'soft') return SOFT;
  return CLASSIQUE;
}

export function pickChallenges(mode: GameMode, count: number, seed = 7): Challenge[] {
  const pool = [...challengesForMode(mode)];
  const out: Challenge[] = [];
  let s = seed;
  while (out.length < count && pool.length) {
    s = (s * 9301 + 49297) % 233280;
    out.push(pool.splice(s % pool.length, 1)[0]);
  }
  return out;
}

export const pointsLabel = (n: number) => `${n} point${n > 1 ? 's' : ''}`;
