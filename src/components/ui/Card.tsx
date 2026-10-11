import type { ReactNode } from "react";

interface CardProps {
  title: string;
  eyebrow?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

export function Card({ title, eyebrow, children, footer }: CardProps) {
  return (
    <article className="ds-card">
      <header className="ds-card__header">
        {eyebrow && <div className="ds-card__eyebrow">{eyebrow}</div>}
        <h3 className="ds-card__title">{title}</h3>
      </header>
      <div className="ds-card__body">{children}</div>
      {footer && <footer className="ds-card__footer">{footer}</footer>}
    </article>
  );
}
