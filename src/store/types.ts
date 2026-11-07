import type { Challenge } from '@/data/challenges';
import type { Place } from '@/data/places';

export type Mode = 'teams' | 'solo';
export type Outfit = 'cap' | 'argyle' | 'putter' | 'flag';
export type OutingStatus = 'draft' | 'live' | 'paused' | 'finished';

export type Player = {
  id: string;
  name: string;
  outfit: Outfit;
  teamId?: string;
  isHost?: boolean;
};

export type Team = { id: string; name: string; color: string };

export type HoleResult = { scorerId: string; points: number; at: number };

export type Hole = {
  id: string;
  place: Place;
  challenge: Challenge;
  done: boolean;
  results: HoleResult[];
  photoUri?: string;
};

export type Consent = { names: boolean; photos: boolean; places: boolean };

export type Outing = {
  id: string;
  title: string;
  createdAt: number;
  status: OutingStatus;
  mode: Mode;
  players: Player[];
  teams: Team[];
  holes: Hole[];
  currentHole: number;
  hostId: string;
  consent: Consent;
  privacy: { photos: boolean; location: boolean };
  joinCode: string;
};

export type Memory = {
  id: string;
  title: string;
  date: number;
  holes: number;
  winner: string;
  teams: string[];
};

export type State = {
  ageConfirmed: boolean;
  outing: Outing | null;
  memories: Memory[];
  pendingSync: number;
  hydrated: boolean;
};
