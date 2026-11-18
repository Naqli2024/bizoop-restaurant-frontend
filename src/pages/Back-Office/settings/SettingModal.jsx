import { useEffect, useId, useRef } from "react";
import { Button } from "./UiSet";

export default function Modal({ title, onClose, onPrint, children }) {
  const titleId = useId();
  const closeBtn = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") closeRef.current();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <div
      className="stg-modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="stg-modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="stg-modal__head">
          <span id={titleId} className="stg-modal__title">{title}</span>
          <button ref={closeBtn} type="button" className="stg-modal__x" aria-label="Close" onClick={onClose}>
            <svg viewBox="0 0 24 24" className="stg-icon" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="stg-modal__body">{children}</div>

        <div className="stg-modal__foot">
          <Button onClick={onClose}>
            <svg viewBox="0 0 24 24" className="stg-icon" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
            Close
          </Button>
          {onPrint && (
            <Button variant="primary" icon="printer" onClick={onPrint}>Print</Button>
          )}
        </div>
      </div>
    </div>
  );
}
