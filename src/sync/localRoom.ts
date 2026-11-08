import { Platform } from 'react-native';
import type { Outing } from '@/store/types';

// Synchronisation locale entre clients d'un même navigateur (deux onglets = deux appareils simulés).
// Fonctionne sur le web via localStorage + événement `storage`. Sur iOS/Android, rien n'est partagé
// entre appareils : un backend temps réel est nécessaire (voir docs/audit.md).

const KEY = (code: string) => `bgc.room.${code.toUpperCase()}`;

export const roomSyncAvailable = Platform.OS === 'web' && typeof window !== 'undefined' && !!window.localStorage;

export function readRoom(code: string): Outing | null {
  if (!roomSyncAvailable) return null;
  try {
    const raw = window.localStorage.getItem(KEY(code));
    return raw ? (JSON.parse(raw) as Outing) : null;
  } catch {
    return null;
  }
}

export function writeRoom(outing: Outing) {
  if (!roomSyncAvailable) return;
  try {
    window.localStorage.setItem(KEY(outing.joinCode), JSON.stringify(outing));
  } catch {
    // quota ou stockage bloqué : la partie continue en local
  }
}

export function clearRoom(code: string) {
  if (!roomSyncAvailable) return;
  try {
    window.localStorage.removeItem(KEY(code));
  } catch {
    // ignoré
  }
}

export function subscribeRoom(code: string, onChange: (o: Outing) => void): () => void {
  if (!roomSyncAvailable) return () => {};
  const key = KEY(code);
  const handler = (e: StorageEvent) => {
    if (e.key !== key || !e.newValue) return;
    try {
      onChange(JSON.parse(e.newValue) as Outing);
    } catch {
      // payload illisible : ignoré
    }
  };
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
}
