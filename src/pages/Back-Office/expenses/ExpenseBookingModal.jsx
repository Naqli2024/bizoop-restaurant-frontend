import { useEffect, useRef, useState } from "react";


const CATEGORIES = [
  "Rent",
  "Electricity & Water",
  "Gas / LPG",
  "Repairs & Maintenance",
  "Marketing",
  "Licences & Fees",
  "Aggregator Commission",
  "Packaging",
  "Misc",
];

const PAY_MODES = ["Cash", "UPI", "Bank transfer", "Card"];

const EMPTY_FORM = { category: CATEGORIES[0], narration: "", amount: "", mode: PAY_MODES[0] };

export default function ExpenseBookingModal({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const firstFieldRef = useRef(null);

  // reset the form and focus the first field each time the modal opens
  useEffect(() => {
    if (open) {
      setForm(EMPTY_FORM);
      setError("");
      firstFieldRef.current?.focus();
    }
  }, [open]);

  // close on Escape and lock page scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const setField = (name) => (e) => setForm((f) => ({ ...f, [name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!amount || amount <= 0) {
      setError("Enter an amount greater than 0.");
      return;
    }
    onSubmit({ ...form, narration: form.narration.trim(), amount });
    onClose();
  };

  return (
    <div
      className="xm-overlay"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="xm-dialog" role="dialog" aria-modal="true" aria-labelledby="xm-title">
        <div className="xm-head">
          <h3 className="xm-title" id="xm-title">Book expense</h3>
          <button type="button" className="xm-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="xm-body">
            <label className="xm-field">
              <span className="xm-label">Category</span>
              <select
                ref={firstFieldRef}
                className="xm-select"
                value={form.category}
                onChange={setField("category")}
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>

            <label className="xm-field">
              <span className="xm-label">Narration</span>
              <input
                className="xm-input"
                value={form.narration}
                onChange={setField("narration")}
              />
            </label>

            <label className="xm-field">
              <span className="xm-label">Amount (₹)</span>
              <input
                className="xm-input"
                type="number"
                min="0"
                step="any"
                value={form.amount}
                onChange={setField("amount")}
                aria-invalid={!!error}
              />
              {error && <span className="xm-error" role="alert">{error}</span>}
            </label>

            <label className="xm-field">
              <span className="xm-label">Paid via</span>
              <select className="xm-select" value={form.mode} onChange={setField("mode")}>
                {PAY_MODES.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="xm-foot">
            <button type="button" className="xm-btn" onClick={onClose}>
              <svg className="xm-btn-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
              Cancel
            </button>
            <button type="submit" className="xm-btn xm-btn-primary">
              Book &amp; issue voucher
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
