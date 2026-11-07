import { useEffect, useRef, useState } from "react";



export default function ManagerAuthModal({ open, description, onAuthorise, onCancel }) {
  if (!open) return null;
  // Mounted only while open, so the PIN and error reset every time it opens.
  return <ModalBody description={description} onAuthorise={onAuthorise} onCancel={onCancel} />;
}

function ModalBody({ description, onAuthorise, onCancel }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onCancel();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const submit = async () => {
    if (pin.length < 4) {
      setError("Enter the 4-digit PIN.");
      return;
    }
    setBusy(true);
    const ok = await onAuthorise(pin);
    setBusy(false);
    if (!ok) {
      setError("Wrong PIN. Try again.");
      setPin("");
      inputRef.current?.focus();
    }
  };

  return (
    <div
      className="ma-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="ma-box" role="dialog" aria-modal="true" aria-labelledby="ma-title">
        <div className="ma-header">
          <span id="ma-title">🔐 Manager authorisation</span>
          <button className="ma-close" onClick={onCancel} aria-label="Close">✕</button>
        </div>

        {description && <div className="ma-desc">{description}</div>}

        <div className="ma-field">
          <label className="ma-label" htmlFor="ma-pin">Manager PIN</label>
          <input
            ref={inputRef}
            id="ma-pin"
            className="ma-input"
            type="password"
            inputMode="numeric"
            maxLength={4}
            placeholder="• • • •"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value.replace(/\D/g, ""));
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
          {error && <div className="ma-error" role="alert">{error}</div>}
        </div>

        <div className="ma-hint">Every authorisation is written to the audit log.</div>

        <div className="ma-footer">
          <button className="ma-btn" onClick={onCancel}>Cancel</button>
          <button className="ma-btn ma-btn-primary" onClick={submit} disabled={busy}>
            Authorise
          </button>
        </div>
      </div>
    </div>
  );
}
