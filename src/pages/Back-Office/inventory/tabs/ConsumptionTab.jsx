import { Metric } from "../SharedInvent";

export default function ConsumptionTab() {
  return (
    <>
      <div className="inv-metrics">
        <Metric label="Dishes sold today" value="0" tone="blue" />
        <Metric label="Ingredient cost used" value="₹0" tone="purple" />
        <Metric label="Taken from store, no indent" value="0" tone="green" />
        <Metric label="Kitchen stock" value="₹9,998" tone="green" />
      </div>
      <div className="inv-body">
        <div className="inv-grid-even">
          <div className="inv-card">
            <div className="inv-card__title">Used today, from recipes</div>
            <div className="inv-muted">No paid sales today yet.</div>
          </div>
          <div className="inv-card">
            <div className="inv-card__title">Consumption movements</div>
            <div className="inv-muted">Nothing consumed yet. Settle a bill to see it.</div>
          </div>
        </div>
        <div className="inv-muted inv-note">
          A "no indent" flag means the dish used stock that was never issued to its station. Issue stock to the kitchen first to keep the trail clean.
        </div>
      </div>
    </>
  );
}
