import { useCallback, useEffect, useRef } from "react";
import { getTheme, setTheme, useTheme } from "../theme";
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

  // The app chrome theme is shared with the portfolio (dark default, saved choice, ?theme= override set before paint).
  // On load the page theme wins over the saved setting; afterwards the two stay in sync both ways.
  const pageTheme = useTheme();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; if (settings.theme !== getTheme()) update({ theme: getTheme() }); return; }
    if (settings.theme !== getTheme()) setTheme(settings.theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.theme]);
  useEffect(() => {
    if (pageTheme !== settings.theme) update({ theme: pageTheme });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageTheme]);

  const isDefault = JSON.stringify(settings) === JSON.stringify(DEFAULT_SETTINGS);
  return { settings, update, reset, isDefault };
}
