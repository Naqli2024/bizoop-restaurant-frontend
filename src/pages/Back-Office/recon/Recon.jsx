import { useMemo, useState } from "react";
import "../../../assets/styles/back-office/recon.css"
import { Plus } from "lucide-react";
import WasteModal from "./WasteModal";

/* ---------- Seed data (replace with API data) ---------- */
const INITIAL_ITEMS = [
    { id: "rice", name: "Basmati Rice", cat: "Dry", tol: 2, unit: "kg", rate: 120, opening: 42.4, purchase: 30, closing: 38, theoretical: 34.0, waste: 0 },
    { id: "chk", name: "Chicken", cat: "Meat/Fish", tol: 7, unit: "kg", rate: 210, opening: 28.7, purchase: 25, closing: 22, theoretical: 28.9, waste: 0.8 },
    { id: "mut", name: "Mutton", cat: "Meat/Fish", tol: 7, unit: "kg", rate: 490, opening: 7.5, purchase: 0, closing: 4.2, theoretical: 3.2, waste: 0 },
    { id: "pan", name: "Paneer", cat: "Dairy", tol: 4, unit: "kg", rate: 340, opening: 5.5, purchase: 8, closing: 4.5, theoretical: 6.8, waste: 0 },
    { id: "mas", name: "Biryani Masala", cat: "Dry", tol: 2, unit: "kg", rate: 290, opening: 1.6, purchase: 1, closing: 1.1, theoretical: 1.4, waste: 0 },
    { id: "oil", name: "Cooking Oil", cat: "Dry", tol: 2, unit: "L", rate: 135, opening: 33.3, purchase: 20, closing: 31, theoretical: 21.0, waste: 0 },
    { id: "cur", name: "Curd", cat: "Dairy", tol: 4, unit: "kg", rate: 65, opening: 9.7, purchase: 14, closing: 12, theoretical: 11.5, waste: 0.1 },
    { id: "flr", name: "Wheat Flour (Maida)", cat: "Dry", tol: 2, unit: "kg", rate: 35, opening: 20.7, purchase: 14, closing: 18, theoretical: 16.5, waste: 0 },
    { id: "mlk", name: "Milk", cat: "Dairy", tol: 4, unit: "L", rate: 56, opening: 25.2, purchase: 30, closing: 25, theoretical: 27.0, waste: 2.0 },
    { id: "cof", name: "Coffee Decoction", cat: "Dry", tol: 2, unit: "L", rate: 220, opening: 11.3, purchase: 0, closing: 6, theoretical: 5.2, waste: 0 },
    { id: "onn", name: "Onion", cat: "Veg", tol: 6, unit: "kg", rate: 36, opening: 41.5, purchase: 30, closing: 40, theoretical: 31.0, waste: 0 },
    { id: "tom", name: "Tomato", cat: "Veg", tol: 6, unit: "kg", rate: 42, opening: 11, purchase: 15, closing: 9, theoretical: 14.0, waste: 1.5 },
    { id: "fsh", name: "Seer Fish", cat: "Meat/Fish", tol: 7, unit: "kg", rate: 780, opening: 4.2, purchase: 0, closing: 0, theoretical: 3.5, waste: 0 },
    { id: "btr", name: "Butter", cat: "Dairy", tol: 4, unit: "kg", rate: 570, opening: 3.5, purchase: 2, closing: 3.4, theoretical: 2.1, waste: 0 },
    { id: "egg", name: "Eggs", cat: "Meat/Fish", tol: 7, unit: "nos", rate: 6.3, opening: 125.9, purchase: 60, closing: 120, theoretical: 64.0, waste: 0 },
    { id: "pkg", name: "Packaging Box", cat: "Dry", tol: 2, unit: "nos", rate: 9, opening: 230.9, purchase: 0, closing: 140, theoretical: 90.0, waste: 0 },
];

