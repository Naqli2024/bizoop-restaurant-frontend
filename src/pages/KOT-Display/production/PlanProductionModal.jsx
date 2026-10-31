
import { useState, useEffect } from "react";
import {
  X,
  Upload,
  Plus,
  Check,
  Play,
  Save,
  ArrowRight,
  Brain,
} from "lucide-react";


const PRODUCTS = [
  { value: "dough", label: "Parotta dough", unit: "kg" },
  { value: "par", label: "Half-cooked parotta", unit: "pcs" },
  { value: "mch", label: "Marinated chicken", unit: "kg" },
  { value: "fry", label: "Chicken fry", unit: "kg" },
  { value: "cry", label: "Chicken curry base", unit: "kg" },
];

const MATERIALS = [
  { id: "flr", name: "Wheat Flour (Maida)", unit: "kg", store: 0, kitchen: 0 },
  { id: "oil", name: "Cooking Oil", unit: "L", store: 26.9, kitchen: 6 },
  { id: "mlk", name: "Milk", unit: "L", store: 22.1, kitchen: 6 },
  { id: "rice", name: "Basmati Rice", unit: "kg", store: 38, kitchen: 0 },
  { id: "chk", name: "Chicken", unit: "kg", store: 22, kitchen: 0 },
  { id: "mut", name: "Mutton", unit: "kg", store: 4.2, kitchen: 0 },
  { id: "pan", name: "Paneer", unit: "kg", store: 2.9, kitchen: 0 },
  { id: "mas", name: "Biryani Masala", unit: "kg", store: 1.1, kitchen: 0 },
  { id: "cur", name: "Curd", unit: "kg", store: 12, kitchen: 0 },
  { id: "cof", name: "Coffee Decoction", unit: "L", store: 6, kitchen: 0 },
  { id: "onn", name: "Onion", unit: "kg", store: 40, kitchen: 0 },
  { id: "tom", name: "Tomato", unit: "kg", store: 9, kitchen: 0 },
  { id: "fsh", name: "Seer Fish", unit: "kg", store: 0, kitchen: 0 },
  { id: "btr", name: "Butter", unit: "kg", store: 3.4, kitchen: 0 },
  { id: "egg", name: "Eggs", unit: "nos", store: 120, kitchen: 0 },
  { id: "pkg", name: "Packaging Box", unit: "nos", store: 140, kitchen: 0 },
];

const SOPS = [
  { id: "p:dough", label: "Parotta dough SOP" },
  { id: "p:par", label: "Parotta rolling and half-cook SOP" },
  { id: "p:mch", label: "Chicken marination SOP" },
  { id: "p:cry", label: "Chicken curry base SOP" },
  { id: "p:fry", label: "Chicken fry SOP" },
];

const RECIPE_MATERIALS = {
  dough: [{ id: "flr", perUnit: 0.0913 }],
  par: [
    { id: "oil", perUnit: 0.00343 },
  ],
  mch: [{ id: "chk", perUnit: 0.25 }],
  fry: [{ id: "oil", perUnit: 0.01 }, { id: "chk", perUnit: 0.25 }],
  cry: [{ id: "oil", perUnit: 0.02 }, { id: "chk", perUnit: 0.2 }],
};

const PREPARED_INPUTS = {
  par: { product: "Parotta dough", qty: 20.6, onHand: 0, unit: "kg" },
  fry: { product: "Marinated chicken", qty: 15, onHand: 0, unit: "kg" },
};

const DEFAULT_PLAN = {
  mode: "day",
  product: "par",
  dayQty: 600,
  qty: 300,
  basis: "learned",
  station: "Main Kitchen",
  owner: "Chef Murugan",
  net: true,
};

const round = (n) => Math.round(n * 100) / 100;

