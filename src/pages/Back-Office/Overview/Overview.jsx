import React, { useState } from "react";
import "../../../assets/styles/back-office/overview.css";
import { useNavigate } from "react-router-dom";
import LogWastageModal from "./LogWastageModal";
import IndentModal from "./IndentModal";
import GrnModal from "./GrnModal";

/* ---------- Static data (replace with API / props) ---------- */

const KPI_ROW_1 = [
  { label: "Sales today", value: "₹1,00,073", tone: "green" },
  { label: "Orders today", value: "113", tone: "blue" },
  { label: "Average bill", value: "₹886", tone: "purple" },
  { label: "Open alerts", value: "14", tone: "red" },
];

const KPI_ROW_2 = [
  { label: "Payables", value: "₹10,195", tone: "amber" },
  { label: "Stock on hand", value: "₹38,715", tone: "blue" },
  { label: "Compliance", value: "77 / 100", tone: "green" },
  { label: "Kitchen stock", value: "₹9,998", tone: "purple" },
];

const PIPELINE = [
  { step: 1, title: "Reorder", note: "8 to order today", go: "stock" },
  { step: 2, title: "Purchase order", note: "2 open · 7 draft", go: "po" },
  { step: 3, title: "GRN", note: "0 received today", go: "grn" },
  { step: 4, title: "Store", note: "₹28,717", go: "stock" },
  { step: 5, title: "Indent & issue", note: "1 waiting", go: "issue" },
  { step: 6, title: "Kitchen", note: "₹9,998", go: "issue" },
  { step: 7, title: "Consumption", note: "0 sales today", go: "cons" },
  { step: 8, title: "Waste & counts", note: "6 logged today", go: "waste" },
];

// level: "err" | "pend" | "ok"
// target: { type: "panel" | "inv", id }
const ALERTS = [
  { level: "err", tag: "Stock", text: "Order Chicken today (0.8 days cover)", target: { type: "panel", id: "stk" } },
  { level: "err", tag: "Stock", text: "Order Mutton today (0.9 days cover)", target: { type: "panel", id: "stk" } },
  { level: "err", tag: "Stock", text: "Order Paneer today (0.9 days cover)", target: { type: "panel", id: "stk" } },
  { level: "err", tag: "Stock", text: "Order Biryani Masala today (1.4 days cover)", target: { type: "panel", id: "stk" } },
  { level: "err", tag: "Stock", text: "Order Curd today (1.9 days cover)", target: { type: "panel", id: "stk" } },
  { level: "err", tag: "Stock", text: "Order Wheat Flour (Maida) today (1.3 days cover)", target: { type: "panel", id: "stk" } },
  { level: "err", tag: "Stock", text: "Order Tomato today (1.2 days cover)", target: { type: "panel", id: "stk" } },
  { level: "err", tag: "Stock", text: "Order Butter today (1.7 days cover)", target: { type: "panel", id: "stk" } },
  { level: "err", tag: "Compliance", text: "GSTR-1 (outward supplies) due 11 Nov", target: { type: "panel", id: "comp" } },
  { level: "err", tag: "Compliance", text: "Staff health & hygiene certificates overdue by 2 days", target: { type: "panel", id: "comp" } },
  { level: "err", tag: "Compliance", text: "Food-handler medical certificate overdue by 2 days", target: { type: "panel", id: "comp" } },
  { level: "err", tag: "Compliance", text: "Potable water test report overdue by 6 days", target: { type: "panel", id: "comp" } },
  { level: "err", tag: "Reorder", text: "8 item(s) need ordering today: Chicken, Mutton, Paneer", target: { type: "inv", id: "po" } },
  { level: "err", tag: "IoT", text: "1 unacknowledged cold-chain alert(s)", target: { type: "panel", id: "iot" } },
  { level: "pend", tag: "Payout", text: "Selvam daily wage ₹550 due today", target: { type: "panel", id: "hr" } },
  { level: "pend", tag: "Payable", text: "Sri Lakshmi Traders: ₹6,195 unpaid on PB-001 (credit)", target: { type: "panel", id: "purch" } },
  { level: "pend", tag: "Payable", text: "Sister Concern – Central Kitchen: ₹4,000 unpaid on PB-002 (sister concern)", target: { type: "panel", id: "purch" } },
  { level: "pend", tag: "Compliance", text: "PF / ESI contribution due 15 Nov", target: { type: "panel", id: "comp" } },
  { level: "pend", tag: "Compliance", text: "Contract Labour licence renewal due 18 Nov", target: { type: "panel", id: "comp" } },
  { level: "pend", tag: "Purchase", text: "7 draft PO(s) waiting to be sent", target: { type: "inv", id: "po" } },
  { level: "pend", tag: "Store", text: "1 indent(s) waiting to be issued to the kitchen", target: { type: "inv", id: "issue" } },
  { level: "pend", tag: "Expiry", text: "3 batch(es) expire within 2 days: Chicken, Mutton, Eggs", target: { type: "inv", id: "stock" } },
  { level: "ok", tag: "Payout", text: "Chef Murugan monthly salary ₹42,000 due in 28 days", target: { type: "panel", id: "hr" } },
  { level: "ok", tag: "Payout", text: "Anitha M. monthly salary ₹17,308 due in 28 days", target: { type: "panel", id: "hr" } },
  { level: "ok", tag: "Payout", text: "Karthik S. weekly pay ₹4,200 due in 5 days", target: { type: "panel", id: "hr" } },
  { level: "ok", tag: "HR", text: "Ravi K. onboarding pending", target: { type: "panel", id: "hr" } },
];

