import type { Challenge, GameMode } from '@/data/challenges';
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
  status: 'active' | 'left';
  joinedAtHole: number;
  reelOptIn: boolean;
};

export type Team = { id: string; name: string; color: string };

export type HoleResult = { scorerId: string; points: number; at: number };

export type Hole = {
  id: string;
  place: Place;
  challenge: Challenge;
  done: boolean;
  cancelled: boolean;
  results: HoleResult[];
  photoUri?: string;
};

export type Consent = { names: boolean; photos: boolean; places: boolean };

export type Outing = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  status: OutingStatus;
  mode: Mode;
  gameMode: GameMode;
  players: Player[];
  teams: Team[];
  holes: Hole[];
  currentHole: number;
  hostId: string;
  consent: Consent;
  privacy: { photos: boolean; location: boolean };
  joinCode: string;
  waterReminderAt?: number;
};

export type Memory = {
  id: string;
  title: string;
  date: number;
  holes: number;
  winner: string;
  winnerPoints: number;
  gameMode: GameMode;
  standings: { name: string; points: number }[];
};

export type State = {
  ageConfirmed: boolean;
  onboardingSeen: boolean;
  outing: Outing | null;
  meId: string | null;
  memories: Memory[];
  pendingSync: number;
  hydrated: boolean;
};
