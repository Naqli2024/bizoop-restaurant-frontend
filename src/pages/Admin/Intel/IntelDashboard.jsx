import { useRef, useState } from "react";
import "../../../../assets/styles/intelDashboaed.css";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PurchaseOrderModal from "./PurchaseOrderModal";

/* ---------- data (replace with API / store data) ---------- */
const kpis = [
    { label: "Sales", tone: "green", value: "₹1,00,073", hint: "9% vs 7-day avg" },
    { label: "Gross margin", tone: "green", value: "₹68,058", hint: "68% of sales" },
    { label: "Food cost", tone: "orange", value: "32.0%", hint: "target 30%" },
    { label: "Labour", tone: "green", value: "11.9%", hint: "target 12%" },
    { label: "Wastage", tone: "green", value: "₹339", hint: "logged today" },
    { label: "Purchase", tone: "green", value: "₹21,286", hint: "GRN today" },
    { label: "Cash variance", tone: "orange", value: "₹800", hint: "vs expected ₹22,450" },
    { label: "Customers", tone: "green", value: "276", hint: "covers today" },
    { label: "Avg bill", tone: "green", value: "₹886", hint: "per bill" },
    { label: "Kitchen SLA", tone: "green", value: "91%", hint: "target 90%" },
];

const actions = [
    { tone: "red", text: "Paneer variance ₹749 (32.4% over)", btn: "Investigate", key: "recon" },
    { tone: "red", text: "Food cost 32.0% — 2.0 pts above 30% target", btn: "View causes", key: "causes" },
    { tone: "orange", text: "4 items at/below minimum — PO required", btn: "Create PO", key: "po" },
    { tone: "orange", text: "T Nagar food cost 34% — purchase rates & portions off", btn: "Compare outlets", key: "outlets" },
    { tone: "orange", text: "Cash variance ₹800 on today's counter close", btn: "Investigate", key: "cash" },
    { tone: "green", text: "Dinner demand forecast +18% — raise biryani prep", btn: "Prepare", key: "prep" },
];

const healthScores = [
    ["Sales", 78], ["Profit", 88], ["Food cost", 76], ["Labour", 100], ["Inventory", 24],
    ["Cash flow", 86], ["Customer", 84], ["SOP", 91], ["Compliance", 77],
];

const salesRows = [
    ["Today", "₹1,00,073", true],
    ["7-day average", "₹91,971"],
    ["Forecast closing", "₹1,10,881"],
    ["Discounts given", "₹1,314"],
    ["New vs returning", "18 / 46"],
];

const foodCostQA = [
    ["① What happened", "Food cost 32.0% (₹32,015 actual usage on ₹1,00,073 sales)"],
    ["② Expected", "Target 30% · theoretical usage ₹29,421 (29.4%)"],
    ["③ Variance", "₹2,594 today · +2.0 pts vs target"],
    ["④ Why", "Paneer +0.7% · Seer Fish +0.5% · Chicken +0.4% · Cooking Oil +0.2% — unlogged waste, over-portioning or short delivery (see Recon)"],
    ["⑤ What next", "If unchanged: ≈ ₹77,813 extra cost this month"],
    ["⑥ Recommendation", "Trim top-variance portion by ~5% (re-weigh at pass), or lift price of Chicken Biryani by ₹10"],
    ["⑦ Who acts", "Store manager → recount flagged items · Chef → portion audit · Owner → approve price/recipe change"],
];

const CLASS_TAG = {
    star: ["⭐ Star", "bz-tag-star"],
    traffic: ["🔥 Traffic driver", "bz-tag-traffic"],
    problem: ["❌ Problem", "bz-tag-problem"],
    profit: ["💰 Profit driver", "bz-tag-profit"],
};

