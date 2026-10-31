import React, { useState } from "react";

function SplitPaymentModal({ total, onClose, onSave }) {
  const [cash, setCash] = useState(0);
  const [upi, setUpi] = useState(total);
  const [card, setCard] = useState(0);

  const paidTotal = Number(cash) + Number(upi) + Number(card);
  const isValid = paidTotal === total;

  const inr = (amount) =>
    "₹" + Number(amount).toLocaleString("en-IN");

  const handleSave = () => {
    if (!isValid) return;

    onSave({
      cash: Number(cash),
      upi: Number(upi),
      card: Number(card),
    });

    onClose();
  };

  return (
    <div className="split-mo split-show" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="split-mbox split-mbox-sm" role="dialog" aria-modal="true">
        <div className="split-mhdr">
          <span>✂ Split payment</span>
          <button className="split-mclose" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="split-total">
          <span className="split-muted">Bill total</span>
          <b className="split-mono">{inr(total)}</b>
        </div>

        <div className="split-fr split-fr3">
          <div className="split-fg">
            <label className="split-fl" htmlFor="sp-cash">Cash</label>
            <input
              className="split-inp"
              id="sp-cash"
              type="number"
              min="0"
              value={cash}
              onChange={(e) => setCash(e.target.value)}
            />
          </div>

          <div className="split-fg">
            <label className="split-fl" htmlFor="sp-upi">UPI</label>
            <input
              className="split-inp"
              id="sp-upi"
              type="number"
              min="0"
              value={upi}
              onChange={(e) => setUpi(e.target.value)}
            />
          </div>

          <div className="split-fg">
            <label className="split-fl" htmlFor="sp-card">Card</label>
            <input
              className="split-inp"
              id="sp-card"
              type="number"
              min="0"
              value={card}
              onChange={(e) => setCard(e.target.value)}
            />
          </div>
        </div>

        <div
          id="sp-msg"
          style={{
            fontSize: 12,
            marginTop: 10,
            color: isValid ? "var(--green)" : "var(--red)",
          }}
        >
          {isValid
            ? "✔ Adds up to the bill total"
            : `⚠ Difference: ${inr(total - paidTotal)}`}
        </div>

        <div className="split-mfoot">
          <button className="btn" onClick={onClose}>
            ✕ Cancel
          </button>

          <button
            className="btn btn-p"
            onClick={handleSave}
            disabled={!isValid}
          >
            ✓ Save split
          </button>
        </div>
      </div>
    </div>
  );
}

export default SplitPaymentModal;