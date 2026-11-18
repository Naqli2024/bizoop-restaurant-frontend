export const fmt = (v) => (v == null ? "—" : `${v} °C`);

export const unitStatus = (u) => {
  if (!u.online || !u.power) return { label: "Offline", tone: "off" };
  if (u.now < u.min || u.now > u.max) return { label: "Out of range", tone: "bad" };
  return { label: "In range", tone: "ok" };
};

export const ICONS = {
  plus: "M12 5v14M5 12h14",
  pen: ["M12 20h9", "M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"],
  download: "M12 4v12M7 11l5 5 5-5M4 20h16",
  close: "M18 6 6 18M6 6l12 12",
  check: "M20 6 9 17l-5-5",
  trash: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
};

export const KIND_OPTIONS = [
  ["cold", "Refrigerator / chiller"],
  ["freezer", "Freezer"],
  ["cam", "CCTV camera"],
];
export const KIND_LABEL = Object.fromEntries(KIND_OPTIONS);
export const PROTOCOLS = ["MQTT", "Modbus TCP", "BLE gateway", "LoRaWAN", "HTTP webhook", "ONVIF / RTSP"];

export const Icon = ({ name }) => (
  <svg className="iot-icon" viewBox="0 0 24 24" aria-hidden="true">
    {[].concat(ICONS[name]).map((p) => <path key={p} d={p} />)}
  </svg>
);

export const Pill = ({ tone, children }) => (
  <span className={`iot-pill iot-pill--${tone}`}>{children}</span>
);

export function Sparkline({ data, tone }) {
  const lo = Math.min(...data), hi = Math.max(...data), span = hi - lo || 1;
  const pts = data
    .map((v, i) => `${((i / (data.length - 1)) * 90).toFixed(1)},${(23 - ((v - lo) / span) * 20).toFixed(1)}`)
    .join(" ");
  return (
    <svg className="iot-spark" viewBox="0 0 90 26" aria-hidden="true">
      <polyline fill="none" strokeWidth="1.6" className={`iot-spark-line iot-spark-line--${tone}`} points={pts} />
    </svg>
  );
}

export function Switch({ label, checked, onChange }) {
  return (
    <label className="iot-switch">
      <span>{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <i />
    </label>
  );
}

export function Field({ label, ...props }) {
  return (
    <label className="iot-field">
      {label}
      <input className="iot-input" {...props} />
    </label>
  );
}
