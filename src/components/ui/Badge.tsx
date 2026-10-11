import type { ReactNode } from "react";

export type BadgeVariant = "neutral" | "primary" | "success" | "warning" | "danger";

export function Badge({ variant = "neutral", children }: { variant?: BadgeVariant; children: ReactNode }) {
  return <span className={`ds-badge ds-badge--${variant}`}>{children}</span>;
}
