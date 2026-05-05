import { useSyncExternalStore } from 'react';

/**
 * Хранилище "избранного" в localStorage.
 * В ТЗ написано "в отдельный файл" — тут это отдельный модуль,
 * который отвечает за сохранение/чтение id лайкнутых карточек.
 */
const FAVORITES_KEY = 'skillswap_favorites_card_ids';
const FAVORITES_CHANGE_EVENT = 'skillswap-favorites-change';

function safeParse(raw: string | null): number[] {
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as number[]).filter((x) => Number.isFinite(x)) : [];
  } catch {
    return [];
  }
}

function readFavorites(): number[] {
  if (typeof window === 'undefined') {
    return [];
  }
  return safeParse(window.localStorage.getItem(FAVORITES_KEY));
}

function writeFavorites(next: number[]): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(FAVORITES_CHANGE_EVENT));
}

function subscribeFavorites(callback: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }
  const handler = () => callback();
  window.addEventListener('storage', handler);
  window.addEventListener(FAVORITES_CHANGE_EVENT, handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener(FAVORITES_CHANGE_EVENT, handler);
  };
}

export function useFavoriteCardIds(): number[] {
  return useSyncExternalStore(subscribeFavorites, readFavorites, () => []);
}

export function isCardFavorite(cardId: number): boolean {
  return readFavorites().includes(cardId);
}

export function toggleFavoriteCardId(cardId: number): void {
  const current = readFavorites();
  const has = current.includes(cardId);
  const next = has ? current.filter((id) => id !== cardId) : [...current, cardId];
  writeFavorites(next);
}
