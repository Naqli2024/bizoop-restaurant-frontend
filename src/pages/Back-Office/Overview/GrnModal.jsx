import React, { useEffect, useRef, useState } from "react";

/* ---------- Default data (replace via props from your API) ---------- */

const DEFAULT_SUPPLIERS = [
  "Sri Lakshmi Traders",
  "Fresh Poultry Co.",
  "Aavin Dairy",
  "Sakthi Masala",
  "Kumbakonam Coffee",
  "Koyambedu Market",
  "Kasimedu Fish Mkt",
  "PackWell",
  "Sister Concern – Central Kitchen",
  "Sister Concern – Dairy Unit",
];

const DEFAULT_CATALOG = [
  { id: "rice", name: "Basmati Rice", unit: "kg", rate: 118 },
  { id: "chk", name: "Chicken", unit: "kg", rate: 210 },
  { id: "mut", name: "Mutton", unit: "kg", rate: 760 },
  { id: "pan", name: "Paneer", unit: "kg", rate: 320 },
  { id: "mas", name: "Biryani Masala", unit: "kg", rate: 450 },
  { id: "oil", name: "Cooking Oil", unit: "L", rate: 135 },
  { id: "cur", name: "Curd", unit: "kg", rate: 70 },
  { id: "flr", name: "Wheat Flour (Maida)", unit: "kg", rate: 44 },
  { id: "mlk", name: "Milk", unit: "L", rate: 56 },
  { id: "cof", name: "Coffee Decoction", unit: "L", rate: 280 },
  { id: "onn", name: "Onion", unit: "kg", rate: 38 },
  { id: "tom", name: "Tomato", unit: "kg", rate: 30 },
  { id: "fsh", name: "Seer Fish", unit: "kg", rate: 900 },
  { id: "btr", name: "Butter", unit: "kg", rate: 520 },
  { id: "egg", name: "Eggs", unit: "nos", rate: 6.5 },
  { id: "pkg", name: "Packaging Box", unit: "nos", rate: 12 },
];

const DEFAULT_POS = [
  {
    id: "PO-2101",
    supplier: "Sri Lakshmi Traders",
    chilled: false,
    lines: [
      { itemId: "rice", name: "Basmati Rice", unit: "kg", ordered: 40, rate: 118, exp: "2027-04-09" },
      { itemId: "oil", name: "Cooking Oil", unit: "L", ordered: 30, rate: 135, exp: "2027-04-09" },
      { itemId: "flr", name: "Wheat Flour (Maida)", unit: "kg", ordered: 20, rate: 44, exp: "2027-04-09" },
    ],
  },
  {
    id: "PO-2102",
    supplier: "Fresh Poultry Co.",
    chilled: true, // shows the "Chilled goods temperature" field
    lines: [
      { itemId: "chk", name: "Chicken", unit: "kg", ordered: 30, rate: 210, exp: "2026-11-12" },
      { itemId: "mut", name: "Mutton", unit: "kg", ordered: 12, rate: 760, exp: "2026-11-12" },
    ],
  },
];

const DEFAULT_EXPIRY = "2027-04-09";

/* ---------- Helpers ---------- */

let uid = 0;
const nextUid = () => ++uid;

const lineFromPo = (l) => ({
  uid: nextUid(),
  itemId: l.itemId,
  name: l.name,
  unit: l.unit,
  ordered: l.ordered,
  rec: l.ordered,
  rej: 0,
  batch: "",
  exp: l.exp || DEFAULT_EXPIRY,
  rate: l.rate,
});

const lineFromCatalog = (c) => ({
  uid: nextUid(),
  itemId: c.id,
  name: c.name,
  unit: c.unit,
  ordered: null, // direct purchase has no ordered qty
  rec: 1,
  rej: 0,
  batch: "",
  exp: DEFAULT_EXPIRY,
  rate: c.rate,
});

