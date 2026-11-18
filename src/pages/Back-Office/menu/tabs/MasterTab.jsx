import { Switch } from "../Shared";
import { inr, margin } from "../MenuData";

export default function MasterTab({ items, cats, moveCat, addons, setAddonPrice, autoOut, setAutoOut, onEdit }) {
  return (
    <>
      <div className="rm-table-wrap">
        <table className="rm-table">
          <thead><tr>
            <th>Dish</th><th>Category</th><th className="rm-num">Price</th><th className="rm-num">Cost</th>
            <th className="rm-num">Margin</th><th className="rm-num">Portions left</th><th>Status</th><th />
          </tr></thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id}>
                <td>{i.icon} {i.name}{i.sub && <span className="rm-sub">{i.sub}</span>}</td>
                <td>{i.cat}</td>
                <td className="rm-num">{inr(i.price)}</td>
                <td className="rm-num">{i.cost == null ? "—" : inr(i.cost)}</td>
                <td className="rm-num">{margin(i) == null ? "—" : margin(i) + "%"}</td>
                <td className="rm-num">{i.left ?? "—"}</td>
                <td>{i.available
                  ? <span className="rm-pill rm-pill--ok">Available</span>
                  : <span className="rm-pill rm-pill--err">Unavailable</span>}</td>
                <td><button className="rm-btn" onClick={() => onEdit(i.id)}>✎ Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rm-grid2 rm-gap-top">
        <div className="rm-card">
          <div className="rm-card__head">Category order</div>
          {cats.map((c, idx) => (
            <div className="rm-item" key={c}>
              <span>{c}</span>
              <span className="rm-row">
                <button className="rm-btn" aria-label="Move up" onClick={() => moveCat(idx, -1)}>↑</button>
                <button className="rm-btn" aria-label="Move down" onClick={() => moveCat(idx, 1)}>↓</button>
              </span>
            </div>
          ))}
          <div className="rm-muted">Changes the order on every menu without touching dish data.</div>
        </div>

        <div className="rm-card">
          <div className="rm-card__head">Add-ons and modifiers</div>
          {Object.entries(addons).map(([group, rows]) => (
            <div key={group}>
              <div className="rm-item__group">{group}</div>
              {rows.map(([name, price], idx) => (
                <div className="rm-addon" key={name}>
                  <span>{name}</span>
                  <input className="rm-input" type="number" value={price}
                    onChange={(e) => setAddonPrice(group, idx, +e.target.value)} />
                </div>
              ))}
            </div>
          ))}
          <Switch line checked={autoOut} onChange={setAutoOut} label="Mark dishes unavailable when stock runs low" />
        </div>
      </div>
    </>
  );
}
