import { useState } from "react";
import Modal from "../InventoryModal";
import { CloseIcon } from "../SharedInvent";
import { STATIONS, STOCK, KITCHEN_INIT, KITCHEN_ITEMS } from "../InventoryData";

/* Par level = the opening float of that station (KITCHEN_INIT). */
const par = (itemId, station) => Number(KITCHEN_INIT[itemId]?.[station]) || 0;

export default function IndentModal({ kitchen, store, onClose, onSave }) {
  const [station, setStation] = useState(STATIONS[0]);
  const [qty, setQty] = useState({});            // itemId -> request (string)

  const lines = KITCHEN_ITEMS
    .map((it) => ({ itemId: it.id, qty: Number(qty[it.id]) || 0 }))
    .filter((l) => l.qty > 0);
  const hasLines = lines.length > 0;
  const overStore = lines.some((l) => l.qty > (store[l.itemId] ?? 0)); // can't issue more than the store holds

  return (
    <Modal
      title="New indent · request stock for the kitchen"
      size="md"
      onClose={onClose}
      footer={
        <>
          <button className="inv-btn" onClick={onClose}><CloseIcon />Cancel</button>
          <button className="inv-btn" disabled={!hasLines || overStore} title={overStore ? "A request is more than the store holds" : ""}
            onClick={() => onSave({ station, lines, issueNow: true })}>Issue straight away</button>
          <button className="inv-btn inv-btn--primary" disabled={!hasLines}
            onClick={() => onSave({ station, lines, issueNow: false })}>Send to store</button>
        </>
      }
    >
      <label className="inv-field">Station
        <select className="inv-input" value={station} onChange={(e) => setStation(e.target.value)}>
          {STATIONS.map((s) => <option key={s}>{s}</option>)}
        </select>
      </label>

      <div className="inv-table-wrap inv-modal__scroll">
        <table>
          <thead>
            <tr><th>Item</th><th className="inv-right">In kitchen</th><th className="inv-right">Par level</th><th className="inv-right">Request</th></tr>
          </thead>
          <tbody>
            {KITCHEN_ITEMS.map((it) => (
              <tr key={it.id}>
                <td>{it.name}<span className="inv-sub">{it.unit}</span></td>
                <td className="inv-num inv-right">{Number(kitchen[it.id]?.[station]) || 0}</td>
                <td className="inv-num inv-right">{par(it.id, station)}</td>
                <td>
                  <input className="inv-input inv-input--request" type="number" step="0.1" min="0"
                    value={qty[it.id] ?? 0}
                    aria-label={`Request ${it.name}`}
                    onChange={(e) => setQty((q) => ({ ...q, [it.id]: e.target.value }))} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
}
