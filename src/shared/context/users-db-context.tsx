import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { getAuthUserId } from '../lib/auth-session';

const USERS_CACHE_KEY = 'skillswap_users_cache';
const LIKE_EDGES_KEY = 'skillswap_like_edges';

export type UserRecord = {
  id: number;
  likes: number;
  name: string;
  email: string;
  password: string;
  userAvatar: string;
  cityId: number;
  gender: string;
  birthday: string;
  createdAt: string;
  about: string;
  skillsWantId: string[];
  skillsCanTeach: unknown[];
};

type UsersPayload = { users: UserRecord[] };

type Bundle = { users: UserRecord[]; edgeKeys: string[] };

function readCachedUsers(): UserRecord[] | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const raw = window.localStorage.getItem(USERS_CACHE_KEY);
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as UsersPayload;
    return Array.isArray(parsed.users) ? parsed.users : null;
  } catch {
    return null;
  }
}

function readEdges(): string[] {
  if (typeof window === 'undefined') {
    return [];
  }
  const raw = window.localStorage.getItem(LIKE_EDGES_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

function persist(users: UserRecord[], edges: string[]): void {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(USERS_CACHE_KEY, JSON.stringify({ users }));
  window.localStorage.setItem(LIKE_EDGES_KEY, JSON.stringify(edges));
}

function makeEdgeKey(authId: number, targetUserId: number): string {
  return `${authId}_${targetUserId}`;
}

type UsersDbContextValue = {
  isReady: boolean;
  users: UserRecord[];
  isLikedByCurrentUser: (targetUserId: number) => boolean;
  getLikes: (targetUserId: number) => number;
  toggleLike: (targetUserId: number) => void;
};

const UsersDbContext = createContext<UsersDbContextValue | null>(null);

function createInitialBundle(): Bundle {
  const cached = readCachedUsers();
  const edges = readEdges();
  if (cached) {
    return { users: cached, edgeKeys: edges };
  }
  return { users: [], edgeKeys: edges };
}

function hasCachedUsersOnClient(): boolean {
  return readCachedUsers() !== null;
}

export function UsersDbProvider({ children }: { children: ReactNode }) {
  const [bundle, setBundle] = useState<Bundle>(createInitialBundle);
  const [isReady, setIsReady] = useState(hasCachedUsersOnClient);

  useEffect(() => {
    if (hasCachedUsersOnClient()) {
      return;
    }

    let cancelled = false;
    const edges = readEdges();

    void fetch('/db/users.json')
      .then((res) => res.json() as Promise<UsersPayload>)
      .then((data) => {
        if (cancelled) {
          return;
        }
        setBundle({ users: data.users, edgeKeys: edges });
        setIsReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          setIsReady(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const toggleLike = useCallback((targetUserId: number) => {
    const authId = getAuthUserId();
    if (authId === null || authId === targetUserId) {
      return;
    }

    setBundle((prev) => {
      const key = makeEdgeKey(authId, targetUserId);
      const has = prev.edgeKeys.includes(key);
      const nextEdges = has ? prev.edgeKeys.filter((k) => k !== key) : [...prev.edgeKeys, key];
      const delta = has ? -1 : 1;
      const nextUsers = prev.users.map((u) =>
        u.id === targetUserId ? { ...u, likes: Math.max(0, u.likes + delta) } : u
      );
      persist(nextUsers, nextEdges);
      return { users: nextUsers, edgeKeys: nextEdges };
    });
  }, []);

  const isLikedByCurrentUser = useCallback(
    (targetUserId: number) => {
      const authId = getAuthUserId();
      if (authId === null) {
        return false;
      }
      return bundle.edgeKeys.includes(makeEdgeKey(authId, targetUserId));
    },
    [bundle.edgeKeys]
  );

  const getLikes = useCallback(
    (targetUserId: number) => {
      const user = bundle.users.find((u) => u.id === targetUserId);
      return user?.likes ?? 0;
    },
    [bundle.users]
  );

  const value = useMemo<UsersDbContextValue>(
    () => ({
      isReady,
      users: bundle.users,
      isLikedByCurrentUser,
      getLikes,
      toggleLike,
    }),
    [bundle.users, getLikes, isLikedByCurrentUser, isReady, toggleLike]
  );

  return <UsersDbContext.Provider value={value}>{children}</UsersDbContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components -- контекстный хук рядом с провайдером
export function useUsersDb(): UsersDbContextValue {
  const ctx = useContext(UsersDbContext);
  if (!ctx) {
    throw new Error('useUsersDb должен вызываться внутри UsersDbProvider');
  }
  return ctx;
}
