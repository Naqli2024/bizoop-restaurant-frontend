import { PlusIcon, CloseIcon, Pill } from "../SharedInvent";
import { inr } from "../InventoryData";

export default function PoTab({ pos, setPo, onDraft, onReceive, highlight = [] }) {
  return (
    <div className="inv-body">
      <div className="inv-toolbar">
        <span className="inv-muted">Drafts are grouped by supplier from the reorder signal.</span>
        <span>
          <button className="inv-btn inv-btn--sm" onClick={() => onDraft()}><PlusIcon />Draft POs from low stock</button>{" "}
          <button className="inv-btn inv-btn--sm inv-btn--primary" onClick={() => onReceive()}>Receive goods</button>
        </span>
      </div>
      <div className="inv-table-wrap">
        <table>
          <thead>
            <tr><th>PO</th><th>Supplier</th><th>Expected</th><th>Items</th><th className="inv-right">Value</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {pos.filter((p) => p.status !== "cancelled").map((p) => (
              <tr key={p.id} className={highlight.includes(p.id) ? "inv-row--highlight" : undefined}>
                <td><b>{p.id}</b></td>
                <td>{p.supplier}</td>
                <td>{p.expected}</td>
                <td>{p.items}</td>
                <td className="inv-num inv-right">{inr(p.value)}</td>
                <td><Pill tone={({ sent: "info", received: "ok" }[p.status] || "muted")}>{p.status}</Pill></td>
                <td className="inv-nowrap">
                  {p.status === "draft" && (
                    <button className="inv-btn inv-btn--sm inv-btn--primary" onClick={() => setPo(p.id, "sent")}>Send</button>
                  )}
                  {p.status === "sent" && (
                    <button className="inv-btn inv-btn--sm inv-btn--primary" onClick={() => onReceive(p.id)}>Receive</button>
                  )}{" "}
                  {p.status !== "received" && (
                    <button className="inv-btn inv-btn--sm" onClick={() => setPo(p.id, "cancelled")}><CloseIcon />Cancel</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
