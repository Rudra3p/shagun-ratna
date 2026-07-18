"use client";

import { useState, useCallback } from 'react';

function readPersisted(key, initialValue) {
  if (typeof window === 'undefined') return initialValue;
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : initialValue;
  } catch {
    return initialValue;
  }
}

// Generic localStorage-backed state — same shape as useState (accepts a
// direct value or an updater function), but persists on every update and
// hydrates synchronously from storage on first render. Falls back to
// `initialValue` when storage is unavailable (SSR, private browsing) or unset.
export function usePersistedState(key, initialValue) {
  const [state, setState] = useState(() => readPersisted(key, initialValue));

  const setPersistedState = useCallback((value) => {
    setState((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // localStorage unavailable — state just won't persist
      }
      return next;
    });
  }, [key]);

  return [state, setPersistedState];
}
