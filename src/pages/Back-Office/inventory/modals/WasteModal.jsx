import { useState } from "react";
import Modal from "../InventoryModal";
import { CloseIcon } from "../SharedInvent";
import { STOCK, WASTE_LOCATIONS, WASTE_REASONS, UNIT_COST } from "../InventoryData";

const nowLabel = () =>
  new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }).toLowerCase();

const CheckIcon = () => (
  <svg className="inv-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
);

export default function WasteModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    itemId: STOCK[0].id,
    where: WASTE_LOCATIONS[0],
    qty: "1",
    reason: WASTE_REASONS[0],
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const qty = Number(form.qty);
  const valid = qty > 0;

  const save = () => {
    if (!valid) return;
    const item = STOCK.find((s) => s.id === form.itemId);
    onSave({
      time: nowLabel(),
      itemId: item.id,
      item: item.name,
      qty: `${qty} ${item.unit}`,
      where: form.where,
      reason: form.reason,
      value: Math.round(qty * (UNIT_COST[item.id] || 0)),
    });
  };

  return (
    <Modal
      title="Log wastage"
      onClose={onClose}
      footer={
        <>
          <button className="inv-btn" onClick={onClose}><CloseIcon />Cancel</button>
          <button className="inv-btn inv-btn--primary" onClick={save} disabled={!valid}><CheckIcon />Save</button>
        </>
      }
    >
      <div className="inv-form-grid">
        <label className="inv-field">Item
          <select className="inv-input" value={form.itemId} onChange={set("itemId")} autoFocus>
            {STOCK.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </label>
        <label className="inv-field">Where it happened
          <select className="inv-input" value={form.where} onChange={set("where")}>
            {WASTE_LOCATIONS.map((l) => <option key={l}>{l}</option>)}
          </select>
        </label>
        <label className="inv-field">Quantity
          <input className="inv-input" type="number" step="0.1" min="0" value={form.qty} onChange={set("qty")} />
        </label>
        <label className="inv-field">Reason
          <select className="inv-input" value={form.reason} onChange={set("reason")}>
            {WASTE_REASONS.map((r) => <option key={r}>{r}</option>)}
          </select>
        </label>
      </div>
    </Modal>
  );
}
