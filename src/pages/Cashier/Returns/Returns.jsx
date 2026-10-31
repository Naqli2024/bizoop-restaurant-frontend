import { useEffect, useMemo, useState } from "react";
import "../../../assets/styles/returns.css";

const FILTERS = ["All", "Void", "Full refund", "Partial refund", "Delivery return", "Order cancelled"];

const TYPE_CLASS = {
  "Void": "void",
  "Full refund": "full",
  "Partial refund": "partial",
  "Delivery return": "delivery",
  "Order cancelled": "cancelled",
};

const INITIAL_ROWS = [
  { ref: "RF-0003", cn: null, time: "14:32", bill: "AN-0007", meta: "Anna Nagar · Dine-in", type: "Void", reason: "Duplicate bill", item: null, amount: 1554, via: "Card reversal", status: "Pending", note: "Pending — 5–7 working days", loss: "Cashier" },
  { ref: "RF-0006", cn: "CN-0005", time: "13:55", bill: "TN-0021", meta: "T Nagar · Direct delivery", type: "Delivery return", reason: "Quality issue", item: "1× Tandoori Chicken (Half)", amount: 315, via: "UPI reversal", status: "Pending", note: "Pending — 1–2 working days", loss: "Kitchen" },
  { ref: "RF-0002", cn: "CN-0002", time: "13:55", bill: "AN-0024", meta: "Anna Nagar · Dine-in", type: "Full refund", reason: "Food quality (cold / stale)", item: null, amount: 588, via: "Cash from drawer", status: "Completed", note: null, loss: "Kitchen" },
  { ref: "RF-0001", cn: null, time: "13:27", bill: "AN-0035", meta: "Anna Nagar · Dine-in", type: "Void", reason: "Wrong table billed", item: null, amount: 658, via: "UPI reversal", status: "Pending", note: "Pending — 1–2 working days", loss: "Cashier" },
  { ref: "RF-0008", cn: "CN-0007", time: "13:18", bill: "TN-0024", meta: "T Nagar · Dine-in", type: "Partial refund", reason: "Taste / not as described", item: "1× Ice Cream Sundae", amount: 147, via: "Card reversal", status: "Pending", note: "Pending — 5–7 working days", loss: "Kitchen" },
  { ref: "RF-0005", cn: "CN-0004", time: "13:03", bill: "AN-0042", meta: "Anna Nagar · Direct delivery", type: "Delivery return", reason: "Food spilled / damaged", item: "1× Tandoori Chicken (Half)", amount: 315, via: "UPI reversal", status: "Pending", note: "Pending — 1–2 working days", loss: "Delivery partner" },
  { ref: "RF-0007", cn: "CN-0006", time: "12:34", bill: "TN-0003", meta: "T Nagar · Dine-in", type: "Partial refund", reason: "Wrong item served", item: "1× Brownie with Ice Cream", amount: 151, via: "Cash from drawer", status: "Completed", note: null, loss: "Service" },
  { ref: "RF-0004", cn: "CN-0003", time: "11:46", bill: "AN-0004", meta: "Anna Nagar · Swiggy", type: "Delivery return", reason: "Missing item", item: "1× Ice Cream Sundae", amount: 140, via: "Platform refund", status: "Pending", note: "Pending — deducted from next payout", loss: "Delivery partner" },
];

const GROSS_SALES_PERCENT = 3.7;
const inr = (n) => "₹" + n.toLocaleString("en-IN");

