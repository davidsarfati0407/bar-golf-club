import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { pickChallenges, type GameMode } from '@/data/challenges';
import { PLACES, type Place } from '@/data/places';
import { readRoom, subscribeRoom, writeRoom } from '@/sync/localRoom';
import { colors } from '@/theme/tokens';
import type { Hole, Memory, Mode, Outfit, Outing, Player, State, Team } from './types';

const STORAGE_KEY = 'bgc.state.v2';

// Équipes nommées d'après les tenues.
const TEAM_PRESETS: Team[] = [
  { id: 't1', name: 'Les Casquettes', color: colors.teamRed },
  { id: 't2', name: 'Les Losanges', color: colors.teamBlue },
  { id: 't3', name: 'Les Putters', color: colors.teamRose },
  { id: 't4', name: 'Les Drapeaux', color: colors.teamGold },
];

const uid = () => Math.random().toString(36).slice(2, 9);
const code = () => Math.random().toString(36).slice(2, 6).toUpperCase().replace(/[01OI]/g, 'X');

export type Action =
  | { type: 'hydrate'; state: Partial<State> }
  | { type: 'confirmAge' }
  | { type: 'onboardingSeen' }
  | { type: 'newDraft'; hostName: string }
  | { type: 'demo' }
  | { type: 'setHoleCount'; count: number }
  | { type: 'setMode'; mode: Mode }
  | { type: 'setGameMode'; gameMode: GameMode }
  | { type: 'addPlayer'; name: string; outfit: Outfit }
  | { type: 'removePlayer'; id: string }
  | { type: 'setOutfit'; id: string; outfit: Outfit }
  | { type: 'setReelOptIn'; id: string; value: boolean }
  | { type: 'makeHost'; id: string }
  | { type: 'moveHole'; from: number; to: number }
  | { type: 'replacePlace'; index: number; place: Place }
  | { type: 'addPlace'; place: Place }
  | { type: 'removeHole'; index: number }
  | { type: 'start' }
  | { type: 'score'; scorerId: string; points: number }
  | { type: 'undoScore' }
  | { type: 'correctScore'; holeIndex: number; scorerId: string; points: number }
  | { type: 'cancelHole'; index: number }
  | { type: 'restoreHole'; index: number }
  | { type: 'setPhoto'; uri?: string }
  | { type: 'holeDone' }
  | { type: 'nextHole' }
  | { type: 'pause' }
  | { type: 'resume' }
  | { type: 'finish' }
  | { type: 'leave'; id: string }
  | { type: 'rejoin'; id: string }
  | { type: 'archive' }
  | { type: 'discard' }
  | { type: 'setConsent'; key: 'names' | 'photos' | 'places'; value: boolean }
  | { type: 'setPrivacy'; key: 'photos' | 'location'; value: boolean }
  | { type: 'waterReminder' }
  | { type: 'joinRoom'; outing: Outing; meId: string }
  | { type: 'remoteOuting'; outing: Outing }
  | { type: 'syncFlushed' };

const initial: State = { ageConfirmed: false, onboardingSeen: false, outing: null, meId: null, memories: [], pendingSync: 0, hydrated: false };

function buildHoles(mode: GameMode, places: Place[], seed = places.length * 3 + 1): Hole[] {
  const challenges = pickChallenges(mode, places.length, seed);
  return places.map((place, i) => ({ id: uid(), place, challenge: challenges[i % challenges.length], done: false, cancelled: false, results: [] }));
}

function assignTeams(players: Player[], mode: Mode): { players: Player[]; teams: Team[] } {
  if (mode === 'solo') return { players: players.map((p) => ({ ...p, teamId: undefined })), teams: [] };
  const teamCount = Math.min(4, Math.max(2, Math.ceil(players.length / 2)));
  const teams = TEAM_PRESETS.slice(0, teamCount);
  return { players: players.map((p, i) => ({ ...p, teamId: teams[i % teamCount].id })), teams };
}

function newPlayer(name: string, outfit: Outfit, extra: Partial<Player> = {}): Player {
  return { id: uid(), name: name.trim() || 'Invité', outfit, status: 'active', joinedAtHole: 0, reelOptIn: false, ...extra };
}

