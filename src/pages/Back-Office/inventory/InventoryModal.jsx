import { useEffect } from "react";
import { CloseIcon } from "./SharedInvent";

/* Generic dialog: overlay click, Esc key, header with close, footer slot. */
export default function InventoryModal({ title, onClose, footer, size = "sm", children }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="inv-modal" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`inv-modal__box inv-modal__box--${size}`} role="dialog" aria-modal="true" aria-label={title}>
        <div className="inv-modal__head">
          <span>{title}</span>
          <button className="inv-modal__close" onClick={onClose} aria-label="Close"><CloseIcon /></button>
        </div>
        <div className="inv-modal__body">{children}</div>
        {footer && <div className="inv-modal__foot">{footer}</div>}
      </div>
    </div>
  );
}