const CloseIcon = () => (
  <svg className="gm-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

/* ---------- Component ---------- */

export default function GrnModal({
  open,
  mode: initialMode = "po", // "po" | "direct"
  onClose,
  onSave,
  purchaseOrders = DEFAULT_POS,
  suppliers = DEFAULT_SUPPLIERS,
  catalog = DEFAULT_CATALOG,
}) {
  const [mode, setMode] = useState(initialMode);
  const [poId, setPoId] = useState("");
  const [supplier, setSupplier] = useState("");
  const [invoice, setInvoice] = useState("");
  const [temp, setTemp] = useState("");
  const [lines, setLines] = useState([]);
  const [addItemId, setAddItemId] = useState(catalog[0]?.id ?? "");
  const [error, setError] = useState("");
  const wasOpen = useRef(false);

  const reset = (m) => {
    setMode(m);
    setPoId("");
    setSupplier("");
    setInvoice("");
    setTemp("");
    setLines([]);
    setError("");
  };

  // Reset only on the closed → open transition
  useEffect(() => {
    if (open && !wasOpen.current) reset(initialMode);
    wasOpen.current = open;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Escape to close + lock background scroll
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const selectedPo = purchaseOrders.find((p) => p.id === poId);
  const showTemp = mode === "po" && selectedPo?.chilled;

  const pickPo = (id) => {
    setPoId(id);
    setTemp("");
    setError("");
    const po = purchaseOrders.find((p) => p.id === id);
    setLines(po ? po.lines.map(lineFromPo) : []);
  };

  const patchLine = (id, field, value) =>
    setLines((ls) => ls.map((l) => (l.uid === id ? { ...l, [field]: value } : l)));

  const removeLine = (id) => setLines((ls) => ls.filter((l) => l.uid !== id));

  const addItem = () => {
    const c = catalog.find((x) => x.id === addItemId);
    if (c) setLines((ls) => [...ls, lineFromCatalog(c)]);
  };

  const receiveAll = () =>
    setLines((ls) =>
      ls.map((l) => (l.ordered == null ? l : { ...l, rec: l.ordered, rej: 0 }))
    );

  const handlePost = () => {
    if (mode === "po" && !poId) return setError("Select a purchase order.");
    if (mode === "direct" && !supplier) return setError("Select a supplier.");
    if (lines.length === 0) return setError("Add at least one item.");
    const bad = lines.find((l) => Number(l.rej) > Number(l.rec));
    if (bad) return setError(`Rejected quantity is more than received for ${bad.name}.`);

    onSave?.({
      mode,
      poId: mode === "po" ? poId : null,
      supplier: mode === "po" ? selectedPo.supplier : supplier,
      invoice,
      temperature: showTemp && temp !== "" ? Number(temp) : null,
      lines: lines.map((l) => ({
        itemId: l.itemId,
        received: Number(l.rec) || 0,
        rejected: Number(l.rej) || 0,
        accepted: (Number(l.rec) || 0) - (Number(l.rej) || 0),
        batch: l.batch,
        expiry: l.exp,
        rate: Number(l.rate) || 0,
      })),
    });
    onClose();
  };

  const title =
    mode === "po"
      ? "GRN · receive against purchase order"
      : "GRN · direct purchase (no PO)";

  return (
    <div
      className="gm-overlay"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="gm-dialog" role="dialog" aria-modal="true" aria-labelledby="gm-title">
        <div className="gm-head">
          <span id="gm-title" className="gm-head__title">{title}</span>
          <button className="gm-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {/* Mode switch */}
        <div className="gm-tabs">
          <button
            className={`gm-btn gm-btn--sm ${mode === "po" ? "gm-btn--primary" : ""}`}
            onClick={() => reset("po")}
          >
            Against PO
          </button>
          <button
            className={`gm-btn gm-btn--sm ${mode === "direct" ? "gm-btn--primary" : ""}`}
            onClick={() => reset("direct")}
          >
            Direct purchase
          </button>
        </div>

        {/* PO / supplier + invoice */}
        <div className="gm-grid">
          {mode === "po" ? (
            <label className="gm-field">
              Purchase order
              <select className="gm-input" value={poId} onChange={(e) => pickPo(e.target.value)}>
                <option value="">Select…</option>
                {purchaseOrders.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.id} · {p.supplier}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <label className="gm-field">
              Supplier
              <select className="gm-input" value={supplier} onChange={(e) => setSupplier(e.target.value)}>
                <option value="">Select…</option>
                {suppliers.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          )}

          <label className="gm-field">
            Supplier invoice no.
            <input className="gm-input" value={invoice} onChange={(e) => setInvoice(e.target.value)} />
          </label>
        </div>

        {showTemp && (
          <label className="gm-field">
            Chilled goods temperature on arrival (°C)
            <input
              className="gm-input"
              type="number"
              step="0.5"
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
            />
          </label>
        )}

        {/* Lines */}
        {lines.length > 0 ? (
          <div className="gm-table-wrap">
            <table className="gm-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th className="gm-right">Ordered</th>
                  <th>Received</th>
                  <th>Rejected</th>
                  <th>Batch no.</th>
                  <th>Expiry</th>
                  <th>Rate</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {lines.map((l) => (
                  <tr key={l.uid}>
                    <td>
                      {l.name}
                      <span className="gm-unit">{l.unit}</span>
                    </td>
                    <td className="gm-right gm-mono">{l.ordered ?? "—"}</td>
                    <td>
                      <input
                        className="gm-input gm-input--sm"
                        type="number" step="0.1" min="0"
                        value={l.rec}
                        onChange={(e) => patchLine(l.uid, "rec", e.target.value)}
                        aria-label={`Received ${l.name}`}
                      />
                    </td>
                    <td>
                      <input
                        className="gm-input gm-input--sm"
                        type="number" step="0.1" min="0"
                        value={l.rej}
                        onChange={(e) => patchLine(l.uid, "rej", e.target.value)}
                        aria-label={`Rejected ${l.name}`}
                      />
                    </td>
                    <td>
                      <input
                        className="gm-input gm-input--md"
                        value={l.batch}
                        onChange={(e) => patchLine(l.uid, "batch", e.target.value)}
                        aria-label={`Batch number ${l.name}`}
                      />
                    </td>
                    <td>
                      <input
                        className="gm-input gm-input--date"
                        type="date"
                        value={l.exp}
                        onChange={(e) => patchLine(l.uid, "exp", e.target.value)}
                        aria-label={`Expiry ${l.name}`}
                      />
                    </td>
                    <td>
                      <input
                        className="gm-input gm-input--rate"
                        type="number" min="0"
                        value={l.rate}
                        onChange={(e) => patchLine(l.uid, "rate", e.target.value)}
                        aria-label={`Rate ${l.name}`}
                      />
                    </td>
                    <td>
                      <button
                        className="gm-btn gm-btn--sm"
                        onClick={() => removeLine(l.uid)}
                        aria-label={`Remove ${l.name}`}
                      >
                        <CloseIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="gm-muted">
            Pick a purchase order or add items.
          </div>
        )}

        {/* Add item (direct purchase only) */}
        {mode === "direct" && (
          <div className="gm-add">
            <select className="gm-input" value={addItemId} onChange={(e) => setAddItemId(e.target.value)}>
              {catalog.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <button className="gm-btn gm-btn--sm" onClick={addItem}>
              <svg className="gm-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add item
            </button>
          </div>
        )}

        <div className="gm-muted gm-note">
          Accepted quantity (received minus rejected) goes into the store as a new batch,
          updates the average cost and creates a payable. Rejected quantity is flagged for
          return to the supplier.
        </div>

        {error && <p className="gm-error">{error}</p>}

        <div className="gm-foot">
          <button className="gm-btn" onClick={onClose}>
            <CloseIcon />
            Cancel
          </button>
          <button className="gm-btn" onClick={receiveAll}>Receive all as ordered</button>
          <button className="gm-btn gm-btn--primary" onClick={handlePost}>Post GRN</button>
        </div>
      </div>
    </div>
  );
}
