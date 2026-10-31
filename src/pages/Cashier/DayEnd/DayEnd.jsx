import { useEffect, useMemo, useState } from "react";
import "../../../assets/styles/dayend.css";

const DATE_LABEL = "28 Oct";

const SUMMARY = {
  grossSales: 51265,
  discounts: 844,
  gst: 2534,
  collected: 52906,
  bills: 60,
  serviceCharge: 254,
  voids: 2,
  refunds: 2,
};

const CASH = { float: 3000, expenses: 450, system: 13440 };
const OTHER_MODES = [
  { key: "upi", label: "UPI", system: 30053, counted: 30053 },
  { key: "card", label: "Card", system: 12278, counted: 12278 },
];

const inr = (n) => "₹" + Math.abs(n).toLocaleString("en-IN");
const signed = (n) => (n === 0 ? "₹0" : (n > 0 ? "+" : "−") + inr(n));

const Svg = ({ children, size = 16, sw = 2 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const MoonIcon = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
    <path d="M20.5 14.5A8.500 8.500 0 0 1 9.500 3.500a8.500 8.500 0 1 0 11 11Z" fill="#f5b83d" />
  </svg>
);
const SunIcon = () => (
  <Svg>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </Svg>
);
const WarnIcon = () => (
  <Svg size={14}>
    <path d="M12 3 2 20h20L12 3Z" />
    <path d="M12 10v4M12 17.500v.01" />
  </Svg>
);
const CheckIcon = () => (
  <Svg size={14} sw={2.6}>
    <path d="m5 12 5 5L20 7" />
  </Svg>
);
const ClipboardIcon = () => (
  <Svg size={14}>
    <rect x="6" y="4" width="12" height="17" rx="2" />
    <path d="M9 4h6v3H9z" />
  </Svg>
);
const ModeIcon = ({ kind }) => {
  if (kind === "cash")
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <rect x="2" y="6" width="20" height="12" rx="2" fill="#2fb45a" />
        <circle cx="12" cy="12" r="3" fill="#c9f2d6" />
      </svg>
    );
  if (kind === "upi")
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <rect x="6" y="2" width="12" height="20" rx="2.500" fill="#7a5cf0" />
        <rect x="8" y="5" width="8" height="10" rx="1" fill="#d9d0ff" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2.500" fill="#3b8bff" />
      <rect x="2" y="9" width="20" height="3" fill="#c7defe" />
    </svg>
  );
};

