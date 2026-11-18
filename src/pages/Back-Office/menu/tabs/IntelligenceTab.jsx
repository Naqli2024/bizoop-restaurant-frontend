import { Metric } from "../Shared";
import { CLASSES, inr } from "../MenuData";

export default function IntelligenceTab({ items }) {
  const active = items.filter((i) => i.available).length;
  const sold = items.reduce((s, i) => s + i.sold, 0);
  const revenue = items.reduce((s, i) => s + i.sold * i.price, 0);
  const best = [...items].sort((a, b) => b.sold - a.sold)[0];
  const lowSellers = items.filter((i) => i.sold === 0).length;
  const withCost = items.filter((i) => i.cost != null && i.sold);
  const cm = withCost.length
    ? Math.round((withCost.reduce((s, i) => s + (i.price - i.cost) * i.sold, 0) /
        withCost.reduce((s, i) => s + i.price * i.sold, 0)) * 100) : 0;
  const topSellers = [...items].filter((i) => i.sold).sort((a, b) => b.sold - a.sold);

  return (
    <>
      <div className="rm-metrics">
        <Metric label="Active items" value={`${active}/${items.length}`} />
        <Metric label="Categories" value={new Set(items.map((i) => i.cat)).size} />
        <Metric label="Sold today" value={sold} />
        <Metric label="Best seller" value={best.name} color="var(--rm-green)" />
      </div>
      <div className="rm-metrics">
        <Metric label="Unavailable" value={items.length - active} color="var(--rm-red)" />
        <Metric label="Low sellers" value={lowSellers} color="var(--rm-amber)" />
        <Metric label="Menu revenue" value={inr(revenue)} />
        <Metric label="Contribution margin" value={cm + "%"} color="var(--rm-blue)" />
      </div>

      <div className="rm-grid2">
        {Object.entries(CLASSES).map(([key, c]) => {
          const list = items.filter((i) => i.cls === key);
          return (
            <div className="rm-card" key={key}>
              <div className="rm-card__head"><span>{c.icon} {c.label}</span><span className="rm-count">{list.length}</span></div>
              <div className="rm-muted">{c.note}</div>
              <div className="rm-list-text">{list.map((i) => i.name).join(" · ")}</div>
            </div>
          );
        })}
      </div>

      <div className="rm-table-wrap rm-gap-top">
        <table className="rm-table">
          <thead><tr>
            <th>Dish</th><th className="rm-num">Sold today</th><th className="rm-num">Daily avg</th>
            <th className="rm-num">Today vs avg</th><th className="rm-num">Portions left</th><th>Class</th>
          </tr></thead>
          <tbody>
            {topSellers.map((i) => (
              <tr key={i.id}>
                <td>{i.name}</td>
                <td className="rm-num">{i.sold}</td>
                <td className="rm-num">{i.sold.toFixed(1)}</td>
                <td className="rm-num">0%</td>
                <td className="rm-num">{i.left ?? "—"}</td>
                <td><span className={`rm-pill rm-pill--${CLASSES[i.cls].pill}`}>{CLASSES[i.cls].one}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="rm-muted">Popularity and margin are split at the menu median. Margin uses recipe cost from the BOM. Today vs average compares today's count so far with the average full day.</p>
    </>
  );
}
