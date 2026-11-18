
import { useState } from "react";


const INITIAL_BATCHES = [
  {
    id: "CG-1028",
    name: "Chicken Gravy",
    unit: "L",
    produced: 50,
    qc: "Passed",
    qcTime: "10:40",
    remaining: 3,
    outlets: [
      { name: "Anna Nagar", dispatched: 15, received: 15, used: 9 },
      { name: "T Nagar", dispatched: 12, received: 11.5, used: 7 },
      { name: "OMR", dispatched: 20, received: 20, used: 4 },
    ],
  },
  {
    id: "BM-0412",
    name: "Biryani Masala Base",
    unit: "kg",
    produced: 20,
    qc: "Passed",
    qcTime: "09:15",
    remaining: 0,
    outlets: [
      { name: "Anna Nagar", dispatched: 6, received: 6, used: 3 },
      { name: "T Nagar", dispatched: 5, received: 5, used: 2 },
      { name: "OMR", dispatched: 9, received: 9, used: 1 },
    ],
  },
];

const WORKFLOW = [
  "Production",
  "Batch",
  "Quality check",
  "Dispatch",
  "Outlet receiving",
  "Consumption",
];

function CentralKitchenTab() {
  const [batches, setBatches] = useState(INITIAL_BATCHES);
  const [feedback, setFeedback] = useState({});

  const dispatchBatch = (batchId) => {
    const batch = batches.find((item) => item.id === batchId);

    if (!batch) return;

    const dispatchQty = 5;

    if (batch.qc !== "Passed") {
      setFeedback((prev) => ({
        ...prev,
        [batchId]: "Dispatch blocked. Quality check is pending.",
      }));
      return;
    }

    if (batch.remaining < dispatchQty) {
      setFeedback((prev) => ({
        ...prev,
        [batchId]: `Insufficient stock. Only ${batch.remaining}${batch.unit} available at the kitchen.`,
      }));
      return;
    }

    setBatches((prev) =>
      prev.map((item) =>
        item.id === batchId
          ? {
              ...item,
              remaining: item.remaining - dispatchQty,
              outlets: item.outlets.map((outlet) =>
                outlet.name === "OMR"
                  ? {
                      ...outlet,
                      dispatched: outlet.dispatched + dispatchQty,
                      received: outlet.received + dispatchQty,
                    }
                  : outlet
              ),
            }
          : item
      )
    );

    setFeedback((prev) => ({
      ...prev,
      [batchId]: `Successfully dispatched ${dispatchQty}${batch.unit} to OMR.`,
    }));
  };

  return (
    <div className="central-kitchen">

      {/* WORKFLOW */}
      <div className="central-kitchen-workflow">
        {WORKFLOW.map((step, index) => (
          <div className="central-kitchen-step" key={step}>
            <span className="central-kitchen-step-tag">
              {index + 1}. {step}
            </span>

            {index !== WORKFLOW.length - 1 && (
              <span className="central-kitchen-arrow">→</span>
            )}
          </div>
        ))}
      </div>

      {/* BATCH CARDS */}
      <div className="central-kitchen-batches">
        {batches.map((batch) => (
          <div className="central-kitchen-card" key={batch.id}>

            {/* HEADER */}
            <div className="central-kitchen-card-header">
              <div>
                <strong>{batch.name}</strong>
                <span className="central-kitchen-batch-id">
                  Batch #{batch.id}
                </span>
              </div>

              <span className="central-kitchen-qc">
                QC Passed {batch.qcTime}
              </span>
            </div>

            {/* PRODUCTION */}
            <div className="central-kitchen-produced">
              Produced: <strong>{batch.produced}{batch.unit}</strong>
            </div>

            {/* OUTLET DETAILS */}
            <div className="central-kitchen-outlets">
              {batch.outlets.map((outlet) => {
                const shortage =
                  outlet.dispatched - outlet.received;

                return (
                  <div
                    className="central-kitchen-outlet"
                    key={outlet.name}
                  >
                    <strong>{outlet.name}</strong>

                    <span>
                      dispatched {outlet.dispatched}
                    </span>

                    <span>
                      received {outlet.received}
                    </span>

                    {shortage > 0 && (
                      <span className="central-kitchen-shortage">
                        short {shortage}{batch.unit}
                      </span>
                    )}

                    <span>
                      used {outlet.used}{batch.unit}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* REMAINING */}
            <div className="central-kitchen-remaining">
              Remaining at kitchen:{" "}
              <strong>
                {batch.remaining}{batch.unit}
              </strong>
            </div>

            {/* DISPATCH */}
            <div className="central-kitchen-actions">
              <button
                className="central-kitchen-dispatch-btn"
                onClick={() => dispatchBatch(batch.id)}
              >
                Dispatch 5 {batch.unit} to OMR
              </button>

              {feedback[batch.id] && (
                <span
                  className={`central-kitchen-feedback ${
                    feedback[batch.id].startsWith("Successfully")
                      ? "success"
                      : "error"
                  }`}
                >
                  {feedback[batch.id]}
                </span>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

export default CentralKitchenTab;
