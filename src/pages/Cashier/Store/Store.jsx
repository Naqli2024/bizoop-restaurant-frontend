import { useEffect, useMemo, useRef, useState } from "react";
import "../../../assets/styles/store.css";

// `rate` = cost per unit, so value = qty × rate. The first 15 items are from the screenshot;
// "Sugar" is a sample row so the item count (16) and stock value (₹28,717) add up.
const INITIAL_ITEMS = [
  { id: 1, name: "Basmati Rice", qty: 38, unit: "kg", min: 20, rate: 118, vendor: "Sri Lakshmi Traders" },
  { id: 2, name: "Chicken", qty: 22, unit: "kg", min: 15, rate: 210, vendor: "Fresh Poultry Co." },
  { id: 3, name: "Mutton", qty: 4.2, unit: "kg", min: 6, rate: 760, vendor: "Fresh Poultry Co." },
  { id: 4, name: "Paneer", qty: 4.5, unit: "kg", min: 4, rate: 340, vendor: "Aavin Dairy" },
  { id: 5, name: "Biryani Masala", qty: 1.1, unit: "kg", min: 1.5, rate: 520, vendor: "Sakthi Masala" },
  { id: 6, name: "Cooking Oil", qty: 31, unit: "L", min: 15, rate: 135, vendor: "Sri Lakshmi Traders" },
  { id: 7, name: "Curd", qty: 12, unit: "kg", min: 8, rate: 70, vendor: "Aavin Dairy" },
  { id: 8, name: "Wheat Flour (Maida)", qty: 18, unit: "kg", min: 10, rate: 44, vendor: "Sri Lakshmi Traders" },
  { id: 9, name: "Milk", qty: 25, unit: "L", min: 15, rate: 56, vendor: "Aavin Dairy" },
  { id: 10, name: "Coffee Decoction", qty: 6, unit: "L", min: 3, rate: 210, vendor: "Kumbakonam Coffee" },
  { id: 11, name: "Onion", qty: 40, unit: "kg", min: 20, rate: 38, vendor: "Koyambedu Market" },
  { id: 12, name: "Tomato", qty: 9, unit: "kg", min: 10, rate: 42, vendor: "Koyambedu Market" },
  { id: 13, name: "Seer Fish", qty: 0, unit: "kg", min: 5, rate: 650, vendor: "Kasimedu Fish Mkt" },
  { id: 14, name: "Butter", qty: 3.4, unit: "kg", min: 2, rate: 560, vendor: "Aavin Dairy" },
  { id: 15, name: "Eggs", qty: 120, unit: "nos", min: 60, rate: 6.5, vendor: "Sri Lakshmi Traders" },
  { id: 16, name: "Sugar", qty: 28, unit: "kg", min: 10, rate: 45, vendor: "Sri Lakshmi Traders" },
];

const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
const fmtQty = (n) => String(Math.round(n * 100) / 100);
const stockStatus = (i) => (i.qty <= 0 ? "out" : i.qty < i.min ? "reorder" : "ok");
const STATUS_LABEL = { ok: "OK", reorder: "Reorder", out: "Out" };



