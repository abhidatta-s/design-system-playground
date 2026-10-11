import { useMemo } from "react";
import { CodePanel } from "./components/code/CodePanel";
import { ControlsPanel } from "./components/controls/ControlsPanel";
import { TopBar } from "./components/layout/TopBar";
import { Preview } from "./components/preview/Preview";
import { useSettings } from "./hooks/useSettings";
import { generateReactSample } from "./lib/codegen";
import { generateCss } from "./lib/css";

export default function App() {
  const { settings, update, reset, isDefault } = useSettings();
  const css = useMemo(() => generateCss(settings, ":root"), [settings]);
  const react = useMemo(() => generateReactSample(settings), [settings]);

  return (
    <div className="app">
      <TopBar settings={settings} isDefault={isDefault} onChange={update} onReset={reset} />
      <div className="app__body">
        <ControlsPanel settings={settings} onChange={update} />
        <main className="main">
          <Preview settings={settings} />
          <div className="code-grid">
            <CodePanel title="CSS variables" filename="tokens.css" code={css} />
            <CodePanel title="React component" filename="Button.tsx" code={react} />
          </div>
        </main>
      </div>
    </div>
  );
}
