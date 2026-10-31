
import { useEffect, useState } from "react";
import { X, Check } from "lucide-react";

const MATERIALS = {
  CUR: [
    { name: "Chicken", unit: "kg", standard: 22 },
    { name: "Tomato", unit: "kg", standard: 8 },
    { name: "Onion", unit: "kg", standard: 5 },
    { name: "Cooking Oil", unit: "L", standard: 3 },
    { name: "Biryani Masala", unit: "kg", standard: 0.6 },
  ],
  FRY: [
    { name: "Chicken", unit: "kg", standard: 10 },
    { name: "Marination", unit: "kg", standard: 2 },
    { name: "Cooking Oil", unit: "L", standard: 4 },
    { name: "Spice Mix", unit: "kg", standard: 0.5 },
  ],
};

const REASONS = [
  "Higher trimming loss",
  "Quality rejection",
  "Recipe adjustment",
  "Spillage",
  "Incorrect weighing",
  "Other / unexplained",
];

const REJECT_REASONS = [
  "Prep trim",
  "Spoilage",
  "Expired",
  "Overcooked / burnt",
  "Returned by customer",
  "Spill / breakage",
  "Staff meal",
  "Sample / tasting",
];

const CompleteBatchModal = ({ batch, onClose, onComplete }) => {
  const [materials, setMaterials] = useState([]);
  const [good, setGood] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [rejectReason, setRejectReason] = useState("Prep trim");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!batch) return;

    const items = MATERIALS[batch.sop] || [];

    setMaterials(
      items.map((item) => ({
        ...item,
        issued: item.standard,
        actual: String(item.standard),
        reason: "",
      }))
    );

    setGood(Math.max(0, Number(batch.target || 0) - 3));
    setRejected(2);
    setRejectReason("Prep trim");
    setError("");
  }, [batch]);

  if (!batch) return null;

  const updateMaterial = (index, field, value) => {
    setMaterials((current) =>
      current.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const handleComplete = () => {
    const invalidMaterial = materials.find((item) => {
      const actual = Number(item.actual);

      if (item.actual === "" || !Number.isFinite(actual) || actual < 0) {
        return true;
      }

      const overuse =
        item.standard > 0 && actual > item.standard * 1.05;

      return overuse && !item.reason;
    });

    if (invalidMaterial) {
      setError(
        invalidMaterial.actual === "" ||
          !Number.isFinite(Number(invalidMaterial.actual)) ||
          Number(invalidMaterial.actual) < 0
          ? `Enter a valid actual quantity for ${invalidMaterial.name}.`
          : `Select a reason for excess ${invalidMaterial.name}.`
      );
      return;
    }

    if (
      !Number.isFinite(Number(good)) ||
      !Number.isFinite(Number(rejected)) ||
      Number(good) < 0 ||
      Number(rejected) < 0
    ) {
      setError("Enter valid good and rejected quantities.");
      return;
    }

    onComplete(batch.id, {
      good: Number(good),
      rejected: Number(rejected),
      rejectReason,
      materials: materials.map((item) => ({
        ...item,
        actual: Number(item.actual),
      })),
    });
  };

  return (
    <div
      className="production-waste-modal-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="production-waste-modal production-modal-md production-complete-modal"
        role="dialog"
        aria-modal="true"
      >
        <div className="production-waste-modal-header">
          <span>Complete batch {batch.id}</span>

          <button
            type="button"
            className="production-waste-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="production-table-wrap">
          <table className="production-table">
            <thead>
              <tr>
                <th>Material</th>
                <th className="num-r">Standard</th>
                <th className="num-r">Issued</th>
                <th>Actually used</th>
                <th>Reason if over 5%</th>
              </tr>
            </thead>

            <tbody>
              {materials.map((item, index) => {
                const overuse =
                  item.standard > 0 &&
                  Number(item.actual) > item.standard * 1.05;

                return (
                  <tr key={item.name}>
                    <td>
                      {item.name}
                      <span className="production-muted">
                        {" "}{item.unit}
                      </span>
                    </td>

                    <td className="num-r">{item.standard}</td>
                    <td className="num-r">{item.issued}</td>

                    <td>
                      <input
                        className="production-reason-input production-complete-qty"
                        type="number"
                        min="0"
                        step="0.1"
                        value={item.actual}
                        onChange={(event) =>
                          updateMaterial(index, "actual", event.target.value)
                        }
                      />
                    </td>

                    <td>
                      <select
                        className="production-reason-input"
                        value={item.reason}
                        onChange={(event) =>
                          updateMaterial(index, "reason", event.target.value)
                        }
                        aria-label={`Reason for ${item.name} usage`}
                        
                      >
                        <option value="">—</option>
                        {REASONS.map((reason) => (
                          <option key={reason} value={reason}>
                            {reason}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="production-complete-output">
          <label>
            Good output (portions)
            <input
              className="production-reason-input"
              type="number"
              min="0"
              step="0.1"
              value={good}
              onChange={(event) => setGood(event.target.value)}
            />
          </label>

          <label>
            Rejected (portions)
            <input
              className="production-reason-input"
              type="number"
              min="0"
              step="0.1"
              value={rejected}
              onChange={(event) => setRejected(event.target.value)}
            />
          </label>

          <label>
            Reject reason
            <select
              className="production-reason-input"
              value={rejectReason}
              onChange={(event) => setRejectReason(event.target.value)}
            >
              {REJECT_REASONS.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="production-muted production-complete-note">
          Enter actual production figures. Unused raw material should be
          returned to kitchen stock. Any difference between target, good
          and rejected output can be reviewed as production variance.
        </p>

        {error && (
          <p className="production-complete-error" role="alert">
            {error}
          </p>
        )}

        <div className="production-modal-footer">
          <button
            type="button"
            className="production-btn"
            onClick={onClose}
          >
            <X size={15} />
            Cancel
          </button>

          <button
            type="button"
            className="production-btn production-btn-primary"
            onClick={handleComplete}
          >
            <Check size={15} />
            Complete
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteBatchModal;
