
import { useState } from "react";
import { AlertTriangle, Check } from "lucide-react";

const YieldVarianceTab = ({ batches = [] }) => {
  const [approvedVariances, setApprovedVariances] = useState([]);

  // Show batches for which production quantities have been recorded.
  const completedBatches = batches.filter(
    (batch) =>
      batch.good !== null &&
      batch.good !== undefined &&
      ["Awaiting QC", "Released", "Rejected"].includes(batch.status)
  );

  // Calculate the yield details from each batch.
  const yieldRows = completedBatches.map((batch) => {
    const target = Number(batch.target) || 0;
    const good = Number(batch.good) || 0;
    const rejected = Number(batch.rejected) || 0;
    const unexplained = Math.max(0, target - good - rejected);

    const cost =
      Number(batch.actualCost) ||
      good * (Number(batch.costPerUnit) || 0);

    return {
      ...batch,
      target,
      good,
      rejected,
      unexplained,
      yieldPercent: target > 0 ? (good / target) * 100 : 0,
      cost,
    };
  });

  // Create a review item for each batch with unexplained portions.
  const variances = yieldRows
    .filter((batch) => batch.unexplained > 0)
    .map((batch) => ({
      id: `V-${batch.id}`,
      batchId: batch.id,
      kind: "Yield",
      product: batch.product,
      qty: batch.unexplained,
      value:
        Number(batch.varianceValue) ||
        batch.unexplained * (Number(batch.costPerUnit) || 0),
    }));

  const handleApprove = (varianceId) => {
    setApprovedVariances((current) =>
      current.includes(varianceId)
        ? current
        : [...current, varianceId]
    );
  };

  return (
    <div className="yield-variance">
      <div className="yield-table-card">
        <div className="yield-section-heading">
          <h3>Yield &amp; Material Variance</h3>
          <span>{yieldRows.length} batch(es)</span>
        </div>

        <div className="production-table-wrap">
          <table className="production-table yield-table">
            <thead>
              <tr>
                <th>Batch</th>
                <th>Product</th>
                <th className="num-r">Target</th>
                <th className="num-r">Good</th>
                <th className="num-r">Rejected</th>
                <th className="num-r">Unexplained</th>
                <th className="num-r">Yield %</th>
                <th className="num-r">Cost</th>
                <th>Material variances</th>
              </tr>
            </thead>

            <tbody>
              {yieldRows.length > 0 ? (
                yieldRows.map((batch) => (
                  <tr key={batch.id}>
                    <td><strong>{batch.id}</strong></td>
                    <td>{batch.product}</td>
                    <td className="num-r">{batch.target}</td>
                    <td className="num-r">{batch.good}</td>
                    <td className="num-r">{batch.rejected}</td>
                    <td className="num-r">{batch.unexplained}</td>
                    <td className="num-r">
                      {batch.yieldPercent.toFixed(1)}%
                    </td>
                    <td className="num-r">
                      ₹{Math.round(batch.cost).toLocaleString("en-IN")}
                    </td>
                    <td>
                      {batch.materialVariance || "On Standard"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="production-empty">
                    No completed batches yet. Finish a batch and pass QC
                    to view its yield details.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="yield-table-card yield-variance-review">
        <div className="yield-section-heading">
          <h3>
            <AlertTriangle size={17} />
            Variances to review
          </h3>
          <span>
            {variances.filter(
              (item) => !approvedVariances.includes(item.id)
            ).length}{" "}
            open
          </span>
        </div>

        <div className="production-table-wrap">
          <table className="production-table yield-table">
            <thead>
              <tr>
                <th>Ref</th>
                <th>Kind</th>
                <th>Product</th>
                <th className="num-r">Qty</th>
                <th className="num-r">Value</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {variances.length > 0 ? (
                variances.map((item) => {
                  const approved = approvedVariances.includes(item.id);

                  return (
                    <tr key={item.id}>
                      <td>
                        {item.id}
                      </td>
                      <td>{item.kind}</td>
                      <td>{item.product}</td>
                      <td className="num-r">+{item.qty} portions</td>
                      <td className="num-r">
                        ₹{Math.round(item.value).toLocaleString("en-IN")}
                      </td>
                      <td>
                        <span
                          className={`production-tag ${
                            approved ? "tag-completed" : "tag-await"
                          }`}
                        >
                          {approved ? "Approved" : "Open"}
                        </span>
                      </td>
                      <td>
                        {approved ? (
                          <span className="yield-approved">
                            <Check size={14} />
                            Approved
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="production-btn production-btn-primary"
                            onClick={() => handleApprove(item.id)}
                          >
                            <Check size={14} />
                            Approve adjustment
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="production-empty">
                    No yield variances to review.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="yield-review-note">
          Nothing is written off until a manager approves it.
        </p>
      </div>
    </div>
  );
};

export default YieldVarianceTab;
