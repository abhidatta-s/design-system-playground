import type { ReactNode } from "react";

export function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="pv-section">
      <header className="pv-section__header">
        <h2 className="pv-section__title">{title}</h2>
        {description && <p className="pv-section__desc">{description}</p>}
      </header>
      {children}
    </section>
  );
}
