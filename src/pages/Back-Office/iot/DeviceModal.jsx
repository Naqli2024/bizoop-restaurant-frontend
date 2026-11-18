import { useEffect, useState } from "react";
import { Field, Icon, KIND_OPTIONS, PROTOCOLS } from "./SharedIot";

const EMPTY = {
  name: "", kind: "cold", zone: "", protocol: "MQTT", address: "",
  min: 0, max: 5, alarmDelay: 15, streamUrl: "",
};

/**
 * Add / Edit device modal.
 *  item     – device to edit (form-shaped), or null to add a new one
 *  onSave   – (form) => void
 *  onDelete – () => void   (only shown when editing)
 *  onClose  – () => void
 */
export default function DeviceModal({ item, onSave, onDelete, onClose }) {
  const [form, setForm] = useState(item || EMPTY);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const isEdit = Boolean(item);

  // close on Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="iot-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="iot-modal iot-modal--md" role="dialog" aria-modal="true" aria-labelledby="iot-modal-title">
        <div className="iot-modal-head">
          <span id="iot-modal-title">{isEdit ? "Edit device" : "Add device"}</span>
          <button className="iot-modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="iot-form-grid-2">
          <Field label="Name" value={form.name} onChange={set("name")} />
          <label className="iot-field">
            Type
            <select className="iot-input" value={form.kind} onChange={set("kind")}>
              {KIND_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <Field label="Zone" value={form.zone} onChange={set("zone")} />
          <label className="iot-field">
            Protocol
            <select className="iot-input" value={form.protocol} onChange={set("protocol")}>
              {PROTOCOLS.map((p) => <option key={p}>{p}</option>)}
            </select>
          </label>
        </div>

        <Field label="Address, topic or stream URL" value={form.address} onChange={set("address")} />

        <div className="iot-form-grid-3">
          <Field label="Min °C" type="number" step="0.5" value={form.min} onChange={set("min")} />
          <Field label="Max °C" type="number" step="0.5" value={form.max} onChange={set("max")} />
          <Field label="Alarm delay (min)" type="number" step="0.5" value={form.alarmDelay} onChange={set("alarmDelay")} />
        </div>

        <Field
          label="Live view URL for cameras (HLS .m3u8 or WebRTC page)"
          value={form.streamUrl}
          onChange={set("streamUrl")}
        />

        <div className="iot-modal-foot">
          {isEdit && (
            <button className="iot-btn iot-btn--danger" onClick={onDelete}>
              <Icon name="trash" />Delete
            </button>
          )}
          <button className="iot-btn" onClick={onClose}><Icon name="close" />Cancel</button>
          <button className="iot-btn iot-btn--primary" disabled={!form.name.trim()} onClick={() => onSave(form)}>
            <Icon name="check" />Save
          </button>
        </div>
      </div>
    </div>
  );
}
