export const PlusIcon = () => (
  <svg className="inv-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
);
export const CloseIcon = () => (
  <svg className="inv-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
);
export const Pill = ({ tone, children }) => <span className={`inv-pill inv-pill--${tone}`}>{children}</span>;
export const Metric = ({ label, value, tone }) => (
  <div className={`inv-metric inv-metric--${tone}`}>
    <div className="inv-metric__label">{label}</div>
    <div className="inv-metric__value">{value}</div>
  </div>
);
