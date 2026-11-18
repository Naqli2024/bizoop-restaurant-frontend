import { Icon, Pill, fmt, unitStatus } from "../SharedIot";

export default function OverviewTab({ units, cameras, alerts, onAck, onExport }) {
  const devicesOnline = units.filter((u) => u.online).length + cameras.filter((c) => c.online).length;
  const devicesTotal = units.length + cameras.length;
  const openAlerts = alerts.filter((a) => !a.acked).length;
  const outOfRange = units.filter((u) => unitStatus(u).tone === "bad").length;
  const camsOnline = cameras.filter((c) => c.online).length;

  return (
    <>
      <div className="iot-stats">
        <div className="iot-stat iot-stat--green">
          <div className="iot-stat-label">Devices online</div>
          <div className="iot-stat-value">{devicesOnline}/{devicesTotal}</div>
        </div>
        <div className={`iot-stat ${openAlerts ? "iot-stat--red" : "iot-stat--green"}`}>
          <div className="iot-stat-label">Open alerts</div>
          <div className="iot-stat-value">{openAlerts}</div>
        </div>
        <div className={`iot-stat ${outOfRange ? "iot-stat--red" : "iot-stat--green"}`}>
          <div className="iot-stat-label">Units out of range</div>
          <div className="iot-stat-value">{outOfRange}</div>
        </div>
        <div className="iot-stat iot-stat--blue">
          <div className="iot-stat-label">Cameras online</div>
          <div className="iot-stat-value">{camsOnline}/{cameras.length}</div>
        </div>
      </div>

      <div className="iot-body">
        <div className="iot-grid-2">
          <div className="iot-card">
            <div className="iot-card-title">
              Alert log
              <button className="iot-btn iot-btn--sm" onClick={onExport}>
                <Icon name="download" />Export HACCP log
              </button>
            </div>
            {alerts.map((a) => (
              <div className="iot-list-row" key={a.id}>
                <div><b>{a.text}</b><span className="iot-sub">{a.time}</span></div>
                {a.acked ? (
                  <Pill tone="off">Acknowledged</Pill>
                ) : (
                  <button className="iot-btn iot-btn--sm iot-btn--primary" onClick={() => onAck(a.id)}>Acknowledge</button>
                )}
              </div>
            ))}
          </div>

          <div className="iot-card">
            <div className="iot-card-title">Cold units now</div>
            {units.map((u) => {
              const s = unitStatus(u);
              return (
                <div className="iot-list-row" key={u.id}>
                  <div><b>{u.name}</b><span className="iot-sub">{u.zone} · limit {u.min} to {u.max} °C</span></div>
                  <b>{fmt(u.online && u.power ? u.now : null)}</b>
                  <Pill tone={s.tone}>{s.label}</Pill>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