// Hour -> sales height (already scaled 0-100). 0 = no sales.
const HOURLY_SALES = [
  { hour: 9, v: 0 }, { hour: 10, v: 0 }, { hour: 11, v: 28 }, { hour: 12, v: 30 },
  { hour: 13, v: 81 }, { hour: 14, v: 70 }, { hour: 15, v: 11 }, { hour: 16, v: 8 },
  { hour: 17, v: 20 }, { hour: 18, v: 38 }, { hour: 19, v: 97 }, { hour: 20, v: 100 },
  { hour: 21, v: 19 }, { hour: 22, v: 0 }, { hour: 23, v: 0 },
];

const SUPPLIER_DUES = [
  { name: "Sri Lakshmi Traders", amount: "₹6,195" },
  { name: "Sister Concern – Central Kitchen", amount: "₹4,000" },
];

/* ---------- Small icon ---------- */

const PlusIcon = () => (
  <svg className="ovw-icon" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

/* ---------- Sub-components ---------- */

function KpiCard({ label, value, tone }) {
  return (
    <div className={`ovw-kpi ovw-kpi--${tone}`}>
      <div className="ovw-kpi__label">{label}</div>
      <div className="ovw-kpi__value">{value}</div>
    </div>
  );
}

function SalesByHourChart({ data }) {
  const BASE = 110; // baseline y
  const STEP = 34; // x spacing
  return (
    <svg
      className="ovw-chart"
      viewBox="0 0 520 140"
      role="img"
      aria-label="Sales by hour today"
    >
      {data.map((d, i) => {
        const x = 6 + i * STEP;
        const empty = d.v === 0;
        const h = empty ? 2 : d.v;
        return (
          <g key={d.hour}>
            <rect
              className={`ovw-chart__bar ${empty ? "ovw-chart__bar--empty" : ""}`}
              x={x}
              y={BASE - h}
              width="24"
              height={h}
              rx="4"
            />
            <text
              className="ovw-chart__tick"
              x={x + 12}
              y="130"
              textAnchor="middle"
            >
              {d.hour}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ---------- Main component ---------- */

export default function Overview() {
  const [wasteOpen, setWasteOpen] = useState(false);
  const [indentOpen, setIndentOpen] = useState(false);
  const [grn, setGrn] = useState({ open: false, mode: "po" });

  const navigate = useNavigate()

  const handleAlertOpen = ({ type, id }) => {
    if (type === "inv") {
      invGo(id);
    } else if (id === "comp") {
      navigate("/back-office/compliance");
    } else if (id === "purch") {
      navigate("/back-office/purchase");
    } else if (id === "hr") {
      navigate("/back-office/staff");
    } else if (id === "stk") {
      invGo("stock");
    } else if (id === "iot") {
      navigate("/back-office/iot");
    }
  };

  const dateLabel = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });


  const invGo = (tab) => {
    navigate(`/back-office/inventory?tab=${tab}`);
  };

  const handleWasteSave = (entry) => {
    // entry = { item: "rice", location: "Store", quantity: 1, reason: "Prep trim" }
    console.log("wastage logged:", entry);
    // TODO: POST to your API, then refresh the "Waste & counts" number
  };

  const handleIndentSave = ({ station, lines, issueNow }) => {
    // lines = [{ id: "pan", name: "Paneer", unit: "kg", qty: 1.6 }, ...]
    // issueNow = true  → "Issue straight away"
    // issueNow = false → "Send to store"
    console.log(station, lines, issueNow);
    // TODO: POST to your API
  };

  const openGrn = (mode = "po") => setGrn({ open: true, mode });

  const handleGrnSave = (data) => {
    // data = {
    //   mode: "po" | "direct", poId, supplier, invoice, temperature,
    //   lines: [{ itemId, received, rejected, accepted, batch, expiry, rate }]
    // }
    console.log(data);
    // TODO: POST to your API
  };

  return (
    <section className="ovw-root">
      {/* Header */}
      <header className="ovw-head">
        <h2 className="ovw-head__title">
          <span aria-hidden="true">🏢</span> Overview
          <span className="ovw-head__date">{dateLabel}</span>
        </h2>
        <div className="ovw-head__actions">
          <button className="ovw-btn" onClick={() => setWasteOpen(true)}>
            Log wastage
          </button>
          <button className="ovw-btn" onClick={() => setIndentOpen(true)}>
            <PlusIcon />
            Indent
          </button>
          <button className="ovw-btn ovw-btn--primary" onClick={() => openGrn("po")}>
            <PlusIcon />
            GRN
          </button>
        </div>
      </header>

      <div className="ovw-body">
        {/* KPI rows */}
        <div className="ovw-kpi-grid">
          {KPI_ROW_1.map((k) => (
            <KpiCard key={k.label} {...k} />
          ))}
        </div>
        <div className="ovw-kpi-grid">
          {KPI_ROW_2.map((k) => (
            <KpiCard key={k.label} {...k} />
          ))}
        </div>

        <div className="ovw-content">
          {/* Supply chain pipeline */}
          <div className="ovw-card">
            <div className="ovw-card__title">Supply chain today</div>
            <div className="ovw-pipeline">
              {PIPELINE.map((p) => (
                <button
                  key={p.step}
                  className="ovw-pipeline__step"
                  onClick={() => invGo(p.go)}
                >
                  <span className="ovw-pipeline__num">{p.step}</span>
                  <b className="ovw-pipeline__name">{p.title}</b>
                  <span className="ovw-pipeline__note">{p.note}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Alerts + side column */}
          <div className="ovw-split">
            <div className="ovw-card">
              <div className="ovw-card__title">
                Needs your attention
                <span className="ovw-count">{ALERTS.length}</span>
              </div>
              {ALERTS.map((a, i) => (
                <div className="ovw-row" key={i}>
                  <div className="ovw-row__text">
                    <span className={`ovw-chip ovw-chip--${a.level}`}>{a.tag}</span>
                    {a.text}
                  </div>
                  <button className="ovw-btn ovw-btn--sm" onClick={() => handleAlertOpen(a.target)}>
                    Open
                  </button>
                </div>
              ))}
            </div>

            <div className="ovw-side">
              <div className="ovw-card ovw-card--gap">
                <div className="ovw-card__title">Sales by hour</div>
                <SalesByHourChart data={HOURLY_SALES} />
              </div>

              <div className="ovw-card">
                <div className="ovw-card__title">Owed to suppliers</div>
                {SUPPLIER_DUES.map((s) => (
                  <div className="ovw-row" key={s.name}>
                    <div>{s.name}</div>
                    <b>{s.amount}</b>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {wasteOpen && <LogWastageModal
        open={wasteOpen}
        onClose={() => setWasteOpen(false)}
        onSave={handleWasteSave}
      />}
      {indentOpen && <IndentModal
        open={indentOpen}
        onClose={() => setIndentOpen(false)}
        onSave={handleIndentSave} />}
      {grn && <GrnModal 
       open={grn.open}
        mode={grn.mode}
        onClose={() => setGrn((g) => ({ ...g, open: false }))}
        onSave={handleGrnSave}/>}

    </section>
  );
}
