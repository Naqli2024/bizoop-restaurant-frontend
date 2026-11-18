import { useState } from "react";
import Modal from "../InventoryModal";
import { CloseIcon } from "../SharedInvent";
import { STOCK, oldestBatch, parseIndentItems } from "../InventoryData";

const CheckIcon = () => (
  <svg className="inv-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
);

export default function IssueModal({ indent, store, onClose, onConfirm }) {
  // requested lines (older seeded indents only have a text summary, so parse it)
  const requested = indent.lines || parseIndentItems(indent.items);
  const [qty, setQty] = useState(() => Object.fromEntries(requested.map((l) => [l.itemId, String(l.qty)])));

  const lines = requested
    .map((l) => ({ itemId: l.itemId, qty: Number(qty[l.itemId]) || 0 }))
    .filter((l) => l.qty > 0);
  const tooMuch = lines.some((l) => l.qty > (store[l.itemId] ?? 0));

  return (
    <Modal
      title={`Issue · ${indent.id} to ${indent.station}`}
      size="md"
      onClose={onClose}
      footer={
        <>
          <button className="inv-btn" onClick={onClose}><CloseIcon />Cancel</button>
          <button className="inv-btn inv-btn--primary" disabled={!lines.length || tooMuch} onClick={() => onConfirm(lines)}>
            <CheckIcon />Confirm issue
          </button>
        </>
      }
    >
      <div className="inv-table-wrap">
        <table>
          <thead>
            <tr><th>Item</th><th className="inv-right">Requested</th><th className="inv-right">In store</th><th>Oldest batch</th><th className="inv-right">Issue now</th></tr>
          </thead>
          <tbody>
            {requested.map((l) => {
              const it = STOCK.find((s) => s.id === l.itemId);
              const short = (Number(qty[l.itemId]) || 0) > (store[l.itemId] ?? 0);
              return (
                <tr key={l.itemId}>
                  <td>{it.name}<span className="inv-sub">{it.unit}</span></td>
                  <td className="inv-num inv-right">{l.qty}</td>
                  <td className="inv-num inv-right">{store[l.itemId] ?? 0}</td>
                  <td>{oldestBatch(it)}</td>
                  <td>
                    <input className="inv-input inv-input--request" type="number" step="0.1" min="0"
                      value={qty[l.itemId]} aria-label={`Issue ${it.name}`} aria-invalid={short}
                      onChange={(e) => setQty((q) => ({ ...q, [l.itemId]: e.target.value }))} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="inv-muted inv-note">
        {tooMuch
          ? "An issue quantity is more than the store holds. Reduce it to continue."
          : "Stock moves from the store to the station. The batch with the earliest expiry leaves first."}
      </div>
    </Modal>
  );
}
