import { Metric } from "../Shared";
import { ANALYTICS_ROWS } from "../MenuData";

export default function AnalyticsTab() {
  const total = ANALYTICS_ROWS.reduce((s, r) => s + r[1], 0);
  return (
    <>
      <div className="rm-metrics">
        <Metric label="Slides shown" value={total} />
        <Metric label="QR scans" value={0} />
        <Metric label="QR orders" value={0} />
        <Metric label="Conversion" value="—" color="var(--rm-blue)" />
      </div>
      <div className="rm-table-wrap">
        <table className="rm-table">
          <thead><tr><th>Screen</th><th className="rm-num">Slides shown</th><th>What was shown</th></tr></thead>
          <tbody>
            {ANALYTICS_ROWS.map(([name, n, what]) => (
              <tr key={name}><td>{name}</td><td className="rm-num">{n}</td><td>{what}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="rm-muted">Counts are real events recorded by players and QR visits on this browser. Viewer estimates would need a camera or sensor, so none are shown. Display-to-order attribution and AI recommendations are not built.</p>
    </>
  );
}
