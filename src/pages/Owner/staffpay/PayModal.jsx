import { CreditCard, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";


const MODES = ["Cash", "UPI", "Bank transfer"];

const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

// Same rules your table already uses:
// monthly = rate × days / 26, weekly = rate × days / 6, daily = rate × days
export const calcGross = (payType, rate, days) => {
  if (payType === "Monthly") return (rate * days) / 26;
  if (payType === "Weekly") return (rate * days) / 6;
  return rate * days;
};

export default function PayModal({ employee, onClose = () => {}, onPay = () => {} }) {
  const [days, setDays] = useState(String(employee.days));
  const [advance, setAdvance] = useState(String(employee.advance));
  const [mode, setMode] = useState(MODES[0]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const figures = useMemo(() => {
    const d = Number(days);
    const a = Number(advance);
    const gross = calcGross(employee.payType, employee.rate, d);
    return { d, a, gross, net: gross - a };
  }, [days, advance, employee]);

  const valid =
    days !== "" && advance !== "" && figures.d >= 0 && figures.a >= 0 && figures.a <= figures.gross;

  const submit = () => {
    if (!valid) return;
    onPay({
      id: employee.id,
      days: figures.d,
      gross: Math.round(figures.gross),
      advance: figures.a,
      net: Math.round(figures.net),
      mode,
    });
  };

  return (
    <div className="pm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="pm-dialog" role="dialog" aria-modal="true" aria-labelledby="pm-title">
        <div className="pm-head">
          <span id="pm-title">
            Pay {employee.name} ({employee.payType})
          </span>
          <button className="pm-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="pm-body">
          <label className="pm-field">
            <span className="pm-field__label">Days worked this cycle</span>
            <input
              className="pm-input"
              type="number"
              min="0"
              value={days}
              onChange={(e) => setDays(e.target.value)}
            />
          </label>

          <label className="pm-field">
            <span className="pm-field__label">Advance / deduction recovered (₹)</span>
            <input
              className="pm-input"
              type="number"
              min="0"
              value={advance}
              onChange={(e) => setAdvance(e.target.value)}
            />
          </label>

          <label className="pm-field pm-field--inline">
            <span className="pm-field__label">Mode</span>
            <select className="pm-input pm-input--select" value={mode} onChange={(e) => setMode(e.target.value)}>
              {MODES.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </label>  
        </div>

        <div className="pm-foot">
          <button className="pm-btn" onClick={onClose}>
            <X size={14} />
            Cancel
          </button>
          <button className="pm-btn pm-btn--success" disabled={!valid} onClick={submit}>
            <CreditCard size={14} />
            Pay &amp; issue salary voucher
          </button>
        </div>
      </div>
    </div>
  );
}
