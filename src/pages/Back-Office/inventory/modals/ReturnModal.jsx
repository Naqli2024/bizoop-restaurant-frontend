import { useState } from "react";
import Modal from "../InventoryModal";
import { CloseIcon } from "../SharedInvent";
import { STOCK } from "../InventoryData";

export default function ReturnModal({ itemId, station, max, onClose, onSave }) {
  const item = STOCK.find((s) => s.id === itemId);
  const [qty, setQty] = useState(String(max));
  const n = Number(qty);
  const valid = n > 0 && n <= max;

  return (
    <Modal
      title={`Return to store · ${item.name}`}
      onClose={onClose}
      footer={
        <>
          <button className="inv-btn" onClick={onClose}><CloseIcon />Cancel</button>
          <button className="inv-btn inv-btn--primary" disabled={!valid} onClick={() => onSave(n)}>Return</button>
        </>
      }
    >
      <label className="inv-field">
        Quantity ({item.unit}) from {station}, up to {max}
        <input
          className="inv-input"
          type="number" step="0.1" min="0" max={max}
          value={qty}
          autoFocus
          aria-invalid={qty !== "" && !valid}
          onChange={(e) => setQty(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && valid && onSave(n)}
        />
      </label>
    </Modal>
  );
}
