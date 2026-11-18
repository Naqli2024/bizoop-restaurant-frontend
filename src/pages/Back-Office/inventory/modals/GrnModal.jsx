import { useState } from "react";
import Modal from "../InventoryModal";
import { CloseIcon, PlusIcon } from "../SharedInvent";
import { STOCK, SUPPLIERS, RECEIVE_RATE, parsePoItems, isoExpiry } from "../InventoryData";

const num = (v) => Number(v) || 0;
const stockItem = (id) => STOCK.find((s) => s.id === id);

const newLine = (itemId, ord = null, qty = 1) => ({
  itemId,
  ord,                                   // ordered quantity (null for a direct purchase)
  rec: String(qty),
  rej: "0",
  batch: "",
  exp: isoExpiry(stockItem(itemId)),
  rate: String(RECEIVE_RATE[itemId] ?? 0),
});

const linesFromPo = (po) => (po ? parsePoItems(po.items).map((l) => newLine(l.itemId, l.qty, l.qty)) : []);

export default function GrnModal({ mode: startMode = "po", poId = "", pos, onClose, onPost }) {
  const sentPos = pos.filter((p) => p.status === "sent");
  const [mode, setMode] = useState(startMode);
  const [selPo, setSelPo] = useState(poId);
  const [supplier, setSupplier] = useState("");
  const [invoice, setInvoice] = useState("");
  const [addId, setAddId] = useState(STOCK[0].id);
  const [lines, setLines] = useState(() => (startMode === "po" ? linesFromPo(sentPos.find((p) => p.id === poId)) : []));

  const po = sentPos.find((p) => p.id === selPo);
  const patch = (i, p) => setLines((l) => l.map((x, k) => (k === i ? { ...x, ...p } : x)));
  const field = (i, key) => (e) => patch(i, { [key]: e.target.value });

  const switchMode = (m) => {
    setMode(m);
    setSupplier("");
    setLines(m === "po" ? linesFromPo(po) : []);
  };
  const pickPo = (id) => {
    setSelPo(id);
    setLines(linesFromPo(sentPos.find((p) => p.id === id)));
  };
  const receiveAll = () => setLines((l) => l.map((x) => (x.ord != null ? { ...x, rec: String(x.ord), rej: "0" } : x)));

  const valid =
    lines.length > 0 &&
    (mode === "po" ? !!po : !!supplier) &&
    lines.some((l) => num(l.rec) > 0) &&
    lines.every((l) => num(l.rej) >= 0 && num(l.rej) <= num(l.rec));

  const post = () => {
    const clean = lines.map((l) => ({ ...l, rec: num(l.rec), rej: num(l.rej), rate: num(l.rate) }));
    onPost({
      mode,
      poId: mode === "po" ? po.id : "",
      supplier: mode === "po" ? po.supplier : supplier,
      invoice: invoice.trim(),
      lines: clean,
      value: Math.round(clean.reduce((a, l) => a + (l.rec - l.rej) * l.rate, 0)),
      returnValue: Math.round(clean.reduce((a, l) => a + l.rej * l.rate, 0)),
      exceptions: clean.filter((l) => l.rej > 0 || (l.ord != null && l.rec < l.ord)).length,
    });
  };

  return (
    <Modal
      title={mode === "po" ? "GRN · receive against purchase order" : "GRN · direct purchase (no PO)"}
      size="lg"
      onClose={onClose}
      footer={
        <>
          <button className="inv-btn" onClick={onClose}><CloseIcon />Cancel</button>
          <button className="inv-btn" onClick={receiveAll} disabled={mode !== "po" || !lines.length}>Receive all as ordered</button>
          <button className="inv-btn inv-btn--primary" onClick={post} disabled={!valid}>Post GRN</button>
        </>
      }
    >
      <div className="inv-modal-tabs">
        <button className={`inv-btn inv-btn--sm${mode === "po" ? " inv-btn--primary" : ""}`} onClick={() => switchMode("po")}>Against PO</button>
        <button className={`inv-btn inv-btn--sm${mode === "direct" ? " inv-btn--primary" : ""}`} onClick={() => switchMode("direct")}>Direct purchase</button>
      </div>

      <div className="inv-form-grid">
        {mode === "po" ? (
          <label className="inv-field">Purchase order
            <select className="inv-input" value={selPo} onChange={(e) => pickPo(e.target.value)}>
              <option value="">Select…</option>
              {sentPos.map((p) => <option key={p.id} value={p.id}>{p.id} · {p.supplier}</option>)}
            </select>
          </label>
        ) : (
          <label className="inv-field">Supplier
            <select className="inv-input" value={supplier} onChange={(e) => setSupplier(e.target.value)}>
              <option value="">Select…</option>
              {SUPPLIERS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
        )}
        <label className="inv-field">Supplier invoice no.
          <input className="inv-input" value={invoice} onChange={(e) => setInvoice(e.target.value)} />
        </label>
      </div>

      {lines.length === 0 ? (
        <div className="inv-muted inv-note">Pick a purchase order or add items.</div>
      ) : (
        <div className="inv-table-wrap inv-modal__scroll">
          <table>
            <thead>
              <tr>
                <th>Item</th><th className="inv-right">Ordered</th><th className="inv-right">Received</th>
                <th className="inv-right">Rejected</th><th>Batch no.</th><th>Expiry</th><th className="inv-right">Rate</th><th></th>
              </tr>
            </thead>
            <tbody>
              {lines.map((l, i) => {
                const it = stockItem(l.itemId);
                const bad = num(l.rej) > num(l.rec);
                return (
                  <tr key={`${l.itemId}-${i}`}>
                    <td>{it.name}<span className="inv-sub">{it.unit}</span></td>
                    <td className="inv-num inv-right">{l.ord ?? "—"}</td>
                    <td><input className="inv-input inv-input--sm" type="number" step="0.1" min="0" value={l.rec} onChange={field(i, "rec")} aria-label={`Received ${it.name}`} /></td>
                    <td><input className="inv-input inv-input--sm" type="number" step="0.1" min="0" value={l.rej} onChange={field(i, "rej")} aria-label={`Rejected ${it.name}`} aria-invalid={bad} /></td>
                    <td><input className="inv-input inv-input--batch" value={l.batch} onChange={field(i, "batch")} aria-label={`Batch ${it.name}`} /></td>
                    <td><input className="inv-input" type="date" value={l.exp} onChange={field(i, "exp")} aria-label={`Expiry ${it.name}`} /></td>
                    <td><input className="inv-input inv-input--rate" type="number" min="0" step="0.01" value={l.rate} onChange={field(i, "rate")} aria-label={`Rate ${it.name}`} /></td>
                    <td>
                      <button className="inv-btn inv-btn--sm" aria-label="Remove" onClick={() => setLines((x) => x.filter((_, k) => k !== i))}><CloseIcon /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {mode === "direct" && (
        <div className="inv-add-row">
          <select className="inv-input" value={addId} onChange={(e) => setAddId(e.target.value)}>
            {STOCK.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <button className="inv-btn inv-btn--sm" onClick={() => setLines((l) => [...l, newLine(addId)])}><PlusIcon />Add item</button>
        </div>
      )}

      <div className="inv-muted inv-note">
        Accepted quantity (received minus rejected) goes into the store as a new batch, updates the average cost and creates a payable.
        Rejected quantity is flagged for return to the supplier.
      </div>
    </Modal>
  );
}
