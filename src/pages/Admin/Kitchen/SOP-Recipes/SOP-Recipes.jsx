import { useMemo, useState } from "react";
import "../../../../assets/styles/sop-recipes.css";
import ManagerAuthModal from "../SOP-Recipes/ManagerAuthModel";

/* ---------- data ---------- */
const INGREDIENTS = {
  rice: { name: "Basmati Rice", cat: "Dry", tol: 3, unit: "kg", yield: 100, cost: 110 },
  chk:  { name: "Chicken", cat: "Meat/Fish", tol: 7, unit: "kg", yield: 75, cost: 220 },
  mut:  { name: "Mutton", cat: "Meat/Fish", tol: 7, unit: "kg", yield: 70, cost: 780 },
  pan:  { name: "Paneer", cat: "Dairy", tol: 3, unit: "kg", yield: 100, cost: 360 },
  mas:  { name: "Biryani Masala", cat: "Dry", tol: 2, unit: "kg", yield: 100, cost: 520 },
  oil:  { name: "Cooking Oil", cat: "Dry", tol: 2, unit: "L", yield: 100, cost: 135 },
  cur:  { name: "Curd", cat: "Dairy", tol: 3, unit: "kg", yield: 100, cost: 80 },
  flr:  { name: "Wheat Flour (Maida)", cat: "Dry", tol: 2, unit: "kg", yield: 100, cost: 45 },
  mlk:  { name: "Milk", cat: "Dairy", tol: 2, unit: "L", yield: 100, cost: 56 },
  cof:  { name: "Coffee Decoction", cat: "Dry", tol: 2, unit: "L", yield: 100, cost: 300 },
  onn:  { name: "Onion", cat: "Veg", tol: 5, unit: "kg", yield: 90, cost: 40 },
  tom:  { name: "Tomato", cat: "Veg", tol: 5, unit: "kg", yield: 90, cost: 35 },
  fsh:  { name: "Seer Fish", cat: "Meat/Fish", tol: 7, unit: "kg", yield: 70, cost: 780 },
  btr:  { name: "Butter", cat: "Dairy", tol: 2, unit: "kg", yield: 100, cost: 540 },
  egg:  { name: "Eggs", cat: "Dairy", tol: 2, unit: "pc", yield: 100, cost: 7 },
  pkg:  { name: "Packaging Box", cat: "Dry", tol: 0, unit: "pc", yield: 100, cost: 8 },
};

const DISHES = [
  ["🍗", "Chicken 65"], ["🥦", "Gobi Manchurian"], ["🐟", "Fish Fry"], ["🧀", "Paneer Tikka"],
  ["🍢", "Chicken Tikka"], ["🍗", "Tandoori Chicken (Half)"], ["🧀", "Paneer Butter Masala"],
  ["🍛", "Butter Chicken"], ["🌶", "Chicken Chettinad"], ["🥣", "Dal Tadka"], ["🥘", "Veg Kurma"],
  ["🍚", "Chicken Biryani"], ["🥩", "Mutton Biryani"], ["🍚", "Veg Biryani"], ["🥚", "Egg Biryani"],
  ["🫓", "Butter Naan"], ["🫓", "Garlic Naan"], ["🫓", "Tandoori Roti"], ["🥞", "Kerala Parotta"],
  ["🍳", "Kothu Parotta"], ["🥞", "Masala Dosa"], ["⚪", "Idli (2 pcs)"], ["🍲", "Ghee Pongal"],
  ["☕", "Filter Coffee"], ["🍵", "Masala Chai"], ["🍋", "Fresh Lime Soda"], ["🍹", "Mint Mojito"],
  ["🥭", "Mango Lassi"], ["🧋", "Cold Coffee"], ["🍡", "Gulab Jamun (2)"], ["🥥", "Elaneer Payasam"],
  ["🍨", "Ice Cream Sundae"], ["🍫", "Brownie with Ice Cream"],
];

const NO_RECIPE = new Set([
  "Gobi Manchurian", "Veg Kurma", "Masala Dosa", "Idli (2 pcs)", "Ghee Pongal",
  "Fresh Lime Soda", "Mint Mojito", "Gulab Jamun (2)", "Elaneer Payasam",
  "Ice Cream Sundae", "Brownie with Ice Cream",
]);

const SELLING_PRICE = { "Fish Fry": 280 };
const DEFAULT_PRICE = 250;

const VARIANTS = [
  { name: "Half", mult: 0.6 },
  { name: "Full", mult: 1 },
  { name: "Large", mult: 1.3 },
];