const INITIAL_WASTE_LOG = [
    { id: 1, time: "14:31", itemId: "oil", qty: 0.02, reason: "Returned by customer", by: "Anitha M." },
    { id: 2, time: "14:31", itemId: "cur", qty: 0.05, reason: "Returned by customer", by: "Anitha M." },
    { id: 3, time: "14:31", itemId: "chk", qty: 0.35, reason: "Returned by customer", by: "Anitha M." },
    { id: 4, time: "11:20", itemId: "tom", qty: 1.5, reason: "Spoiled", by: "—" },
    { id: 5, time: "13:05", itemId: "chk", qty: 0.4, reason: "Over-prep", by: "—" },
    { id: 6, time: "15:40", itemId: "mlk", qty: 2, reason: "Curdled", by: "—" },
];

const WASTE_REASONS = ["Spoiled", "Over-prep", "Curdled", "Spilled", "Staff meal", "Returned by customer"];

const CHECKLIST = [
    "Unlogged waste / staff meals",
    "Over-portioning vs recipe weight",
    "Short delivery at receiving",
    "Unrecorded transfer or sub-recipe batch",
    "POS voids, discounts, mis-rung items",
    "Counting error — recount",
    "Pilferage if pattern repeats",
];

const SUMMARY = { theoretical: 29421, actual: 32015, unexplained: 2026, waste: 339 };

/* ---------- Helpers ---------- */
const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
const fix1 = (n) => n.toFixed(1);
const signed = (n) => (n >= 0 ? "+" : "−") + Math.abs(n).toFixed(1);

function deriveRow(item) {
    const actual = item.opening + item.purchase - item.closing;
    const variance = actual - item.theoretical - item.waste;
    const pct = item.theoretical > 0 ? (variance / item.theoretical) * 100 : 0;
    return {
        ...item,
        actual,
        variance,
        pct,
        value: variance * item.rate,
        flagged: Math.abs(pct) > item.tol,
    };
}

