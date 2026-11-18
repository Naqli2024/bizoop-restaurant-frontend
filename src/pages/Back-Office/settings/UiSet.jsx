const ICONS = {
  printer: "M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z",
  trash: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  plus: "M12 5v14M5 12h14",
  upload: "M12 16V4M7 9l5-5 5 5M4 20h16",
  download: "M12 4v12M7 11l5 5 5-5M4 20h16",
};

export function Icon({ name }) {
  return (
    <svg className="stg-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d={ICONS[name]} />
    </svg>
  );
}

export function Button({ variant, icon, children, ...rest }) {
  const cls = ["stg-btn", variant && `stg-btn--${variant}`].filter(Boolean).join(" ");
  return (
    <button type="button" className={cls} {...rest}>
      {icon && <Icon name={icon} />}
      {children}
    </button>
  );
}

export function Card({ title, wide, children }) {
  return (
    <section className={`stg-card${wide ? " stg-card--wide" : ""}`}>
      {title && <h3 className="stg-card__title">{title}</h3>}
      {children}
    </section>
  );
}

export function Field({ label, children }) {
  return (
    <label className="stg-field">
      <span className="stg-field__label">{label}</span>
      {children}
    </label>
  );
}

export function TextField({ label, value, onChange, ...rest }) {
  return (
    <Field label={label}>
      <input className="stg-input" value={value} onChange={(e) => onChange(e.target.value)} {...rest} />
    </Field>
  );
}

export function NumberField({ label, value, onChange, min, max, step }) {
  return (
    <Field label={label}>
      <input
        className="stg-input"
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => {
          const n = Number(e.target.value);
          onChange(Number.isNaN(n) ? min ?? 0 : n);
        }}
      />
    </Field>
  );
}

/** options: array of strings or {value, label} */
export function SelectField({ label, value, onChange, options }) {
  return (
    <Field label={label}>
      <select className="stg-input" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => {
          const v = typeof o === "string" ? o : o.value;
          const l = typeof o === "string" ? o : o.label;
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
    </Field>
  );
}

export function Toggle({ label, checked, onChange }) {
  return (
    <label className="stg-toggle">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <i aria-hidden="true" />
    </label>
  );
}
