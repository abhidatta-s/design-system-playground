import { useClipboard } from "../../hooks/useClipboard";

interface CodePanelProps {
  title: string;
  filename: string;
  code: string;
}

export function CodePanel({ title, filename, code }: CodePanelProps) {
  const { status, copy } = useClipboard();
  const label = status === "copied" ? "Copied" : status === "failed" ? "Copy failed" : "Copy";
  return (
    <section className="code-panel" aria-label={title}>
      <header className="code-panel__header">
        <div>
          <h3 className="code-panel__title">{title}</h3>
          <p className="code-panel__file mono">{filename}</p>
        </div>
        <button
          type="button"
          className={`copy-btn${status === "copied" ? " is-copied" : ""}${status === "failed" ? " is-failed" : ""}`}
          onClick={() => void copy(code)}
        >
          {label}
        </button>
      </header>
      <pre className="code-panel__pre" tabIndex={0} aria-label={`${title} source`}>
        <code>{code}</code>
      </pre>
      <p className="sr-only" role="status" aria-live="polite">
        {status === "copied" ? `${title} copied to clipboard` : status === "failed" ? "Copy failed. Select the text and copy manually." : ""}
      </p>
    </section>
  );
}
