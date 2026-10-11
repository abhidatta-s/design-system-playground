import { useId, type InputHTMLAttributes } from "react";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id"> {
  label: string;
  helper?: string;
  error?: string;
}

export function Input({ label, helper, error, className, ...rest }: InputProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const hint = error ?? helper;
  const classes = ["ds-input", error ? "ds-input--error" : "", className].filter(Boolean).join(" ");
  return (
    <div className="ds-field">
      <label className="ds-field__label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={classes}
        aria-invalid={error ? true : undefined}
        aria-describedby={hint ? hintId : undefined}
        {...rest}
      />
      {hint && (
        <p id={hintId} className={error ? "ds-field__hint ds-field__hint--error" : "ds-field__hint"} role={error ? "alert" : undefined}>
          {hint}
        </p>
      )}
    </div>
  );
}
