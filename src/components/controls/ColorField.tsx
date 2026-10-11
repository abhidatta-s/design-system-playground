import { useEffect, useId, useState } from "react";
import { normalizeHex } from "../../lib/color";

interface ColorFieldProps {
  label: string;
  value: string;
  onChange: (hex: string) => void;
}

export function ColorField({ label, value, onChange }: ColorFieldProps) {
  const id = useId();
  const [draft, setDraft] = useState(value);

  useEffect(() => setDraft(value), [value]);

  const commit = (raw: string) => {
    const hex = normalizeHex(raw);
    if (hex) onChange(hex);
    else setDraft(value);
  };

  return (
    <div className="field">
      <label className="field__label" htmlFor={`${id}-hex`}>
        {label}
      </label>
      <div className="color-field">
        <input
          type="color"
          className="color-field__swatch"
          aria-label={`${label} color picker`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          id={`${id}-hex`}
          type="text"
          className="color-field__hex"
          spellCheck={false}
          autoComplete="off"
          maxLength={7}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            const hex = /^#?[0-9a-f]{6}$/i.test(e.target.value.trim()) ? normalizeHex(e.target.value) : null;
            if (hex) onChange(hex);
          }}
          onBlur={(e) => commit(e.target.value)}
        />
      </div>
    </div>
  );
}
