import { useNavigate } from "react-router-dom";
import "../../../assets/styles/command.css";
import { MessageSquare, Check } from "lucide-react";
import { useState } from "react";
import WhyModal from "../Command/WhyModal";
import { WHY_DATA } from "../Command/WhyData";
import { WORKSPACE_DATA } from "../../Admin/Command/WorkspaceData";
import ItemWorkspaceModal from "../../Admin/Command/ItemWorkspaceModal";

/* ---------- Data (replace with API / store values) ---------- */
const TODAY_ACTIONS = [
  { id: 1, level: "red", title: "1. Approve PO 1824 — ABC Foods", sub: "₹48,200 · needed before 3 PM", btn: "Approve", primary: true, action: "approve", icon: "check" },
  { id: 2, level: "red", title: "2. Investigate cash variance", sub: "₹800 · evening counter", btn: "Investigate", primary: true, action: "hub", path: "/cashier/day-end" },
  { id: 3, level: "orange", title: "3. Increase dinner prep", sub: "Forecast +7% vs normal", btn: "Review plan", action: "hub", path: "/admin/kitchen" },
  { id: 4, level: "green", title: "4. Promote Butter Chicken", sub: "High margin + good demand", btn: "Create offer", action: "hub", path: "/admin/marketing" },
];

const KPI_TOP = [
  { key: "sales", label: "Sales", value: "₹27,800", hint: "today so far", accent: "green" },
  { key: "sales", label: "Projected", value: "₹95,375", hint: "confidence 63%", accent: "primary" },
  { key: "sales", label: "Target", value: "₹97,936", hint: "28% achieved", accent: "orange" },
  { key: "fc", label: "Profit est.", value: "₹36,135", hint: "after food, labour, overhead", accent: "green" },
];

const KPI_BOTTOM = [
  { key: "fc", label: "Food cost", value: "32.0%", hint: "target 30%", accent: "orange" },
  { key: "lab", label: "Labour", value: "11.9%", hint: "target 12%", accent: "green" },
  { key: "waste", label: "Waste", value: "₹339", hint: "logged", accent: "orange" },
  { key: "cash", label: "Cash", value: "₹22,450", hint: "expected", accent: "blue" },
  { key: "orders", label: "Orders", value: "113", hint: "settled" },
  { key: "bill", label: "Avg bill", value: "₹886", hint: "" },
];

const HEALTH = [
  { level: "orange", label: "Sales", score: 78 },
  { level: "orange", label: "Food cost", score: 76 },
  { level: "green", label: "Labour", score: 100 },
  { level: "red", label: "Inventory", score: 24 },
  { level: "green", label: "Cash", score: 86 },
  { level: "green", label: "Customer", score: 84 },
  { level: "orange", label: "Kitchen", score: 70 },
  { level: "orange", label: "Compliance", score: 77 },
];

const FLOW = [
  { icon: "📈", label: "Projected", value: <b>₹95,375 (+7% vs normal)</b> },
  { icon: "🍳", label: "Kitchen", value: <span>Biryani 47 needed · 32 ready · <b>15 more</b></span> },
  { icon: "📦", label: "Store", value: "Chicken +2.1 kg · rice +2.4 kg" },
  { icon: "🛒", label: "Procurement", value: "Tomorrow: chicken 31 kg · rice 36 kg · oil 23 L" },
  { icon: "👥", label: "People", value: "Roster adequate" },
];

const AMBIENT = [
  "Sales: at risk — ₹2,561 short",
  "Kitchen: dinner preparation 32% behind demand",
  "Inventory: Paneer 32% above recipe standard",
  "Procurement: onions — stock sufficient, delay purchase 1 day",
  "Customers: 5 open complaints/reviews",
];

const MEMORY = [
  "Every Friday before a holiday, chicken consumption rises about 16–21%.",
  "ABC Foods averages a 4.7% delivery shortage.",
  "Biryani complaints rise when volume exceeds 220 portions a day.",
  "T Nagar consistently runs 5 pts higher food cost than Anna Nagar.",
  "Sunday tawa waits at T Nagar exceed standard when one cook is on shift.",
];

const Card = ({ title, aside, children }) => (
  <div className="card">
    <div className="card-hdr">
      {title}
      {aside && <span className="muted card-aside">{aside}</span>}
    </div>
    {children}
  </div>
);

const Row = ({ children, className = "" }) => (
  <div className={`srow ${className}`}>{children}</div>
);

const Kpi = ({ item, onWhy }) => (
  <button type="button" className="kpi" title="Why?" onClick={() => onWhy(item.key)}>
    <div className={`mc ${item.accent ? `accent-${item.accent}` : ""}`}>
      <div className="mc-l">{item.label}</div>
      <div className="mc-v">{item.value}</div>
      <div className="mc-h muted">{item.hint}</div>
    </div>
  </button>
);

/*
  ctas: one or more primary buttons shown in the modal footer.
  Content for the WHY modal, keyed by the KPI `key` used in CommandCentre.
  tone: "red" | "green" colours the breakdown value (same colours as the original UI).
  Replace with API data when real feeds exist.
*/