// [emoji, name, class, sold, revenue, foodCost%, margin/plate, highCost?]
const menu = [
    ["🍛", "Butter Chicken", "star", 29, "₹9,280", "22%", "₹249"],
    ["🥩", "Mutton Biryani", "traffic", 28, "₹8,960", "73%", "₹86", true],
    ["🧀", "Paneer Butter Masala", "traffic", 30, "₹8,400", "26%", "₹207"],
    ["🍗", "Tandoori Chicken (Half)", "traffic", 28, "₹8,400", "27%", "₹220"],
    ["🍗", "Chicken 65", "traffic", 32, "₹7,040", "23%", "₹169"],
    ["🧀", "Paneer Tikka", "traffic", 26, "₹6,240", "23%", "₹184"],
    ["🍳", "Kothu Parotta", "star", 19, "₹3,610", "9%", "₹172"],
    ["🍚", "Chicken Biryani", "problem", 15, "₹3,300", "44%", "₹124", true],
    ["🌶", "Chicken Chettinad", "profit", 11, "₹3,300", "19%", "₹243"],
    ["🍢", "Chicken Tikka", "profit", 12, "₹3,120", "18%", "₹213"],
    ["🫓", "Butter Naan", "star", 50, "₹3,000", "17%", "₹50"],
    ["🧋", "Cold Coffee", "star", 17, "₹1,870", "16%", "₹93"],
    ["☕", "Filter Coffee", "traffic", 34, "₹1,700", "30%", "₹35"],
    ["🥞", "Kerala Parotta", "traffic", 51, "₹1,530", "24%", "₹23"],
    ["🥣", "Dal Tadka", "profit", 7, "₹1,330", "4%", "₹183"],
    ["🥭", "Mango Lassi", "profit", 13, "₹1,170", "15%", "₹77"],
    ["🍚", "Veg Biryani", "problem", 6, "₹1,080", "25%", "₹135"],
    ["🫓", "Garlic Naan", "profit", 15, "₹1,050", "18%", "₹57"],
    ["🥚", "Egg Biryani", "problem", 5, "₹950", "27%", "₹139"],
    ["🫓", "Tandoori Roti", "profit", 13, "₹455", "10%", "₹31"],
    ["🍵", "Masala Chai", "profit", 8, "₹320", "17%", "₹33"],
];

const leakage = [
    {
        name: "Chicken Biryani",
        rows: [["Basmati Rice", "200 → 207g"], ["Chicken", "250 → 272g"], ["Biryani Masala", "20 → 20g"]],
        perPlate: "₹6.39", sold: 15, total: "₹96",
    },
    {
        name: "Butter Chicken",
        rows: [["Chicken", "220 → 239g"], ["Butter", "30 → 31g"], ["Tomato", "120 → 122g"]],
        perPlate: "₹4.56", sold: 29, total: "₹132",
    },
];

const wasteRows = [["Curdled", "33%"], ["Over-prep", "25%"], ["Returned by customer", "24%"], ["Spoiled", "19%"]];

const vendors = [
    ["Fresh Poultry Co.", 77, "Stable"],
    ["Sri Lakshmi Traders", 87, "Stable"],
    ["Aavin Dairy", 88, "Stable"],
    ["Sakthi Masala", 84, "Stable"],
    ["Koyambedu Market", 71, "Delivery delays + shortages up"],
];

const aggregatorRows = [
    ["Menu price", "₹220"],
    ["Commission 22% + discount 10%", "−₹70"],
    ["Net realization", "₹150"],
    ["Food cost", "₹96"],
];

const stations = [
    ["🍳 Main Kitchen", "19 min vs SLA 18", "green"],
    ["🔥 Tandoor", "18 min vs SLA 14", "red"],
    ["🍹 Bar", "6 min vs SLA 6", "green"],
    ["🍨 Dessert", "5 min vs SLA 5", "green"],
];

const scoreClass = (s) => (s >= 85 ? "bz-tag-score-good" : s >= 75 ? "bz-tag-score-mid" : "bz-tag-score-bad");

/* ---------- small building blocks ---------- */
const Panel = ({ title, note, children, innerRef }) => (
    <section className="bz-panel" ref={innerRef}>
        <header className="bz-panel-title">
            <span>{title}</span>
            {note && <span className="bz-panel-note">{note}</span>}
        </header>
        {children}
    </section>
);

