import { useState } from "react";
import { Plus, Play, CheckCircle, AlertTriangle } from "lucide-react";

const dash = (value) => (value === null || value === undefined ? "—" : value);

const statusClass = (status) => {
  if (status === "In production") return "tag-running";
  if (status === "Completed") return "tag-completed";
  if (status === "Awaiting QC") return "tag-await";
  if (status === "Released") return "tag-completed";
  if (status === "Rejected") return "tag-rejected";

  return "tag-planned";
};

const BatchesTab = ({
  batches,
  sopSteps,
  onPlan,
  onStart,
  onComplete,
  onToggleSopStep,
  onSelectBatch,
  onOpenSOPChecklist,
  onQCPass,
  onQCReject
}) => {
  const [sopBatchId, setSopBatchId] = useState(null);

  const stepsFor = (batch) => sopSteps[batch.sop] || [];
  const sopBatch = batches.find((b) => b.id === sopBatchId);

  return (
    <div className="production-recipes">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <span className="production-batch-muted">
          Planned, then started (materials issued), completed (actuals), then
          released after QC.
        </span>

        <button
          type="button"
          className="production-btn production-btn-primary"
          onClick={onPlan}
        >
          <Plus size={14} />
          Plan batch
        </button>
      </div>

      <div className="production-table-wrap">
        <table className="production-table">
          <thead>
            <tr>
              <th>Batch</th>
              <th>Product</th>
              <th>Station</th>
              <th>Owner</th>
              <th className="num-r">Target</th>
              <th className="num-r">Good</th>
              <th className="num-r">Rejected</th>
              <th className="num-r">Cost / unit</th>
              <th>Status</th>
              <th>SOP</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {batches.length > 0 ? (
              batches.map((batch) => (
                <tr key={batch.id}>
                  <td>
                    <strong>{batch.id}</strong>
                  </td>
                  <td>{batch.product}</td>
                  <td>{batch.station || "Main Kitchen"}</td>
                  <td>{batch.owner || "—"}</td>
                  <td className="num-r">{batch.target}</td>
                  <td className="num-r">{dash(batch.good)}</td>
                  <td className="num-r">{dash(batch.rejected)}</td>
                  <td className="num-r">{dash(batch.costPerUnit != null
                    ? `₹${Number(batch.costPerUnit).toFixed(2)}`
                    : "—")}</td>
                  <td>
                    <span
                      className={`production-tag ${statusClass(batch.status)}`}
                    >
                      {batch.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="production-btn production-btn-secondary"
                      onClick={() => onOpenSOPChecklist(batch)}
                    >
                     SOP {batch.sopDone || 0}/{sopSteps[batch.sop]?.length || 0}
                    </button>
                  </td>
                  <td>
                    {batch.status === "Planned" && (
                      <button
                        type="button"
                        className="production-btn production-btn-primary"
                        onClick={() => onSelectBatch(batch)}
                      >
                        <Play size={14} />
                        Start
                      </button>
                    )}

                    {batch.status === "In production" && (
                      <button
                        type="button"
                        className="production-btn production-btn-primary"
                        onClick={() => onComplete(batch.id)}
                      >
                        <CheckCircle size={14} />
                        Complete
                      </button>
                    )}

                    {batch.status === "Awaiting QC" && (
                      <div className="production-action-group">
                        <button
                          type="button"
                          className="production-btn production-btn-primary"
                          onClick={() =>onQCPass (batch.id)}
                        >
                          <CheckCircle size={14} />
                          QC Pass &amp; Release
                        </button>

                        <button
                          type="button"
                          className="production-btn production-btn-danger"
                          onClick={() => onQCReject(batch.id)}
                        >
                          <AlertTriangle size={14} />
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="production-empty">
                  No batches to display.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BatchesTab;
