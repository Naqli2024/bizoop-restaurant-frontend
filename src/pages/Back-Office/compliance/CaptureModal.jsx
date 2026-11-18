import { useEffect, useState } from "react";
import { Camera, Upload, Check, X } from "lucide-react";


// [doc id, label, default renewal period in days]
const DOC_TYPES = [
  ["fssai", "FSSAI licence", 365], ["fostac", "FoSTaC / food-handler training", 730],
  ["medical", "Food-handler medical certificate", 365], ["water", "Potable water test report", 180],
  ["pest", "Pest-control service certificate", 180], ["fire", "Fire NOC / safety certificate", 365],
  ["extg", "Fire extinguisher inspection", 365], ["lpg", "LPG safety inspection", 365],
  ["trade", "Trade licence", 365], ["alc", "Alcohol licence", 365],
  ["sign", "Signboard / advertisement permission", 365], ["music", "Music / entertainment permission", 365],
  ["gst", "GST registration certificate", 0], ["shop", "Shops & Establishments registration", 365],
  ["pf", "PF / ESI registration", 0], ["scale", "Weighing scale verification", 365],
  ["lift", "Lift inspection certificate", 365], ["gen", "Generator / pollution consent", 365],
  ["lease", "Lease / rental agreement", 1095], ["pool", "Swimming pool compliance", 365],
  ["oil", "Used-oil disposal record", 90],
];

const pad = (n) => String(n).padStart(2, "0");
const normIso = (iso) => iso.split("-").map((x) => pad(Number(x))).join("-");
const addDays = (iso, n) => {
  const [y, m, d] = iso.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + n));
  return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`;
};

// defined outside the modal so inputs keep focus while typing
const Field = ({ label, children }) => (
  <label className="cm-field"><span>{label}</span>{children}</label>
);

/**
 * Props
 *  initialType – doc id to preselect (e.g. "fssai")
 *  today       – "YYYY-MM-DD"
 *  getDoc(id)  – returns the saved document (or undefined) to prefill the form
 *  onClose()   – close without saving
 *  onSave(form, verifyNow) – form = { type, no, authority, outlet, issue, period, expiry, owner, remind, notes }
 */
export default function CaptureModal({ initialType = "fssai", today, getDoc = () => undefined, onClose, onSave }) {
  const build = (type) => {
    const doc = getDoc(type) || {};
    const period = DOC_TYPES.find((t) => t[0] === type)?.[2] ?? 365;
    const issue = normIso(today);
    return {
      type,
      no: doc.no || "",
      authority: doc.authority || "",
      outlet: doc.outlet || "Main outlet",
      issue,
      period,
      expiry: period > 0 ? addDays(issue, period) : "",
      owner: doc.owner || "Manager",
      remind: doc.remind || 45,
      notes: "",
    };
  };

  const [form, setForm] = useState(() => build(initialType));
  const [fileName, setFileName] = useState("");
  const isRenew = !!getDoc(form.type)?.captured;
  const title = DOC_TYPES.find((t) => t[0] === form.type)?.[1];

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const autoExpiry = (issue, period) => (Number(period) > 0 && issue ? addDays(issue, Number(period)) : "");
  const pickFile = (e) => setFileName(e.target.files[0]?.name || "");

  const text = (k) => <input className="cm-input" value={form[k]} onChange={set(k)} />;

  return (
    <div className="cm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cm-box" role="dialog" aria-modal="true">
        <div className="cm-head">
          <span>{isRenew ? "Renew" : "Capture"} · {title}</span>
          <button type="button" className="cm-close" aria-label="Close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="cm-drop">
          <div className="cm-drop__row">
            <label className="cm-btn cm-btn--primary">
              <Camera size={14} strokeWidth={2.4} />Scan with camera
              <input type="file" accept="image/*" capture="environment" hidden onChange={pickFile} />
            </label>
            <label className="cm-btn">
              <Upload size={14} strokeWidth={2.4} />Upload photo or PDF
              <input type="file" accept="image/*,.pdf" hidden onChange={pickFile} />
            </label>
          </div>
          <div className="cm-hint">
            {fileName || "No file yet. Text extraction isn't connected in this prototype, so enter the details below."}
          </div>
        </div>

        <div className="cm-grid">
          <Field label="Document type">
            <select className="cm-input" value={form.type} onChange={(e) => setForm(build(e.target.value))}>
              {DOC_TYPES.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
            </select>
          </Field>
          <Field label="Document / licence number">{text("no")}</Field>
          <Field label="Issuing authority">{text("authority")}</Field>
          <Field label="Outlet">{text("outlet")}</Field>
          <Field label="Issue date">
            <input className="cm-input" type="date" value={form.issue}
              onChange={(e) => setForm((f) => ({ ...f, issue: e.target.value, expiry: autoExpiry(e.target.value, f.period) }))} />
          </Field>
          <Field label="Renewal period (days, 0 = none)">
            <input className="cm-input" type="number" min="0" value={form.period}
              onChange={(e) => setForm((f) => ({ ...f, period: e.target.value, expiry: autoExpiry(f.issue, e.target.value) }))} />
          </Field>
          <Field label="Expiry date">
            <input className="cm-input" type="date" value={form.expiry} onChange={set("expiry")} />
          </Field>
          <Field label="Responsible person">{text("owner")}</Field>
          <Field label="Remind me (days before expiry)">
            <input className="cm-input" type="number" min="1" value={form.remind} onChange={set("remind")} />
          </Field>
        </div>
        <div className="cm-grid cm-grid--one"><Field label="Notes">{text("notes")}</Field></div>

        <div className="cm-foot">
          <button type="button" className="cm-btn" onClick={onClose}><X size={14} strokeWidth={2.4} />Cancel</button>
          <button type="button" className="cm-btn" onClick={() => onSave(form, false)}><Check size={14} strokeWidth={2.4} />Save for verification</button>
          <button type="button" className="cm-btn cm-btn--primary" onClick={() => onSave(form, true)}><Check size={14} strokeWidth={2.4} />Save &amp; verify</button>
        </div>
      </div>
    </div>
  );
}
