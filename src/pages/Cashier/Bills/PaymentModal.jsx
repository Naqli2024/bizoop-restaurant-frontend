import { useEffect, useState } from "react";


const METHODS = ["Cash", "UPI", "Card", "Other", "Mixed"];
const SPLIT_METHODS = ["Cash", "UPI", "Card"];

export default function PaymentModal({ bill, onClose, onSubmit, submitting }) {
  const [amount, setAmount] = useState(String(bill.total || ""));
  const [method, setMethod] = useState("Cash");
  const [split, setSplit] = useState({ Cash: "", UPI: "", Card: "" });

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const amt = Number(amount) || 0;
  const splitTotal = SPLIT_METHODS.reduce(
    (s, m) => s + (Number(split[m]) || 0),
    0
  );
  const mixedOk = method !== "Mixed" || splitTotal === amt;
  const valid = amt > 0 && mixedOk && !submitting;

  const submit = () => {
    if (!valid) return;

    // Payload for PATCH /bills/:id/collect-payment
    const payments =
      method === "Mixed"
        ? SPLIT_METHODS.filter((m) => Number(split[m]) > 0).map((m) => ({
            paymentMethod: m,
            amount: Number(split[m]),
          }))
        : [{ paymentMethod: method, amount: amt }];

    onSubmit({ payments });
  };

  return (
    <div className="pm-overlay" onClick={onClose}>
      <div
        className="pm-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Collect payment"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pm-head">
          <h2>Collect payment · {bill.billNumber}</h2>
          <button
            type="button"
            className="pm-x"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="pm-body">
          <label className="pm-field">
            <span className="pm-label">AMOUNT (₹)</span>
            <input
              type="number"
              inputMode="decimal"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              autoFocus
            />
          </label>

          <div className="pm-field">
            <span className="pm-label">PAYMENT METHOD</span>
            <div
              className="pm-methods"
              role="radiogroup"
              aria-label="Payment method"
            >
              {METHODS.map((m) => (
                <button
                  key={m}
                  type="button"
                  role="radio"
                  aria-checked={method === m}
                  className={"pm-method" + (method === m ? " is-active" : "")}
                  onClick={() => setMethod(m)}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {method === "Mixed" && (
            <div className="pm-split">
              {SPLIT_METHODS.map((m) => (
                <label key={m} className="pm-field">
                  <span className="pm-label">{m.toUpperCase()}</span>
                  <input
                    type="number"
                    min="0"
                    value={split[m]}
                    onChange={(e) =>
                      setSplit({ ...split, [m]: e.target.value })
                    }
                    placeholder="0"
                  />
                </label>
              ))}
              <p className={"pm-hint" + (mixedOk ? "" : " is-error")}>
                Split ₹{splitTotal.toLocaleString("en-IN")} of ₹
                {amt.toLocaleString("en-IN")}
              </p>
            </div>
          )}
        </div>

        <div className="pm-foot">
          <button type="button" className="pm-cancel" onClick={onClose}>
            ✕ Cancel
          </button>
          <button
            type="button"
            className="pm-primary"
            disabled={!valid}
            onClick={submit}
          >
            {submitting ? "Saving..." : "Collect payment"}
          </button>
        </div>
      </div>
    </div>
  );
}