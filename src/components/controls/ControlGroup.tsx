import type { ReactNode } from "react";

export function ControlGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="control-group">
      <legend className="control-group__title">{title}</legend>
      <div className="control-group__body">{children}</div>
    </fieldset>
  );
}
