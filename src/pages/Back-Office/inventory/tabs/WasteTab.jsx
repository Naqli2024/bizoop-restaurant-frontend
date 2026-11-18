import { useMemo } from "react";
import { PlusIcon, Metric } from "../SharedInvent";
import { inr } from "../InventoryData";

export default function WasteTab({ entries, counts = 0, onLog }) {
  const total = entries.reduce((a, w) => a + w.value, 0);
  const topReason = useMemo(() => {
    const t = {};
    entries.forEach((w) => (t[w.reason] = (t[w.reason] || 0) + 1));
    const top = Object.entries(t).sort((a, b) => b[1] - a[1])[0];
    return top ? top[0] : "—";
  }, [entries]);
  return (
    <>
      <div className="inv-metrics">
        <Metric label="Wastage today" value={inr(total)} tone="red" />
        <Metric label="Entries today" value={entries.length} tone="blue" />
        <Metric label="Top reason" value={topReason} tone="amber" />
        <Metric label="Counts logged" value={counts} tone="purple" />
      </div>
      <div className="inv-body">
        <div className="inv-toolbar">
          <span className="inv-muted">Wastage reduces stock where it happened. Store counts are in Stock, kitchen counts in Issue to kitchen.</span>
          <button className="inv-btn inv-btn--sm inv-btn--primary" onClick={onLog}><PlusIcon />Log wastage</button>
        </div>
        <div className="inv-table-wrap">
          <table>
            <thead><tr><th>Time</th><th>Item</th><th className="inv-right">Qty</th><th>Where</th><th>Reason</th><th className="inv-right">Value</th></tr></thead>
            <tbody>
              {entries.map((w, i) => (
                <tr key={i}>
                  <td>{w.time}</td><td>{w.item}</td>
                  <td className="inv-num inv-right">{w.qty}</td>
                  <td>{w.where}</td><td>{w.reason}</td>
                  <td className="inv-num inv-right">{inr(w.value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
