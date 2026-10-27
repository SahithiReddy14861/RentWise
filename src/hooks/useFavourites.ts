import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'rentwise:favourites';

function read(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Favourites live in localStorage for this MVP (no auth was requested).
// Swap this hook for a Supabase-backed store if user accounts are added later.
export function useFavourites() {
  const [favourites, setFavourites] = useState<string[]>([]);

  useEffect(() => {
    setFavourites(read());
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setFavourites(read());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const persist = useCallback((next: string[]) => {
    setFavourites(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage may be unavailable; keep in-memory state */
    }
  }, []);

  const toggleFavourite = useCallback(
    (id: string) => {
      setFavourites((prev) => {
        const next = prev.includes(id)
          ? prev.filter((x) => x !== id)
          : [...prev, id];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    []
  );

  const isFavourite = useCallback(
    (id: string) => favourites.includes(id),
    [favourites]
  );

  return { favourites, toggleFavourite, isFavourite, persist };
}
