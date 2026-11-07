// Lieux : jamais d'horaires inventés. Sans confirmation par la source, le statut est « à vérifier ».
export type PlaceKind = 'bar' | 'cafe' | 'resto';
export type OpenStatus = 'confirmed' | 'unverified';

export type Place = {
  id: string;
  name: string;
  kind: PlaceKind;
  area: string;
  openStatus: OpenStatus;
  // Position relative (0..1) sur la carte stylisée du parcours.
  x: number;
  y: number;
};

export const KIND_LABEL: Record<PlaceKind, string> = { bar: 'Bar', cafe: 'Café', resto: 'Restaurant' };

export const PLACES: Place[] = [
  { id: 'p1', name: 'Le Brick Lane', kind: 'bar', area: 'Oberkampf', openStatus: 'unverified', x: 0.18, y: 0.14 },
  { id: 'p2', name: 'Chez Marcel', kind: 'bar', area: 'Ménilmontant', openStatus: 'unverified', x: 0.62, y: 0.22 },
  { id: 'p3', name: 'La Pause Crème', kind: 'cafe', area: 'Belleville', openStatus: 'unverified', x: 0.82, y: 0.42 },
  { id: 'p4', name: 'Néon Social', kind: 'bar', area: 'Jourdain', openStatus: 'unverified', x: 0.5, y: 0.55 },
  { id: 'p5', name: 'Le 19e Trou', kind: 'bar', area: 'Pyrénées', openStatus: 'unverified', x: 0.2, y: 0.68 },
  { id: 'p6', name: 'Cantine Fairway', kind: 'resto', area: 'Gambetta', openStatus: 'unverified', x: 0.55, y: 0.86 },
  { id: 'p7', name: 'Le Comptoir Losange', kind: 'bar', area: 'Bastille', openStatus: 'unverified', x: 0.86, y: 0.78 },
  { id: 'p8', name: 'Bunker Club', kind: 'bar', area: 'Charonne', openStatus: 'unverified', x: 0.35, y: 0.36 },
  { id: 'p9', name: 'Putt & Pita', kind: 'resto', area: 'Nation', openStatus: 'unverified', x: 0.72, y: 0.62 },
];

export const SEARCHABLE_PLACES: Place[] = [
  ...PLACES,
  { id: 'p10', name: 'La Casquette Plate', kind: 'bar', area: 'Voltaire', openStatus: 'unverified', x: 0.3, y: 0.9 },
  { id: 'p11', name: 'Green Room', kind: 'bar', area: 'Parmentier', openStatus: 'unverified', x: 0.1, y: 0.45 },
  { id: 'p12', name: 'Café du Drapeau', kind: 'cafe', area: 'Saint-Maur', openStatus: 'unverified', x: 0.9, y: 0.12 },
];
