


const OUTLET_DATA = [
  {
    name: "Anna Nagar",
    foodCost: 29,
    purchaseRate: 0,
    recipeAdherence: 97,
    waste: 1.8,
    portionVariance: 1,
    stockVariance: 1.2,
  },
  {
    name: "T Nagar",
    foodCost: 34,
    purchaseRate: 6.5,
    recipeAdherence: 88,
    waste: 4.6,
    portionVariance: 7,
    stockVariance: 3.9,
  },
  {
    name: "OMR",
    foodCost: 31,
    purchaseRate: 2,
    recipeAdherence: 93,
    waste: 2.9,
    portionVariance: 3,
    stockVariance: 2.1,
  },
];

function OutletTab() {
  const averageFoodCost =
    OUTLET_DATA.reduce((sum, outlet) => sum + outlet.foodCost, 0) /
    OUTLET_DATA.length;

  const bestOutlet = [...OUTLET_DATA].sort(
    (a, b) => a.foodCost - b.foodCost
  )[0];

  const worstOutlet = [...OUTLET_DATA].sort(
    (a, b) => b.foodCost - a.foodCost
  )[0];

  const foodCostGap = (
    worstOutlet.foodCost - averageFoodCost
  ).toFixed(1);

  return (
    <div className="outlet-comparison">

      {/* COMPARISON TABLE */}
      <div className="outlet-comparison-table-wrap">
        <table className="outlet-comparison-table">
          <thead>
            <tr>
              <th>Outlet</th>
              <th className="right">Food cost</th>
              <th className="right">Purchase rate</th>
              <th className="right">Recipe adherence</th>
              <th className="right">Waste</th>
              <th className="right">Portion var.</th>
              <th className="right">Stock var.</th>
            </tr>
          </thead>

          <tbody>
            {OUTLET_DATA.map((outlet) => (
              <tr key={outlet.name}>
                <td>
                  <strong>{outlet.name}</strong>
                </td>

                <td className={`right ${
                  outlet.foodCost > averageFoodCost ? "high" : ""
                }`}>
                  {outlet.foodCost}%
                </td>

                <td className={`right ${
                  outlet.purchaseRate > 5 ? "high" : ""
                }`}>
                  {outlet.purchaseRate > 0 ? "+" : ""}
                  {outlet.purchaseRate}%
                </td>

                <td className={`right ${
                  outlet.recipeAdherence < 90 ? "high" : ""
                }`}>
                  {outlet.recipeAdherence}%
                </td>

                <td className={`right ${
                  outlet.waste > 3 ? "high" : ""
                }`}>
                  {outlet.waste}%
                </td>

                <td className={`right ${
                  outlet.portionVariance > 5 ? "high" : ""
                }`}>
                  +{outlet.portionVariance}%
                </td>

                <td className={`right ${
                  outlet.stockVariance > 3 ? "high" : ""
                }`}>
                  {outlet.stockVariance}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* INSIGHT CARD */}
      <div className="outlet-comparison-insight">

        <div className="outlet-comparison-insight-title">
          <span>🔎</span>
          Why is {worstOutlet.name} different?
        </div>

        <p>
          Food cost is{" "}
          <strong>{foodCostGap} pts</strong> above the
          chain average.
          Biggest drivers:
          <strong> Recipe adherence and Waste.</strong>
          Also review sales mix and staff on shift.
        </p>

        <div className="outlet-comparison-note">
          BOS ranks each driver by its deviation from the best outlet.
        </div>

      </div>

    </div>
  );
}

export default OutletTab;
