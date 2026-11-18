import { Pill, Metric } from "../SharedInvent";
import { PROCESS_STEPS, MOVEMENTS } from "../InventoryData";

export default function FlowTab({ pipeline, go,movements}) {
  return (
    <>
      <div className="inv-metrics">
        <Metric label="Store stock" value="₹28,717" tone="blue" />
        <Metric label="Kitchen stock" value="₹9,998" tone="purple" />
        <Metric label="Indents waiting" value="1" tone="amber" />
        <Metric label="Batches expiring ≤2 days" value="3" tone="amber" />
      </div>
      <div className="inv-body">
        <div className="inv-pipeline">
          {pipeline.map((p, i) => (
            <button key={p.title} className="inv-pipeline__step" onClick={() => go(p.tab)}>
              <b>{i + 1}</b>{p.title}<span>{p.sub}</span>
            </button>
          ))}
        </div>
        <div className="inv-grid-wide-narrow">
          <div className="inv-card">
            <div className="inv-card__title">How the process works</div>
            <div className="inv-table-wrap">
              <table>
                <thead><tr><th>Step</th><th>What happens</th><th>Who</th></tr></thead>
                <tbody>
                  {PROCESS_STEPS.map(([s, w, who]) => (
                    <tr key={s}><td><b>{s}</b></td><td>{w}</td><td>{who}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="inv-card">
            <div className="inv-card__title">Recent stock movements</div>
            <div className="inv-table-wrap">
              <table>
                <thead>
                  <tr><th>Time</th><th>Movement</th><th>Item</th><th className="inv-right">Qty</th><th>From → to</th><th>Reference</th></tr>
                </thead>
                <tbody>
                  {movements.map((m, i) => (
                    <tr key={i}>
                      <td>{m.time}</td>
                      <td><Pill tone={m.tone}>{m.type}</Pill></td>
                      <td>{m.item}</td>
                      <td className="inv-num inv-right">{m.qty}</td>
                      <td>{m.route}</td>
                      <td>{m.ref}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