function blankOuting(hostName: string): Outing {
  const host = newPlayer(hostName, 'cap', { isHost: true });
  const { players, teams } = assignTeams([host], 'teams');
  const now = Date.now();
  return {
    id: uid(),
    title: 'Sortie du ' + new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }),
    createdAt: now,
    updatedAt: now,
    status: 'draft',
    mode: 'teams',
    gameMode: 'classique',
    players,
    teams,
    holes: buildHoles('classique', PLACES.slice(0, 5)),
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
  const extra = names.map(([name, outfit]) => newPlayer(name, outfit));
  const { players, teams } = assignTeams([...base.players, ...extra], 'teams');
  return { ...base, title: 'Démo · Tournée de l’Est', players, teams, holes: buildHoles('classique', PLACES.slice(0, 5)) };
}

function touch(o: Outing): Outing {
  return { ...o, updatedAt: Date.now() };
}

function withOuting(state: State, fn: (o: Outing) => Outing): State {
  if (!state.outing) return state;
  const next = fn(state.outing);
  if (next === state.outing) return state;
  return { ...state, outing: touch(next) };
}

function toMemory(o: Outing): Memory | null {
  const played = o.holes.filter((h) => h.done && !h.cancelled);
  if (played.length === 0) return null;
  const standings = computeStandings(o);
  return {
    id: o.id,
    title: o.title,
    date: o.createdAt,
    holes: played.length,
    winner: standings[0]?.name ?? '—',
    winnerPoints: standings[0]?.points ?? 0,
    gameMode: o.gameMode,
    standings: standings.map((s) => ({ name: s.name, points: s.points })),
  };
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'hydrate':
      return { ...state, ...action.state, hydrated: true, pendingSync: 0 };
    case 'confirmAge':
      return { ...state, ageConfirmed: true };
    case 'onboardingSeen':
      return { ...state, onboardingSeen: true };
    case 'newDraft': {
      const o = blankOuting(action.hostName);
      return { ...state, outing: o, meId: o.hostId };
    }
    case 'demo': {
      const o = demoOuting();
      return { ...state, outing: o, meId: o.hostId };
    }
    case 'setHoleCount':
      return withOuting(state, (o) => {
        const count = Math.min(9, Math.max(3, action.count));
        if (count === o.holes.length) return o;
        if (count < o.holes.length) return { ...o, holes: o.holes.slice(0, count) };
        const used = new Set(o.holes.map((h) => h.place.id));
        const pool = PLACES.filter((p) => !used.has(p.id));
        return { ...o, holes: [...o.holes, ...buildHoles(o.gameMode, pool.slice(0, count - o.holes.length), count * 7)] };
      });
    case 'setMode':
      return withOuting(state, (o) => ({ ...o, mode: action.mode, ...assignTeams(o.players, action.mode) }));
    case 'setGameMode':
      return withOuting(state, (o) => {
        // Le mode change le set de défis et l'habillage, jamais les règles de sécurité ni les formats.
        const places = action.gameMode === 'express' ? o.holes.slice(0, 3).map((h) => h.place) : o.holes.map((h) => h.place);
        const holes = buildHoles(action.gameMode, places).map((h, i) => ({ ...h, id: o.holes[i]?.id ?? h.id }));
        return { ...o, gameMode: action.gameMode, holes };
      });
    case 'addPlayer':
      return withOuting(state, (o) => ({ ...o, ...assignTeams([...o.players, newPlayer(action.name, action.outfit, { joinedAtHole: o.status === 'draft' ? 0 : o.currentHole })], o.mode) }));
    case 'removePlayer':
      return withOuting(state, (o) => (action.id === o.hostId ? o : { ...o, ...assignTeams(o.players.filter((p) => p.id !== action.id), o.mode) }));
    case 'setOutfit':
      return withOuting(state, (o) => ({ ...o, players: o.players.map((p) => (p.id === action.id ? { ...p, outfit: action.outfit } : p)) }));
    case 'setReelOptIn':
      return withOuting(state, (o) => ({ ...o, players: o.players.map((p) => (p.id === action.id ? { ...p, reelOptIn: action.value } : p)) }));
    case 'makeHost':
      return withOuting(state, (o) => ({ ...o, hostId: action.id, players: o.players.map((p) => ({ ...p, isHost: p.id === action.id })) }));
    case 'moveHole':
      return withOuting(state, (o) => {
        if (action.to < 0 || action.to >= o.holes.length) return o;
        const holes = [...o.holes];
        const [h] = holes.splice(action.from, 1);
        holes.splice(action.to, 0, h);
        return { ...o, holes };
      });
    case 'replacePlace':
      return withOuting(state, (o) => ({ ...o, holes: o.holes.map((h, i) => (i === action.index ? { ...h, place: action.place } : h)) }));
    case 'addPlace':
      return withOuting(state, (o) => (o.holes.length >= 9 ? o : { ...o, holes: [...o.holes, ...buildHoles(o.gameMode, [action.place], o.holes.length * 11)] }));
    case 'removeHole':
      return withOuting(state, (o) => (o.holes.length <= 3 ? o : { ...o, holes: o.holes.filter((_, i) => i !== action.index) }));
    case 'start':
      return withOuting(state, (o) => ({ ...o, status: 'live', currentHole: 0 }));
    case 'score':
      return {
        ...withOuting(state, (o) => ({
          ...o,
          holes: o.holes.map((h, i) =>
            i === o.currentHole && !h.cancelled && !h.results.some((r) => r.scorerId === action.scorerId)
              ? { ...h, results: [...h.results, { scorerId: action.scorerId, points: action.points, at: Date.now() }] }
              : h,
          ),
        })),
        pendingSync: state.pendingSync + 1,
      };
    case 'undoScore':
      return withOuting(state, (o) => ({ ...o, holes: o.holes.map((h, i) => (i === o.currentHole ? { ...h, results: h.results.slice(0, -1) } : h)) }));
    case 'correctScore':
      return withOuting(state, (o) => ({
        ...o,
        holes: o.holes.map((h, i) => {
          if (i !== action.holeIndex) return h;
          const others = h.results.filter((r) => r.scorerId !== action.scorerId);
          return { ...h, results: action.points > 0 ? [...others, { scorerId: action.scorerId, points: action.points, at: Date.now() }] : others };
        }),
      }));
    case 'cancelHole':
      // Trou annulé : points retirés pour tout le monde, le trou ne compte pas.
      return withOuting(state, (o) => ({ ...o, holes: o.holes.map((h, i) => (i === action.index ? { ...h, cancelled: true, results: [] } : h)) }));
    case 'restoreHole':
      return withOuting(state, (o) => ({ ...o, holes: o.holes.map((h, i) => (i === action.index ? { ...h, cancelled: false } : h)) }));
    case 'setPhoto':
      return withOuting(state, (o) => ({ ...o, holes: o.holes.map((h, i) => (i === o.currentHole ? { ...h, photoUri: action.uri } : h)) }));
    case 'holeDone':
      return withOuting(state, (o) => ({ ...o, holes: o.holes.map((h, i) => (i === o.currentHole ? { ...h, done: true } : h)) }));
    case 'nextHole':
      // Le groupe avance quand il le décide. Aucune condition liée aux verres.
      return withOuting(state, (o) => (o.currentHole + 1 >= o.holes.length ? { ...o, status: 'finished' } : { ...o, currentHole: o.currentHole + 1 }));
    case 'pause':
      return withOuting(state, (o) => ({ ...o, status: 'paused' }));
    case 'resume':
      return withOuting(state, (o) => ({ ...o, status: 'live' }));
    case 'finish':
      return withOuting(state, (o) => ({ ...o, status: 'finished', holes: o.holes.map((h, i) => (i <= o.currentHole ? { ...h, done: true } : h)) }));
    case 'leave':
      return withOuting(state, (o) => ({ ...o, players: o.players.map((p) => (p.id === action.id ? { ...p, status: 'left' } : p)) }));
    case 'rejoin':
      return withOuting(state, (o) => ({ ...o, players: o.players.map((p) => (p.id === action.id ? { ...p, status: 'active' } : p)) }));
    case 'archive': {
      if (!state.outing) return state;
      const m = toMemory(state.outing);
      const memories = m ? [m, ...state.memories.filter((x) => x.id !== m.id)].slice(0, 12) : state.memories;
      return { ...state, outing: null, meId: null, memories };
    }
    case 'discard':
      return { ...state, outing: null, meId: null };
    case 'setConsent':
      return withOuting(state, (o) => ({ ...o, consent: { ...o.consent, [action.key]: action.value } }));
    case 'setPrivacy':
      return withOuting(state, (o) => ({ ...o, privacy: { ...o.privacy, [action.key]: action.value } }));
    case 'waterReminder':
      return withOuting(state, (o) => ({ ...o, waterReminderAt: Date.now() }));
    case 'joinRoom':
      return { ...state, outing: action.outing, meId: action.meId };
    case 'remoteOuting':
      if (state.outing && action.outing.updatedAt <= state.outing.updatedAt) return state;
      return { ...state, outing: action.outing };
    case 'syncFlushed':
      return { ...state, pendingSync: 0 };
    default:
      return state;
  }
}

