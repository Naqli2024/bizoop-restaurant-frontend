import React, { useEffect, useState } from "react";

const ITEMS = [
  { value: "rice", label: "Basmati Rice" },
  { value: "chk", label: "Chicken" },
  { value: "mut", label: "Mutton" },
  { value: "pan", label: "Paneer" },
  { value: "mas", label: "Biryani Masala" },
  { value: "oil", label: "Cooking Oil" },
  { value: "cur", label: "Curd" },
  { value: "flr", label: "Wheat Flour (Maida)" },
  { value: "mlk", label: "Milk" },
  { value: "cof", label: "Coffee Decoction" },
  { value: "onn", label: "Onion" },
  { value: "tom", label: "Tomato" },
  { value: "fsh", label: "Seer Fish" },
  { value: "btr", label: "Butter" },
  { value: "egg", label: "Eggs" },
  { value: "pkg", label: "Packaging Box" },
];

const LOCATIONS = ["Store", "Main Kitchen", "Tandoor", "Bar", "Dessert"];

const REASONS = [
  "Prep trim",
  "Spoilage",
  "Expired",
  "Overcooked / burnt",
  "Returned by customer",
  "Spill / breakage",
  "Staff meal",
  "Sample / tasting",
];

const INITIAL_FORM = {
  item: ITEMS[0].value,
  location: LOCATIONS[0],
  quantity: "1",
  reason: REASONS[0],
};

export default function LogWastageModal({ open, onClose, onSave }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");

  // Reset the form every time the modal opens
  useEffect(() => {
    if (open) {
      setForm(INITIAL_FORM);
      setError("");
    }
  }, [open]);

  // Close on Escape + lock background scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = () => {
    const qty = parseFloat(form.quantity);
    if (!qty || qty <= 0) {
      setError("Enter a quantity greater than 0.");
      return;
    }
    onSave?.({ ...form, quantity: qty });
    onClose();
  };

  return (
    <div
      className="wm-overlay"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="wm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="wm-title"
      >
        <div className="wm-head">
          <span id="wm-title" className="wm-head__title">
            Log wastage
          </span>
          <button className="wm-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="wm-grid">
          <label className="wm-field">
            Item
            <select className="wm-input" value={form.item} onChange={update("item")}>
              {ITEMS.map((i) => (
                <option key={i.value} value={i.value}>
                  {i.label}
                </option>
              ))}
            </select>
          </label>

          <label className="wm-field">
            Where it happened
            <select className="wm-input" value={form.location} onChange={update("location")}>
              {LOCATIONS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </label>

          <label className="wm-field">
            Quantity
            <input
              className="wm-input"
              type="number"
              step="0.1"
              min="0"
              value={form.quantity}
              onChange={update("quantity")}
            />
          </label>

          <label className="wm-field">
            Reason
            <select className="wm-input" value={form.reason} onChange={update("reason")}>
              {REASONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
        </div>

        {error && <p className="wm-error">{error}</p>}

        <div className="wm-foot">
          <button className="wm-btn" onClick={onClose}>
            <svg className="wm-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
            Cancel
          </button>
          <button className="wm-btn wm-btn--primary" onClick={handleSave}>
            <svg className="wm-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
