import { CATEGORIES } from "./ComplianceData";
import { healthOf, healthLabel } from "./ComplianceUtils";
import { Chip, RowAction } from "./ComplianceUi";

export default function DashboardTab({ rows, onPickCategory, handlers }) {
  const healthScore = healthOf(rows);
  const attention = rows.filter((r) => r.st.attn);
  const count = (tone) => rows.filter((r) => r.st.tone === tone).length;
  const stats = [
    ["Compliance health", `${healthScore} / 100`, "accent"],
    ["Expired or missing", count("bad"), "bad"],
    ["Expiring soon", count("warn"), "accent"],
    ["Awaiting verification", count("review"), "review"],
  ];

  const catRows = CATEGORIES.map((cat) => {
    const list = rows.filter((r) => r.doc.cat === cat);
    const open = list.filter((r) => r.st.attn);
    const hard = open.some((r) => r.st.tone === "bad");
    return { cat, docs: list.length, open: open.length, st: hard ? ["bad", "Action needed"] : open.length ? ["warn", "Attention"] : ["good", "Compliant"] };
  }).filter((c) => c.docs > 0);

  return (
    <>
      <div className="cx-stats">
        {stats.map(([label, value, tone]) => (
          <div key={label} className={`cx-stat cx-stat--${tone}`}>
            <div className="cx-stat__label">{label}</div>
            <div className="cx-stat__value">{value}</div>
          </div>
        ))}
      </div>

      <div className="cx-split">
        <section className="cx-box">
          <h3 className="cx-box__title">Needs attention <Chip>{attention.length}</Chip></h3>
          {attention.map(({ doc, st }) => (
            <div className="cx-issue" key={doc.id}>
              <div>
                <b>{doc.name}</b>
                <span className="cx-issue__meta">{[doc.no, `Linked to ${doc.linked}`].filter(Boolean).join(" · ")}</span>
              </div>
              <Chip tone={st.tone}>{st.label}</Chip>
              <RowAction status={st} id={doc.id} handlers={handlers} />
            </div>
          ))}
        </section>

        <div className="cx-stack">
          <section className="cx-box">
            <h3 className="cx-box__title">Health score</h3>
            <div className="cx-score">{healthScore}</div>
            <div className="cx-meter"><i style={{ width: `${healthScore}%` }} /></div>
            <div className="cx-muted">{healthLabel(healthScore)} · feeds the Command Centre score</div>
          </section>

          <div className="cx-tablewrap">
            <table className="cx-table">
              <thead><tr><th>Category</th><th className="cx-r">Docs</th><th className="cx-r">Open</th><th>Status</th></tr></thead>
              <tbody>
                {catRows.map((c) => (
                  <tr key={c.cat} className="cx-click" onClick={() => onPickCategory(c.cat)}>
                    <td>{c.cat}</td>
                    <td className="cx-r cx-mono">{c.docs}</td>
                    <td className="cx-r cx-mono">{c.open || "–"}</td>
                    <td><Chip tone={c.st[0]}>{c.st[1]}</Chip></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
