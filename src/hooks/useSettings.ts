import { useCallback, useEffect } from "react";
import { DEFAULT_SETTINGS, sanitizeSettings, type Settings } from "../lib/tokens";
import { useLocalStorage } from "./useLocalStorage";

const STORAGE_KEY = "design-system-playground:v1";

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<Settings>(STORAGE_KEY, DEFAULT_SETTINGS, sanitizeSettings);

  const update = useCallback(
    (patch: Partial<Settings>) => setSettings((prev) => sanitizeSettings({ ...prev, ...patch })),
    [setSettings],
  );
  const reset = useCallback(() => setSettings(DEFAULT_SETTINGS), [setSettings]);

  // The app chrome follows the theme too.
  useEffect(() => {
    document.documentElement.dataset.theme = settings.theme;
  }, [settings.theme]);

  const isDefault = JSON.stringify(settings) === JSON.stringify(DEFAULT_SETTINGS);
  return { settings, update, reset, isDefault };
}
