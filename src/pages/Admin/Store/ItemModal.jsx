import React, { useEffect } from "react";
import { X } from "lucide-react";

function Section({ title, rows }) {
  if (!rows?.length) return null;
  return (
    <div className="item-modal__box">
      <div className="item-modal__box-title">{title}</div>
      {rows.map((r) => (
        <div key={r.label} className="item-modal__row">
          <span>{r.label}</span>
          <span
            className={[
              "item-modal__num",
              r.bold && "item-modal__num--bold",
              r.tone && `item-modal__num--${r.tone}`,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {r.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ItemModal({ item, onClose }) {
  useEffect(() => {
    if (!item) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      className="item-modal__overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="item-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="item-modal-title"
      >
        <div className="item-modal__header">
          <span id="item-modal-title">
            {item.icon} {item.name}
            {item.price ? ` · ${item.price}/${item.unit}` : ""}
          </span>
          <button
            type="button"
            className="item-modal__x"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {item.position ? (
          <div className="item-modal__grid">
            <div className="item-modal__col">
              <Section title="Live position" rows={item.position} />
              <Section title="Cost" rows={item.cost} />
            </div>
            <div className="item-modal__col">
              <Section title="Consumption" rows={item.consumption} />
              <Section title="Suppliers" rows={item.suppliers} />
            </div>
          </div>
        ) : (
          <div className="item-modal__box">No data available for this item yet.</div>
        )}

        {item.insight && (
          <div className="item-modal__insight">
            <b>✨ AI</b> {item.insight}
          </div>
        )}

        <div className="item-modal__footer">
          <button type="button" className="item-modal__close-btn" onClick={onClose}>
            <X size={12} aria-hidden="true" />
            <span>Close</span>
          </button>
        </div>
      </div>
    </div>
  );
}
