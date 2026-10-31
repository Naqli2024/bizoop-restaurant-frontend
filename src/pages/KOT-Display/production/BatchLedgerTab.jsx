export const INITIAL_LEDGER = [
  {
    id: "led-1",
    time: "11:06 am",
    movement: "OPENING",
    batch: "CUR-OPEN",
    item: "Chicken curry base",
    qty: 38,
    unit: "portions",
    value: 2228,
    detail: "Opening prepared stock",
  },
  {
    id: "led-2",
    time: "11:06 am",
    movement: "OPENING",
    batch: "MCH-OPEN",
    item: "Marinated chicken",
    qty: 9,
    unit: "kg",
    value: 1934,
    detail: "Opening prepared stock",
  },
  {
    id: "led-3",
    time: "11:06 am",
    movement: "OPENING",
    batch: "PAR-OPEN",
    item: "Half-cooked parotta",
    qty: 120,
    unit: "pcs",
    value: 399,
    detail: "Opening prepared stock",
  },
];

const formatValue = (value) =>
  `₹${Number(value).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

const movementClass = (movement) => {
  switch (movement) {
    case "OUTPUT":
    case "RETURN":
      return "tag-completed";

    case "ISSUE":
    case "CONSUMPTION":
    case "CONVERSION":
    case "WASTE":
      return "tag-waste";

    default:
      return "tag-planned";
  }
};

const BatchLedgerTab = ({ entries = INITIAL_LEDGER }) => (
  <div className="production-recipes">
    <div className="production-table-wrap">
      <table className="production-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Movement</th>
            <th>Batch</th>
            <th>Item</th>
            <th className="num-r">Qty</th>
            <th className="num-r">Value</th>
            <th>Detail</th>
          </tr>
        </thead>

        <tbody>
          {entries.length > 0 ? (
            entries.map((entry) => (
              <tr key={entry.id}>
                <td>{entry.time}</td>
                <td>
                  <span
                    className={`production-tag ${movementClass(entry.movement)}`}
                  >
                    {entry.movement}
                  </span>
                </td>
                <td>{entry.batch}</td>
                <td>{entry.item}</td>
                <td className="num-r">
                  {entry.qty} {entry.unit}
                </td>
                <td className="num-r">{formatValue(entry.value)}</td>
                <td>{entry.detail}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="production-empty">
                No ledger entries yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    <p className="production-note">
      Every issue, consumption, return, output, conversion, waste, sale and
      adjustment references a batch. Store to kitchen moves are also in
      Inventory.
    </p>
  </div>
);

export default BatchLedgerTab;
