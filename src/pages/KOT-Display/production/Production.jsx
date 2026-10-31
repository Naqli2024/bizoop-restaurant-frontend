
import { useState } from "react";
import {
  Plus,
  Play,
  ChefHat,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

import PlanProductionModal from "./PlanProductionModal";
import BatchesTab from "./BatchesTab";
import RecipesTab from "./RecipesTab";
import BatchLedgerTab, { INITIAL_LEDGER } from "./BatchLedgerTab";
import DayEndTab from "./DayEndTab";
import StockTab from "./StockTab";
import StartBatchModal from "./StartBatchModal";
import IncompleteModal from "./InCompleteModal";
import SOPChecklistModal from "./SOPChecklistModal";
import CompleteBatchModal from "./CompleteBatchModal";
import RunningTab from "./RunningTab";
import YieldVarianceTab from "./YieldVarianceTab";
import "../../../assets/styles/production.css";

const TODAY = "20261028";

const SOP_STEPS = {
  DOUGH: [
    "Measure maida, water, oil, and salt",
    "Mix ingredients into a dough",
    "Knead thoroughly until smooth",
    "Rest the dough",
    "Divide into portions",
    "Check quality and cover",
  ],
  PAR: [
    "Prepare dough",
    "Knead thoroughly",
    "Rest the dough",
    "Divide into portions",
    "Roll and shape",
    "Check quality",
  ],
  MCH: [
    "Clean and portion chicken",
    "Measure marinade ingredients",
    "Mix chicken with marinade",
    "Ensure all pieces are coated",
    "Label with preparation date and time",
    "Cover and store under refrigeration",
  ],
  CUR: [
    "Wash and portion chicken",
    "Prepare onion-tomato masala",
    "Roast spices",
    "Cook base",
    "Check salt and spice",
    "Cool and portion",
    "Label and store",
  ],
  FRY: [
    "Wash and portion chicken",
    "Marinate",
    "Heat oil to temperature",
    "Fry in batches",
    "Drain and hold hot",
  ],
};

const INITIAL_BATCHES = [
  {
    id: `CUR-${TODAY}-001`,
    sop: "CUR",
    product: "Chicken curry base",
    target: 100,
    good: null,
    rejected: null,
    costPerUnit: 96.39,
    status: "Planned",
    station: "Main Kitchen",
    owner: "Chef Murugan",
    startedAt: null,
    estimatedMinutes: 90,
    sopDone: 0,
    materials: [
      { name: "Chicken", qty: "22 kg" },
      { name: "Tomato", qty: "8 kg" },
      { name: "Onion", qty: "5 kg" },
      { name: "Cooking Oil", qty: "3 L" },
      { name: "Biryani Masala", qty: "0.6 kg" },
    ],
  },
  {
    id: `FRY-${TODAY}-001`,
    sop: "FRY",
    product: "Chicken fry",
    target: 40,
    good: null,
    rejected: null,
    costPerUnit: 85.5,
    status: "Planned",
    station: "Main Kitchen",
    owner: "Chef Murugan",
    startedAt: null,
    estimatedMinutes: 90,
    sopDone: 0,
    materials: [
      { name: "Chicken", qty: "10 kg" },
      { name: "Cooking Oil", qty: "2 L" },
      { name: "Fry Masala", qty: "0.5 kg" },
    ],
  },
];

const TABS = [
  { id: "dash", label: "Dashboard" },
  { id: "run", label: "Running" },
  { id: "batch", label: "Batches" },
  { id: "stock", label: "Semi-finished & ready stock" },
  { id: "rec", label: "Recipes" },
  { id: "var", label: "Yield & variance" },
  { id: "day", label: "Day-end" },
  { id: "led", label: "Batch ledger" },
];

const PRODUCTS = [
  { value: "dough", code: "DOUGH", label: "Parotta dough" },
  { value: "par", code: "PAR", label: "Half-cooked parotta" },
  { value: "mch", code: "MCH", label: "Marinated chicken" },
  { value: "fry", code: "FRY", label: "Chicken fry" },
  { value: "cry", code: "CUR", label: "Chicken curry base" },
];

const BATCH_IDS = {
  par: "PAR-OPEN",
  mch: "MCH-OPEN",
  cry: "CUR-OPEN",
  fry: "FRY-OPEN",
  dough: "DOUGH-OPEN",
};

const CRITICAL_STEPS = {
  CUR: [
    "Cook chicken to a core temperature of 75 °C",
    "Hold above 60 °C, or chill below 5 °C within 2 hours",
  ],
  FRY: [
    "Cook chicken to a core temperature of 75 °C",
    "Maintain safe hot-holding temperature above 60 °C",
  ],
};

const makeBatchId = (code) =>
  `${code}-${TODAY}-${String(Date.now()).slice(-5)}`;

const Production = () => {
  const [activeTab, setActiveTab] = useState("batch");
  const [batches, setBatches] = useState(INITIAL_BATCHES);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [ledgerEntries, setLedgerEntries] = useState(INITIAL_LEDGER);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [incompleteBatch, setIncompleteBatch] = useState(null);
  const [showSOPChecklist, setShowSOPChecklist] = useState(null);
  const [completeBatch, setCompleteBatch] = useState(null);
  const [overrideReason, setOverrideReason] = useState("");

  const plannedCount = batches.filter(
    (batch) => batch.status === "Planned"
  ).length;

  const runningCount = batches.filter(
    (batch) => batch.status === "In production"
  ).length;

  const addLedgerEntry = (entry) => {
    setLedgerEntries((current) => [
      {
        id: `LED-${Date.now()}`,
        time: new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        ...entry,
      },
      ...current,
    ]);
  };

  // Create a new batch. It starts only when explicitly requested.
  const handlePlanBatch = (data, startImmediately = false) => {
    const productInfo = PRODUCTS.find(
      (item) => item.value === data.product
    );

    const code = productInfo?.code || String(data.product).toUpperCase();
    const target = Number(data.target ?? data.qty);

    if (!Number.isFinite(target) || target < 1) {
      window.alert("Enter a quantity greater than zero.");
      return;
    }

    const newBatch = {
      id: makeBatchId(code),
      sop: code,
      product: productInfo?.label || data.productDetails?.label || data.product,
      target,
      good: null,
      rejected: null,
      costPerUnit: null,
      status: startImmediately ? "In production" : "Planned",
      station: data.station || "Main Kitchen",
      owner: data.owner || "Chef Murugan",
      startedAt: startImmediately ? new Date().toISOString() : null,
      estimatedMinutes: 90,
      sopDone: 0,
      sopChecklist: [],
      materials: (data.requirements || [])
        .filter((item) => !item.prepared)
        .map((item) => ({
          name: item.name,
          qty: `${item.needed} ${item.unit}`,
        })),
      plannedData: data,
    };

    setBatches((current) => [newBatch, ...current]);
    setShowPlanModal(false);
    setActiveTab(startImmediately ? "run" : "batch");
  };

  // Plan several batches from the day plan without starting them.
  const handleCreateBatches = (data) => {
    const productInfo = PRODUCTS.find(
      (item) => item.value === data.product
    );

    const code = productInfo?.code || String(data.product).toUpperCase();
    const total = Number(data.target ?? data.qty);

    if (!Number.isFinite(total) || total < 1) {
      window.alert("Enter a quantity greater than zero.");
      return;
    }

    const count = data.mode === "day" ? 2 : 1;
    const baseQty = Math.floor(total / count);
    const remainder = total - baseQty * count;

    const newBatches = Array.from({ length: count }, (_, index) => ({
      id: makeBatchId(code),
      sop: code,
      product: productInfo?.label || data.productDetails?.label || data.product,
      target: baseQty + (index === 0 ? remainder : 0),
      good: null,
      rejected: null,
      costPerUnit: null,
      status: "Planned",
      station: data.station || "Main Kitchen",
      owner: data.owner || "Chef Murugan",
      startedAt: null,
      estimatedMinutes: 90,
      sopDone: 0,
      sopChecklist: [],
      plannedData: data,
    }));

    setBatches((current) => [...newBatches, ...current]);
    setShowPlanModal(false);
    setActiveTab("batch");
  };

  // Start an existing planned batch, not a new batch.
  // Supports callbacks that pass the batch or an object containing its ID.
  const handleStartBatch = (data) => {
    const batchId =
      data?.id ||
      data?.batch?.id ||
      selectedBatch?.id;

    if (!batchId) {
      window.alert("Select a batch to start.");
      return;
    }

    const batch = batches.find((item) => item.id === batchId);

    if (!batch) {
      window.alert("The selected batch could not be found.");
      return;
    }

    if (batch.status !== "Planned") {
      window.alert("Only planned batches can be started.");
      return;
    }

    setBatches((current) =>
      current.map((item) =>
        item.id === batchId
          ? {
              ...item,
              status: "In production",
              startedAt: new Date().toISOString(),
            }
          : item
      )
    );

    setSelectedBatch(null);
    setShowPlanModal(false);
    setActiveTab("run");
  };

  const handleMoveToKitchen = (data) => {
    (data.requirements || []).forEach((item) => {
      if (item.prepared) return;

      const quantity = Number(data.bring?.[item.id]) || 0;
      if (quantity <= 0) return;

      addLedgerEntry({
        movement: "TRANSFER TO KITCHEN",
        batch: "PLANNED",
        item: item.name,
        qty: quantity,
        unit: item.unit,
        value: 0,
        detail: "Production material transfer",
      });
    });

    (data.extraBring || []).forEach((item) => {
      addLedgerEntry({
        movement: "TRANSFER TO KITCHEN",
        batch: "PLANNED",
        item: item.name,
        qty: item.qty,
        unit: item.unit,
        value: 0,
        detail: "Additional material transfer",
      });
    });
  };

  const handleMoveMaterials = (data) => {
    handleMoveToKitchen(data);
  };

  const handleCreateAndMoveMaterials = (data) => {
    handleCreateBatches(data);
    handleMoveToKitchen(data);
  };

  const handleWaste = (record) => {
    const item = record.item;
    const costPerUnit =
      item.qty > 0 ? (item.value || 0) / item.qty : 0;

    addLedgerEntry({
      movement: "WASTE",
      batch: BATCH_IDS[record.itemId] || "UNKNOWN",
      item: item.name,
      qty: record.quantity,
      unit: record.unit,
      value: Math.round(costPerUnit * record.quantity),
      detail: record.reason,
    });
  };

  const handleOpenSOPChecklist = (batch) => {
    setShowSOPChecklist(batch);
  };

  const handleCompleteBatch = (batchId) => {
    const batch = batches.find((item) => item.id === batchId);

    if (!batch || batch.status !== "In production") return;

    const steps = SOP_STEPS[batch.sop] || [];
    const criticalSteps = CRITICAL_STEPS[batch.sop] || [];

    if (batch.sopDone < steps.length) {
      setIncompleteBatch({ batch, criticalSteps });
      return;
    }

    setCompleteBatch(batch);
  };

  const handleCompleteAnyway = (batch, reason) => {
    setIncompleteBatch(null);
    setCompleteBatch(batch);
    setOverrideReason(reason);
  };

  const handleToggleSopStep = (batchId, index) => {
    setBatches((current) =>
      current.map((batch) => {
        if (batch.id !== batchId) return batch;

        const sopDone =
          index + 1 === batch.sopDone ? index : index + 1;

        return { ...batch, sopDone };
      })
    );
  };

  const handleProcessStock = (target) => {
    const code = String(target.id).toUpperCase();

    const newBatch = {
      id: makeBatchId(code),
      sop: code,
      product: target.label,
      target: Number(target.target),
      good: null,
      rejected: null,
      costPerUnit: null,
      status: "Planned",
      station: "Main Kitchen",
      owner: "Chef Murugan",
      startedAt: null,
      estimatedMinutes: 90,
      sopDone: 0,
    };

    setBatches((current) => [newBatch, ...current]);
    setActiveTab("batch");
  };

  const handleSaveSOP = (batchId, completedCount, steps) => {
    setBatches((current) =>
      current.map((batch) =>
        batch.id === batchId
          ? {
              ...batch,
              sopDone: completedCount,
              sopChecklist: steps,
            }
          : batch
      )
    );

    setShowSOPChecklist(null);
  };

  const handleDiscardExpired = () => {
    // Connect your expiry-discard API here.
  };

  const handleQCPass = (batchId) => {
    setBatches((current) =>
      current.map((batch) =>
        batch.id === batchId
          ? {
              ...batch,
              status: "Released",
              qcStatus: "Passed",
            }
          : batch
      )
    );

    setActiveTab("var");
  };

  const handleQCReject = (batchId) => {
    setBatches((current) =>
      current.map((batch) =>
        batch.id === batchId
          ? {
              ...batch,
              status: "Rejected",
              qcStatus: "Rejected",
            }
          : batch
      )
    );
  };

  const handleFinishBatch = (batchId, actuals) => {
    setBatches((current) =>
      current.map((batch) =>
        batch.id === batchId
          ? {
              ...batch,
              status: "Awaiting QC",
              good: actuals.good,
              rejected: actuals.rejected,
              rejectReason: actuals.rejectReason,
              actualMaterials: actuals.materials,
              qcStatus: "Pending",
            }
          : batch
      )
    );

    setCompleteBatch(null);
    setOverrideReason("");
  };

  const statusClass = (status) => {
    if (status === "In production") return "tag-running";
    if (status === "Completed" || status === "Released") {
      return "tag-completed";
    }
    if (status === "Awaiting QC") return "tag-await";
    if (status === "Rejected") return "tag-rejected";
    return "tag-planned";
  };

  const renderBatchTable = (items) => (
    <div className="production-table-wrap">
      <table className="production-table">
        <thead>
          <tr>
            <th>Batch</th>
            <th>Product</th>
            <th className="num-r">Target</th>
            <th>Station</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.length ? (
            items.map((batch) => (
              <tr key={batch.id}>
                <td><strong>{batch.id}</strong></td>
                <td>{batch.product}</td>
                <td className="num-r">{batch.target} portions</td>
                <td>{batch.station || "Main Kitchen"}</td>
                <td>
                  <span className={`production-tag ${statusClass(batch.status)}`}>
                    {batch.status}
                  </span>
                </td>
                <td>
                  {batch.status === "Planned" && (
                    <button
                      type="button"
                      className="production-btn production-btn-primary"
                      onClick={() => setSelectedBatch(batch)}
                    >
                      <Play size={14} /> Start
                    </button>
                  )}

                  {batch.status === "In production" && (
                    <button
                      type="button"
                      className="production-btn production-btn-primary"
                      onClick={() => handleCompleteBatch(batch.id)}
                    >
                      <CheckCircle size={14} /> Complete
                    </button>
                  )}

                  {batch.status === "Awaiting QC" && (
                    <div className="production-action-group">
                      <button
                        type="button"
                        className="production-btn production-btn-primary"
                        onClick={() => handleQCPass(batch.id)}
                      >
                        <CheckCircle size={14} /> QC Pass &amp; Release
                      </button>
                      <button
                        type="button"
                        className="production-btn production-btn-danger"
                        onClick={() => handleQCReject(batch.id)}
                      >
                        <AlertTriangle size={14} /> Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="production-empty">
                No batches to display.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <section className="production-panel">
      <div className="production-header">
        <div className="production-heading">
          <h2>
            <ChefHat size={21} /> Production control
          </h2>
          <span className="production-badge">
            plan → issue → batch → QC → ready stock → sale
          </span>
        </div>

        <button
          type="button"
          className="production-btn production-btn-primary"
          onClick={() => setShowPlanModal(true)}
        >
          <Plus size={16} /> Plan batch
        </button>
      </div>

      <div className="production-tabs">
        {TABS.map((tab) => (
          <button
            type="button"
            key={tab.id}
            className={`production-tab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.id === "run" && ` (${runningCount})`}
          </button>
        ))}
      </div>

      <div className="production-content">
        {activeTab === "dash" && (
          <>
            <div className="production-metrics">
              <div className="production-metric metric-blue">
                <span>Batches planned</span>
                <strong>{plannedCount}</strong>
              </div>
              <div className="production-metric metric-purple">
                <span>In production</span>
                <strong>{runningCount}</strong>
              </div>
              <div className="production-metric metric-green">
                <span>Ready stock value</span>
                <strong>₹4,561</strong>
              </div>
              <div className="production-metric metric-orange">
                <span>Production wastage</span>
                <strong>—</strong>
              </div>
            </div>

            <div className="production-dashboard">
              <div className="production-card">
                <div className="production-card-header">
                  <h3>Today's production plan</h3>
                  <button
                    type="button"
                    className="production-btn production-btn-primary"
                    onClick={() => setShowPlanModal(true)}
                  >
                    <Plus size={14} /> Plan batch
                  </button>
                </div>
                {renderBatchTable(batches)}
              </div>

              <div className="production-card">
                <div className="production-card-header">
                  <h3>Watch list</h3>
                  <AlertTriangle size={17} />
                </div>

                {batches.filter(
                  (batch) =>
                    batch.good != null &&
                    ["Awaiting QC", "Released"].includes(batch.status) &&
                    batch.target - batch.good - (batch.rejected || 0) > 0
                ).length ? (
                  batches
                    .filter(
                      (batch) =>
                        batch.good != null &&
                        ["Awaiting QC", "Released"].includes(batch.status) &&
                        batch.target - batch.good - (batch.rejected || 0) > 0
                    )
                    .map((batch) => {
                      const unexplained =
                        batch.target - batch.good - (batch.rejected || 0);

                      return (
                        <div className="production-watch-item" key={batch.id}>
                          <div className="production-watch-details">
                            <strong>Yield variance · {batch.product}</strong>
                            <span>
                              {unexplained} portions · ₹
                              {Math.round(
                                unexplained * (Number(batch.costPerUnit) || 60)
                              ).toLocaleString("en-IN")}
                            </span>
                          </div>
                          <button
                            type="button"
                            className="production-btn production-btn-secondary"
                            onClick={() => setActiveTab("var")}
                          >
                            Review
                          </button>
                        </div>
                      );
                    })
                ) : (
                  <p className="production-muted">Nothing needs attention.</p>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === "batch" && (
          <BatchesTab
            batches={batches}
            sopSteps={SOP_STEPS}
            onPlan={() => setShowPlanModal(true)}
            onStart={handleStartBatch}
            onComplete={handleCompleteBatch}
            onToggleSopStep={handleToggleSopStep}
            onSelectBatch={setSelectedBatch}
            onOpenSOPChecklist={handleOpenSOPChecklist}
            onQCPass={handleQCPass}
            onQCReject={handleQCReject}
          />
        )}

        {activeTab === "run" && (
          <RunningTab
            batches={batches}
            sopSteps={SOP_STEPS}
            criticalSteps={CRITICAL_STEPS}
            onComplete={handleCompleteBatch}
            onOpenSOPChecklist={handleOpenSOPChecklist}
            onQCPass={handleQCPass}
            onQCReject={handleQCReject}
          />
        )}

        {activeTab === "rec" && <RecipesTab />}

        {activeTab === "stock" && (
          <StockTab
            onProcess={handleProcessStock}
            onWaste={handleWaste}
            onDiscardExpired={handleDiscardExpired}
          />
        )}

        {activeTab === "day" && <DayEndTab />}

        {activeTab === "led" && (
          <BatchLedgerTab entries={ledgerEntries} />
        )}

        {activeTab === "var" && (
          <YieldVarianceTab batches={batches} />
        )}
      </div>

      {showPlanModal && (
        <PlanProductionModal
          onClose={() => setShowPlanModal(false)}
          onMoveToKitchen={handleMoveToKitchen}
          onPlanBatch={(data) => handlePlanBatch(data, false)}
          onStartBatch={(data) => handlePlanBatch(data, true)}
          onCreateBatches={handleCreateBatches}
          onMoveMaterials={handleMoveMaterials}
          onCreateAndMoveMaterials={handleCreateAndMoveMaterials}
        />
      )}

      {selectedBatch && (
        <StartBatchModal
          batch={selectedBatch}
          onClose={() => setSelectedBatch(null)}
          onStart={handleStartBatch}
        />
      )}

      {incompleteBatch && (
        <IncompleteModal
          batch={incompleteBatch.batch}
          criticalSteps={incompleteBatch.criticalSteps}
          onClose={() => setIncompleteBatch(null)}
          onOpenChecklist={() => {
            setShowSOPChecklist(incompleteBatch.batch);
            setIncompleteBatch(null);
          }}
          onCompleteAnyway={handleCompleteAnyway}
        />
      )}

      {showSOPChecklist && (
        <SOPChecklistModal
          batch={showSOPChecklist}
          onClose={() => setShowSOPChecklist(null)}
          onSave={handleSaveSOP}
        />
      )}

      {completeBatch && (
        <CompleteBatchModal
          batch={completeBatch}
          onClose={() => setCompleteBatch(null)}
          onComplete={handleFinishBatch}
          overrideReason={overrideReason}
        />
      )}
    </section>
  );
};

export default Production;