const SUB_RECIPES = [
  {
    name: "Biryani masala base", batch: "5 kg batch",
    lines: "Biryani Masala 1.0 kg · Cooking Oil 0.5 L · Onion 3.0 kg", usedIn: "All biryanis",
  },
  {
    name: "Chicken marinade", batch: "10 kg chicken",
    lines: "Curd 1.5 kg · Biryani Masala 0.3 kg · Cooking Oil 0.2 L", usedIn: "Biryani, Chicken 65, Tikka",
  },
];

const OUTLETS = [
  ["Anna Nagar", "Master recipe"],
  ["T Nagar", "Master recipe"],
  ["OMR", "−3% rice (approved)"],
];

const INITIAL_RECIPES = {
  "Chicken 65": [
    { key: "chk", qty: 0.25 }, { key: "cur", qty: 0.03 }, { key: "mas", qty: 0.01 },
    { key: "oil", qty: 0.08 }, { key: "onn", qty: 0.03 },
  ],
  "Fish Fry": [
    { key: "fsh", qty: 0.2 },
    { key: "oil", qty: 0.05 },
  ],
  "Paneer Tikka": [
    { key: "pan", qty: 0.2 }, { key: "cur", qty: 0.05 }, { key: "mas", qty: 0.01 }, { key: "oil", qty: 0.02 },
  ],
  "Chicken Tikka": [
    { key: "chk", qty: 0.25 }, { key: "cur", qty: 0.05 }, { key: "mas", qty: 0.01 }, { key: "oil", qty: 0.02 },
  ],
  "Tandoori Chicken (Half)": [
    { key: "chk", qty: 0.3 }, { key: "cur", qty: 0.06 }, { key: "mas", qty: 0.015 }, { key: "oil", qty: 0.02 },
  ],
  "Paneer Butter Masala": [
    { key: "pan", qty: 0.15 }, { key: "btr", qty: 0.03 }, { key: "tom", qty: 0.15 },
    { key: "onn", qty: 0.06 }, { key: "oil", qty: 0.02 }, { key: "mlk", qty: 0.05 },
  ],
  "Butter Chicken": [
    { key: "chk", qty: 0.2 }, { key: "btr", qty: 0.03 }, { key: "tom", qty: 0.15 },
    { key: "onn", qty: 0.06 }, { key: "mlk", qty: 0.05 }, { key: "mas", qty: 0.01 },
  ],
  "Chicken Chettinad": [
    { key: "chk", qty: 0.22 }, { key: "onn", qty: 0.1 }, { key: "tom", qty: 0.08 },
    { key: "oil", qty: 0.04 }, { key: "mas", qty: 0.01 },
  ],
  "Dal Tadka": [
    { key: "onn", qty: 0.05 }, { key: "tom", qty: 0.08 }, { key: "oil", qty: 0.02 }, { key: "btr", qty: 0.01 },
  ],
  "Chicken Biryani": [
    { key: "rice", qty: 0.15 }, { key: "chk", qty: 0.2 }, { key: "onn", qty: 0.08 },
    { key: "cur", qty: 0.04 }, { key: "mas", qty: 0.02 }, { key: "oil", qty: 0.04 },
  ],
  "Mutton Biryani": [
    { key: "rice", qty: 0.15 }, { key: "mut", qty: 0.2 }, { key: "onn", qty: 0.08 },
    { key: "cur", qty: 0.04 }, { key: "mas", qty: 0.02 }, { key: "oil", qty: 0.04 },
  ],
  "Veg Biryani": [
    { key: "rice", qty: 0.15 }, { key: "onn", qty: 0.08 }, { key: "tom", qty: 0.05 },
    { key: "cur", qty: 0.04 }, { key: "mas", qty: 0.02 }, { key: "oil", qty: 0.04 },
  ],
  "Egg Biryani": [
    { key: "rice", qty: 0.15 }, { key: "egg", qty: 2 }, { key: "onn", qty: 0.08 },
    { key: "cur", qty: 0.04 }, { key: "mas", qty: 0.02 }, { key: "oil", qty: 0.04 },
  ],
  "Butter Naan": [
    { key: "flr", qty: 0.1 }, { key: "cur", qty: 0.02 }, { key: "btr", qty: 0.01 }, { key: "mlk", qty: 0.02 },
  ],
  "Garlic Naan": [
    { key: "flr", qty: 0.1 }, { key: "cur", qty: 0.02 }, { key: "btr", qty: 0.015 }, { key: "mlk", qty: 0.02 },
  ],
  "Tandoori Roti": [
    { key: "flr", qty: 0.08 },
  ],
  "Kerala Parotta": [
    { key: "flr", qty: 0.12 }, { key: "oil", qty: 0.02 }, { key: "mlk", qty: 0.02 },
  ],
  "Kothu Parotta": [
    { key: "flr", qty: 0.2 }, { key: "egg", qty: 2 }, { key: "onn", qty: 0.05 },
    { key: "tom", qty: 0.05 }, { key: "oil", qty: 0.03 }, { key: "mas", qty: 0.01 },
  ],
  "Filter Coffee": [
    { key: "cof", qty: 0.03 }, { key: "mlk", qty: 0.15 },
  ],
  "Masala Chai": [
    { key: "mlk", qty: 0.12 },
  ],
  "Mango Lassi": [
    { key: "cur", qty: 0.15 }, { key: "mlk", qty: 0.05 },
  ],
  "Cold Coffee": [
    { key: "cof", qty: 0.04 }, { key: "mlk", qty: 0.2 },
  ],
};
const MANAGER_PIN = "1234";
const rupee = (n) =>
  "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function SOPRecipes() {
  const [selected, setSelected] = useState("Fish Fry");
  const [recipes, setRecipes] = useState(INITIAL_RECIPES);
  const [pending, setPending] = useState(null); 
  const [addKey, setAddKey] = useState("rice");
  const [authOpen, setAuthOpen] = useState(false);
  const showAlert = pending?.dish === selected;
  const lines = recipes[selected] ?? [];
  const price = SELLING_PRICE[selected] ?? DEFAULT_PRICE;

  const rows = useMemo(
    () =>
      lines.map((l) => {
        const ing = INGREDIENTS[l.key];
        return {
          ...l,
          ing,
          net: (l.qty * ing.yield) / 100,
          cost: l.qty * ing.cost,
        };
      }),
    [lines]
  );

  const totalCost = rows.reduce((sum, r) => sum + r.cost, 0);
  const foodCostPct = price ? (totalCost / price) * 100 : 0;
  const margin = price - totalCost;

  const updateLines = (fn) =>
    setRecipes((prev) => ({ ...prev, [selected]: fn(prev[selected] ?? []) }));

  // Add / remove open the alert and remember the recipe as it was, so Discard can restore it.
  const openAlert = () =>
    setPending((p) => (p?.dish === selected ? p : { dish: selected, before: recipes[selected] ?? [] }));

  const approveChanges = () => setAuthOpen(true);
  const handleAuthorise = (pin) => {
    if (pin !== MANAGER_PIN) return false;
    setAuthOpen(false);
    setPending(null);
    return true;
  };

  const discardChanges = () => {
    setRecipes((prev) => ({ ...prev, [pending.dish]: pending.before }));
    setPending(null);
  };

  const selectDish = (name) => {
    setSelected(name);
    setPending(null);
  };

  const setQty = (index, value) => {
    const qty = parseFloat(value) || 0;
    updateLines((ls) => ls.map((l, i) => (i === index ? { ...l, qty } : l)));
  };

  const removeLine = (index) => {
    openAlert();
    updateLines((ls) => ls.filter((_, i) => i !== index));
  };

  const addLine = () => {
    openAlert();
    updateLines((ls) => [...ls, { key: addKey, qty: 0.1 }]);
  };

  const mappedCount = DISHES.filter(([, n]) => !NO_RECIPE.has(n) || (recipes[n]?.length ?? 0) > 0).length;

  return (
    <div className="rb-page">
      <div className="rb-header">
        <span className="rb-title">
          🧾 Recipe &amp; SOP builder <span className="rb-badge">single source of truth</span>
        </span>
        <span className="rb-muted">Drives stock deduction · costing · training · variance</span>
      </div>

      <div className="rb-layout">
        {/* ---------- left column ---------- */}
        <div className="rb-stack">
           <section className="rb-panel">
            <div className="rb-panel-title">
              {selected} <span className="rb-chip rb-chip-ok">v1</span>
            </div>
            {showAlert && (
            <div className="rb-panel rb-banner" role="status">
              <b>Unsaved changes</b> — needs owner/chef approval.
              <div className="rb-banner-row">
                <input
                  className="rb-input rb-banner-note"
                  placeholder="Reason for change (kept in version history)"
                />
                <button className="rb-btn rb-btn-primary" onClick={approveChanges}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                  Approve (PIN)
                </button>
                <button className="rb-btn" onClick={discardChanges}>Discard</button>
              </div>
            </div>
          )}
            <div className="rb-table-wrap">
              <table className="rb-table">
                <thead>
                  <tr>
                    <th>Ingredient (gross, as issued)</th>
                    <th className="rb-right">Qty / portion</th>
                    <th className="rb-right">Yield</th>
                    <th className="rb-right">Net usable</th>
                    <th className="rb-right">Cost</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={`${r.key}-${i}`}>
                      <td>
                        {r.ing.name}
                        <span className="rb-sub">
                          {r.ing.cat} · tol {r.ing.tol}%
                        </span>
                      </td>
                      <td className="rb-right">
                        <input
                          className="rb-input rb-qty-input"
                          type="number"
                          step="0.005"
                          min="0"
                          value={r.qty}
                          onChange={(e) => setQty(i, e.target.value)}
                        />{" "}
                        {r.ing.unit}
                      </td>
                      <td className="rb-right rb-mono">{r.ing.yield}%</td>
                      <td className="rb-right rb-mono">
                        {+r.net.toFixed(3)} {r.ing.unit}
                      </td>
                      <td className="rb-right rb-mono">{rupee(r.cost)}</td>
                      <td>
                        <button
                          className="rb-btn rb-btn-icon"
                          onClick={() => removeLine(i)}
                          aria-label={`Remove ${r.ing.name}`}
                        >
                          <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M18 6 6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr>
                      <td colSpan={6} className="rb-muted">
                        No ingredients yet. Add the first one below.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="rb-add-row">
              <select className="rb-select" value={addKey} onChange={(e) => setAddKey(e.target.value)}>
                {Object.entries(INGREDIENTS).map(([key, ing]) => (
                  <option key={key} value={key}>{ing.name}</option>
                ))}
              </select>
              <button className="rb-btn" onClick={addLine}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
                Add ingredient
              </button>
            </div>

            <div className="rb-stats">
              <div className="rb-stat">
                <div className="rb-stat-label">Cost / portion</div>
                <div className="rb-stat-value">{rupee(totalCost)}</div>
              </div>
              <div className="rb-stat rb-stat-danger">
                <div className="rb-stat-label">Food cost %</div>
                <div className="rb-stat-value">{foodCostPct.toFixed(1)}%</div>
              </div>
              <div className="rb-stat">
                <div className="rb-stat-label">Margin / plate</div>
                <div className="rb-stat-value">₹{Math.round(margin)}</div>
              </div>
            </div>
          </section>

          <section className="rb-panel">
            <div className="rb-panel-title">Variants &amp; modifiers</div>
            <div className="rb-table-wrap">
              <table className="rb-table">
                <thead>
                  <tr>
                    <th>Variant</th>
                    <th className="rb-right">Multiplier</th>
                    <th className="rb-right">Quantities</th>
                    <th className="rb-right">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {VARIANTS.map((v) => (
                    <tr key={v.name}>
                      <td>{v.name}</td>
                      <td className="rb-right rb-mono">×{v.mult}</td>
                      <td className="rb-right rb-mono">
                        {rows.slice(0, 2).map((r) => `${+(r.qty * v.mult).toFixed(3)}${r.ing.unit}`).join(" · ")}
                        {rows.length > 2 ? "…" : ""}
                      </td>
                      <td className="rb-right rb-mono">{rupee(totalCost * v.mult)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="rb-note">
              Modifiers (extra rice, no onion) carry their own ± quantities and also deduct from stock.
            </div>
          </section>

          <section className="rb-panel">
            <div className="rb-panel-title">Sub-recipes (built once, reused)</div>
            {SUB_RECIPES.map((s) => (
              <div className="rb-list-row" key={s.name}>
                <div>
                  <b>{s.name}</b> <span className="rb-chip">{s.batch}</span>
                  <div className="rb-muted">{s.lines} — used in: {s.usedIn}</div>
                </div>
              </div>
            ))}
          </section>

          <section className="rb-panel">
            <div className="rb-panel-title">
              Outlet overrides <span className="rb-muted">owner-permitted ±3%</span>
            </div>
            {OUTLETS.map(([outlet, rule]) => (
              <div className="rb-list-row" key={outlet}>
                <span>{outlet}</span>
                <span className="rb-mono">{rule}</span>
              </div>
            ))}
          </section>
        </div>

        {/* ---------- right column ---------- */}
        <div className="rb-stack">
          <section className="rb-panel">
            <div className="rb-panel-title">
              Dishes <span className="rb-muted">{mappedCount}/{DISHES.length} mapped</span>
            </div>
            {DISHES.map(([icon, name]) => {
              const missing = NO_RECIPE.has(name) && !(recipes[name]?.length > 0);
              return (
                <button
                  key={name}
                  className={`rb-dish-btn ${selected === name ? "rb-dish-btn-active" : ""}`}
                  onClick={() => selectDish(name)}
                >
                  {icon} {name}
                  {missing && <span className="rb-chip rb-chip-danger">no recipe</span>}
                </button>
              );
            })}
          </section>

          <section className="rb-panel">
            <div className="rb-panel-title">Version history</div>
            <div className="rb-list-row">
              <span><b>v1</b> · Initial recipe card</span>
              <span className="rb-muted">16 Oct · Chef Murugan</span>
            </div>
          </section>
        </div>
      </div>
      {authOpen &&
            <ManagerAuthModal
              open={authOpen}
              description={`Recipe change: ${selected}`}
              onAuthorise={handleAuthorise}
              onCancel={() => setAuthOpen(false)}
            />
        }
    </div>
  );
}
