import { useMemo, useState } from "react";
import "../../../assets/styles/procurement.css"
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";

const INITIAL_NEEDS = [
    { id: 1, item: "Seer Fish", stock: 0, suggested: 5, unit: "kg", vendor: "Kasimedu Fish Mkt", rate: 780 },
    { id: 2, item: "Chicken", stock: 22, suggested: 20, unit: "kg", vendor: "Fresh Poultry Co.", rate: 210 },
    { id: 3, item: "Paneer", stock: 7, suggested: 5, unit: "kg", vendor: "Aavin Dairy", rate: 340 },
    { id: 4, item: "Basmati Rice", stock: 38, suggested: 10, unit: "kg", vendor: "Sri Lakshmi Traders", rate: 118 },
    { id: 5, item: "Milk", stock: 25, suggested: 10, unit: "L", vendor: "Aavin Dairy", rate: 56 },
    { id: 6, item: "Tomato", stock: 9, suggested: 10, unit: "kg", vendor: "Koyambedu Market", rate: 42 },
];

const INITIAL_POS = [
    { no: 1824, vendor: "ABC Foods", amount: 48200 },
    { no: 1825, vendor: "Aavin Dairy", amount: 11060 },
    { no: 1826, vendor: "Sri Lakshmi Traders", amount: 10300 },
];

const WORKSPACES = [
    { key: "purchase", label: "Purchase" },
    { key: "vouchers", label: "Vouchers" },
];

const inr = (n) => "₹" + n.toLocaleString("en-IN");
const inr2 = (n) =>
    "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function CheckIcon() {
    return (
        <svg className="proc-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
        </svg>
    );
}

function StatusBadge({ status }) {
    const approved = status === "approved";
    return (
        <span className={`proc-status ${approved ? "proc-status--approved" : "proc-status--pending"}`}>
            {approved ? "Approved" : "Pending"}
        </span>
    );
}

function StatCard({ label, value, hint, accent }) {
    return (
        <div className={`proc-stat ${accent ? "proc-stat--accent" : ""}`}>
            <div className="proc-stat__label">{label}</div>
            <div className="proc-stat__value">{value}</div>
            <div className="proc-stat__hint">{hint}</div>
        </div>
    );
}

function Section({ title, aside, children }) {
    return (
        <section className="proc-section">
            <header className="proc-section__head">
                <span>{title}</span>
                {aside && <span className="proc-section__aside">{aside}</span>}
            </header>
            {children}
        </section>
    );
}

export default function Procurement() {
    const [needs, setNeeds] = useState(() => INITIAL_NEEDS.map((n) => ({ ...n, status: "pending" })));
    const [orders, setOrders] = useState(() => INITIAL_POS.map((o) => ({ ...o, status: "pending" })));
    const navigate = useNavigate()

    const suggestedTotal = useMemo(
        () => needs.reduce((sum, n) => sum + n.suggested * n.rate, 0),
        [needs]
    );
    const pendingOrders = useMemo(() => orders.filter((o) => o.status === "pending"), [orders]);
    const pendingTotal = useMemo(
        () => pendingOrders.reduce((sum, o) => sum + o.amount, 0),
        [pendingOrders]
    );
    const allNeedsApproved = needs.every((n) => n.status === "approved");

    // Only the status changes; rows stay in place.
    const approveAll = () =>
        setOrders((list) => {
            const nextNo = list.reduce((max, o) => Math.max(max, o.no), 0) + 1;
            return [
                ...list,
                {
                    no: nextNo,
                    vendor: "Recommended (multi-vendor)",
                    amount: suggestedTotal,
                    status: "approved",
                },
            ];
        });
    const approveOrder = (no) =>
        setOrders((list) => list.map((o) => (o.no === no ? { ...o, status: "approved" } : o)));

    return (
        <div className="proc-page">
            <div className="proc-page__header">
                <span className="proc-page__title">
                    06 Procurement
                    <span className="proc-badge">Procurement command centre</span>
                </span>
            </div>

            <div className="proc-page__body">
                <div className="proc-stats">
                    <StatCard
                        label="Suggested purchase"
                        value={inr(suggestedTotal)}
                        hint={`${needs.length} items`}
                    />
                    <StatCard
                        accent
                        label="Pending POs"
                        value={orders.length}
                        hint={`${inr(pendingTotal)} awaiting you`}
                    />
                    <StatCard label="Supplier shortage (avg)" value="4.7%" hint="ABC Foods · memory" />
                    <StatCard label="Forecast uplift" value="+7%" hint="drives quantities" />
                </div>

                <div className="proc-stack">
                    <Section title="✨ Ambient AI">
                        <div className="proc-row">
                            <span>
                                Procurement AI: demand forecast is 7% above normal, so quantities include a 20%
                                safety buffer.
                            </span>
                        </div>
                    </Section>

                    <Section
                        title="What do we need?"
                        aside="why: forecast demand − stock + 20% safety stock"
                    >
                        <div className="proc-table-wrap">
                            <table className="proc-table">
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th className="proc-table__num">Stock</th>
                                        <th className="proc-table__num">Suggested</th>
                                        <th>Vendor</th>
                                        <th className="proc-table__num">Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {needs.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="proc-table__empty">
                                                All suggested purchases approved.
                                            </td>
                                        </tr>
                                    )}
                                    {needs.map((n) => (
                                        <tr key={n.id}>
                                            <td>{n.item}</td>
                                            <td className="proc-table__num proc-mono">
                                                {n.stock} {n.unit}
                                            </td>
                                            <td className="proc-table__num proc-mono">
                                                <b>
                                                    {n.suggested} {n.unit}
                                                </b>
                                            </td>
                                            <td>{n.vendor}</td>
                                            <td className="proc-table__num proc-mono">{inr2(n.rate)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="proc-actions">
                            <button
                                type="button"
                                className="proc-btn proc-btn--primary"
                                onClick={approveAll}
                                disabled={allNeedsApproved}
                            >
                                <CheckIcon />
                                {allNeedsApproved ? "All approved" : `Approve all (${inr(suggestedTotal)})`}
                            </button>
                        </div>
                    </Section>

                    <Section title="PO approvals">
                        {orders.map((o) => (
                            <div className="proc-row" key={o.no}>
                                <span>
                                    <b>PO {o.no}</b> · {o.vendor} · {inr(o.amount)}
                                </span>
                                {o.status === "approved" ? (
                                    <StatusBadge status="approved" />
                                ) : (
                                    <button
                                        type="button"
                                        className="proc-btn proc-btn--small"
                                        onClick={() => approveOrder(o.no)}
                                    >
                                        <CheckIcon />
                                        Approve
                                    </button>
                                )}
                            </div>
                        ))}
                    </Section>

                    <Section title="Open workspace">
                        <div className="proc-links">
                            {WORKSPACES.map((w) => (
                                <button
                                    key={w.key}
                                    type="button"
                                    className="proc-btn proc-btn--small"
                                    onClick={() => navigate(`/back-office/${w.key}`)}
                                >
                                    <span>{w.label}</span>
                                    <Play size={12} aria-hidden="true" />
                                </button>
                            ))}
                        </div>
                    </Section>
                </div>
            </div>
        </div>
    );
}