export type Standing = { id: string; name: string; color: string; points: number; wins: number; rank: number; outfit?: Outfit; members: Player[]; left: boolean };

// Classement : total de points, puis nombre de défis réussis, puis ex aequo.
export function computeStandings(o: Outing): Standing[] {
  const totals = new Map<string, number>();
  const wins = new Map<string, number>();
  for (const h of o.holes) {
    if (h.cancelled) continue;
    for (const r of h.results) {
      totals.set(r.scorerId, (totals.get(r.scorerId) ?? 0) + r.points);
      wins.set(r.scorerId, (wins.get(r.scorerId) ?? 0) + 1);
    }
  }
  const rows: Omit<Standing, 'rank'>[] =
    o.mode === 'teams'
      ? o.teams.map((t) => {
          const members = o.players.filter((p) => p.teamId === t.id);
          return { id: t.id, name: t.name, color: t.color, points: totals.get(t.id) ?? 0, wins: wins.get(t.id) ?? 0, members, left: members.length > 0 && members.every((m) => m.status === 'left') };
        })
      : o.players.map((p, i) => ({ id: p.id, name: p.name, color: TEAM_PRESETS[i % TEAM_PRESETS.length].color, points: totals.get(p.id) ?? 0, wins: wins.get(p.id) ?? 0, outfit: p.outfit, members: [p], left: p.status === 'left' }));
  rows.sort((a, b) => b.points - a.points || b.wins - a.wins || a.name.localeCompare(b.name));
  let rank = 0;
  return rows.map((r, i) => {
    const prev = rows[i - 1];
    if (!prev || prev.points !== r.points || prev.wins !== r.wins) rank = i + 1;
    return { ...r, rank };
  });
}

