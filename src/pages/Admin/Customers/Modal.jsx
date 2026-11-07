import { useEffect, useRef } from "react";


/**
 * Generic modal shell.
 * Props: title, onClose, footer (node), size ("sm" | "md" | "lg"), children
 */
export default function Modal({ title, onClose, footer, size = "md", children }) {
  const boxRef = useRef(null);

  // Close on Escape, lock page scroll, move focus into the dialog
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    boxRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="md-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={boxRef}
        tabIndex={-1}
        className={`md-box md-box--${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="md-title"
      >
        <div className="md-header">
          <h2 className="md-title" id="md-title">
            {title}
          </h2>
          <button
            type="button"
            className="md-close"
            aria-label="Close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="md-body">{children}</div>

        {footer && <div className="md-footer">{footer}</div>}
      </div>
    </div>
  );
}
