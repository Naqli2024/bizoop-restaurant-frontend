import { useEffect, useMemo } from "react";

const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
const fmtQty = (n) => +n.toFixed(1);


export function buildDraftPOs(stock) {
  const byVendor = {};
  stock
    .filter((s) => s.qty <= s.min)
    .forEach((s) => {
      const orderQty = 2 * s.min - s.qty;
      (byVendor[s.vendor] ||= []).push({
        name: s.name,
        unit: s.unit,
        qty: orderQty,
        cost: orderQty * s.rate,
      });
    });
  return Object.entries(byVendor).map(([vendor, lines]) => ({
    vendor,
    lines,
    total: lines.reduce((sum, l) => sum + l.cost, 0),
  }));
}

export default function PurchaseOrderModal({ open, stock, onClose, onSend }) {
  const orders = useMemo(() => buildDraftPOs(stock), [stock]);

  // close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="stock-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="stock-modal" role="dialog" aria-modal="true" aria-labelledby="stock-po-title">
        <div className="stock-modal-header">
          <span id="stock-po-title">🛒 Draft purchase orders</span>
          <button type="button" className="stock-modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="stock-muted stock-modal-note">
          Grouped by vendor, quantity topped up to 2× minimum.
        </div>

        {orders.length === 0 ? (
          <div className="stock-card-note">Nothing to reorder — all items are above minimum.</div>
        ) : (
          orders.map((po) => (
            <div className="stock-card stock-modal-card" key={po.vendor}>
              <div className="stock-card-header">{po.vendor}</div>
              {po.lines.map((l) => (
                <div className="stock-row" key={l.name}>
                  <span>{l.name}</span>
                  <span className="stock-num">
                    {fmtQty(l.qty)} {l.unit} · {inr(l.cost)}
                  </span>
                </div>
              ))}
            </div>
          ))
        )}

        <div className="stock-modal-footer">
          <button type="button" className="stock-btn" onClick={onClose}>✕ Close</button>
          <button
            type="button"
            className="stock-btn stock-btn--primary"
            disabled={orders.length === 0}
            onClick={() => onSend(orders)}
          >
            Send to vendors
          </button>
        </div>
      </div>
    </div>
  );
}