function getInitialTheme() {
  if (typeof window === "undefined") return "dark";
  const saved = window.localStorage?.getItem("rr-theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

const UndoIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 14 4 9l5-5" />
    <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m5 12 5 5L20 7" />
  </svg>
);


 
const PAYMENT_MODES = [
  { icon: "💵", name: "Cash bill", desc: "Paid from the cash drawer; logged as cash-out so day-end cash still balances." },
  { icon: "📱", name: "UPI", desc: "Reversal to the payer's UPI; usually 1–2 working days." },
  { icon: "💳", name: "Card", desc: "Reversal to the card; usually 5–7 working days." },
  { icon: "✂️", name: "Split bill", desc: "Refunded across each mode in proportion to what was paid." },
  { icon: "🛵", name: "Swiggy / Zomato", desc: "Platform refunds the customer; the amount is deducted from the next payout. Cashier pays nothing." },
  { icon: "🎁", name: "Store credit", desc: "Optional alternative with a customer mobile; no cash leaves the till." },
];
 
const RULES = [
  "Reason code is mandatory on every void, refund, return and cancellation",
  "Refund or void above ₹500 needs the manager PIN; every void does",
  "Credit note with GST reversal for every refund (voids cancel the bill itself)",
  "Item returns log waste automatically (Returned by customer) so stock stays true",
  "Delivery returns and complaints are traced to kitchen, service, cashier or rider",
  "Order cancelled after KOT sends a cancel KOT; cooked food is logged as waste",
  "Everything lands in the audit log with who, when and how much",
];
 
/* Group rows by a key, sum the amounts, sort high → low */
function groupSum(rows, getKey, limit) {
  const map = new Map();
  rows.forEach((r) => {
    const key = getKey(r);
    if (!key) return;
    map.set(key, (map.get(key) || 0) + r.amount);
  });
  const list = [...map.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
  return limit ? list.slice(0, limit) : list;
}
 
function BarList({ items, label }) {
  if (items.length === 0) return <p className="ri-empty">No data yet.</p>;
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="ri-bars" aria-label={label}>
      {items.map((i) => (
        <li key={i.label} className="ri-bar-row">
          <div className="ri-bar-head">
            <span className="ri-bar-label" title={i.label}>{i.label}</span>
            <span className="ri-bar-value">{inr(i.value)}</span>
          </div>
          <div
            className="ri-track"
            role="meter"
            aria-label={i.label}
            aria-valuemin={0}
            aria-valuemax={max}
            aria-valuenow={i.value}
          >
            <span className="ri-fill" style={{ width: `${(i.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
 
/**
 * rows  – same array used by the table
 * theme – optional "light" | "dark". Leave undefined to inherit from an
 *         ancestor [data-theme] or the OS preference.
 */
function ReturnsInsights({ rows = [] }) {
  const reasons = useMemo(
    () => groupSum(rows, (r) => r.reason, 6),
    [rows]
  );

  const loss = useMemo(
    () => groupSum(rows, (r) => r.loss),
    [rows]
  );

  const channels = useMemo(
    () => groupSum(
      rows,
      (r) => r.meta?.split("·")[1]?.trim()
    ),
    [rows]
  );

  return (
    <section className="ri" aria-label="Refund insights">
      {/* Top reasons */}
      <article className="ri-panel">
        <h2 className="ri-heading ri-heading--divided">
          Top reasons by ₹
        </h2>
        <BarList
          items={reasons}
          label="Top reasons by amount"
        />
      </article>

      {/* Loss and channel */}
      <article className="ri-panel">
        <h2 className="ri-heading ri-heading--divided">
          Loss attributable to
        </h2>
        <BarList
          items={loss}
          label="Loss attributable to"
        />

        <h3 className="ri-heading ri-heading--sub">
          By channel
        </h3>
        <BarList
          items={channels}
          label="Refunds by channel"
        />
      </article>

      {/* Payment modes */}
      <article className="ri-panel">
        <h2 className="ri-heading ri-heading--divided">
          How money goes back
        </h2>

        <ul className="ri-list">
          {PAYMENT_MODES.map((m) => (
            <li key={m.name} className="ri-item">
              <span className="ri-item-key">
                <span className="ri-item-icon" aria-hidden="true">
                  {m.icon}
                </span>
                {m.name}
              </span>
              <p className="ri-item-desc">{m.desc}</p>
            </li>
          ))}
        </ul>
      </article>

      {/* Rules */}
      <article className="ri-panel ri-rules">
        <h2 className="ri-heading ri-heading--divided">
          Rules enforced
        </h2>

        <ul className="ri-list">
          {RULES.map((rule) => (
            <li key={rule} className="ri-item">
              <span className="ri-tick" aria-hidden="true">
                ✓
              </span>
              <span>{rule}</span>
            </li>
          ))}
        </ul>

        <p className="ri-foot">
          Reversal timelines are typical gateway norms; confirm with
          your payment provider.
        </p>
      </article>
    </section>
  );
}

export default function ReturnsRefunds() {

  const [filter, setFilter] = useState("All");
  const [rows, setRows] = useState(INITIAL_ROWS);



  const visible = useMemo(
    () => (filter === "All" ? rows : rows.filter((r) => r.type === filter)),
    [rows, filter]
  );

  const totals = useMemo(() => {
    const refunded = rows.reduce((s, r) => s + r.amount, 0);
    const cash = rows.filter((r) => r.via === "Cash from drawer").reduce((s, r) => s + r.amount, 0);
    const pending = rows.filter((r) => r.status === "Pending").length;
    return { refunded, cash, pending };
  }, [rows]);

  const markSettled = (ref) =>
    setRows((prev) =>
      prev.map((r) => (r.ref === ref ? { ...r, status: "Completed", note: null } : r))
    );

  return (
    <div className="rr" >
      <header className="rr-header">
        <div className="rr-title-group">
          <h1 className="rr-title">
            <UndoIcon />
            <span>Returns, refunds &amp; cancellations</span>
          </h1>
          <span className="rr-tag">reasons · refund mode · accountability</span>
        </div>
        <div className="rr-header-right">
          <p className="rr-hint">
            Process from Bills <span aria-hidden="true">→</span> <UndoIcon /> · Cancel from the Order screen
          </p>
       
        </div>
      </header>

      <main className="rr-main">
        <section className="rr-stats" aria-label="Summary">
          <article className="rr-stat">
            <h2 className="rr-stat-label">Refunded / voided</h2>
            <p className="rr-stat-value rr-red">{inr(totals.refunded)}</p>
          </article>
          <article className="rr-stat">
            <h2 className="rr-stat-label">% of gross sales</h2>
            <p className="rr-stat-value rr-green">{GROSS_SALES_PERCENT}%</p>
          </article>
          <article className="rr-stat">
            <h2 className="rr-stat-label">Cash paid out (drawer)</h2>
            <p className="rr-stat-value rr-orange">{inr(totals.cash)}</p>
          </article>
          <article className="rr-stat">
            <h2 className="rr-stat-label">Reversals pending</h2>
            <p className="rr-stat-value rr-blue">{totals.pending}</p>
          </article>
        </section>

        <div className="rr-filters" role="tablist" aria-label="Filter by type">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              role="tab"
              aria-selected={filter === f}
              className={"rr-chip" + (filter === f ? " is-active" : "")}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <section className="rr-table-wrap">
          <table className="rr-table">
            <thead>
              <tr>
                <th>Ref</th>
                <th>Time</th>
                <th>Bill</th>
                <th>Type</th>
                <th>Reason</th>
                <th className="rr-num">Amount</th>
                <th>Refund via</th>
                <th>Status</th>
                <th>Loss to</th>
                <th>By / approval</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 && (
                <tr className="rr-empty">
                  <td colSpan={11}>No {filter.toLowerCase()} entries yet.</td>
                </tr>
              )}
              {visible.map((r) => (
                <tr key={r.ref}>
                  <td data-label="Ref" className="rr-ref-cell">
                    <span className="rr-mono rr-ref">{r.ref}</span>
                    {r.cn && <span className="rr-mono rr-cn">{r.cn}</span>}
                  </td>
                  <td data-label="Time" className="rr-mono rr-time">{r.time}</td>
                  <td data-label="Bill">
                    <span className="rr-strong">{r.bill}</span>
                    <span className="rr-sub">{r.meta}</span>
                  </td>
                  <td data-label="Type">
                    <span className={"rr-badge rr-type-" + TYPE_CLASS[r.type]}>{r.type}</span>
                  </td>
                  <td data-label="Reason">
                    <span className="rr-strong">{r.reason}</span>
                    {r.item && <span className="rr-sub">{r.item}</span>}
                  </td>
                  <td data-label="Amount" className="rr-num rr-mono rr-amount">{inr(r.amount)}</td>
                  <td data-label="Refund via">{r.via}</td>
                  <td data-label="Status">
                    <span className={"rr-badge rr-status-" + r.status.toLowerCase()}>{r.status}</span>
                    {r.note && <span className="rr-sub">{r.note}</span>}
                  </td>
                  <td data-label="Loss to">{r.loss}</td>
                  <td data-label="By / approval">
                    <span className="rr-strong">Anitha M.</span>
                    <span className="rr-sub">Manager (PIN)</span>
                  </td>
                  <td className="rr-action-cell">
                    {r.status === "Pending" && (
                      <button type="button" className="rr-settle" onClick={() => markSettled(r.ref)}>
                        <CheckIcon />
                        Mark settled
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
   
    
        </section>
        
      </main>

      <ReturnsInsights rows={rows} />
    </div>
  );
}