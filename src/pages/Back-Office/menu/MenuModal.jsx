import { useEffect, useId, useRef } from "react";

/* Reusable dialog shell: backdrop click, Esc, scroll lock, focus handling. */
export default function MenuModal({ title, onClose, children, footer, size = "md" }) {
  const boxRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const prevFocus = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    boxRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="rm-modal" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={boxRef} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby={titleId}
        className={`rm-modal__box rm-modal__box--${size}`}>
        <div className="rm-modal__head">
          <span id={titleId}>{title}</span>
          <button className="rm-modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="rm-modal__body">{children}</div>
        {footer && <div className="rm-modal__foot">{footer}</div>}
      </div>
    </div>
  );
}
