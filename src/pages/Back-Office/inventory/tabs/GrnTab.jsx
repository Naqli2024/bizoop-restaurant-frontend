import { PlusIcon, Metric, Pill } from "../SharedInvent";
import { STOCK, inr } from "../InventoryData";

const name = (id) => STOCK.find((s) => s.id === id)?.name;

export default function GrnTab({ grns, onReceive }) {
  const received = grns.reduce((a, g) => a + g.value, 0);
  const exceptions = grns.reduce((a, g) => a + g.exceptions, 0);
  const toReturn = grns.reduce((a, g) => a + g.returnValue, 0);
  return (
    <>
      <div className="inv-metrics">
        <Metric label="GRNs today" value={grns.length} tone="blue" />
        <Metric label="Received today" value={inr(received)} tone="green" />
        <Metric label="Exceptions" value={exceptions} tone="amber" />
        <Metric label="To return to suppliers" value={inr(toReturn)} tone="red" />
      </div>
      <div className="inv-body">
        <div className="inv-toolbar">
          <span className="inv-muted">Match compares the PO with what arrived and the invoice rate.</span>
          <span>
            <button className="inv-btn inv-btn--sm inv-btn--primary" onClick={() => onReceive("po")}><PlusIcon />GRN against PO</button>{" "}
            <button className="inv-btn inv-btn--sm" onClick={() => onReceive("direct")}><PlusIcon />Direct GRN</button>
          </span>
        </div>
        {grns.length === 0 ? (
          <div className="inv-card inv-muted">No goods received yet. Use Receive on a purchase order, or post a direct GRN.</div>
        ) : (
          <div className="inv-table-wrap">
            <table>
              <thead>
                <tr><th>GRN</th><th>Time</th><th>Supplier</th><th>Invoice</th><th>Against</th><th>Items</th><th className="inv-right">Value</th><th>Status</th></tr>
              </thead>
              <tbody>
                {grns.map((g) => (
                  <tr key={g.id}>
                    <td><b>{g.id}</b></td>
                    <td>{g.time}</td>
                    <td>{g.supplier}</td>
                    <td>{g.invoice || "—"}</td>
                    <td>{g.poId || "Direct"}</td>
                    <td>{g.lines.map((l) => `${name(l.itemId)} ${+(l.rec - l.rej).toFixed(2)}`).join(", ")}</td>
                    <td className="inv-num inv-right">{inr(g.value)}</td>
                    <td>{g.exceptions ? <Pill tone="warn">{g.exceptions} exception{g.exceptions > 1 ? "s" : ""}</Pill> : <Pill tone="ok">matched</Pill>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
