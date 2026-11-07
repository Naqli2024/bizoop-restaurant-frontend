import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../../assets/styles/finance.css"

const METRICS = [
    { id: "cash", label: "Expected cash", value: "₹22,450", hint: "counter" },
    { id: "variance", label: "Cash variance", value: "₹800", hint: "evening shift", accent: "red" },
    { id: "refunds", label: "Refunds & voids", value: "₹3,868", hint: "8 cases", accent: "amber" },
    { id: "profit", label: "Profit estimate", value: "₹36,135", hint: "after food, labour, 20% overhead" },
];

const WORKSPACES = [
    { id: "overview", label: "Overview", role: "back-office" },
    { id: "expenses", label: "Expenses", role: "back-office" },
    { id: "vouchers", label: "Vouchers", role: "back-office" },
    { id: "p&l", label: "P&L", role: "back-office" },
    { id: "day-end", label: "Day-end", role: "cashier" },
];


export default function Finance() {
    const navigate = useNavigate();
    return (
        <section className="finance-panel" id="p-dfin">
            <header className="finance-header">
                <h1 className="finance-title">
                    09 Finance
                    <span className="finance-badge">Cash, payments, expenses, P&amp;L</span>
                </h1>
            </header>

            <div className="finance-scroll">
                <div className="finance-metrics">
                    {METRICS.map((m) => (
                        <div
                            key={m.id}
                            className={`finance-metric${m.accent ? ` finance-metric--${m.accent}` : ""}`}
                        >
                            <div className="finance-metric__label">{m.label}</div>
                            <div className="finance-metric__value">{m.value}</div>
                            <div className="finance-metric__hint">{m.hint}</div>
                        </div>
                    ))}
                </div>

                <div className="finance-body">
                    <div className="finance-card">
                        <div className="finance-card__header">✨ Ambient AI</div>
                        <div className="finance-card__row">
                            <span>
                                Finance AI: cash variance has risen on three Fridays in a row (illustrative).
                            </span>
                        </div>
                    </div>

                    <div className="finance-card">
                        <div className="finance-card__header">Open workspace</div>
                        <div className="finance-actions">
                            {WORKSPACES.map((w) => (
                                <button
                                    key={w.id}
                                    type="button"
                                    className="finance-btn"
                                    onClick={() => navigate(`/${w.role}/${w.id}`)}
                                >
                                    <span>{w.label}</span>
                                    <Play size={12} aria-hidden="true" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
