import { LIMITS, spaceScale, type Settings } from "../../lib/tokens";
import { ColorField } from "./ColorField";
import { ControlGroup } from "./ControlGroup";
import { RangeField } from "./RangeField";

interface ControlsPanelProps {
  settings: Settings;
  onChange: (patch: Partial<Settings>) => void;
}

export function ControlsPanel({ settings, onChange }: ControlsPanelProps) {
  const space = spaceScale(settings);
  return (
    <aside className="sidebar" aria-label="Token controls">
      <ControlGroup title="Color">
        <ColorField label="Primary" value={settings.primary} onChange={(primary) => onChange({ primary })} />
        <ColorField label="Neutral" value={settings.neutral} onChange={(neutral) => onChange({ neutral })} />
        <p className="hint">Each color generates an 11-step tonal scale (50–950). Primary anchors step 500.</p>
      </ControlGroup>

      <ControlGroup title="Spacing">
        <RangeField
          label="Base unit"
          unit="px"
          {...LIMITS.spaceBase}
          value={settings.spaceBase}
          onChange={(spaceBase) => onChange({ spaceBase })}
        />
        <RangeField
          label="Scale ratio"
          unit="×"
          {...LIMITS.spaceRatio}
          value={settings.spaceRatio}
          onChange={(spaceRatio) => onChange({ spaceRatio })}
        />
        <p className="hint mono">{space.slice(0, 6).join(" · ")} …</p>
      </ControlGroup>

      <ControlGroup title="Shape">
        <RangeField
          label="Border radius"
          unit="px"
          {...LIMITS.radius}
          value={settings.radius}
          onChange={(radius) => onChange({ radius })}
        />
      </ControlGroup>

      <ControlGroup title="Typography">
        <RangeField
          label="Base font size"
          unit="px"
          {...LIMITS.fontSize}
          value={settings.fontSize}
          onChange={(fontSize) => onChange({ fontSize })}
        />
      </ControlGroup>
    </aside>
  );
}
