// Défis : la seule source de points. Aucun ne touche à la boisson.
export type ChallengeKind = 'photo' | 'quiz' | 'adresse' | 'duo' | 'objet' | 'tenue' | 'gage';

export type Challenge = {
  id: string;
  kind: ChallengeKind;
  title: string;
  brief: string;
  points: number; // Par = 1, Birdie = 2, Eagle = 3
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

export const SCORE_WORD: Record<number, string> = { 1: 'Par', 2: 'Birdie', 3: 'Eagle' };

export const CHALLENGES: Challenge[] = [
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

export function pickChallenges(count: number, seed = 7): Challenge[] {
  const pool = [...CHALLENGES];
  const out: Challenge[] = [];
  let s = seed;
  while (out.length < count && pool.length) {
    s = (s * 9301 + 49297) % 233280;
    out.push(pool.splice(s % pool.length, 1)[0]);
  }
  return out;
}
