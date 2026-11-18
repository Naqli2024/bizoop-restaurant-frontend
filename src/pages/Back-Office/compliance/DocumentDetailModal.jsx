import { useEffect } from "react";
import { X, RefreshCw } from "lucide-react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmt = (iso) => {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-").map(Number);
  return `${String(d).padStart(2, "0")} ${MONTHS[m - 1]} ${y}`;
};

const STEPS = ["Captured", "Verified", "Active", "Renewal due"];

// 0 = not captured, 1 = waiting for verification, 2 = active, 3 = renewal due
function stageOf(doc, status, verified) {
  if (!doc.captured) return 0;
  if (doc.state === "unverified" && !verified) return 1;
  return ["good", "grey"].includes(status.tone) ? 2 : 3;
}

const Kv = ({ label, value }) => (
  <div className="dm-kv"><span>{label}</span><b>{value || "—"}</b></div>
);

/**
 * Props
 *  doc       – { name, no, authority, outlet, owner, issued, expiry, remind, linked, captured, state, file }
 *  status    – { tone: "good"|"warn"|"bad"|"info"|"review"|"grey", label }
 *  verified  – boolean
 *  history   – [{ date: "YYYY-MM-DD", text }]
 *  onClose(), onProgress(), onNotApplicable(), onRenew()
 */
export default function DocumentDetailModal({ doc, status, verified = false, history = [], onClose, onProgress, onNotApplicable, onRenew }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const stage = stageOf(doc, status, verified);

  return (
    <div className="dm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="dm-box" role="dialog" aria-modal="true">
        <div className="dm-head">
          <span className="dm-title">
            {doc.name} <span className={`dm-chip dm-chip--${status.tone}`}>{status.label}</span>
          </span>
          <button type="button" className="dm-close" aria-label="Close" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="dm-path">
          {STEPS.map((label, i) => (
            <div key={label} className={`dm-path__step${i < stage ? " is-done" : i === stage ? " is-current" : ""}`}>{label}</div>
          ))}
        </div>

        <div className="dm-grid">
          <Kv label="Number" value={doc.no} />
          <Kv label="Issuing authority" value={doc.authority} />
          <Kv label="Outlet" value={doc.outlet || "Main outlet"} />
          <Kv label="Responsible" value={doc.owner || "Manager"} />
          <Kv label="Issued" value={fmt(doc.issued)} />
          <Kv label="Expires" value={fmt(doc.expiry)} />
          <Kv label="Reminder" value={`${doc.remind || 45} days before`} />
          <Kv label="Linked to" value={doc.linked} />
        </div>

        <div className="dm-file">{doc.file ? `File: ${doc.file}` : "No file attached."}</div>

        <h4 className="dm-sub">History</h4>
        {history.length === 0 && <div className="dm-file">No history yet.</div>}
        {history.map((h, i) => (
          <div className="dm-hist" key={i}><span>{fmt(h.date)}</span>{h.text}</div>
        ))}

        <div className="dm-foot">
          <button type="button" className="dm-btn" onClick={onProgress}><RefreshCw size={14} strokeWidth={2.4} />Renewal in progress</button>
          <button type="button" className="dm-btn" onClick={onNotApplicable}>Not applicable</button>
          <button type="button" className="dm-btn dm-btn--primary" onClick={onRenew}><RefreshCw size={14} strokeWidth={2.4} />Renew</button>
        </div>
      </div>
    </div>
  );
}