export default function PlanProductionModal({
  onClose,
  onCreateBatches,
  onMoveMaterials,
  onCreateAndMoveMaterials,
  onPlanBatch,
  onStartBatch,
}) {
  const [plan, setPlan] = useState(DEFAULT_PLAN);
  const [bring, setBring] = useState({});
  const [extraBring, setExtraBring] = useState([]);
  const [extraMaterial, setExtraMaterial] = useState("rice");
  const [extraQty, setExtraQty] = useState("");
  const [sops, setSops] = useState(["p:par"]);
  const [customSteps, setCustomSteps] = useState("");
  const [document, setDocument] = useState(null);
  const [savedPlans, setSavedPlans] = useState([]);
  const [planName, setPlanName] = useState("");
  const [showHistory, setShowHistory] = useState(true);

  const update = (key, value) => {
    setPlan((prev) => ({ ...prev, [key]: value }));
  };

  const product = PRODUCTS.find((p) => p.value === plan.product);
  const isDay = plan.mode === "day";
  const target = Math.max(
    0,
    Number(isDay ? plan.dayQty : plan.qty) || 0
  );

  // Recalculate quantities whenever the mode, product, or target changes.
  const [requirements, setRequirements] = useState([]);

  useEffect(() => {
    const recipes = RECIPE_MATERIALS[plan.product] || [];
    const prepared = PREPARED_INPUTS[plan.product];

    const rows = recipes.map((recipe) => {
      const material = MATERIALS.find((m) => m.id === recipe.id);
      const needed = round(target * recipe.perUnit);

      return {
        ...material,
        needed,
        short: Math.max(
          0,
          round(needed - material.kitchen - material.store)
        ),
        bring: Number(bring[recipe.id]) || 0,
      };
    });

    if (prepared) {
      rows.push({
        id: `prepared-${plan.product}`,
        name: prepared.product,
        unit: prepared.unit,
        needed: prepared.qty,
        kitchen: prepared.onHand,
        store: 0,
        short: Math.max(0, prepared.qty - prepared.onHand),
        bring: 0,
        prepared: true,
      });
    }

    setRequirements(rows);
  }, [plan.product, plan.qty, plan.dayQty, plan.mode, plan.basis, bring]);

  const output = Math.floor(target * 0.962);
  const rejected = round(target * 0.023);
  const readyStock = 120;
  const netTarget = isDay && plan.net
    ? Math.max(0, target - readyStock)
    : target;

  const toggleSop = (id, checked) => {
    setSops((prev) =>
      checked
        ? prev.includes(id) ? prev : [...prev, id]
        : prev.filter((item) => item !== id)
    );
  };

  const changeProduct = (value) => {
    setPlan((prev) => ({ ...prev, product: value }));
    setBring({});
  };

  const savePlan = () => {
    if (!planName.trim()) {
      alert("Enter a name for the saved plan.");
      return;
    }

    const saved = {
      name: planName.trim(),
      plan: { ...plan },
      bring: { ...bring },
      sops: [...sops],
      customSteps,
    };

    setSavedPlans((prev) => [
      ...prev.filter((item) => item.name !== saved.name),
      saved,
    ]);
    setPlanName("");
  };

  const loadPlan = (index) => {
    const saved = savedPlans[Number(index)];
    if (!saved) return;

    setPlan(saved.plan);
    setBring(saved.bring);
    setSops(saved.sops);
    setCustomSteps(saved.customSteps);
  };

  const addExtraMaterial = () => {
    const material = MATERIALS.find((m) => m.id === extraMaterial);
    const quantity = Number(extraQty);

    if (!material || !Number.isFinite(quantity) || quantity <= 0) {
      alert("Select a material and enter a quantity greater than zero.");
      return;
    }

    setExtraBring((prev) => [
      ...prev,
      {
        ...material,
        qty: quantity,
      },
    ]);
    setExtraQty("");
  };

  const transferPayload = {
  ...plan,
  product: String(plan.product),
  productDetails: product,
  qty: Number(target),
  target: Number(netTarget),
  station: plan.station,
  owner: plan.owner,
  requirements,
  bring,
  extraBring,
  sops,
  customSteps,
  document,
};

const submit = (callback) => {
  if (Number(target) < 1) {
    alert("Enter a quantity greater than zero.");
    return;
  }

  const data = {
    ...transferPayload,
    product: String(plan.product),
    qty: Number(target),
  };

  if (typeof callback === "function") {
    callback(data);
  } else {
    console.log("Production plan:", data);
  }
};
  return (
    <div
      className="production-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="production-plan-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="production-plan-title"
      >
        <div className="production-plan-header">
          <h2 id="production-plan-title">Plan production</h2>
          <button
            type="button"
            className="production-icon-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={19} />
          </button>
        </div>

        <div className="production-plan-content">
          <div className="production-plan-toolbar">
            <div className="production-mode-tabs">
              <button
                type="button"
                className={!isDay ? "active" : ""}
                onClick={() => update("mode", "batch")}
              >
                Single batch
              </button>
              <button
                type="button"
                className={isDay ? "active" : ""}
                onClick={() => update("mode", "day")}
              >
                Plan the day
              </button>
            </div>

            <select
              className="production-input production-saved-select"
              defaultValue=""
              onChange={(e) => {
                if (e.target.value !== "") loadPlan(e.target.value);
                e.target.value = "";
              }}
            >
              <option value="">Saved plans…</option>
              {savedPlans.map((saved, index) => (
                <option key={saved.name} value={index}>
                  {saved.name}
                </option>
              ))}
            </select>
          </div>

          <div className="production-form-grid production-grid-three">
            <label className="production-field">
              Product
              <select
                className="production-input"
                value={plan.product}
                onChange={(e) => changeProduct(e.target.value)}
              >
                {PRODUCTS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="production-field">
              {isDay ? "Quantity for the day" : "Target output"} (
              {product?.unit || "pcs"})
              <input
                className="production-input"
                type="number"
                min="1"
                value={isDay ? plan.dayQty : plan.qty}
                onChange={(e) =>
                  update(isDay ? "dayQty" : "qty", e.target.value)
                }
              />
            </label>

            <label className="production-field">
              Quantities from
              <select
                className="production-input"
                value={plan.basis}
                onChange={(e) => update("basis", e.target.value)}
              >
                <option value="std">Standard recipe</option>
                <option value="learned">Earlier batches</option>
              </select>
            </label>
          </div>

          <div className="production-form-grid production-grid-two">
            <label className="production-field">
              Kitchen station
              <select
                className="production-input"
                value={plan.station}
                onChange={(e) => update("station", e.target.value)}
              >
                {["Main Kitchen", "Tandoor", "Bar", "Dessert"].map(
                  (station) => (
                    <option key={station}>{station}</option>
                  )
                )}
              </select>
            </label>

            <label className="production-field">
              Production owner
              <input
                className="production-input"
                value={plan.owner}
                onChange={(e) => update("owner", e.target.value)}
                placeholder="Enter production owner"
              />
            </label>
          </div>

          <div className="production-insight">
            <Brain size={19} />
            <div>
              <strong>
                {plan.basis === "learned"
                  ? "Earlier batch insights"
                  : "Standard recipe quantities"}
              </strong>
              <p>
                {plan.basis === "learned"
                  ? "Demo history: yield 96.2%, rejects 2.3%."
                  : "Material quantities use the configured recipe rates."}
                {" "}Expected good output: {output} {product?.unit}.
              </p>
            </div>
          </div>

          {isDay && (
            <>
              <SectionTitle>Production steps</SectionTitle>
              <div className="production-table-wrap">
                <table className="production-table">
                  <thead>
                    <tr>
                      <th>Step</th>
                      <th>Product</th>
                      <th className="numeric">Batches</th>
                      <th className="numeric">Target each</th>
                      <th className="numeric">Expected output</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>
                        {plan.product === "par"
                          ? "Parotta dough"
                          : product?.label}
                      </td>
                      <td className="numeric">2</td>
                      <td className="numeric">
                        {Math.ceil(netTarget / 2)}
                      </td>
                      <td className="numeric">
                        {output} {product?.unit}
                      </td>
                    </tr>
                    {plan.product === "par" && (
                      <tr>
                        <td>2</td>
                        <td>Half-cooked parotta</td>
                        <td className="numeric">2</td>
                        <td className="numeric">
                          {Math.ceil(netTarget / 2)}
                        </td>
                        <td className="numeric">
                          {output} pcs
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <label className="production-check-row">
                <input
                  type="checkbox"
                  checked={plan.net}
                  onChange={(e) => update("net", e.target.checked)}
                />
                <span>
                  Subtract ready stock already on hand ({readyStock} pcs)
                </span>
              </label>
            </>
          )}

          <SectionTitle>
            {isDay ? "Raw material for the day" : "Materials"}
          </SectionTitle>

          <div className="production-table-wrap">
            <table className="production-table">
              <thead>
                <tr>
                  <th>Material</th>
                  <th className="numeric">Needed</th>
                  <th className="numeric">In kitchen</th>
                  <th className="numeric">In store</th>
                  <th>Bring to kitchen</th>
                </tr>
              </thead>
              <tbody>
                {requirements.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.name}
                      {item.prepared && (
                        <span className="production-subtext">
                          Prepared stock
                        </span>
                      )}
                      {!item.prepared && (
                        <span className="production-subtext">
                          {item.unit}
                        </span>
                      )}
                    </td>
                    <td className="numeric">{item.needed}</td>
                    <td className="numeric">{item.kitchen}</td>
                    <td className="numeric">{item.store}</td>
                    <td>
                      {item.prepared ? (
                        <button
                          type="button"
                          className="production-small-btn"
                          onClick={() => changeProduct("dough")}
                        >
                          Plan {item.name} first
                        </button>
                      ) : (
                        <div className="production-material-input">
                          <input
                            className="production-input"
                            type="number"
                            min="0"
                            step="0.1"
                            value={bring[item.id] ?? 0}
                            onChange={(e) =>
                              setBring((prev) => ({
                                ...prev,
                                [item.id]: e.target.value,
                              }))
                            }
                          />
                          {item.short > 0 && (
                            <span className="production-short-tag">
                              Short {item.short}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <SectionTitle>SOP for this batch</SectionTitle>
          <div className="production-sop-list">
            {SOPS.map((sop) => (
              <label className="production-check-row" key={sop.id}>
                <input
                  type="checkbox"
                  checked={sops.includes(sop.id)}
                  onChange={(e) => toggleSop(sop.id, e.target.checked)}
                />
                <span>{sop.label}</span>
              </label>
            ))}
          </div>

          <div className="production-sop-toolbar">
            <select
              className="production-input"
              defaultValue=""
              onChange={(e) => {
                if (e.target.value) toggleSop(e.target.value, true);
                e.target.value = "";
              }}
            >
              <option value="">Add a dish SOP…</option>
              <option value="d:Chicken Biryani">Chicken Biryani</option>
            </select>

            <label className="production-upload-btn">
              <Upload size={15} />
              Upload SOP document
              <input
                type="file"
                accept=".pdf,image/*"
                hidden
                onChange={(e) =>
                  setDocument(e.target.files?.[0] || null)
                }
              />
            </label>
            {document && (
              <span className="production-file-name">
                {document.name}
              </span>
            )}
          </div>

          <textarea
            className="production-input production-custom-steps"
            rows="3"
            placeholder={
              "Extra checklist steps, one per line.\nStart a line with ! for a critical step"
            }
            value={customSteps}
            onChange={(e) => setCustomSteps(e.target.value)}
          />

          <SectionTitle>Other materials to bring to the kitchen</SectionTitle>
          <div className="production-add-material">
            <select
              className="production-input"
              value={extraMaterial}
              onChange={(e) => setExtraMaterial(e.target.value)}
            >
              {MATERIALS.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.name} ({material.store} {material.unit} in store)
                </option>
              ))}
            </select>

            <input
              className="production-input production-extra-qty"
              type="number"
              min="0.1"
              step="0.1"
              placeholder="Qty"
              value={extraQty}
              onChange={(e) => setExtraQty(e.target.value)}
            />

            <button
              type="button"
              className="production-small-btn"
              onClick={addExtraMaterial}
            >
              <Plus size={15} /> Add
            </button>
          </div>

          {extraBring.length > 0 && (
            <div className="production-extra-list">
              {extraBring.map((item, index) => (
                <div
                  className="production-extra-item"
                  key={`${item.id}-${index}`}
                >
                  <span>{item.name}</span>
                  <span>{item.qty} {item.unit}</span>
                  <button
                    type="button"
                    className="production-icon-btn"
                    aria-label={`Remove ${item.name}`}
                    onClick={() =>
                      setExtraBring((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                  >
                    <X size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="production-plan-footer">
            {isDay && (
              <div className="production-save-plan">
                <input
                  className="production-input"
                  placeholder="Save plan as…"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                />
                <button
                  type="button"
                  className="production-small-btn"
                  onClick={savePlan}
                >
                  <Save size={15} /> Save plan
                </button>
              </div>
            )}

            <div className="production-footer-actions">
              <button
                type="button"
                className="production-action-btn"
                onClick={onClose}
              >
                <X size={15} /> Cancel
              </button>

              <button
                type="button"
                className="production-action-btn"
                onClick={() => submit(onMoveMaterials)}
              >
                <ArrowRight size={15} /> Move to kitchen
              </button>

              {isDay ? (
                <>
                  <button
                    type="button"
                    className="production-action-btn"
                    onClick={() => submit(onCreateBatches)}
                  >
                    Create batches
                  </button>
                  <button
                    type="button"
                    className="production-action-btn primary"
                   onClick={() => submit(onCreateAndMoveMaterials)}
                  >
                    <Check size={15} /> Create and move materials
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="production-action-btn"
                    onClick={() => submit(onPlanBatch)}
                  >
                    Plan batch
                  </button>
                  <button
                    type="button"
                    className="production-action-btn primary"
                    onClick={() => submit(onStartBatch)}
                  >
                    <Play size={15} /> Plan and start
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return <h3 className="production-section-title">{children}</h3>;
}
