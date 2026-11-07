import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { pickChallenges } from '@/data/challenges';
import { PLACES, type Place } from '@/data/places';
import type { Hole, Mode, Outfit, Outing, Player, State, Team } from './types';

const STORAGE_KEY = 'bgc.state.v1';

const TEAM_PRESETS: Team[] = [
  { id: 't1', name: 'Les Casquettes', color: '#E0352B' },
  { id: 't2', name: 'Les Losanges', color: '#3B8BD6' },
  { id: 't3', name: 'Les Putters', color: '#FF4FA3' },
  { id: 't4', name: 'Les Drapeaux', color: '#C8893A' },
];

const uid = () => Math.random().toString(36).slice(2, 9);
const code = () => Math.random().toString(36).slice(2, 6).toUpperCase();

type Action =
  | { type: 'hydrate'; state: Partial<State> }
  | { type: 'confirmAge' }
  | { type: 'newDraft'; hostName: string }
  | { type: 'demo' }
  | { type: 'setHoleCount'; count: number }
  | { type: 'setMode'; mode: Mode }
  | { type: 'addPlayer'; name: string; outfit: Outfit }
  | { type: 'removePlayer'; id: string }
  | { type: 'setOutfit'; id: string; outfit: Outfit }
  | { type: 'makeHost'; id: string }
  | { type: 'moveHole'; from: number; to: number }
  | { type: 'replacePlace'; index: number; place: Place }
  | { type: 'addPlace'; place: Place }
  | { type: 'removeHole'; index: number }
  | { type: 'start' }
  | { type: 'score'; scorerId: string; points: number }
  | { type: 'undoScore' }
  | { type: 'correctScore'; holeIndex: number; scorerId: string; points: number }
  | { type: 'setPhoto'; uri?: string }
  | { type: 'holeDone' }
  | { type: 'nextHole' }
  | { type: 'pause' }
  | { type: 'resume' }
  | { type: 'finish' }
  | { type: 'quit' }
  | { type: 'setConsent'; key: 'names' | 'photos' | 'places'; value: boolean }
  | { type: 'setPrivacy'; key: 'photos' | 'location'; value: boolean }
  | { type: 'syncQueued' }
  | { type: 'syncFlushed' };

const initial: State = { ageConfirmed: false, outing: null, memories: [], pendingSync: 0, hydrated: false };

function buildHoles(places: Place[]): Hole[] {
  const challenges = pickChallenges(places.length, places.length * 3 + 1);
  return places.map((place, i) => ({ id: uid(), place, challenge: challenges[i], done: false, results: [] }));
}

function assignTeams(players: Player[], mode: Mode): { players: Player[]; teams: Team[] } {
  if (mode === 'solo') return { players: players.map((p) => ({ ...p, teamId: undefined })), teams: [] };
  const teamCount = Math.min(4, Math.max(2, Math.ceil(players.length / 2)));
  const teams = TEAM_PRESETS.slice(0, teamCount);
  return { players: players.map((p, i) => ({ ...p, teamId: teams[i % teamCount].id })), teams };
}

function blankOuting(hostName: string): Outing {
  const host: Player = { id: uid(), name: hostName, outfit: 'cap', isHost: true };
  const { players, teams } = assignTeams([host], 'teams');
  return {
    id: uid(),
    title: 'Sortie du ' + new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }),
    createdAt: Date.now(),
    status: 'draft',
    mode: 'teams',
    players,
    teams,
    holes: buildHoles(PLACES.slice(0, 5)),
    currentHole: 0,
    hostId: host.id,
    consent: { names: false, photos: false, places: false },
    privacy: { photos: false, location: false },
    joinCode: code(),
  };
}

