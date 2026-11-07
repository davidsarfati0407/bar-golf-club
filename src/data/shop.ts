// Boutique : objets physiques liés au jeu. Aucune vente d'alcool, aucun avantage de score.
export type Product = {
  id: string;
  name: string;
  price: number; // euros
  tagline: string;
  tone: 'green' | 'red' | 'honey' | 'cream' | 'pink';
};

export const PRODUCTS: Product[] = [
  { id: 's1', name: 'Carte de score + crayon', price: 9, tagline: 'La vraie, verte, à plier dans la poche.', tone: 'green' },
  { id: 's2', name: 'Mini-drapeaux ×9', price: 14, tagline: 'Un drapeau rouge par trou, à planter sur la table.', tone: 'red' },
  { id: 's3', name: 'Casquette plate', price: 29, tagline: 'Le dress code officiel du club.', tone: 'honey' },
  { id: 's4', name: 'Tote bag Club', price: 19, tagline: 'Pour le caddie d’honneur.', tone: 'cream' },
  { id: 's5', name: 'Cartes défis', price: 12, tagline: '52 défis sans alcool, à tirer au sort.', tone: 'pink' },
  { id: 's6', name: 'Gourde 19e trou', price: 22, tagline: 'De l’eau entre chaque trou. Toujours.', tone: 'green' },
];