const Row = ({ label, value, strong, negative }) => (
    <div className="bz-line-row">
        {strong ? <b>{label}</b> : <span>{label}</span>}
        <span className={`bz-figure${negative ? " bz-negative" : ""}`}>
            {strong ? <b>{value}</b> : value}
        </span>
    </div>
);

/* ---------- main component ---------- */
export default function IntellDashboard() {
    const navigate = useNavigate();
    const explainRef = useRef(null);
    const [poOpen, setPoOpen] = useState(false);

    const handleAction = (key) => {
        switch (key) {
            case "recon": return navigate("/back-office/recon");
            case "causes":
                navigate("/admin/intel-dash");
                return explainRef.current?.scrollIntoView({ behavior: "smooth" });
            case "po": return setPoOpen(true);
            case "outlets": return navigate("/admin/ctl", { state: { compare: "out" } });
            case "cash": return navigate("/cashier/day-end");
            case "prep": return navigate("/admin/sop-recipes");
            default:
        }
    };

    return (
        <div className="bz-root">
            <div className="bz-head">
                <div className="bz-head-title">
                    🧠 Intelligence dashboard
                    <span className="bz-chip-sub">what · why · next · who</span>
                </div>
                <span className="bz-health-pill">Health 78/100 · Healthy</span>
            </div>

            <div className="bz-kpi-grid">
                {kpis.map((k) => (
                    <div className="bz-kpi" key={k.label}>
                        <div className="bz-kpi-label">{k.label} <span className={`bz-dot bz-dot-${k.tone}`} /></div>
                        <div className="bz-kpi-value">{k.value}</div>
                        <div className="bz-kpi-hint">{k.hint}</div>
                    </div>
                ))}
            </div>

            <div className="bz-body">
                <Panel title="🔔 BOS Action Centre" note="actions, not notifications">
                    {actions.map((a) => (
                        <div className="bz-line-row" key={a.text}>
                            <span><span className={`bz-dot bz-dot-${a.tone}`} /> {a.text}</span>
                            <button className="bz-btn" onClick={() => handleAction(a.key)}>{a.btn}</button>
                        </div>
                    ))}
                </Panel>

                <div className="bz-two-col">
                    <Panel title="Restaurant health score" note="weighted: sales 20 · profit 20 · food cost 15 …">
                        {healthScores.map(([n, v]) => <Row key={n} label={n} value={v} />)}
                    </Panel>
                    <Panel title="Sales intelligence">
                        {salesRows.map(([n, v, s]) => <Row key={n} label={n} value={v} strong={s} />)}
                        <div className="bz-tip">
                            AI: dinner trending 14% above normal; 328 customers dormant 45+ days → run a win-back campaign.
                        </div>
                    </Panel>
                </div>

                <Panel title="AI explanation panel — Food cost" note="the 7 intelligence questions" innerRef={explainRef}>
                    <table className="bz-qa">
                        <tbody>
                            {foodCostQA.map(([q, a]) => (
                                <tr key={q}><td>{q}</td><td>{a}</td></tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="bz-btn-row">
                        <button className="bz-btn" onClick={() => navigate("/admin/sop-recipes")}>Review recipe</button>
                        <button className="bz-btn" onClick={() => setPoOpen(true)}>Review purchase</button>
                        <button className="bz-btn bz-btn-primary" onClick={() => navigate("/admin/ctl")}>
                            ✓ Approve price change (What-if)
                        </button>
                    </div>
                </Panel>

                <Panel title="Menu intelligence" note="median split of units × margin">
                    <div className="bz-table-wrap">
                        <table className="bz-table">
                            <thead>
                                <tr>
                                    <th>Item</th><th>Class</th>
                                    <th className="bz-right">Sold</th><th className="bz-right">Revenue</th>
                                    <th className="bz-right">Food cost</th><th className="bz-right">Margin/plate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {menu.map(([icon, name, cls, sold, rev, fc, mg, hot]) => {
                                    const [label, tagClass] = CLASS_TAG[cls];
                                    return (
                                        <tr key={name}>
                                            <td>{icon} {name}</td>
                                            <td><span className={`bz-tag ${tagClass}`}>{label}</span></td>
                                            <td className="bz-right bz-figure">{sold}</td>
                                            <td className="bz-right bz-figure">{rev}</td>
                                            <td className={`bz-right bz-figure${hot ? " bz-negative" : ""}`}>{fc}</td>
                                            <td className="bz-right bz-figure">{mg}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Panel>

                <div className="bz-two-col">
                    <Panel title="Recipe intelligence — cost leakage" note="standard → actual avg">
                        {leakage.map((r) => (
                            <div className="bz-sub-block" key={r.name}>
                                <b>{r.name}</b>
                                {r.rows.map(([n, v]) => <Row key={n} label={n} value={v} />)}
                                <div className="bz-faint">
                                    Leakage {r.perPlate}/plate × {r.sold} sold = <b className="bz-negative">{r.total}</b> today
                                </div>
                            </div>
                        ))}
                    </Panel>
                    <Panel title="Waste intelligence">
                        <Row label="Today" value="₹339" strong />
                        {wasteRows.map(([n, v]) => <Row key={n} label={n} value={v} />)}
                        <div className="bz-tip">AI: reduce biryani prep by ~12 portions at Tuesday lunch.</div>
                    </Panel>
                </div>

                <div className="bz-two-col">
                    <Panel title="Vendor intelligence" note="price 25 · quality 25 · delivery 20 · shortage/credit/reliability 10 each">
                        <div className="bz-table-wrap">
                            <table className="bz-table">
                                <thead><tr><th>Vendor</th><th className="bz-right">Score</th><th>Note</th></tr></thead>
                                <tbody>
                                    {vendors.map(([n, s, note]) => (
                                        <tr key={n}>
                                            <td>{n}</td>
                                            <td className="bz-right"><span className={`bz-tag ${scoreClass(s)}`}>{s}</span></td>
                                            <td className="bz-faint">{note}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Panel>
                    <Panel title="Aggregator realization — Chicken Biryani" note="assumed rates; replace with Swiggy/Zomato statements">
                        {aggregatorRows.map(([n, v]) => <Row key={n} label={n} value={v} />)}
                        <Row label="Contribution" value="₹53" strong />
                    </Panel>
                </div>

                <div className="bz-two-col">
                    <Panel title="Kitchen & SOP intelligence">
                        {stations.map(([n, v, tone]) => (
                            <Row key={n} label={n} value={<>{v} <span className={`bz-dot bz-dot-${tone}`} /></>} />
                        ))}
                        <div className="bz-tip">
                            SOP: opening 96% · kitchen 91% · cleaning 87% · closing 94%. ⚠ Refrigeration temp check missed 4 days running.
                        </div>
                    </Panel>
                    <Panel title="Cash, payroll & expenses">
                        <Row label="Expected cash" value="₹22,450" />
                        <Row label="Actual cash" value="₹21,650" />
                        <Row label="Variance" value="₹800" strong negative />
                        <div className="bz-tip">
                            Payroll expected ₹46,000 over budget · electricity +16% vs sales +4% · Oven 1: 4 breakdowns in 60 days (consider replacement).
                        </div>
                    </Panel>
                </div>

                <p className="bz-footnote">
                    Live: sales, food cost, waste, stock variance, menu class, leakage and health score are computed from this app's data.
                    Labour, SLA, vendor, SOP, payroll and equipment items are illustrative until those feeds are connected.
                </p>
                <div>
                    <button onClick={() => navigate('/admin/intel')} className="staff-back-btn">
                        <ArrowLeft size={14} />  Intel
                    </button>
                </div>
            </div>
            {poOpen && <PurchaseOrderModal
                open={poOpen}
                onClose={() => setPoOpen(false)} />}
        </div>
    );
}
