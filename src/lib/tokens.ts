export type Theme = "light" | "dark";
export type Density = "comfortable" | "compact";

export interface Settings {
  primary: string;
  neutral: string;
  spaceBase: number;
  spaceRatio: number;
  radius: number;
  fontSize: number;
  theme: Theme;
  density: Density;
}

export const DEFAULT_SETTINGS: Settings = {
  primary: "#6c5ce7",
  neutral: "#64748b",
  spaceBase: 4,
  spaceRatio: 1.5,
  radius: 8,
  fontSize: 15,
  theme: "dark",
  density: "comfortable",
};

export const LIMITS = {
  spaceBase: { min: 2, max: 8, step: 0.5 },
  spaceRatio: { min: 1.1, max: 1.8, step: 0.05 },
  radius: { min: 0, max: 24, step: 1 },
  fontSize: { min: 12, max: 20, step: 1 },
} as const;

export const SPACE_STEPS = 8;

const HEX = /^#[0-9a-f]{6}$/i;

function num(value: unknown, fallback: number, min: number, max: number): number {
  return typeof value === "number" && Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
}

/** Validate untrusted data (e.g. localStorage) into a complete Settings object. */
export function sanitizeSettings(raw: unknown): Settings {
  const d = DEFAULT_SETTINGS;
  if (typeof raw !== "object" || raw === null) return d;
  const r = raw as Record<string, unknown>;
  return {
    primary: typeof r.primary === "string" && HEX.test(r.primary) ? r.primary.toLowerCase() : d.primary,
    neutral: typeof r.neutral === "string" && HEX.test(r.neutral) ? r.neutral.toLowerCase() : d.neutral,
    spaceBase: num(r.spaceBase, d.spaceBase, LIMITS.spaceBase.min, LIMITS.spaceBase.max),
    spaceRatio: num(r.spaceRatio, d.spaceRatio, LIMITS.spaceRatio.min, LIMITS.spaceRatio.max),
    radius: num(r.radius, d.radius, LIMITS.radius.min, LIMITS.radius.max),
    fontSize: num(r.fontSize, d.fontSize, LIMITS.fontSize.min, LIMITS.fontSize.max),
    theme: r.theme === "light" || r.theme === "dark" ? r.theme : d.theme,
    density: r.density === "compact" || r.density === "comfortable" ? r.density : d.density,
  };
}

export const round = (n: number, digits = 2): number => Number(n.toFixed(digits));

/** space-n = base × ratio^(n-1), in px. */
export function spaceScale(s: Pick<Settings, "spaceBase" | "spaceRatio">): number[] {
  return Array.from({ length: SPACE_STEPS }, (_, i) => round(s.spaceBase * Math.pow(s.spaceRatio, i), 1));
}
