import { Icon, Pill, Sparkline, fmt, unitStatus } from "../SharedIot";

export default function ColdChainTab({ units, onCommand }) {
  return (
    <div className="iot-body">
      <div className="iot-table-wrap">
        <table className="iot-table">
          <thead>
            <tr>
              <th>Unit</th><th>Zone</th><th className="iot-num">Now</th><th className="iot-num">Setpoint</th>
              <th>Limit</th><th>Last 24 min</th><th>Status</th><th>Control</th>
            </tr>
          </thead>
          <tbody>
            {units.map((u) => {
              const s = unitStatus(u);
              return (
                <tr key={u.id}>
                  <td><b>{u.name}</b><span className="iot-sub">{u.protocol} · {u.address}</span></td>
                  <td>{u.zone}</td>
                  <td className="iot-num iot-mono">{fmt(u.online && u.power ? u.now : null)}</td>
                  <td className="iot-num iot-mono">{u.setpoint} °C</td>
                  <td>{u.min} to {u.max} °C</td>
                  <td><Sparkline data={u.history} tone={s.tone === "ok" ? "ok" : "bad"} /></td>
                  <td><Pill tone={s.tone}>{s.label}</Pill></td>
                  <td className="iot-nowrap">
                    <button className="iot-btn iot-btn--sm" aria-label="Lower setpoint" onClick={() => onCommand(u.id, "dn")}>−</button>{" "}
                    <button className="iot-btn iot-btn--sm" aria-label="Raise setpoint" onClick={() => onCommand(u.id, "up")}><Icon name="plus" /></button>{" "}
                    <button className="iot-btn iot-btn--sm" onClick={() => onCommand(u.id, "def")}>Defrost</button>{" "}
                    <button className="iot-btn iot-btn--sm" onClick={() => onCommand(u.id, "pwr")}>{u.power ? "Power off" : "Power on"}</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="iot-note iot-note--spaced">
        Readings and controls are simulated (1 tick = 1 minute). Alerts fire only after the unit's alarm delay, so a
        short door opening or defrost does not raise one.
      </div>
    </div>
  );
}
