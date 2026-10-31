
import React, { useState } from "react";

const WASTE_REASONS = [
  "Prep trim",
  "Spoilage",
  "Expired",
  "Overcooked / burnt",
  "Returned by customer",
  "Spill / breakage",
  "Staff meal",
  "Sample / tasting",
];

const WasteModal = ({ item, onClose,onSave }) => {
  const [quantity, setQuantity] = useState("1");
  const [reason, setReason] = useState("Prep trim");
  
  if (!item) return null;

  const handleSave = () => {
    const qty = Number(quantity);

    if (!Number.isFinite(qty) || qty <= 0 || qty > item.qty) {
      return;
    }

    onSave({
      item,
      itemId: item.id,
      quantity: qty,
      unit: item.unit,
      reason,
      movement: "WASTE",
    });

    onClose();
  };


  return (
    <div
      className="production-waste-modal-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="production-waste-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="production-waste-title"
      >
        <div className="production-waste-modal-header">
          <h3 id="production-waste-title">
            Record Waste · {item.name}
          </h3>

          <button
            type="button"
            className="production-waste-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="production-waste-fields">
          <label className="production-form-label">
            Quantity ({item.unit}) ,
            <span className="production-form-hint">
              upto {item.qty} {item.unit}
            </span>

            <input
              className="production-form-input"
              type="number"
              min="0.1"
              max={item.qty}
              step="0.1"
              value={quantity}
              onChange={(event) => {
                setQuantity(event.target.value);
               
              }}
            />
          </label>

          <label className="production-form-label">
            Waste reason

            <select
              className="production-form-input"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            >
              {WASTE_REASONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="production-modal-note">
          The oldest lot is written down first. The cost goes to production loss.
        </p>


        <div className="production-modal-footer">
          <button
            type="button"
            className="production-btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            className="production-btn production-btn-primary"
            onClick={handleSave}
          >
            Record waste
          </button>
        </div>
      </div>
    </div>
  );
};

export default WasteModal;