function demoOuting(): Outing {
  const base = blankOuting('Toi');
  const names: [string, Outfit][] = [['Lina', 'argyle'], ['Mehdi', 'putter'], ['Jade', 'flag'], ['Tom', 'cap'], ['Sofia', 'argyle']];
  const extra = names.map(([name, outfit]) => ({ id: uid(), name, outfit }));
  const { players, teams } = assignTeams([...base.players, ...extra], 'teams');
  return { ...base, title: 'Démo · Tournée de l’Est', players, teams, holes: buildHoles(PLACES.slice(0, 6)) };
}

function withOuting(state: State, fn: (o: Outing) => Outing): State {
  if (!state.outing) return state;
  return { ...state, outing: fn(state.outing), pendingSync: state.pendingSync };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'hydrate':
      return { ...state, ...action.state, hydrated: true };
    case 'confirmAge':
      return { ...state, ageConfirmed: true };
    case 'newDraft':
      return { ...state, outing: blankOuting(action.hostName) };
    case 'demo':
      return { ...state, outing: demoOuting() };
    case 'setHoleCount':
      return withOuting(state, (o) => {
        const count = Math.min(9, Math.max(3, action.count));
        if (count === o.holes.length) return o;
        if (count < o.holes.length) return { ...o, holes: o.holes.slice(0, count) };
        const used = new Set(o.holes.map((h) => h.place.id));
        const pool = PLACES.filter((p) => !used.has(p.id));
        const added = buildHoles(pool.slice(0, count - o.holes.length));
        return { ...o, holes: [...o.holes, ...added] };
      });
    case 'setMode':
      return withOuting(state, (o) => ({ ...o, mode: action.mode, ...assignTeams(o.players, action.mode) }));
    case 'addPlayer':
      return withOuting(state, (o) => {
        const p: Player = { id: uid(), name: action.name.trim() || 'Invité', outfit: action.outfit };
        return { ...o, ...assignTeams([...o.players, p], o.mode) };
      });
    case 'removePlayer':
      return withOuting(state, (o) => {
        if (action.id === o.hostId) return o;
        return { ...o, ...assignTeams(o.players.filter((p) => p.id !== action.id), o.mode) };
      });
    case 'setOutfit':
      return withOuting(state, (o) => ({ ...o, players: o.players.map((p) => (p.id === action.id ? { ...p, outfit: action.outfit } : p)) }));
    case 'makeHost':
      return withOuting(state, (o) => ({ ...o, hostId: action.id, players: o.players.map((p) => ({ ...p, isHost: p.id === action.id })) }));
    case 'moveHole':
      return withOuting(state, (o) => {
        const holes = [...o.holes];
        const [h] = holes.splice(action.from, 1);
        holes.splice(action.to, 0, h);
        return { ...o, holes };
      });
    case 'replacePlace':
      // Un lieu fermé ou complet se remplace en deux gestes sans perdre le score.
      return withOuting(state, (o) => ({ ...o, holes: o.holes.map((h, i) => (i === action.index ? { ...h, place: action.place } : h)) }));
    case 'addPlace':
      return withOuting(state, (o) => (o.holes.length >= 9 ? o : { ...o, holes: [...o.holes, ...buildHoles([action.place])] }));
    case 'removeHole':
      return withOuting(state, (o) => (o.holes.length <= 3 ? o : { ...o, holes: o.holes.filter((_, i) => i !== action.index) }));
    case 'start':
      return withOuting(state, (o) => ({ ...o, status: 'live', currentHole: 0 }));
    case 'score':
      return {
        ...withOuting(state, (o) => ({
          ...o,
          holes: o.holes.map((h, i) =>
            i === o.currentHole ? { ...h, results: [...h.results, { scorerId: action.scorerId, points: action.points, at: Date.now() }] } : h,
          ),
        })),
        pendingSync: state.pendingSync + 1,
      };
    case 'undoScore':
      return withOuting(state, (o) => ({
        ...o,
        holes: o.holes.map((h, i) => (i === o.currentHole ? { ...h, results: h.results.slice(0, -1) } : h)),
      }));
    case 'correctScore':
      return withOuting(state, (o) => ({
        ...o,
        holes: o.holes.map((h, i) =>
          i === action.holeIndex
            ? { ...h, results: [...h.results.filter((r) => r.scorerId !== action.scorerId), { scorerId: action.scorerId, points: action.points, at: Date.now() }] }
            : h,
        ),
      }));
    case 'setPhoto':
      return withOuting(state, (o) => ({ ...o, holes: o.holes.map((h, i) => (i === o.currentHole ? { ...h, photoUri: action.uri } : h)) }));
    case 'holeDone':
      return withOuting(state, (o) => ({ ...o, holes: o.holes.map((h, i) => (i === o.currentHole ? { ...h, done: true } : h)) }));
    case 'nextHole':
      // Le groupe passe au trou suivant quand il le décide. Aucune condition liée aux verres.
      return withOuting(state, (o) => (o.currentHole + 1 >= o.holes.length ? { ...o, status: 'finished' } : { ...o, currentHole: o.currentHole + 1 }));
    case 'pause':
      return withOuting(state, (o) => ({ ...o, status: 'paused' }));
    case 'resume':
      return withOuting(state, (o) => ({ ...o, status: 'live' }));
    case 'finish': {
      if (!state.outing) return state;
      const o = { ...state.outing, status: 'finished' as const };
      return { ...state, outing: o };
    }
    case 'quit': {
      if (!state.outing) return state;
      const o = state.outing;
      const standings = computeStandings(o);
      const memory = {
        id: o.id,
        title: o.title,
        date: o.createdAt,
        holes: o.holes.filter((h) => h.done).length,
        winner: standings[0]?.name ?? '—',
        teams: standings.map((s) => s.name),
      };
      const memories = o.holes.some((h) => h.done) ? [memory, ...state.memories.filter((m) => m.id !== o.id)].slice(0, 12) : state.memories;
      return { ...state, outing: null, memories };
    }
    case 'setConsent':
      return withOuting(state, (o) => ({ ...o, consent: { ...o.consent, [action.key]: action.value } }));
    case 'setPrivacy':
      return withOuting(state, (o) => ({ ...o, privacy: { ...o.privacy, [action.key]: action.value } }));
    case 'syncQueued':
      return { ...state, pendingSync: state.pendingSync + 1 };
    case 'syncFlushed':
      return { ...state, pendingSync: 0 };
    default:
      return state;
  }
}

