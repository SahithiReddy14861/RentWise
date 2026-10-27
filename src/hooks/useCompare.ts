import { useCallback, useState } from 'react';

const MAX_COMPARE = 3;

// Compare selection lives in component state (ephemeral) — no persistence needed
// since it's a transient comparison action, not saved data.
export function useCompare() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleCompare = useCallback((id: string) => {
    setSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= MAX_COMPARE) return prev; // ignore, caller warns
      return [...prev, id];
    });
  }, []);

  const isComparing = useCallback(
    (id: string) => selected.includes(id),
    [selected]
  );

  const clearCompare = useCallback(() => setSelected([]), []);

  return {
    selected,
    toggleCompare,
    isComparing,
    clearCompare,
    maxReached: selected.length >= MAX_COMPARE,
  };
}
