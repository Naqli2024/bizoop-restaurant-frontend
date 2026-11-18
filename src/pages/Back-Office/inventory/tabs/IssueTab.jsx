import { PlusIcon, Pill } from "../SharedInvent";
import { STATIONS, KITCHEN_ITEMS } from "../InventoryData";

export default function IssueTab({ indents, setIndent, onIssue, onNewIndent, kitchen, onKCount, onReturn }) {
  return (
    <div className="inv-body">
      <div className="inv-toolbar">
        <span className="inv-muted">Kitchen asks, store issues, kitchen confirms. Sales then use the kitchen stock first.</span>
        <button className="inv-btn inv-btn--sm inv-btn--primary" onClick={onNewIndent}><PlusIcon />New indent</button>
      </div>
      <div className="inv-table-wrap">
        <table>
          <thead><tr><th>Indent</th><th>Station</th><th>Requested by</th><th>Items</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {indents.map((d) => (
              <tr key={d.id}>
                <td><b>{d.id}</b></td>
                <td>{d.station}</td>
                <td>{d.by}</td>
                <td>{d.items}</td>
                <td><Pill tone={d.status === "requested" ? "warn" : d.status === "issued" ? "info" : "ok"}>{d.status}</Pill></td>
                <td>
                  {d.status === "requested" && (
                    <button className="inv-btn inv-btn--sm inv-btn--primary" onClick={() => onIssue(d.id)}>Issue</button>
                  )}
                  {d.status === "issued" && (
                    <button className="inv-btn inv-btn--sm inv-btn--success" onClick={() => setIndent(d.id, "received")}>Received</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="inv-card inv-card--spaced">
        <div className="inv-card__title">Stock in the kitchen</div>
        <div className="inv-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                {STATIONS.map((st) => <th key={st} className="inv-right">{st}</th>)}
                <th className="inv-right">Total</th><th></th>
              </tr>
            </thead>
            <tbody>
              {KITCHEN_ITEMS.map((it) => {
                const row = kitchen[it.id] || {};
                const total = STATIONS.reduce((a, st) => a + (Number(row[st]) || 0), 0);
                const home = STATIONS.find((st) => Number(row[st]) > 0) || STATIONS[0];
                return (
                  <tr key={it.id}>
                    <td>{it.name}<span className="inv-sub">{it.unit}</span></td>
                    {STATIONS.map((st) => (
                      <td key={st}>
                        <input
                          className="inv-input inv-input--qty" type="number" step="0.1"
                          value={row[st] ?? 0}
                          aria-label={`${it.name} at ${st}`}
                          onChange={(e) => onKCount(it.id, st, e.target.value)}
                        />
                      </td>
                    ))}
                    <td className="inv-num inv-right">{+total.toFixed(2)}</td>
                    <td><button className="inv-btn inv-btn--sm" onClick={() => onReturn(it.id, home)}>Return</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="inv-muted inv-note">Editing a figure records a kitchen count and logs the variance.</div>
      </div>
    </div>
  );
}
