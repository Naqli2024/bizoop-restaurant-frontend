import { Field, Switch } from "../SharedIot";

export default function RulesTab({ rules, notify, onRuleChange, onNotifyChange }) {
  return (
    <div className="iot-body">
      <div className="iot-grid-2">
        <div className="iot-card">
          <div className="iot-card-title">Alert rules</div>
          {rules.map((r) => (
            <Switch key={r.id} label={r.label} checked={r.on} onChange={(v) => onRuleChange(r.id, v)} />
          ))}
        </div>

        <div className="iot-card">
          <div className="iot-card-title">Notify</div>
          <Switch label="WhatsApp" checked={notify.whatsapp} onChange={(v) => onNotifyChange({ whatsapp: v })} />
          <Switch label="SMS" checked={notify.sms} onChange={(v) => onNotifyChange({ sms: v })} />
          <Switch label="Email" checked={notify.email} onChange={(v) => onNotifyChange({ email: v })} />
          <Switch label="App push" checked={notify.push} onChange={(v) => onNotifyChange({ push: v })} />
          <Field
            label="Escalate to owner if not acknowledged (min)"
            type="number"
            value={notify.escalateMin}
            onChange={(e) => onNotifyChange({ escalateMin: e.target.value })}
          />
          <div className="iot-note">Channel delivery needs a messaging service. Choices are saved for it.</div>
        </div>
      </div>
    </div>
  );
}
