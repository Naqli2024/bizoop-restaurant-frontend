import { Pill } from "../SharedInvent";
import { STOCK, ALERT } from "../InventoryData";

export default function StockTab({ onOrder, onCount }) {
  return (
    <div className="inv-body">
      <div className="inv-table-wrap">
        <table>
          <thead>
            <tr>
              <th>Item</th><th className="inv-right">Store</th><th className="inv-right">Kitchen</th>
              <th className="inv-right">Total</th><th className="inv-right">Use/day</th>
              <th className="inv-right">Cover (days)</th><th>Next expiry</th><th>Alert</th>
              <th>Store count</th><th></th>
            </tr>
          </thead>
          <tbody>
            {STOCK.map((s) => (
              <tr key={s.id}>
                <td>{s.name}<span className="inv-sub">{s.cat} · min {s.min}</span></td>
                <td className="inv-num inv-right">{s.store}</td>
                <td className="inv-num inv-right">{s.kitchen}</td>
                <td className="inv-num inv-right">{s.total}</td>
                <td className="inv-num inv-right">{s.use.toFixed(1)}</td>
                <td className="inv-num inv-right">{s.cover}</td>
                <td>{s.expiry}</td>
                <td><Pill tone={ALERT[s.alert].tone}>{ALERT[s.alert].text}</Pill></td>
                <td>
                  <input className="inv-input inv-input--count" type="number" placeholder="count"
                    onChange={(e) => onCount(s.id, e.target.value)} />
                </td>
                <td>
                  {s.canOrder && <button className="inv-btn inv-btn--sm"  onClick={() => onOrder(s.id)}>Order</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="inv-muted inv-note">
        Cover uses store plus kitchen stock against today's recipe-based consumption with a 10% buffer.
      </div>
    </div>
  );
}
