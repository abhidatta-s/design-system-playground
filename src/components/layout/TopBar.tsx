import type { Settings } from "../../lib/tokens";
import { SegmentedControl } from "../controls/SegmentedControl";

interface TopBarProps {
  settings: Settings;
  isDefault: boolean;
  onChange: (patch: Partial<Settings>) => void;
  onReset: () => void;
}

export function TopBar({ settings, isDefault, onChange, onReset }: TopBarProps) {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand__mark" aria-hidden="true" />
        <div>
          <h1 className="brand__title">Design System Playground</h1>
          <p className="brand__sub">Tokens in, components out.</p>
        </div>
      </div>
      <div className="topbar__actions">
        <SegmentedControl
          label="Theme"
          value={settings.theme}
          options={[
            { value: "dark", label: "Dark" },
            { value: "light", label: "Light" },
          ]}
          onChange={(theme) => onChange({ theme })}
        />
        <SegmentedControl
          label="Density"
          value={settings.density}
          options={[
            { value: "comfortable", label: "Comfortable" },
            { value: "compact", label: "Compact" },
          ]}
          onChange={(density) => onChange({ density })}
        />
        <button type="button" className="reset-btn" onClick={onReset} disabled={isDefault}>
          Reset
        </button>
      </div>
    </header>
  );
}
