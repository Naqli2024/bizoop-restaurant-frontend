import { useState } from "react";

const DAY_END_ROWS = [
  { id: "dough", name: "Parotta dough", opening: 0, produced: 0, sold: 0, processed: 0, wasted: 0 },
  { id: "par", name: "Half-cooked parotta", opening: 120, produced: 0, sold: 0, processed: 0, wasted: 0 },
  { id: "mch", name: "Marinated chicken", opening: 9, produced: 0, sold: 0, processed: 0, wasted: 0 },
  { id: "fry", name: "Chicken fry", opening: 0, produced: 0, sold: 0, processed: 0, wasted: 0 },
  { id: "cry", name: "Chicken curry base", opening: 38, produced: 0, sold: 0, processed: 0, wasted: 0 },
];

// Opening + produced - sold - processed - wasted = expected closing
const expectedClosing = (row) =>
  row.opening + row.produced - row.sold - row.processed - row.wasted;

const round = (value) => Math.round(value * 100) / 100;

const DayEndTab = ({ rows = DAY_END_ROWS, onCount }) => {
  const [counts, setCounts] = useState({});

  const handleCount = (row, raw) => {
    const value = raw === "" ? null : Number(raw);

    setCounts((current) => ({ ...current, [row.id]: value }));

    // A different count raises a variance for review; stock is not changed here.
    if (onCount) onCount(row.id, value, value === null ? null : round(value - expectedClosing(row)));
  };

  const renderVariance = (row) => {
    const count = counts[row.id];
    if (count === null || count === undefined || Number.isNaN(count)) return null;

    const variance = round(count - expectedClosing(row));

    if (variance === 0) {
      return <span className="production-tag tag-completed">Matches</span>;
    }

    return (
      <span className="production-tag tag-running">
        Variance {variance > 0 ? "+" : ""}
        {variance}
      </span>
    );
  };

  return (
    <div className="production-recipes">
      <div className="production-table-wrap">
        <table className="production-table">
          <thead>
            <tr>
              <th>Product</th>
              <th className="num-r">Opening</th>
              <th className="num-r">Produced</th>
              <th className="num-r">Sold</th>
              <th className="num-r">Processed</th>
              <th className="num-r">Wasted / rejected</th>
              <th className="num-r">Expected closing</th>
              <th className="num-r">Physical count</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <strong>{row.name}</strong>
                </td>
                <td className="num-r">{row.opening}</td>
                <td className="num-r">{row.produced}</td>
                <td className="num-r">{row.sold}</td>
                <td className="num-r">{row.processed}</td>
                <td className="num-r">{row.wasted}</td>
                <td className="num-r">
                  <strong>{round(expectedClosing(row))}</strong>
                </td>
                <td className="num-r">
                  <input
                    className="production-input production-input-md"
                    type="number"
                    step="0.1"
                    placeholder="count"
                    value={counts[row.id] ?? ""}
                    aria-label={`${row.name} physical count`}
                    onChange={(e) => handleCount(row, e.target.value)}
                  />
                </td>
                <td>{renderVariance(row)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="production-note">
        Opening plus produced, minus sold, processed and wasted, gives the
        expected closing. A different physical count raises a variance for
        review instead of changing stock.
      </p>
    </div>
  );
};

export default DayEndTab;