/* ---------- Main component ---------- */
export default function Command() {
  const [actions, setActions] = useState(TODAY_ACTIONS);
  const [currentPO, setCurrentPO] = useState(0);
  const [whyKey, setWhyKey] = useState(null); 
  const [wsKey, setWsKey] = useState(null); 

  const pos = [
    { no: 1824, vendor: "ABC Foods", amount: 48200 },
    { no: 1825, vendor: "Aavin Dairy", amount: 11060 },
    { no: 1826, vendor: "Sri Lakshmi Traders", amount: 10300 },
  ];

  const navigate = useNavigate();

  const whyData = whyKey ? WHY_DATA[whyKey] : null;
  const closeWhy = () => setWhyKey(null);
  const wsData = wsKey ? WORKSPACE_DATA[wsKey] : null;
  const closeWs = () => setWsKey(null);
  const whyCta = (path) => {
    if (!path) return;
    closeWhy();
    navigate(path);
  };

  const runAction = (a) => {
    if (a.action === "approve") {
      const nextPO = currentPO + 1;

      if (nextPO >= pos.length) {
        setActions((prev) => prev.filter((item) => item.id !== a.id));
        return;
      }

      setCurrentPO(nextPO);

      setActions((prev) =>
        prev.map((item) =>
          item.id === a.id
            ? {
              ...item,
              title: `1. Approve PO ${pos[nextPO].no} — ${pos[nextPO].vendor}`,
              sub: `₹${pos[nextPO].amount.toLocaleString("en-IN")} · needed before 3 PM`,
            }
            : item
        )
      );

      return;
    }

    if (a.path) {
      navigate(a.path);
    }
  };

  return (
    <div className="command">
      <div className="command-head">
        <span className="ph-title">
          🎛 Command Centre
          <span className="ph-badge">what is happening → why → what next → act</span>
        </span>
        <span className="tag t-ok">Business health 78/100</span>
      </div>

      <div className="command-scroll">
        <div className="pad">
          <Card title="What should I do today?">
            {actions.map((a) => (
              <Row key={a.id}>
                <span>
                  <span className={`dot ${a.level}`} />
                  <b>{a.title}</b>
                  <div className="muted sub">{a.sub}</div>
                </span>
                <button
                  className={`btn btn-sm ${a.primary ? "btn-p" : ""}`}
                  onClick={() => runAction(a)}
                >
                  {a.icon && <Check size={14} />}
                  {a.btn}
                </button>
              </Row>
            ))}
          </Card>
        </div>

        <div className="mg mg-4">
          {KPI_TOP.map((k) => (
            <Kpi key={k.label} item={k} onWhy={setWhyKey} />
          ))}
        </div>
        <div className="mg mg-6">
          {KPI_BOTTOM.map((k) => (
            <Kpi key={k.label} item={k} onWhy={setWhyKey} />
          ))}
        </div>

        <div className="pad">
          <div className="g2">
            <Card title="Business health — 78 / 100" aside="click any KPI above for WHY">
              {HEALTH.map((h) => (
                <Row key={h.label}>
                  <span>
                    <span className={`dot ${h.level}`} />
                    {h.label}
                  </span>
                  <span className="num">{h.score}</span>
                </Row>
              ))}
            </Card>

            <Card title="Expected → Actual → Variance → Reason → Action">
              <b className="command-sub">Chicken consumption</b>
              <Row><span>Expected</span><span className="num">28.9 kg</span></Row>
              <Row><span>Actual</span><span className="num">31.7 kg</span></Row>
              <Row>
                <span>Variance</span>
                <b className="num neg">+2.0 kg / 7.1%</b>
              </Row>
              <div className="muted mt">
                Why? 44% portion size · 37% logged waste · 20% unexplained
              </div>
              <div className="actions mt">
                <button className="btn btn-sm" onClick={() => navigate("/admin/sop-recipes")}>Review recipe</button>
                <button className="btn btn-sm" onClick={() => navigate("/back-office/recon")}>Check waste</button>
                <button className="btn btn-sm" onClick={() => setWsKey("chicken")}>Chicken workspace</button>
              </div>
            </Card>
          </div>

          <div className="g2">
            <Card title="Sales forecast → Kitchen → Store → Procurement → People">
              {FLOW.map((f) => (
                <Row key={f.label}>
                  <span>{f.icon} {f.label}</span>
                  <span>{f.value}</span>
                </Row>
              ))}
            </Card>

            <Card title="Ambient AI">
              {AMBIENT.map((t) => (
                <Row key={t}><span>{t}</span></Row>
              ))}
            </Card>
          </div>

          <div className="g2">
            <Card title="🧠 Restaurant memory" aside="illustrative until enough history is stored">
              {MEMORY.map((t) => (
                <Row key={t}><span>{t}</span></Row>
              ))}
            </Card>

            <Card title="Business simulator">
              <div className="muted">"What if I raise biryani ₹20?" "Chicken +15%?"</div>
              <div className="actions mt">
                <button className="btn btn-p" onClick={() => navigate("/admin/ctl")}>Open simulator</button>
                <button className="btn" onClick={() => navigate("/admin/ctl")}>
                  <MessageSquare size={12} aria-hidden="true" />
                  Ask BOS (WhatsApp)
                </button>
              </div>
            </Card>
          </div>

          <div className="muted footnote">
            Live: sales, projection, food cost, variance, stock, POs, complaints and the action
            list. Illustrative until feeds exist: labour %, cash variance, supplier shortage,
            memory patterns, finance and asset items.
          </div>
        </div>
      </div>

      {whyKey && <WhyModal data={whyData} onClose={closeWhy} onCta={whyCta} />}
      {wsKey && <ItemWorkspaceModal data={wsData} onClose={closeWs} />}
    </div>
  );
}