const Svg = ({ children, size = 16, sw = 2 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const StoreIcon = () => (
  <Svg size={18}>
    <path d="M4 21V8l8-5 8 5v13" />
    <path d="M9 21v-6h6v6M8 10h.01M12 10h.01M16 10h.01" />
  </Svg>
);
const SunIcon = () => (
  <Svg>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Svg>
);
const MoonIcon = () => (
  <Svg>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
  </Svg>
);
const PlusIcon = () => (
  <Svg size={13} sw={2.4}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

function IssueDialog({ item, onCancel, onConfirm }) {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);
  const qty = Number(value);
  const valid = value !== "" && qty > 0 && qty <= item.qty;

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div className="st-overlay" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="st-dialog" role="dialog" aria-modal="true" aria-labelledby="st-dialog-title">
        <h2 id="st-dialog-title" className="st-dialog-title">Issue {item.name}</h2>
        <p className="st-dialog-sub">
          In store: <span className="st-mono">{fmtQty(item.qty)} {item.unit}</span>
        </p>
        <label className="st-field">
          <span>Quantity to issue ({item.unit})</span>
          <input
            ref={inputRef}
            type="number"
            inputMode="decimal"
            min="0"
            max={item.qty}
            step="any"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && valid && onConfirm(qty)}
          />
        </label>
        {value !== "" && qty > item.qty && <p className="st-error">Only {fmtQty(item.qty)} {item.unit} in store.</p>}
        <div className="st-dialog-actions">
          <button type="button" className="st-btn st-btn-ghost" onClick={onCancel}>Cancel</button>
          <button type="button" className="st-btn st-btn-primary" disabled={!valid} onClick={() => onConfirm(qty)}>
            Issue
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Store({ onReceive }) {

  const [items, setItems] = useState(INITIAL_ITEMS);
  const [ledger, setLedger] = useState([]);
  const [issuing, setIssuing] = useState(null);

 

  const stats = useMemo(
    () => ({
      value: items.reduce((s, i) => s + i.qty * i.rate, 0),
      low: items.filter((i) => stockStatus(i) !== "ok").length,
      count: items.length,
    }),
    [items]
  );

  const confirmIssue = (qty) => {
    const item = issuing;
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, qty: Math.max(0, Math.round((i.qty - qty) * 100) / 100) } : i))
    );
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    setLedger((prev) => [{ id: Date.now(), time, name: item.name, qty, unit: item.unit }, ...prev]);
    setIssuing(null);
  };

  return (
    <div className="st-content" >
      <header className="st-header">
        <div className="st-title-group">
          <h1 className="st-title">
            <StoreIcon />
            <span>Store</span>
          </h1>
          <span className="st-tag">all restaurant stock</span>
        </div>
        <div className="st-header-right">
       
          <button type="button" className="st-receive" onClick={onReceive}>
            <PlusIcon />
            Receive via purchase bill
          </button>
        </div>
      </header>

      <main className="st-main">
        <section className="st-stats" aria-label="Summary">
          <article className="st-stat">
            <h2 className="st-stat-label">Stock value</h2>
            <p className="st-stat-value">{inr(stats.value)}</p>
          </article>
          <article className="st-stat">
            <h2 className="st-stat-label">Low / reorder</h2>
            <p className="st-stat-value st-orange">{stats.low}</p>
          </article>
          <article className="st-stat">
            <h2 className="st-stat-label">Items</h2>
            <p className="st-stat-value st-blue">{stats.count}</p>
          </article>
          <article className="st-stat">
            <h2 className="st-stat-label">Movements today</h2>
            <p className="st-stat-value st-purple">{ledger.length}</p>
          </article>
        </section>

        <div className="st-layout">
          <section className="st-table-wrap" aria-label="Stock list">
            <table className="st-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th className="st-num">In store</th>
                  <th className="st-num">Min</th>
                  <th className="st-num">Value</th>
                  <th>Vendor</th>
                  <th>Status</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {items.map((i) => {
                  const s = stockStatus(i);
                  return (
                    <tr key={i.id}>
                      <td data-label="Item" className="st-name">{i.name}</td>
                      <td data-label="In store" className="st-num st-mono">{fmtQty(i.qty)} {i.unit}</td>
                      <td data-label="Min" className="st-num st-mono">{fmtQty(i.min)}</td>
                      <td data-label="Value" className="st-num st-mono">{inr(i.qty * i.rate)}</td>
                      <td data-label="Vendor">{i.vendor}</td>
                      <td data-label="Status">
                        <span className={"st-pill st-status-" + s}>{STATUS_LABEL[s]}</span>
                      </td>
                      <td className="st-action-cell">
                        <button
                          type="button"
                          className="st-issue"
                          disabled={i.qty <= 0}
                          onClick={() => setIssuing(i)}
                          aria-label={`Issue ${i.name}`}
                        >
                          Issue
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          <aside className="st-side" aria-label="Store ledger">
            <h2 className="st-side-title">Store ledger</h2>
            {ledger.length === 0 ? (
              <p className="st-muted st-empty">No issues yet</p>
            ) : (
              <ul className="st-ledger">
                {ledger.map((l) => (
                  <li key={l.id} className="st-ledger-item">
                    <span className="st-mono st-ledger-time">{l.time}</span>
                    <span className="st-ledger-text">
                      Issued <strong>{l.name}</strong>
                    </span>
                    <span className="st-mono st-ledger-qty">−{fmtQty(l.qty)} {l.unit}</span>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      </main>

      {issuing && <IssueDialog item={issuing} onCancel={() => setIssuing(null)} onConfirm={confirmIssue} />}
    </div>
  );
}