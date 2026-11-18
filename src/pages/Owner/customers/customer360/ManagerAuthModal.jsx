import { useEffect, useRef, useState } from "react";

/**
 * Manager PIN modal.
 * Props: open, title, message, demoPin, onAuthorise(), onCancel()
 */
export default function ManagerAuthModal({
  open,
  title = "Manager authorisation",
  message,
  demoPin = "1234",
  onAuthorise,
  onCancel,
}) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setPin("");
    setError("");
    inputRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  const submit = () => {
    if (pin === demoPin) onAuthorise();
    else {
      setError("Incorrect PIN. Try again.");
      setPin("");
      inputRef.current?.focus();
    }
  };

  return (
    <div className="cx-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="cx-dialog" role="dialog" aria-modal="true" aria-labelledby="cx-auth-title">
        <div className="cx-dialog-head">
          <span id="cx-auth-title">🔐 {title}</span>
          <button className="cx-dialog-close" onClick={onCancel} aria-label="Close">✕</button>
        </div>

        <div className="cx-dialog-msg">{message}</div>

        <label className="cx-field-label" htmlFor="cx-auth-pin">Manager PIN</label>
        <input
          ref={inputRef}
          id="cx-auth-pin"
          className={"cx-input cx-pin" + (error ? " cx-pin--bad" : "")}
          type="password"
          inputMode="numeric"
          maxLength={4}
          placeholder="• • • •"
          value={pin}
          onChange={(e) => { setPin(e.target.value.replace(/\D/g, "")); setError(""); }}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        {error && <div className="cx-dialog-error">{error}</div>}
        <div className="cx-dialog-hint">Demo PIN: {demoPin} — every authorisation is written to the audit log.</div>

        <div className="cx-dialog-foot">
          <button className="cx-btn" onClick={onCancel}>✕ Cancel</button>
          <button className="cx-btn cx-btn--main" onClick={submit}>Authorise</button>
        </div>
      </div>
    </div>
  );
}
