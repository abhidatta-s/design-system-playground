import { anchoredScale, neutralScale, readableOn, STEPS, type Scale } from "./color";
import { round, spaceScale, type Settings, type Theme } from "./tokens";

type Entry = [name: string, value: string];

const STATUS_SOURCES = {
  danger: "#ef4444",
  success: "#22c55e",
  warning: "#f59e0b",
} as const;
type StatusName = keyof typeof STATUS_SOURCES;
const STATUS_NAMES = Object.keys(STATUS_SOURCES) as StatusName[];

function scaleEntries(prefix: string, scale: Scale): Entry[] {
  return STEPS.map((step) => [`--${prefix}-${step}`, scale[step]]);
}

function baseEntries(s: Settings): Entry[] {
  const space = spaceScale(s);
  const f = s.fontSize;
  return [
    ...scaleEntries("primary", anchoredScale(s.primary)),
    ...scaleEntries("neutral", neutralScale(s.neutral)),
    ...space.map((v, i): Entry => [`--space-${i + 1}`, `${v}px`]),
    ["--radius-sm", `${round(s.radius * 0.5, 1)}px`],
    ["--radius-md", `${s.radius}px`],
    ["--radius-lg", `${round(s.radius * 1.5, 1)}px`],
    ["--radius-full", "9999px"],
    ["--font-sans", 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'],
    ["--font-size-xs", `${round(f * 0.78, 1)}px`],
    ["--font-size-sm", `${round(f * 0.88, 1)}px`],
    ["--font-size-base", `${f}px`],
    ["--font-size-lg", `${round(f * 1.2, 1)}px`],
    ["--font-size-xl", `${round(f * 1.5, 1)}px`],
    ["--font-size-2xl", `${round(f * 1.9, 1)}px`],
    ["--density", "1"],
  ];
}

function semanticEntries(theme: Theme, s: Settings): Entry[] {
  const p = anchoredScale(s.primary);
  const n = neutralScale(s.neutral);
  const dark = theme === "dark";
  const fgLight = "#ffffff";
  const fgDark = n[950];

  const entries: Entry[] = dark
    ? [
        ["--bg", n[950]],
        ["--surface", n[900]],
        ["--surface-muted", n[800]],
        ["--border", n[800]],
        ["--border-strong", n[700]],
        ["--text", n[50]],
        ["--text-muted", n[400]],
        ["--text-subtle", n[500]],
      ]
    : [
        ["--bg", n[50]],
        ["--surface", "#ffffff"],
        ["--surface-muted", n[100]],
        ["--border", n[200]],
        ["--border-strong", n[300]],
        ["--text", n[900]],
        ["--text-muted", n[600]],
        ["--text-subtle", n[500]],
      ];

  const brand = (name: string, sc: Scale) => {
    const base = dark ? sc[500] : sc[600];
    entries.push(
      [`--${name}`, base],
      [`--${name}-hover`, dark ? sc[400] : sc[700]],
      [`--${name}-active`, dark ? sc[600] : sc[800]],
      [`--${name}-fg`, readableOn(base, fgLight, fgDark)],
      [`--${name}-subtle`, dark ? sc[900] : sc[50]],
      [`--${name}-subtle-fg`, dark ? sc[200] : sc[700]],
    );
  };
  brand("primary", p);
  entries.push(["--ring", p[400]]);
  STATUS_NAMES.forEach((name) => brand(name, anchoredScale(STATUS_SOURCES[name])));
  return entries;
}

const block = (selector: string, entries: Entry[]) =>
  `${selector} {\n${entries.map(([k, v]) => `  ${k}: ${v};`).join("\n")}\n}`;

/**
 * Build the full CSS variable sheet for the current settings.
 * `selector` is ":root" for display/export, or a scope class for the live preview.
 */
export function generateCss(s: Settings, selector = ":root"): string {
  return [
    block(selector, baseEntries(s)),
    block(`${selector}[data-theme="light"]`, semanticEntries("light", s)),
    block(`${selector}[data-theme="dark"]`, semanticEntries("dark", s)),
    block(`${selector}[data-density="compact"]`, [["--density", "0.8"]]),
  ].join("\n\n");
}
