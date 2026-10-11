import { useEffect, useState } from "react";

/** useState persisted to localStorage; stored data always passes through `sanitize`. */
export function useLocalStorage<T>(key: string, fallback: T, sanitize: (raw: unknown) => T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? fallback : sanitize(JSON.parse(raw));
    } catch {
      return fallback;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable (private mode, quota): keep working in memory */
    }
  }, [key, value]);

  return [value, setValue] as const;
}
