import { useEffect, useMemo, useState } from "react";
import "../../../assets/styles/bills.css";

const FILTERS = ["All", "Paid", "Void", "Refunded"];

// First 12 rows are from the screenshot; the last 4 are sample rows so the Void / Refunded filters have data.
const INITIAL_BILLS = [
  { id: "AN-0012", time: "21:52", table: "T2", order: "Dine-in", captain: "Priya S.", guest: null, phone: null, mode: "UPI", total: 1281, status: "paid" },
  { id: "AN-0033", time: "21:15", table: "T6", order: "Dine-in", captain: "Priya S.", guest: null, phone: "9306266370", mode: "Split", total: 1092, status: "paid" },
  { id: "AN-0036", time: "20:57", table: "F3", order: "Dine-in", captain: "Divya R.", guest: "Prakash Kumar", phone: "9789123450", mode: "UPI", total: 966, status: "paid" },
  { id: "AN-0037", time: "20:53", table: "F2", order: "Dine-in", captain: "Karthik M.", guest: null, phone: "9387992310", mode: "Cash", total: 1554, status: "paid" },
  { id: "AN-0010", time: "20:48", table: "R1", order: "Dine-in", captain: "Divya R.", guest: null, phone: "9525675220", mode: "UPI", total: 1029, status: "paid" },
  { id: "AN-0021", time: "20:47", table: "T2", order: "Dine-in", captain: "Ravi K.", guest: null, phone: null, mode: "UPI", total: 1134, status: "paid" },
  { id: "AN-0027", time: "20:39", table: "DEL-01", order: "Delivery", captain: "Divya R.", guest: null, phone: null, mode: "Split", total: 252, status: "paid" },
  { id: "AN-0019", time: "20:37", table: "T4", order: "Dine-in", captain: "Ravi K.", guest: null, phone: null, mode: "Card", total: 704, status: "paid" },
  { id: "AN-0034", time: "20:35", table: "DEL-08", order: "Delivery", captain: "Karthik M.", guest: "Mohammed Irfan", phone: "9840770012", mode: "Card", total: 1449, status: "paid" },
  { id: "AN-0002", time: "20:31", table: "TA-03", order: "Takeaway", captain: "Divya R.", guest: null, phone: "9487739917", mode: "Cash", total: 368, status: "paid" },
  { id: "AN-0005", time: "20:26", table: "DEL-06", order: "Delivery", captain: "Karthik M.", guest: "Karthikeyan S", phone: "9791288340", mode: "UPI", total: 893, status: "paid" },
  { id: "AN-0043", time: "20:20", table: "F3", order: "Dine-in", captain: "Ravi K.", guest: null, phone: null, mode: "Card", total: 447, status: "paid" },
  { id: "AN-0035", time: "13:27", table: "T3", order: "Dine-in", captain: "Priya S.", guest: null, phone: null, mode: "UPI", total: 658, status: "void" },
  { id: "AN-0007", time: "14:32", table: "T5", order: "Dine-in", captain: "Ravi K.", guest: null, phone: null, mode: "Card", total: 1554, status: "void" },
  { id: "AN-0024", time: "13:55", table: "F1", order: "Dine-in", captain: "Divya R.", guest: null, phone: null, mode: "Cash", total: 588, status: "refunded" },
  { id: "AN-0042", time: "13:03", table: "DEL-02", order: "Delivery", captain: "Karthik M.", guest: null, phone: "9791230045", mode: "UPI", total: 315, status: "refunded" },
];

const inr = (n) => "₹" + n.toLocaleString("en-IN");

