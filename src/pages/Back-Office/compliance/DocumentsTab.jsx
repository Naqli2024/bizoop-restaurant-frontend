import { CATEGORIES } from "./ComplianceData";
import { fmtLong } from "./ComplianceUtils";
import { Chip, RowAction } from "./ComplianceUi";

export default function DocumentsTab({ rows, query, setQuery, cat, setCat, handlers }) {
  const q = query.trim().toLowerCase();
  const shown = rows.filter(
    ({ doc }) => (cat === "All" || doc.cat === cat) && (!q || `${doc.name} ${doc.no || ""}`.toLowerCase().includes(q))
  );
  return (
    <>
      <div className="cx-toolbar">
        <input className="cx-input" placeholder="Search documents" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select className="cx-input cx-input--auto" value={cat} onChange={(e) => setCat(e.target.value)}>
          <option>All</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <span className="cx-muted cx-toolbar__count">{shown.length} items · sorted by expiry</span>
      </div>
      <div className="cx-tablewrap">
        <table className="cx-table">
          <thead>
            <tr><th>Document</th><th>Category</th><th>Number</th><th>Expiry</th><th>Status</th><th>Linked to</th><th /></tr>
          </thead>
          <tbody>
            {shown.map(({ doc, st }) => (
              <tr key={doc.id}>
                <td>
                  {doc.captured ? <button type="button" className="cx-link" onClick={() => handlers.open(doc.id)}>{doc.name}</button> : doc.name}
                </td>
                <td>{doc.cat}</td>
                <td>{doc.no || "—"}</td>
                <td>{doc.expiry ? fmtLong(doc.expiry) : "—"}</td>
                <td><Chip tone={st.tone}>{st.label}</Chip></td>
                <td>{doc.linked}</td>
                <td><RowAction status={st} id={doc.id} handlers={handlers} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
