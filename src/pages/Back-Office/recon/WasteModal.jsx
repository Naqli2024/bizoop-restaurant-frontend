import { useEffect, useState } from "react";


const REASON_CODES = [
  "Prep trim",
  "Spoilage",
  "Expired",
  "Overcooked / burnt",
  "Returned by customer",
  "Spill / breakage",
  "Staff meal",
  "Sample / tasting",
];


export default function WasteModal({
  items,
  mode = "log",
  itemId,
  qty,
  onClose,
  onSave  
}) {
  const [selectedItem, setSelectedItem] = useState(itemId ?? items[0]?.id);
  const [quantity, setQuantity] = useState(qty ?? 1);
  const [reason, setReason] = useState(REASON_CODES[0]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSave = () => {
    const n = parseFloat(quantity);
    if (!n || n <= 0) return;
    onSave({ mode, itemId: selectedItem, qty: n, reason });
  };

  return (
    <div
      className="wm-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="wm-box" role="dialog" aria-modal="true" aria-labelledby="wm-title">
        <div className="wm-header">
          <span id="wm-title" className="wm-title">
            <span aria-hidden="true">🗑</span> Log waste / explain variance
          </span>
          <button type="button" className="wm-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="wm-row">
          <div className="wm-field">
            <label className="wm-label" htmlFor="wm-item">Item</label>
            <select
              id="wm-item"
              className="wm-control"
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
            >
              {items.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>
          </div>

          <div className="wm-field">
            <label className="wm-label" htmlFor="wm-qty">Quantity</label>
            <input
              id="wm-qty"
              className="wm-control"
              type="number"
              step="0.1"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
        </div>

        <div className="wm-field">
          <label className="wm-label" htmlFor="wm-reason">Reason code</label>
          <select
            id="wm-reason"
            className="wm-control"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          >
            {REASON_CODES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="wm-footer">
          <button type="button" className="wm-btn" onClick={onClose}>
            <svg className="wm-btn__icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
            Cancel
          </button>
          <button type="button" className="wm-btn wm-btn--primary" onClick={handleSave}>
            <svg className="wm-btn__icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