/* ---------- Component ---------- */
export default function Recon() {
    const [items, setItems] = useState(INITIAL_ITEMS);
    const [wasteLog, setWasteLog] = useState(INITIAL_WASTE_LOG);
    const [modal, setModal] = useState(null); // { itemId, qty } | null

    const rows = useMemo(() => items.map(deriveRow), [items]);
    const itemById = useMemo(() => Object.fromEntries(items.map((i) => [i.id, i])), [items]);

    const topReason = useMemo(() => {
        const totals = {};
        wasteLog.forEach((w) => {
            const rate = itemById[w.itemId]?.rate ?? 0;
            totals[w.reason] = (totals[w.reason] || 0) + w.qty * rate;
        });
        const [reason, value] = Object.entries(totals).sort((a, b) => b[1] - a[1])[0] || [];
        return reason ? `${reason} ${inr(value)}` : "—";
    }, [wasteLog, itemById]);

    const updateClosing = (id, value) => {
        const n = parseFloat(value);
        setItems((prev) =>
            prev.map((i) => (i.id === id ? { ...i, closing: Number.isNaN(n) ? 0 : n } : i))
        );
    };

    const submitWaste = ({ itemId, qty, reason }) => {
        const now = new Date();
        const entry = {
            id: Date.now(),
            time: now.toTimeString().slice(0, 5),
            itemId,
            qty,
            reason,
            by: "—",
        };
        setWasteLog((prev) => [entry, ...prev]);
        setItems((prev) =>
            prev.map((i) => (i.id === itemId ? { ...i, waste: i.waste + qty } : i))
        );
        setModal(null);
    };


    return (
        <section className="rw-panel">
            <header className="rw-head">
                <h2 className="rw-head__title">
                    <span aria-hidden="true">⚖️</span> Daily reconciliation &amp; waste
                    <span className="rw-head__badge">theoretical vs actual</span>
                </h2>
                <button type="button" className="rw-btn rw-btn--primary" onClick={() => setModal({ mode: "log" })}>
                    <Plus size={14} className="rw-btn__icon" />
                    Log waste
                </button>
            </header>

            <div className="rw-body">
                {/* Summary */}
                <div className="rw-stats">
                    <Stat label="Theoretical usage" value={inr(SUMMARY.theoretical)} />
                    <Stat label="Actual usage" value={inr(SUMMARY.actual)} tone="blue" />
                    <Stat label="Unexplained variance" value={inr(SUMMARY.unexplained)} tone="red" />
                    <Stat label="Waste logged" value={inr(SUMMARY.waste)} tone="amber" />
                </div>

                {/* Reconciliation table */}
                <div className="rw-tablewrap">
                    <table className="rw-table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th className="rw-num">Opening</th>
                                <th className="rw-num">+ Purchase</th>
                                <th className="rw-num">Closing count</th>
                                <th className="rw-num">Actual</th>
                                <th className="rw-num">Theoretical</th>
                                <th className="rw-num">Waste</th>
                                <th className="rw-num">Variance</th>
                                <th>Status</th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r) => (
                                <tr key={r.id}>
                                    <td>
                                        {r.name}
                                        <span className="rw-sub">
                                            {r.cat} · tol {r.tol}%
                                        </span>
                                    </td>
                                    <td className="rw-num rw-mono">{r.opening}</td>
                                    <td className="rw-num rw-mono">{r.purchase}</td>
                                    <td className="rw-num">
                                        <input
                                            className="rw-input"
                                            type="number"
                                            step="0.1"
                                            value={r.closing}
                                            onChange={(e) => updateClosing(r.id, e.target.value)}
                                            aria-label={`Closing count for ${r.name}`}
                                        />
                                    </td>
                                    <td className="rw-num rw-mono">{fix1(r.actual)}</td>
                                    <td className="rw-num rw-mono">{fix1(r.theoretical)}</td>
                                    <td className="rw-num rw-mono">{fix1(r.waste)}</td>
                                    <td className={`rw-num rw-mono ${r.flagged ? "rw-var--bad" : ""}`}>
                                        {signed(r.variance)} {r.unit}
                                        <span className="rw-sub">
                                            {fix1(Math.abs(r.pct))}% · {inr(Math.abs(r.value))}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`rw-pill ${r.flagged ? "rw-pill--bad" : "rw-pill--ok"}`}>
                                            {r.flagged ? "Investigate" : "Within tol."}
                                        </span>
                                    </td>
                                    <td>
                                        {r.flagged && (
                                            <button
                                                type="button"
                                                className="rw-btn rw-btn--ghost"
                                                onClick={() => setModal({ mode: "explain", itemId: r.id, qty: Number(Math.max(r.variance, 0).toFixed(1)) })}
                                            >
                                                Explain
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Lower grid */}
                <div className="rw-lower">
                    <div className="rw-card">
                        <div className="rw-card__head">
                            Waste log <span className="rw-muted">top reason: {topReason}</span>
                        </div>
                        <div className="rw-tablewrap rw-tablewrap--flat">
                            <table className="rw-table">
                                <thead>
                                    <tr>
                                        <th>Time</th>
                                        <th>Item</th>
                                        <th className="rw-num">Qty</th>
                                        <th>Reason</th>
                                        <th>By</th>
                                        <th className="rw-num">Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {wasteLog.map((w) => {
                                        const it = itemById[w.itemId];
                                        return (
                                            <tr key={w.id}>
                                                <td className="rw-mono">{w.time}</td>
                                                <td>{it?.name ?? w.itemId}</td>
                                                <td className="rw-num rw-mono">
                                                    {w.qty} {it?.unit}
                                                </td>
                                                <td>{w.reason}</td>
                                                <td>{w.by}</td>
                                                <td className="rw-num rw-mono">{inr(w.qty * (it?.rate ?? 0))}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="rw-card">
                        <div className="rw-card__head">Check in this order</div>
                        <ol className="rw-checklist">
                            {CHECKLIST.map((c) => (
                                <li key={c} className="rw-checklist__item">
                                    {c}
                                </li>
                            ))}
                        </ol>
                        <p className="rw-note">
                            Repeat variance on same item/shift escalates to owner automatically.
                        </p>
                    </div>
                </div>
            </div>
            {modal && (
                <WasteModal
                    items={items}
                    mode={modal.mode}
                    itemId={modal.itemId}
                    qty={modal.qty}
                    onClose={() => setModal(null)}
                    onSave={submitWaste}
                />
            )}
        </section>
    );
}

/* ---------- Sub-components ---------- */
function Stat({ label, value, tone }) {
    return (
        <div className={`rw-stat ${tone ? `rw-stat--${tone}` : ""}`}>
            <div className="rw-stat__label">{label}</div>
            <div className="rw-stat__value">{value}</div>
        </div>
    );
}