export function scorersOf(o: Outing): Standing[] {
  return computeStandings(o).sort((a, b) => a.name.localeCompare(b.name));
}

export function teamColorOf(o: Outing, p: Player): string {
  if (o.mode === 'teams') return o.teams.find((t) => t.id === p.teamId)?.color ?? colors.flag;
  const i = o.players.findIndex((x) => x.id === p.id);
  return TEAM_PRESETS[Math.max(0, i) % TEAM_PRESETS.length].color;
}

const Ctx = createContext<{ state: State; dispatch: React.Dispatch<Action> } | null>(null);

export function OutingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const lastWritten = useRef<number>(0);

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

  // Salle partagée : on publie nos changements, on écoute ceux des autres clients.
  useEffect(() => {
    const o = state.outing;
    if (!o || !state.hydrated) return;
    if (o.updatedAt !== lastWritten.current) {
      lastWritten.current = o.updatedAt;
      writeRoom(o);
    }
  }, [state.outing, state.hydrated]);

  const joinCode = state.outing?.joinCode;
  useEffect(() => {
    if (!joinCode) return;
    // À l'ouverture, on relit la salle : un autre client a pu avancer pendant notre absence.
    const latest = readRoom(joinCode);
    if (latest) {
      lastWritten.current = Math.max(lastWritten.current, latest.updatedAt);
      dispatch({ type: 'remoteOuting', outing: latest });
    }
    return subscribeRoom(joinCode, (remote) => {
      lastWritten.current = remote.updatedAt;
      dispatch({ type: 'remoteOuting', outing: remote });
    });
  }, [joinCode]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useOuting() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useOuting must be used within OutingProvider');
  return ctx;
}

// Rejoindre une sortie par code : lit la salle locale, ajoute le joueur, publie.
export function joinByCode(codeInput: string, name: string, outfit: Outfit): { ok: true; outing: Outing; meId: string } | { ok: false; reason: string } {
  const room = readRoom(codeInput.trim().toUpperCase());
  if (!room) return { ok: false, reason: 'Code introuvable sur cet appareil. Vérifie les 4 caractères, ou demande à l’hôte de te montrer le QR.' };
  if (room.status === 'finished') return { ok: false, reason: 'Cette sortie est terminée.' };
  const me = newPlayer(name, outfit, { joinedAtHole: room.status === 'draft' ? 0 : room.currentHole });
  const outing = touch({ ...room, ...assignTeams([...room.players, me], room.mode) });
  writeRoom(outing);
  return { ok: true, outing, meId: me.id };
}
