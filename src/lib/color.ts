export type Step = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;
export const STEPS: Step[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
export type Scale = Record<Step, string>;

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** Accepts "#abc", "abc", "#aabbcc"; returns lowercase "#rrggbb" or null. */
export function normalizeHex(input: string): string | null {
  const v = input.trim().replace(/^#/, "").toLowerCase();
  if (/^[0-9a-f]{3}$/.test(v)) return "#" + v.split("").map((c) => c + c).join("");
  if (/^[0-9a-f]{6}$/.test(v)) return "#" + v;
  return null;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = normalizeHex(hex) ?? "#000000";
  return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
}

function rgbToHex(r: number, g: number, b: number): string {
  const to = (n: number) => Math.round(clamp(n, 0, 255)).toString(16).padStart(2, "0");
  return "#" + to(r) + to(g) + to(b);
}

/** Returns [h 0-360, s 0-100, l 0-100]. */
export function hexToHsl(hex: string): [number, number, number] {
  const [r8, g8, b8] = hexToRgb(hex);
  const r = r8 / 255, g = g8 / 255, b = b8 / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0, s = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return [h, s * 100, l * 100];
}

export function hslToHex(h: number, s: number, l: number): string {
  const S = clamp(s, 0, 100) / 100, L = clamp(l, 0, 100) / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = S * Math.min(L, 1 - L);
  const f = (n: number) => L - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return rgbToHex(f(0) * 255, f(8) * 255, f(4) * 255);
}

function luminance(hex: string): number {
  const lin = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contrastRatio(a: string, b: string): number {
  const la = luminance(a), lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Pick whichever of the two candidates reads best on the given background. */
export function readableOn(bg: string, light: string, dark: string): string {
  return contrastRatio(bg, light) >= contrastRatio(bg, dark) ? light : dark;
}

/**
 * Tonal scale anchored on the picked color: step 500 keeps the picked hue,
 * saturation and (clamped) lightness; lighter and darker steps interpolate away from it.
 */
export function anchoredScale(hex: string): Scale {
  const [h, s, l0] = hexToHsl(hex);
  const anchor = clamp(l0, 38, 66);
  const out = {} as Scale;
  STEPS.forEach((step, i) => {
    let l: number;
    let sat = s;
    if (i <= 5) {
      l = 97 + (anchor - 97) * (i / 5);
      if (i < 5) sat = s * (0.7 + 0.06 * i);
    } else {
      l = anchor + (12 - anchor) * ((i - 5) / 5);
      sat = s * (1 - 0.09 * (i - 5));
    }
    out[step] = i === 5 ? hslToHex(h, s, anchor) : hslToHex(h, sat, l);
  });
  return out;
}

const NEUTRAL_L = [98, 96, 91, 83, 66, 47, 36, 27, 18, 11, 6];

/** Neutral scale: picked hue, saturation capped so surfaces stay quiet, fixed lightness curve. */
export function neutralScale(hex: string): Scale {
  const [h, s] = hexToHsl(hex);
  const sat = Math.min(s, 28);
  const out = {} as Scale;
  STEPS.forEach((step, i) => {
    out[step] = hslToHex(h, sat, NEUTRAL_L[i]);
  });
  return out;
}