export type Standing = { id: string; name: string; color: string; points: number; outfit?: Outfit; members: Player[] };

export function computeStandings(o: Outing): Standing[] {
  const totals = new Map<string, number>();
  for (const h of o.holes) for (const r of h.results) totals.set(r.scorerId, (totals.get(r.scorerId) ?? 0) + r.points);
  const rows: Standing[] =
    o.mode === 'teams'
      ? o.teams.map((t) => ({ id: t.id, name: t.name, color: t.color, points: totals.get(t.id) ?? 0, members: o.players.filter((p) => p.teamId === t.id) }))
      : o.players.map((p, i) => ({ id: p.id, name: p.name, color: TEAM_PRESETS[i % TEAM_PRESETS.length].color, points: totals.get(p.id) ?? 0, outfit: p.outfit, members: [p] }));
  return rows.sort((a, b) => b.points - a.points);
}

export function scorersOf(o: Outing): Standing[] {
  return computeStandings(o).sort((a, b) => a.name.localeCompare(b.name));
}

const Ctx = createContext<{ state: State; dispatch: React.Dispatch<Action> } | null>(null);

export function OutingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => dispatch({ type: 'hydrate', state: raw ? (JSON.parse(raw) as Partial<State>) : {} }))
      .catch(() => dispatch({ type: 'hydrate', state: {} }));
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    const { hydrated: _h, pendingSync: _p, ...persist } = state;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(persist)).catch(() => {});
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useOuting() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useOuting must be used within OutingProvider');
  return ctx;
}
