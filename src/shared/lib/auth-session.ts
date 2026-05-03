import { useSyncExternalStore } from 'react';

/** Ключ в localStorage: id авторизованного пользователя (число). Выставляется флоу входа. */
export const AUTH_USER_ID_KEY = 'skillswap_current_user_id';

const AUTH_CHANGE_EVENT = 'skillswap-auth-change';

export function getAuthUserId(): number | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const raw = window.localStorage.getItem(AUTH_USER_ID_KEY);
  if (raw === null || raw === '') {
    return null;
  }
  const id = Number(raw);
  return Number.isFinite(id) ? id : null;
}

export function setAuthUserIdForDev(id: number | null): void {
  if (typeof window === 'undefined') {
    return;
  }
  if (id === null) {
    window.localStorage.removeItem(AUTH_USER_ID_KEY);
  } else {
    window.localStorage.setItem(AUTH_USER_ID_KEY, String(id));
  }
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function subscribeAuthUserId(callback: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }
  const handler = () => callback();
  window.addEventListener('storage', handler);
  window.addEventListener(AUTH_CHANGE_EVENT, handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener(AUTH_CHANGE_EVENT, handler);
  };
}

export function useAuthUserId(): number | null {
  return useSyncExternalStore(subscribeAuthUserId, getAuthUserId, () => null);
}
