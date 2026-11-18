import { FILINGS } from "./ComplianceData";
import { daysFrom, fmtShort, filingStatus } from "./ComplianceUtils";
import { Chip, Btn } from "./ComplianceUi";

export default function FilingsTab({ today, dues, renewed, markDone }) {
  return (
    <div className="cx-tablewrap">
      <table className="cx-table">
        <thead>
          <tr><th>Obligation</th><th>Category</th><th>Due date</th><th className="cx-r">Days left</th><th>Status</th><th /></tr>
        </thead>
        <tbody>
          {FILINGS.map((f) => {
            const due = dues[f.id] ?? f.due;
            const d = daysFrom(today, due);
            const needsRenew = f.kind === "renew" && !renewed.has(f.id); // first click = renewed
            const st = renewed.has(f.id) && !dues[f.id] ? { tone: "good", label: "Renewed" } : filingStatus(d);
            return (
              <tr key={f.id}>
                <td>{f.name}</td>
                <td>{f.cat}</td>
                <td>{fmtShort(due)}</td>
                <td className="cx-r cx-mono">{d}</td>
                <td><Chip tone={st.tone}>{st.label}</Chip></td>
                <td>
                  <Btn variant="success" icon={needsRenew ? "refresh" : "check"} onClick={() => markDone(f)}>
                    {needsRenew ? "Mark renewed" : "Mark filed"}
                  </Btn>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