function getInitialTheme() {
  if (typeof window === "undefined") return "dark";
  try {
    const saved = window.localStorage.getItem("rr-theme");
    if (saved === "light" || saved === "dark") return saved;
  } catch (e) {
    /* storage unavailable */
  }
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

const Icon = ({ children, size = 15 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const BillsIcon = () => (
  <Icon size={18}>
    <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" />
    <path d="M9 8h6M9 12h6" />
  </Icon>
);
const PrintIcon = () => (
  <Icon>
    <path d="M7 9V3h10v6" />
    <rect x="4" y="9" width="16" height="8" rx="2" />
    <path d="M7 14h10v7H7z" />
  </Icon>
);
const ChatIcon = () => (
  <Icon>
    <path d="M4 5h16v11H9l-5 4V5Z" />
  </Icon>
);
const RefundIcon = () => (
  <Icon size={13}>
    <path d="M9 14 4 9l5-5" />
    <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
  </Icon>
);
const VoidIcon = () => (
  <Icon size={13}>
    <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
  </Icon>
);
const SearchIcon = () => (
  <Icon size={15}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Icon>
);
const SunIcon = () => (
  <Icon size={16}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Icon>
);
const MoonIcon = () => (
  <Icon size={16}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
  </Icon>
);

export default function Bills() {

  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [bills, setBills] = useState(INITIAL_BILLS);


  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return bills.filter((b) => {
      if (filter !== "All" && b.status !== filter.toLowerCase()) return false;
      if (!q) return true;
      return [b.id, b.table, b.phone, b.guest, b.captain]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q));
    });
  }, [bills, filter, query]);

  const counts = useMemo(
    () => ({
      voids: bills.filter((b) => b.status === "void").length,
      refunds: bills.filter((b) => b.status === "refunded").length,
    }),
    [bills]
  );

  const setStatus = (id, status) =>
    setBills((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));

  return (
    <div className="bl">
      <header className="bl-header">
        <div className="bl-title-group">
          <h1 className="bl-title">
            <BillsIcon />
            <span>Bills</span>
          </h1>
          <span className="bl-count">64 today</span>
        </div>

        <div className="bl-tools">
          <label className="bl-search">
            <SearchIcon />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search bill / table / mobile"
              aria-label="Search bill, table or mobile"
            />
          </label>

          <div className="bl-filters" role="tablist" aria-label="Filter bills">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={filter === f}
                className={"bl-chip" + (filter === f ? " is-active" : "")}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

         
        </div>
      </header>

      <main className="bl-main">
        <section className="bl-stats" aria-label="Summary">
          <article className="bl-stat">
            <h2 className="bl-stat-label">Net collected</h2>
            <p className="bl-stat-value">₹52,906</p>
          </article>
          <article className="bl-stat">
            <h2 className="bl-stat-label">Settled bills</h2>
            <p className="bl-stat-value">60</p>
          </article>
          <article className="bl-stat">
            <h2 className="bl-stat-label">Voids</h2>
            <p className="bl-stat-value bl-orange">{counts.voids}</p>
          </article>
          <article className="bl-stat">
            <h2 className="bl-stat-label">Refunds / credit notes</h2>
            <p className="bl-stat-value bl-orange">{counts.refunds}</p>
          </article>
        </section>

        <section className="bl-table-wrap">
          <table className="bl-table">
            <thead>
              <tr>
                <th>Bill</th>
                <th>Time</th>
                <th>Table / Order</th>
                <th>Captain</th>
                <th>Guest</th>
                <th>Mode</th>
                <th className="bl-num">Total</th>
                <th>WhatsApp</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.length === 0 && (
                <tr className="bl-empty">
                  <td colSpan={10}>No bills match. Try a different search or filter.</td>
                </tr>
              )}
              {visible.map((b) => {
                const closed = b.status !== "paid";
                return (
                  <tr key={b.id} className={closed ? "is-closed" : undefined}>
                    <td data-label="Bill" className="bl-mono bl-bill">{b.id}</td>
                    <td data-label="Time" className="bl-mono bl-time">{b.time}</td>
                    <td data-label="Table / Order">
                      <span className="bl-strong">{b.table}</span>
                      <span className="bl-sub">{b.order}</span>
                    </td>
                    <td data-label="Captain">{b.captain}</td>
                    <td data-label="Guest">
                      {b.guest ? (
                        <>
                          <span className="bl-strong">{b.guest}</span>
                          <span className="bl-sub">{b.phone}</span>
                        </>
                      ) : b.phone ? (
                        <span className="bl-muted">{b.phone}</span>
                      ) : (
                        <span className="bl-muted">—</span>
                      )}
                    </td>
                    <td data-label="Mode">{b.mode}</td>
                    <td data-label="Total" className="bl-num bl-mono bl-total">{inr(b.total)}</td>
                    <td data-label="WhatsApp">
                      {b.phone ? (
                        <span className="bl-pill bl-pill-delivered">delivered</span>
                      ) : (
                        <span className="bl-pill bl-pill-none">No number</span>
                      )}
                    </td>
                    <td data-label="Status">
                      <span className={"bl-pill bl-status-" + b.status}>{b.status}</span>
                    </td>
                    <td data-label="Actions" className="bl-actions-cell">
                      <div className="bl-actions">
                        <button type="button" className="bl-icon-btn" aria-label={`Print bill ${b.id}`} title="Print">
                          <PrintIcon />
                        </button>
                        <button type="button" className="bl-icon-btn" aria-label={`Send bill ${b.id} on WhatsApp`} title="Send on WhatsApp">
                          <ChatIcon />
                        </button>
                        <button
                          type="button"
                          className="bl-text-btn"
                          disabled={closed}
                          onClick={() => setStatus(b.id, "refunded")}
                          aria-label={`Refund bill ${b.id}`}
                        >
                          <RefundIcon />
                          Refund
                        </button>
                        <button
                          type="button"
                          className="bl-icon-btn bl-icon-btn-sm"
                          disabled={closed}
                          onClick={() => setStatus(b.id, "void")}
                          aria-label={`Void bill ${b.id}`}
                          title="Void"
                        >
                          <VoidIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}