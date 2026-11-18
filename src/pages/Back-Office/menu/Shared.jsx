export function Metric({ label, value, color }) {
  return (
    <div className="rm-metric">
      <div className="rm-metric__label">{label}</div>
      <div className="rm-metric__value" style={color ? { color } : undefined}>{value}</div>
    </div>
  );
}
export const Switch = ({ checked, onChange, label, line }) => (
  <label className={"rm-switch" + (line ? " rm-switch--line" : "")}>
    {label && <span>{label}</span>}
    <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    <i />
  </label>
);