export default function DayEnd({ openOrders = 9, heldBills = 0, onClose }) {

  const [cashCounted, setCashCounted] = useState(String(CASH.system));
  const [closed, setClosed] = useState(false);



  const cashVariance = useMemo(() => {
    const n = Number(cashCounted);
    return cashCounted === "" || Number.isNaN(n) ? 0 : n - CASH.system;
  }, [cashCounted]);

  const varianceClass = (v) => (v === 0 ? "" : v < 0 ? " ds-var-short" : " ds-var-over");

  const checks = [
    openOrders > 0
      ? { tone: "red", icon: <WarnIcon />, text: `${openOrders} open table/order(s) still unbilled` }
      : { tone: "green", icon: <CheckIcon />, text: "All tables and orders billed" },
    heldBills > 0
      ? { tone: "red", icon: <WarnIcon />, text: `${heldBills} held bill(s) need a decision` }
      : { tone: "green", icon: <CheckIcon />, text: "No held bills" },
    {
      tone: "orange",
      icon: <ClipboardIcon />,
      text: `${SUMMARY.voids} voids · ${SUMMARY.refunds} refund(s) — all authorised and logged`,
    },
  ];
  if (cashVariance !== 0) {
    checks.push({
      tone: "red",
      icon: <WarnIcon />,
      text: `Cash is ${cashVariance < 0 ? "short" : "over"} by ${inr(cashVariance)} — recount before closing`,
    });
  }

  const blocked = openOrders > 0 || heldBills > 0;

  const handleClose = () => {
    setClosed(true);
    if (onClose) onClose({ cashCounted: Number(cashCounted), cashVariance });
  };

  return (
    <div className="ds" >
      <header className="ds-header">
        <div className="ds-title-group">
          <h1 className="ds-title">
            <MoonIcon />
            <span>Day-end settlement</span>
          </h1>
          <span className="ds-tag">{DATE_LABEL}</span>
        </div>
 
      </header>

      <main className="ds-main">
        <section className="ds-stats" aria-label="Summary">
          <article className="ds-stat">
            <h2 className="ds-stat-label">Gross sales</h2>
            <p className="ds-stat-value">{inr(SUMMARY.grossSales)}</p>
          </article>
          <article className="ds-stat">
            <h2 className="ds-stat-label">Discounts given</h2>
            <p className="ds-stat-value">{inr(SUMMARY.discounts)}</p>
          </article>
          <article className="ds-stat">
            <h2 className="ds-stat-label">GST (CGST+SGST)</h2>
            <p className="ds-stat-value">{inr(SUMMARY.gst)}</p>
          </article>
          <article className="ds-stat">
            <h2 className="ds-stat-label">Collected</h2>
            <p className="ds-stat-value">{inr(SUMMARY.collected)}</p>
            <p className="ds-stat-note">
              {SUMMARY.bills} bills · svc charge {inr(SUMMARY.serviceCharge)}
            </p>
          </article>
        </section>

        <div className="ds-grid">
          <section className="ds-panel" aria-labelledby="ds-recon">
            <h2 className="ds-panel-title" id="ds-recon">Payment mode reconciliation</h2>

            <div className="ds-table-wrap">
              <table className="ds-table">
                <thead>
                  <tr>
                    <th>Mode</th>
                    <th className="ds-num">System</th>
                    <th className="ds-num">Counted</th>
                    <th className="ds-num">Variance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td data-label="Mode">
                      <span className="ds-mode">
                        <ModeIcon kind="cash" />
                        <span className="ds-strong">Cash</span>
                      </span>
                      <span className="ds-sub">
                        float {inr(CASH.float)} − expenses {inr(CASH.expenses)}
                      </span>
                    </td>
                    <td data-label="System" className="ds-num ds-mono">{inr(CASH.system)}</td>
                    <td data-label="Counted" className="ds-num">
                      <input
                        type="number"
                        inputMode="numeric"
                        min="0"
                        className="ds-input ds-mono"
                        value={cashCounted}
                        onChange={(e) => setCashCounted(e.target.value)}
                        aria-label="Cash counted"
                      />
                    </td>
                    <td data-label="Variance" className={"ds-num ds-mono ds-variance" + varianceClass(cashVariance)}>
                      {signed(cashVariance)}
                    </td>
                  </tr>
                  {OTHER_MODES.map((m) => {
                    const v = m.counted - m.system;
                    return (
                      <tr key={m.key}>
                        <td data-label="Mode">
                          <span className="ds-mode">
                            <ModeIcon kind={m.key} />
                            <span className="ds-strong">{m.label}</span>
                          </span>
                        </td>
                        <td data-label="System" className="ds-num ds-mono">{inr(m.system)}</td>
                        <td data-label="Counted" className="ds-num ds-mono">{inr(m.counted)}</td>
                        <td data-label="Variance" className={"ds-num ds-mono ds-variance" + varianceClass(v)}>
                          {signed(v)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="ds-foot">
              UPI and card amounts match the gateway settlement files automatically in a full deployment.
            </p>
          </section>

          <section className="ds-panel" aria-labelledby="ds-before">
            <h2 className="ds-panel-title" id="ds-before">Before you close</h2>

            <ul className="ds-checks">
              {checks.map((c, i) => (
                <li key={i} className={"ds-check ds-check-" + c.tone}>
                  <span className="ds-check-icon">{c.icon}</span>
                  <span>{c.text}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              className="ds-close-btn"
              disabled={blocked || closed}
              onClick={handleClose}
            >
              {closed ? "Day closed" : "Close day & print Z-report"}
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}