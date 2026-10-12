import { useMemo } from "react";
import { anchoredScale, neutralScale } from "../../lib/color";
import { generateCss } from "../../lib/css";
import { spaceScale, type Settings } from "../../lib/tokens";
import { Badge } from "../ui/Badge";
import { Button, type ButtonSize, type ButtonVariant } from "../ui/Button";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { ScaleStrip } from "./ScaleStrip";
import { Section } from "./Section";

const VARIANTS: ButtonVariant[] = ["primary", "secondary", "ghost", "danger"];
const SIZES: ButtonSize[] = ["sm", "md", "lg"];

export function Preview({ settings }: { settings: Settings }) {
  // The live canvas is styled by the exact CSS shown in the export panel, scoped to .ds-scope.
  const scopedCss = useMemo(() => generateCss(settings, ".ds-scope"), [settings]);
  const primary = useMemo(() => anchoredScale(settings.primary), [settings.primary]);
  const neutral = useMemo(() => neutralScale(settings.neutral), [settings.neutral]);
  const space = spaceScale(settings);

  return (
    <div className="ds-scope" data-theme={settings.theme} data-density={settings.density}>
      <style>{scopedCss}</style>

      <Section title="Color" description="Tonal scales generated from your two picks.">
        <ScaleStrip name="primary" scale={primary} />
        <ScaleStrip name="neutral" scale={neutral} />
      </Section>

      <Section title="Buttons" description="Variants by size. The last row is disabled.">
        <div className="pv-matrix">
          {VARIANTS.map((variant) => (
            <div className="pv-row" key={variant}>
              <span className="pv-row__label">{variant}</span>
              {SIZES.map((size) => (
                <Button key={size} variant={variant} size={size}>
                  {size === "sm" ? "Small" : size === "md" ? "Medium" : "Large"}
                </Button>
              ))}
            </div>
          ))}
          <div className="pv-row">
            <span className="pv-row__label">disabled</span>
            {VARIANTS.map((variant) => (
              <Button key={variant} variant={variant} disabled>
                {variant}
              </Button>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Inputs" description="Label, helper text and error state.">
        <div className="pv-grid">
          <Input label="Project name" placeholder="Acme dashboard" helper="Shown in the sidebar and exports." />
          <Input label="Email" type="email" defaultValue="alex@" error="Enter a valid email address." />
          <Input label="Workspace" defaultValue="Read only" disabled helper="Managed by your admin." />
        </div>
      </Section>

      <Section title="Cards & badges">
        <div className="pv-grid pv-grid--cards">
          <Card
            eyebrow={<Badge variant="primary">New</Badge>}
            title="Token-driven surfaces"
            footer={
              <>
                <Button variant="ghost" size="sm">
                  Dismiss
                </Button>
                <Button size="sm">Apply</Button>
              </>
            }
          >
            Every surface, border and text color reads from the generated variables, so changes land everywhere at once.
          </Card>
          <Card
            eyebrow={<Badge variant="success">Healthy</Badge>}
            title="Density aware"
            footer={
              <Button variant="secondary" size="sm">
                View details
              </Button>
            }
          >
            Switch to compact to scale component padding by 0.8 without touching the base spacing tokens.
          </Card>
        </div>
        <div className="pv-badges">
          <Badge>Neutral</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
        </div>
      </Section>

      <Section title="Spacing scale" description={`${settings.spaceBase}px base × ${settings.spaceRatio} ratio`}>
        <ul className="space-list">
          {space.map((px, i) => (
            <li key={i} className="space-list__item">
              <span className="space-list__name mono">space-{i + 1}</span>
              <span className="space-list__bar" style={{ width: `var(--space-${i + 1})`, maxWidth: "100%" }} />
              <span className="space-list__px mono">{px}px</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Type scale">
        <div className="type-list">
          <p style={{ fontSize: "var(--font-size-2xl)", fontWeight: 700, letterSpacing: "-0.02em" }}>Design systems scale judgement</p>
          <p style={{ fontSize: "var(--font-size-xl)", fontWeight: 600 }}>Tokens first, components second</p>
          <p style={{ fontSize: "var(--font-size-lg)" }}>Large body copy for introductions and callouts.</p>
          <p style={{ fontSize: "var(--font-size-base)" }}>Base body copy sets the rhythm for everything else on the page.</p>
          <p style={{ fontSize: "var(--font-size-sm)", color: "var(--text-muted)" }}>Small text for helper copy and secondary details.</p>
          <p style={{ fontSize: "var(--font-size-xs)", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Caption
          </p>
        </div>
      </Section>
    </div>
  );
}
