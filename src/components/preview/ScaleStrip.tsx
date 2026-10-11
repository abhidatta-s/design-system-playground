import { readableOn, STEPS, type Scale } from "../../lib/color";

export function ScaleStrip({ name, scale }: { name: string; scale: Scale }) {
  return (
    <div className="scale">
      <p className="scale__name">{name}</p>
      <ul className="scale__row" aria-label={`${name} tonal scale`}>
        {STEPS.map((step) => (
          <li key={step} className="scale__cell" style={{ background: scale[step], color: readableOn(scale[step], "#ffffff", "#0b0d12") }} title={`${name}-${step} ${scale[step]}`}>
            <span className="scale__step">{step}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
