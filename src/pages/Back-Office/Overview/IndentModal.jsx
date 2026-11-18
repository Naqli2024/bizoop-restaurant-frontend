import React, { useEffect, useState } from "react";


const STATIONS = ["Main Kitchen", "Tandoor", "Bar", "Dessert"];

// Default data. Replace with API data via the `getItems` prop.
const DEFAULT_ITEMS = [
  { id: "chk", name: "Chicken", unit: "kg", inKitchen: 6, par: 6 },
  { id: "oil", name: "Cooking Oil", unit: "L", inKitchen: 6, par: 6 },
  { id: "cur", name: "Curd", unit: "kg", inKitchen: 3.2, par: 3.2 },
  { id: "fsh", name: "Seer Fish", unit: "kg", inKitchen: 2, par: 2 },
  { id: "pan", name: "Paneer", unit: "kg", inKitchen: 0, par: 1.6 },
  { id: "btr", name: "Butter", unit: "kg", inKitchen: 0.8, par: 0.8 },
  { id: "tom", name: "Tomato", unit: "kg", inKitchen: 4, par: 4 },
  { id: "mlk", name: "Milk", unit: "L", inKitchen: 6, par: 6 },
  { id: "onn", name: "Onion", unit: "kg", inKitchen: 8, par: 8 },
  { id: "rice", name: "Basmati Rice", unit: "kg", inKitchen: 8, par: 8 },
  { id: "mas", name: "Biryani Masala", unit: "kg", inKitchen: 0.6, par: 0.6 },
  { id: "mut", name: "Mutton", unit: "kg", inKitchen: 2.4, par: 2.4 },
  { id: "egg", name: "Eggs", unit: "nos", inKitchen: 24, par: 24 },
  { id: "flr", name: "Wheat Flour (Maida)", unit: "kg", inKitchen: 0, par: 4 },
];

// Pre-fill the shortfall (par - in kitchen), never below 0
const suggestedQty = (it) =>
  String(Math.max(0, Math.round((it.par - it.inKitchen) * 10) / 10));

const buildQuantities = (items) =>
  Object.fromEntries(items.map((it) => [it.id, suggestedQty(it)]));

export default function IndentModal({
  open,
  onClose,
  onSave,
  getItems = () => DEFAULT_ITEMS, // (station) => items[]
}) {
  const [station, setStation] = useState(STATIONS[0]);
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [qty, setQty] = useState(() => buildQuantities(DEFAULT_ITEMS));
  const [error, setError] = useState("");

  const loadStation = (name) => {
    const list = getItems(name);
    setStation(name);
    setItems(list);
    setQty(buildQuantities(list));
    setError("");
  };

  // Reset when the modal opens
  useEffect(() => {
    if (open) loadStation(STATIONS[0]);
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

  const handleSave = (issueNow) => {
    const lines = items
      .map((it) => ({ id: it.id, name: it.name, unit: it.unit, qty: parseFloat(qty[it.id]) || 0 }))
      .filter((l) => l.qty > 0);

    if (lines.length === 0) {
      setError("Enter a request quantity for at least one item.");
      return;
    }
    onSave?.({ station, lines, issueNow });
    onClose();
  };

  return (
    <div
      className="im-overlay"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="im-dialog" role="dialog" aria-modal="true" aria-labelledby="im-title">
        <div className="im-head">
          <span id="im-title" className="im-head__title">
            New indent · request stock for the kitchen
          </span>
          <button className="im-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <label className="im-field">
          Station
          <select
            className="im-input"
            value={station}
            onChange={(e) => loadStation(e.target.value)}
          >
            {STATIONS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>

        <div className="im-table-wrap">
          <table className="im-table">
            <thead>
              <tr>
                <th>Item</th>
                <th className="im-num">In kitchen</th>
                <th className="im-num">Par level</th>
                <th className="im-num">Request</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id}>
                  <td>
                    {it.name}
                    <span className="im-unit">{it.unit}</span>
                  </td>
                  <td className="im-num im-mono">{it.inKitchen}</td>
                  <td className="im-num im-mono">{it.par}</td>
                  <td className="im-num">
                    <input
                      className="im-input im-input--qty"
                      type="number"
                      step="0.1"
                      min="0"
                      value={qty[it.id] ?? "0"}
                      onChange={(e) =>
                        setQty((q) => ({ ...q, [it.id]: e.target.value }))
                      }
                      aria-label={`Request quantity for ${it.name}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {error && <p className="im-error">{error}</p>}

        <div className="im-foot">
          <button className="im-btn" onClick={onClose}>
            <svg className="im-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
            Cancel
          </button>
          <button className="im-btn" onClick={() => handleSave(true)}>
            Issue straight away
          </button>
          <button className="im-btn im-btn--primary" onClick={() => handleSave(false)}>
            Send to store
          </button>
        </div>
      </div>
    </div>
  );
}
