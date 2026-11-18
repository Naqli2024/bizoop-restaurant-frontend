import { Field, Icon, Pill, Switch, unitStatus } from "../SharedIot";

export default function DevicesTab({ units, cameras, gateway, onGatewayChange, onTestConnection, onEdit }) {
  const text = (k) => (e) => onGatewayChange({ [k]: e.target.value });

  return (
    <div className="iot-body">
      <div className="iot-grid-2">
        <div className="iot-card">
          <div className="iot-card-title">Gateway / MQTT broker</div>
          <Field label="Broker host" value={gateway.host} placeholder="mqtt.example.com" onChange={text("host")} />
          <Field label="Port" type="number" value={gateway.port} onChange={text("port")} />
          <Field label="Username" value={gateway.user} onChange={text("user")} />
          <Field label="Topic prefix" value={gateway.prefix} onChange={text("prefix")} />
          <Switch label="Use TLS" checked={gateway.tls} onChange={(v) => onGatewayChange({ tls: v })} />
          <button className="iot-btn iot-btn--sm iot-btn--spaced" onClick={onTestConnection}>Test connection</button>
        </div>
        <div className="iot-card">
          <div className="iot-card-title">How devices connect</div>
          <div className="iot-prose">
            Temperature probes and door sensors: MQTT or a BLE / LoRaWAN gateway. Refrigeration controllers: Modbus TCP.
            CCTV: ONVIF with RTSP, plus a stream gateway for browser live view. Anything else: HTTP webhook.
          </div>
        </div>
      </div>

      <div className="iot-table-wrap iot-table-wrap--spaced">
        <table className="iot-table">
          <thead>
            <tr><th>Device</th><th>Type</th><th>Protocol</th><th>Address</th><th>Status</th><th /></tr>
          </thead>
          <tbody>
            {units.map((u) => {
              const s = unitStatus(u);
              return (
                <tr key={u.id}>
                  <td><b>{u.name}</b><span className="iot-sub">{u.zone}</span></td>
                  <td>{u.kind}</td><td>{u.protocol}</td><td>{u.address}</td>
                  <td><Pill tone={s.tone}>{s.label}</Pill></td>
                  <td><button className="iot-btn iot-btn--sm" onClick={() => onEdit(u.id)}><Icon name="pen" />Edit</button></td>
                </tr>
              );
            })}
            {cameras.map((c) => (
              <tr key={c.id}>
                <td><b>{c.name}</b><span className="iot-sub">{c.zone}</span></td>
                <td>Camera</td><td>ONVIF / RTSP</td><td>{c.address}</td>
                <td><Pill tone={c.online ? "ok" : "off"}>{c.online ? "Online" : "Offline"}</Pill></td>
                <td><button className="iot-btn iot-btn--sm" onClick={() => onEdit(c.id)}><Icon name="pen" />Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
