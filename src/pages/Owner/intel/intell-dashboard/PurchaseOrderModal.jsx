import { useEffect, useRef } from "react";


const defaultOrders = [
  { vendor: "Fresh Poultry Co.", lines: [{ item: "Mutton", qty: "7.8 kg", amount: "₹5,928" }] },
  { vendor: "Sakthi Masala", lines: [{ item: "Biryani Masala", qty: "1.9 kg", amount: "₹988" }] },
  { vendor: "Koyambedu Market", lines: [{ item: "Tomato", qty: "11 kg", amount: "₹462" }] },
  { vendor: "Kasimedu Fish Mkt", lines: [{ item: "Seer Fish", qty: "10 kg", amount: "₹7,800" }] },
];

export default function PurchaseOrderModal({
  open = true,
  orders = defaultOrders,
  onClose = () => {},
  
}) {
  const sendRef = useRef(null);

  // close on Escape + focus the primary action when opened
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    sendRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="bz-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bz-dialog" role="dialog" aria-modal="true" aria-labelledby="bz-po-title">
        <div className="bz-dialog-head">
          <span id="bz-po-title">🛒 Draft purchase orders</span>
          <button className="bz-dialog-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <p className="bz-dialog-note">Grouped by vendor, quantity topped up to 2× minimum.</p>

        {orders.map((o) => (
          <div className="bz-vendor-card" key={o.vendor}>
            <div className="bz-vendor-name">{o.vendor}</div>
            {o.lines.map((l) => (
              <div className="bz-vendor-line" key={l.item}>
                <span>{l.item}</span>
                <span className="bz-vendor-qty">{l.qty} · {l.amount}</span>
              </div>
            ))}
          </div>
        ))}

        <div className="bz-dialog-foot">
          <button className="bz-dlg-btn" onClick={onClose}>✕ Close</button>
          <button
            ref={sendRef}
            className="bz-dlg-btn bz-dlg-btn-primary"
            onClick={() => { onClose(); }}
          >
            Send to vendors
          </button>
        </div>
      </div>
    </div>
  );
}
