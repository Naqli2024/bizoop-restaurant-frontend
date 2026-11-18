import { useEffect, useMemo, useState } from "react";
import "../../../assets/styles/back-office/iot.css"
import {
  AMBIENT, TABS, seedHistory,
  INITIAL_UNITS, INITIAL_CAMERAS, INITIAL_ALERTS, INITIAL_RULES, INITIAL_NOTIFY, INITIAL_GATEWAY,
} from "./DataIot";
import { Icon } from "./SharedIot";
import DeviceModal from "./DeviceModal";
import CameraViewModal from "./CameraViewModal";
import OverviewTab from "./tabs/OverviewTab";
import ColdChainTab from "./tabs/ColdChainTab";
import CamerasTab from "./tabs/CamerasTab";
import DevicesTab from "./tabs/DevicesTab";
import RulesTab from "./tabs/RulesTab";

export default function IotPanel() {
  const [tab, setTab] = useState("ov");
  const [units, setUnits] = useState(INITIAL_UNITS);
  const [cameras, setCameras] = useState(INITIAL_CAMERAS);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [rules, setRules] = useState(INITIAL_RULES);
  const [notify, setNotify] = useState(INITIAL_NOTIFY);
  const [gateway, setGateway] = useState(INITIAL_GATEWAY);
  const [dialog, setDialog] = useState(null); // { id } — id null means "add"
  const [viewCamId, setViewCamId] = useState(null); // camera shown in the live-view modal
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // simulated readings: 1 tick = 1 minute
  useEffect(() => {
    const timer = setInterval(() => {
      setUnits((list) =>
        list.map((u) => {
          if (!u.online) return u;
          const target = u.power ? u.setpoint : AMBIENT;
          const now = +(u.now + (target - u.now) * 0.15 + (Math.random() - 0.5) * 0.4).toFixed(1);
          return { ...u, now, history: [...u.history.slice(1), now] };
        })
      );
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  /* ---- handlers passed to tabs ---- */
  const sendCommand = (id, cmd) => {
    const unit = units.find((u) => u.id === id);
    if (cmd === "def") return showToast(`Defrost started on ${unit.name}`);
    setUnits((list) =>
      list.map((u) => {
        if (u.id !== id) return u;
        if (cmd === "dn") return { ...u, setpoint: +(u.setpoint - 0.5).toFixed(1) };
        if (cmd === "up") return { ...u, setpoint: +(u.setpoint + 0.5).toFixed(1) };
        if (cmd === "pwr") return { ...u, power: !u.power, online: u.online || !u.power };
        return u;
      })
    );
  };

  const ackAlert = (id) => setAlerts((l) => l.map((a) => (a.id === id ? { ...a, acked: true } : a)));

  const exportCsv = () => {
    const rows = [["Time", "Alert", "Acknowledged"], ...alerts.map((a) => [a.time, a.text, a.acked ? "yes" : "no"])];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    link.download = "haccp-log.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const viewCamera = (c) => setViewCamId(c.id);

  const makeUnit = (f, id, prev) => ({
    id,
    name: f.name.trim(), zone: f.zone, kind: f.kind, protocol: f.protocol, address: f.address,
    min: Number(f.min), max: Number(f.max), alarmDelay: Number(f.alarmDelay),
    setpoint: prev?.setpoint ?? (f.kind === "freezer" ? -20 : 3),
    now: prev?.now ?? null,
    online: prev?.online ?? false,
    power: prev?.power ?? true,
    history: prev?.history ?? seedHistory(f.kind === "freezer" ? -20 : 3),
  });

  const makeCamera = (f, id, prev) => ({
    id,
    name: f.name.trim(), zone: f.zone, address: f.address, streamUrl: f.streamUrl.trim(),
    online: prev?.online ?? false,
  });

  const saveDevice = (f) => {
    const id = dialog.id;
    const toCamera = f.kind === "cam";

    if (!id) {
      const newId = `${toCamera ? "c" : "t"}${Date.now()}`;
      if (toCamera) setCameras((l) => [...l, makeCamera(f, newId)]);
      else setUnits((l) => [...l, makeUnit(f, newId)]);
    } else {
      const prevUnit = units.find((u) => u.id === id);
      const prevCam = cameras.find((c) => c.id === id);
      if (toCamera) {
        setUnits((l) => l.filter((u) => u.id !== id));
        setCameras((l) => (prevCam ? l.map((c) => (c.id === id ? makeCamera(f, id, c) : c)) : [...l, makeCamera(f, id)]));
      } else {
        setCameras((l) => l.filter((c) => c.id !== id));
        setUnits((l) => (prevUnit ? l.map((u) => (u.id === id ? makeUnit(f, id, u) : u)) : [...l, makeUnit(f, id)]));
      }
    }
    setDialog(null);
  };

  const deleteDevice = () => {
    setUnits((l) => l.filter((u) => u.id !== dialog.id));
    setCameras((l) => l.filter((c) => c.id !== dialog.id));
    setDialog(null);
  };

  // shape the selected device for the modal form
  const dialogItem = useMemo(() => {
    if (!dialog?.id) return null;
    const u = units.find((x) => x.id === dialog.id);
    if (u) return { ...u, streamUrl: "" };
    const c = cameras.find((x) => x.id === dialog.id);
    return c
      ? { ...c, kind: "cam", protocol: "ONVIF / RTSP", min: 0, max: 5, alarmDelay: 15 }
      : null;
  }, [dialog, units, cameras]);

  /* ---- one component per tab ---- */
  const tabs = {
    ov: <OverviewTab units={units} cameras={cameras} alerts={alerts} onAck={ackAlert} onExport={exportCsv} />,
    cold: <ColdChainTab units={units} onCommand={sendCommand} />,
    cam: <CamerasTab cameras={cameras} onView={viewCamera} onEdit={(id) => setDialog({ id })} />,
    dev: (
      <DevicesTab
        units={units}
        cameras={cameras}
        gateway={gateway}
        onGatewayChange={(patch) => setGateway((g) => ({ ...g, ...patch }))}
        onTestConnection={() => showToast("Connection tests need the gateway service. Settings are saved for it.")}
        onEdit={(id) => setDialog({ id })}
      />
    ),
    rules: (
      <RulesTab
        rules={rules}
        notify={notify}
        onRuleChange={(id, on) => setRules((l) => l.map((r) => (r.id === id ? { ...r, on } : r)))}
        onNotifyChange={(patch) => setNotify((n) => ({ ...n, ...patch }))}
      />
    ),
  };

  return (
    <section className="iot-panel" id="iot-panel">
      <header className="iot-head">
        <span className="iot-title">
          📡 IoT <span className="iot-badge">demo readings · connect a gateway to go live</span>
        </span>
        <button className="iot-btn iot-btn--sm iot-btn--primary" onClick={() => setDialog({ id: null })}>
          <Icon name="plus" />Add device
        </button>
      </header>

      <nav className="iot-tabs" role="tablist">
        {TABS.map(([key, label]) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            className={`iot-tab${tab === key ? " is-active" : ""}`}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </nav>

      <div className="iot-scroll">{tabs[tab]}</div>

      {viewCamId && cameras.some((c) => c.id === viewCamId) && (
        <CameraViewModal
          camera={cameras.find((c) => c.id === viewCamId)}
          onClose={() => setViewCamId(null)}
        />
      )}

      {dialog && (
        <DeviceModal
          key={dialog.id ?? "new"}
          item={dialogItem}
          onSave={saveDevice}
          onDelete={deleteDevice}
          onClose={() => setDialog(null)}
        />
      )}
      {toast && <div className="iot-toast" role="status">{toast}</div>}
    </section>
  );
}
